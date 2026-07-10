import TranslatedText from '@/app/components/translated-text';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { cvData } from '@/data/portfolio';
import { Award } from 'lucide-react';

export function AwardsSection() {
  return (
    <SectionShell id="awards" className="bg-muted/30">
      <SectionHeading title="Awards & Achievements" />
      <ul className="max-w-3xl space-y-4">
        {cvData.awards.map((award) => (
          <li
            key={award}
            className="motion-reveal flex items-start gap-3 rounded-lg border border-border/80 bg-card px-4 py-4"
          >
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed text-foreground md:text-base">
              <TranslatedText text={award} />
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
