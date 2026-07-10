'use client';

import { usePortfolioMotion } from '@/components/portfolio/use-portfolio-motion';
import type { ReactNode } from 'react';

interface PortfolioMotionShellProps {
  children: ReactNode;
}

export function PortfolioMotionShell({ children }: PortfolioMotionShellProps) {
  const { rootRef } = usePortfolioMotion(true);

  return (
    <div ref={rootRef} className="portfolio-motion-root">
      {children}
    </div>
  );
}
