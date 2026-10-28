import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F8FD] via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#2167B2]/20 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FFB800]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#123B70]">
                WELCOME TO FUTURE LEADERS SCHOOL
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#123B70] tracking-tight leading-[1.15]">
              Building Bright Minds.{' '}
              <span className="text-[#2167B2] block mt-1">Shaping Future Leaders.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-[#65758B] leading-relaxed max-w-xl">
              At Future Leaders School, we nurture curiosity, inspire creativity, and empower every student to achieve their full potential in an environment centered on integrity and academic rigor.
            </p>

            {/* Bullet Highlights */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-slate-700 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#FFB800]" />
                World-Class Curriculum
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#FFB800]" />
                Student-Centered Mentorship
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#FFB800]" />
                Safe & Modern Campus
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/academics"
                className="inline-flex items-center gap-2.5 bg-[#FFB800] hover:bg-[#e6a600] text-[#123B70] font-bold text-base px-7 py-3.5 rounded-full shadow-md shadow-amber-500/20 hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Explore Our Programs</span>
                <ArrowRight className="w-4 h-4 text-[#123B70]" />
              </Link>

              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white font-semibold text-base px-6 py-3.5 rounded-full transition-all duration-200 hover:shadow-md active:scale-95"
              >
                <span>Apply for Admission</span>
              </Link>
            </div>

            {/* Micro proof info */}
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1 text-[#123B70] font-semibold">
                <BookOpen className="w-4 h-4 text-[#2167B2]" />
                <span>Admissions 2026–27 Open</span>
              </div>
              <span>•</span>
              <span>Playgroup through Secondary</span>
              <span>•</span>
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-6 relative">
            {/* Visual Frame */}
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Background decorative offset card */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#123B70] to-[#2167B2] opacity-15 transform rotate-1 scale-[1.02] filter blur-[2px]" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="/images/students-hero.jpg"
                  alt="Future Leaders School students smiling in uniform on campus"
                  className="w-full h-[380px] sm:h-[460px] object-cover object-center"
                />

                {/* Floating Badge Card 1 (Bottom Left) */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F8FD] flex items-center justify-center shrink-0 border border-blue-100">
                    <Sparkles className="w-5 h-5 text-[#FFB800]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#123B70] uppercase tracking-wide">
                      Leadership In Action
                    </h4>
                    <p className="text-[11px] text-[#65758B]">
                      Empowering young learners to innovate, create, and lead.
                    </p>
                  </div>
                </div>

                {/* Floating Tag 2 (Top Right) */}
                <div className="absolute top-4 right-4 bg-[#123B70]/90 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                  <span>Learn • Grow • Lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
