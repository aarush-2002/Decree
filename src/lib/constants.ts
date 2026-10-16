// ============================================================================
// DECREE — Single source of truth for all legal constants (MSMED Act, 2006)
// Every page, API route and PDF MUST import from here. Never hardcode rates.
// ============================================================================

/**
 * MSMED Act Section 2(h) / Section 16:
 * Penal interest = 3x the RBI "bank rate" (as referred to in the Act),
 * compounded annually on restated dues.
 */
export const MSMED_PENAL_MULTIPLIER = 3;

/**
 * Fallback RBI bank rate (% p.a.) used ONLY when no live rate is available
 * from the RbiRateHistory table or an upstream fetch. This must never be
 * presented to the user as "current" without a source + as-of date.
 * Update via `npm run sync-rates` (see scripts/sync-rbi-rate.mjs).
 */
export const FALLBACK_RBI_BANK_RATE_PERCENT = 5.75;

/** MSMED Act Section 15: buyer must pay within 45 days of acceptance (per contract, max 45). */
export const MSMED_MAX_PAYMENT_TERM_DAYS = 45;

/** MSMED Act Section 2(b): deemed acceptance if not explicitly accepted within 30 days of delivery. */
export const MSMED_DEEMED_ACCEPTANCE_DAYS = 30;

/** Days in a year used for statutory interest proration. */
export const DAYS_PER_YEAR = 365;

/** Buyer entity types that qualify as "buyers" under the Act for our product scope. */
export const ELIGIBLE_BUYER_TYPES = ['private', 'psu', 'govt'] as const;
export type EligibleBuyerType = (typeof ELIGIBLE_BUYER_TYPES)[number];

/** Case state machine (single lifecycle shared by DB, UI badges and packets). */
export const CASE_STATES = [
  'draft',            // invoice parsed, awaiting human review
  'awaiting_review',  // extraction needs human confirmation (HITL gate)
  'confirmed',        // verified by user, ready to compute claim
  'demand_sent',      // demand notice issued to buyer
  'filed',            // application filed before MSME-FAC (Section 18)
  'under_proceedings',// council admitted the matter
  'awarded',          // award / settlement recorded
  'recovered',        // dues realised
  'rejected',         // ineligible or withdrawn
] as const;
export type CaseState = (typeof CASE_STATES)[number];

/** Which states count as "active" on the dashboard. */
export const ACTIVE_CASE_STATES: CaseState[] = [
  'confirmed',
  'demand_sent',
  'filed',
  'under_proceedings',
];

/** Invoice processing status (extraction pipeline). */
export const INVOICE_STATUSES = ['pending_review', 'confirmed', 'rejected'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

/** Upload/extraction status for documents. */
export const DOCUMENT_STATUSES = {
  upload: ['uploaded', 'failed'] as const,
  extraction: ['not_started', 'processing', 'needs_review', 'completed', 'failed'] as const,
};
