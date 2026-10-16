'use client';
import { useEffect, useRef } from 'react';
import { splitReveal } from '@/lib/motion';

/** Headline that reveals word-by-word from behind a mask (GSAP), with an
 *  SSR-visible fallback: text is present in the DOM before hydration. */
export function SplitReveal({
  text, as = 'span', block = false, italic = false, accent = false, delay = 0, stagger = 0.06, className = '',
}: {
  text: string; as?: 'span' | 'h1' | 'h2' | 'p'; block?: boolean; italic?: boolean;
  accent?: boolean; delay?: number; stagger?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) splitReveal(ref.current, { delay, stagger });
  }, [delay, stagger]);
  return (
    <span
      ref={ref}
      className={`${block ? 'mask-line' : ''} ${italic ? 'italic' : ''} ${accent ? 'text-brass' : ''} ${className}`}
    >
      {text}
    </span>
  );
}
