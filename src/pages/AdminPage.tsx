import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  initialStudyPlans,
  schoolInfo,
} from '../data/schoolData';
import {
  fetchApplicationsForAdmin,
  updateAdmissionStatusInDb,
  deleteAdmissionFromDb,
  fetchResultsFromDb,
  saveStudentResultToDb,
  deleteStudentResultFromDb,
} from '../services/schoolService';
import type {
  StudentResult,
  SubjectResult,
  DailyStudyPlan,
  AdminApplicationItem,
} from '../types';
import {
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
  Lock,
  LogOut,
  Edit3,
  Search,
  Image as ImageIcon,
  Upload,
  Eye,
  RefreshCw,
  Sparkles,
  Printer,
  X,
  UserCheck,
  Award,
} from 'lucide-react';

// Preset avatar photos for quick selection
const PRESET_AVATARS = [
  { label: 'Boy Student 1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
  { label: 'Girl Student 1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { label: 'Boy Student 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { label: 'Girl Student 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { label: 'Junior Scholar', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
];

const STANDARD_SUBJECTS: { name: string; fullMarks: number }[] = [
  { name: 'English Language & Literature', fullMarks: 100 },
  { name: 'Mathematics & Geometry', fullMarks: 100 },
  { name: 'Integrated Sciences', fullMarks: 100 },
  { name: 'Bangladesh & Global Studies', fullMarks: 100 },
  { name: 'Computer Science & ICT', fullMarks: 100 },
  { name: 'Bengali First Language', fullMarks: 100 },
  { name: 'Creative Arts & Physical Ed', fullMarks: 100 },
];

// Helper to calculate Grade and Grade Point from marks
function calculateGrade(obtained: number, full: number = 100): { grade: string; gradePoint: number } {
  const pct = full > 0 ? (obtained / full) * 100 : 0;
  if (pct >= 80) return { grade: 'A+', gradePoint: 5.0 };
  if (pct >= 70) return { grade: 'A', gradePoint: 4.0 };
  if (pct >= 60) return { grade: 'A-', gradePoint: 3.5 };
  if (pct >= 50) return { grade: 'B', gradePoint: 3.0 };
  if (pct >= 40) return { grade: 'C', gradePoint: 2.0 };
  if (pct >= 33) return { grade: 'D', gradePoint: 1.0 };
  return { grade: 'F', gradePoint: 0.0 };
}

export const AdminPage: React.FC = () => {
  // Demo Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@futureleadersschool.edu.bd');
  const [adminPass, setAdminPass] = useState('superadmin2026');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'admissions' | 'study-plans' | 'notices' | 'settings'>('students');

  // Live state
  const [applications, setApplications] = useState<AdminApplicationItem[]>([]);
  const [resultsList, setResultsList] = useState<StudentResult[]>([]);
  const [studyPlansList] = useState<DailyStudyPlan[]>(initialStudyPlans);
  const [isLiveDbConnected, setIsLiveDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Filters & Search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('All');
  const [appFilter, setAppFilter] = useState('All');

  // Modals
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [viewingMarksheet, setViewingMarksheet] = useState<StudentResult | null>(null);

  // Notice modal & state
  const [notices, setNotices] = useState([
    { id: '1', title: 'Admissions Open for Academic Session 2026-2027', category: 'Admissions', date: 'Oct 28, 2026', audience: 'Public & Parents', active: true },
    { id: '2', title: 'Annual Sports & Leadership Meet 2026 Scheduled', category: 'Events', date: 'Oct 25, 2026', audience: 'All Students', active: true },
    { id: '3', title: 'Term 2 Report Card Distribution on Campus', category: 'Academic', date: 'Oct 20, 2026', audience: 'Grade 1 - 10', active: true },
  ]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', category: 'Academic', audience: 'All Students' });

  // School Settings Editable State
  const [settingsForm, setSettingsForm] = useState({
    name: schoolInfo.name,
    tagline: schoolInfo.tagline,
    phone: schoolInfo.phonePlaceholder,
    email: schoolInfo.emailPlaceholder,
    address: schoolInfo.addressPlaceholder,
    officeHours: schoolInfo.officeHoursPlaceholder,
  });

  // Student Form State (For Add & Edit)
  const defaultSubjectList: SubjectResult[] = STANDARD_SUBJECTS.map((s) => ({
    name: s.name,
    fullMarks: s.fullMarks,
    obtainedMarks: 90,
    grade: 'A+',
    gradePoint: 5.0,
  }));

  const [studentForm, setStudentForm] = useState({
    studentId: 'FLS-2026-105',
    rollNumber: '105',
    studentName: '',
    studentPhoto: '',
    gender: 'Male',
    grade: 'Grade 7',
    section: 'A - Pioneers',
    parentName: '',
    contactNumber: '+880 1700-000000',
    examName: 'Annual Examination 2026',
    session: '2026–2027',
    attendance: '98%',
    positionInClass: 1,
    teacherRemarks: 'Exemplary academic dedication, innovative problem solver, and courteous demeanor.',
    subjects: defaultSubjectList,
  });

  // Dynamic calculations for GPA & Letter Grade in the form
  const computedSummary = React.useMemo(() => {
    const validSubs = studentForm.subjects.filter((s) => s.name.trim() !== '');
    const totalMarks = validSubs.reduce((acc, curr) => acc + (Number(curr.fullMarks) || 0), 0);
    const obtainedTotal = validSubs.reduce((acc, curr) => acc + (Number(curr.obtainedMarks) || 0), 0);
    
    let totalPoints = 0;
    let hasFailed = false;

    validSubs.forEach((sub) => {
      const { gradePoint, grade } = calculateGrade(Number(sub.obtainedMarks) || 0, Number(sub.fullMarks) || 100);
      totalPoints += gradePoint;
      if (grade === 'F') hasFailed = true;
    });

    const gpa = validSubs.length > 0 ? (hasFailed ? 0.0 : totalPoints / validSubs.length) : 0;
    
    let letterGrade = 'F';
    if (!hasFailed) {
      if (gpa >= 5.0) letterGrade = 'A+ (Golden)';
      else if (gpa >= 4.0) letterGrade = 'A';
      else if (gpa >= 3.5) letterGrade = 'A-';
      else if (gpa >= 3.0) letterGrade = 'B';
      else if (gpa >= 2.0) letterGrade = 'C';
      else if (gpa >= 1.0) letterGrade = 'D';
    }

    const status: StudentResult['status'] = hasFailed
      ? 'Needs Improvement'
      : gpa >= 4.5
      ? 'Promoted with Distinction'
      : 'Passed';

    return { totalMarks, obtainedTotal, gpa: Number(gpa.toFixed(2)), letterGrade, status };
  }, [studentForm.subjects]);

  // Load Initial Data from Supabase
  const loadData = async () => {
    setLoading(true);
    const [appsRes, resultsRes] = await Promise.all([
      fetchApplicationsForAdmin(),
      fetchResultsFromDb(),
    ]);

    setApplications(appsRes.applications);
    setResultsList(resultsRes.results);
    setIsLiveDbConnected(appsRes.isLiveDb || resultsRes.isLiveDb);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  // Open modal to add a brand new student
  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    const nextRoll = (resultsList.length + 101).toString();
    setStudentForm({
      studentId: `FLS-2026-${nextRoll}`,
      rollNumber: nextRoll,
      studentName: '',
      studentPhoto: PRESET_AVATARS[0].url,
      gender: 'Male',
      grade: 'Grade 7',
      section: 'A - Pioneers',
      parentName: '',
      contactNumber: '+880 1700-000000',
      examName: 'Annual Examination 2026',
      session: '2026–2027',
      attendance: '98%',
      positionInClass: resultsList.length + 1,
      teacherRemarks: 'Exemplary academic dedication, innovative problem solver, and courteous demeanor.',
      subjects: STANDARD_SUBJECTS.map((s) => ({
        name: s.name,
        fullMarks: s.fullMarks,
        obtainedMarks: 90,
        grade: 'A+',
        gradePoint: 5.0,
      })),
    });
    setShowStudentModal(true);
  };

  // Open modal to edit an existing student
  const handleOpenEditStudent = (student: StudentResult) => {
    setEditingStudentId(student.id);
    setStudentForm({
      studentId: student.studentId,
      rollNumber: student.rollNumber,
      studentName: student.studentName,
      studentPhoto: student.studentPhoto || '',
      gender: student.gender || 'Male',
      grade: student.grade,
      section: student.section,
      parentName: student.parentName || '',
      contactNumber: student.contactNumber || '+880 1700-000000',
      examName: student.examName,
      session: student.session,
      attendance: student.attendance,
      positionInClass: student.positionInClass,
      teacherRemarks: student.teacherRemarks,
      subjects: student.subjects.length > 0 ? student.subjects : defaultSubjectList,
    });
    setShowStudentModal(true);
  };

  // Auto-generate student ID based on current roll
  const handleAutoGenerateId = () => {
    setStudentForm((prev) => ({
      ...prev,
      studentId: `FLS-${prev.session.substring(0, 4)}-${prev.rollNumber.trim() || '101'}`,
    }));
  };

  // Handle image upload from computer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setStudentForm((prev) => ({ ...prev, studentPhoto: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Subject actions inside the modal
  const handleAddCustomSubject = () => {
    setStudentForm((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: 'New Subject',
          fullMarks: 100,
          obtainedMarks: 85,
          grade: 'A+',
          gradePoint: 5.0,
        },
      ],
    }));
  };

  const handleLoadStandardCurriculum = () => {
    setStudentForm((prev) => ({
      ...prev,
      subjects: STANDARD_SUBJECTS.map((s) => ({
        name: s.name,
        fullMarks: s.fullMarks,
        obtainedMarks: 90,
        grade: 'A+',
        gradePoint: 5.0,
      })),
    }));
  };

  const handleRemoveSubject = (index: number) => {
    setStudentForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateSubject = (index: number, field: keyof SubjectResult, val: any) => {
    setStudentForm((prev) => {
      const updated = [...prev.subjects];
      const current = { ...updated[index], [field]: val };
      
      // Re-evaluate grade and gradePoint if obtained or full marks changed
      if (field === 'obtainedMarks' || field === 'fullMarks') {
        const { grade, gradePoint } = calculateGrade(
          Number(current.obtainedMarks) || 0,
          Number(current.fullMarks) || 100
        );
        current.grade = grade;
        current.gradePoint = gradePoint;
      }
      
      updated[index] = current;
      return { ...prev, subjects: updated };
    });
  };

  // Save student (Insert or Update)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.studentName.trim() || !studentForm.rollNumber.trim()) {
      alert('Student Name and Roll Number are required.');
      return;
    }

    const payload: StudentResult = {
      id: editingStudentId || `FLS-${Date.now()}`,
      studentId: studentForm.studentId.trim() || `FLS-2026-${studentForm.rollNumber}`,
      rollNumber: studentForm.rollNumber.trim(),
      studentName: studentForm.studentName.trim(),
      studentPhoto: studentForm.studentPhoto || undefined,
      gender: studentForm.gender,
      grade: studentForm.grade,
      section: studentForm.section,
      parentName: studentForm.parentName,
      contactNumber: studentForm.contactNumber,
      examName: studentForm.examName,
      session: studentForm.session,
      attendance: studentForm.attendance,
      positionInClass: Number(studentForm.positionInClass) || 1,
      teacherRemarks: studentForm.teacherRemarks,
      publishedDate: new Date().toISOString().split('T')[0],
      subjects: studentForm.subjects,
      totalMarks: computedSummary.totalMarks,
      obtainedTotal: computedSummary.obtainedTotal,
      gpa: computedSummary.gpa,
      letterGrade: computedSummary.letterGrade,
      status: computedSummary.status,
    };

    const res = await saveStudentResultToDb(payload);
    if (res.id) payload.id = res.id;

    if (editingStudentId) {
      setResultsList((prev) => prev.map((s) => (s.id === editingStudentId ? payload : s)));
      showToast(`Student "${payload.studentName}" updated successfully in ${res.isLiveDb ? 'Supabase Live DB' : 'System'}`);
    } else {
      setResultsList((prev) => [payload, ...prev]);
      showToast(`New Student "${payload.studentName}" added successfully to ${res.isLiveDb ? 'Supabase Live DB' : 'System'}`);
    }

    setShowStudentModal(false);
  };

  // Delete student
  const handleDeleteStudent = async (student: StudentResult) => {
    if (window.confirm(`Are you sure you want to permanently delete student "${student.studentName}" (Roll ${student.rollNumber})?`)) {
      await deleteStudentResultFromDb(student.id || student.rollNumber);
      setResultsList((prev) => prev.filter((s) => s.id !== student.id && s.rollNumber !== student.rollNumber));
      showToast(`Student "${student.studentName}" removed.`);
    }
  };

  // Handle Admission Status Change
  const handleUpdateAppStatus = async (id: string, status: AdminApplicationItem['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    await updateAdmissionStatusInDb(id, status);
    showToast(`Application status updated to "${status}"`);
  };

  // Delete Admission Application
  const handleDeleteAdmission = async (id: string) => {
    if (window.confirm('Delete this admission application?')) {
      await deleteAdmissionFromDb(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      showToast('Admission application deleted.');
    }
  };

  // Filtered Students
  const filteredStudents = resultsList.filter((s) => {
    const matchSearch =
      s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase());
    const matchGrade = studentGradeFilter === 'All' || s.grade === studentGradeFilter;
    return matchSearch && matchGrade;
  });

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    if (appFilter === 'All') return true;
    return app.status === appFilter;
  });

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('School profile configuration saved successfully.');
  };

  // Add Notice
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title) return;
    const item = {
      id: Date.now().toString(),
      title: newNotice.title,
      category: newNotice.category,
      audience: newNotice.audience,
      date: 'Today',
      active: true,
    };
    setNotices([item, ...notices]);
    setNewNotice({ title: '', category: 'Academic', audience: 'All Students' });
    setShowNoticeModal(false);
    showToast('Notice broadcasted successfully.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-800">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#123B70] text-[#FFB800] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#123B70]">Super Admin Authentication</h2>
            <p className="text-xs text-slate-500 mt-1">Future Leaders School Control Panel</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#123B70]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Access Passkey</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#123B70]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#123B70] hover:bg-[#2167B2] text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm cursor-pointer"
            >
              Sign In to Super Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {statusNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#123B70] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#FFB800]/50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#FFB800]" />
          <span className="text-xs sm:text-sm font-semibold">{statusNotification}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="bg-[#123B70] text-white border-b border-blue-900/60 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/logo.jpg"
                alt="FLS Logo"
                className="w-9 h-9 object-contain rounded-lg border border-white/20 p-0.5 bg-white"
              />
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-base tracking-wide block leading-tight">
                  FUTURE LEADERS SCHOOL
                </span>
                <span className="text-[10px] tracking-widest text-[#FFB800] uppercase font-bold">
                  SUPER ADMIN PORTAL
                </span>
              </div>
            </Link>

            {/* Supabase Connection Pill */}
            <div className="ml-2 sm:ml-4 flex items-center gap-1.5 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-700/60 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isLiveDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold text-slate-200">
                {isLiveDbConnected ? 'Supabase Database: Live Connected' : 'Local Storage Mode'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Data from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync DB</span>
            </button>

            <Link
              to="/results"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Public Results</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl bg-rose-900/40 hover:bg-rose-900 text-rose-200 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'students'
                ? 'bg-[#123B70] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#FFB800]" />
            <span>Students & Results ({resultsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'admissions'
                ? 'bg-[#123B70] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4 text-[#FFB800]" />
            <span>Admissions Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#123B70] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-[#FFB800]" />
            <span>Analytics & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('study-plans')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'study-plans'
                ? 'bg-[#123B70] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#FFB800]" />
            <span>Daily Study Plans</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'notices'
                ? 'bg-[#123B70] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4 text-[#FFB800]" />
            <span>Notice Board</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#123B70] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-[#FFB800]" />
            <span>School Settings</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB: STUDENTS & RESULTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B70]">
                  Student Directory & Results Management
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Add new students, assign Student IDs, set profile pictures, add/change subjects & marks, and update records in Supabase.
                </p>
              </div>

              <button
                onClick={handleOpenAddStudent}
                className="bg-[#123B70] hover:bg-[#2167B2] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#FFB800]" />
                <span>Add New Student & Result</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by student name, roll number, or student ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
                />
              </div>

              <div>
                <select
                  value={studentGradeFilter}
                  onChange={(e) => setStudentGradeFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
                >
                  <option value="All">All Grades</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[#123B70] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3.5 px-4">Student Info & Picture</th>
                      <th className="py-3.5 px-4">Student ID & Roll</th>
                      <th className="py-3.5 px-4">Grade & Section</th>
                      <th className="py-3.5 px-4">Subjects & Total</th>
                      <th className="py-3.5 px-4">GPA & Grade</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((st) => (
                        <tr key={st.id || st.rollNumber} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {st.studentPhoto ? (
                                <img
                                  src={st.studentPhoto}
                                  alt={st.studentName}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-[#123B70] text-[#FFB800] flex items-center justify-center font-bold text-sm shrink-0">
                                  {st.studentName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-900 text-sm block">
                                  {st.studentName}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {st.gender || 'Student'} {st.parentName ? `• Guardian: ${st.parentName}` : ''}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-[#123B70] block">{st.studentId}</span>
                            <span className="text-slate-500 font-medium">Roll: {st.rollNumber}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block">{st.grade}</span>
                            <span className="text-slate-500 text-[11px]">{st.section}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900">
                              {st.obtainedTotal} / {st.totalMarks}
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              {st.subjects.length} subjects tested
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-[#123B70]">{st.gpa.toFixed(2)}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#2167B2] border border-blue-200">
                                {st.letterGrade}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">Rank #{st.positionInClass}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                st.status === 'Promoted with Distinction'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : st.status === 'Passed'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {st.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Marksheet Modal */}
                              <button
                                onClick={() => setViewingMarksheet(st)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#123B70] hover:text-white text-slate-700 transition-colors cursor-pointer"
                                title="View Official Marksheet"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Everything */}
                              <button
                                onClick={() => handleOpenEditStudent(st)}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-[#2167B2] hover:text-white text-[#2167B2] transition-colors cursor-pointer"
                                title="Edit Student & Marks"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Student */}
                              <button
                                onClick={() => handleDeleteStudent(st)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No student records match your search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ADMISSIONS APPLICATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'admissions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B70]">
                  Admissions Application Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage incoming student enrollments, schedule interviews, update statuses, and approve candidates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
                <select
                  value={appFilter}
                  onChange={(e) => setAppFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option value="All">All Applications</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[#123B70] uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3.5 px-4">Applicant Student</th>
                      <th className="py-3.5 px-4">Applying Grade</th>
                      <th className="py-3.5 px-4">Parent / Contact</th>
                      <th className="py-3.5 px-4">Date Submitted</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Change Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.length > 0 ? (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 text-sm block">{app.studentName}</span>
                            <span className="text-[11px] text-slate-500">{app.notes}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#123B70]">{app.applyingGrade}</td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 block">{app.parentName}</span>
                            <span className="text-[11px] text-slate-500">{app.contactNumber} • {app.email}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{app.submissionDate}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as any)}
                                className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-slate-50 font-medium"
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Approved">Approve</option>
                                <option value="Declined">Decline</option>
                              </select>

                              <button
                                onClick={() => handleDeleteAdmission(app.id)}
                                className="p-1 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No admission applications found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: OVERVIEW & ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Enrolled Students</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-[#123B70]">{resultsList.length}</span>
                  <span className="text-xs text-emerald-600 font-semibold">+100% active</span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">Tracked across all grades</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Admissions Pending</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-[#FFB800]">
                    {applications.filter((a) => a.status === 'Pending Review').length}
                  </span>
                  <span className="text-xs text-slate-500">/ {applications.length} total</span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">Awaiting review & interview</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Average School GPA</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-emerald-700">
                    {resultsList.length > 0
                      ? (resultsList.reduce((acc, c) => acc + c.gpa, 0) / resultsList.length).toFixed(2)
                      : '0.00'}
                  </span>
                  <span className="text-xs text-slate-500">/ 5.00</span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">Institutional Academic Metric</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Database Status</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-base font-bold text-slate-900">Supabase Cloud</span>
                </div>
                <span className="text-xs text-emerald-600 mt-1 block">Tables: results, admissions</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: DAILY STUDY PLANS */}
        {/* ========================================================================= */}
        {activeTab === 'study-plans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B70]">
                  Daily Study Plans & Routines
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage class schedules, subject topics, homework assignments, and due dates.
                </p>
              </div>

              <Link
                to="/study-plan"
                target="_blank"
                className="bg-[#123B70] hover:bg-[#2167B2] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>View Public Routine</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyPlansList.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <span className="font-bold text-base text-[#123B70]">{plan.grade} Routine</span>
                      <span className="text-xs text-slate-500 block">{plan.dayName} • {plan.date}</span>
                    </div>
                    <span className="text-xs font-bold bg-blue-50 text-[#2167B2] px-2.5 py-1 rounded-lg border border-blue-200">
                      {plan.periods.length} Periods
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {plan.periods.map((p, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{p.time} — {p.subject}</span>
                          <span className="text-slate-500 font-normal">{p.teacher}</span>
                        </div>
                        <p className="text-slate-600 mt-1 font-medium">Topic: {p.topic}</p>
                        <p className="text-emerald-700 mt-0.5">HW: {p.homework}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: NOTICE BOARD */}
        {/* ========================================================================= */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B70]">
                  Campus Circulars & Urgent Notices
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Broadcast school announcements, exam schedules, and holiday notifications.
                </p>
              </div>

              <button
                onClick={() => setShowNoticeModal(true)}
                className="bg-[#123B70] hover:bg-[#2167B2] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#FFB800]" />
                <span>Broadcast New Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B70] flex items-center justify-center shrink-0">
                      <Bell className="w-5 h-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-[#2167B2]">{n.category}</span>
                        <span>•</span>
                        <span>Audience: {n.audience}</span>
                        <span>•</span>
                        <span>{n.date}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setNotices(notices.filter((item) => item.id !== n.id))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: SCHOOL SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-3xl">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B70] mb-2">
              Institution Identity & Global Settings
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Update institutional contact information, addresses, and official accreditation placeholders.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">School Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Motto / Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Official Contact Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Official Email Address</label>
                  <input
                    type="text"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Office Hours Placeholder</label>
                <input
                  type="text"
                  value={settingsForm.officeHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, officeHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <button
                type="submit"
                className="bg-[#123B70] hover:bg-[#2167B2] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer mt-2"
              >
                Save Global Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT STUDENT & DYNAMIC SUBJECTS BUILDER */}
      {/* ========================================================================= */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#123B70] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#FFB800]" />
                  <span>{editingStudentId ? 'Edit Student Details & Marks' : 'Add New Student & Academic Record'}</span>
                </h3>
                <p className="text-xs text-slate-200">
                  {editingStudentId ? 'Update student info, photo, ID, subjects and marks' : 'Create a complete student profile with custom subjects and GPA calculation'}
                </p>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveStudent} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
              {/* SECTION 1: STUDENT PROFILE & IDENTIFIERS */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-serif font-bold text-[#123B70] text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <UserCheck className="w-4 h-4 text-[#FFB800]" />
                  <span>1. Student Identity & Photograph</span>
                </h4>

                {/* Photo Selection / Upload */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex flex-col items-center">
                    {studentForm.studentPhoto ? (
                      <img
                        src={studentForm.studentPhoto}
                        alt="Preview"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#123B70] shadow-md bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-blue-100 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-700">
                        <ImageIcon className="w-8 h-8 opacity-60" />
                        <span className="text-[10px] font-bold mt-1">No Photo</span>
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 mt-1">Student Picture</span>
                  </div>

                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Select Preset Student Photo or Provide Custom Image URL:
                      </label>
                      <input
                        type="text"
                        placeholder="Paste image URL (https://...)"
                        value={studentForm.studentPhoto}
                        onChange={(e) => setStudentForm({ ...studentForm, studentPhoto: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
                      />
                    </div>

                    {/* Preset Avatars */}
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block mb-1">Or Quick Pick Preset Photo:</span>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setStudentForm({ ...studentForm, studentPhoto: av.url })}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                              studentForm.studentPhoto === av.url
                                ? 'bg-[#123B70] text-white border-[#123B70]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#123B70]'
                            }`}
                          >
                            <img src={av.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                            <span>{av.label}</span>
                          </button>
                        ))}

                        <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-blue-400 bg-blue-50 text-blue-800 text-[11px] font-semibold cursor-pointer hover:bg-blue-100">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload from PC</span>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name, Roll, ID Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rayan Chowdhury"
                      value={studentForm.studentName}
                      onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 105"
                      value={studentForm.rollNumber}
                      onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Student ID No.
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateId}
                        className="text-[10px] text-[#2167B2] hover:underline font-bold"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={studentForm.studentId}
                      onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
                    />
                  </div>
                </div>

                {/* Grade, Section, Gender, Parent Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Class / Grade</label>
                    <select
                      value={studentForm.grade}
                      onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    >
                      <option value="Kindergarten">Kindergarten</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Section</label>
                    <input
                      type="text"
                      value={studentForm.section}
                      onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Gender</label>
                    <select
                      value={studentForm.gender}
                      onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Parent Contact</label>
                    <input
                      type="text"
                      value={studentForm.contactNumber}
                      onChange={(e) => setStudentForm({ ...studentForm, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: EXAM DETAILS & ACADEMIC REMARKS */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-serif font-bold text-[#123B70] text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Award className="w-4 h-4 text-[#FFB800]" />
                  <span>2. Examination Session & Remarks</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Exam Name</label>
                    <input
                      type="text"
                      value={studentForm.examName}
                      onChange={(e) => setStudentForm({ ...studentForm, examName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Academic Session</label>
                    <input
                      type="text"
                      value={studentForm.session}
                      onChange={(e) => setStudentForm({ ...studentForm, session: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Attendance Rate</label>
                    <input
                      type="text"
                      value={studentForm.attendance}
                      onChange={(e) => setStudentForm({ ...studentForm, attendance: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Class Rank / Position</label>
                    <input
                      type="number"
                      value={studentForm.positionInClass}
                      onChange={(e) => setStudentForm({ ...studentForm, positionInClass: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Teacher Remarks / Evaluation</label>
                  <textarea
                    rows={2}
                    value={studentForm.teacherRemarks}
                    onChange={(e) => setStudentForm({ ...studentForm, teacherRemarks: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                  />
                </div>
              </div>

              {/* SECTION 3: DYNAMIC SUBJECTS & MARKS BUILDER */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <h4 className="font-serif font-bold text-[#123B70] text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FFB800]" />
                    <span>3. Dynamic Subjects & Marks Evaluation</span>
                  </h4>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadStandardCurriculum}
                      className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-[#123B70] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Load 7 Standard Subjects
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomSubject}
                      className="px-2.5 py-1 rounded-lg bg-[#123B70] hover:bg-[#2167B2] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>+ Add Subject</span>
                    </button>
                  </div>
                </div>

                {/* Subject Rows */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-slate-500 px-2">
                    <span className="col-span-5">Subject Name</span>
                    <span className="col-span-2 text-center">Full Marks</span>
                    <span className="col-span-2 text-center">Obtained</span>
                    <span className="col-span-2 text-center">Grade (GPA)</span>
                    <span className="col-span-1 text-center">Del</span>
                  </div>

                  {studentForm.subjects.map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-slate-200">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleUpdateSubject(idx, 'name', e.target.value)}
                          placeholder="e.g. Higher Mathematics"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          value={sub.fullMarks}
                          onChange={(e) => handleUpdateSubject(idx, 'fullMarks', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-center"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          value={sub.obtainedMarks}
                          onChange={(e) => handleUpdateSubject(idx, 'obtainedMarks', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-center text-[#123B70]"
                        />
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="inline-block px-2 py-1 rounded bg-slate-100 font-extrabold text-[11px] text-[#2167B2]">
                          {sub.grade} ({sub.gradePoint.toFixed(1)})
                        </span>
                      </div>

                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Remove subject"
                        >
                          <Trash2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Real-time Calculation Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#123B70] to-[#2167B2] text-white flex flex-wrap items-center justify-between gap-4 mt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#FFB800] block">
                      Auto-Calculated CGPA
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold">{computedSummary.gpa.toFixed(2)}</span>
                      <span className="text-sm font-bold text-[#FFB800]">{computedSummary.letterGrade}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-0.5">
                    <div>Total Marks: <strong>{computedSummary.totalMarks}</strong></div>
                    <div>Obtained Aggregate: <strong>{computedSummary.obtainedTotal}</strong></div>
                    <div>Standing: <span className="text-emerald-300 font-bold">{computedSummary.status}</span></div>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2167B2] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />
                  <span>{editingStudentId ? 'Save & Update in Supabase' : 'Publish & Save Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL MARKSHEET PREVIEW & PRINT */}
      {/* ========================================================================= */}
      {viewingMarksheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-3 bg-[#123B70] text-white flex items-center justify-between">
              <span className="font-bold text-xs text-[#FFB800]">OFFICIAL MARKSHEET INSPECTOR</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setViewingMarksheet(null)}
                  className="p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              {/* Header */}
              <div className="text-center pb-5 border-b-2 border-[#123B70]/20 mb-5">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <img src="/images/logo.jpg" alt="" className="w-12 h-12 object-contain rounded-lg p-0.5 border" />
                  <div className="text-left">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#123B70]">FUTURE LEADERS SCHOOL</h2>
                    <p className="text-[10px] tracking-widest text-[#FFB800] uppercase font-bold">Learn • Grow • Lead</p>
                  </div>
                </div>
                <h3 className="font-serif font-bold text-sm text-[#123B70] mt-2">
                  OFFICIAL ACADEMIC TRANSCRIPT & REPORT CARD
                </h3>
                <p className="text-xs text-slate-500">{viewingMarksheet.examName} • Session: {viewingMarksheet.session}</p>
              </div>

              {/* Student Metadata Card with Photo */}
              <div className="flex items-center gap-4 bg-[#F3F8FD] p-4 rounded-2xl border border-blue-100 mb-5">
                {viewingMarksheet.studentPhoto ? (
                  <img
                    src={viewingMarksheet.studentPhoto}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#123B70] text-white flex items-center justify-center font-bold text-xl shrink-0">
                    {viewingMarksheet.studentName.charAt(0)}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs flex-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Name</span>
                    <strong className="text-slate-900">{viewingMarksheet.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">ID / Roll</span>
                    <span className="font-bold text-[#123B70]">{viewingMarksheet.studentId} (Roll {viewingMarksheet.rollNumber})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Grade & Sec</span>
                    <span>{viewingMarksheet.grade} • {viewingMarksheet.section}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Attendance</span>
                    <span className="font-bold text-emerald-700">{viewingMarksheet.attendance}</span>
                  </div>
                </div>
              </div>

              {/* GPA Ribbon */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div className="p-3 rounded-xl bg-[#123B70] text-white">
                  <span className="text-[10px] uppercase text-[#FFB800] font-bold">GPA Score</span>
                  <div className="text-2xl font-extrabold">{viewingMarksheet.gpa.toFixed(2)}</div>
                  <span className="text-xs text-[#FFB800] font-bold">{viewingMarksheet.letterGrade}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Total Marks</span>
                  <div className="text-2xl font-bold text-slate-800">{viewingMarksheet.obtainedTotal}</div>
                  <span className="text-[11px] text-slate-500">out of {viewingMarksheet.totalMarks}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Assessment</span>
                  <div className="text-xs font-bold text-emerald-700 mt-2 bg-emerald-50 px-2 py-1 rounded inline-block">
                    {viewingMarksheet.status}
                  </div>
                </div>
              </div>

              {/* Subjects Table */}
              <table className="w-full text-left border-collapse text-xs mb-4">
                <thead>
                  <tr className="bg-slate-100 border-b text-[#123B70] font-bold">
                    <th className="py-2 px-3">Subject Name</th>
                    <th className="py-2 px-3 text-center">Full Marks</th>
                    <th className="py-2 px-3 text-center">Obtained</th>
                    <th className="py-2 px-3 text-center">Letter Grade</th>
                    <th className="py-2 px-3 text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingMarksheet.subjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-medium text-slate-800">{sub.name}</td>
                      <td className="py-2 px-3 text-center text-slate-500">{sub.fullMarks}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">{sub.obtainedMarks}</td>
                      <td className="py-2 px-3 text-center font-bold text-[#123B70]">{sub.grade}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">{sub.gradePoint.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border">
                <strong>Teacher's Evaluation:</strong> "{viewingMarksheet.teacherRemarks}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BROADCAST NOTICE */}
      {/* ========================================================================= */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <h3 className="font-serif font-bold text-lg text-[#123B70] mb-3">Broadcast Campus Notice</h3>
            <form onSubmit={handleAddNotice} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fair 2026 Registration Open"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Notice Category</label>
                <select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                >
                  <option value="Academic">Academic</option>
                  <option value="Events">Events</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Urgent Circular">Urgent Circular</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newNotice.audience}
                  onChange={(e) => setNewNotice({ ...newNotice, audience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#123B70] hover:bg-[#2167B2] text-white text-xs font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
