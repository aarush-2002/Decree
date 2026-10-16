'use client'
// ============================================================================
// Calculator & Results — 2-column editorial layout.
// Left: summary card (Principal · Days · RBI rate · Penal rate).
// Right: the Section 16 formula in monospace, then the hero result with a
// count-up and a brief brass highlight on the total claim.
// States: loading skeleton · error · empty(no inputs) · results.
// ============================================================================
import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Download, Save, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { CountUp } from '@/components/app/CountUp';
import { formatINR, formatDate, formatPercent } from '@/lib/utils';

interface CalcResult {
  caseId?: string; principal: number; daysOverdue: number;
  rbiRate: number; penalRate: number; interest: number; totalClaim: number;
  asOf: string; rule: string;
}

function CalculatorInner() {
  const params = useSearchParams();
  const caseId = params.get('case');

  const [principal, setPrincipal] = useState(params.get('principal') ?? '');
  const [dueDate, setDueDate] = useState(params.get('dueDate') ?? '');
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const calculate = useCallback(async () => {
    setLoading(true); setError(null); setSaved(false);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, principal: Number(principal), dueDate, asOf }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? 'The calculation failed. Check the amount and dates.');
      setResult(d);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [caseId, principal, dueDate, asOf]);

  // Auto-run when arriving from upload with a saved case
  useEffect(() => { if (caseId) calculate(); /* eslint-disable-next-line */ }, [caseId]);

  const canCalc = principal !== '' && dueDate !== '' && asOf !== '';

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">Section 16 · MSMED Act</p>
          <h1 className="mt-2 font-serif text-4xl text-ink" style={{ fontWeight: 500 }}>Interest computation.</h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            Penal interest at three times the RBI reference rate, compounded annually. Every step is shown — nothing hidden.
          </p>
        </div>
        {!caseId && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input label="Principal (₹)" type="number" inputMode="decimal" prefix="₹" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="450000" />
            <Input label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Input label="Calculate as of" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
          </div>
        )}
      </div>

      {/* Action row */}
      {!caseId && (
        <div className="mt-6">
          <Button onClick={calculate} disabled={!canCalc} loading={loading}>Calculate claim</Button>
        </div>
      )}

      {/* ---------- LOADING ---------- */}
      {loading && (
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]" role="status" aria-label="Calculating">
          <Card className="p-6"><Skeleton className="h-5 w-32" /><div className="mt-6 space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8" />)}</div></Card>
          <Card className="p-6"><Skeleton className="h-5 w-40" /><Skeleton className="mt-6 h-24" /><Skeleton className="mt-4 h-16 w-2/3" /></Card>
          <span className="sr-only">Working through the statute…</span>
        </div>
      )}

      {/* ---------- ERROR ---------- */}
      {error && !loading && (
        <Card className="mt-10 flex flex-col items-start gap-4 border-danger/30 bg-danger-bg/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-[15px] text-ink"><AlertTriangle size={18} strokeWidth={1.5} className="text-danger" />{error}</p>
          <Button variant="secondary" icon={RefreshCw} onClick={calculate}>Retry</Button>
        </Card>
      )}

      {/* ---------- EMPTY ---------- */}
      {!loading && !error && !result && (
        <Card className="mt-10 border-dashed p-10 text-center">
          <p className="font-serif text-xl text-ink">Nothing to show yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-[15px] text-muted">Enter an amount and the two dates above, or upload an invoice and we’ll fill these in for you.</p>
          <div className="mt-6"><Button href="/upload" variant="secondary" icon={Plus}>Upload an invoice</Button></div>
        </Card>
      )}

      {/* ---------- RESULTS ---------- */}
      {result && !loading && (
        <>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            {/* LEFT — summary */}
            <Card>
              <CardHeader eyebrow="Inputs" title="Case summary" />
              <CardBody>
                <dl className="divide-y divide-line font-mono text-[15px]">
                  {[
                    ['Principal', formatINR(result.principal)],
                    ['Due date → as of', `${formatDate(dueDate || result.asOf)} → ${formatDate(asOf)}`],
                    ['Days overdue', String(result.daysOverdue)],
                    ['RBI reference rate', formatPercent(result.rbiRate)],
                    ['Penal rate (3×)', formatPercent(result.penalRate)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between py-3 first:pt-0 last:pb-0">
                      <dt className="text-muted">{k}</dt><dd className="tnum text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="annotation mt-5 text-base">rule: {result.rule}</p>
              </CardBody>
            </Card>

            {/* RIGHT — formula + hero result */}
            <div className="space-y-6">
              <Card>
                <CardHeader eyebrow="Deterministic math" title="How this was computed" />
                <CardBody>
                  <ol className="space-y-3 font-mono text-sm text-ink">
                    <li className="rounded-control bg-canvas px-4 py-3">① penal_rate = {formatPercent(result.rbiRate)} × 3 = {formatPercent(result.penalRate)} p.a.</li>
                    <li className="rounded-control bg-canvas px-4 py-3">② simple period = {formatINR(result.principal)} × {formatPercent(result.penalRate)} ÷ 365 × {result.daysOverdue} days</li>
                    <li className="rounded-control bg-canvas px-4 py-3">③ compound annually where days &gt; 365 (annual resting)</li>
                    <li className="rounded-control border border-brass/40 bg-brass-soft/60 px-4 py-3">④ interest = <strong className="tnum">{formatINR(result.interest)}</strong></li>
                  </ol>
                </CardBody>
              </Card>

              {/* HERO RESULT — biggest element on the page */}
              <Card className="border-primary/20 bg-primary p-8 text-canvas md:p-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-canvas/60">Calculated interest</p>
                <p className="mt-2 font-serif text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
                  ₹<CountUp value={result.interest} />
                </p>
                <div className="mt-8 border-t border-canvas/15 pt-6">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-canvas/60">Total claim amount</p>
                  <p className="mt-2 font-serif text-5xl leading-none md:text-6xl" style={{ fontWeight: 500 }}>
                    ₹<CountUp value={result.totalClaim} duration={1500} highlightBrass />
                  </p>
                  <p className="mt-3 text-sm text-canvas/60">Principal {formatINR(result.principal)} + interest {formatINR(result.interest)}. As of {formatDate(asOf)}.</p>
                </div>
              </Card>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                <Button href={result.caseId ? `/case/${result.caseId}/packet` : '/dashboard'} icon={Download}>
                  Download Filing Packet (PDF)
                </Button>
                {result.caseId ? (
                  <Button variant="secondary" icon={Save} href={`/case/${result.caseId}`}>
                    {saved ? 'Saved to Dashboard' : 'View on Dashboard'}
                  </Button>
                ) : (
                  <Button variant="secondary" icon={Save} href="/dashboard">Save to Dashboard</Button>
                )}
                <Button variant="ghost" icon={Plus} href="/upload">Start New Case</Button>
              </div>
              <p className="text-xs text-faint">
                The packet contains the claim application, computation sheet and evidence annexure, formatted for filing with your state MSME Facilitation Council.
              </p>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <AppShell><div className="space-y-4"><Skeleton className="h-10 w-72" /><Skeleton className="h-64" /></div></AppShell>
    }>
      <CalculatorInner />
    </Suspense>
  );
}
