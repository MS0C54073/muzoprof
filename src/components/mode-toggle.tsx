
'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import TranslatedText from '@/app/components/translated-text';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setTheme(theme === 'light' ? 'dark' : 'light');
            }}
            aria-label="Toggle theme"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
