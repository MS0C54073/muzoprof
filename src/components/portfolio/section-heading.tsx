import TranslatedText from '@/app/components/translated-text';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  title,
  description,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      <h2 className="motion-reveal text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        <TranslatedText text={title} />
      </h2>
      {description && (
        <p className="motion-reveal mt-3 text-base leading-relaxed text-muted-foreground">
          <TranslatedText text={description} />
        </p>
      )}
    </div>
  );
}
