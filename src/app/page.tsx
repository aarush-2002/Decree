
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { CountUp } from "@/components/app/CountUp";
import { RevealScript } from "@/components/marketing/RevealScript";
import { LandingMotion } from "@/components/marketing/LandingMotion";
import { InvoiceMockup } from "@/components/marketing/InvoiceMockup";
import { formatINR } from "@/lib/utils";
import { Calculator, FileDown, ShieldCheck, BrainCircuit, FileType2, ArrowRight } from "lucide-react";

const principal = 450000;
const interest = 82191.78;

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <LandingMotion />

      {/* HERO */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 pt-24 md:px-8 md:pt-32 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="reveal mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-brass" data-reveal>
              Sec. 16 · MSMED Act, 2006
            </p>
            <h1 className="font-serif text-[clamp(56px,9vw,124px)] font-medium leading-[0.95] tracking-[-0.02em] text-ink">
              <SplitReveal text="Get what's owed." block delay={0.1} />
              <br />
              <SplitReveal text="Fast." block italic accent delay={0.45} />
            </h1>
            <p className="reveal mt-7 max-w-md text-base leading-relaxed text-muted md:text-lg" data-reveal>
              Turn messy invoices into court-ready legal claims in 60 seconds.
              Statutory penal interest, calculated to the paisa — reviewed by
              you, filed with confidence.
            </p>
            <div className="reveal mt-9 flex flex-wrap items-center gap-3" data-reveal>
              <Magnetic>
                <Button size="lg" href="/sign-up" iconRight={ArrowRight}>Launch Decree</Button>
              </Magnetic>
              <Button size="lg" variant="secondary" href="/calculator">Quick Demo</Button>
              <span className="annotation -rotate-2 text-sm">no card required</span>
            </div>
          </div>

          {/* Product mockup — real-looking result card, tilted + mouse parallax */}
          <div className="reveal relative mx-auto w-full max-w-[440px] [perspective:900px]" data-reveal>
            <div className="hero-tilt">
              <Card className="shadow-float">
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Claim Result</p>
                    <StatusBadge status="calculated" />
                  </div>
                  <div className="border-t border-line pt-4">
                    <p className="text-xs text-muted">Principal claimed</p>
                    <p className="mt-1 font-mono text-lg tnum text-ink">{formatINR(principal)}</p>
                  </div>
                  <div className="border-t border-line pt-4">
                    <p className="text-xs text-muted">Penal interest · 19.5% · 47 days</p>
                    <p className="mt-1 font-mono text-lg tnum text-brass">+ {formatINR(interest)}</p>
                  </div>
                  <div className="border-t border-line pt-5">
                    <p className="font-serif text-sm text-muted">Total claim amount</p>
                    <p className="mt-1 font-serif text-[34px] font-semibold leading-tight tracking-tight text-ink">
                      <CountUp value={principal + interest} duration={1600} />
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="absolute -bottom-6 -left-8 hidden w-48 sm:block">
              <InvoiceMockup compact />
            </div>
          </div>
        </div>

        <div className="scroll-cue mt-16 hidden lg:flex" aria-hidden="true">
          <span>Scroll</span>
          <span className="scroll-cue-line" />
        </div>
      </section>

      {/* STATS STRIP — editorial row, hairline dividers */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 divide-y divide-line px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-8">
          {[
            { prefix: "₹", value: 10000, suffix: " Cr", label: "Blocked in MSME dues nationwide" },
            { value: 45, suffix: " Days", label: "Statutory payment window under the Act" },
            { value: 3, suffix: "× RBI Rate", label: "Penal interest you can claim" },
          ].map((s, i) => (
            <div key={i} className="reveal py-10 md:px-8 md:first:pl-0 md:last:pr-0" data-reveal>
              <p className="font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                {s.prefix ?? ""}
                <CountUp value={s.value} prefix="" duration={1400} />
                {s.suffix ?? ""}
              </p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — pinned scrub on desktop, stacked on mobile */}
      <section className="how-section" id="how-it-works">
        <div className="how-track">
          <div className="how-sticky w-full">
            <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-8">
              <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.22em] text-brass">The journey</p>
              <div className="how-steps">
                <article className="how-step is-active">
                  <div>
                    <span className="step-num">01</span>
                    <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">Drop a messy invoice.</h2>
                    <p className="mt-3 max-w-sm text-muted">
                      Upload a PDF or photo. We surface the invoice number, amount, date and buyer —
                      and show you exactly what we read before anything is counted.
                    </p>
                  </div>
                  <div className="scan-wrap">
                    <InvoiceMockup />
                    <span className="scan-line" aria-hidden="true" />
                  </div>
                </article>

                <article className="how-step">
                  <div>
                    <span className="step-num">02</span>
                    <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">Section 16 does the math.</h2>
                    <p className="mt-3 max-w-sm text-muted">
                      Deterministic, auditable arithmetic. No black box — every rupee traces back to
                      the statute and the RBI bank rate.
                    </p>
                  </div>
                  <Card className="w-full max-w-md">
                    <CardBody className="space-y-3">
                      <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted">
{`Interest = Principal × Rate × Days / 365
Rate     = RBI Bank Rate (6.5%) + 13%
         = 19.5% per annum`}
                      </pre>
                      <div className="border-t border-line pt-3">
                        <p className="text-xs text-muted">Total claim</p>
                        <p className="font-serif text-2xl font-semibold text-ink">₹5,32,191.78</p>
                      </div>
                    </CardBody>
                  </Card>
                </article>

                <article className="how-step">
                  <div>
                    <span className="step-num">03</span>
                    <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">Download the packet. File it.</h2>
                    <p className="mt-3 max-w-sm text-muted">
                      A court-ready PDF: demand notice draft, interest schedule and evidence index —
                      assembled in one click.
                    </p>
                  </div>
                  <div className="packet-wrap">
                    <div className="packet">
                      <FileType2 className="size-8 text-primary" strokeWidth={1.5} />
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Filing Packet</p>
                        <p className="font-serif text-lg text-ink">MSMED_Claim_FINAL.pdf</p>
                      </div>
                      <span className="stamp mt-2">Ready to file</span>
                    </div>
                  </div>
                </article>
              </div>
              <div className="how-progress" aria-hidden="true">
                <span className="how-progress-fill" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — bento */}
      <section className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-32">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="max-w-xl font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Built like a brief, not a buzzword.
          </h2>
          <p className="hidden max-w-xs text-sm text-muted md:block">
            Four things every claim needs: honest extraction, exact math, safe storage, and a document a registrar will accept.
          </p>
        </div>

        <div className="grid auto-rows-fr gap-4 md:grid-cols-6">
          <Card className="reveal feature-card md:col-span-2 md:row-span-2" data-reveal>
            <CardBody className="flex h-full flex-col gap-5">
              <DotMatrix />
              <BrainCircuit className="size-5 text-primary" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl">AI Extraction</h3>
              <p className="text-sm leading-relaxed text-muted">
                Reads GST invoices, purchase orders and even photographed paper. Every field ships with a
                confidence score — low-confidence values are flagged for your review, never silently trusted.
              </p>
            </CardBody>
          </Card>

          <Card className="reveal feature-card md:col-span-4" data-reveal>
            <CardBody className="flex h-full flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-sm">
                <Calculator className="size-5 text-primary" strokeWidth={1.5} />
                <h3 className="mt-3 font-serif text-2xl">Deterministic Math</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Same input, same output, every time. The Section 16 formula is printed on the result screen
                  so you can verify it line by line. Exact decimal arithmetic — no floating-point drift.
                </p>
              </div>
              <code className="block rounded-[8px] bg-primary-soft px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">
                I = P × (r_b + 13%) × d / 365
              </code>
            </CardBody>
          </Card>

          <Card className="reveal feature-card md:col-span-2" data-reveal>
            <CardBody className="flex h-full flex-col gap-4">
              <ShieldCheck className="size-5 text-primary" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl">Secure Vault</h3>
              <p className="text-sm leading-relaxed text-muted">
                Documents are encrypted in transit and visible only to your firm. Per-case access logs, nothing sold, nothing scraped.
              </p>
            </CardBody>
          </Card>

          <Card className="reveal feature-card md:col-span-2" data-reveal>
            <CardBody className="flex h-full flex-col gap-4">
              <FileDown className="size-5 text-primary" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl">PDF Generation</h3>
              <p className="text-sm leading-relaxed text-muted">
                One click produces the demand notice, interest schedule and annexures — paginated, lettered and ready for the Samadhan portal or a civil suit.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden border-y border-line py-8" aria-hidden="true">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {[...Array(2)].map((_, r) => (
            <span key={r} className="flex items-center gap-10">
              {["Principal", "Penalty Interest", "Section 16", "45 Days", "MSMED Act", "Samadhan Filing", "RBI Bank Rate", "Due Date"].map((t) => (
                <span key={t} className="flex items-center gap-10 font-serif text-2xl italic text-primary/70 md:text-3xl">
                  {t}
                  <span className="size-1.5 rounded-full bg-brass" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* FINAL CTA — band wipes to deep green on enter */}
      <section className="cta-band">
        <div className="mx-auto max-w-[1200px] px-5 py-28 text-center md:px-8 md:py-36">
          <h2 className="reveal mx-auto max-w-3xl font-serif text-[clamp(36px,6vw,72px)] font-medium leading-[1.02] tracking-tight text-canvas" data-reveal>
            Your money has a statutory clock.
            <br />
            <em className="text-brass">Start it today.</em>
          </h2>
          <div className="reveal mt-10 flex items-center justify-center" data-reveal>
            <Magnetic>
              <Button size="lg" variant="brass" href="/sign-up" iconRight={ArrowRight} fillHover>
                Create free account
              </Button>
            </Magnetic>
          </div>
          <p className="reveal mt-6 text-sm text-canvas/60" data-reveal>
            Free for your first three claims. No card, no call center.
          </p>
        </div>
      </section>

      <Footer />
      <RevealScript />
    </div>
  );
}

/* Dot-matrix scanning decoration for the AI Extraction card */
function DotMatrix() {
  return (
    <div className="dot-matrix" aria-hidden="true">
      {Array.from({ length: 5 * 14 }).map((_, i) => (
        <span key={i} className="dot" style={{ animationDelay: `${(i % 14) * 0.06}s` }} />
      ))}
    </div>
  );
}
