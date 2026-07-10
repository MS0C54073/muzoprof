import TranslatedText from '@/app/components/translated-text';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { skillCategories } from '@/data/portfolio';

export function SkillsSection() {
  return (
    <SectionShell id="skills">
      <SectionHeading
        title="Technical Skills"
        description="Technologies I use to design, build, and ship reliable software."
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {skillCategories.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              <TranslatedText text={group.category} />
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="rounded-md border-0 bg-muted px-2.5 py-1 text-xs font-normal text-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
