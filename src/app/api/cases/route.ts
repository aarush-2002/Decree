// ============================================================================
// GET /api/cases — Tenant-scoped case list (reimagined from route.js)
//
// Fixes vs. the old implementation:
//  - Old version fell back to `where = {}` (ALL invoices across ALL orgs)
//    whenever the DB user wasn't found → cross-tenant data leak. Now it
//    fails closed with 404 via requireOrg().
//  - Old version hardcoded `daysOverdue: 120` for every row. Now days and
//    interest are computed honestly from real due dates + live rates.
//  - Converted .js → .ts for type safety.
// ============================================================================

import { NextResponse } from 'next/server';
import { requireOrg, isErrorResponse } from '@/lib/authz';
import { prisma } from '@/lib/prisma';
import { resolveRbiBankRate } from '@/lib/rates';
import { calculatePenalInterest, calendarDaysBetween } from '@/lib/rulesEngine';
import { ACTIVE_CASE_STATES } from '@/lib/constants';

export async function GET() {
  const authResult = await requireOrg();
  if (isErrorResponse(authResult)) return authResult.error;
  const { ctx } = authResult;

  try {
    // STRICT tenant scope: only this organization's clients' invoices.
    const invoices = await prisma.invoice.findMany({
      where: { client: { managingOrgId: ctx.orgId } },
      include: { buyer: true, client: true, case: true },
      orderBy: { invoiceDate: 'desc' },
      take: 200, // bounded response — no unbounded table dumps
    });

    const rate = await resolveRbiBankRate();
    const today = new Date();

    const cases = invoices.map((inv) => {
      const daysOverdue = calendarDaysBetween(inv.dueDate, today);
      let interestAmount = 0;
      if (daysOverdue > 0) {
        try {
          interestAmount = calculatePenalInterest({
            principal: Number(inv.amount),
            startDate: inv.dueDate,
            endDate: today,
            rbiBankRatePercent: rate.bankRatePercent,
          }).totalInterest;
        } catch {
          interestAmount = 0; // ineligible/nonsensical dates → show principal only
        }
      }

      return {
        id: inv.case?.id ?? inv.id, // stable internal id for detail routes
        invoiceNumber: inv.invoiceNumber,
        client: inv.client?.name ?? 'Unknown Client',
        buyer: inv.buyer?.name ?? 'Unknown Buyer',
        amount: Number(inv.amount),
        accruedInterest: interestAmount,
        totalClaim: Number(inv.amount) + interestAmount,
        status: inv.case?.state ?? inv.status,
        isActive: ACTIVE_CASE_STATES.includes(inv.case?.state as never),
        daysOverdue,
        dueDate: inv.dueDate.toISOString(),
      };
    });

    return NextResponse.json({
      cases,
      rate,
      generatedAt: today.toISOString(),
    });
  } catch (error) {
    console.error('[cases] Failed to fetch cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}
