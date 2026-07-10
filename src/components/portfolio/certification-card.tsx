import TranslatedText from '@/app/components/translated-text';
import { Card, CardContent } from '@/components/ui/card';
import type { CertificationItem } from '@/data/portfolio';
import { ExternalLink } from 'lucide-react';

interface CertificationCardProps {
  item: CertificationItem;
}

export function CertificationCard({ item }: CertificationCardProps) {
  return (
    <Card className="motion-reveal motion-card border border-border/80 bg-card text-card-foreground transition-shadow duration-200 hover:shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <p className="text-sm leading-relaxed text-foreground">
          <TranslatedText text={item.label} />
        </p>
        {item.url && (
          <a
            href={item.url}
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
