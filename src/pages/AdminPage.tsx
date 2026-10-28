import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  initialStudyPlans,
  allFacultyAndStaff,
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
  StaffMember,
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
  Users,
  Home,
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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@futureleadersschool.edu.bd');
  const [adminPass, setAdminPass] = useState('superadmin2026');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'admissions' | 'study-plans' | 'notices' | 'settings'>('students');

  // Live data states
  const [applications, setApplications] = useState<AdminApplicationItem[]>([]);
  const [resultsList, setResultsList] = useState<StudentResult[]>([]);
  const [teachersList] = useState<StaffMember[]>(allFacultyAndStaff);
  const [studyPlansList] = useState<DailyStudyPlan[]>(initialStudyPlans);
  const [isLiveDbConnected, setIsLiveDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Filters & Search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('All');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');

  // Modals
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [viewingMarksheet, setViewingMarksheet] = useState<StudentResult | null>(null);

  // Notice board state
  const [notices, setNotices] = useState([
    { id: '1', title: 'Admissions Open for Academic Session 2026-2027', category: 'Admissions', date: 'Oct 28, 2026', audience: 'Public & Parents', active: true },
    { id: '2', title: 'Annual Sports & Leadership Meet 2026 Scheduled', category: 'Events', date: 'Oct 25, 2026', audience: 'All Students', active: true },
    { id: '3', title: 'Term 2 Report Card Distribution on Campus', category: 'Academic', date: 'Oct 20, 2026', audience: 'Grade 1 - 10', active: true },
  ]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', category: 'Academic', audience: 'All Students' });

  // School Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: schoolInfo.name,
    tagline: schoolInfo.tagline,
    phone: schoolInfo.phonePlaceholder,
    email: schoolInfo.emailPlaceholder,
    address: schoolInfo.addressPlaceholder,
    officeHours: schoolInfo.officeHoursPlaceholder,
  });

  // Student Form State
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

  // Dynamic calculations for GPA & Letter Grade in modal
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

  // Load Data
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

  // Add Student Handler
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

  // Edit Student Handler
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

  // Photo upload from computer
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

  // Subject actions
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

  // Save student (Insert or Update in Supabase)
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
      showToast(`Student "${payload.studentName}" updated successfully in ${res.isLiveDb ? 'Supabase Live Database' : 'System'}`);
    } else {
      setResultsList((prev) => [payload, ...prev]);
      showToast(`New Student "${payload.studentName}" saved to ${res.isLiveDb ? 'Supabase Live Database' : 'System'}`);
    }

    setShowStudentModal(false);
  };

  // Delete student
  const handleDeleteStudent = async (student: StudentResult) => {
    if (window.confirm(`Permanently delete record for student "${student.studentName}" (Roll ${student.rollNumber})?`)) {
      await deleteStudentResultFromDb(student.id || student.rollNumber);
      setResultsList((prev) => prev.filter((s) => s.id !== student.id && s.rollNumber !== student.rollNumber));
      showToast(`Student record for "${student.studentName}" removed.`);
    }
  };

  // Admission status update
  const handleUpdateAppStatus = async (id: string, status: AdminApplicationItem['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    await updateAdmissionStatusInDb(id, status);
    showToast(`Application status updated to "${status}" in Supabase`);
  };

  const handleDeleteAdmission = async (id: string) => {
    if (window.confirm('Delete this admission application record?')) {
      await deleteAdmissionFromDb(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      showToast('Admission application deleted.');
    }
  };

  // Filtered queries
  const filteredStudents = resultsList.filter((s) => {
    const q = studentSearch.toLowerCase();
    const matchSearch =
      s.studentName.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q);
    const matchGrade = studentGradeFilter === 'All' || s.grade === studentGradeFilter;
    return matchSearch && matchGrade;
  });

  const filteredTeachers = teachersList.filter((t) => {
    const q = teacherSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q)
    );
  });

  const filteredApps = applications.filter((app) => {
    if (appFilter === 'All') return true;
    return app.status === appFilter;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('School configuration updated successfully.');
  };

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
    showToast('Notice published successfully.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B2345] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[#E1E8F0]">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#123B70] text-[#F2B544] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0B2345]">Super Admin Console</h2>
            <p className="text-xs text-[#66758A] mt-1">Future Leaders School Control Panel</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-[#18263A] uppercase mb-1">Administrator Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E1E8F0] text-sm focus:ring-2 focus:ring-[#123B70]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#18263A] uppercase mb-1">Access Passkey</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E1E8F0] text-sm focus:ring-2 focus:ring-[#123B70]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#123B70] hover:bg-[#2563A6] text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
            >
              Sign In to Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex text-[#18263A] font-sans antialiased">
      {/* Toast Notification Banner */}
      {statusNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#0B2345] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#F2B544]/60 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-[#F2B544]" />
          <span className="text-xs sm:text-sm font-semibold">{statusNotification}</span>
        </div>
      )}

      {/* EXECUTIVE SIDEBAR */}
      <aside className="w-64 bg-[#0B2345] text-white flex flex-col justify-between shrink-0 hidden md:flex border-r border-blue-950">
        <div>
          {/* Logo & School Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="FLS Crest"
              className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 border border-white/20"
            />
            <div>
              <span className="font-serif font-bold text-sm block leading-tight text-white tracking-wide">
                FUTURE LEADERS
              </span>
              <span className="text-[10px] tracking-widest text-[#F2B544] uppercase font-bold block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-3 block mb-2">
                CORE MANAGEMENT
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#F2B544]" />
                  <span>Overview & KPIs</span>
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'students'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-[#F2B544]" />
                    <span>Students & Results</span>
                  </span>
                  <span className="text-[10px] bg-blue-900/80 px-2 py-0.5 rounded-full text-slate-200">
                    {resultsList.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'teachers'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#F2B544]" />
                    <span>Teachers & Staff</span>
                  </span>
                  <span className="text-[10px] bg-blue-900/80 px-2 py-0.5 rounded-full text-slate-200">
                    {teachersList.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('admissions')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'admissions'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-[#F2B544]" />
                    <span>Admissions</span>
                  </span>
                  {applications.filter((a) => a.status === 'Pending Review').length > 0 && (
                    <span className="text-[10px] bg-[#F2B544] text-[#0B2345] px-1.5 py-0.5 rounded font-black">
                      {applications.filter((a) => a.status === 'Pending Review').length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-3 block mb-2">
                ACADEMICS & NOTICES
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('study-plans')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'study-plans'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#F2B544]" />
                  <span>Daily Study Plans</span>
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'notices'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Bell className="w-4 h-4 text-[#F2B544]" />
                  <span>Notice Board</span>
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider px-3 block mb-2">
                CONFIGURATION
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 text-[#F2B544]" />
                  <span>School Settings</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Supabase Sync status */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Database Status</span>
              <span className={`w-2 h-2 rounded-full ${isLiveDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </div>
            <p className="text-[11px] font-semibold text-slate-200">
              {isLiveDbConnected ? 'Supabase Live Connected' : 'Local Sandbox Mode'}
            </p>
            <button
              onClick={loadData}
              className="text-[10px] text-[#F2B544] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync with Supabase</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="hover:text-rose-400 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Top Header */}
        <header className="h-16 bg-white border-b border-[#E1E8F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Tab Drawer Toggle */}
            <div className="md:hidden flex items-center gap-1 overflow-x-auto max-w-[200px] scrollbar-none">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${activeTab === 'students' ? 'bg-[#123B70] text-white' : 'bg-slate-100'}`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('admissions')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${activeTab === 'admissions' ? 'bg-[#123B70] text-white' : 'bg-slate-100'}`}
              >
                Apps
              </button>
            </div>

            <span className="text-xs font-bold text-[#66758A] hidden sm:inline">
              Super Admin Control Workspace
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs font-bold text-[#123B70] capitalize hidden sm:inline">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/results"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E1E8F0] text-xs font-bold text-[#123B70] hover:bg-slate-50 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Public Results</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-[#123B70] hover:bg-[#2563A6] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3 text-[#F2B544]" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {/* TAB: STUDENTS & RESULTS */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">
                    Student Directory & Result Publisher
                  </h2>
                  <p className="text-xs text-[#66758A] mt-1">
                    Manage student records, photos, IDs, custom subjects, marks, and publish official academic results to Supabase.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddStudent}
                  className="bg-[#123B70] hover:bg-[#2563A6] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#F2B544]" />
                  <span>Add New Student & Result</span>
                </button>
              </div>

              {/* Search & Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by student name, roll number, or student ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E1E8F0] text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
                  />
                </div>

                <div>
                  <select
                    value={studentGradeFilter}
                    onChange={(e) => setStudentGradeFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E8F0] text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-[#123B70]"
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

              {/* Table */}
              <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5F8FC] border-b border-[#E1E8F0] text-[#123B70] uppercase font-bold text-[11px] tracking-wider">
                        <th className="py-3.5 px-4">Student & Photo</th>
                        <th className="py-3.5 px-4">Student ID & Roll</th>
                        <th className="py-3.5 px-4">Grade & Section</th>
                        <th className="py-3.5 px-4">Marks Aggregate</th>
                        <th className="py-3.5 px-4">GPA & Letter</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((st) => (
                          <tr key={st.id || st.rollNumber} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {st.studentPhoto ? (
                                  <img
                                    src={st.studentPhoto}
                                    alt={st.studentName}
                                    className="w-10 h-10 rounded-xl object-cover border border-[#E1E8F0] shadow-xs shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-[#123B70] text-[#F2B544] flex items-center justify-center font-bold text-sm shrink-0">
                                    {st.studentName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-[#0B2345] text-sm block">
                                    {st.studentName}
                                  </span>
                                  <span className="text-[11px] text-[#66758A]">
                                    {st.gender || 'Student'} {st.parentName ? `• G: ${st.parentName}` : ''}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-[#123B70] block">{st.studentId}</span>
                              <span className="text-[#66758A]">Roll: {st.rollNumber}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-semibold text-[#18263A] block">{st.grade}</span>
                              <span className="text-[11px] text-[#66758A]">{st.section}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-[#0B2345]">
                                {st.obtainedTotal} / {st.totalMarks}
                              </span>
                              <span className="block text-[11px] text-[#66758A]">
                                {st.subjects.length} subjects
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-sm text-[#123B70]">{st.gpa.toFixed(2)}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#2563A6] border border-blue-200">
                                  {st.letterGrade}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block">Rank #{st.positionInClass}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  st.status === 'Promoted with Distinction'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : st.status === 'Passed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {st.status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewingMarksheet(st)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#123B70] hover:text-white text-slate-700 transition-colors cursor-pointer"
                                  title="View Marksheet"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditStudent(st)}
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-[#2563A6] hover:text-white text-[#2563A6] transition-colors cursor-pointer"
                                  title="Edit Student & Subjects"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
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
                            No student records found. Click "+ Add New Student" to publish a student transcript.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEACHERS & STAFF MANAGEMENT */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">
                    Teachers & Faculty Roster
                  </h2>
                  <p className="text-xs text-[#66758A] mt-1">
                    Manage certified faculty profiles, designations, departmental allocations, and contact emails.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search faculty..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeachers.map((t) => (
                  <div key={t.id} className="bg-white p-4 rounded-2xl border border-[#E1E8F0] shadow-xs flex items-center gap-3.5">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#2563A6] uppercase block truncate">{t.department}</span>
                      <h4 className="font-serif font-bold text-sm text-[#0B2345] truncate">{t.name}</h4>
                      <p className="text-[11px] text-[#66758A] truncate">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ADMISSIONS PIPELINE */}
          {activeTab === 'admissions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">
                    Admissions Application Pipeline
                  </h2>
                  <p className="text-xs text-[#66758A] mt-1">
                    Incoming applications submitted through the online admissions portal. Update review status or schedule interviews.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#66758A]">Status:</span>
                  <select
                    value={appFilter}
                    onChange={(e) => setAppFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#E1E8F0] text-xs bg-white font-medium"
                  >
                    <option value="All">All Applications</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5F8FC] border-b border-[#E1E8F0] text-[#123B70] uppercase font-bold text-[11px]">
                        <th className="py-3 px-4">Applicant</th>
                        <th className="py-3 px-4">Applying Grade</th>
                        <th className="py-3 px-4">Guardian Contact</th>
                        <th className="py-3 px-4">Submission Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApps.length > 0 ? (
                        filteredApps.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <span className="font-bold text-[#0B2345] text-sm block">{app.studentName}</span>
                              <span className="text-[11px] text-[#66758A]">{app.notes}</span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#123B70]">{app.applyingGrade}</td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-[#18263A] block">{app.parentName}</span>
                              <span className="text-[11px] text-[#66758A]">{app.contactNumber} • {app.email}</span>
                            </td>
                            <td className="py-3 px-4 text-[#66758A]">{app.submissionDate}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                                  className="px-2 py-1 rounded-lg border border-[#E1E8F0] text-[11px] bg-slate-50 font-medium"
                                >
                                  <option value="Pending Review">Pending Review</option>
                                  <option value="Interview Scheduled">Interview Scheduled</option>
                                  <option value="Approved">Approve</option>
                                  <option value="Declined">Decline</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteAdmission(app.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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
                            No admission applications match this filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active Students</span>
                  <div className="text-3xl font-extrabold text-[#123B70] mt-1">{resultsList.length}</div>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">Live academic records</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Applications</span>
                  <div className="text-3xl font-extrabold text-[#F2B544] mt-1">
                    {applications.filter((a) => a.status === 'Pending Review').length}
                  </div>
                  <span className="text-xs text-[#66758A] mt-1 block">Awaiting review</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Average School CGPA</span>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                    {resultsList.length > 0
                      ? (resultsList.reduce((acc, c) => acc + c.gpa, 0) / resultsList.length).toFixed(2)
                      : '0.00'}
                  </div>
                  <span className="text-xs text-[#66758A] mt-1 block">Scale of 5.00</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Members</span>
                  <div className="text-3xl font-extrabold text-[#2563A6] mt-1">{teachersList.length}</div>
                  <span className="text-xs text-[#66758A] mt-1 block">Certified educators</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DAILY STUDY PLANS */}
          {activeTab === 'study-plans' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">Daily Study Plans</h2>
                  <p className="text-xs text-[#66758A] mt-1">Manage scheduled classes, topics, and homework assignments.</p>
                </div>
                <Link
                  to="/study-plan"
                  target="_blank"
                  className="bg-[#123B70] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  View Public Routine
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlansList.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs">
                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                      <span className="font-bold text-[#123B70]">{plan.grade} Schedule</span>
                      <span className="text-xs text-[#66758A]">{plan.dayName}</span>
                    </div>
                    <div className="space-y-2">
                      {plan.periods.map((p, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#F5F8FC] border text-xs">
                          <div className="font-bold text-[#18263A]">{p.time} — {p.subject}</div>
                          <p className="text-[#66758A]">Topic: {p.topic}</p>
                          <p className="text-emerald-700">HW: {p.homework}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">Campus Circulars & Notices</h2>
                  <p className="text-xs text-[#66758A] mt-1">Broadcast official school circulars and announcements.</p>
                </div>
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="bg-[#123B70] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#F2B544]" />
                  <span>New Notice</span>
                </button>
              </div>

              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n.id} className="bg-white p-4 rounded-2xl border border-[#E1E8F0] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0B2345]">{n.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#66758A] mt-0.5">
                        <span className="font-semibold text-[#2563A6]">{n.category}</span>
                        <span>•</span>
                        <span>{n.audience}</span>
                        <span>•</span>
                        <span>{n.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotices(notices.filter((item) => item.id !== n.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E1E8F0] shadow-xs max-w-2xl">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345] mb-2">School Profile Configuration</h2>
              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-[#18263A] uppercase text-[11px] mb-1">School Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18263A] uppercase text-[11px] mb-1">Official Hotline</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18263A] uppercase text-[11px] mb-1">Campus Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1E8F0]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#123B70] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT STUDENT & DYNAMIC SUBJECT BUILDER */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-[#E1E8F0] max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#0B2345] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#F2B544]" />
                  <span>{editingStudentId ? 'Edit Student Details & Subjects' : 'Add New Student & Academic Record'}</span>
                </h3>
                <p className="text-xs text-slate-200">
                  Manage student identity, photo, dynamic subjects, marks, and auto-calculate GPA.
                </p>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
              {/* Profile Details */}
              <div className="bg-[#F5F8FC] p-5 rounded-2xl border border-[#E1E8F0] space-y-4">
                <h4 className="font-serif font-bold text-[#123B70] text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E1E8F0] pb-2">
                  <UserCheck className="w-4 h-4 text-[#F2B544]" />
                  <span>1. Student Identity & Photograph</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex flex-col items-center">
                    {studentForm.studentPhoto ? (
                      <img
                        src={studentForm.studentPhoto}
                        alt="Preview"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#123B70] shadow-sm bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-blue-100 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-700">
                        <ImageIcon className="w-8 h-8 opacity-60" />
                        <span className="text-[10px] font-bold mt-1">No Photo</span>
                      </div>
                    )}
                    <span className="text-[10px] text-[#66758A] mt-1">Student Picture</span>
                  </div>

                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#18263A] uppercase mb-1">
                        Select Preset Photo or Provide Custom Image URL:
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={studentForm.studentPhoto}
                        onChange={(e) => setStudentForm({ ...studentForm, studentPhoto: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs bg-white font-medium"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setStudentForm({ ...studentForm, studentPhoto: av.url })}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                            studentForm.studentPhoto === av.url
                              ? 'bg-[#123B70] text-white border-[#123B70]'
                              : 'bg-white text-slate-700 border-[#E1E8F0]'
                          }`}
                        >
                          <img src={av.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                          <span>{av.label}</span>
                        </button>
                      ))}

                      <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-blue-400 bg-blue-50 text-blue-800 text-[11px] font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from PC</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#18263A] uppercase mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rayan Chowdhury"
                      value={studentForm.studentName}
                      onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#18263A] uppercase mb-1">Roll Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 105"
                      value={studentForm.rollNumber}
                      onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#18263A] uppercase">Student ID No.</label>
                      <button
                        type="button"
                        onClick={() => setStudentForm((p) => ({ ...p, studentId: `FLS-2026-${p.rollNumber || '101'}` }))}
                        className="text-[10px] text-[#2563A6] hover:underline font-bold"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={studentForm.studentId}
                      onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#18263A] uppercase mb-1">Class / Grade</label>
                    <select
                      value={studentForm.grade}
                      onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
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
                    <label className="block text-[11px] font-bold text-[#18263A] uppercase mb-1">Section</label>
                    <input
                      type="text"
                      value={studentForm.section}
                      onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#18263A] uppercase mb-1">Gender</label>
                    <select
                      value={studentForm.gender}
                      onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#18263A] uppercase mb-1">Parent Contact</label>
                    <input
                      type="text"
                      value={studentForm.contactNumber}
                      onChange={(e) => setStudentForm({ ...studentForm, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Subjects Builder */}
              <div className="bg-[#F5F8FC] p-5 rounded-2xl border border-[#E1E8F0] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E1E8F0] pb-2">
                  <h4 className="font-serif font-bold text-[#123B70] text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F2B544]" />
                    <span>2. Dynamic Subjects & Marks Evaluation</span>
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
                      className="px-2.5 py-1 rounded-lg bg-[#123B70] hover:bg-[#2563A6] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#F2B544]" />
                      <span>+ Add Subject</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-[#66758A] px-2">
                    <span className="col-span-5">Subject Name</span>
                    <span className="col-span-2 text-center">Full Marks</span>
                    <span className="col-span-2 text-center">Obtained</span>
                    <span className="col-span-2 text-center">Grade</span>
                    <span className="col-span-1 text-center">Del</span>
                  </div>

                  {studentForm.subjects.map((sub, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-[#E1E8F0]">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleUpdateSubject(idx, 'name', e.target.value)}
                          placeholder="e.g. Higher Mathematics"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={sub.fullMarks}
                          onChange={(e) => handleUpdateSubject(idx, 'fullMarks', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-center font-medium"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={sub.obtainedMarks}
                          onChange={(e) => handleUpdateSubject(idx, 'obtainedMarks', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-center font-bold text-[#123B70]"
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-2 py-1 rounded bg-slate-100 font-extrabold text-[11px] text-[#2563A6]">
                          {sub.grade} ({sub.gradePoint.toFixed(1)})
                        </span>
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Auto Calculated Summary Box */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#0B2345] to-[#123B70] text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#F2B544] block">Auto-Calculated CGPA</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold">{computedSummary.gpa.toFixed(2)}</span>
                      <span className="text-sm font-bold text-[#F2B544]">{computedSummary.letterGrade}</span>
                    </div>
                  </div>
                  <div className="text-xs space-y-0.5 text-right">
                    <div>Total Marks: <strong>{computedSummary.totalMarks}</strong> | Obtained: <strong>{computedSummary.obtainedTotal}</strong></div>
                    <div>Academic Standing: <span className="text-emerald-300 font-bold">{computedSummary.status}</span></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E1E8F0]">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2563A6] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F2B544]" />
                  <span>{editingStudentId ? 'Save & Update in Supabase' : 'Publish & Save to Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW MARKSHEET */}
      {viewingMarksheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-[#E1E8F0] max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-3 bg-[#0B2345] text-white flex items-center justify-between">
              <span className="font-bold text-xs text-[#F2B544]">OFFICIAL MARKSHEET INSPECTOR</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setViewingMarksheet(null)}
                  className="p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="text-center pb-5 border-b-2 border-[#123B70]/20 mb-5">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <img src="/images/logo.jpg" alt="" className="w-12 h-12 object-contain rounded-lg p-0.5 border" />
                  <div className="text-left">
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-[#0B2345]">FUTURE LEADERS SCHOOL</h2>
                    <p className="text-[10px] tracking-widest text-[#F2B544] uppercase font-bold">Learn • Grow • Lead</p>
                  </div>
                </div>
                <h3 className="font-serif font-bold text-sm text-[#123B70] mt-2">
                  OFFICIAL ACADEMIC TRANSCRIPT & REPORT CARD
                </h3>
                <p className="text-xs text-[#66758A]">{viewingMarksheet.examName} • Session: {viewingMarksheet.session}</p>
              </div>

              {/* Student Metadata Card */}
              <div className="flex items-center gap-4 bg-[#F5F8FC] p-4 rounded-2xl border border-[#E1E8F0] mb-5">
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
                    <strong className="text-[#0B2345]">{viewingMarksheet.studentName}</strong>
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

              {/* Summary */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div className="p-3 rounded-xl bg-[#123B70] text-white">
                  <span className="text-[10px] uppercase text-[#F2B544] font-bold">GPA Score</span>
                  <div className="text-2xl font-extrabold">{viewingMarksheet.gpa.toFixed(2)}</div>
                  <span className="text-xs text-[#F2B544] font-bold">{viewingMarksheet.letterGrade}</span>
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

              {/* Table */}
              <table className="w-full text-left border-collapse text-xs mb-4">
                <thead>
                  <tr className="bg-[#F5F8FC] border-b border-[#E1E8F0] text-[#123B70] font-bold">
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

              <p className="text-xs text-[#66758A] italic bg-[#F5F8FC] p-3 rounded-xl border border-[#E1E8F0]">
                <strong>Teacher's Evaluation:</strong> "{viewingMarksheet.teacherRemarks}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST NOTICE */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E1E8F0]">
            <h3 className="font-serif font-bold text-lg text-[#0B2345] mb-3">Broadcast Campus Notice</h3>
            <form onSubmit={handleAddNotice} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[11px] mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fair Registration Open"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[11px] mb-1">Category</label>
                <select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
                >
                  <option value="Academic">Academic</option>
                  <option value="Events">Events</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Urgent Circular">Urgent Circular</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[11px] mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newNotice.audience}
                  onChange={(e) => setNewNotice({ ...newNotice, audience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
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
                  className="px-4 py-2 rounded-xl bg-[#123B70] text-white text-xs font-bold"
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
