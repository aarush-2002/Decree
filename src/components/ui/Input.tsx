'use client';
import { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputBase {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: string; /* e.g. ₹ */
}
interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputBase>, InputBase {}

export function Input({ label, hint, error, prefix, className, id, ...rest }: Props) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted" aria-hidden>
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'min-h-[44px] w-full rounded-control border bg-surface px-3.5 text-[15px] text-ink placeholder:text-faint',
            'transition-colors duration-150 focus:outline-none focus-visible:border-brass',
            prefix && 'pl-8',
            error ? 'border-danger' : 'border-line-strong hover:border-line-strong/80',
            className,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${inputId}-err`} className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof InputBase>, InputBase {
  rows?: number;
}
export function Textarea({ label, hint, className, id, ...rest }: TextareaProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-ink">{label}</label>}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-control border border-line-strong bg-surface px-3.5 py-3 text-[15px] text-ink placeholder:text-faint focus:outline-none focus-visible:border-brass',
          className,
        )}
        {...rest}
      />
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}
