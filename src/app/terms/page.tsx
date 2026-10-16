import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pb-24 pt-36">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">Terms</p>
        <h1 className="mt-4 font-serif text-5xl text-ink" style={{ fontWeight: 500 }}>Plain terms, honestly written.</h1>
        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted">
          <section className="reveal border-t border-line pt-6">
            <h2 className="font-serif text-xl text-ink">What DECREE is</h2>
            <p className="mt-2">A calculation and document-preparation tool. It computes statutory interest under Section 16 of the MSMED Act, 2006 and assembles it into filing-ready formats.</p>
          </section>
          <section className="reveal border-t border-line pt-6">
            <h2 className="font-serif text-xl text-ink">What DECREE is not</h2>
            <p className="mt-2">DECREE is not a law firm and does not give legal advice or representation. Rates and day counts carry as-of dates; verify figures with a qualified advocate before filing. Using DECREE does not create a lawyer-client relationship.</p>
          </section>
          <section className="reveal border-t border-line pt-6">
            <h2 className="font-serif text-xl text-ink">Your responsibilities</h2>
            <p className="mt-2">You confirm the extracted fields before calculating, and you review the packet before submitting it to any authority. Upload only documents you’re entitled to use.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
