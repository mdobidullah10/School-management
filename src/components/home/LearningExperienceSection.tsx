import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { learningExperiences } from '../../data/schoolData';
import { Sparkles, Monitor, FlaskConical, BookOpen, Palette, Dumbbell } from 'lucide-react';

const tagIcons: Record<string, React.ReactNode> = {
  'Technology in Education': <Monitor className="w-3.5 h-3.5 text-[#2167B2]" />,
  'Hands-on STEM': <FlaskConical className="w-3.5 h-3.5 text-[#10B981]" />,
  'Literacy & Research': <BookOpen className="w-3.5 h-3.5 text-[#FFB800]" />,
  'Creativity & Culture': <Palette className="w-3.5 h-3.5 text-[#EC4899]" />,
  'Physical Health': <Dumbbell className="w-3.5 h-3.5 text-[#8B5CF6]" />,
};

export const LearningExperienceSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="CAMPUS LIFE & PEDAGOGY"
          title="An Enriching Learning Experience"
          description="Beyond textbooks, we cultivate real-world competence through experiential labs, immersive library sessions, creative studios, and competitive athletics."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {learningExperiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`group rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                index === 0 ? 'lg:col-span-2 md:col-span-2' : ''
              }`}
            >
              <div className="relative overflow-hidden h-56 sm:h-64">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  {tagIcons[exp.tag] || <Sparkles className="w-3.5 h-3.5 text-[#2167B2]" />}
                  <span>{exp.tag}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#123B70] group-hover:text-[#2167B2] transition-colors mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-[#65758B] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
