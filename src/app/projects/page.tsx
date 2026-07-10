import Link from 'next/link';
import TranslatedText from '@/app/components/translated-text';
import { ProjectCard } from '@/components/portfolio/project-card';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/portfolio';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Musonda Salimu',
  description: 'Full portfolio of software engineering projects.',
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <Button asChild variant="ghost" className="mb-8 -ml-2">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <TranslatedText text="Back to Home" />
        </Link>
      </Button>
      <SectionHeading
        title="All Projects"
        description="A complete archive of personal and professional software projects."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
