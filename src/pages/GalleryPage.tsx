import React, { useState } from 'react';
import { Lightbox } from '../components/common/Lightbox';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';
import { galleryItems } from '../data/schoolData';
import type { GalleryItem } from '../types';
import { Eye, Filter } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = ['All', 'Campus', 'Classrooms', 'Activities', 'Sports', 'Events'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item: GalleryItem) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner with Breadcrumbs */}
      <section className="bg-gradient-to-r from-[#0B2345] via-[#123B70] to-[#2563A6] text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-3" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[#F2B544] transition-colors">Home</a>
            <span className="opacity-60">/</span>
            <span className="text-[#F2B544] font-semibold">Campus Gallery</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#F2B544]">
              CAMPUS IN FOCUS
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Campus Life & Photo Gallery
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl">
            Experience the vibrant spirit of our students, the energy of our science labs, and the joy of creative discovery.
          </p>
        </div>
      </section>

      {/* Filter and Grid */}
      <section className="py-16 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-2">
              <Filter className="w-4 h-4 text-[#FFB800]" />
              <span>Filter by:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#123B70] text-white shadow-sm'
                    : 'bg-[#F3F8FD] text-slate-600 hover:bg-slate-200/70 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: GalleryItem, index: number) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View photo: ${item.title}`}
                className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer h-72 sm:h-80 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 text-[#FFB800]" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-serif font-bold text-base sm:text-lg group-hover:text-[#FFB800] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <p>No photos found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredItems}
        currentIndex={lightboxIndex}
        onNavigate={(newIdx: number) => setLightboxIndex(newIdx)}
      />

      {/* Admissions CTA */}
      <AdmissionsCtaBanner />
    </div>
  );
};
