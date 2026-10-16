// ============================================================================
// DECREE — Rate service (fixes: hardcoded 6.5% duplicated in 4 files, stale,
// with an orphaned RbiRateHistory table nobody read).
//
// Resolution order:
//   1. Latest row in RbiRateHistory effective on/before "asOf" (DB = truth)
//   2. FALLBACK_RBI_BANK_RATE_PERCENT from constants.ts (single place)
// Every consumer gets the rate AND its provenance so UI can show "as of".
// ============================================================================

import { prisma } from './prisma';
import { FALLBACK_RBI_BANK_RATE_PERCENT } from './constants';

export interface ResolvedRate {
  bankRatePercent: number;
  effectiveFrom: string | null; // ISO date, or null when fallback used
  source: 'database' | 'fallback_constant';
}

/** Read Prisma Decimal-safe (works whether driver returns Decimal or number). */
function toNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : NaN;
}

export async function resolveRbiBankRate(asOf: Date = new Date()): Promise<ResolvedRate> {
  if (prisma) {
    try {
      const row = await prisma.rbiRateHistory.findFirst({
        where: { effectiveFrom: { lte: asOf } },
        orderBy: { effectiveFrom: 'desc' },
      });
      if (row) {
        const pct = toNumber(row.bankRatePercent);
        if (Number.isFinite(pct) && pct > 0) {
          return {
            bankRatePercent: pct,
            effectiveFrom: row.effectiveFrom.toISOString(),
            source: 'database',
          };
        }
      }
    } catch (err) {
      console.error('[rates] DB lookup failed, using fallback constant:', err);
    }
  }

  return {
    bankRatePercent: FALLBACK_RBI_BANK_RATE_PERCENT,
    effectiveFrom: null,
    source: 'fallback_constant',
  };
}
