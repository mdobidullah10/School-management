import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HighlightsSection } from '../components/home/HighlightsSection';
import { AboutPreviewSection } from '../components/home/AboutPreviewSection';
import { ProgramsPreviewSection } from '../components/home/ProgramsPreviewSection';
import { TeachersPreviewSection } from '../components/home/TeachersPreviewSection';
import { NewsPreviewSection } from '../components/home/NewsPreviewSection';
import { GalleryPreviewSection } from '../components/home/GalleryPreviewSection';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Important Information Cards (Admissions, Notices, Calendar, Teachers, Contact) */}
      <HighlightsSection />

      {/* 3. About the School (2-column layout, photo, vision/mission, learn more) */}
      <AboutPreviewSection />

      {/* 4. Academic Information (Program cards: Kindergarten, Primary, Middle, Secondary) */}
      <ProgramsPreviewSection />

      {/* 5. Teachers & Staff Preview (Compact educator cards + View All link) */}
      <TeachersPreviewSection />

      {/* 6. Notices and Announcements (Official circulars & upcoming calendar) */}
      <NewsPreviewSection />

      {/* 7. Events and Gallery Preview (Consistent image aspect ratio & lightbox) */}
      <GalleryPreviewSection />

      {/* 8. Final Call to Action (Admission guidance & inquiry links) */}
      <AdmissionsCtaBanner />
    </div>
  );
};
