import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { GraduationCap, ShieldCheck, Sparkles, Target, Trophy } from 'lucide-react';
import { advantages } from '../../data/schoolData';

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-7 h-7 text-[#123B70]" />,
  ShieldCheck: <ShieldCheck className="w-7 h-7 text-[#10B981]" />,
  Sparkles: <Sparkles className="w-7 h-7 text-[#FFB800]" />,
  Target: <Target className="w-7 h-7 text-[#2167B2]" />,
  Trophy: <Trophy className="w-7 h-7 text-[#8B5CF6]" />,
};

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="WHY CHOOSE US"
          title="The Future Leaders Advantage"
          description="We provide the complete infrastructure, pedagogical excellence, and personal mentorship young learners need to thrive."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {advantages.map((adv) => (
            <div
              key={adv.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F3F8FD] group-hover:bg-[#123B70] flex items-center justify-center mb-5 transition-colors duration-300 border border-blue-50">
                <span className="group-hover:brightness-200 transition-all">
                  {iconMap[adv.iconName] || <GraduationCap className="w-7 h-7 text-[#123B70]" />}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#123B70] group-hover:text-[#2167B2] transition-colors mb-2">
                {adv.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#65758B]">
                {adv.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
