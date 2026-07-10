'use client';

import TranslatedText from '@/app/components/translated-text';
import { Button } from '@/components/ui/button';
import { cvData } from '@/data/portfolio';
import { generateCv } from '@/lib/generate-cv';
import { useToast } from '@/hooks/use-toast';
import { Download, Github, Linkedin, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

const GITHUB_URL = 'https://github.com/MS0C54073';
const LINKEDIN_URL = 'https://linkedin.com/in/musonda-salimu';

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
    <section id="home" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <p className="text-sm font-medium text-muted-foreground">
          <TranslatedText text="Musonda Salimu" />
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          <TranslatedText text="AI Software Engineer" />
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          <TranslatedText text="Building practical AI-powered software, automation tools, and scalable web applications with TypeScript, Python, and cloud technologies." />
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            <TranslatedText text="Download Resume" />
          </Button>
          <Button asChild variant="outline">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:${cvData.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
