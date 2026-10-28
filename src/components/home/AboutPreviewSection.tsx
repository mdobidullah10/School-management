import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Compass } from 'lucide-react';

export const AboutPreviewSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#E1E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Campus Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E1E8F0] shadow-sm bg-slate-50">
              <img
                src="/images/campus-main.jpg"
                alt="Future Leaders School Modern Campus Building in Bangladesh"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B2345]/90 via-[#0B2345]/50 to-transparent p-6 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2B544] block">
                  Campus & Community
                </span>
                <p className="font-serif text-lg font-bold">
                  A Safe, Welcoming Place to Learn and Grow
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Vision & Mission Summary */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
                <span className="text-xs uppercase tracking-widest font-bold text-[#123B70]">
                  ABOUT OUR INSTITUTION
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345] tracking-tight leading-snug">
                Empowering Students to Become Future Leaders
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#66758A] leading-relaxed">
              At Future Leaders School, we believe that education extends beyond textbooks. We provide a balanced, inclusive learning environment where curiosity is nurtured, values are cultivated, and every student is guided toward intellectual independence and responsible leadership.
            </p>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0]">
                <div className="w-7 h-7 rounded-lg bg-[#123B70] text-[#F2B544] flex items-center justify-center mb-2">
                  <Eye className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#0B2345] uppercase tracking-wide">Our Vision</h4>
                <p className="text-xs text-[#66758A] mt-1 leading-relaxed">
                  To be a premier school nurturing creative, ethical, and compassionate leaders equipped for global challenges.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0]">
                <div className="w-7 h-7 rounded-lg bg-[#2563A6] text-white flex items-center justify-center mb-2">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#0B2345] uppercase tracking-wide">Our Mission</h4>
                <p className="text-xs text-[#66758A] mt-1 leading-relaxed">
                  Fostering academic excellence, holistic development, critical thinking, and respectful citizenship.
                </p>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2563A6] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#F2B544]" />
                <span>Learn More About Us</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F2B544]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
