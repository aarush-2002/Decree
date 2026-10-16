'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';

/** Small brass dot → ring on interactive elements. Desktop + full motion only. */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current!;
    document.documentElement.classList.add('has-cursor');

    const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' });

    const move = (e: MouseEvent) => {
      xTo(e.clientX - el.offsetWidth / 2);
      yTo(e.clientY - el.offsetHeight / 2);
      const target = (e.target as HTMLElement).closest('a,button,[data-cursor]');
      const label = target?.getAttribute('data-cursor');
      el.dataset.active = target ? 'true' : 'false';
      el.textContent = label ?? '';
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return <div ref={ref} className="cursor-dot hidden md:flex items-center justify-center font-mono text-[9px] uppercase tracking-widest text-brass" aria-hidden />;
}
