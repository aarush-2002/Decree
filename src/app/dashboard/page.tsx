'use client';
// ============================================================================
// Dashboard — restrained app motion: rows stagger once, hover wash, sortable
// headers, search + status filter. Mobile renders the same data as cards.
// States: loading skeleton · empty · error · list.
// ============================================================================
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Plus, Search, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { formatINR0, formatDate } from '@/lib/utils';

interface Row {
  id: string; caseNumber: string; buyer: string; principal: number;
  daysOverdue: number; status: string; createdAt: string; totalClaim?: number | null;
}

type SortKey = 'caseNumber' | 'buyer' | 'principal' | 'daysOverdue' | 'status' | 'createdAt';

export default function DashboardPage() {
  const { user } = useUser();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const load = () => {
    setError(null); setRows(null);
    fetch('/api/cases')
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => { if (!ok) throw new Error(d?.error ?? 'Could not load cases.'); setRows(d.cases ?? []); })
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = rows ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.buyer.toLowerCase().includes(s) || r.caseNumber.toLowerCase().includes(s));
    }
    if (status !== 'all') list = list.filter((r) => r.status === status);
    return [...list].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, q, status, sortKey, sortDir]);

  const stats = useMemo(() => {
    const list = rows ?? [];
    return {
      claims: list.length,
      recovered: list.filter((r) => r.status === 'recovered').reduce((s, r) => s + (r.totalClaim ?? r.principal), 0),
      active: list.filter((r) => !['recovered', 'rejected'].includes(r.status)).length,
    };
  }, [rows]);

  const onSort = (key: string) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key as SortKey); setSortDir('asc'); }
  };

  const columns: Column<Row>[] = [
    { key: 'caseNumber', header: 'Case ID', sortable: true, render: (r) => (
      <Link href={`/case/${r.id}`} className="font-mono text-sm text-primary hover:text-brass">{r.caseNumber}</Link>
    )},
    { key: 'buyer', header: 'Buyer', sortable: true, render: (r) => <span className="text-ink">{r.buyer}</span> },
    { key: 'principal', header: 'Principal', sortable: true, align: 'right', render: (r) => <span className="tnum amount">{formatINR0(r.principal)}</span> },
    { key: 'daysOverdue', header: 'Days Overdue', sortable: true, align: 'right', render: (r) => <span className="tnum">{r.daysOverdue}</span> },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'view', header: '', render: (r) => (
      <Link href={`/case/${r.id}`} aria-label={`View case ${r.caseNumber}`}
        className="inline-grid h-11 w-11 place-items-center rounded-control border border-line-strong text-muted transition-colors hover:border-brass hover:text-brass">
        <ArrowRight size={16} strokeWidth={1.5} />
      </Link>
    )},
  ];

  return (
    <AppShell>
      {/* Header row — asymmetric: greeting left, action right */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">Claims register</p>
          <h1 className="mt-2 font-serif text-4xl text-ink" style={{ fontWeight: 500 }}>
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}.
          </h1>
        </div>
        <Button href="/upload" icon={Plus}>New Case</Button>
      </div>

      {/* Summary stats — hairline row, not boxy cards */}
      <div className="mt-8 grid grid-cols-1 divide-y divide-line rounded-card border border-line bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          { label: 'Total Claims', value: stats.claims == null ? '—' : String(stats.claims) },
          { label: 'Total Recovered', value: rows ? formatINR0(stats.recovered) : '—' },
          { label: 'Active Cases', value: String(stats.active) },
        ].map((s) => (
          <div key={s.label} className="px-6 py-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">{s.label}</p>
            <p className="tnum mt-2 font-serif text-3xl text-primary" style={{ fontWeight: 500 }}>{rows ? s.value : <span className="skeleton inline-block h-8 w-28 align-middle" />}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} strokeWidth={1.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <Input aria-label="Search cases" placeholder="Search buyer or case ID…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-h-[44px] rounded-control border border-line-strong bg-surface px-3 text-sm text-ink focus:outline-none focus-visible:border-brass"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="calculated">Calculated</option>
          <option value="filed">Filed</option>
          <option value="recovered">Recovered</option>
        </select>
      </div>

      {/* Body: loading / error / empty / table */}
      <div className="mt-6">
        {error ? (
          <Card className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-[15px] text-ink">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-danger" />
              {error}
            </p>
            <Button variant="secondary" icon={RefreshCw} onClick={load}>Try again</Button>
          </Card>
        ) : rows === null ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No cases yet."
            body="Upload your first overdue invoice and DECREE will draft the Section 16 interest claim around it. Nothing is sent anywhere until you say so."
            action={<Button href="/upload" icon={Plus}>Upload your first invoice</Button>}
          />
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted">Nothing matches that search. Clear the filters to see all cases.</Card>
        ) : (
          <DataTable
            columns={columns}
            rows={filtered}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
            mobileCard={(r) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link href={`/case/${r.id}`} className="font-mono text-sm text-primary">{r.caseNumber}</Link>
                  <StatusBadge status={r.status} />
                </div>
                <p className="font-medium text-ink">{r.buyer}</p>
                <div className="flex justify-between font-mono text-sm text-muted">
                  <span>{formatINR0(r.principal)}</span><span>{r.daysOverdue} days overdue</span>
                </div>
                <p className="font-mono text-xs text-faint">Created {formatDate(r.createdAt)}</p>
              </div>
            )}
          />
        )}
      </div>
    </AppShell>
  );
}
