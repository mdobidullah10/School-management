import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  initialStudyPlans,
  allFacultyAndStaff,
  schoolInfo,
  initialFeeRecords,
  initialAttendanceList,
  initialLibraryBooks,
  initialBookIssues,
  initialTransportRoutes,
  initialSmsLogs,
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
  FeeRecord,
  AttendanceRecord,
  LibraryBook,
  BookIssueRecord,
  TransportRoute,
  SmsBroadcast,
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
  CreditCard,
  CheckSquare,
  QrCode,
  BookOpen,
  Bus,
  MessageSquare,
  DollarSign,
  Send,
  Smartphone,
  FileText,
  Clock,
} from 'lucide-react';

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

  // Active admin tab: expanded with all new requested modules!
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'students'
    | 'teachers'
    | 'admissions'
    | 'fees'
    | 'attendance'
    | 'id-cards'
    | 'library'
    | 'transport'
    | 'sms'
    | 'study-plans'
    | 'notices'
    | 'settings'
  >('students');

  // Live state
  const [applications, setApplications] = useState<AdminApplicationItem[]>([]);
  const [resultsList, setResultsList] = useState<StudentResult[]>([]);
  const [teachersList] = useState<StaffMember[]>(allFacultyAndStaff);
  const [studyPlansList] = useState<DailyStudyPlan[]>(initialStudyPlans);
  const [isLiveDbConnected, setIsLiveDbConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // New Module States
  const [feesList, setFeesList] = useState<FeeRecord[]>(initialFeeRecords);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(initialAttendanceList);
  const [selectedAttGrade, setSelectedAttGrade] = useState('Grade 7');
  const [libraryBooks] = useState<LibraryBook[]>(initialLibraryBooks);
  const [bookIssues] = useState<BookIssueRecord[]>(initialBookIssues);
  const [transportRoutes] = useState<TransportRoute[]>(initialTransportRoutes);
  const [smsLogs, setSmsLogs] = useState<SmsBroadcast[]>(initialSmsLogs);

  // Filters & Search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('All');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [appFilter, setAppFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');
  const [bookSearch, setBookSearch] = useState('');

  // Modals
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [viewingMarksheet, setViewingMarksheet] = useState<StudentResult | null>(null);

  // Fee Collection Modal
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
  const [selectedFeeInvoice, setSelectedFeeInvoice] = useState<FeeRecord | null>(null);
  const [newFeePayment, setNewFeePayment] = useState({
    studentName: 'Tahmid Hossain',
    rollNumber: '101',
    grade: 'Grade 7',
    feeType: 'Tuition Fee' as const,
    amount: 6500,
    paidAmount: 6500,
    paymentMethod: 'bKash' as const,
    transactionId: '',
  });

  // ID Card & Admit Card Generator State
  const [selectedIdCardStudent, setSelectedIdCardStudent] = useState<StudentResult | null>(null);
  const [idCardType, setIdCardType] = useState<'id-card' | 'admit-card' | 'testimonial'>('id-card');

  // SMS Broadcast Modal State
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsForm, setSmsForm] = useState({
    audience: 'All Parents',
    template: 'Custom Message',
    message: 'Dear Parents, tomorrow school will remain closed due to scheduled annual maintenance.',
  });

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

  // Real-time calculations for GPA & Letter Grade
  const computedSummary = useMemo(() => {
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
    if (resultsRes.results.length > 0) {
      setSelectedIdCardStudent(resultsRes.results[0]);
    }
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

  // Student CRUD Handlers
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

  const handleDeleteStudent = async (student: StudentResult) => {
    if (window.confirm(`Permanently delete record for student "${student.studentName}" (Roll ${student.rollNumber})?`)) {
      await deleteStudentResultFromDb(student.id || student.rollNumber);
      setResultsList((prev) => prev.filter((s) => s.id !== student.id && s.rollNumber !== student.rollNumber));
      showToast(`Student record for "${student.studentName}" removed.`);
    }
  };

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

  // Attendance Toggle Handler
  const handleToggleAttendance = (id: string, status: AttendanceRecord['status']) => {
    setAttendanceList((prev) =>
      prev.map((att) => (att.id === id ? { ...att, status } : att))
    );
    showToast(`Attendance updated for student.`);
  };

  // Fee Collection Submit
  const handleCollectFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: FeeRecord = {
      id: `fee-${Date.now()}`,
      invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: `FLS-2026-${newFeePayment.rollNumber}`,
      studentName: newFeePayment.studentName,
      rollNumber: newFeePayment.rollNumber,
      grade: newFeePayment.grade,
      month: 'October 2026',
      feeType: newFeePayment.feeType,
      amount: Number(newFeePayment.amount),
      paidAmount: Number(newFeePayment.paidAmount),
      dueDate: '2026-10-10',
      status: Number(newFeePayment.paidAmount) >= Number(newFeePayment.amount) ? 'Paid' : 'Partial',
      paymentMethod: newFeePayment.paymentMethod,
      transactionId: newFeePayment.transactionId || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
    };

    setFeesList([newRecord, ...feesList]);
    setShowCollectFeeModal(false);
    showToast(`Payment of ৳${newRecord.paidAmount} recorded successfully!`);
  };

  // SMS Broadcast Handler
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    const count =
      smsForm.audience === 'All Parents'
        ? 450
        : smsForm.audience === 'Fee Due Students'
        ? feesList.filter((f) => f.status !== 'Paid').length
        : 85;

    const newLog: SmsBroadcast = {
      id: `sms-${Date.now()}`,
      audience: smsForm.audience,
      message: smsForm.message,
      date: new Date().toLocaleString(),
      recipientsCount: count,
      status: 'Delivered',
    };

    setSmsLogs([newLog, ...smsLogs]);
    setShowSmsModal(false);
    showToast(`Broadcast sent to ${count} recipient phone numbers!`);
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

  const filteredFees = feesList.filter((f) => {
    if (feeFilter === 'All') return true;
    return f.status === feeFilter;
  });

  const filteredBooks = libraryBooks.filter((b) => {
    const q = bookSearch.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.code.toLowerCase().includes(q);
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

      {/* EXECUTIVE FULL SIDEBAR */}
      <aside className="w-64 bg-[#0B2345] text-white flex flex-col justify-between shrink-0 hidden md:flex border-r border-blue-950 overflow-y-auto max-h-screen scrollbar-none">
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
                ERP ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-5">
            {/* 1. Core Management */}
            <div>
              <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider px-3 block mb-1">
                CORE MANAGEMENT
              </span>
              <nav className="space-y-0.5">
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

            {/* 2. Operations & Billing */}
            <div>
              <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider px-3 block mb-1">
                OPERATIONS & ACCOUNTS
              </span>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('fees')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'fees'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[#F2B544]" />
                    <span>Fee Billing & Receipts</span>
                  </span>
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded">
                    ৳
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'attendance'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-[#F2B544]" />
                  <span>Daily Attendance Tracker</span>
                </button>

                <button
                  onClick={() => setActiveTab('id-cards')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'id-cards'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#F2B544]" />
                  <span>ID Cards & Admit Cards</span>
                </button>
              </nav>
            </div>

            {/* 3. Campus & Services */}
            <div>
              <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider px-3 block mb-1">
                CAMPUS & SERVICES
              </span>
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('library')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'library'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#F2B544]" />
                  <span>Library & Book Issues</span>
                </button>

                <button
                  onClick={() => setActiveTab('transport')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'transport'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Bus className="w-4 h-4 text-[#F2B544]" />
                  <span>School Transport & Buses</span>
                </button>

                <button
                  onClick={() => setActiveTab('sms')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === 'sms'
                      ? 'bg-[#123B70] text-[#F2B544] shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#F2B544]" />
                  <span>Bulk SMS Broadcast</span>
                </button>
              </nav>
            </div>

            {/* 4. Academics & Settings */}
            <div>
              <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider px-3 block mb-1">
                ACADEMICS & SYSTEM
              </span>
              <nav className="space-y-0.5">
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

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-2.5">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-slate-400">Database Status</span>
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
          <div className="flex items-center gap-2">
            {/* Mobile Tab Carousel */}
            <div className="md:hidden flex items-center gap-1 overflow-x-auto max-w-[240px] scrollbar-none py-1">
              {[
                { id: 'students', label: 'Students' },
                { id: 'fees', label: 'Fees' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'id-cards', label: 'ID Cards' },
                { id: 'admissions', label: 'Apps' },
                { id: 'library', label: 'Library' },
                { id: 'sms', label: 'SMS' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id as any)}
                  className={`px-2 py-1 rounded text-[11px] font-bold shrink-0 ${
                    activeTab === m.id ? 'bg-[#123B70] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-[#66758A] hidden sm:inline">
              Super Admin Console
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
          {/* TAB: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-[#66758A] block">Total Enrolled Students</span>
                  <div className="text-3xl font-extrabold text-[#123B70] mt-1">{resultsList.length}</div>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">Live records in Supabase</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-[#66758A] block">October Fees Collected</span>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                    ৳{feesList.reduce((acc, f) => acc + f.paidAmount, 0).toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Pending due: ৳{feesList.reduce((acc, f) => acc + (f.amount - f.paidAmount), 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-[#66758A] block">Today's Attendance</span>
                  <div className="text-3xl font-extrabold text-[#2563A6] mt-1">
                    {Math.round(
                      (attendanceList.filter((a) => a.status === 'Present' || a.status === 'Late').length /
                        (attendanceList.length || 1)) *
                        100
                    )}%
                  </div>
                  <span className="text-xs text-emerald-600 mt-1 block">Present & on time</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#E1E8F0] shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-[#66758A] block">Pending Admissions</span>
                  <div className="text-3xl font-extrabold text-[#F2B544] mt-1">
                    {applications.filter((a) => a.status === 'Pending Review').length}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">Awaiting interaction</span>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <h3 className="font-serif font-bold text-base text-[#0B2345] mb-3">Quick Executive Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={handleOpenAddStudent}
                    className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white text-center cursor-pointer transition-all"
                  >
                    <GraduationCap className="w-5 h-5 text-[#123B70] mx-auto mb-1.5" />
                    <span className="text-xs font-bold block text-[#0B2345]">+ Add Student</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('fees');
                      setShowCollectFeeModal(true);
                    }}
                    className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white text-center cursor-pointer transition-all"
                  >
                    <CreditCard className="w-5 h-5 text-emerald-700 mx-auto mb-1.5" />
                    <span className="text-xs font-bold block text-[#0B2345]">Collect Fee</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white text-center cursor-pointer transition-all"
                  >
                    <CheckSquare className="w-5 h-5 text-[#2563A6] mx-auto mb-1.5" />
                    <span className="text-xs font-bold block text-[#0B2345]">Attendance</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('id-cards');
                      setIdCardType('id-card');
                    }}
                    className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white text-center cursor-pointer transition-all"
                  >
                    <QrCode className="w-5 h-5 text-[#F2B544] mx-auto mb-1.5" />
                    <span className="text-xs font-bold block text-[#0B2345]">Print ID Card</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('sms');
                      setShowSmsModal(true);
                    }}
                    className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white text-center cursor-pointer transition-all"
                  >
                    <MessageSquare className="w-5 h-5 text-purple-700 mx-auto mb-1.5" />
                    <span className="text-xs font-bold block text-[#0B2345]">Send SMS</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('library')}
                    className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white text-center cursor-pointer transition-all"
                  >
                    <BookOpen className="w-5 h-5 text-blue-700 mx-auto mb-1.5" />
                    <span className="text-xs font-bold block text-[#0B2345]">Library Book</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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
                                  onClick={() => {
                                    setSelectedIdCardStudent(st);
                                    setActiveTab('id-cards');
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-[#F2B544] hover:text-[#0B2345] text-amber-700 transition-colors cursor-pointer"
                                  title="Generate Student ID Card"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
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

          {/* TAB: FEE COLLECTION & ACCOUNTS */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">
                    Fee Billing, Invoicing & Due Tracking
                  </h2>
                  <p className="text-xs text-[#66758A] mt-1">
                    Track monthly tuition, exam fees, session fees, record payments (bKash/Nagad/Cash), and print invoices.
                  </p>
                </div>

                <button
                  onClick={() => setShowCollectFeeModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <DollarSign className="w-4 h-4 text-[#F2B544]" />
                  <span>+ Record Payment / Collect Fee</span>
                </button>
              </div>

              {/* Fee Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E1E8F0]">
                  <span className="text-[10px] font-bold uppercase text-[#66758A]">Total Invoiced (October)</span>
                  <div className="text-2xl font-extrabold text-[#0B2345] mt-1">
                    ৳{feesList.reduce((acc, f) => acc + f.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E1E8F0]">
                  <span className="text-[10px] font-bold uppercase text-emerald-600">Total Collected</span>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                    ৳{feesList.reduce((acc, f) => acc + f.paidAmount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E1E8F0]">
                  <span className="text-[10px] font-bold uppercase text-rose-600">Outstanding Due</span>
                  <div className="text-2xl font-extrabold text-rose-700 mt-1">
                    ৳{feesList.reduce((acc, f) => acc + (f.amount - f.paidAmount), 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E1E8F0]">
                  <span className="text-[10px] font-bold uppercase text-[#2563A6]">Collection Rate</span>
                  <div className="text-2xl font-extrabold text-[#123B70] mt-1">
                    {Math.round(
                      (feesList.reduce((acc, f) => acc + f.paidAmount, 0) /
                        (feesList.reduce((acc, f) => acc + f.amount, 0) || 1)) *
                        100
                    )}%
                  </div>
                </div>
              </div>

              {/* Fees Table */}
              <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-[#E1E8F0] flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0B2345]">Billing Invoices & Receipts</span>
                  <select
                    value={feeFilter}
                    onChange={(e) => setFeeFilter(e.target.value)}
                    className="px-3 py-1 rounded-lg border text-xs bg-slate-50"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid / Due</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5F8FC] border-b text-[#123B70] font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Fee Category</th>
                        <th className="py-3 px-4">Billed Amount</th>
                        <th className="py-3 px-4">Paid</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFees.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#123B70]">{f.invoiceNo}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#0B2345] block">{f.studentName}</span>
                            <span className="text-[11px] text-[#66758A]">{f.grade} • Roll {f.rollNumber}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">{f.feeType}</td>
                          <td className="py-3 px-4 font-bold text-[#0B2345]">৳{f.amount}</td>
                          <td className="py-3 px-4 font-bold text-emerald-700">৳{f.paidAmount}</td>
                          <td className="py-3 px-4 text-[#66758A]">
                            {f.paymentMethod ? (
                              <span className="px-2 py-0.5 rounded bg-slate-100 border text-[10px] font-semibold">
                                {f.paymentMethod}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                f.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : f.status === 'Partial'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {f.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedFeeInvoice(f)}
                              className="px-2.5 py-1 rounded bg-[#123B70] hover:bg-[#2563A6] text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 text-[#F2B544]" />
                              <span>View Receipt</span>
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

          {/* TAB: DAILY ATTENDANCE TRACKER */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">
                    Daily Student Attendance Register
                  </h2>
                  <p className="text-xs text-[#66758A] mt-1">
                    Mark Present, Late, or Absent status for classes. Trigger absentee notifications to parents.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#F5F8FC] px-3 py-1.5 rounded-xl border text-xs font-bold text-[#123B70]">
                    <Clock className="w-3.5 h-3.5 text-[#F2B544]" />
                    <span>Today: {new Date().toISOString().split('T')[0]}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('sms');
                      setShowSmsModal(true);
                      setSmsForm({
                        audience: 'Absentee Parents',
                        template: 'Absent Notification',
                        message: 'Notice: Your child was recorded Absent today at Future Leaders School. Please contact the homeroom advisor.',
                      });
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS Absentees</span>
                  </button>
                </div>
              </div>

              {/* Class Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['Grade 5', 'Grade 7', 'Grade 10'].map((gr) => (
                  <button
                    key={gr}
                    onClick={() => setSelectedAttGrade(gr)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedAttGrade === gr
                        ? 'bg-[#123B70] text-white shadow-xs'
                        : 'bg-white text-slate-700 border hover:bg-slate-100'
                    }`}
                  >
                    {gr} Register
                  </button>
                ))}
              </div>

              {/* Attendance Table */}
              <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F8FC] border-b text-[#123B70] font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Roll</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Class & Section</th>
                      <th className="py-3 px-4">Entry Time</th>
                      <th className="py-3 px-4">Current Status</th>
                      <th className="py-3 px-4 text-right">Quick Mark Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceList.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-[#123B70]">{st.rollNumber}</td>
                        <td className="py-3 px-4 font-bold text-[#0B2345]">{st.studentName}</td>
                        <td className="py-3 px-4 text-[#66758A]">{st.grade} • {st.section}</td>
                        <td className="py-3 px-4 text-slate-500">{st.timeIn || '—'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : st.status === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleAttendance(st.id, 'Present')}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                st.status === 'Present' ? 'bg-emerald-700 text-white' : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleToggleAttendance(st.id, 'Late')}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                st.status === 'Late' ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 hover:bg-amber-50 text-slate-700'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => handleToggleAttendance(st.id, 'Absent')}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                st.status === 'Absent' ? 'bg-rose-600 text-white' : 'bg-slate-100 hover:bg-rose-50 text-slate-700'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ID CARDS & CERTIFICATES GENERATOR */}
          {activeTab === 'id-cards' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">
                    Document & Certificate Generator
                  </h2>
                  <p className="text-xs text-[#66758A] mt-1">
                    Generate printable Student ID Cards with barcodes, Examination Admit Cards, and Testimonials.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIdCardType('id-card')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      idCardType === 'id-card' ? 'bg-[#123B70] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Student ID Card
                  </button>
                  <button
                    onClick={() => setIdCardType('admit-card')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      idCardType === 'admit-card' ? 'bg-[#123B70] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Exam Admit Card
                  </button>
                  <button
                    onClick={() => setIdCardType('testimonial')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      idCardType === 'testimonial' ? 'bg-[#123B70] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Character Testimonial
                  </button>
                </div>
              </div>

              {/* Student Picker */}
              <div className="bg-white p-4 rounded-xl border border-[#E1E8F0] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#18263A]">Select Student Candidate:</span>
                  <select
                    value={selectedIdCardStudent?.rollNumber || ''}
                    onChange={(e) => {
                      const st = resultsList.find((r) => r.rollNumber === e.target.value);
                      if (st) setSelectedIdCardStudent(st);
                    }}
                    className="px-3 py-1.5 rounded-lg border text-xs bg-slate-50 font-bold text-[#123B70]"
                  >
                    {resultsList.map((s) => (
                      <option key={s.rollNumber} value={s.rollNumber}>
                        Roll {s.rollNumber} — {s.studentName} ({s.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-[#123B70] hover:bg-[#2563A6] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Print Document</span>
                </button>
              </div>

              {/* Document Live Preview Area */}
              {selectedIdCardStudent && (
                <div className="flex justify-center p-6 bg-slate-200/60 rounded-3xl border border-slate-300">
                  {/* Option 1: Student ID Card */}
                  {idCardType === 'id-card' && (
                    <div className="w-[340px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-300 relative text-center">
                      <div className="bg-[#0B2345] text-white py-3 px-4 border-b-2 border-[#F2B544]">
                        <img src="/images/logo.jpg" alt="" className="w-8 h-8 mx-auto rounded mb-1 bg-white p-0.5" />
                        <h4 className="font-serif font-black text-sm tracking-wide">FUTURE LEADERS SCHOOL</h4>
                        <span className="text-[9px] uppercase tracking-widest text-[#F2B544] font-bold block">
                          STUDENT IDENTITY CARD
                        </span>
                      </div>

                      <div className="p-5 flex flex-col items-center">
                        {selectedIdCardStudent.studentPhoto ? (
                          <img
                            src={selectedIdCardStudent.studentPhoto}
                            alt=""
                            className="w-24 h-24 rounded-xl object-cover border-2 border-[#123B70] shadow-sm mb-3"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-xl bg-blue-100 text-[#123B70] font-black text-3xl flex items-center justify-center border-2 border-[#123B70] mb-3">
                            {selectedIdCardStudent.studentName.charAt(0)}
                          </div>
                        )}

                        <h3 className="font-serif font-bold text-base text-[#0B2345]">
                          {selectedIdCardStudent.studentName}
                        </h3>
                        <span className="text-xs font-bold text-[#123B70]">
                          ID: {selectedIdCardStudent.studentId}
                        </span>

                        <div className="w-full grid grid-cols-2 gap-2 text-left text-[11px] bg-[#F5F8FC] p-3 rounded-xl border border-slate-200 mt-3">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Class</span>
                            <strong>{selectedIdCardStudent.grade}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Roll No</span>
                            <strong>{selectedIdCardStudent.rollNumber}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Section</span>
                            <strong>{selectedIdCardStudent.section}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">Emergency Tel</span>
                            <strong>{selectedIdCardStudent.contactNumber || '+880 1700-000000'}</strong>
                          </div>
                        </div>

                        {/* Barcode Simulator */}
                        <div className="mt-4 pt-3 border-t border-slate-200 w-full flex flex-col items-center">
                          <div className="h-7 w-48 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px)]" />
                          <span className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">
                            *{selectedIdCardStudent.studentId}*
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 2: Exam Admit Card */}
                  {idCardType === 'admit-card' && (
                    <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-xl border border-slate-300">
                      <div className="text-center pb-4 border-b-2 border-[#123B70]/30 mb-4">
                        <div className="flex items-center justify-center gap-3">
                          <img src="/images/logo.jpg" alt="" className="w-10 h-10 object-contain rounded" />
                          <div className="text-left">
                            <h3 className="font-serif font-black text-lg text-[#0B2345]">FUTURE LEADERS SCHOOL</h3>
                            <span className="text-[10px] uppercase font-bold text-[#123B70] tracking-wider block">
                              ANNUAL EXAMINATION 2026 — OFFICIAL ADMIT CARD
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 mb-4 text-xs">
                        {selectedIdCardStudent.studentPhoto && (
                          <img
                            src={selectedIdCardStudent.studentPhoto}
                            alt=""
                            className="w-16 h-20 rounded object-cover border shrink-0"
                          />
                        )}
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          <div><strong>Name:</strong> {selectedIdCardStudent.studentName}</div>
                          <div><strong>ID:</strong> {selectedIdCardStudent.studentId}</div>
                          <div><strong>Class:</strong> {selectedIdCardStudent.grade}</div>
                          <div><strong>Roll Number:</strong> {selectedIdCardStudent.rollNumber}</div>
                          <div><strong>Section:</strong> {selectedIdCardStudent.section}</div>
                          <div><strong>Exam Center:</strong> Main Campus Hall 2</div>
                        </div>
                      </div>

                      <table className="w-full text-left border-collapse text-xs mb-4">
                        <thead>
                          <tr className="bg-slate-100 border text-[#123B70] font-bold">
                            <th className="p-2">Subject</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Time</th>
                            <th className="p-2">Room #</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-[11px]">
                          {selectedIdCardStudent.subjects.slice(0, 4).map((s, i) => (
                            <tr key={i}>
                              <td className="p-1.5 font-semibold">{s.name}</td>
                              <td className="p-1.5">Nov 0{i + 1}, 2026</td>
                              <td className="p-1.5">09:00 AM – 12:00 PM</td>
                              <td className="p-1.5">Room 30{i + 1}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                        <span className="text-[10px] text-slate-400">Printed: {new Date().toLocaleDateString()}</span>
                        <div className="text-center">
                          <div className="w-28 border-b border-slate-800 mb-1" />
                          <span className="text-[10px] font-bold">Controller of Examinations</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 3: Testimonial */}
                  {idCardType === 'testimonial' && (
                    <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl border-4 border-[#123B70] text-center">
                      <img src="/images/logo.jpg" alt="" className="w-12 h-12 mx-auto mb-2 rounded" />
                      <h3 className="font-serif font-black text-xl text-[#0B2345]">FUTURE LEADERS SCHOOL</h3>
                      <p className="text-[10px] tracking-widest uppercase font-bold text-[#F2B544]">
                        ACADEMIC & CHARACTER TESTIMONIAL
                      </p>

                      <p className="text-xs text-slate-700 leading-relaxed my-6 text-justify">
                        This is to certify that <strong>{selectedIdCardStudent.studentName}</strong>, son/daughter of{' '}
                        <strong>{selectedIdCardStudent.parentName || 'Guardian'}</strong>, bearing Student ID{' '}
                        <strong>{selectedIdCardStudent.studentId}</strong> and Roll No{' '}
                        <strong>{selectedIdCardStudent.rollNumber}</strong>, has been a bonafide student of this institution in{' '}
                        <strong>{selectedIdCardStudent.grade}</strong>. To the best of our knowledge and school records,
                        the student possesses commendable moral character, intellectual curiosity, and exemplary discipline.
                      </p>

                      <div className="flex items-center justify-between pt-8 border-t border-slate-200 text-xs">
                        <span className="text-[11px] font-bold text-slate-500">Date: {new Date().toLocaleDateString()}</span>
                        <div>
                          <div className="w-32 border-b-2 border-slate-800 mb-1" />
                          <span className="font-serif font-bold text-xs">Principal & Head of School</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: LIBRARY & BOOK ISSUES */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">
                    Library Catalog & Circulation
                  </h2>
                  <p className="text-xs text-[#66758A] mt-1">
                    Manage book stock, shelf positions, issue tracking, and student borrow history.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E1E8F0] text-xs font-medium"
                  />
                </div>
              </div>

              {/* Book Catalog Table */}
              <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F8FC] border-b text-[#123B70] font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Book Code</th>
                      <th className="py-3 px-4">Book Title & Author</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Available / Total</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBooks.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-[#123B70]">{b.code}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0B2345] block">{b.title}</span>
                          <span className="text-[11px] text-[#66758A]">By {b.author}</span>
                        </td>
                        <td className="py-3 px-4">{b.category}</td>
                        <td className="py-3 px-4 text-slate-500">{b.shelfNo}</td>
                        <td className="py-3 px-4 font-bold">
                          <span className="text-emerald-700">{b.availableCopies}</span> / {b.totalCopies}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            In Circulation
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Active Book Issues */}
              <div className="bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <h3 className="font-serif font-bold text-base text-[#0B2345] mb-3">Active Student Borrows</h3>
                <div className="space-y-2">
                  {bookIssues.map((iss) => (
                    <div key={iss.id} className="p-3 rounded-xl bg-[#F5F8FC] border text-xs flex items-center justify-between">
                      <div>
                        <strong className="text-[#0B2345]">{iss.bookTitle}</strong>
                        <span className="text-[#66758A] block">
                          Borrowed by {iss.studentName} ({iss.studentId}) • Return Due: {iss.dueDate}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          iss.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {iss.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SCHOOL TRANSPORT & BUS FLEET */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">School Bus Fleet & Routes</h2>
                  <p className="text-xs text-[#66758A] mt-1">Manage school transit routes, driver contacts, and assigned students.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {transportRoutes.map((rt) => (
                  <div key={rt.id} className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Bus className="w-5 h-5 text-[#123B70]" />
                        <span className="font-bold text-sm text-[#0B2345]">{rt.busNo}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ৳{rt.monthlyFee}/mo
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#123B70]">{rt.routeName}</h4>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>Driver:</strong> {rt.driverName}</p>
                      <p><strong>Contact:</strong> {rt.driverPhone}</p>
                      <p><strong>Capacity:</strong> {rt.assignedStudents} / {rt.capacity} seats taken</p>
                    </div>

                    <div className="pt-2 border-t">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Stops:</span>
                      <div className="flex flex-wrap gap-1">
                        {rt.stops.map((st, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BULK SMS BROADCAST */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">Bulk SMS & Parent Gateway</h2>
                  <p className="text-xs text-[#66758A] mt-1">Broadcast automated SMS alerts for exam dates, fee reminders, or emergency notices.</p>
                </div>
                <button
                  onClick={() => setShowSmsModal(true)}
                  className="bg-[#123B70] hover:bg-[#2563A6] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Compose Broadcast SMS</span>
                </button>
              </div>

              {/* SMS Audit History */}
              <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
                <div className="p-4 border-b font-bold text-xs text-[#0B2345]">Recent SMS Dispatch Logs</div>
                <div className="divide-y divide-slate-100">
                  {smsLogs.map((log) => (
                    <div key={log.id} className="p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#123B70]">{log.audience}</span>
                          <span className="text-[11px] text-slate-400">• {log.date}</span>
                        </div>
                        <p className="text-slate-700 italic">"{log.message}"</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-semibold text-slate-500">{log.recipientsCount} Numbers</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">Teachers & Faculty Roster</h2>
                  <p className="text-xs text-[#66758A] mt-1">Manage certified faculty profiles, qualifications, and department allocations.</p>
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
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">Admissions Application Pipeline</h2>
                  <p className="text-xs text-[#66758A] mt-1">Incoming applications submitted through the online admissions portal.</p>
                </div>
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

              <div className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F8FC] border-b text-[#123B70] font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Applying Grade</th>
                      <th className="py-3 px-4">Guardian Contact</th>
                      <th className="py-3 px-4">Submission Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0B2345] text-sm block">{app.studentName}</span>
                          <span className="text-[11px] text-[#66758A]">{app.notes}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#123B70]">{app.applyingGrade}</td>
                        <td className="py-3 px-4 text-[#18263A]">{app.parentName} • {app.contactNumber}</td>
                        <td className="py-3 px-4 text-slate-500">{app.submissionDate}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as any)}
                            className="px-2 py-1 rounded-lg border text-[11px] bg-slate-50 mr-2"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Interview Scheduled">Interview</option>
                            <option value="Approved">Approve</option>
                            <option value="Declined">Decline</option>
                          </select>
                          <button
                            onClick={() => handleDeleteAdmission(app.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: STUDY PLANS */}
          {activeTab === 'study-plans' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E1E8F0] shadow-xs">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345]">Daily Study Plans</h2>
                  <p className="text-xs text-[#66758A] mt-1">Manage scheduled classes, topics, and homework assignments.</p>
                </div>
                <Link to="/study-plan" target="_blank" className="bg-[#123B70] text-white px-4 py-2 rounded-xl text-xs font-bold">
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
                  <p className="text-xs text-[#66758A] mt-1">Broadcast official school announcements.</p>
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
                    <button onClick={() => setNotices(notices.filter((item) => item.id !== n.id))} className="p-1.5 text-slate-400 hover:text-rose-600">
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
                <button type="submit" className="bg-[#123B70] text-white px-5 py-2.5 rounded-xl text-xs font-bold">
                  Save Settings
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: COLLECT FEE / RECORD PAYMENT */}
      {showCollectFeeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E1E8F0]">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-serif font-bold text-lg text-[#0B2345] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <span>Record Fee Payment</span>
              </h3>
              <button onClick={() => setShowCollectFeeModal(false)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectFeeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={newFeePayment.studentName}
                  onChange={(e) => setNewFeePayment({ ...newFeePayment, studentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={newFeePayment.rollNumber}
                    onChange={(e) => setNewFeePayment({ ...newFeePayment, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={newFeePayment.grade}
                    onChange={(e) => setNewFeePayment({ ...newFeePayment, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Fee Amount (BDT)</label>
                  <input
                    type="number"
                    value={newFeePayment.amount}
                    onChange={(e) => setNewFeePayment({ ...newFeePayment, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Paid Amount (BDT)</label>
                  <input
                    type="number"
                    value={newFeePayment.paidAmount}
                    onChange={(e) => setNewFeePayment({ ...newFeePayment, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Payment Method</label>
                <select
                  value={newFeePayment.paymentMethod}
                  onChange={(e) => setNewFeePayment({ ...newFeePayment, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                >
                  <option value="bKash">bKash Merchant Pay</option>
                  <option value="Nagad">Nagad Online</option>
                  <option value="Bank Transfer">Bank Deposit / Transfer</option>
                  <option value="Cash Counter">Cash Counter (Accounts Office)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Transaction ID / Slip No</label>
                <input
                  type="text"
                  placeholder="e.g. TRX-9824A10"
                  value={newFeePayment.transactionId}
                  onChange={(e) => setNewFeePayment({ ...newFeePayment, transactionId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCollectFeeModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW INVOICE RECEIPT */}
      {selectedFeeInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <span className="font-bold text-xs text-[#123B70]">OFFICIAL MONEY RECEIPT</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded bg-slate-100 text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setSelectedFeeInvoice(null)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-center pb-3 border-b mb-3">
              <img src="/images/logo.jpg" alt="" className="w-10 h-10 mx-auto rounded mb-1" />
              <h3 className="font-serif font-black text-sm text-[#0B2345]">FUTURE LEADERS SCHOOL</h3>
              <p className="text-[10px] text-slate-500">Student Accounts & Tuition Receipt</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 mb-4 bg-[#F5F8FC] p-3 rounded-xl border">
              <div className="flex justify-between"><span>Invoice No:</span><strong>{selectedFeeInvoice.invoiceNo}</strong></div>
              <div className="flex justify-between"><span>Student:</span><strong>{selectedFeeInvoice.studentName}</strong></div>
              <div className="flex justify-between"><span>Roll / ID:</span><strong>{selectedFeeInvoice.studentId} (Roll {selectedFeeInvoice.rollNumber})</strong></div>
              <div className="flex justify-between"><span>Class:</span><strong>{selectedFeeInvoice.grade}</strong></div>
              <div className="flex justify-between"><span>Billing Category:</span><strong>{selectedFeeInvoice.feeType} ({selectedFeeInvoice.month})</strong></div>
              <div className="flex justify-between"><span>Payment Method:</span><strong>{selectedFeeInvoice.paymentMethod || 'Cash'}</strong></div>
              <div className="flex justify-between"><span>Status:</span><span className="font-bold text-emerald-700">{selectedFeeInvoice.status}</span></div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center mb-4">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Amount Paid</span>
              <div className="text-2xl font-black text-emerald-800">৳{selectedFeeInvoice.paidAmount.toLocaleString()}</div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t text-[10px] text-slate-400">
              <span>Date: {selectedFeeInvoice.paymentDate || 'Today'}</span>
              <span>Accounts Officer Signature</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST SMS */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E1E8F0]">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-serif font-bold text-lg text-[#0B2345] flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-700" />
                <span>Send Bulk SMS Alert</span>
              </h3>
              <button onClick={() => setShowSmsModal(false)} className="p-1 rounded text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Target Recipient Group</label>
                <select
                  value={smsForm.audience}
                  onChange={(e) => setSmsForm({ ...smsForm, audience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                >
                  <option value="All Parents">All Enrolled Student Guardians (450 Numbers)</option>
                  <option value="Grade 7 Parents">Grade 7 Parents Only</option>
                  <option value="Fee Due Students">Fee Pending Guardians Only (38 Numbers)</option>
                  <option value="Faculty & Staff">All Teachers & Staff</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#18263A] uppercase text-[10px] mb-1">Quick SMS Template</label>
                <select
                  value={smsForm.template}
                  onChange={(e) => {
                    const t = e.target.value;
                    let msg = smsForm.message;
                    if (t === 'Fee Due Reminder') msg = 'Urgent: Monthly school tuition deadline is approaching. Please clear balance via portal or bank to avoid late charge.';
                    if (t === 'Holiday Announcement') msg = 'Notice: Future Leaders School will remain closed on Sunday on occasion of regional holiday. Classes resume Monday.';
                    if (t === 'Exam Routine') msg = 'Dear Parents, Examination schedule has been released online. Check your child result & routine portal.';
                    setSmsForm({ ...smsForm, template: t, message: msg });
                  }}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-50"
                >
                  <option value="Custom Message">Custom Message</option>
                  <option value="Fee Due Reminder">Fee Due Reminder</option>
                  <option value="Holiday Announcement">Holiday Announcement</option>
                  <option value="Exam Routine">Exam Routine Published</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-bold text-[#18263A] uppercase text-[10px]">SMS Text Message</label>
                  <span className="text-[10px] text-slate-400">{smsForm.message.length} chars (1 SMS unit)</span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={smsForm.message}
                  onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
