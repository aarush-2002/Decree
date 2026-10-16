// ============================================================================
// POST /api/claims — Compute a Section 16 claim (auth required, validated).
//
// Fixes vs. the old /api/calculate-interest:
//  - Was completely UNAUTHENTICATED and wrote junk "Mock Client/Mock Buyer"
//    rows into production on every call. Now: auth-gated, validated, and it
//    performs NO writes (pure computation). Persistence happens only through
//    the explicit /api/invoices/confirm human-review flow.
//  - Used simple interest; now uses the shared compound-interest engine.
//  - Accepted an arbitrary client-supplied rbiRate; now resolves the rate
//    server-side from RbiRateHistory (client may NOT override the rate).
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireOrg, isErrorResponse } from '@/lib/authz';
import { computeClaim } from '@/lib/claimService';
import { parseAmount, parseDateField, parseEnumField, type FieldIssue } from '@/lib/validation';
import { ELIGIBLE_BUYER_TYPES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const authResult = await requireOrg();
  if (isErrorResponse(authResult)) return authResult.error;

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
  const principal = parseAmount(b.principal, 'principal', issues);
  const invoiceDate = parseDateField(b.invoiceDate, 'invoiceDate', issues);
  const deliveryDate = parseDateField(b.deliveryDate, 'deliveryDate', issues);
  const acceptanceDate =
    b.acceptanceDate == null ? null : parseDateField(b.acceptanceDate, 'acceptanceDate', issues);
  const buyerType = parseEnumField(b.buyerType, 'buyerType', ELIGIBLE_BUYER_TYPES, issues);

  let termDays: number | undefined;
  if (b.agreedPaymentTermDays != null) {
    const n = Number(b.agreedPaymentTermDays);
    if (!Number.isInteger(n) || n < 1 || n > 45) {
      issues.push({ field: 'agreedPaymentTermDays', message: 'Must be an integer between 1 and 45' });
    } else {
      termDays = n;
    }
  }

  if (
    issues.length > 0 ||
    principal == null ||
    invoiceDate == null ||
    deliveryDate == null ||
    buyerType == null
  ) {
    return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 });
  }

  try {
    const claim = await computeClaim({
      principal,
      invoiceDate,
      deliveryDate,
      acceptanceDate,
      buyerType,
      agreedPaymentTermDays: termDays,
    });

    return NextResponse.json({
      eligible: claim.eligibility.eligible,
      reasons: claim.eligibility.reasons,
      dueDate: claim.eligibility.dueDate.toISOString(),
      deemedAcceptanceDate: claim.eligibility.deemedAcceptanceDate.toISOString(),
      acceptanceWasDeemed: claim.eligibility.acceptanceWasDeemed,
      daysOverdue: claim.eligibility.daysOverdue,
      interest: claim.interest && {
        principal: claim.interest.principal,
        totalInterest: claim.interest.totalInterest,
        totalPayable: claim.interest.totalPayable,
        totalDays: claim.interest.totalDays,
        penalRatePercent: claim.interest.penalRatePercent,
        breakdown: claim.interest.breakdown,
        formulaNote: claim.interest.formulaNote,
      },
      rate: claim.rate,
      computedAt: claim.computedAt,
    });
  } catch (err) {
    console.error('[claims] computation failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Claim computation failed' },
      { status: 500 },
    );
  }
}
