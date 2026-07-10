'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import './social-bar.css'; 
import {ModeToggle} from '@/components/mode-toggle';
import {ThemeProvider} from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { ViewModeProvider } from '@/app/components/view-mode-provider';
import { ViewModeToggle } from '@/app/components/view-mode-toggle';
import { ViewModeWrapper } from '@/app/components/view-mode-wrapper';
import { BackgroundThemeProvider } from './components/background-theme-provider';
import { BackgroundThemeToggle } from './components/background-theme-toggle';
import { DynamicBackground } from './components/dynamic-background';
import Link from 'next/link';
import { MuzoInTechLogo } from '@/components/icons';
import { SocialIcons } from '@/components/social-icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown } from 'lucide-react';
import TranslatedText from './components/translated-text';
import { FloatingCalculatorButton } from './components/floating-calculator-button';
import { useState } from 'react';
import { TranslationProvider } from './translator';
import { LanguageSelector } from './components/language-selector';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const primaryNavLinks = [
    { href: '/#projects', text: 'Projects' },
    { href: '/#experience', text: 'Experience' },
    { href: '/tutor', text: 'Tutor' },
    { href: '/blog', text: 'Blog' },
    { href: '/products', text: 'Products' },
    { href: '/#contact', text: 'Contact' },
];

const moreNavLinks = [
    { href: '/', text: 'Home' },
    { href: '/#about', text: 'About' },
    { href: '/#skills', text: 'Skills' },
    { href: '/#awards', text: 'Awards' },
    { href: '/#certifications', text: 'Certifications' },
    { href: '/#education', text: 'Education' },
    { href: '/projects', text: 'All Projects' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isNavDropdownOpen, setNavDropdownOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning style={{ scrollBehavior: 'smooth' }}>
      <head>
          <script defer src="https://app.fastbots.ai/embed.js" data-bot-id="cmh8c3c0903nhqq1lewbb5fyu"></script>
      </head>
      <body className={`${inter.variable} font-sans antialiased selection:bg-primary/20`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <BackgroundThemeProvider>
            <ViewModeProvider>
              <TranslationProvider>
                <DynamicBackground />
                
                <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/90">
                  <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-8">
                      {/* Logo Section */}
                      <Link href="/" className="flex h-12 w-14 md:w-16 flex-shrink-0 items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95" aria-label="Go to homepage">
                          <MuzoInTechLogo className="h-full w-full drop-shadow-md" />
                      </Link>
                      
                      {/* Desktop Navigation & Controls */}
                      <div className="hidden lg:flex items-center gap-4">
                          <nav className="flex items-center gap-0.5">
                            {primaryNavLinks.map((link) => (
                              <Button key={link.href} variant="ghost" asChild className="text-sm font-medium">
                                <Link href={link.href}>
                                  <TranslatedText text={link.text} />
                                </Link>
                              </Button>
                            ))}

                            <DropdownMenu onOpenChange={setNavDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-sm font-medium">
                                        <TranslatedText text="More" />
                                        <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isNavDropdownOpen && "rotate-180")} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 mt-2">
                                    {moreNavLinks.map(link => (
                                        <DropdownMenuItem key={link.href} asChild className="cursor-pointer">
                                            <Link href={link.href}>
                                                <TranslatedText text={link.text} />
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </nav>

                          <div className="h-6 w-px bg-border/60 mx-2" />

                          <div className="flex items-center gap-1.5">
                            <LanguageSelector />
                            <ModeToggle />
                            <ViewModeToggle />
                            <BackgroundThemeToggle />
                          </div>
                      </div>

                      {/* Mobile & Tablet Interface */}
                      <div className="lg:hidden flex items-center gap-2">
                          <LanguageSelector />
                          <Sheet>
                              <SheetTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5">
                                      <Menu className="h-6 w-6" />
                                      <span className="sr-only">Open menu</span>
                                  </Button>
                              </SheetTrigger>
                              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border/40 backdrop-blur-xl bg-background/90">
                                  <SheetHeader className="text-left border-b pb-6 mb-6">
                                      <SheetTitle className="text-2xl font-black text-primary flex items-center gap-2">
                                          <MuzoInTechLogo className="h-8 w-8" />
                                          <TranslatedText text="Navigation" />
                                      </SheetTitle>
                                  </SheetHeader>
                                  <nav className="flex flex-col gap-1">
                                      {[...primaryNavLinks, ...moreNavLinks].map(link => (
                                          <SheetClose asChild key={`${link.href}-${link.text}`}>
                                              <Link 
                                                href={link.href} 
                                                className="flex items-center py-3 px-4 text-base font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                                              >
                                                  <TranslatedText text={link.text} />
                                              </Link>
                                          </SheetClose>
                                      ))}
                                  </nav>
                                  <div className="absolute bottom-10 left-6 right-6 pt-6 border-t">
                                    <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest mb-4 text-center"><TranslatedText text="Connect with Muzo" /></p>
                                    <SocialIcons className="flex flex-wrap justify-center gap-4" />
                                  </div>
                              </SheetContent>
                          </Sheet>
                      </div>
                  </div>
                </header>
                
                {/* Mobile Floating Action Bar */}
                <div className="fixed top-[4.5rem] right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
                  <div className="flex flex-col gap-2 p-1.5 bg-background/60 backdrop-blur-md rounded-2xl border border-border/40 shadow-lg">
                    <ModeToggle />
                    <ViewModeToggle />
                    <BackgroundThemeToggle />
                  </div>
                </div>

                <ViewModeWrapper>
                   <SocialIcons className="social-bar" />
                   <FloatingCalculatorButton />
                  <main className="pt-14 md:pt-16">
                      {children}
                  </main>
                </ViewModeWrapper>
                <Toaster />
              </TranslationProvider>
            </ViewModeProvider>
          </BackgroundThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
