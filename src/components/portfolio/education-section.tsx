import TranslatedText from '@/app/components/translated-text';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { educationData, postgraduateDiplomasData } from '@/data/portfolio';

export function EducationSection() {
  return (
    <SectionShell id="education">
      <SectionHeading title="Education" />
      <div className="relative max-w-3xl space-y-8 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
        {educationData.map((entry) => (
          <div key={`${entry.degree}-${entry.duration}`} className="motion-reveal relative pl-8">
            <span
              className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-primary bg-background"
              aria-hidden
            />
            <h3 className="text-base font-semibold text-foreground">
              <TranslatedText text={entry.degree} />
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <TranslatedText text={entry.university} />
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              <TranslatedText text={entry.duration} />
            </p>
          </div>
        ))}
      </div>

      {postgraduateDiplomasData.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-6 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <TranslatedText text="Postgraduate Diplomas" />
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {postgraduateDiplomasData.map((diploma) => (
              <div
                key={diploma.title}
                className="motion-reveal rounded-lg border border-border/80 bg-card px-4 py-4"
              >
                <p className="text-sm font-medium text-foreground">
                  <TranslatedText text={diploma.title} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <TranslatedText text={diploma.institution} />
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{diploma.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionShell>
  );
}
