'use client';
/** Scroll choreography for the landing page: pinned scrub through the three
 *  "how it works" steps, mouse-tilt on the hero mockup, CTA band wipe and
 *  velocity-reactive marquee. All effects no-op under reduced motion. */
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, marquee as marqueeBoost } from '@/lib/motion';

export function LandingMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      /* Pinned how-it-works scrub (desktop only) */
      if (window.innerWidth >= 1024 && !prefersReducedMotion()) {
        const steps = gsap.utils.toArray<HTMLElement>('.how-step');
        gsap.timeline({
          scrollTrigger: {
            trigger: '.how-section', start: 'top top', end: 'bottom bottom',
            scrub: 0.6, invalidateOnRefresh: true,
          },
        })
          .to('.how-steps', { xPercent: -33.333, ease: 'power3.inOut' }, 0)
          .call(() => setActive(steps, 0), undefined, 0)
          .to({}, {}, 0.33)
          .call(() => setActive(steps, 1))
          .to('.how-steps', { xPercent: -66.666, ease: 'power3.inOut' }, '<')
          .to({}, {}, 0.33)
          .call(() => setActive(steps, 2));
        gsap.to('.how-progress-fill', {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: '.how-section', start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        });
      } else {
        /* Mobile / reduced: stacked reveal + IO-driven active state */
        const io = new IntersectionObserver(
          (es) => es.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting)),
          { threshold: 0.4 },
        );
        document.querySelectorAll('.how-step').forEach((s) => io.observe(s));
      }

      /* Hero mockup mouse tilt — max 8px shift, 3° rotation */
      const tilt = document.querySelector<HTMLElement>('.hero-tilt');
      if (tilt && !prefersReducedMotion() && !window.matchMedia('(pointer: coarse)').matches) {
        const zone = tilt.parentElement!;
        const onMove = (e: MouseEvent) => {
          const r = zone.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width / 2) / r.width;
          const dy = (e.clientY - r.top - r.height / 2) / r.height;
          tilt.style.transform = `translate(${dx * 8}px, ${dy * 8}px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
        };
        const onLeave = () => { tilt.style.transform = ''; };
        zone.addEventListener('mousemove', onMove);
        zone.addEventListener('mouseleave', onLeave);
        return () => { zone.removeEventListener('mousemove', onMove); zone.removeEventListener('mouseleave', onLeave); };
      }

      /* Marquee speed reacts to scroll velocity */
      document.querySelectorAll('.marquee').forEach((m) => marqueeBoost(m as HTMLElement));

      /* Final CTA wipes to deep green on enter */
      const band = document.querySelector('.cta-band');
      if (band) {
        ScrollTrigger.create({
          trigger: band, start: 'top 70%',
          onEnter: () => band.classList.add('is-green'),
          onEnterBack: () => band.classList.add('is-green'),
        });
      }
    });
    return () => ctx.revert();
  }, []);
  return null;
}

function setActive(steps: HTMLElement[], idx: number) {
  steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
}
