import { cn } from '@/lib/utils';

/** Editorial card: hairline border, no heavy shadow. Shadows only when floating. */
export function Card({
  className,
  children,
  as: Tag = 'div',
  interactive = false,
}: {
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'aside';
  interactive?: boolean;
}) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-line bg-surface',
        interactive &&
          'transition-all duration-200 ease-out hover:-translate-y-1 hover:border-brass/70 hover:shadow-lift',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title: React.ReactNode;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-line px-6 py-5', className)}>
      <div>
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">{eyebrow}</p>
        )}
        <h3 className="mt-1 text-lg font-semibold text-ink">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
}
