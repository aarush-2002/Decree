'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Preloader — ≤1.8s, once per session (sessionStorage), skippable by click/Esc.
 * Letters rise from a masked line, brass rule draws, counter 0→100, curtain split.
 */
export function Preloader() {
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || sessionStorage.getItem('decree-preloaded')) return;
    sessionStorage.setItem('decree-preloaded', '1');
    setVisible(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setVisible(false) });
      tl.from('.pl-letter', { yPercent: 120, duration: 0.6, stagger: 0.06, ease: 'power3.out' })
        .fromTo('.pl-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
        .to({}, { duration: 0.2 })
        // Counter 0 → 100
        .fromTo(
          '.pl-count',
          { textContent: 0 },
          {
            textContent: 100,
            snap: { textContent: 1 },
            duration: 0.7,
            ease: 'power3.inOut',
            onUpdate: function (this: any) {
              const el = document.querySelector('.pl-count');
              if (el) el.textContent = String(Math.round(this.targets()[0].textContent));
            },
          },
          '<',
        )
        // Curtain split open
        .to('.pl-half', { yPercent: (i) => (i === 0 ? -100 : 100), duration: 0.7, stagger: 0.05, ease: 'power3.inOut' });
    }, root);

    const skip = () => setVisible(false);
    window.addEventListener('keydown', skip);
    const t = setTimeout(skip, 2400);
    return () => { ctx.revert(); window.removeEventListener('keydown', skip); clearTimeout(t); };
  }, []);

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-primary" aria-hidden>
      <div className="pl-half absolute inset-x-0 top-0 h-1/2 bg-primary" />
      <div className="pl-half absolute inset-x-0 bottom-0 h-1/2 bg-primary" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex overflow-hidden">
          {'DECREE'.split('').map((c, i) => (
            <span key={i} className="pl-letter font-serif text-5xl tracking-[0.2em] text-canvas sm:text-7xl">{c}</span>
          ))}
        </div>
        <div className="pl-rule h-px w-48 origin-left bg-brass" />
        <div className="pl-count font-mono text-sm text-brass">0</div>
      </div>
    </div>
  );
}
