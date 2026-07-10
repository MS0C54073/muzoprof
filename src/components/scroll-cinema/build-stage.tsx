'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BuildStageProps {
  id: string;
  children: ReactNode;
  className?: string;
  pin?: boolean;
}

export function BuildStage({ id, children, className, pin }: BuildStageProps) {
  return (
    <div
      data-cinema-stage={id}
      data-cinema-pin={pin ? 'true' : undefined}
      className={cn('cinema-stage group/stage', className)}
    >
      <div className="cinema-stage__grid" aria-hidden />
      <svg
        className="cinema-stage__wireframe"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect
          className="cinema-wireframe-path"
          x="8"
          y="8"
          width="984"
          height="584"
          rx="18"
          pathLength="1"
        />
      </svg>
      <div className="cinema-stage__scan" aria-hidden />
      <div className="cinema-stage__pulse" aria-hidden />
      <div className="cinema-stage__content">{children}</div>
    </div>
  );
}
