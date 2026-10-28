import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';
import { academicPrograms, faqs } from '../data/schoolData';
import type { AcademicProgram, FaqItem } from '../types';
import {
  Award,
  ChevronDown,
  Bot,
  MessageSquare,
  Palette,
  Activity,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedProgram, setSelectedProgram] = useState<string>(academicPrograms[0].id);

  const academicFaqs = faqs.filter((f: FaqItem) => f.category === 'Academics' || f.category === 'General');

  const coCurricular = [
    {
      title: 'STEAM & Robotics Club',
      desc: 'Coding, sensors, Lego Mindstorms, and electronics design for practical problem solving.',
      icon: Bot,
    },
    {
      title: 'Debate & Model UN Society',
      desc: 'Parliamentary debate formats, rhetorical speech, global affairs, and diplomacy skills.',
      icon: MessageSquare,
    },
    {
      title: 'Creative Arts & Culture Club',
      desc: 'Drawing, painting, classical music, drama production, and cultural festival showcases.',
      icon: Palette,
    },
    {
      title: 'Sports & Athletics League',
      desc: 'Football, basketball, cricket, badminton, karate, and structured athletic fitness.',
      icon: Activity,
    },
  ];

  const currentProgram = academicPrograms.find((p: AcademicProgram) => p.id === selectedProgram) || academicPrograms[0];

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B2345] via-[#123B70] to-[#2563A6] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#F2B544] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[#F2B544] font-semibold">Academics</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#F2B544]">
              ACADEMIC FRAMEWORK
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Curriculum & Academic Wings
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl">
            A comprehensive, rigorous academic model designed to build critical intellect, practical skills, and principled character from kindergarten through graduation.
          </p>

          {/* Quick Academic Tools Navigation */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/study-plan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Daily Study Plan & Routines</span>
            </Link>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Online Result Checker</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Program Selector & Detail View */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#E1E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#123B70] block mb-1">
              EXPLORE BY GRADE STAGE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345]">
              Structured Academic Programs
            </h2>
          </div>

          {/* Program Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
            {academicPrograms.map((prog) => (
              <button
                key={prog.id}
                onClick={() => setSelectedProgram(prog.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedProgram === prog.id
                    ? 'bg-[#123B70] text-white shadow-xs'
                    : 'bg-white text-[#18263A] border border-[#E1E8F0] hover:bg-slate-100'
                }`}
              >
                {prog.name}
              </button>
            ))}
          </div>

          {/* Detailed Program Card */}
          <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
              <div className="lg:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-[#E1E8F0]">
                <img
                  src={currentProgram.image}
                  alt={currentProgram.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#F5F8FC] border border-[#E1E8F0] text-[#123B70]">
                    {currentProgram.grades}
                  </span>
                  <span className="text-xs font-semibold text-[#66758A]">
                    Target Age: {currentProgram.ageRange}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2345]">
                  {currentProgram.name}
                </h3>

                <p className="text-sm text-[#66758A] leading-relaxed">
                  {currentProgram.fullDescription}
                </p>

                {/* Key Highlights */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase text-[#0B2345] tracking-wide mb-2">
                    Key Academic Highlights:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#66758A]">
                    {currentProgram.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#123B70] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subjects */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase text-[#0B2345] tracking-wide mb-2">
                    Core Subject Curriculum:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProgram.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#F5F8FC] border border-[#E1E8F0] text-[#18263A] px-2.5 py-1 rounded-lg font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Curricular & Clubs */}
      <section className="py-16 bg-white border-b border-[#E1E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#123B70] block mb-1">
              BEYOND THE TEXTBOOK
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345]">
              Co-Curricular & Student Clubs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coCurricular.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E1E8F0] text-[#123B70] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#123B70]" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#0B2345] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#66758A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic FAQs */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#E1E8F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2345]">
              Academic Questions & Answers
            </h2>
          </div>

          <div className="space-y-3">
            {academicFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#E1E8F0] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 text-left font-bold text-sm text-[#0B2345] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#F2B544] transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-xs text-[#66758A] leading-relaxed border-t border-slate-100 pt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Admission Banner */}
      <AdmissionsCtaBanner />
    </div>
  );
};
