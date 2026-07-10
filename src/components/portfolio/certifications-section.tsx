'use client';

import TranslatedText from '@/app/components/translated-text';
import { CertificationCard } from '@/components/portfolio/certification-card';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { Button } from '@/components/ui/button';
import { certificationEntries } from '@/data/portfolio';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const INITIAL_COUNT = 6;

export function CertificationsSection() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll
    ? certificationEntries
    : certificationEntries.slice(0, INITIAL_COUNT);

  return (
    <SectionShell id="certifications">
      <SectionHeading
        title="Licenses & Certifications"
        description="Professional credentials with verification links where available."
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {visible.map((cert) => (
          <CertificationCard key={cert} certification={cert} />
        ))}
      </div>
      {!showAll && certificationEntries.length > INITIAL_COUNT && (
        <div className="mt-8">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            <TranslatedText text="View All Certifications" />
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </SectionShell>
  );
}
