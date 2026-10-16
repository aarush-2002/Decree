import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pb-24 pt-36">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">About</p>
        <h1 className="mt-4 font-serif text-5xl text-ink" style={{ fontWeight: 500 }}>We build paperwork for people who’d rather build things.</h1>
        <div className="reveal mt-8 space-y-5 text-[16px] leading-relaxed text-muted">
          <p>
            Four out of five Indian MSMEs wait more than 45 days for payment. The law is on their side —
            Section 16 of the MSMED Act guarantees interest at three times the RBI bank rate — but the
            paperwork to claim it is scattered across court formats, rate tables and legal jargon.
          </p>
          <p>
            DECREE closes that gap. You upload an invoice; we extract what matters, compute the exact
            statutory interest with deterministic math, and assemble a filing packet formatted for the
            MSME Facilitation Council. No retainer, no jargon, no black boxes.
          </p>
          <p className="annotation text-lg">Every rupee of interest is already yours. We just write it down properly.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
