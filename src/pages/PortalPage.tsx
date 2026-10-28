import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Users,
  Bell,
  Lock,
  ArrowRight,
  Download,
  AlertTriangle,
  FileText,
  Award,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

export const PortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parent' | 'student'>('parent');
  const [idInput, setIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [demoNotice, setDemoNotice] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoNotice(true);
  };

  const sampleNotices = [
    {
      date: 'Oct 24, 2026',
      title: 'Term 1 Mid-Term Examination Schedule & Syllabus Published',
      audience: 'All Students & Parents',
      tag: 'Academic',
    },
    {
      date: 'Oct 18, 2026',
      title: 'Winter Uniform Transition Guidelines & Tailoring Schedule',
      audience: 'Parents',
      tag: 'Administrative',
    },
    {
      date: 'Oct 10, 2026',
      title: 'Annual Inter-House Sports Meet Trial Registrations',
      audience: 'Grades 4 – 12',
      tag: 'Athletics',
    },
  ];

  const downloadableResources = [
    {
      name: 'Academic Calendar 2026–2027 (PDF)',
      size: '1.4 MB',
      type: 'Calendar',
    },
    {
      name: 'Student Code of Conduct & Honor Handbook',
      size: '2.1 MB',
      type: 'Policy',
    },
    {
      name: 'Curriculum Syllabi Overview (Early Years to Secondary)',
      size: '3.8 MB',
      type: 'Academic',
    },
    {
      name: 'Co-Curricular Clubs Schedule & Activity Roster',
      size: '980 KB',
      type: 'Clubs',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0B2244] via-[#123B70] to-[#2167B2] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
              DIGITAL CAMPUS HUB
            </span>
            <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Student & Parent Portal
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto">
            A centralized digital gateway for academic schedules, official circulars, student progress reports, and digital curriculum resources.
          </p>
        </div>
      </section>

      {/* Quick Access Feature Cards */}
      <section className="bg-white py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/results"
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#123B70] text-[#FFB800] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#123B70] group-hover:text-[#2167B2] transition-colors mb-1">
                  Online Result Checker
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Search student term & annual marks, GPA scores, and download printable certified report cards.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#123B70] group-hover:text-[#2167B2]">
                <span>Check Exam Results</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/study-plan"
              className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/50 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-700 text-purple-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#123B70] group-hover:text-purple-700 transition-colors mb-1">
                  Daily Study Plan & Routine
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access daily period schedules, in-class learning topics, required materials, and homework tracker.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-purple-700">
                <span>View Today’s Study Routine</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/admin"
              className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#123B70] text-[#FFB800] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#123B70] group-hover:text-[#2167B2] transition-colors mb-1">
                  Super Admin Management
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage applications, publish student exam marks, broadcast circulars, and configure school settings.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#123B70] group-hover:text-[#2167B2]">
                <span>Launch Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Portal Section */}
      <section className="py-16 bg-[#F3F8FD]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 6 Cols: Login Demonstration Interface */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
                    AUTHENTICATION GATEWAY
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#123B70]">
                    Portal Sign In
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B70] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#2167B2]" />
                </div>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('parent');
                    setDemoNotice(false);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'parent'
                      ? 'bg-white text-[#123B70] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Parent Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('student');
                    setDemoNotice(false);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'student'
                      ? 'bg-white text-[#123B70] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#2167B2]" />
                  <span>Student Portal</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                    {activeTab === 'parent' ? 'Parent Mobile / Email ID' : 'Student Roll / Student ID'}
                  </label>
                  <input
                    type="text"
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    placeholder={activeTab === 'parent' ? 'e.g. 01700-000000 or email' : 'e.g. FLS-2026-0428'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B70] uppercase tracking-wide mb-1">
                    Portal Access Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" className="rounded text-[#123B70] focus:ring-[#FFB800]" />
                    <span>Remember on this device</span>
                  </label>
                  <a href="#help" className="text-[#2167B2] font-semibold hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Sign In to {activeTab === 'parent' ? 'Parent' : 'Student'} Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#FFB800]" />
                  </button>
                </div>
              </form>

              {/* Demo Notice Alert */}
              {demoNotice && (
                <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Portal Architecture & Security Demonstration</span>
                  </div>
                  <p className="leading-relaxed text-amber-800">
                    This login screen illustrates the frontend portal user experience. In accordance with strict security standards, real student records are never connected to static demonstration sites. Connect your enterprise SIS / OAuth authentication provider to enable live authentication.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  New student? Your login credentials are provided upon enrollment completion.
                </p>
              </div>
            </div>

            {/* Right 6 Cols: Notices & Academic Calendar Preview */}
            <div className="lg:col-span-6 space-y-6">
              {/* Notice Board Preview */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-5 h-5 text-[#FFB800]" />
                    <h4 className="font-serif font-bold text-lg text-[#123B70]">
                      Official Circulars & Notices
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Live Feed
                  </span>
                </div>

                <div className="space-y-3.5">
                  {sampleNotices.map((n, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#F3F8FD] border border-blue-100/60 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#2167B2]">{n.tag}</span>
                        <span className="text-slate-500">{n.date}</span>
                      </div>
                      <h5 className="font-serif font-bold text-sm text-[#123B70] leading-snug">
                        {n.title}
                      </h5>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Target: {n.audience}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloadable Academic Resources */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
                  <Download className="w-5 h-5 text-[#10B981]" />
                  <h4 className="font-serif font-bold text-lg text-[#123B70]">
                    Academic Downloads & Syllabi
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {downloadableResources.map((res, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#123B70]" />
                        <div>
                          <p className="font-semibold text-slate-800">{res.name}</p>
                          <span className="text-[10px] text-slate-400">
                            {res.type} • {res.size}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading placeholder: ${res.name}`)}
                        className="p-1.5 rounded-lg bg-blue-50 text-[#123B70] hover:bg-[#123B70] hover:text-white transition-colors cursor-pointer"
                        title="Download sample document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
