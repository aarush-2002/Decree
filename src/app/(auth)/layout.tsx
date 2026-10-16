import Link from 'next/link';
import { Scale } from 'lucide-react';

/** Split-screen auth shell: brand trust panel left, Clerk card right. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-canvas md:flex">
        <Link href="/" className="flex items-center gap-2" aria-label="DECREE home">
          <Scale size={20} strokeWidth={1.5} className="text-brass" />
          <span className="font-serif text-xl font-semibold tracking-[0.14em]">DECREE</span>
        </Link>
        <div className="max-w-sm">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">MSMED Act · Section 16</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight" style={{ fontWeight: 500 }}>
            Your invoice is a legal instrument. Treat it like one.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-canvas/70">
            Every rupee of interest is calculated with the math a Council expects — and you can
            see every step before you file.
          </p>
        </div>
        <p className="font-mono text-xs text-canvas/50">Documents encrypted at rest · visible only to you</p>
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-canvas/10" aria-hidden />
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-canvas px-6 py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
