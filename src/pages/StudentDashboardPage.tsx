import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  DollarSign,
  Calendar,
  LogOut,
  CreditCard,
  Home,
  ChevronRight,
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../lib/auth';
import { initialResults, initialFeeRecords, initialStudyPlans } from '../data/schoolData';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const authUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<'home' | 'results' | 'fees' | 'idcard'>('home');

  // Match student from data
  const student =
    initialResults.find(
      (s) =>
        s.studentId.toLowerCase() === (authUser?.identifier || '').toLowerCase() ||
        s.studentName.toLowerCase().includes((authUser?.name || '').toLowerCase())
    ) || initialResults[0];

  const studentFees = initialFeeRecords.filter(
    (f) => f.studentId === student.studentId || f.studentName === student.studentName
  );
  const totalDue = studentFees.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24 text-[#18263A]">
      {/* Top Mobile App Header */}
      <div className="app-header-gradient text-white p-5 pt-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F2B544] flex items-center justify-center text-[#123B70] font-black">
              FLS
            </div>
            <div>
              <span className="text-[10px] text-[#F2B544] font-extrabold uppercase tracking-wider block">Student App</span>
              <h2 className="text-sm font-black leading-tight text-white">Future Leaders School</h2>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Student Profile Overview Card */}
        <div className="flex items-center gap-4 app-header-glass p-4 rounded-2xl">
          <img
            src={student.studentPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
            alt={student.studentName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F2B544] shadow-md shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-base font-black leading-tight text-white">{student.studentName}</h1>
            <p className="text-xs text-slate-100 mt-0.5">
              Class: <span className="font-bold text-[#F2B544]">{student.grade} ({student.section})</span>
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-200">
              <span>Roll: <strong className="text-white">#{student.rollNumber}</strong></span>
              <span>•</span>
              <span>ID: <strong className="text-white">{student.studentId}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold text-[#66758A] block">Latest GPA</span>
                <span className="text-lg font-black text-[#123B70] mt-0.5 block">{student.gpa.toFixed(2)}</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                  Grade {student.letterGrade}
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold text-[#66758A] block">Attendance</span>
                <span className="text-lg font-black text-emerald-600 mt-0.5 block">{student.attendance}</span>
                <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">Present</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold text-[#66758A] block">Due Fees</span>
                <span className={`text-lg font-black mt-0.5 block ${totalDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  ৳{totalDue}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                  {totalDue > 0 ? 'Pending' : 'Cleared'}
                </span>
              </div>
            </div>

            {/* Daily Lessons / Homework Preview */}
            <div className="bg-white rounded-2xl p-4 border border-[#E1E8F0] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#123B70] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F2B544]" />
                  <span>Today's Study Plan & Homework</span>
                </h3>
                <span className="text-[10px] font-bold text-[#2563A6] bg-blue-50 px-2 py-0.5 rounded-full">
                  {student.grade}
                </span>
              </div>
              <div className="space-y-2">
                {initialStudyPlans.flatMap((plan) => plan.periods).slice(0, 3).map((period, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#F5F8FC] border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0B2345]">{period.subject}</span>
                      <span className="text-[10px] font-semibold text-[#66758A]">{period.time}</span>
                    </div>
                    <p className="text-xs text-[#18263A] mt-1 font-medium">{period.topic}</p>
                    <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/50">
                      <strong>HW:</strong> {period.homework}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('results')}
                className="p-4 rounded-2xl bg-white border border-[#E1E8F0] shadow-xs hover:border-[#123B70] transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <Award className="w-5 h-5 text-[#2563A6] mb-1" />
                  <span className="font-bold text-xs text-[#0B2345] block">View Marksheet</span>
                  <span className="text-[10px] text-[#66758A]">Report cards & grades</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className="p-4 rounded-2xl bg-white border border-[#E1E8F0] shadow-xs hover:border-[#123B70] transition-all text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <CreditCard className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="font-bold text-xs text-[#0B2345] block">Fee Invoices</span>
                  <span className="text-[10px] text-[#66758A]">Receipts & payment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </>
        )}

        {/* TAB 2: RESULTS */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs space-y-4">
            <div className="border-b border-[#E1E8F0] pb-3">
              <span className="text-[10px] font-bold text-[#F2B544] uppercase tracking-wider block">Academic Performance</span>
              <h3 className="text-base font-bold text-[#0B2345]">{student.examName} ({student.session})</h3>
              <p className="text-xs text-[#66758A]">Position in Class: <strong>#{student.positionInClass}</strong> • Total Marks: <strong>{student.obtainedTotal}/{student.totalMarks}</strong></p>
            </div>

            {/* Subject Marks Table */}
            <div className="space-y-2">
              {student.subjects.map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-[#0B2345] block">{sub.name}</span>
                    <span className="text-[10px] text-[#66758A]">Full: {sub.fullMarks}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#123B70] block">{sub.obtainedMarks}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sub.grade === 'A+' ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'}`}>
                      {sub.grade} (GP {sub.gradePoint.toFixed(1)})
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-[#123B70] text-xs">
              <strong>Teacher Remarks:</strong> {student.teacherRemarks}
            </div>
          </div>
        )}

        {/* TAB 3: FEES */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs space-y-4">
            <div className="border-b border-[#E1E8F0] pb-3">
              <span className="text-[10px] font-bold text-[#F2B544] uppercase tracking-wider block">Tuition & Invoices</span>
              <h3 className="text-base font-bold text-[#0B2345]">Fee History & Status</h3>
            </div>

            <div className="space-y-3">
              {studentFees.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#66758A]">No fee records found for this student.</div>
              ) : (
                studentFees.map((fee) => (
                  <div key={fee.id} className="p-4 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0B2345]">{fee.feeType}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fee.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee.status === 'Partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#66758A]">
                      <span>Invoice: <strong>#{fee.invoiceNo}</strong></span>
                      <span>Month: <strong>{fee.month}</strong></span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span>Total: <strong>৳{fee.amount}</strong></span>
                      <span className="text-emerald-700">Paid: <strong>৳{fee.paidAmount}</strong></span>
                      <span className="text-red-700">Due: <strong>৳{fee.amount - fee.paidAmount}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ID CARD */}
        {activeTab === 'idcard' && (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#123B70] shadow-xl text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#123B70] via-[#2563A6] to-[#F2B544]" />
            <div>
              <span className="text-[10px] font-black text-[#F2B544] uppercase tracking-widest block">Digital Student ID</span>
              <h2 className="text-base font-black text-[#0B2345]">Future Leaders School</h2>
            </div>

            <img
              src={student.studentPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
              alt={student.studentName}
              className="w-28 h-28 mx-auto rounded-2xl object-cover border-4 border-[#123B70] shadow-md"
            />

            <div>
              <h3 className="text-lg font-black text-[#123B70]">{student.studentName}</h3>
              <p className="text-xs font-bold text-[#F2B544] bg-[#0B2345] px-3 py-1 rounded-full inline-block mt-1">
                Class: {student.grade} • Roll: {student.rollNumber}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left text-xs bg-[#F5F8FC] p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-[#66758A] block">Student ID:</span>
                <span className="font-bold text-[#18263A]">{student.studentId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#66758A] block">Guardian:</span>
                <span className="font-bold text-[#18263A]">{student.parentName || 'Md. Hossain'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#66758A] block">Contact:</span>
                <span className="font-bold text-[#18263A]">{student.contactNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#66758A] block">Valid Thru:</span>
                <span className="font-bold text-emerald-700">Dec 2026</span>
              </div>
            </div>

            {/* Barcode Mock */}
            <div className="pt-2">
              <div className="h-9 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] tracking-widest font-mono">
                |||||| | ||||| ||||||| ||| ||||
              </div>
              <span className="text-[9px] text-[#66758A] mt-1 block">Official Barcode for School Turnstile & Library</span>
            </div>
          </div>
        )}
      </div>

      {/* Modern Bottom Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E1E8F0] px-4 py-2 flex items-center justify-around shadow-xl z-50">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'home' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'results' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px]">Results</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'fees' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[10px]">Fees</span>
        </button>

        <button
          onClick={() => setActiveTab('idcard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'idcard' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px]">ID Card</span>
        </button>
      </div>
    </div>
  );
};
