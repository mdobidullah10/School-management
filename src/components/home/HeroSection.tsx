import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F8FC] via-white to-white py-12 lg:py-20 border-b border-[#E1E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E1E8F0] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#F2B544]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#123B70]">
                FUTURE LEADERS SCHOOL • BANGLADESH
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#0B2345] tracking-tight leading-[1.18]">
              Building Bright Minds.{' '}
              <span className="text-[#2563A6] block mt-1">Shaping Future Leaders.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#66758A] leading-relaxed max-w-xl">
              Discover a learning environment where students develop knowledge, creativity, confidence, and leadership.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2563A6] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-all duration-150 active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#F2B544]" />
                <span>Explore Our School</span>
              </Link>

              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#123B70] font-bold text-sm px-6 py-3 rounded-xl border border-[#E1E8F0] shadow-xs transition-all duration-150 active:scale-95"
              >
                <span>Admission Information</span>
                <ArrowRight className="w-4 h-4 text-[#F2B544]" />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 border-t border-[#E1E8F0] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#66758A] font-medium">
              <div className="flex items-center gap-1.5 text-[#123B70]">
                <ShieldCheck className="w-4 h-4 text-[#2563A6]" />
                <span>Admissions 2026–2027 Open</span>
              </div>
              <span>•</span>
              <span>Playgroup through Secondary</span>
              <span>•</span>
              <span>Holistic Education</span>
            </div>
          </div>

          {/* Right Column: High Quality Campus Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden border border-[#E1E8F0] shadow-md bg-white">
              <img
                src="/images/students-hero.jpg"
                alt="Future Leaders School campus students in uniform engaged in collaborative learning"
                className="w-full h-[360px] sm:h-[440px] object-cover object-center"
              />

              {/* Bottom Subtle Overlay Ribbon */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B2345]/90 via-[#0B2345]/40 to-transparent p-5 text-white">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F2B544] block">
                  Learn • Grow • Lead
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-100 mt-0.5">
                  Nurturing intellectual curiosity and ethical leadership across every grade level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
