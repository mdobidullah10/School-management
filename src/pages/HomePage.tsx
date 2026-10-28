import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HighlightsSection } from '../components/home/HighlightsSection';
import { AboutPreviewSection } from '../components/home/AboutPreviewSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { ProgramsPreviewSection } from '../components/home/ProgramsPreviewSection';
import { LearningExperienceSection } from '../components/home/LearningExperienceSection';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';
import { GalleryPreviewSection } from '../components/home/GalleryPreviewSection';
import { NewsPreviewSection } from '../components/home/NewsPreviewSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* A. Hero Section */}
      <HeroSection />

      {/* B. School Highlights (5 cards) */}
      <HighlightsSection />

      {/* C. About Our School */}
      <AboutPreviewSection />

      {/* D. Why Choose Us */}
      <WhyChooseUsSection />

      {/* E. Academic Programs (4 cards) */}
      <ProgramsPreviewSection />

      {/* F. Learning Experience */}
      <LearningExperienceSection />

      {/* G. Admissions Call to Action */}
      <AdmissionsCtaBanner />

      {/* H. Campus Gallery Preview */}
      <GalleryPreviewSection />

      {/* I. News and Events */}
      <NewsPreviewSection />

      {/* J. Testimonials */}
      <TestimonialsSection />
    </div>
  );
};
