// ============================================================================
// DECREE — Reusable animation helpers (GSAP). All motion is transform/opacity/
// clip-path only. Every helper no-ops under prefers-reduced-motion so content
// is fully readable without JS animation.
//
// Motion spec:
//   Easing reveal:  cubic-bezier(0.22, 1, 0.36, 1)  → "--ease-reveal"
//   Easing move:    power3.inOut for transitions
//   Durations:      0.6–1.0s reveals · 1.2s page transitions · 0.2s hovers
//   Stagger:        0.04–0.08s between words/lines
//   Distances:      40–80px translate max
// ============================================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const EASE_REVEAL = 'power3.out'; // close cousin of the CSS bezier
export const EASE_MOVE = 'power3.inOut';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Split text into word spans wrapped in masked lines-ready markup. */
export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = text.split(/\s+/).map((w) => {
    const outer = document.createElement('span');
    outer.className = 'inline-block overflow-hidden align-bottom';
    const inner = document.createElement('span');
    inner.className = 'inline-block will-change-transform';
    inner.textContent = w;
    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(' '));
    return inner;
  });
  return words;
}

/** Word-by-word masked rise reveal. Returns a GSAP timeline. */
export function splitReveal(el: HTMLElement, opts: { delay?: number; stagger?: number; scroll?: boolean } = {}) {
  if (prefersReducedMotion()) return null;
  const words = splitWords(el);
  const tl = gsap.timeline({
    delay: opts.delay ?? 0,
    ...(opts.scroll
      ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      : {}),
  });
  tl.from(words, {
    yPercent: 110,
    opacity: 0,
    duration: 0.8,
    ease: EASE_REVEAL,
    stagger: opts.stagger ?? 0.05,
  });
  return tl;
}

/** Count up to a value with Indian grouping. Respects reduced motion (jumps). */
export function countUp(
  el: HTMLElement,
  to: number,
  opts: { decimals?: number; prefix?: string; suffix?: string; duration?: number; scroll?: boolean } = {},
) {
  const fmt = (v: number) =>
    (opts.prefix ?? '') +
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: opts.decimals ?? 0,
      maximumFractionDigits: opts.decimals ?? 0,
    }).format(v) +
    (opts.suffix ?? '');

  if (prefersReducedMotion()) {
    el.textContent = fmt(to);
    return;
  }

  const obj = { v: 0 };
  gsap.to(obj, {
    v: to,
    duration: opts.duration ?? 1.4,
    ease: EASE_MOVE,
    scrollTrigger: opts.scroll === false ? undefined : { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => { el.textContent = fmt(obj.v); },
    onComplete: () => { el.textContent = fmt(to); },
  });
}

/** Magnetic buttons — pull toward cursor within `radius` px. Desktop only. */
export function magnetic(el: HTMLElement, radius = 80, strength = 0.35) {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: EASE_REVEAL });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: EASE_REVEAL });
  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < radius + Math.max(r.width, r.height) / 2) {
      xTo(dx * strength);
      yTo(dy * strength);
    } else {
      xTo(0); yTo(0);
    }
  };
  const onLeave = () => { xTo(0); yTo(0); };
  window.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
  el.addEventListener('blur', onLeave);
}

/** Clip-path inset reveal (images / mockups). */
export function clipReveal(el: HTMLElement, opts: { scroll?: boolean; delay?: number } = {}) {
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { clipPath: 'inset(0 0 100% 0)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1,
      ease: EASE_MOVE,
      delay: opts.delay ?? 0,
      scrollTrigger: opts.scroll === false ? undefined : { trigger: el, start: 'top 88%', once: true },
    },
  );
}

/** Infinite marquee whose speed/direction respond to scroll velocity. */
export function marquee(track: HTMLElement) {
  // Duplicate content so the loop is seamless.
  track.innerHTML += track.innerHTML;
  const half = () => -track.scrollWidth / 2;

  if (prefersReducedMotion()) return () => {};

  const tween = gsap.to(track, { x: half(), duration: 28, ease: 'none', repeat: -1 });
  let dir = 1;
  const vel = ScrollTrigger.getVelocity();
  if (Math.abs(vel) > 800) {
    dir = vel > 0 ? -1 : 1;
    tween.timeScale(dir * 2.2);
    setTimeout(() => tween.timeScale(dir), 500);
  }
  const onScroll = () => {
    const v = ScrollTrigger.getVelocity();
    if (Math.abs(v) > 1200) {
      tween.timeScale((v > 0 ? 1 : -1) * 2.4);
      clearTimeout((marquee as any)._t);
      (marquee as any)._t = setTimeout(() => tween.timeScale(1), 400);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    tween.kill();
    window.removeEventListener('scroll', onScroll);
  };
}

/** Generic fade+rise on enter viewport (used inside app screens sparingly). */
export function revealOnScroll(el: HTMLElement, distance = 24) {
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { opacity: 0, y: Math.min(distance, 80) },
    {
      opacity: 1, y: 0, duration: 0.7, ease: EASE_REVEAL,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    },
  );
}
