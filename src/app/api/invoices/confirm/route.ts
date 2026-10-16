// ============================================================================
// POST /api/invoices/confirm — The ONLY place an invoice is persisted.
//
// Reimagined HITL (human-in-the-loop) gate: the upload page parses a draft,
// a human reviews/corrects it, and only this confirmed payload is written to
// the DB — inside a transaction that also creates the Case + audit trail.
// Fixes: unauthenticated writes, fabricated "Mock" rows, no dedupe, no audit.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireOrg, isErrorResponse } from '@/lib/authz';
import { prisma } from '@/lib/prisma';
import { computeClaim } from '@/lib/claimService';
import {
  parseAmount,
  parseDateField,
  parseStringField,
  parseEnumField,
  type FieldIssue,
} from '@/lib/validation';
import { ELIGIBLE_BUYER_TYPES } from '@/lib/constants';
import { addDays } from '@/lib/rulesEngine';

export async function POST(request: NextRequest) {
  const authResult = await requireOrg();
  if (isErrorResponse(authResult)) return authResult.error;
  const { ctx } = authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const issues: FieldIssue[] = [];
  const clientName = parseStringField(b.clientName, 'clientName', issues, { max: 120 });
  const buyerName = parseStringField(b.buyerName, 'buyerName', issues, { max: 120 });
  const buyerType = parseEnumField(b.buyerType, 'buyerType', ELIGIBLE_BUYER_TYPES, issues);
  const invoiceNumber = parseStringField(b.invoiceNumber, 'invoiceNumber', issues, { max: 60 });
  const amount = parseAmount(b.amount, 'amount', issues);
  const invoiceDate = parseDateField(b.invoiceDate, 'invoiceDate', issues);
  const deliveryDate = parseDateField(b.deliveryDate, 'deliveryDate', issues);
  const acceptanceDate =
    b.acceptanceDate == null ? null : parseDateField(b.acceptanceDate, 'acceptanceDate', issues);
  // Optional evidence link coming from UploadThing's onUploadComplete
  const documentUrl = parseStringField(b.documentUrl, 'documentUrl', issues, {
    max: 500,
    required: false,
  });
  const extractionConfidence =
    b.extractionConfidence == null
      ? null
      : (() => {
          const n = Number(b.extractionConfidence);
          if (!Number.isFinite(n) || n < 0 || n > 1) {
            issues.push({ field: 'extractionConfidence', message: 'Must be between 0 and 1' });
            return null;
          }
          return n;
        })();

  if (
    issues.length > 0 ||
    !clientName ||
    !buyerName ||
    !buyerType ||
    !invoiceNumber ||
    amount == null ||
    !invoiceDate ||
    !deliveryDate
  ) {
    return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 });
  }

  if (deliveryDate < invoiceDate) {
    return NextResponse.json(
      { error: 'Validation failed', issues: [{ field: 'deliveryDate', message: 'Delivery date cannot precede invoice date' }] },
      { status: 422 },
    );
  }

  try {
    // Statutory computation first — reject ineligible invoices explicitly.
    const claim = await computeClaim({
      principal: amount,
      invoiceDate,
      deliveryDate,
      acceptanceDate,
      buyerType,
    });

    if (!claim.eligibility.eligible) {
      return NextResponse.json(
        { error: 'Invoice not eligible for a Section 16 claim yet', reasons: claim.eligibility.reasons },
        { status: 422 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Upsert tenant-scoped client (fixes duplicate-client sprawl).
      const client = await tx.client.upsert({
        where: { managingOrgId_name: { managingOrgId: ctx.orgId, name: clientName } },
        update: {},
        create: { managingOrgId: ctx.orgId, name: clientName },
      });

      // Dedupe buyers by exact name (simple strategy; GSTIN matching later).
      const existingBuyer = await tx.buyer.findFirst({ where: { name: buyerName } });
      const buyer =
        existingBuyer ??
        (await tx.buyer.create({ data: { name: buyerName, entityType: buyerType } }));

      // Duplicate-claim guard: same client + invoice number already known?
      const dupe = await tx.invoice.findUnique({
        where: { clientId_invoiceNumber: { clientId: client.id, invoiceNumber } },
      });
      if (dupe) {
        throw new Error(`DUPLICATE_INVOICE:${dupe.id}`);
      }

      const invoice = await tx.invoice.create({
        data: {
          clientId: client.id,
          buyerId: buyer.id,
          invoiceNumber,
          invoiceDate,
          deliveryDate,
          deemedAcceptanceDate: claim.eligibility.deemedAcceptanceDate,
          dueDate: claim.eligibility.dueDate,
          amount,
          status: 'confirmed',
          extractedByAi: (extractionConfidence ?? 0) >= 0.6,
          extractionConfidence,
        },
      });

      if (documentUrl) {
        await tx.document.create({
          data: {
            invoiceId: invoice.id,
            orgId: ctx.orgId,
            fileUrl: documentUrl,
            fileName: String(b.documentFileName ?? 'document'),
            fileType: String(b.documentFileType ?? 'pdf'),
            extractionStatus: extractionConfidence != null && extractionConfidence >= 0.6 ? 'completed' : 'needs_review',
          },
        });
      }

      const caseRow = await tx.case.create({
        data: {
          orgId: ctx.orgId,
          invoiceId: invoice.id,
          createdById: ctx.userId,
          state: 'confirmed',
          principalAmount: amount,
          interestAccrued: claim.interest?.totalInterest ?? 0,
          rbiRateUsedPct: claim.rate.bankRatePercent,
          currentDeadlineAt: addDays(new Date(), 30), // next action deadline
        },
      });

      await tx.caseEvent.create({
        data: { caseId: caseRow.id, fromState: null, toState: 'confirmed', note: 'Invoice confirmed via human review' },
      });

      await tx.auditEvent.create({
        data: {
          orgId: ctx.orgId,
          userId: ctx.userId,
          action: 'invoice.confirmed',
          entity: 'invoice',
          entityId: invoice.id,
          detail: { invoiceNumber, amount, rate: claim.rate },
        },
      });

      return { invoiceId: invoice.id, caseId: caseRow.id };
    });

    return NextResponse.json({
      ok: true,
      invoiceId: result.invoiceId,
      caseId: result.caseId,
      dueDate: claim.eligibility.dueDate.toISOString(),
      daysOverdue: claim.eligibility.daysOverdue,
      interest: claim.interest?.totalInterest ?? 0,
      totalClaim: claim.interest?.totalPayable ?? amount,
      rate: claim.rate,
    }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('DUPLICATE_INVOICE:')) {
      return NextResponse.json(
        { error: 'This invoice number already exists for this client', existingInvoiceId: err.message.split(':')[1] },
        { status: 409 },
      );
    }
    console.error('[invoices/confirm] failed:', err);
    return NextResponse.json({ error: 'Failed to confirm invoice' }, { status: 500 });
  }
}
