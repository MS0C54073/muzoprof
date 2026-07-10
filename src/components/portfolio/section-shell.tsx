import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionShellProps {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function SectionShell({
  id,
  children,
  className,
  containerClassName,
}: SectionShellProps) {
  return (
    <section id={id} className={cn('border-t border-border/60 py-16 md:py-20', className)}>
      <div className={cn('mx-auto max-w-5xl px-4 md:px-6', containerClassName)}>
        {children}
      </div>
    </section>
  );
}
