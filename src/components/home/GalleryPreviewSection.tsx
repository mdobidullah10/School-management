import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { Lightbox } from '../common/Lightbox';
import { galleryItems } from '../../data/schoolData';
import { Eye, ArrowRight } from 'lucide-react';

export const GalleryPreviewSection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Take the first 6 items for the preview
  const previewItems = galleryItems.slice(0, 6);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="CAMPUS LIFE IN PICTURES"
          title="Campus Life & Learning Gallery"
          description="Take a visual tour through our lively classrooms, modern laboratories, athletic fields, and collaborative creative spaces."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewItems.map((item, index) => (
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
              aria-label={`View ${item.title}`}
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer h-64 sm:h-72 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {item.category}
                </span>
              </div>

              {/* Hover inspect icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-[#FFB800]" />
              </div>

              {/* Title & Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="font-serif font-bold text-base sm:text-lg group-hover:text-[#FFB800] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View full gallery button */}
        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-[#F3F8FD] hover:bg-[#123B70] text-[#123B70] hover:text-white border border-blue-200/60 font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 shadow-xs hover:shadow"
          >
            <span>View All Campus Photographs</span>
            <ArrowRight className="w-4 h-4 text-[#FFB800]" />
          </Link>
        </div>
      </div>

      {/* Accessible Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={previewItems}
        currentIndex={currentIndex}
        onNavigate={(newIdx) => setCurrentIndex(newIdx)}
      />
    </section>
  );
};
