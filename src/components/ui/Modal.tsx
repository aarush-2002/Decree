'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Floating panel — the only place we allow a soft shadow. */
export function Modal({
  open,
  onClose,
  title,
  children,
  dismissible = true,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  dismissible?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) onClose();
    };
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, dismissible]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label={dismissible ? 'Close dialog' : undefined}
        tabIndex={dismissible ? 0 : -1}
        onClick={() => dismissible && onClose()}
        className="absolute inset-0 bg-ink/40 animate-[fadeIn_0.2s_ease-out]"
      />
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          'relative m-0 sm:m-6 w-full translate-y-0 rounded-t-card sm:rounded-card border border-line bg-surface shadow-float',
          'animate-[riseIn_0.25s_var(--ease-reveal)]',
          wide ? 'max-w-3xl' : 'max-w-lg',
        )}
        style={{ animationName: 'riseIn' }}
      >
        <style>{`@keyframes riseIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-serif text-lg text-ink">{title}</h2>
          {dismissible && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-control text-muted transition-colors hover:bg-primary-soft hover:text-ink"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
