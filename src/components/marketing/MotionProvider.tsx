'use client';
/**
 * DECREE motion core — Lenis smooth scroll synced to GSAP ScrollTrigger,
 * plus shared reduced-motion / touch detection. Mounted once in the root
 * layout; marketing sections read `useReducedMotion()` from here.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MotionCtx = createContext<{ reduced: boolean }>({ reduced: false });
export const useReducedMotion = () => useContext(MotionCtx).reduced;

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!mq.matches) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      // Sync Lenis ticker with GSAP so ScrollTrigger follows the same clock.
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Refresh triggers after fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 300);
    window.addEventListener('load', refresh);

    return () => {
      mq.removeEventListener('change', onChange);
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      gsap.ticker.remove((time) => lenis?.raf(time * 1000));
    };
  }, []);

  return <MotionCtx.Provider value={{ reduced }}>{children}</MotionCtx.Provider>;
}
