import TranslatedText from '@/app/components/translated-text';
import { Card, CardContent } from '@/components/ui/card';
import { parseCertificationLine } from '@/lib/generate-cv';
import { ExternalLink } from 'lucide-react';

interface CertificationCardProps {
  certification: string;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const { label, url } = parseCertificationLine(certification);

  return (
    <Card className="border border-border/80 bg-card transition-shadow duration-200 hover:shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <p className="text-sm leading-relaxed text-foreground">
          <TranslatedText text={label} />
        </p>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Verify certification"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
