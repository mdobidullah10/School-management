import React from 'react';
import { Link } from 'react-router-dom';
import { academicPrograms } from '../../data/schoolData';
import { ChevronRight } from 'lucide-react';

export const ProgramsPreviewSection: React.FC = () => {
  return (
    <section id="programs" className="py-16 lg:py-24 bg-[#F5F8FC] border-b border-[#E1E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#123B70]">
              ACADEMIC WINGS
            </span>
            <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345] tracking-tight">
            Academic Programs & Grade Levels
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#66758A]">
            A progressive, continuous learning pathway from foundational early years to pre-university preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {academicPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs hover:shadow-md hover:border-[#123B70] transition-all duration-200 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo container */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={prog.image}
                    alt={prog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#123B70] text-white">
                      {prog.ageRange}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-bold text-[#2563A6] block mb-1">
                    {prog.grades}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#0B2345] group-hover:text-[#123B70] transition-colors leading-snug">
                    {prog.name}
                  </h3>
                  <p className="text-xs text-[#66758A] mt-2 line-clamp-3 leading-relaxed">
                    {prog.shortDescription}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-[#E1E8F0] space-y-1">
                    {prog.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#66758A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F2B544] shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1">
                <Link
                  to="/academics"
                  className="w-full inline-flex items-center justify-between text-xs font-bold text-[#123B70] group-hover:text-[#2563A6] bg-slate-50 group-hover:bg-[#F5F8FC] py-2 px-3 rounded-xl border border-slate-200/80 transition-colors"
                >
                  <span>Curriculum Details</span>
                  <ChevronRight className="w-4 h-4 text-[#F2B544] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
