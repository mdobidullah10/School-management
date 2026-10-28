import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  initialResults,
  initialStudyPlans,
  initialAdminApplications,
  schoolInfo,
} from '../data/schoolData';
import { fetchApplicationsForAdmin } from '../services/schoolService';
import type {
  StudentResult,
  DailyStudyPlan,
  AdminApplicationItem,
} from '../types';
import {
  Users,
  GraduationCap,
  FileCheck,
  Calendar,
  Layers,
  Plus,
  CheckCircle2,
  Settings,
  Bell,
  Trash2,
  ExternalLink,
  ChevronRight,
  Filter,
  Lock,
  LogOut,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  // Demonstration authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@futureleadersschool.edu.bd');
  const [adminPass, setAdminPass] = useState('superadmin2026');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'admissions' | 'results' | 'study-plans' | 'notices' | 'settings'>('overview');

  // Dynamic state for live interaction in admin
  const [applications, setApplications] = useState<AdminApplicationItem[]>(initialAdminApplications);
  const [resultsList, setResultsList] = useState<StudentResult[]>(initialResults);
  const [studyPlansList] = useState<DailyStudyPlan[]>(initialStudyPlans);
  const [appFilter, setAppFilter] = useState('All');
  const [isLiveDbConnected, setIsLiveDbConnected] = useState(false);

  useEffect(() => {
    fetchApplicationsForAdmin().then(({ applications: loadedApps, isLiveDb }) => {
      if (isLiveDb) {
        setApplications(loadedApps);
        setIsLiveDbConnected(true);
      }
    });
  }, []);

  // New Result Modal State
  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const [newResultData, setNewResultData] = useState({
    rollNumber: '',
    studentId: '',
    studentName: '',
    grade: 'Grade 7',
    section: 'A - Pioneers',
    gpa: '5.00',
    letterGrade: 'A+',
    totalMarks: '700',
    obtainedTotal: '650',
    status: 'Promoted with Distinction' as const,
  });

  // Handle application status change
  const handleUpdateAppStatus = (id: string, status: AdminApplicationItem['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  // Handle creating a new student result record
  const handleCreateResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResultData.rollNumber || !newResultData.studentName) {
      alert('Please fill in Student Name and Roll Number.');
      return;
    }

    const created: StudentResult = {
      id: `res-${Date.now()}`,
      studentId: newResultData.studentId || `FLS-2026-${newResultData.rollNumber}`,
      rollNumber: newResultData.rollNumber,
      studentName: newResultData.studentName,
      grade: newResultData.grade,
      section: newResultData.section,
      examName: 'Annual Examination 2026',
      session: '2026–2027',
      publishedDate: 'Just Now',
      attendance: '97.0%',
      gpa: parseFloat(newResultData.gpa) || 5.0,
      letterGrade: newResultData.letterGrade,
      status: newResultData.status,
      positionInClass: resultsList.length + 1,
      totalMarks: parseInt(newResultData.totalMarks) || 700,
      obtainedTotal: parseInt(newResultData.obtainedTotal) || 650,
      teacherRemarks: 'Excellent performance and commendable effort.',
      subjects: [
        { name: 'English Language', fullMarks: 100, obtainedMarks: 92, grade: 'A+', gradePoint: 5.0 },
        { name: 'Mathematics', fullMarks: 100, obtainedMarks: 96, grade: 'A+', gradePoint: 5.0 },
        { name: 'General Science', fullMarks: 100, obtainedMarks: 94, grade: 'A+', gradePoint: 5.0 },
        { name: 'Social Studies', fullMarks: 100, obtainedMarks: 88, grade: 'A+', gradePoint: 5.0 },
        { name: 'Computer ICT', fullMarks: 100, obtainedMarks: 98, grade: 'A+', gradePoint: 5.0 },
      ],
    };

    setResultsList([created, ...resultsList]);
    setShowAddResultModal(false);
    setNewResultData({
      rollNumber: '',
      studentId: '',
      studentName: '',
      grade: 'Grade 7',
      section: 'A - Pioneers',
      gpa: '5.00',
      letterGrade: 'A+',
      totalMarks: '700',
      obtainedTotal: '650',
      status: 'Promoted with Distinction',
    });
  };

  // Delete result
  const handleDeleteResult = (id: string) => {
    if (confirm('Are you sure you want to remove this student result record?')) {
      setResultsList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // If logged out demo view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#123B70] text-[#FFB800] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#123B70] pt-2">
              Super Admin Gateway
            </h2>
            <p className="text-xs text-slate-500">
              Future Leaders School Enterprise Administration
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Email ID
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Security Password
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#2167B2]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#123B70] hover:bg-[#2167B2] text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Sign In to Super Admin Dashboard
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            Demo credentials are pre-filled for rapid inspection.
          </p>
        </div>
      </div>
    );
  }

  const filteredApps = appFilter === 'All'
    ? applications
    : applications.filter((a) => a.status === appFilter);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-[#0B2244] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.jpg"
            alt="School Crest"
            className="w-9 h-9 object-contain rounded-lg bg-white p-0.5"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base tracking-tight text-white">
                Future Leaders School
              </h1>
              <span className="bg-[#FFB800] text-[#123B70] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                Super Admin
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold flex items-center gap-1 ${
                isLiveDbConnected
                  ? 'text-emerald-300 bg-emerald-950/80 border-emerald-700/60'
                  : 'text-amber-300 bg-amber-950/80 border-amber-700/60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {isLiveDbConnected ? 'Supabase Live' : 'Supabase Configured'}
              </span>
            </div>
            <p className="text-[10px] text-slate-300">
              Executive School Management & Governance Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/80 px-3 py-1.5 rounded-lg border border-rose-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout: Sidebar + Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
            Administrative Modules
          </span>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#FFB800]" />
              <span>Dashboard Overview</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'admissions'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span>Admissions Inquiries</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'results'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#2167B2]" />
              <span>Result Management</span>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {resultsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('study-plans')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'study-plans'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Daily Study Plan</span>
            </div>
            <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {studyPlansList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Circulars & Notices</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#123B70] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Institution Settings</span>
            </div>
          </button>

          {/* Quick links to public portals */}
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
              Direct Public Portals
            </span>
            <Link
              to="/results"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-[#123B70] hover:bg-slate-50 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Online Result Checker</span>
            </Link>
            <Link
              to="/study-plan"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-[#123B70] hover:bg-slate-50 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Daily Study Plan</span>
            </Link>
            <Link
              to="/portal"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-[#123B70] hover:bg-slate-50 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Student/Parent Portal</span>
            </Link>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#123B70]">
                  Super Admin Executive Dashboard
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time indicators, enrollment metrics, and school operations at a glance.
                </p>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Total Students
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#123B70] mt-0.5">1,248</h3>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +14% vs last term
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#123B70] flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Admissions Queue
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#123B70] mt-0.5">
                      {applications.filter((a) => a.status === 'Pending Review' || a.status === 'Interview Scheduled').length}
                    </h3>
                    <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                      Applications pending
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FFB800] flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Published Results
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#123B70] mt-0.5">
                      {resultsList.length}
                    </h3>
                    <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                      Transcripts active
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Avg. Campus Attendance
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#123B70] mt-0.5">96.8%</h3>
                    <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                      Target: &gt;95.0%
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Admissions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Admissions Inquiries */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#123B70]">
                      Recent Online Applications
                    </h3>
                    <button
                      onClick={() => setActiveTab('admissions')}
                      className="text-xs font-bold text-[#2167B2] hover:underline"
                    >
                      View All Applications →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <strong className="text-sm font-bold text-slate-800 block">
                            {app.studentName}
                          </strong>
                          <span className="text-slate-500">
                            {app.applyingGrade} • Parent: {app.parentName} ({app.contactNumber})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'Interview Scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Management Tools */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#123B70] border-b border-slate-100 pb-3">
                    Quick Control Shortcuts
                  </h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setActiveTab('results');
                        setShowAddResultModal(true);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 text-[#123B70] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#FFB800]" />
                        Publish Student Result
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveTab('study-plans')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 text-purple-900 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Edit Daily Study Routine
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveTab('notices')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-600" />
                        Broadcast Campus Circular
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSIONS MANAGEMENT */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#123B70]">
                    Admissions Applications Manager
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review candidate inquiries, schedule evaluation interviews, and update enrollment decisions.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#FFB800]" />
                  <span className="text-xs font-bold text-slate-600">Filter Status:</span>
                  <select
                    value={appFilter}
                    onChange={(e) => setAppFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-medium"
                  >
                    <option value="All">All Inquiries</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#123B70] text-white">
                        <th className="py-3.5 px-4 font-bold">Candidate & Grade</th>
                        <th className="py-3.5 px-4 font-bold">Parent / Contact</th>
                        <th className="py-3.5 px-4 font-bold">Submission Date</th>
                        <th className="py-3.5 px-4 font-bold">Status</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4">
                            <strong className="font-bold text-slate-800 block text-sm">
                              {app.studentName}
                            </strong>
                            <span className="text-slate-500">{app.applyingGrade}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-700">{app.parentName}</p>
                            <p className="text-slate-500">{app.contactNumber} • {app.email}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {app.submissionDate}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                app.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'Interview Scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : app.status === 'Declined'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, 'Approved')}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold transition-colors cursor-pointer"
                                title="Approve application"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, 'Interview Scheduled')}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-bold transition-colors cursor-pointer"
                                title="Schedule campus interview"
                              >
                                Schedule
                              </button>
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, 'Declined')}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-bold transition-colors cursor-pointer"
                                title="Decline application"
                              >
                                Decline
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESULTS MANAGEMENT */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#123B70]">
                    Online Examination Results Manager
                  </h2>
                  <p className="text-xs text-slate-500">
                    Publish student exam marks, GPA scores, and verify public report cards.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/results"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>Open Public Result Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setShowAddResultModal(true)}
                    className="inline-flex items-center gap-1.5 bg-[#123B70] hover:bg-[#2167B2] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4 text-[#FFB800]" />
                    <span>Publish New Result</span>
                  </button>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#123B70] text-white">
                        <th className="py-3.5 px-4 font-bold">Roll / Student ID</th>
                        <th className="py-3.5 px-4 font-bold">Student Name</th>
                        <th className="py-3.5 px-4 font-bold">Class & Section</th>
                        <th className="py-3.5 px-4 font-bold">GPA / Grade</th>
                        <th className="py-3.5 px-4 font-bold">Marks Total</th>
                        <th className="py-3.5 px-4 font-bold">Status</th>
                        <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {resultsList.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-bold text-[#123B70]">
                            Roll {res.rollNumber} <span className="text-slate-400 font-normal">({res.studentId})</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {res.studentName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {res.grade} • {res.section}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-[#123B70] text-sm">
                              {res.gpa.toFixed(2)}
                            </span>
                            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                              {res.letterGrade}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-semibold">
                            {res.obtainedTotal} / {res.totalMarks}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[11px] font-semibold text-slate-600">
                              {res.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteResult(res.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete result record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STUDY PLANS */}
          {activeTab === 'study-plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#123B70]">
                    Daily Study Plan & Curriculum Scheduler
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage daily classroom schedules, syllabus topics, and homework instructions across grades.
                  </p>
                </div>
                <Link
                  to="/study-plan"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 bg-[#123B70] hover:bg-[#2167B2] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                >
                  <span>Preview Public Study Plan</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
                </Link>
              </div>

              {/* Study Plans Accordions */}
              <div className="space-y-6">
                {studyPlansList.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-lg text-[#123B70]">
                            {plan.grade} Study Plan
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {plan.dayName}, {plan.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {plan.generalNotice}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {plan.periods.length} Scheduled Periods
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {plan.periods.map((period, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-800 font-bold">{period.subject}</strong>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">
                              {period.time}
                            </span>
                          </div>
                          <p className="text-slate-600">
                            <strong>Topic:</strong> {period.topic}
                          </p>
                          <p className="text-[#123B70]">
                            <strong>Homework:</strong> {period.homework}
                          </p>
                          <span className="text-[10px] text-slate-400 block">
                            Teacher: {period.teacher}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#123B70]">
                  Campus Circulars & Notice Broadcast
                </h2>
                <p className="text-xs text-slate-500">
                  Broadcast administrative and academic circulars to the Student & Parent portal feed.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-base text-[#123B70]">
                  Post a New Circular
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Notice broadcasted to portal successfully in demonstration!');
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Circular Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Winter Vacation Dates & Holiday Homework Packets"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                      <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200">
                        <option>Academic</option>
                        <option>Administrative</option>
                        <option>Athletics & Sports</option>
                        <option>Examinations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Target Audience</label>
                      <input
                        type="text"
                        placeholder="e.g. All Students & Parents"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#123B70] text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#2167B2] transition-colors"
                  >
                    Publish Circular
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#123B70]">
                  Institutional Configuration & Contact Parameters
                </h2>
                <p className="text-xs text-slate-500">
                  Centralized school identity, hotline numbers, and academic session settings.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Institution Name</label>
                    <input
                      type="text"
                      defaultValue={schoolInfo.name}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Official Tagline</label>
                    <input
                      type="text"
                      defaultValue={schoolInfo.tagline}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Hotline Telephone</label>
                    <input
                      type="text"
                      defaultValue={schoolInfo.phonePlaceholder}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Admissions Email</label>
                    <input
                      type="email"
                      defaultValue={schoolInfo.emailPlaceholder}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Configuration parameters saved in demonstration state!')}
                    className="bg-[#123B70] text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#2167B2] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Publish New Result */}
      {showAddResultModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowAddResultModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-xl text-[#123B70]">
                Publish New Student Result
              </h3>
              <p className="text-xs text-slate-500">
                Instantly enter marks and publish to the online result checker portal.
              </p>
            </div>

            <form onSubmit={handleCreateResult} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newResultData.studentName}
                  onChange={(e) => setNewResultData({ ...newResultData, studentName: e.target.value })}
                  placeholder="e.g. Nusrat Jahan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={newResultData.rollNumber}
                    onChange={(e) => setNewResultData({ ...newResultData, rollNumber: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Student ID</label>
                  <input
                    type="text"
                    value={newResultData.studentId}
                    onChange={(e) => setNewResultData({ ...newResultData, studentId: e.target.value })}
                    placeholder="e.g. FLS-2026-105"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Grade</label>
                  <select
                    value={newResultData.grade}
                    onChange={(e) => setNewResultData({ ...newResultData, grade: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Section</label>
                  <input
                    type="text"
                    value={newResultData.section}
                    onChange={(e) => setNewResultData({ ...newResultData, section: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">GPA (Out of 5.0) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="5"
                    value={newResultData.gpa}
                    onChange={(e) => setNewResultData({ ...newResultData, gpa: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Letter Grade</label>
                  <select
                    value={newResultData.letterGrade}
                    onChange={(e) => setNewResultData({ ...newResultData, letterGrade: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="A+ (Golden)">A+ (Golden)</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Obtained Marks</label>
                  <input
                    type="number"
                    value={newResultData.obtainedTotal}
                    onChange={(e) => setNewResultData({ ...newResultData, obtainedTotal: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newResultData.totalMarks}
                    onChange={(e) => setNewResultData({ ...newResultData, totalMarks: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddResultModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#123B70] hover:bg-[#2167B2] text-white px-5 py-2 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Publish Result Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
