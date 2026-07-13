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
