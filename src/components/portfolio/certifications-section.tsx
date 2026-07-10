'use client';

import TranslatedText from '@/app/components/translated-text';
import { CertificationCard } from '@/components/portfolio/certification-card';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { Button } from '@/components/ui/button';
import { certificationGroups } from '@/data/portfolio';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const INITIAL_GROUPS = 3;

export function CertificationsSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleGroups = showAll
    ? certificationGroups
    : certificationGroups.slice(0, INITIAL_GROUPS);

  return (
    <SectionShell id="certifications">
      <SectionHeading
        title="Licenses & Certifications"
        description="Professional credentials with verification links where available."
      />
      <div className="space-y-10">
        {visibleGroups.map((group) => (
          <div key={group.category}>
            <h3 className="motion-reveal mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              <TranslatedText text={group.category} />
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {group.items.map((item) => (
                <CertificationCard key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {!showAll && certificationGroups.length > INITIAL_GROUPS && (
        <div className="motion-reveal mt-8">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            <TranslatedText text="View All Certifications" />
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </SectionShell>
  );
}
