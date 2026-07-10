import TranslatedText from '@/app/components/translated-text';
import { AwardsSection } from '@/components/portfolio/awards-section';
import { CertificationsSection } from '@/components/portfolio/certifications-section';
import { CommunitySection } from '@/components/portfolio/community-section';
import { ContactSection } from '@/components/portfolio/contact-section';
import { EducationSection } from '@/components/portfolio/education-section';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { FeaturedProjectsSection } from '@/components/portfolio/featured-projects-section';
import { HeroSection } from '@/components/portfolio/hero-section';
import { ProfessionalSummarySection } from '@/components/portfolio/professional-summary-section';
import { SkillsSection } from '@/components/portfolio/skills-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjectsSection />
      <ProfessionalSummarySection />
      <AwardsSection />
      <SkillsSection />
      <ExperienceSection />
      <CertificationsSection />
      <EducationSection />
      <CommunitySection />
      <ContactSection />
      <footer className="border-t border-border/60 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          <TranslatedText text="© 2026 Musonda Salimu. All Rights Reserved." />
        </p>
      </footer>
    </>
  );
}
