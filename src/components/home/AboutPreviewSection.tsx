import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutPreviewSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#F3F8FD]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Campus Image with golden accent backdrop */}
          <div className="lg:col-span-6 relative">
            {/* Golden decorative accent badge */}
            <div className="absolute -top-4 -left-4 w-28 h-28 bg-[#FFB800] rounded-2xl -z-10" />
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <img
                src="/images/campus-main.jpg"
                alt="Future Leaders School Modern Academic Campus"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123B70]/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-xs uppercase font-semibold text-[#FFB800] tracking-wider">
                    Our Campus Environment
                  </p>
                  <p className="font-serif text-lg font-bold">
                    A Safe, Inspiring Place to Learn and Grow
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Details */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
                <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                  ABOUT US
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70] tracking-tight leading-snug">
                Empowering Students to Become Future Leaders
              </h2>
            </div>

            <p className="text-base text-[#65758B] leading-relaxed">
              At Future Leaders School, we believe that every child has the potential to make a difference. Our mission is to provide a nurturing, innovative, and inclusive learning environment where students can grow academically, socially, and emotionally — and build the skills they need to lead in an ever-changing world.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2167B2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#123B70]">Academic Rigor</h4>
                  <p className="text-xs text-[#65758B]">Balanced, conceptual, and inquiry-led curriculum.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2167B2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#123B70]">Character & Ethics</h4>
                  <p className="text-xs text-[#65758B]">Instilling honesty, empathy, and social responsibility.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2167B2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#123B70]">Creative Expression</h4>
                  <p className="text-xs text-[#65758B]">Thriving arts, speech, music, and debate programs.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2167B2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#123B70]">Individual Mentorship</h4>
                  <p className="text-xs text-[#65758B]">Low student-to-teacher ratio ensuring personal focus.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-sm hover:shadow active:scale-95"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 text-[#FFB800]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
