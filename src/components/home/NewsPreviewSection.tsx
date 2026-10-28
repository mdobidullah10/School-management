import React from 'react';
import { Link } from 'react-router-dom';
import { newsItems, upcomingEvents } from '../../data/schoolData';
import { Calendar, ArrowRight, Bell, Clock, ChevronRight } from 'lucide-react';

export const NewsPreviewSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FC] border-b border-[#E1E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#123B70]">
                CAMPUS COMMUNICATIONS
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345] tracking-tight">
              Notices & Announcements
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#66758A]">
              Official circulars, academic notices, and upcoming school calendar highlights.
            </p>
          </div>

          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2563A6] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2B544]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3 News & Circular Cards */}
          <div className="lg:col-span-8 space-y-4">
            {newsItems.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs hover:shadow-md hover:border-[#123B70] transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-5 group"
              >
                <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-[#F5F8FC] border border-[#E1E8F0] text-[#123B70] font-bold text-[10px] uppercase">
                      {item.category}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center gap-1 text-[11px] text-[#66758A]">
                      <Calendar className="w-3 h-3 text-[#F2B544]" />
                      <span>{item.formattedDate}</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#0B2345] group-hover:text-[#123B70] transition-colors leading-snug">
                    <Link to="/news">{item.title}</Link>
                  </h3>

                  <p className="text-xs text-[#66758A] line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-1">
                    <Link
                      to="/news"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#123B70] hover:text-[#2563A6] transition-colors"
                    >
                      <span>Read Circular</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#F2B544]" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Column: Upcoming Events Side Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-[#E1E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E1E8F0] pb-3">
              <h3 className="font-serif font-bold text-base text-[#0B2345] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#F2B544]" />
                <span>Upcoming Calendar</span>
              </h3>
              <span className="text-[10px] font-bold bg-[#F5F8FC] text-[#2563A6] px-2 py-0.5 rounded">
                Semester 1
              </span>
            </div>

            <div className="space-y-3.5">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#123B70] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#F2B544]" />
                      {event.date}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{event.time}</span>
                  </div>
                  <h4 className="font-bold text-[#18263A] leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-[11px] text-[#66758A]">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E1E8F0]">
              <Link
                to="/study-plan"
                className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#123B70] hover:text-[#2563A6] py-2 bg-slate-50 rounded-xl transition-colors"
              >
                <span>View Full Academic Routine</span>
                <ArrowRight className="w-3 h-3 text-[#F2B544]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
