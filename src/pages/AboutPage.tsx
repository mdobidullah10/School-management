import React from 'react';
import { Link } from 'react-router-dom';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';
import { demoLeadership } from '../data/schoolData';
import type { StaffMember } from '../types';
import { Target, Compass, Award, Heart, Shield, Lightbulb, Users, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const coreValues = [
    {
      title: 'Integrity & Ethics',
      desc: 'Doing what is right, fostering honesty, fairness, and mutual respect in all academic and personal pursuits.',
      icon: <Shield className="w-6 h-6 text-[#123B70]" />,
    },
    {
      title: 'Academic Excellence',
      desc: 'Encouraging rigorous scholarship, active curiosity, critical inquiry, and analytical problem-solving.',
      icon: <Award className="w-6 h-6 text-[#FFB800]" />,
    },
    {
      title: 'Responsible Leadership',
      desc: 'Developing confident individuals who take initiative, empathize with others, and serve society.',
      icon: <Compass className="w-6 h-6 text-[#2167B2]" />,
    },
    {
      title: 'Empathy & Inclusivity',
      desc: 'Cultivating compassion, celebrating diversity, and building an inclusive, supportive school environment.',
      icon: <Heart className="w-6 h-6 text-[#EC4899]" />,
    },
    {
      title: 'Innovation & Creativity',
      desc: 'Embracing modern technology, artistic expression, and adaptability for future global challenges.',
      icon: <Lightbulb className="w-6 h-6 text-[#10B981]" />,
    },
    {
      title: 'Collaborative Community',
      desc: 'Building tight partnerships among students, passionate teachers, parents, and community members.',
      icon: <Users className="w-6 h-6 text-[#8B5CF6]" />,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Page Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B2244] via-[#123B70] to-[#2167B2] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
              ABOUT OUR INSTITUTION
            </span>
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Nurturing Tomorrow's Global Leaders
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            Learn more about our educational philosophy, our vibrant campus, and our steadfast commitment to holistic excellence in Bangladesh.
          </p>
        </div>
      </section>

      {/* School Introduction & Campus Snapshot */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                FOUNDATIONAL PRINCIPLES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70] leading-snug">
                Dedicated to Shaping Intellect, Character, and Purpose
              </h2>
              <p className="text-sm sm:text-base text-[#65758B] leading-relaxed">
                Future Leaders School was established to offer children an exceptional foundation in balanced modern education. Rooted in the rich cultural identity of Bangladesh while embracing global best practices, our classrooms empower young scholars to cultivate critical reasoning and strong values.
              </p>
              <p className="text-sm sm:text-base text-[#65758B] leading-relaxed">
                We believe that education must transcend rote memorization. Our educators guide students through interactive inquiry, experimental STEM learning, language proficiency, and civic engagement.
              </p>
              <div className="pt-2">
                <Link
                  to="/admissions"
                  className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all"
                >
                  Schedule a Campus Walkthrough
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/images/campus-main.jpg"
                  alt="Future Leaders School main academic courtyard"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-100 shadow-lg text-xs text-[#123B70] font-medium flex items-center justify-between">
                  <span>Purpose-built campus with natural light & green spaces</span>
                  <span className="text-[#FFB800] font-bold">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Two-Column Cards */}
      <section className="py-16 bg-[#F3F8FD]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#123B70] flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#123B70] mb-3">Our Vision</h3>
              <p className="text-sm text-[#65758B] leading-relaxed">
                To be a premier school of choice in Bangladesh, recognized for inspiring transformative scholarship, ethical leadership, and preparing students to make meaningful contributions to an interconnected world.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Fostering visionary global citizens
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Advancing STEAM & bilingual literacy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Instilling lifelong moral character
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FFB800] flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#123B70] mb-3">Our Mission</h3>
              <p className="text-sm text-[#65758B] leading-relaxed">
                To cultivate a stimulating, compassionate environment where children develop academic mastery, intellectual curiosity, and self-confidence through personalized mentoring, modern facilities, and community participation.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Student-centered, inquiry-driven pedagogy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Safe, welcoming, and digitally equipped campus
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Close partnership with families & guardians
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values 6-card grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                GUIDING ETHOS
              </span>
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70]">
              Our Core Values
            </h2>
            <p className="mt-3 text-base text-[#65758B]">
              These fundamental principles guide every lesson, activity, policy, and interaction at Future Leaders School.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="p-3 w-fit rounded-xl bg-[#F3F8FD] mb-4">
                  {v.icon}
                </div>
                <h4 className="font-serif font-bold text-lg text-[#123B70] mb-2">{v.title}</h4>
                <p className="text-xs text-[#65758B] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Faculty Section */}
      <section className="py-20 bg-[#F3F8FD]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
                ACADEMIC LEADERSHIP
              </span>
              <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B70]">
              School Administration & Faculty
            </h2>
            <p className="mt-3 text-base text-[#65758B]">
              Our academic leadership brings decades of pedagogical wisdom, modern curriculum expertise, and passionate student stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoLeadership.map((member: StaffMember) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Demo Profile
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2167B2] block mb-1">
                      {member.department}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#123B70]">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mb-3">
                      {member.role}
                    </p>
                    <p className="text-xs text-[#65758B] leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">Qualifications: </span>
                      {member.qualifications}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center bg-blue-50/70 border border-blue-100 rounded-xl p-4 max-w-2xl mx-auto text-xs text-[#123B70]">
            <strong>Note for School Administrators:</strong> Staff credentials and photography shown above are editable demonstration profiles. Formal faculty rosters will be updated as per department schedules.
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <AdmissionsCtaBanner />
    </div>
  );
};
