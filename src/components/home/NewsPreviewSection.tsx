import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { newsItems } from '../../data/schoolData';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

export const NewsPreviewSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#F3F8FD]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="LATEST UPDATES"
          title="School News & Announcements"
          description="Stay informed with the latest happenings, academic highlights, student achievements, and administrative updates."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#123B70] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date & Read time */}
                  <div className="flex items-center gap-4 text-xs text-[#65758B] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>{item.formattedDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.readTime}</span>
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-serif font-bold text-lg text-[#123B70] group-hover:text-[#2167B2] transition-colors leading-snug line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-[#65758B] leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Read More Link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/news?id=${item.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123B70] hover:text-[#2167B2] group-hover:translate-x-1 transition-all"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFB800]" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-sm hover:shadow"
          >
            <span>View All School News & Events</span>
            <ArrowRight className="w-4 h-4 text-[#FFB800]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
