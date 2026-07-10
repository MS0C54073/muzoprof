'use client';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { registerGsap, gsap } from '@/lib/gsap/register-gsap';
import { useLayoutEffect, useRef } from 'react';

function animateReveal(
  elements: gsap.TweenTarget,
  options?: { delay?: number }
) {
  gsap.from(elements, {
    y: 28,
    opacity: 0,
    duration: 0.65,
    stagger: 0.07,
    ease: 'power2.out',
    clearProps: 'transform',
    delay: options?.delay ?? 0,
  });
}

export function usePortfolioMotion(enabled: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const active = enabled && !reducedMotion;

  useLayoutEffect(() => {
    if (!active || !rootRef.current) return;

    registerGsap();
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const heroReveals = root.querySelectorAll('#home .motion-reveal');
      if (heroReveals.length) {
        animateReveal(heroReveals);
      }

      gsap.utils.toArray<HTMLElement>('[data-motion-section]').forEach((section) => {
        if (section.id === 'home') return;

        const reveals = section.querySelectorAll('.motion-reveal');
        if (!reveals.length) return;

        gsap.from(reveals, {
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            once: true,
          },
          y: 28,
          opacity: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });

      gsap.utils.toArray<HTMLElement>('.motion-card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -3, duration: 0.22, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.22, ease: 'power2.out' });
        });
      });
    }, root);

    return () => ctx.revert();
  }, [active]);

  return { rootRef, motionEnabled: active };
}
