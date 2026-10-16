// ============================================================================
// DECREE — Deterministic legal rules engine (MSMED Act, 2006 — Section 15/16)
//
// REIMAGINED FIXES over the previous version:
//  1. COMPOUND interest (statute says "compound interest with annual resting"
//     at 3x bank rate). The old code used SIMPLE interest — legally wrong and
//     contradicted our own README/dashboard copy.
//  2. No float rounding surprises: every reported figure passes through
//     roundCurrency() which is epsilon-corrected.
//  3. No mutation of input dates; timezone-safe calendar day counting
//     (UTC-midnight anchors instead of raw millisecond division).
//  4. Correct deemed-acceptance rule (Sec 2(b)): explicit acceptance always
//     wins; otherwise deemed 30 days after delivery.
//  5. All constants come from src/lib/constants.ts — nothing hardcoded here.
//  6. Eligibility returns WHY, not just whether — the UI shows reasons.
// ============================================================================

import {
  MSMED_PENAL_MULTIPLIER,
  MSMED_MAX_PAYMENT_TERM_DAYS,
  MSMED_DEEMED_ACCEPTANCE_DAYS,
  DAYS_PER_YEAR,
  ELIGIBLE_BUYER_TYPES,
} from './constants';

export interface InterestBreakdownPeriod {
  /** Year-boundary index (1 = first year of delay, etc.) */
  periodNumber: number;
  start: Date;
  end: Date;
  daysInPeriod: number;
  /** Principal + previously rested interest at start of this period */
  openingBalance: number;
  /** Interest accrued during this period */
  interestForPeriod: number;
  /** Balance at close of this period */
  closingBalance: number;
}

export interface InterestResult {
  principal: number;
  penalRatePercent: number;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalInterest: number;
  totalPayable: number;
  /** Period-by-period audit trail — critical for legal defensibility */
  breakdown: InterestBreakdownPeriod[];
  formulaNote: string;
}

/** Round to 2 decimal places, epsilon-corrected to avoid float drift. */
export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Whole calendar days between two dates, timezone-safe (UTC midnight anchors). */
export function calendarDaysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

/** Add N days to a date WITHOUT mutating it. */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * MSMED Section 16 — compound interest at 3x RBI bank rate, annually rested.
 *
 * We accrue daily interest on the current balance and REST (add to principal)
 * at every 365-day boundary — the standard "annual resting" method used by
 * recovering authorities. A partial final year accrues pro-rata.
 */
export function calculatePenalInterest(opts: {
  principal: number;
  startDate: Date; // day interest starts accruing (day after due date)
  endDate: Date;   // typically today, or award date
  rbiBankRatePercent: number;
}): InterestResult {
  const { principal, startDate, endDate, rbiBankRatePercent } = opts;

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error('Principal must be a positive number');
  }
  if (
    !(startDate instanceof Date) ||
    !(endDate instanceof Date) ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    throw new Error('startDate and endDate must be valid Date objects');
  }
  if (endDate < startDate) {
    throw new Error('endDate cannot precede startDate');
  }
  if (!Number.isFinite(rbiBankRatePercent) || rbiBankRatePercent <= 0) {
    throw new Error('RBI bank rate must be a positive percentage');
  }

  const penalRatePercent = rbiBankRatePercent * MSMED_PENAL_MULTIPLIER;
  const dailyRate = penalRatePercent / 100 / DAYS_PER_YEAR;

  const totalDays = calendarDaysBetween(startDate, endDate);
  const breakdown: InterestBreakdownPeriod[] = [];

  let balance = principal;
  let cursor = startDate;
  let remaining = totalDays;
  let periodNumber = 1;
  let totalInterest = 0;

  while (remaining > 0) {
    const daysInPeriod = Math.min(DAYS_PER_YEAR, remaining);
    const interestForPeriod = balance * dailyRate * daysInPeriod;
    const closing = balance + interestForPeriod;

    breakdown.push({
      periodNumber,
      start: cursor,
      end: addDays(cursor, daysInPeriod),
      daysInPeriod,
      openingBalance: roundCurrency(balance),
      interestForPeriod: roundCurrency(interestForPeriod),
      closingBalance: roundCurrency(closing),
    });

    totalInterest += interestForPeriod;
    balance = closing;
    cursor = addDays(cursor, daysInPeriod);
    remaining -= daysInPeriod;
    periodNumber += 1;
  }

  return {
    principal: roundCurrency(principal),
    penalRatePercent,
    startDate,
    endDate,
    totalDays,
    totalInterest: roundCurrency(totalInterest),
    totalPayable: roundCurrency(principal + totalInterest),
    breakdown,
    formulaNote:
      `Section 16, MSMED Act 2006: compound interest @ ${penalRatePercent}% p.a. ` +
      `(${MSMED_PENAL_MULTIPLIER}× RBI bank rate of ${rbiBankRatePercent}%), ` +
      `accrued daily and compounded annually (annual resting).`,
  };
}

