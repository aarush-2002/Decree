// ============================================================================
// DECREE — Legal claim service (shared by API routes so calculation logic
// exists in exactly ONE place; previously it was duplicated across the
// upload page, calculator page, API route and PDF with drifting formulas).
// ============================================================================

import { calculateEligibility, calculatePenalInterest } from './rulesEngine';
import { resolveRbiBankRate } from './rates';
import type { InterestResult, EligibilityResult } from './rulesEngine';
import type { ResolvedRate } from './rates';

export interface ClaimInput {
  principal: number;
  invoiceDate: Date;
  deliveryDate: Date;
  acceptanceDate?: Date | null;
  buyerType: string;
  agreedPaymentTermDays?: number;
  /** Override for tests/awards; defaults to now. */
  asOf?: Date;
}

export interface ClaimResult {
  eligibility: EligibilityResult;
  interest: InterestResult | null; // null when not eligible
  rate: ResolvedRate;
  computedAt: string;
}

/**
 * Full statutory claim computation: eligibility gate → live rate resolution
 * → Section 16 compound interest. Deterministic and auditable end-to-end.
 */
export async function computeClaim(input: ClaimInput): Promise<ClaimResult> {
  const asOf = input.asOf ?? new Date();

  const eligibility = calculateEligibility({
    invoiceDate: input.invoiceDate,
    deliveryDate: input.deliveryDate,
    acceptanceDate: input.acceptanceDate ?? null,
    buyerType: input.buyerType,
    agreedPaymentTermDays: input.agreedPaymentTermDays,
    asOf,
  });

  if (!eligibility.eligible) {
    const rate = await resolveRbiBankRate(asOf);
    return { eligibility, interest: null, rate, computedAt: asOf.toISOString() };
  }

  const rate = await resolveRbiBankRate(asOf);
  const interest = calculatePenalInterest({
    principal: input.principal,
    startDate: eligibility.interestStartDate,
    endDate: asOf,
    rbiBankRatePercent: rate.bankRatePercent,
  });

  return { eligibility, interest, rate, computedAt: asOf.toISOString() };
}
