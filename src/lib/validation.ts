// ============================================================================
// DECREE — Input validation (zero-dependency, server-side)
// Fixes: the old API routes trusted raw JSON bodies (parseFloat of anything,
// no bounds, no date checks). All routes now validate before touching Prisma.
// ============================================================================

export interface FieldIssue {
  field: string;
  message: string;
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function isValidDateString(s: unknown): s is string {
  if (typeof s !== 'string' || s.length === 0) return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
}

export function parseAmount(value: unknown, field: string, issues: FieldIssue[]): number | null {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  if (!Number.isFinite(n)) {
    issues.push({ field, message: `${field} must be a number` });
    return null;
  }
  if (n <= 0) {
    issues.push({ field, message: `${field} must be greater than zero` });
    return null;
  }
  // ₹1 crore cap per invoice keeps abuse cheap and matches realistic MSME invoices.
  if (n > 10_000_000) {
    issues.push({ field, message: `${field} exceeds the maximum supported invoice amount (₹1,00,00,000)` });
    return null;
  }
  return Math.round(n * 100) / 100;
}

export function parseDateField(value: unknown, field: string, issues: FieldIssue[]): Date | null {
  if (!isValidDateString(value)) {
    issues.push({ field, message: `${field} must be a valid ISO date string` });
    return null;
  }
  const d = new Date(value);
  // Reject absurd dates (before MSMED Act era or far future)
  if (d.getFullYear() < 1950 || d.getFullYear() > 2100) {
    issues.push({ field, message: `${field} is out of acceptable range` });
    return null;
  }
  return d;
}

export function parseStringField(
  value: unknown,
  field: string,
  issues: FieldIssue[],
  { max = 200, required = true }: { max?: number; required?: boolean } = {},
): string | null {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) {
    if (required) issues.push({ field, message: `${field} is required` });
    return null;
  }
  if (s.length > max) {
    issues.push({ field, message: `${field} must be at most ${max} characters` });
    return null;
  }
  return s;
}

export function parseEnumField<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
  issues: FieldIssue[],
): T | null {
  const s = typeof value === 'string' ? value.toLowerCase().trim() : '';
  if (!(allowed as readonly string[]).includes(s)) {
    issues.push({ field, message: `${field} must be one of: ${allowed.join(', ')}` });
    return null;
  }
  return s as T;
}

export function safeJson(body: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(body);
    return isObj(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
