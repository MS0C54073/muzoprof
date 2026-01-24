
'use client';

import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import './globals.css';
import './social-bar.css'; // <--- Import the CSS file
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Calculator, ChevronDown } from 'lucide-react';
import TranslatedText from './components/translated-text';
import { FloatingCalculatorButton } from './components/floating-calculator-button';
import { useState } from 'react';
import { TranslationProvider } from './translator';
import { LanguageSelector } from './components/language-selector';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

// Metadata and Viewport are not used in client components but Next.js might still pick them up.
// For full support, you would move this to a parent layout or a metadata object export.
// For now, we'll leave it but be aware of this for future refactors.
/*
export const metadata: Metadata = {
  title: "Muzo Salimu - Personal Portfolio",
  description:
    'Muzo Salimu - Software Developer, Tech Enthusiast, and Educator',
  keywords: [
    'Muzo Salimu',
    'Software Developer',
    'Portfolio',
    'React Developer',
    'Next.js',
    'TypeScript'
  ],
  authors: [{name: 'Muzo Salimu'}],
  openGraph: {
    title: "Muzo Salimu - Personal Portfolio",
    description:
      'Muzo Salimu - Software Developer, Tech Enthusiast, and Educator',
    url: 'https://muzosniche.com',
    siteName: "Muzo Salimu's Portfolio",
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: "Muzo Salimu's Portfolio",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Muzo Salimu - Personal Portfolio",
    description:
      'Muzo Salimu - Software Developer, Tech Enthusiast, and Educator',
    images: ['https://placehold.co/1200x630.png'],
    creator: '@MuzoSalim',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
*/


const navLinks = [
    { href: '/', text: 'Home' },
    { href: '/#about', text: 'About' },
    { href: '/#skills', text: 'Skills' },
    { href: '/#projects', text: 'Projects' },
    { href: '/#experience', text: 'Experience' },
    { href: '/#education', text: 'Education' },
    { href: '/tutor', text: 'Tutor' },
    { href: '/#awards', text: 'Awards' },
    { href: '/#certifications', text: 'Certifications' },
    { href: '/it-service-calculator', text: 'IT Service Calculator' },
    { href: '/career-portal', text: 'AI Career Portal' },
    { href: '/#references', text: 'References' },
    { href: '/#contact', text: 'Contact' },
    { href: '/blog', text: 'Blog' },
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
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <BackgroundThemeProvider>
            <ViewModeProvider>
              <TranslationProvider>
                <DynamicBackground />
                
                <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
                  <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
                      <Link href="/" className="h-12 w-12 transition-transform hover:scale-110" aria-label="Go to homepage">
                          <MuzoInTechLogo />
                      </Link>
                      
                      {/* --- Desktop Nav & Controls --- */}
                      <div className="hidden lg:flex items-center gap-2">
                          <nav className={isNavDropdownOpen ? 'hidden' : 'flex items-center'}>
                            <LanguageSelector />
                            <ModeToggle />
                            <ViewModeToggle />
                            <BackgroundThemeToggle />
                          </nav>
                          <DropdownMenu onOpenChange={setNavDropdownOpen}>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost">
                                      <TranslatedText text="Menu" />
                                      <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  {navLinks.map(link => (
                                      <DropdownMenuItem key={link.href} asChild>
                                          <Link href={link.href}>
                                              <TranslatedText text={link.text} />
                                          </Link>
                                      </DropdownMenuItem>
                                  ))}
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>

                      {/* --- Mobile & Tablet Nav --- */}
                      <div className="lg:hidden flex items-center gap-2">
                          <LanguageSelector />
                          <Sheet>
                              <SheetTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                      <Menu className="h-6 w-6" />
                                      <span className="sr-only">Open menu</span>
                                  </Button>
                              </SheetTrigger>
                              <SheetContent side="right">
                                  <SheetHeader>
                                      <SheetTitle className="sr-only">
                                          <TranslatedText text="Navigation" />
                                      </SheetTitle>
                                  </SheetHeader>
                                  <nav className="flex flex-col gap-4 mt-8">
                                      {navLinks.map(link => (
                                          <SheetTrigger asChild key={link.href}>
                                              <Link href={link.href} className="text-lg font-medium hover:text-primary">
                                                  <TranslatedText text={link.text} />
                                              </Link>
                                          </SheetTrigger>
                                      ))}
                                  </nav>
                                  <div className="mt-8 pt-4 border-t">
                                    <SocialIcons className="flex flex-wrap justify-center gap-4" />
                                  </div>
                              </SheetContent>
                          </Sheet>
                      </div>
                  </div>
                </header>
                
                <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 lg:hidden">
                  <ModeToggle />
                  <ViewModeToggle />
                  <BackgroundThemeToggle />
                </div>

                <ViewModeWrapper>
                   <SocialIcons className="social-bar" />
                   <FloatingCalculatorButton />
                  <main className="pt-16 md:pt-20">
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
