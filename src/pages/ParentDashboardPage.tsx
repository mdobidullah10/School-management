import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Award,
  DollarSign,
  LogOut,
  Bell,
  MessageCircle,
  Phone,
  CheckCircle2,
  Home,
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../lib/auth';
import { initialResults, initialFeeRecords, initialStudyPlans } from '../data/schoolData';

export const ParentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const authUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'fees' | 'contact'>('overview');
  const [inquirySent, setInquirySent] = useState(false);
  const [parentMsg, setParentMsg] = useState('');

  // Link child data
  const child =
    initialResults.find(
      (s) =>
        (authUser?.phone && s.contactNumber && s.contactNumber.includes(authUser.phone)) ||
        (authUser?.parentName && s.parentName && s.parentName.toLowerCase().includes(authUser.parentName.toLowerCase()))
    ) || initialResults[0];

  const childFees = initialFeeRecords.filter((f) => f.studentId === child.studentId);
  const totalDue = childFees.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMsg.trim()) return;
    setInquirySent(true);
    setParentMsg('');
    setTimeout(() => setInquirySent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24 text-[#18263A]">
      {/* Top Mobile Parent Header */}
      <div className="app-header-gradient text-white p-5 pt-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F2B544] flex items-center justify-center text-[#123B70] font-black">
              FLS
            </div>
            <div>
              <span className="text-[10px] text-[#F2B544] font-extrabold uppercase tracking-wider block">Guardian Portal</span>
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

        {/* Child Overview Glass Card */}
        <div className="app-header-glass p-4 rounded-2xl flex items-center gap-4">
          <img
            src={child.studentPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
            alt={child.studentName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F2B544] shadow-md shrink-0"
          />
          <div className="flex-1">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Enrolled Student</span>
            <h1 className="text-base font-black text-white leading-tight">{child.studentName}</h1>
            <p className="text-xs text-slate-100 mt-0.5">
              Class: <span className="font-bold text-[#F2B544]">{child.grade} ({child.section})</span> • Roll #{child.rollNumber}
            </p>
            <p className="text-[11px] text-slate-200 mt-1">
              Guardian: <strong>{child.parentName || 'Md. Hossain'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Quick KPI stats */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold text-[#66758A] block">Attendance</span>
                <span className="text-lg font-black text-emerald-600 mt-0.5 block">{child.attendance}</span>
                <span className="text-[10px] font-semibold text-slate-500 block">Regular</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold text-[#66758A] block">Exam GPA</span>
                <span className="text-lg font-black text-[#123B70] mt-0.5 block">{child.gpa.toFixed(2)}</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block">
                  Grade {child.letterGrade}
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold text-[#66758A] block">Fee Due</span>
                <span className={`text-lg font-black mt-0.5 block ${totalDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  ৳{totalDue}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 block">
                  {totalDue > 0 ? 'Due Pending' : 'All Clear'}
                </span>
              </div>
            </div>

            {/* School Broadcasts for Parents */}
            <div className="bg-white rounded-2xl p-4 border border-[#E1E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-[#0B2345] uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#F2B544]" />
                  <span>Important Notices for Parents</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#123B70]">Parent-Teacher Meeting (PTM)</span>
                    <span className="text-[10px] text-[#66758A]">Upcoming Friday</span>
                  </div>
                  <p className="text-xs text-[#18263A] mt-1 leading-relaxed">
                    Mid-term progress discussion with respective class teachers starting from 09:30 AM in Auditorium.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Term-End Exam Fee Collection</span>
                    <span className="text-[10px] text-amber-700">Due: Nov 25</span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Please clear all outstanding school tuition & examination fees before admit cards are printed.
                  </p>
                </div>
              </div>
            </div>

            {/* Assigned Homework Monitor */}
            <div className="bg-white rounded-2xl p-4 border border-[#E1E8F0] shadow-xs">
              <h3 className="text-xs font-bold text-[#123B70] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2563A6]" />
                <span>Child's Daily Homework & Tasks</span>
              </h3>
              <div className="space-y-2">
                {initialStudyPlans.flatMap((p) => p.periods).slice(0, 3).map((sub, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#F5F8FC] border border-slate-100 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#0B2345] block">{sub.subject}</span>
                      <span className="text-xs text-[#18263A]">{sub.homework}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">{sub.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: ACADEMICS */}
        {activeTab === 'academics' && (
          <div className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs space-y-4">
            <div className="border-b border-[#E1E8F0] pb-3">
              <span className="text-[10px] font-bold text-[#F2B544] uppercase tracking-wider block">Academic Evaluation</span>
              <h3 className="text-base font-bold text-[#0B2345]">{child.examName} ({child.session})</h3>
              <p className="text-xs text-[#66758A]">
                Class Position: <strong className="text-[#123B70]">#{child.positionInClass}</strong> • Aggregate Score: <strong>{child.obtainedTotal}/{child.totalMarks}</strong>
              </p>
            </div>

            <div className="space-y-2">
              {child.subjects.map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F8FC] border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-[#0B2345] block">{sub.name}</span>
                    <span className="text-[10px] text-[#66758A]">Full Marks: {sub.fullMarks}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#123B70] block">{sub.obtainedMarks}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {sub.grade} (GP {sub.gradePoint.toFixed(1)})
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-[#123B70] text-xs">
              <strong>Class Teacher Note:</strong> {child.teacherRemarks}
            </div>
          </div>
        )}

        {/* TAB 3: FEES */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs space-y-4">
            <div className="border-b border-[#E1E8F0] pb-3">
              <span className="text-[10px] font-bold text-[#F2B544] uppercase tracking-wider block">Billing & Receipts</span>
              <h3 className="text-base font-bold text-[#0B2345]">Fee Invoices & Statement</h3>
            </div>

            <div className="space-y-3">
              {childFees.map((fee) => (
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
                    <span>Payable: <strong>৳{fee.amount}</strong></span>
                    <span className="text-emerald-700">Paid: <strong>৳{fee.paidAmount}</strong></span>
                    <span className="text-red-700">Due: <strong>৳{fee.amount - fee.paidAmount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEACHER COMMUNICATION */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-2xl p-5 border border-[#E1E8F0] shadow-xs space-y-4">
            <div className="border-b border-[#E1E8F0] pb-3">
              <span className="text-[10px] font-bold text-[#F2B544] uppercase tracking-wider block">Direct Communication</span>
              <h3 className="text-base font-bold text-[#0B2345]">Contact School & Class Teacher</h3>
            </div>

            {inquirySent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your message has been delivered to the Class Teacher & Administration.</span>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#123B70] mb-1">
                    Send a Note / Leave Application to Teacher:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={parentMsg}
                    onChange={(e) => setParentMsg(e.target.value)}
                    placeholder="Write your query or note regarding your child's studies, health, or attendance..."
                    className="w-full bg-[#F5F8FC] border border-[#E1E8F0] focus:border-[#2563A6] focus:bg-white focus:outline-none rounded-xl p-3 text-xs text-[#18263A]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#123B70] hover:bg-[#2563A6] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Message to School</span>
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#66758A]">
              <span>Emergency Helpdesk:</span>
              <strong className="text-[#123B70] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> +880 1700-000000
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Mobile Navigation for Parents */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E1E8F0] px-4 py-2 flex items-center justify-around shadow-xl z-50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'overview' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('academics')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'academics' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
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
          onClick={() => setActiveTab('contact')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'contact' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px]">Teacher</span>
        </button>
      </div>
    </div>
  );
};
