'use client';
// Restrained app motion: numbers count up once on mount (or when `key`
// changes), respecting prefers-reduced-motion. Brass highlight optional.
import { useEffect, useRef } from 'react';
import { formatGrouped } from '@/lib/utils';

export function CountUp({
  value, decimals = 2, prefix = '', duration = 1200, className, highlightBrass = false,
}: {
  value: number; decimals?: number; prefix?: string; duration?: number;
  className?: string; highlightBrass?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = prefix + formatGrouped(value, decimals);
      return;
    }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = prefix + formatGrouped(value * eased, decimals);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, decimals, prefix, duration]);

  return (
    <span ref={ref} className={`tnum ${highlightBrass ? 'text-brass' : ''} ${className ?? ''}`} data-count>
      {prefix + formatGrouped(value, decimals)}
    </span>
  );
}
