'use client';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { BootHud } from '@/components/scroll-cinema/boot-hud';
import { BuildStage } from '@/components/scroll-cinema/build-stage';
import { CircuitLayer } from '@/components/scroll-cinema/circuit-layer';
import { useScrollCinema } from '@/components/scroll-cinema/use-scroll-cinema';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import './scroll-cinema.css';

interface ScrollCinemaShellProps {
  children: React.ReactNode;
}

export function ScrollCinemaShell({ children }: ScrollCinemaShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const enabled = !reducedMotion;

  useScrollCinema(rootRef, enabled);

  return (
    <div
      ref={rootRef}
      className={cn(
        'cinema-root',
        enabled ? 'cinema-root--active' : 'cinema-root--static'
      )}
    >
      {enabled && (
        <>
          <CircuitLayer />
          <BootHud />
        </>
      )}
      {children}
    </div>
  );
}

export { BuildStage };
