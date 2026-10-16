import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'brass' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[8px] font-medium transition-all duration-200 ease-out ' +
  'min-h-[44px] px-5 text-[15px] leading-none select-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-canvas hover:bg-primary-deep active:translate-y-px shadow-lift',
  secondary:
    'bg-surface text-primary border border-line-strong hover:border-brass hover:text-primary-deep active:translate-y-px',
  ghost:
    'text-muted hover:text-ink hover:bg-primary-soft/60 active:translate-y-px',
  brass:
    'bg-brass text-white hover:brightness-95 active:translate-y-px',
  danger:
    'bg-danger-bg text-danger border border-danger/30 hover:bg-danger hover:text-white',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-[36px] px-3 text-sm rounded-[6px]',
  md: 'min-h-[44px] px-5 text-[15px]',
  lg: 'min-h-[52px] px-7 text-base',
};

interface Props {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fillHover?: boolean; /* marketing: fill-from-below */
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon: Icon,
  iconRight: IconRight,
  href,
  type = 'button',
  onClick,
  disabled,
  loading,
  fillHover,
}: Props) {
  const cls = cn(
    base,
    variants[variant],
    sizes[size],
    fillHover && 'btn-fill',
    className,
  );

  const inner = (
    <>
      {loading ? <Spinner /> : Icon ? <Icon size={18} strokeWidth={1.5} aria-hidden /> : null}
      {children}
      {IconRight ? <IconRight size={18} strokeWidth={1.5} aria-hidden /> : null}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls} aria-busy={loading}>
      {inner}
    </button>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      role="status"
      aria-label="Loading"
    />
  );
}
