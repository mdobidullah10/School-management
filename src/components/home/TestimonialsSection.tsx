import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { testimonials } from '../../data/schoolData';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="WHAT PARENTS SAY"
          title="Trusted by Families, Loved by Students"
          description="Hear thoughts from parents and guardians who have chosen Future Leaders School for their children's formative educational journey."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-7 border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group hover:border-blue-100"
            >
              <div>
                <Quote className="w-8 h-8 text-[#FFB800]/40 mb-4 group-hover:text-[#FFB800] transition-colors" />
                <p className="text-sm text-[#18263A] leading-relaxed italic mb-6">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FFB800]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#123B70]">
                    {test.name}
                  </h4>
                  <p className="text-xs text-[#65758B]">
                    {test.role}
                  </p>
                  <span className="inline-block text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5 font-medium">
                    Demo Testimonial
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
