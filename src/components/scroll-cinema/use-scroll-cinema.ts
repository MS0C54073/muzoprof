'use client';

import { registerGsap, gsap, ScrollTrigger, MotionPathPlugin } from '@/lib/gsap/register-gsap';
import { createDecodeTimeline, splitTextToChars } from '@/lib/gsap/text-decode';
import { useLayoutEffect } from 'react';

const BOOT_MESSAGES = [
  'Initializing neural layout engine...',
  'Calibrating blueprint grid...',
  'Routing circuit pathways...',
  'Deploying interface modules...',
  'Activating interactive controls...',
];

function isLowPowerDevice() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function useScrollCinema(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  useLayoutEffect(() => {
    if (!enabled || !rootRef.current) return;

    registerGsap();
    const root = rootRef.current;
    const lowPower = isLowPowerDevice();

    const ctx = gsap.context(() => {
      gsap.set(root, { visibility: 'visible' });

      const bootHud = root.querySelector('.cinema-boot-hud');
      const bootProgress = root.querySelector('[data-cinema-boot-progress]');
      const bootStatus = root.querySelector('[data-cinema-boot-status]');
      const circuitLayer = root.querySelector('.cinema-circuit-layer');
      const energyPulse = root.querySelector('[data-cinema-pulse]');

      gsap.set(circuitLayer, { opacity: 0 });
      gsap.set(bootHud, { opacity: 0, y: -20 });

      const bootStage = root.querySelector('[data-cinema-stage="boot"]');
      if (bootStage && bootProgress && bootStatus) {
        const bootTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: bootStage,
            start: 'top top',
            end: lowPower ? '+=40%' : '+=120%',
            pin: !lowPower,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        bootTimeline
          .to(bootHud, { opacity: 1, y: 0, duration: 0.15 }, 0)
          .to(circuitLayer, { opacity: lowPower ? 0.25 : 0.55, duration: 0.2 }, 0)
          .to(bootProgress, { scaleX: 1, duration: 0.85, ease: 'none' }, 0.05)
          .to(
            bootStage.querySelector('.cinema-stage__content'),
            {
              filter: 'saturate(1) contrast(1) blur(0px)',
              duration: 0.35,
              ease: 'power2.out',
            },
            0.25
          );

        BOOT_MESSAGES.forEach((message, index) => {
          bootTimeline.call(
            () => {
              bootStatus.textContent = message;
            },
            [],
            index * 0.18
          );
        });

        bootTimeline.to(bootHud, { opacity: 0, y: -16, duration: 0.12 }, 0.88);
      }

      if (circuitLayer && energyPulse && !lowPower) {
        gsap.to(energyPulse, {
          motionPath: {
            path: '#cinema-path-b',
            align: '#cinema-path-b',
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          duration: 8,
          repeat: -1,
          ease: 'none',
        });

        gsap.to(root.querySelectorAll('.cinema-circuit-path'), {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        });
      }

      const stages = gsap.utils.toArray<HTMLElement>('[data-cinema-stage]', root);

      stages.forEach((stage, index) => {
        const wireframe = stage.querySelector('.cinema-wireframe-path');
        const scan = stage.querySelector('.cinema-stage__scan');
        const pulse = stage.querySelector('.cinema-stage__pulse');
        const content = stage.querySelector('.cinema-stage__content');
        const grid = stage.querySelector('.cinema-stage__grid');
        const revealItems = stage.querySelectorAll('.cinema-reveal');
        const cards = stage.querySelectorAll('.cinema-card');
        const decodeTarget = stage.querySelector<HTMLElement>('[data-cinema-decode]');

        if (wireframe) {
          gsap.set(wireframe, {
            strokeDasharray: 1,
            strokeDashoffset: 1,
          });
        }

        if (content) {
          const isBoot = stage.dataset.cinemaStage === 'boot';
          gsap.set(content, {
            opacity: isBoot ? 1 : lowPower ? 1 : 0.12,
            filter: isBoot
              ? 'saturate(0.35) contrast(1.05) blur(0px)'
              : lowPower
                ? 'none'
                : 'blur(10px) saturate(0.35)',
            scale: lowPower ? 1 : isBoot ? 1 : 0.985,
          });
        }

        if (grid) {
          gsap.set(grid, { opacity: 0 });
        }

        const stageTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: index === 0 ? 'top 70%' : 'top 82%',
            end: 'top 35%',
            scrub: lowPower ? false : 0.9,
            toggleActions: lowPower ? 'play none none none' : undefined,
          },
        });

        if (lowPower) {
          stageTimeline
            .to(grid, { opacity: 0.35, duration: 0.35 }, 0)
            .to(content, { opacity: 1, duration: 0.35 }, 0)
            .from(revealItems, { y: 16, opacity: 0, duration: 0.35, stagger: 0.05 }, 0.05);
          return;
        }

        stageTimeline
          .to(grid, { opacity: 0.45, duration: 0.18 }, 0)
          .to(
            wireframe,
            {
              strokeDashoffset: 0,
              duration: 0.35,
              ease: 'power1.inOut',
            },
            0.02
          )
          .to(
            scan,
            {
              xPercent: 120,
              opacity: 1,
              duration: 0.28,
              ease: 'power2.inOut',
            },
            0.08
          )
          .to(
            content,
            {
              opacity: 1,
              filter: 'blur(0px) saturate(1)',
              scale: 1,
              duration: 0.35,
              ease: 'power2.out',
            },
            0.18
          )
          .from(
            revealItems,
            {
              y: 36,
              opacity: 0,
              rotateX: 8,
              transformOrigin: '50% 100%',
              duration: 0.28,
              stagger: 0.06,
              ease: 'power3.out',
            },
            0.24
          );

        if (cards.length > 0) {
          stageTimeline.from(
            cards,
            {
              y: 48,
              opacity: 0,
              scale: 0.92,
              duration: 0.32,
              stagger: 0.08,
              ease: 'back.out(1.4)',
            },
            0.3
          );
        }

        if (pulse) {
          stageTimeline.fromTo(
            pulse,
            { scale: 0.6, opacity: 0 },
            { scale: 1.4, opacity: 0.45, duration: 0.25, ease: 'power2.out' },
            0.2
          );
        }

        if (decodeTarget && !decodeTarget.dataset.cinemaDecoded) {
          decodeTarget.dataset.cinemaDecoded = 'true';
          ScrollTrigger.create({
            trigger: decodeTarget,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              const chars = splitTextToChars(decodeTarget);
              createDecodeTimeline(chars, 1.1);
            },
          });
        }
      });

      const cardGroups = gsap.utils.toArray<HTMLElement>('.cinema-card', root);
      cardGroups.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -4,
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.18)',
            duration: 0.25,
            ease: 'power2.out',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            boxShadow: '0 0 0 rgba(56, 189, 248, 0)',
            duration: 0.25,
            ease: 'power2.out',
          });
        });
      });

      ScrollTrigger.batch('.cinema-flip-target', {
        onEnter: (batch) => {
          gsap.from(batch, {
            scale: 0.94,
            opacity: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
          });
        },
        once: true,
        start: 'top 88%',
      });
    }, root);

    return () => ctx.revert();
  }, [enabled, rootRef]);
}
