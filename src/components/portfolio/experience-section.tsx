'use client';

import TranslatedText from '@/app/components/translated-text';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { professionalExperiences } from '@/data/portfolio';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const INITIAL_COUNT = 5;

export function ExperienceSection() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll
    ? professionalExperiences
    : professionalExperiences.slice(0, INITIAL_COUNT);

  return (
    <SectionShell id="experience">
      <SectionHeading
        title="Professional Experience"
        description="Recent roles and selected contributions, newest first."
      />
      <Accordion type="multiple" className="w-full space-y-3">
        {visible.map((exp, index) => (
          <AccordionItem
            key={`${exp.title}-${exp.duration}`}
            value={`exp-${index}`}
            className="motion-reveal rounded-lg border border-border/80 bg-card px-4 md:px-5"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="text-left">
                <h3 className="text-base font-semibold text-foreground md:text-lg">
                  <TranslatedText text={exp.title} />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  <TranslatedText text={exp.company} />
                  <span className="mx-2">·</span>
                  <TranslatedText text={exp.duration} />
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {exp.location && (
                <p className="mb-3 text-sm text-muted-foreground">{exp.location}</p>
              )}
              <ul className="space-y-2 border-l border-border pl-4">
                {exp.details.map((detail) => (
                  <li key={detail} className="text-sm leading-relaxed text-muted-foreground">
                    <TranslatedText text={detail} />
                  </li>
                ))}
              </ul>
              {exp.tags && exp.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {!showAll && professionalExperiences.length > INITIAL_COUNT && (
        <div className="mt-8">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            <TranslatedText text="View Earlier Experience" />
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </SectionShell>
  );
}
