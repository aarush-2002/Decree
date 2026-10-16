import { cn } from '@/lib/utils';

export type CaseStatus =
  | 'pending'
  | 'awaiting_review'
  | 'calculated'
  | 'confirmed'
  | 'demand_sent'
  | 'filed'
  | 'under_proceedings'
  | 'awarded'
  | 'recovered'
  | 'rejected';

const MAP: Record<string, { label: string; cls: string }> = {
  pending:         { label: 'Pending',        cls: 'bg-pending-bg text-pending border-pending/25' },
  awaiting_review: { label: 'Needs review',   cls: 'bg-pending-bg text-pending border-pending/25' },
  draft:           { label: 'Draft',          cls: 'bg-canvas text-muted border-line-strong' },
  calculated:      { label: 'Calculated',     cls: 'bg-calculated-bg text-calculated border-calculated/25' },
  confirmed:       { label: 'Confirmed',      cls: 'bg-calculated-bg text-calculated border-calculated/25' },
  demand_sent:     { label: 'Demand sent',    cls: 'bg-calculated-bg text-calculated border-calculated/25' },
  filed:           { label: 'Filed',          cls: 'bg-filed-bg text-filed border-filed/25' },
  under_proceedings: { label: 'In proceedings', cls: 'bg-filed-bg text-filed border-filed/25' },
  awarded:         { label: 'Awarded',        cls: 'bg-filed-bg text-filed border-filed/25' },
  recovered:       { label: 'Recovered',      cls: 'bg-filed-bg text-filed border-filed/25' },
  rejected:        { label: 'Rejected',       cls: 'bg-danger-bg text-danger border-danger/25' },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const m = MAP[status] ?? MAP.pending;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em]',
        m.cls,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {m.label}
    </span>
  );
}

/** Confidence hint chip for AI-extracted fields. */
export function ConfidenceChip({ value }: { value: number }) {
  const low = value < 0.8;
  return (
    <span
      title={`AI extraction confidence: ${Math.round(value * 100)}%`}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
        low ? 'border-pending/30 bg-pending-bg text-pending' : 'border-line bg-canvas text-muted',
      )}
    >
      {low ? 'Check this' : `${Math.round(value * 100)}% match`}
    </span>
  );
}
