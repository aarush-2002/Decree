'use client';
/**
 * Progressive-enhancement fallback: adds `.is-in` to `.reveal` / `.rule-draw`
 * elements as they enter the viewport via IntersectionObserver. Works even if
 * GSAP fails to load and is inert under reduced motion (CSS handles that).
 */
import { useEffect } from 'react';

export function RevealScript() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in), .rule-draw:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
