'use client';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Vertical/horizontal stepper used by the processing modal + how-it-works. */
export function Stepper({
  steps,
  current,
  orientation = 'vertical',
}: {
  steps: string[];
  /** index of the step in progress; steps before it are done */
  current: number;
  orientation?: 'vertical' | 'horizontal';
}) {
  return (
    <ol className={cn(orientation === 'horizontal' ? 'flex items-center gap-3' : 'space-y-0')} aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={s}
            className={cn(
              'flex items-center gap-3',
              orientation === 'horizontal' && 'flex-1',
            )}
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={cn(
                'grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors duration-200',
                done && 'border-filed bg-filed text-white',
                active && 'border-brass bg-brass-soft text-brass',
                !done && !active && 'border-line-strong text-faint',
              )}
            >
              {done ? <Check size={14} strokeWidth={2} /> : i + 1}
            </span>
            <span
              className={cn(
                'text-sm transition-opacity duration-200',
                active ? 'font-medium text-ink' : done ? 'text-muted' : 'text-faint',
              )}
            >
              {s}
            </span>
            {orientation === 'horizontal' && i < steps.length - 1 && (
              <span className={cn('h-px flex-1', done ? 'bg-filed' : 'bg-line')} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
