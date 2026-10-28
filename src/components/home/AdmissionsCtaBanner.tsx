import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export const AdmissionsCtaBanner: React.FC = () => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B2244] via-[#123B70] to-[#2167B2] p-8 sm:p-12 shadow-2xl text-white">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#FFB800]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            {/* Left: Icon & Pitch */}
            <div className="flex flex-col sm:flex-row items-center gap-6 max-w-3xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11 text-[#FFB800]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ADMISSIONS 2026–2027 ARE NOW OPEN</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                  Your Child’s Journey to a Brighter Future Starts Here.
                </h3>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  Discover a learning environment where every student is encouraged to learn, grow, and lead with purpose, confidence, and resilience.
                </p>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2.5 bg-[#FFB800] hover:bg-yellow-400 text-[#123B70] font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-5 h-5 text-[#123B70]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
