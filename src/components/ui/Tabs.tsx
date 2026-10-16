'use client';
import { cn } from '@/lib/utils';

export interface TabItem { id: string; label: string }

export function Tabs({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label="Sections" className={cn('flex gap-1 border-b border-line', className)}>
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'relative min-h-[44px] px-4 text-sm font-medium transition-colors duration-150',
            active === t.id ? 'text-primary' : 'text-muted hover:text-ink',
          )}
        >
          {t.label}
          {active === t.id && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brass" aria-hidden />
          )}
        </button>
      ))}
    </div>
  );
}
