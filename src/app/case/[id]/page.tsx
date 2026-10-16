'use client';
// ============================================================================
// Case Details — header (Case ID · status · created date), tabs:
// Overview (buyer, amounts, vertical timeline) · Evidence (invoice viewer) ·
// Calculations (full breakdown). Sticky sidebar with Download CTA.
// ============================================================================
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Download, ArrowLeft, AlertTriangle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatINR, formatDate } from '@/lib/utils';

interface CaseDetail {
  id: string; caseNumber: string; status: string; createdAt: string;
  invoiceNo: string; buyerName: string; supplierName?: string | null;
  principal: number; invoiceDate: string; dueDate: string;
  daysOverdue: number; rbiRate: number; penalRate: number;
  interest: number | null; totalClaim: number | null;
  fileUrl?: string | null; fileName?: string | null;
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'calculations', label: 'Calculations' },
];

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CaseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    fetch(`/api/cases/${id}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => { if (!ok) throw new Error(d?.error ?? 'Could not load this case.'); setData(d.case ?? d); })
      .catch((e) => setError(e.message));
  }, [id]);

  const timeline = useMemo(() => {
    if (!data) return [];
    return [
      { date: data.invoiceDate, title: 'Invoice raised', note: `Invoice ${data.invoiceNo}` },
      { date: data.dueDate, title: 'Payment due', note: '45-day statutory window ends' },
      { date: data.createdAt, title: 'Case opened in DECREE', note: 'Fields verified by you' },
      ...(data.interest != null ? [{ date: data.createdAt, title: 'Interest computed', note: `${formatINR(data.interest)} under §16` }] : []),
      ...(data.status === 'filed' || data.status === 'recovered' ? [{ date: data.createdAt, title: 'Filed with MSME-FAC', note: 'Acknowledgement on record' }] : []),
    ];
  }, [data]);

  if (error) {
    return (
      <AppShell>
        <Card className="mt-10 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-[15px] text-ink"><AlertTriangle size={18} strokeWidth={1.5} className="text-danger" />{error}</p>
          <Button variant="secondary" href="/dashboard" icon={ArrowLeft}>Back to dashboard</Button>
        </Card>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <div role="status" aria-label="Loading case">
          <Skeleton className="h-9 w-64" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4"><Skeleton className="h-72" /><Skeleton className="h-40" /></div>
            <Skeleton className="h-56" />
          </div>
          <span className="sr-only">Loading…</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft size={14} strokeWidth={1.5} /> All cases
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-8">
        <div>
          <h1 className="font-mono text-2xl text-ink">{data.caseNumber}</h1>
          <p className="mt-2 text-[15px] text-muted">vs {data.buyerName} · opened {formatDate(data.createdAt)}</p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <Tabs items={TABS} active={tab} onChange={setTab} />

          {tab === 'overview' && (
            <div className="mt-6 space-y-8">
              <Card>
                <CardHeader eyebrow="Parties & money" title="At a glance" />
                <CardBody>
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm md:grid-cols-3">
                    {[
                      ['Supplier', data.supplierName ?? '—'],
                      ['Buyer', data.buyerName],
                      ['Invoice', data.invoiceNo],
                      ['Principal', formatINR(data.principal)],
                      ['Days overdue', String(data.daysOverdue)],
                      ['Total claim', data.totalClaim != null ? formatINR(data.totalClaim) : 'Not calculated'],
                    ].map(([k, v]) => (
                      <div key={k}><dt className="text-faint">{k}</dt><dd className="tnum mt-1 text-ink">{v}</dd></div>
                    ))}
                  </dl>
                </CardBody>
              </Card>

              {/* Vertical timeline — hairline spine, brass nodes */}
              <div>
                <h3 className="font-serif text-xl text-ink">Timeline</h3>
                <ol className="mt-4 border-l border-line pl-6">
                  {timeline.map((t, i) => (
                    <li key={i} className="reveal relative pb-8 last:pb-0">
                      <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 border-brass bg-canvas" aria-hidden />
                      <p className="text-[15px] font-medium text-ink">{t.title}</p>
                      <p className="mt-0.5 text-sm text-muted">{formatDate(t.date)} · {t.note}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {tab === 'evidence' && (
            <Card className="mt-6">
              <CardHeader eyebrow="Original document" title={data.fileName ?? 'Invoice'} action={<span className="stamp text-[10px]">On record</span>} />
              <CardBody className="bg-canvas">
                {data.fileUrl ? (
                  /\.(png|jpe?g)$/i.test(data.fileUrl)
                    ? <img src={data.fileUrl} alt={`Invoice evidence for ${data.caseNumber}`} className="max-h-[70vh] w-full rounded-control border border-line object-contain bg-surface" />
                    : <iframe src={data.fileUrl} title="Invoice evidence" className="h-[70vh] w-full rounded-control border border-line bg-surface" />
                ) : (
                  <div className="rounded-card border border-dashed border-line-strong p-12 text-center">
                    <svg viewBox="0 0 64 64" className="mx-auto h-16 w-16 text-primary/50" fill="none" aria-hidden>
                      <rect x="12" y="8" width="40" height="48" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M20 20h24M20 28h24M20 36h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                    </svg>
                    <p className="mt-4 text-[15px] text-muted">The uploaded invoice is stored encrypted. Re-upload it from your records if it’s missing here.</p>
                    <div className="mt-4"><Button variant="secondary" href="/upload">Attach evidence</Button></div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {tab === 'calculations' && (
            <Card className="mt-6">
              <CardHeader eyebrow="Section 16 · MSMED Act" title="Full breakdown" />
              <CardBody>
                <dl className="divide-y divide-line font-mono text-[15px]">
                  {[
                    ['Principal', formatINR(data.principal)],
                    ['RBI reference rate', `${data.rbiRate}% p.a.`],
                    ['Penal rate (3× RBI)', `${data.penalRate}% p.a.`],
                    ['Period', `${data.daysOverdue} days · ${formatDate(data.dueDate)} → today`],
                    ['Interest', data.interest != null ? formatINR(data.interest) : '—'],
                    ['Total claim', data.totalClaim != null ? formatINR(data.totalClaim) : '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between py-3 first:pt-0 last:pb-0">
                      <dt className="text-muted">{k}</dt><dd className="tnum text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="annotation mt-5 text-base">compounded annually · annual resting method</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24">
          <Card className="p-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">Ready for the Council</p>
            <p className="mt-3 font-serif text-lg leading-snug text-ink">
              {data.totalClaim != null ? <>A filing packet worth <span className="text-brass">{formatINR(data.totalClaim)}</span>.</> : 'Calculate interest to unlock the filing packet.'}
            </p>
            <div className="mt-6 space-y-3">
              <Button className="w-full" icon={Download} href={`/case/${data.id}/packet`} disabled={data.totalClaim == null}>
                Download Court-Ready PDF
              </Button>
              <Button variant="ghost" className="w-full" href={`/calculator?case=${data.id}`}>Recalculate as of today</Button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-faint">Packet includes the claim application, computation sheet and annexures. Verify with your advocate before filing.</p>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
