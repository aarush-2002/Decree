import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware class merge — used by every UI primitive below. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// DECREE — Formatting utilities (Indian conventions)
// Currency uses lakh/crore grouping via Intl 'en-IN'. Tabular figures in CSS.
// ============================================================================

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inr0 = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** ₹5,32,191.78 — paise included (claims need exact money). */
export function formatINR(amount: number): string {
  return inr.format(amount);
}

/** ₹5,32,192 — rounded, for stats strips / dashboards. */
export function formatINR0(amount: number): string {
  return inr0.format(amount);
}

/** Plain grouped number: 5,32,191.78 (for count-up frames without symbol jitter). */
export function formatGrouped(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/** 14 Feb 2026 — unambiguous for legal documents. */
export function formatDate(d: Date | string): string {
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dt.getTime())) return '—';
  return dateFmt.format(dt);
}

/** Days with unit: "92 days". */
export function formatDays(n: number): string {
  return `${n} ${n === 1 ? 'day' : 'days'}`;
}

/** Percent with at most 2 decimals: 19.5% / 5.75%. */
export function formatPercent(n: number): string {
  return `${Number(n.toFixed(2))}%`;
}
