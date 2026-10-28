import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    <section className="py-16 lg:py-24 bg-white border-b border-[#E1E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#123B70]">
                CAMPUS LIFE & EXPERIENCES
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345] tracking-tight">
              School Life & Campus Gallery
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#66758A]">
              Explore our smart classrooms, science and robotics labs, athletic fields, and art studios.
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2563A6] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>View All Photos</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2B544]" />
          </Link>
        </div>

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
              className="group relative rounded-2xl overflow-hidden border border-[#E1E8F0] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer aspect-[16/11] bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#123B70]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2345]/85 via-[#0B2345]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#0B2345]/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20">
                  {item.category}
                </span>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-[#F2B544]" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                <h3 className="font-serif font-bold text-sm sm:text-base leading-snug drop-shadow-xs">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={previewItems}
        currentIndex={currentIndex}
        onNavigate={(newIndex) => setCurrentIndex(newIndex)}
      />
    </section>
  );
};
