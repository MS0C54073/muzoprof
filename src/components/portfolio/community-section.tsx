import TranslatedText from '@/app/components/translated-text';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { communityInvolvement } from '@/data/portfolio';

export function CommunitySection() {
  return (
    <SectionShell id="community">
      <SectionHeading
        title="Community Leadership"
        description="Volunteering, teaching, and leadership outside of professional roles."
      />
      <div className="max-w-3xl space-y-8">
        {communityInvolvement.map((entry) => (
          <div key={`${entry.title}-${entry.duration}`}>
            <h3 className="text-base font-semibold text-foreground">
              <TranslatedText text={entry.title} />
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <TranslatedText text={entry.company} />
              <span className="mx-2">·</span>
              <TranslatedText text={entry.duration} />
            </p>
            <ul className="mt-3 space-y-2 border-l border-border pl-4">
              {entry.details.map((detail) => (
                <li key={detail} className="text-sm leading-relaxed text-muted-foreground">
                  <TranslatedText text={detail} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
