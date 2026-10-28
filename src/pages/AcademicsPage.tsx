import React, { useState } from 'react';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';
import { academicPrograms, faqs } from '../data/schoolData';
import type { AcademicProgram, FaqItem } from '../types';
import {
  BookOpen,
  FlaskConical,
  Award,
  ChevronDown,
  Bot,
  MessageSquare,
  Palette,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedProgram, setSelectedProgram] = useState<string>(academicPrograms[0].id);

  const academicFaqs = faqs.filter((f: FaqItem) => f.category === 'Academics' || f.category === 'General');

  const coCurricular = [
    {
      title: 'STEAM & Robotics Club',
      desc: 'Coding, sensors, Lego Mindstorms, and electronics design for practical problem solving.',
      icon: <Bot className="w-5 h-5 text-[#2167B2]" />,
    },
    {
      title: 'Debate & Model UN Society',
      desc: 'Parliamentary debate formats, rhetorical speech, global affairs, and diplomacy skills.',
      icon: <MessageSquare className="w-5 h-5 text-[#10B981]" />,
    },
    {
      title: 'Creative Arts & Culture Club',
      desc: 'Drawing, painting, classical music, drama production, and cultural festival showcases.',
      icon: <Palette className="w-5 h-5 text-[#EC4899]" />,
    },
    {
      title: 'Sports & Martial Arts League',
      desc: 'Football, basketball, cricket, badminton, karate, and structured athletic fitness.',
      icon: <Activity className="w-5 h-5 text-[#8B5CF6]" />,
    },
  ];

  const currentProgram = academicPrograms.find((p: AcademicProgram) => p.id === selectedProgram) || academicPrograms[0];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B2244] via-[#123B70] to-[#2167B2] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
              ACADEMIC EXCELLENCE
            </span>
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Curriculum & Learning Journey
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            A comprehensive, rigorous academic model designed to build critical intellect, practical skills, and principled character from kindergarten through graduation.
          </p>
        </div>
      </section>

      {/* Curriculum Overview & Educational Model */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                PEDAGOGICAL FRAMEWORK
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70] leading-tight">
                Inquiry-Led, Globally Inspired Education
              </h2>
              <p className="text-sm sm:text-base text-[#65758B] leading-relaxed">
                At Future Leaders School, learning is not passive reception of facts; it is an active exploration. We blend international pedagogical standards with national curriculum priorities to ensure each student achieves deep mastery in language, sciences, mathematics, and humanities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F3F8FD] border border-blue-100">
                  <h4 className="font-serif font-bold text-sm text-[#123B70] mb-1">
                    Student-Centric Delivery
                  </h4>
                  <p className="text-xs text-[#65758B]">
                    Interactive dialogues, individualized mentoring, and project work replace monotone lectures.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F3F8FD] border border-blue-100">
                  <h4 className="font-serif font-bold text-sm text-[#123B70] mb-1">
                    Bilingual Fluency
                  </h4>
                  <p className="text-xs text-[#65758B]">
                    Strong English language instruction alongside proud mastery of Bengali literature and history.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/images/classroom.jpg"
                  alt="Students engaged in interactive classroom learning"
                  className="w-full h-[360px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Academic Programs Detail Switcher */}
      <section className="py-20 bg-[#F3F8FD]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                EXPLORE OUR DIVISIONS
              </span>
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70]">
              Academic Wings & Subject Scope
            </h2>
            <p className="mt-3 text-base text-[#65758B]">
              Select an academic tier to review its objectives, core curriculum, highlights, and developmental focus.
            </p>
          </div>

          {/* Program Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {academicPrograms.map((p: AcademicProgram) => (
              <button
                key={p.id}
                onClick={() => setSelectedProgram(p.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedProgram === p.id
                    ? 'bg-[#123B70] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Active Program Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#FFB800] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase">
                    {currentProgram.ageRange}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentProgram.grades}
                  </span>
                </div>

                <h3 className="font-serif text-3xl font-bold text-[#123B70]">
                  {currentProgram.name}
                </h3>

                <p className="text-sm text-[#65758B] leading-relaxed">
                  {currentProgram.fullDescription}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B70]">
                    Key Program Highlights:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {currentProgram.highlights.map((h: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B70] mb-2">
                    Core Learning Domains:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProgram.subjects.map((sub: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-[#F3F8FD] text-[#123B70] border border-blue-100 px-3 py-1 rounded-lg"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-md h-72 sm:h-96">
                  <img
                    src={currentProgram.image}
                    alt={currentProgram.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <p className="text-white text-xs font-medium">
                      Future Leaders School • {currentProgram.name} Division
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methods & Assessment */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#123B70] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#123B70] mb-2">
                Experiential Pedagogy
              </h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                We anchor learning in tactile experimentation, scientific labs, field explorations, and simulated debates to embed long-term conceptual retention.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FFB800] flex items-center justify-center mb-4">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#123B70] mb-2">
                STEAM Integration
              </h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Science, Technology, Engineering, Arts, and Mathematics are woven together, helping students synthesize creative ideas into functional real-world prototypes.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#123B70] mb-2">
                Continuous Assessment
              </h3>
              <p className="text-xs text-[#65758B] leading-relaxed">
                Rather than relying solely on high-pressure final exams, we track incremental growth through class presentations, diagnostic quizzes, project rubrics, and portfolio reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Curricular & Clubs */}
      <section className="py-20 bg-[#F3F8FD]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                BEYOND ACADEMICS
              </span>
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70]">
              Co-Curricular Clubs & Athletics
            </h2>
            <p className="mt-3 text-base text-[#65758B]">
              Leadership is forged through collaboration, creative expression, and athletic teamwork outside the textbook.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coCurricular.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="p-3 w-fit rounded-xl bg-[#F3F8FD] mb-4">
                  {c.icon}
                </div>
                <h4 className="font-serif font-bold text-base text-[#123B70] mb-2">
                  {c.title}
                </h4>
                <p className="text-xs text-[#65758B] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic FAQs (Accordion) */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                COMMON INQUIRIES
              </span>
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70]">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-[#65758B]">
              Find clear answers to parents’ most common questions regarding our academic structure and curriculum standards.
            </p>
          </div>

          <div className="space-y-3">
            {academicFaqs.map((faq: FaqItem, idx: number) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#123B70] hover:text-[#2167B2] focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FFB800]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#65758B] leading-relaxed border-t border-slate-100 bg-[#F3F8FD]/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <AdmissionsCtaBanner />
    </div>
  );
};
