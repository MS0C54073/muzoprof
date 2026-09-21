'use client';

import TranslatedText from '@/app/components/translated-text';
import { Button } from '@/components/ui/button';
import { cvData } from '@/data/portfolio';
import { generateCv } from '@/lib/generate-cv';
import { useToast } from '@/hooks/use-toast';
import { Download, Github, Linkedin, Loader2, Mail } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const GITHUB_URL = 'https://github.com/MS0C54073';
const LINKEDIN_URL = 'https://www.linkedin.com/in/musonda-salimu-a4a0b31b9/';
const PROFILE_IMAGE_URL =
  'https://drive.google.com/thumbnail?id=18haKNolQwC6XQxH3weaKMkvFEV_rBYc6&sz=w800';

function EdusaScholarBadge() {
  return (
    <div className="motion-reveal mb-5 inline-flex max-w-fit items-center gap-3 rounded-full border border-sky-200/80 bg-gradient-to-r from-white to-sky-50/90 px-3.5 py-2 shadow-[0_10px_30px_rgba(14,116,144,0.08)] ring-1 ring-sky-100 backdrop-blur-sm dark:border-sky-800/80 dark:from-slate-900 dark:to-slate-950 dark:ring-sky-900/80">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_#0f5f8f_0%,_#0a3d5e_50%,_#061e2d_100%)] text-white shadow-inner ring-1 ring-sky-200 dark:ring-sky-700">
        <svg
          viewBox="0 0 120 120"
          aria-label="EdUSA Scholar badge"
          className="h-7 w-7"
          role="img"
        >
          <path
            d="M60 10L77 39L109 41L86 63L93 96L60 77L27 96L34 63L11 41L43 39L60 10Z"
            fill="#0a3d5e"
          />
          <path
            d="M60 32c-8.4 0-15 6.6-15 15 0 2.4.6 4.8 1.8 6.8L60 78l13.2-24.2c1.2-2 1.8-4.4 1.8-6.8 0-8.4-6.6-15-15-15Z"
            fill="#ffffff"
          />
          <path d="M44 80c7 11 16 15 16 15s9-4 16-15l-16 9-16-9Z" fill="#ffffff" />
          <path d="M60 45c8 3 17 11 15 25-2 15-9 21-15 24-4-2-11-7-14-17-3-11 2-23 14-32Z" fill="#ffffff" opacity="0.85"/>
          <path d="M72 46c8 4 12 10 12 18 0 9-5 16-12 20l-7 3 7-19 0-22Z" fill="#ffffff"/>
          <path d="M60 16l7 21h-14l7-21Z" fill="#ffffff" opacity="0.9"/>
          <path d="M34 83L56 58L64 76L51 94L34 83Z" fill="#d72638"/>
          <path d="M38 80L54 60L60 75L47 90L38 80Z" fill="#d72638"/>
          <path d="M60 52H90V64H60V52Z" fill="#d72638"/>
          <path d="M64 61H88V72H64V61Z" fill="#d72638"/>
          <path d="M60 70H84V81H60V70Z" fill="#d72638"/>
        </svg>
      </div>
      <span className="text-xs font-black tracking-[0.08em] sm:text-sm" aria-label="EdUSA scholar">
        <span className="text-[#0a3d5e]">Ed</span>
        <span className="text-[#d72638]">USA</span>
        <span className="ml-1 text-[#0a3d5e] lowercase">scholar</span>
      </span>
    </div>
  );
}

export function HeroSection() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      generateCv('download');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'An unexpected error occurred during PDF generation.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="home" data-motion-section className="py-12 md:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 px-4 md:flex-row md:items-center md:gap-12 md:px-6">
        <div className="motion-reveal relative h-36 w-36 shrink-0 overflow-hidden rounded-full border border-border bg-muted md:h-44 md:w-44">
          <Image
            src={PROFILE_IMAGE_URL}
            alt="Musonda Salimu"
            fill
            sizes="(max-width: 768px) 144px, 176px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <EdusaScholarBadge />
          <h1 className="motion-reveal text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <TranslatedText text="MUSONDA SALIMU" />
          </h1>
          <p className="motion-reveal mt-3 text-lg font-medium text-muted-foreground md:text-xl">
            <TranslatedText text="AI Software Engineer" />
          </p>
          <p className="motion-reveal mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            <TranslatedText text="Building practical AI-powered software, automation tools, and scalable web applications with TypeScript, Python, and cloud technologies." />
          </p>

          <div className="motion-reveal mt-7 flex flex-wrap gap-3">
            <Button onClick={handleDownload} disabled={isGenerating} className="transition-transform hover:-translate-y-0.5">
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              <TranslatedText text="Download Resume" />
            </Button>
            <Button asChild variant="outline" className="transition-transform hover:-translate-y-0.5">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" className="transition-transform hover:-translate-y-0.5">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" className="transition-transform hover:-translate-y-0.5">
              <a href={`mailto:${cvData.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
