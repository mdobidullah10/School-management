import React from 'react';
import { GraduationCap, Users, Lightbulb, Trophy, HeartHandshake } from 'lucide-react';
import { schoolHighlights } from '../../data/schoolData';

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-6 h-6 text-[#123B70]" />,
  Users: <Users className="w-6 h-6 text-[#10B981]" />,
  Lightbulb: <Lightbulb className="w-6 h-6 text-[#FFB800]" />,
  Trophy: <Trophy className="w-6 h-6 text-[#8B5CF6]" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6 text-[#EC4899]" />,
};

const bgMap: Record<string, string> = {
  GraduationCap: 'bg-blue-50 group-hover:bg-[#123B70] group-hover:text-white',
  Users: 'bg-emerald-50 group-hover:bg-[#10B981] group-hover:text-white',
  Lightbulb: 'bg-amber-50 group-hover:bg-[#FFB800] group-hover:text-[#123B70]',
  Trophy: 'bg-purple-50 group-hover:bg-[#8B5CF6] group-hover:text-white',
  HeartHandshake: 'bg-pink-50 group-hover:bg-[#EC4899] group-hover:text-white',
};

export const HighlightsSection: React.FC = () => {
  return (
    <section className="py-12 bg-white relative -mt-6 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {schoolHighlights.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                  bgMap[item.iconName] || 'bg-blue-50'
                }`}
              >
                {iconMap[item.iconName] || <GraduationCap className="w-6 h-6 text-[#123B70]" />}
              </div>
              <h3 className="font-serif font-bold text-base text-[#123B70] group-hover:text-[#2167B2] transition-colors mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#65758B]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
