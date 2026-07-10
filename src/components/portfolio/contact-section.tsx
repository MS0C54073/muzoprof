'use client';

import TranslatedText from '@/app/components/translated-text';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { Button } from '@/components/ui/button';
import { cvData } from '@/data/portfolio';
import { generateCv } from '@/lib/generate-cv';
import { useToast } from '@/hooks/use-toast';
import { Download, Github, Linkedin, Loader2, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

const GITHUB_URL = 'https://github.com/MS0C54073';
const LINKEDIN_URL = 'https://linkedin.com/in/musonda-salimu';

export function ContactSection() {
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
    <SectionShell id="contact">
      <SectionHeading
        title="Contact"
        description="Reach out for collaborations, opportunities, or technical discussions."
      />
      <div className="flex max-w-2xl flex-col gap-4">
        <a
          href={`mailto:${cvData.email}`}
          className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary md:text-base"
        >
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
          {cvData.email}
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary md:text-base"
        >
          <Linkedin className="h-4 w-4 shrink-0 text-muted-foreground" />
          linkedin.com/in/musonda-salimu
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary md:text-base"
        >
          <Github className="h-4 w-4 shrink-0 text-muted-foreground" />
          github.com/MS0C54073
        </a>
        <p className="flex items-center gap-3 text-sm text-foreground md:text-base">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <TranslatedText text={cvData.location} />
        </p>
        <div className="pt-2">
          <Button onClick={handleDownload} disabled={isGenerating} variant="outline">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            <TranslatedText text="Download Resume" />
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
