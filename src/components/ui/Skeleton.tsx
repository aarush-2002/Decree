import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />;
}

/** Table-shaped skeleton matching the dashboard loading state. */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5" role="status" aria-label="Loading cases">
      <div className="mb-5 h-4 w-40 skeleton" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4">
            <div className="h-4 col-span-2 skeleton" />
            <div className="h-4 skeleton" />
            <div className="h-4 skeleton" />
            <div className="h-4 skeleton" />
            <div className="h-6 rounded-full skeleton" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
