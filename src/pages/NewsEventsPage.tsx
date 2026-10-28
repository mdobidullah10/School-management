import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';
import { newsItems, upcomingEvents } from '../data/schoolData';
import type { NewsItem, EventItem } from '../types';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  X,
  Share2,
  BookOpen,
  Filter,
} from 'lucide-react';

export const NewsEventsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  // If URL has ?id=news-1, auto-open that article
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const found = newsItems.find((n: NewsItem) => n.id === id);
      if (found) {
        setActiveArticle(found);
      }
    }
  }, [searchParams]);

  const categories = ['All', 'Announcements', 'Achievements', 'Events', 'Academics'];

  const filteredNews = newsItems.filter((item: NewsItem) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B2244] via-[#123B70] to-[#2167B2] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
              COMMUNITY HAPPENINGS
            </span>
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            News & Upcoming Events
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            Stay engaged with academic achievements, campus milestones, workshop schedules, and student leadership stories.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-8 border-b border-slate-100">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news & notices..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-xs text-[#18263A] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#FFB800]" />
                Filter:
              </span>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === c
                      ? 'bg-[#123B70] text-white shadow-xs'
                      : 'bg-[#F3F8FD] text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 Cols: News Articles */}
            <div className="lg:col-span-8 space-y-8">
              <h2 className="font-serif text-2xl font-bold text-[#123B70] flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#FFB800]" />
                <span>Featured Articles & Announcements</span>
              </h2>

              {filteredNews.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
                  <p>No articles matched your criteria.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredNews.map((item: NewsItem) => (
                    <article
                      key={item.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group"
                    >
                      <div className="w-full sm:w-56 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-xs mb-2">
                            <span className="bg-[#123B70] text-white px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                              {item.category}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                              <Calendar className="w-3 h-3 text-[#FFB800]" />
                              {item.formattedDate}
                            </span>
                          </div>

                          <h3
                            onClick={() => setActiveArticle(item)}
                            className="font-serif font-bold text-lg text-[#123B70] group-hover:text-[#2167B2] cursor-pointer transition-colors leading-snug mb-2"
                          >
                            {item.title}
                          </h3>

                          <p className="text-xs text-[#65758B] leading-relaxed line-clamp-2">
                            {item.summary}
                          </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                          <button
                            onClick={() => setActiveArticle(item)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123B70] hover:text-[#2167B2] transition-colors cursor-pointer"
                          >
                            <span>Read Full Story</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#FFB800]" />
                          </button>
                          <span className="text-[11px] text-slate-400">
                            By {item.author}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right 4 Cols: Upcoming Events Widget */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#F3F8FD] rounded-3xl p-6 sm:p-7 border border-blue-100 shadow-sm sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-[#123B70]" />
                  <h3 className="font-serif font-bold text-xl text-[#123B70]">
                    Upcoming Events
                  </h3>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((evt: EventItem) => (
                    <div
                      key={evt.id}
                      className="bg-white rounded-2xl p-4 border border-blue-100/60 shadow-xs hover:border-[#2167B2] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#FFB800]/20 text-[#123B70] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          {evt.category}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-[#123B70] mb-2 leading-tight">
                        {evt.title}
                      </h4>

                      <div className="space-y-1 text-[11px] text-[#65758B]">
                        <p className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-[#2167B2]" />
                          <span>{evt.date}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.time}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.location}</span>
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
                        {evt.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-blue-200/60 text-center">
                  <p className="text-xs text-[#65758B]">
                    Want to subscribe to the academic calendar?
                  </p>
                  <a
                    href="/portal"
                    className="inline-block mt-2 text-xs font-bold text-[#123B70] hover:underline"
                  >
                    View in Student & Parent Portal →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="bg-[#123B70] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {activeArticle.category}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B70] leading-snug mb-3">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 mb-6 border-b border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
                {activeArticle.formattedDate}
              </span>
              <span>•</span>
              <span>By {activeArticle.author}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="rounded-2xl overflow-hidden mb-6 h-64 sm:h-72">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-sm text-[#18263A] leading-relaxed">
              {activeArticle.content.map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Official announcement of Future Leaders School
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#123B70] hover:text-[#2167B2] cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admissions CTA */}
      <AdmissionsCtaBanner />
    </div>
  );
};