export interface EligibilityInput {
  invoiceDate: Date;
  deliveryDate: Date;
  /** Explicit acceptance/rejection communication date, if any. Null → deemed. */
  acceptanceDate: Date | null;
  buyerType: string;
  /** Optional contractual payment term ≤ 45 days (defaults to statutory max). */
  agreedPaymentTermDays?: number;
  /** Evaluation "today" — injectable for tests. */
  asOf?: Date;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  dueDate: Date;
  deemedAcceptanceDate: Date;
  acceptanceWasDeemed: boolean;
  daysOverdue: number;
  interestStartDate: Date;
}

/**
 * Sections 2(b), 15 & 16 eligibility gate.
 * Returns WHY (not just whether) — the UI shows the reasons to build trust.
 */
export function calculateEligibility(input: EligibilityInput): EligibilityResult {
  const {
    invoiceDate,
    deliveryDate,
    acceptanceDate,
    buyerType,
    agreedPaymentTermDays,
    asOf = new Date(),
  } = input;

  const reasons: string[] = [];

  // --- Deemed acceptance (Sec 2(b)): 30 days after delivery unless explicitly accepted
  const acceptanceWasDeemed = acceptanceDate == null;
  const effectiveAcceptanceDate = acceptanceWasDeemed
    ? addDays(deliveryDate, MSMED_DEEMED_ACCEPTANCE_DAYS)
    : new Date(acceptanceDate as Date);

  // --- Payment due date (Sec 15): within agreed term, capped at 45 days
  const rawTerm = agreedPaymentTermDays ?? MSMED_MAX_PAYMENT_TERM_DAYS;
  const termDays = Math.min(Math.max(1, Math.floor(rawTerm)), MSMED_MAX_PAYMENT_TERM_DAYS);
  const dueDate = addDays(effectiveAcceptanceDate, termDays);

  const interestStartDate = addDays(dueDate, 1);
  const daysOverdue = calendarDaysBetween(dueDate, asOf);

  // --- Buyer type gate
  const normalizedBuyer = (buyerType ?? '').toLowerCase().trim();
  const isEligibleBuyer = (ELIGIBLE_BUYER_TYPES as readonly string[]).includes(normalizedBuyer);
  if (!isEligibleBuyer) {
    reasons.push(`Buyer type "${buyerType}" is not a covered entity under the Act.`);
  }

  // --- Overdue gate
  if (daysOverdue <= 0) {
    reasons.push('The statutory due date has not yet passed; no interest has accrued.');
  }

  // --- Sanity gates
  if (deliveryDate < invoiceDate) {
    reasons.push('Delivery date precedes invoice date — please verify the documents.');
  }
  if (asOf < invoiceDate) {
    reasons.push('Evaluation date precedes the invoice date — impossible timeline.');
  }

  const eligible = isEligibleBuyer && daysOverdue > 0 && reasons.length === 0;

  return {
    eligible,
    reasons: eligible ? ['Invoice is overdue against a covered buyer.'] : reasons,
    dueDate,
    deemedAcceptanceDate: effectiveAcceptanceDate,
    acceptanceWasDeemed,
    daysOverdue: Math.max(0, daysOverdue),
    interestStartDate,
  };
}
