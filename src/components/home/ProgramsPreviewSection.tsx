import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { academicPrograms } from '../../data/schoolData';
import { Baby, BookOpen, Compass, GraduationCap, ArrowRight } from 'lucide-react';

const programIcons: Record<string, React.ReactNode> = {
  kindergarten: <Baby className="w-8 h-8 text-rose-500" />,
  primary: <BookOpen className="w-8 h-8 text-blue-500" />,
  middle: <Compass className="w-8 h-8 text-emerald-500" />,
  secondary: <GraduationCap className="w-8 h-8 text-purple-500" />,
};

const cardTheme: Record<string, { bg: string; border: string; text: string; buttonBg: string }> = {
  kindergarten: {
    bg: 'bg-rose-50/40 hover:bg-rose-50/80',
    border: 'border-rose-100 hover:border-rose-200',
    text: 'text-rose-600',
    buttonBg: 'text-rose-600 hover:text-rose-700',
  },
  primary: {
    bg: 'bg-blue-50/40 hover:bg-blue-50/80',
    border: 'border-blue-100 hover:border-blue-200',
    text: 'text-blue-600',
    buttonBg: 'text-blue-600 hover:text-blue-700',
  },
  middle: {
    bg: 'bg-emerald-50/40 hover:bg-emerald-50/80',
    border: 'border-emerald-100 hover:border-emerald-200',
    text: 'text-emerald-600',
    buttonBg: 'text-emerald-600 hover:text-emerald-700',
  },
  secondary: {
    bg: 'bg-purple-50/40 hover:bg-purple-50/80',
    border: 'border-purple-100 hover:border-purple-200',
    text: 'text-purple-600',
    buttonBg: 'text-purple-600 hover:text-purple-700',
  },
};

export const ProgramsPreviewSection: React.FC = () => {
  return (
    <section id="programs" className="py-20 bg-[#F3F8FD]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="OUR PROGRAMS"
          title="From Early Learning to a Brighter Future"
          description="We offer comprehensive education from early childhood through secondary levels, tailoring our methodology to each developmental phase."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {academicPrograms.map((prog) => {
            const theme = cardTheme[prog.id] || cardTheme.primary;
            return (
              <div
                key={prog.id}
                className={`rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 ${theme.bg} ${theme.border}`}
              >
                <div>
                  {/* Icon & Age Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-white shadow-xs">
                      {programIcons[prog.id]}
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white text-slate-600 shadow-xs">
                      {prog.ageRange}
                    </span>
                  </div>

                  {/* Title & Grades */}
                  <h3 className="font-serif font-bold text-xl text-[#123B70] mb-1">
                    {prog.name}
                  </h3>
                  <span className={`text-xs font-semibold block mb-3 ${theme.text}`}>
                    ({prog.grades})
                  </span>

                  {/* Description */}
                  <p className="text-xs text-[#65758B] leading-relaxed mb-6">
                    {prog.shortDescription}
                  </p>
                </div>

                {/* Learn More link */}
                <div className="pt-4 border-t border-slate-200/60">
                  <Link
                    to="/academics"
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all group ${theme.buttonBg}`}
                  >
                    <span>Explore Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
