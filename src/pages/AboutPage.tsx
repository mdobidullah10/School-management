import React from 'react';
import { Link } from 'react-router-dom';
import { AdmissionsCtaBanner } from '../components/home/AdmissionsCtaBanner';
import { demoLeadership } from '../data/schoolData';
import { Target, Compass, Award, Heart, Shield, Lightbulb, Users, ChevronRight, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const coreValues = [
    {
      title: 'Integrity & Ethics',
      desc: 'Doing what is right, fostering honesty, fairness, and mutual respect in all academic and personal pursuits.',
      icon: Shield,
    },
    {
      title: 'Academic Excellence',
      desc: 'Encouraging rigorous scholarship, active curiosity, critical inquiry, and analytical problem-solving.',
      icon: Award,
    },
    {
      title: 'Responsible Leadership',
      desc: 'Developing confident individuals who take initiative, empathize with others, and serve society.',
      icon: Compass,
    },
    {
      title: 'Empathy & Inclusivity',
      desc: 'Cultivating compassion, celebrating diversity, and building an inclusive, supportive school environment.',
      icon: Heart,
    },
    {
      title: 'Innovation & Creativity',
      desc: 'Embracing modern technology, artistic expression, and adaptability for future global challenges.',
      icon: Lightbulb,
    },
    {
      title: 'Collaborative Community',
      desc: 'Building tight partnerships among students, passionate teachers, parents, and community members.',
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Page Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B2345] via-[#123B70] to-[#2563A6] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#F2B544] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[#F2B544] font-semibold">About Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#F2B544]">
              ABOUT OUR INSTITUTION
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Nurturing Tomorrow's Global Leaders
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl">
            Learn more about our educational philosophy, our vibrant campus, and our steadfast commitment to holistic academic excellence in Bangladesh.
          </p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-16 bg-[#F5F8FC] border-b border-[#E1E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E1E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#123B70] text-[#F2B544] flex items-center justify-center mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563A6] block mb-1">
                  Institutional Direction
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#0B2345] mb-3">Our Vision</h2>
                <p className="text-sm text-[#66758A] leading-relaxed">
                  To be an exemplary benchmark of educational excellence in Bangladesh, developing intellectually fearless, compassionate, and ethical global citizens who create meaningful positive change in their communities.
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-slate-100 text-xs text-[#66758A] space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#123B70]" />
                  <span>Ethical leadership and moral character building</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#123B70]" />
                  <span>Curiosity-driven, inquiry-based pedagogical frameworks</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E1E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#2563A6] text-white flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563A6] block mb-1">
                  Guiding Purpose
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#0B2345] mb-3">Our Mission</h2>
                <p className="text-sm text-[#66758A] leading-relaxed">
                  To cultivate an inclusive and safe academic environment where curiosity is celebrated, talents are discovered, and every student is empowered with conceptual mastery, digital fluency, and cultural appreciation.
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-slate-100 text-xs text-[#66758A] space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563A6]" />
                  <span>Personalized student mentorship from qualified educators</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563A6]" />
                  <span>Balanced co-curricular, arts, STEAM, and athletic opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#E1E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#123B70] block mb-1">
              GUIDING PRINCIPLES
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345]">
              Our Core Institutional Values
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#66758A]">
              These foundational pillars guide classroom teaching, campus behavior, and student development every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white hover:shadow-xs transition-all duration-150"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E1E8F0] text-[#123B70] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#123B70]" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#0B2345] mb-1.5">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#66758A] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className="py-16 lg:py-20 bg-[#F5F8FC] border-b border-[#E1E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#123B70] block mb-1">
                ACADEMIC LEADERSHIP
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2345]">
                School Administration & Direction
              </h2>
            </div>
            <Link
              to="/teachers"
              className="text-xs font-bold text-[#123B70] hover:text-[#2563A6] inline-flex items-center gap-1"
            >
              <span>View All Faculty & Staff</span>
              <ChevronRight className="w-4 h-4 text-[#F2B544]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoLeadership.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-[#E1E8F0] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={lead.image}
                    alt={lead.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#2563A6] tracking-wider block mb-1">
                      {lead.department}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#0B2345]">
                      {lead.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#123B70] mt-0.5">
                      {lead.role}
                    </p>
                    <p className="text-xs text-[#66758A] mt-2 line-clamp-2">
                      {lead.bio}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#66758A]">
                    <strong>Credentials:</strong> {lead.qualifications}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <AdmissionsCtaBanner />
    </div>
  );
};
