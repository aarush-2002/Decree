import { cn } from '@/lib/utils';

/**
 * Line-drawn, brand-colored illustration placeholder — simple SVG strokes,
 * no stock art. Children provide the copy + action.
 */
export function EmptyState({
  title,
  body,
  action,
  icon,
  className,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-start gap-4 rounded-card border border-dashed border-line-strong bg-canvas px-8 py-12', className)}>
      <div className="relative">
        {/* fine line-art frame */}
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden className="text-primary/70">
          <rect x="10" y="6" width="42" height="54" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M18 18h26M18 26h26M18 34h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <circle cx="52" cy="50" r="12" stroke="var(--color-brass)" strokeWidth="1.5" />
          <path d="M52 45v10M47 50h10" stroke="var(--color-brass)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {icon}
      </div>
      <div className="max-w-md">
        <h3 className="font-serif text-xl text-ink">{title}</h3>
        <p className="mt-1 text-[15px] leading-relaxed text-muted">{body}</p>
      </div>
      {action}
    </div>
  );
}
