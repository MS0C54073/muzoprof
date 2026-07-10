import TranslatedText from '@/app/components/translated-text';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';

export function ProfessionalSummarySection() {
  return (
    <SectionShell id="about">
      <SectionHeading title="Professional Summary" />
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
        <p>
          <TranslatedText text="AI-enabled Software Engineer (TypeScript) with CompTIA CySA+ certification, EducationUSA Scholar recognition, and winner of the International Olympiad of the Financial University for Youth (Master's Degree, 2023–2024)." />
        </p>
        <p>
          <TranslatedText text="I build practical software across AI, automation, and full-stack web development — from investment platforms and review systems to embassy IT infrastructure and AI training pipelines. Experienced with TypeScript, Python, Kubernetes, n8n, and Supabase." />
        </p>
        <p>
          <TranslatedText text="Committed to community leadership through ICT education, volunteering, and mentoring young people in Zambia and across Africa." />
        </p>
      </div>
    </SectionShell>
  );
}
