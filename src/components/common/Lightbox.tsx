import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: {
    title: string;
    image: string;
    category?: string;
    description?: string;
  }[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentItem = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((currentIndex - 1 + images.length) % images.length);
        }}
        className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((currentIndex + 1) % images.length);
        }}
        className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div
        className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black max-h-[70vh] flex items-center justify-center">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-auto max-h-[70vh] object-contain select-none"
          />
        </div>

        {/* Caption & details */}
        <div className="mt-4 text-center text-white max-w-2xl px-4">
          {currentItem.category && (
            <span className="inline-block text-xs uppercase tracking-wider font-semibold text-[#FFB800] bg-[#FFB800]/10 px-2.5 py-0.5 rounded-full mb-1">
              {currentItem.category}
            </span>
          )}
          <h3 className="font-serif text-lg font-bold">{currentItem.title}</h3>
          {currentItem.description && (
            <p className="text-sm text-slate-300 mt-1">{currentItem.description}</p>
          )}
          <p className="text-xs text-slate-400 mt-2">
            Image {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>
    </div>
  );
};
