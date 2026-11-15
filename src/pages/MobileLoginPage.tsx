import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  Info,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { setCurrentUser, type UserRole } from '../lib/auth';
import { initialResults, allFacultyAndStaff } from '../data/schoolData';

export const MobileLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('FLS-2026-0428');
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'student') {
      setIdentifier('FLS-2026-0428');
      setPassword('123456');
    } else if (role === 'teacher') {
      setIdentifier('FLS-T-01');
      setPassword('teacher123');
    } else {
      setIdentifier('admin');
      setPassword('admin123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'admin') {
      if (password === 'admin123' || password === 'admin') {
        setCurrentUser({
          id: 'admin-1',
          name: 'Super Admin',
          role: 'admin',
          identifier: 'admin',
          designation: 'Principal & Executive Administrator',
        });
        navigate('/admin');
        return;
      } else {
        setErrorMsg('Invalid Admin credentials. Try default: admin123');
        return;
      }
    }

    if (selectedRole === 'teacher') {
      const matched = allFacultyAndStaff.find(
        (t) =>
          (t.email && t.email.toLowerCase() === identifier.toLowerCase()) ||
          identifier.toUpperCase() === 'FLS-T-01' ||
          t.name.toLowerCase().includes(identifier.toLowerCase())
      ) || allFacultyAndStaff[0];

      setCurrentUser({
        id: String(matched.id),
        name: matched.name,
        role: 'teacher',
        identifier: identifier,
        department: matched.department,
        designation: matched.designation,
        photo: matched.image,
      });
      navigate('/teacher-dashboard');
      return;
    }

    if (selectedRole === 'student') {
      const matched = initialResults.find(
        (s) =>
          s.studentId.toLowerCase() === identifier.toLowerCase() ||
          s.rollNumber.toLowerCase() === identifier.toLowerCase()
      ) || initialResults[0];

      setCurrentUser({
        id: matched.id,
        name: matched.studentName,
        role: 'student',
        identifier: matched.studentId,
        grade: matched.grade,
        section: matched.section,
        photo: matched.studentPhoto,
        phone: matched.contactNumber,
      });
      navigate('/student-dashboard');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B2345] via-[#123B70] to-[#0A192F] text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Branding Section */}
      <div className="text-center pt-8 pb-4">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#F2B544] to-amber-300 p-0.5 shadow-xl shadow-amber-500/20 mb-3 flex items-center justify-center">
          <div className="w-full h-full bg-[#0B2345] rounded-[22px] flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-[#F2B544]" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white font-serif">
          Future Leaders School
        </h1>
        <p className="text-xs font-semibold text-[#F2B544] tracking-widest uppercase mt-0.5">
          Campus Mobile Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-[#18263A] shadow-2xl border border-white/20">
        <div className="text-center mb-5">
          <h2 className="text-lg font-bold text-[#0B2345]">Select Your Portal Role</h2>
          <p className="text-xs text-[#66758A]">Please choose your profile to continue</p>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F5F8FC] rounded-2xl mb-6 border border-[#E1E8F0]">
          <button
            type="button"
            onClick={() => handleRoleSelect('student')}
            className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
              selectedRole === 'student'
                ? 'bg-white shadow-sm text-[#123B70] font-bold border border-[#123B70]/20'
                : 'text-[#66758A] hover:text-[#123B70]'
            }`}
          >
            <GraduationCap className={`w-5 h-5 ${selectedRole === 'student' ? 'text-[#123B70]' : 'text-slate-400'}`} />
            <span className="text-[11px] leading-none">Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('teacher')}
            className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
              selectedRole === 'teacher'
                ? 'bg-white shadow-sm text-[#2563A6] font-bold border border-[#2563A6]/20'
                : 'text-[#66758A] hover:text-[#2563A6]'
            }`}
          >
            <Users className={`w-5 h-5 ${selectedRole === 'teacher' ? 'text-[#2563A6]' : 'text-slate-400'}`} />
            <span className="text-[11px] leading-none">Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-white shadow-sm text-[#0B2345] font-bold border border-amber-400/40'
                : 'text-[#66758A] hover:text-[#0B2345]'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${selectedRole === 'admin' ? 'text-[#F2B544]' : 'text-slate-400'}`} />
            <span className="text-[11px] leading-none">Admin</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#123B70] mb-1">
              {selectedRole === 'student' && 'Student ID / Roll No'}
              {selectedRole === 'teacher' && 'Teacher ID / Email'}
              {selectedRole === 'admin' && 'Admin Username'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter ID"
                className="w-full bg-[#F5F8FC] border border-[#E1E8F0] focus:border-[#2563A6] focus:bg-white focus:outline-none rounded-xl px-4 py-3 text-sm font-medium text-[#18263A] transition-colors"
              />
              <div className="absolute right-3.5 top-3.5 text-slate-400">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#123B70] mb-1">
              Secret Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F8FC] border border-[#E1E8F0] focus:border-[#2563A6] focus:bg-white focus:outline-none rounded-xl px-4 py-3 text-sm font-medium text-[#18263A] transition-colors"
              />
              <div className="absolute right-3.5 top-3.5 text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Hint */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/70 text-[#123B70] text-[11px]">
            <Info className="w-4 h-4 text-[#2563A6] shrink-0 mt-0.5" />
            <p className="leading-tight">
              {selectedRole === 'student' && 'Demo Student: FLS-2026-0428 (Pass: 123456)'}
              {selectedRole === 'teacher' && 'Demo Teacher: FLS-T-01 (Pass: teacher123)'}
              {selectedRole === 'admin' && 'Super Admin: admin (Pass: admin123)'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#123B70] to-[#2563A6] hover:from-[#0B2345] hover:to-[#123B70] text-white font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Log In to {selectedRole === 'student' ? 'Student' : selectedRole === 'teacher' ? 'Teacher' : 'Super Admin'} App</span>
            <ArrowRight className="w-4 h-4 text-[#F2B544]" />
          </button>
        </form>
      </div>

      {/* Bottom Footer Details */}
      <div className="text-center pt-6 pb-2 text-xs text-white/60">
        <p>© 2026 Future Leaders School • Official App</p>
        <button
          type="button"
          onClick={() => navigate('/home-web')}
          className="mt-1 text-[#F2B544] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
        >
          <span>Open Full Public Website View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
