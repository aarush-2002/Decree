import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = { title: 'Privacy' };

const SECTIONS = [
  ['What we collect', 'Invoice documents you upload, the fields you confirm, and account details from Clerk (email, name). That’s it.'],
  ['How it’s stored', 'Documents are encrypted at rest. Only members of your organisation can see them. We do not train models on your data.'],
  ['What we don’t do', 'We never sell or share your data with advertisers. We never file anything on your behalf without you downloading and submitting it yourself.'],
  ['Your rights', 'Export or delete any case and its documents from Settings, or email privacy@decree.app. Deletions complete within 30 days.'],
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pb-24 pt-36">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">Privacy</p>
        <h1 className="mt-4 font-serif text-5xl text-ink" style={{ fontWeight: 500 }}>Your books stay your books.</h1>
        <div className="mt-10 space-y-8">
          {SECTIONS.map(([t, b]) => (
            <section key={t} className="reveal border-t border-line pt-6">
              <h2 className="font-serif text-xl text-ink">{t}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{b}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
