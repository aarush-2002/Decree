/** Decorative "messy invoice" used in the hero and pinned flow. Static,
 *  real-looking data — never a gray placeholder box. */
export function InvoiceMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`inv-doc rotate-[-1.5deg] ${compact ? 'scale-90' : ''}`} aria-hidden="true">
      <div className="flex items-baseline justify-between">
        <p className="font-serif text-sm font-semibold">Sharma Steel Traders</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Tax Invoice</p>
      </div>
      <p className="mt-0.5 font-mono text-[10px] text-muted">GSTIN 27AABCU9603R1ZX · Inv #SST-2214</p>
      <div className="mt-3 space-y-0.5">
        <div className="inv-row"><span>Buyer</span><span className="inv-hl">Vikram Hydraulics Pvt Ltd</span></div>
        <div className="inv-row"><span>Date</span><span className="inv-hl">12 Jun 2026</span></div>
        <div className="inv-row"><span>Due</span><span className="inv-hl">27 Jul 2026</span></div>
        <div className="inv-row border-0"><span>Total</span><span className="inv-hl font-mono">₹4,50,000.00</span></div>
      </div>
      {!compact && (
        <p className="annotation mt-3 -rotate-1 text-xs">“payment held up again…”</p>
      )}
    </div>
  );
}
