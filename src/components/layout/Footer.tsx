import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 text-primary" aria-label="DECREE home">
            <Scale size={18} strokeWidth={1.5} />
            <span className="font-serif text-lg font-semibold tracking-[0.14em]">DECREE</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Interest claims under Section 16 of the MSMED Act, 2006 — calculated with
            deterministic math, reviewed by you, ready to file.
          </p>
        </div>
        <nav aria-label="Company" className="space-y-3 text-sm">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">Company</p>
          <Link href="/about" className="link-draw block text-muted hover:text-ink">About</Link>
          <Link href="/privacy" className="link-draw block text-muted hover:text-ink">Privacy</Link>
          <Link href="/terms" className="link-draw block text-muted hover:text-ink">Terms</Link>
        </nav>
        <nav aria-label="Product" className="space-y-3 text-sm">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">Product</p>
          <Link href="/#how" className="link-draw block text-muted hover:text-ink">How it Works</Link>
          <Link href="/dashboard" className="link-draw block text-muted hover:text-ink">Dashboard</Link>
          <Link href="/upload" className="link-draw block text-muted hover:text-ink">New case</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-[1200px] space-y-3 border-t border-line px-6 py-6">
        <p className="max-w-3xl text-xs leading-relaxed text-muted">
          <strong className="font-medium text-ink">Not legal advice.</strong>{' '}
          DECREE provides calculation and document-preparation assistance. It is not a law
          firm and does not provide legal advice or representation. Rates are sourced from RBI
          publications with as-of dates; verify figures with a qualified advocate before filing.
        </p>
        <p className="font-mono text-xs text-faint">© {new Date().getFullYear()} DECREE Labs Pvt. Ltd. · Bengaluru, India</p>
      </div>
    </footer>
  );
}
