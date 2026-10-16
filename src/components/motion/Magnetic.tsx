'use client';
import { useEffect, useRef } from 'react';
import { magnetic } from '@/lib/motion';

/** Wraps a CTA button; pulls it toward the cursor within ~80px. No-op on
 *  touch devices and under prefers-reduced-motion (handled in lib/motion). */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current || window.matchMedia('(pointer: coarse)').matches) return;
    return magnetic(ref.current);
  }, []);
  return <span ref={ref} className="inline-block">{children}</span>;
}
