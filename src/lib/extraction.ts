// ============================================================================
// DECREE — Honest document parsing (replaces the fake "AI extraction")
//
// Previous flaw: upload/page.tsx "extracted" invoice data by regexing the
// FILENAME after two setTimeout() calls, then labelled it `extractedByAi: true`
// in the database. That was theatre, and worse, it silently fabricated data.
//
// Reimagined approach (deterministic + transparent):
//  1. If the browser can read text from the file (TXT/CSV or PDF text layer via
//     pdf.js in the client), we run labeled-field regexes over the REAL text.
//  2. Anything we cannot confidently parse is left BLANK and flagged for the
//     mandatory human-in-the-loop review step. The user always confirms or
//     corrects before anything is saved.
//  3. Every field carries a confidence score; nothing is ever invented.
// ============================================================================

export interface ParsedField<T = string> {
  value: T | null;
  confidence: number; // 0..1
  source: 'document-text' | 'filename-hint' | 'manual';
}

export interface ParsedInvoiceDraft {
  invoiceNumber: ParsedField;
  buyerName: ParsedField;
  amount: ParsedField<number>;
  invoiceDate: ParsedField<string>;   // ISO yyyy-mm-dd
  deliveryDate: ParsedField<string>;  // ISO yyyy-mm-dd
  /** Overall extraction quality; < 0.6 means "review everything". */
  overallConfidence: number;
  /** True when we got real text out of the document. */
  hasDocumentText: boolean;
  warnings: string[];
}

const emptyField = <T>(source: ParsedField['source'] = 'manual'): ParsedField<T> => ({
  value: null,
  confidence: 0,
  source,
});

/** Normalise Indian ("1,23,456.75") or plain ("123456.75") money strings. */
export function parseIndianAmount(raw: string): number | null {
  const cleaned = raw.replace(/[, ]/g, '').replace(/[₹]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

/** Parse common invoice date formats into ISO yyyy-mm-dd (or null). */
export function parseInvoiceDate(raw: string): string | null {
  // dd/mm/yyyy or dd-mm-yyyy (Indian convention)
  let m = raw.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
  if (m) {
    const [, d, mo, y] = m;
    const day = parseInt(d, 10), mon = parseInt(mo, 10);
    // Reject impossible dates like 32/13/2026
    if (day >= 1 && day <= 31 && mon >= 1 && mon <= 12) {
      return `${y}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return null;
  }
  // yyyy-mm-dd
  m = raw.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (m) return m[0];
  return null;
}

/**
 * Run labeled-field extraction over ACTUAL document text.
 * Never fabricates: unmatched fields stay null with confidence 0.
 */
export function extractFromText(text: string): ParsedInvoiceDraft {
  const warnings: string[] = [];

  const findLabeled = (labelPattern: RegExp): { value: string; idx: number } | null => {
    const m = text.match(labelPattern);
    return m && m.index != null ? { value: (m[1] ?? '').trim(), idx: m.index } : null;
  };

  // --- Invoice number
  const invRaw = findLabeled(
    /(?:invoice\s*(?:no|number|#)|inv\s*(?:no|number|#)|bill\s*(?:no|number))\s*[:\-]?\s*([A-Za-z0-9][A-Za-z0-9\-\/]{2,30})/i,
  );
  const invoiceNumber: ParsedField = invRaw
    ? { value: invRaw.value, confidence: 0.9, source: 'document-text' }
    : emptyField();

  // --- Amount (prefer explicit total lines)
  const amtRaw =
    findLabeled(/(?:total\s*(?:amount|payable)?|amount\s*(?:due|payable)|grand\s*total)\s*[:\-]?\s*(?:rs\.?|inr\.?|₹)?\s*([\d,]+\.?\d{0,2})/i) ??
    findLabeled(/(?:rs\.?|inr\.?|₹)\s*([\d,]+\.\d{2})/i);
  const amountVal = amtRaw ? parseIndianAmount(amtRaw.value) : null;
  const amount: ParsedField<number> = amountVal != null
    ? { value: amountVal, confidence: 0.85, source: 'document-text' }
    : emptyField<number>();

  // --- Dates: first labeled "invoice date", last plausible date as delivery heuristic
  const dateMatches = [...text.matchAll(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/g)].map((m) => m[0]);
  const invDateLabel = findLabeled(/invoice\s*date\s*[:\-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i);
  const delivDateLabel = findLabeled(/(?:delivery|dispatch|supply|service)\s*date\s*[:\-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i);
  const invoiceDate: ParsedField<string> = (() => {
    const iso = invDateLabel ? parseInvoiceDate(invDateLabel.value) : parseInvoiceDate(dateMatches[0] ?? '');
    return iso ? { value: iso, confidence: invDateLabel ? 0.9 : 0.5, source: 'document-text' } : emptyField<string>();
  })();
  const deliveryDate: ParsedField<string> = (() => {
    const iso = delivDateLabel ? parseInvoiceDate(delivDateLabel.value) : null;
    return iso ? { value: iso, confidence: 0.85, source: 'document-text' } : emptyField<string>();
  })();

  // --- Buyer name (labeled "Bill To"/"Customer")
  const buyerRaw = findLabeled(/(?:bill\s*to|buyer|customer|billed\s*to)\s*[:\-]?\s*([A-Za-z][A-Za-z0-9&.,\s'-]{2,60}?)(?:\n|gst|gstin|address)/i)
    ?? findLabeled(/(?:bill\s*to|buyer|customer)\s*[:\-]?\s*([A-Za-z][A-Za-z0-9&.,\s'-]{2,60})/i);
  const buyerName: ParsedField = buyerRaw
    ? { value: buyerRaw.value.split('\n')[0].trim(), confidence: 0.7, source: 'document-text' }
    : emptyField();

  const fields = [invoiceNumber, amount, invoiceDate, buyerName];
  const overall = fields.reduce((s, f) => s + f.confidence, 0) / fields.length;

  if (!amount.value) warnings.push('Could not find a total amount in the document text.');
  if (!invoiceNumber.value) warnings.push('Could not find an invoice number in the document text.');
  if (!invoiceDate.value) warnings.push('Could not find an invoice date in the document text.');
  if (!deliveryDate.value) warnings.push('Delivery/dispatch date not found — you will enter it during review.');

  return {
    invoiceNumber,
    buyerName,
    amount,
    invoiceDate,
    deliveryDate,
    overallConfidence: Math.round(overall * 100) / 100,
    hasDocumentText: text.trim().length > 20,
    warnings,
  };
}

/**
 * Extract text that the browser can already access WITHOUT shipping a PDF
 * parser dependency: plain text/CSV files decode directly. For PDFs, the
 * caller may pass text obtained from pdf.js; if unavailable we return ''
 * and the UI falls back to fully-manual review (still honest).
 */
export async function readTextFromFile(file: File): Promise<string> {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type.startsWith('text/') || /\.(txt|csv|md)$/.test(name)) {
    try {
      return await file.text();
    } catch {
      return '';
    }
  }
  // PDF/image: no reliable in-browser text without a heavy parser.
  // Be honest: return empty, force manual review path.
  return '';
}

export function freshDraft(): ParsedInvoiceDraft {
  return {
    invoiceNumber: emptyField(),
    buyerName: emptyField(),
    amount: emptyField<number>(),
    invoiceDate: emptyField<string>(),
    deliveryDate: emptyField<string>(),
    overallConfidence: 0,
    hasDocumentText: false,
    warnings: ['No document text available — please fill in all fields manually.'],
  };
}
