import Link from 'next/link';
import TranslatedText from '@/app/components/translated-text';
import { SectionHeading } from '@/components/portfolio/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | Musonda Salimu',
  description: 'Tools and services built for career development and IT consulting.',
};

const products = [
  {
    title: 'AI Cover Letter Generator',
    description:
      'Generate tailored cover letters using AI — upload a CV and job description to produce a professional draft in seconds.',
    href: '/cover-letter-generator',
  },
  {
    title: 'AI Career Portal',
    description:
      'Career guidance platform with AI-assisted tools for job seekers and professionals exploring new opportunities.',
    href: '/career-portal',
  },
  {
    title: 'IT Service Calculator',
    description:
      'Estimate project costs for web development, IT support, and software engineering services.',
    href: '/it-service-calculator',
  },
];

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <Button asChild variant="ghost" className="mb-8 -ml-2">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <TranslatedText text="Back to Home" />
        </Link>
      </Button>
      <SectionHeading
        title="Products"
        description="Standalone tools and services built alongside my portfolio work."
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.href}
            className="flex flex-col border border-border/80 transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                <TranslatedText text={product.title} />
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                <TranslatedText text={product.description} />
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={product.href}>
                  <TranslatedText text="Open" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
