'use client';
// Restrained app motion: numbers count up once on mount, respecting
// prefers-reduced-motion. Indian grouping kept stable to avoid layout shift.
import { useEffect, useRef } from 'react';
import { formatINR } from '@/lib/utils';

export function CountUp({
  value, prefix = '₹', duration = 1200, decimals = 2, className, highlightBrass = false,
}: {
  value: number; prefix?: string; duration?: number; decimals?: number; className?: string; highlightBrass?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { el.textContent = formatINR(value); return; }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const body = formatINR(value * eased).replace(/^₹/, '');
      el.textContent = prefix ? prefix + body : body;
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration, prefix]);

  return <span ref={ref} className={`tnum ${highlightBrass ? 'text-brass' : ''} ${className ?? ''}`}>{formatINR(value)}</span>;
}
