import TranslatedText from '@/app/components/translated-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/data/portfolio';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex h-full flex-col border border-border/80 bg-card transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <CardTitle className="text-lg font-semibold leading-snug tracking-tight text-foreground">
          <TranslatedText text={project.title} />
        </CardTitle>
        {project.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            <TranslatedText text={project.description} />
          </p>
        )}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-md border-0 bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="mt-auto flex gap-2 pt-0">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            <TranslatedText text="GitHub" />
          </a>
        </Button>
        {project.demo && (
          <Button asChild size="sm" className="flex-1">
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              <TranslatedText text="Live Demo" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
