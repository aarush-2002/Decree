'use client';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right';
  render: (row: T) => React.ReactNode;
}

/**
 * Editorial table — hairlines only, hover wash on rows.
 * On <md the same data renders as stacked cards (see `mobileCard`).
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  sortKey,
  sortDir,
  onSort,
  mobileCard,
}: {
  columns: Column<T>[];
  rows: T[];
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  /** Renders the mobile card for a row (hidden at md+). */
  mobileCard: (row: T) => React.ReactNode;
}) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((r) => (
          <div key={r.id} className="rounded-card border border-line bg-surface p-4">
            {mobileCard(r)}
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-card border border-line bg-surface md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {columns.map((c) => {
                const active = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cn(
                      'px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-faint',
                      c.align === 'right' && 'text-right',
                    )}
                  >
                    {c.sortable && onSort ? (
                      <button
                        onClick={() => onSort(c.key)}
                        className={cn(
                          'inline-flex items-center gap-1 uppercase tracking-[0.12em] transition-colors hover:text-ink',
                          active && 'text-primary',
                        )}
                      >
                        {c.header}
                        {active ? (
                          sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        ) : (
                          <ArrowUpDown size={12} className="opacity-40" />
                        )}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className="reveal border-b border-line/60 transition-colors duration-150 last:border-0 odd:bg-canvas/40 hover:bg-primary-soft/50"
                style={{ transitionDelay: `${Math.min(i * 40, 320)}ms` }}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-5 py-4 align-middle', c.align === 'right' && 'text-right')}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
