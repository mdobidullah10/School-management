import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  LogOut,
  Award,
  Save,
  BookOpen,
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../lib/auth';
import { initialAttendanceList, initialResults, initialStudyPlans } from '../data/schoolData';
import type { AttendanceRecord } from '../types';

export const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const authUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks' | 'plans'>('attendance');

  // Attendance state
  const [selectedGrade, setSelectedGrade] = useState('Grade 7');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendanceList);
  const [savedNotice, setSavedNotice] = useState(false);

  // Marks entry state
  const [marksList, setMarksList] = useState(initialResults);
  const [selectedSubject] = useState('Mathematics & Geometry');

  const filteredAttendance = attendance.filter((a) => a.grade === selectedGrade);

  const toggleStatus = (id: string, status: 'Present' | 'Late' | 'Absent') => {
    setAttendance((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleMarksChange = (studentId: string, val: number) => {
    setMarksList((prev) =>
      prev.map((st) => {
        if (st.studentId === studentId) {
          const updatedSubs = st.subjects.map((sub) => {
            if (sub.name.toLowerCase().includes('math') || sub.name === selectedSubject) {
              const obtained = Math.min(100, Math.max(0, val));
              const gp = obtained >= 80 ? 5.0 : obtained >= 70 ? 4.0 : obtained >= 60 ? 3.5 : obtained >= 50 ? 3.0 : obtained >= 40 ? 2.0 : 0.0;
              const letter = obtained >= 80 ? 'A+' : obtained >= 70 ? 'A' : obtained >= 60 ? 'A-' : obtained >= 50 ? 'B' : obtained >= 40 ? 'C' : 'F';
              return { ...sub, obtainedMarks: obtained, gradePoint: gp, grade: letter };
            }
            return sub;
          });
          return { ...st, subjects: updatedSubs };
        }
        return st;
      })
    );
  };

  const handleSaveMarks = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24 text-[#18263A]">
      {/* Top Mobile Teacher Header */}
      <div className="app-header-gradient text-white p-5 pt-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F2B544] flex items-center justify-center text-[#123B70] font-black">
              FLS
            </div>
            <div>
              <span className="text-[10px] text-[#F2B544] font-extrabold uppercase tracking-wider block">Faculty App</span>
              <h2 className="text-sm font-black leading-tight text-white">Teacher Console</h2>
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

        {/* Teacher Overview Card */}
        <div className="flex items-center gap-3.5 app-header-glass p-4 rounded-2xl">
          <img
            src={authUser?.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
            alt="Teacher"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F2B544] shadow-md shrink-0"
          />
          <div>
            <h1 className="text-base font-black text-white leading-tight">{authUser?.name || 'Dr. Farhana Ahmed'}</h1>
            <p className="text-xs text-[#F2B544] font-bold mt-0.5">{authUser?.designation || 'Senior Faculty & Dept Head'}</p>
            <span className="text-[11px] text-slate-200 mt-1 block">Department: <strong className="text-white">{authUser?.department || 'Mathematics & Sciences'}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 max-w-lg mx-auto space-y-4">
        {savedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Success: Records successfully synced with School Server!</span>
          </div>
        )}

        {/* TAB 1: ATTENDANCE REGISTER */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            {/* Grade Selector */}
            <div className="bg-white p-3 rounded-2xl border border-[#E1E8F0] shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-[#123B70] uppercase">Select Class:</span>
              <div className="flex gap-1.5">
                {['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map((gr) => (
                  <button
                    key={gr}
                    onClick={() => setSelectedGrade(gr)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      selectedGrade === gr
                        ? 'bg-[#123B70] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {gr.replace('Grade ', 'G-')}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendance Student List */}
            <div className="bg-white rounded-2xl p-4 border border-[#E1E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-[#0B2345] uppercase tracking-wide">
                    Daily Register • {selectedGrade}
                  </h3>
                  <span className="text-[10px] text-[#66758A]">{filteredAttendance.length} Students in class</span>
                </div>
                <button
                  onClick={handleSaveMarks}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

              <div className="space-y-2">
                {filteredAttendance.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl bg-[#F5F8FC] border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0B2345] block">{rec.studentName}</span>
                      <span className="text-[10px] text-[#66758A]">Roll #{rec.rollNumber} • {rec.studentId}</span>
                    </div>

                    {/* Quick Toggle Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStatus(rec.id, 'Present')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                          rec.status === 'Present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        P
                      </button>
                      <button
                        onClick={() => toggleStatus(rec.id, 'Late')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                          rec.status === 'Late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        L
                      </button>
                      <button
                        onClick={() => toggleStatus(rec.id, 'Absent')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                          rec.status === 'Absent'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        A
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MARKS ENTRY */}
        {activeTab === 'marks' && (
          <div className="bg-white rounded-2xl p-4 border border-[#E1E8F0] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-bold text-[#0B2345] uppercase tracking-wide">
                  Exam Marks Entry
                </h3>
                <span className="text-[10px] text-[#2563A6] font-semibold">{selectedSubject}</span>
              </div>
              <button
                onClick={handleSaveMarks}
                className="px-3 py-1.5 rounded-xl bg-[#123B70] hover:bg-[#2563A6] text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>
            </div>

            <div className="space-y-2">
              {marksList.slice(0, 6).map((st) => {
                const sub = st.subjects.find((s) => s.name.toLowerCase().includes('math') || s.name === selectedSubject) || st.subjects[0];
                return (
                  <div key={st.id} className="p-3 rounded-xl bg-[#F5F8FC] border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#0B2345] block">{st.studentName}</span>
                      <span className="text-[10px] text-[#66758A]">Class {st.grade} • Roll #{st.rollNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={sub?.obtainedMarks || 85}
                        onChange={(e) => handleMarksChange(st.studentId, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-sm font-bold text-center text-[#123B70] focus:outline-none focus:border-[#2563A6]"
                      />
                      <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: LESSON PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-[#E1E8F0] shadow-xs">
              <h3 className="text-xs font-bold text-[#0B2345] uppercase tracking-wide mb-2">
                Published Daily Homework Roster
              </h3>
              <div className="space-y-2.5">
                {initialStudyPlans.flatMap((pl) => pl.periods).map((period, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#F5F8FC] border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#123B70]">{period.subject}</span>
                      <span className="text-[10px] font-semibold text-[#66758A]">{period.time}</span>
                    </div>
                    <p className="text-xs text-[#18263A] font-medium">{period.topic}</p>
                    <div className="text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60">
                      <strong>Assigned:</strong> {period.homework}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Bottom Mobile Navigation Bar for Teachers */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E1E8F0] px-4 py-2 flex items-center justify-around shadow-xl z-50">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'attendance' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'marks' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px]">Marks Entry</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl cursor-pointer transition-colors ${
            activeTab === 'plans' ? 'text-[#123B70] font-bold' : 'text-[#66758A] hover:text-[#123B70]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">Homework</span>
        </button>
      </div>
    </div>
  );
};
