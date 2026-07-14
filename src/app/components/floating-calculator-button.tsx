
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import TranslatedText from './translated-text';

export function FloatingCalculatorButton() {
  const pathname = usePathname();

  // Don't show the button on the calculator page itself
  if (pathname === '/it-service-calculator') {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-6 right-24 z-50 group', // Move button to the left of the chat icon
      'lg:bottom-8 lg:right-28'
    )}>
      <Button
        asChild
        className={cn(
          'size-[58px] rounded-full shadow-xl overflow-hidden p-0',
          'bg-gradient-to-r from-primary to-accent text-primary-foreground',
          'hover:shadow-2xl active:scale-95',
          'transition-all duration-300 ease-in-out',
          'w-[58px] group-hover:w-64', // Match bot button size, expand on hover
          '[&_svg]:!size-9' // Match bot icon size (36px)
        )}
      >
        <Link
          href="/it-service-calculator"
          aria-label="Calculate Project Cost"
          className="flex items-center justify-center gap-0 transition-all duration-300 ease-in-out group-hover:justify-start group-hover:gap-2 group-hover:pl-4"
        >
          <Calculator className="size-9 flex-shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[12rem] group-hover:opacity-100">
            <TranslatedText text="Calculate My Project Cost" />
          </span>
        </Link>
      </Button>
    </div>
  );
}
