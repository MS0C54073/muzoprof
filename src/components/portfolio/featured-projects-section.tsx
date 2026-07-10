import Link from 'next/link';
import TranslatedText from '@/app/components/translated-text';
import { ProjectCard } from '@/components/portfolio/project-card';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { SectionShell } from '@/components/portfolio/section-shell';
import { Button } from '@/components/ui/button';
import { featuredProjects } from '@/data/portfolio';
import { ArrowRight } from 'lucide-react';

export function FeaturedProjectsSection() {
  return (
    <SectionShell id="projects">
      <SectionHeading
        title="Featured Projects"
        description="Selected work spanning AI applications, full-stack products, and production-ready tools."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <div className="mt-10">
        <Button asChild variant="outline">
          <Link href="/projects">
            <TranslatedText text="View All Projects" />
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionShell>
  );
}
