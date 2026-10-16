// ============================================================================
// GET /api/rates — Public, read-only RBI bank rate feed.
// Fixes: orphaned RbiRateHistory table + stale hardcoded 6.5 everywhere.
// UI now fetches the real current rate + provenance instead of hardcoding.
// ============================================================================

import { NextResponse } from 'next/server';
import { resolveRbiBankRate } from '@/lib/rates';
import { prisma } from '@/lib/prisma';
import { MSMED_PENAL_MULTIPLIER } from '@/lib/constants';

export async function GET() {
  const rate = await resolveRbiBankRate();

  let history: { effectiveFrom: string; bankRatePercent: number; source: string }[] = [];
  if (prisma) {
    try {
      const rows = await prisma.rbiRateHistory.findMany({
        orderBy: { effectiveFrom: 'desc' },
        take: 12,
      });
      history = rows.map((r: any) => ({
        effectiveFrom: r.effectiveFrom.toISOString(),
        bankRatePercent: Number(r.bankRatePercent),
        source: r.source,
      }));
    } catch {
      history = []; // non-fatal: current rate still resolves via fallback
    }
  }

  return NextResponse.json({
    current: rate,
    penalRatePercent: rate.bankRatePercent * MSMED_PENAL_MULTIPLIER,
    multiplier: MSMED_PENAL_MULTIPLIER,
    history,
  });
}
