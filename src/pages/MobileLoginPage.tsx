import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Info,
  KeyRound,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { authenticateUser, type UserRole } from '../lib/auth';

export const MobileLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('FLS-2026-0428');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [recoveryId, setRecoveryId] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'student') {
      setIdentifier('FLS-2026-0428');
      setPassword('123456');
    } else if (role === 'parent') {
      setIdentifier('01711-234567');
      setPassword('parent123');
    } else if (role === 'teacher') {
      setIdentifier('FLS-T-01');
      setPassword('teacher123');
    } else {
      setIdentifier('admin');
      setPassword('admin123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await authenticateUser(selectedRole, identifier, password);
      if (res.success && res.user) {
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'teacher') navigate('/teacher-dashboard');
        else if (res.user.role === 'parent') navigate('/parent-dashboard');
        else navigate('/student-dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryId.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setRecoveryId('');
    }, 3000);
  };

  return (
    <div className="min-h-screen app-login-gradient text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Branding Section */}
      <div className="text-center pt-6 pb-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#F2B544] to-amber-300 p-0.5 shadow-xl shadow-amber-500/20 mb-2.5 flex items-center justify-center">
          <div className="w-full h-full bg-[#0B2345] rounded-[14px] flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-[#F2B544]" />
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
          Future Leaders School
        </h1>
        <p className="text-[10px] sm:text-xs font-bold text-[#F2B544] tracking-widest uppercase mt-0.5">
          Campus Portal & Mobile App
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 text-[#18263A] shadow-2xl border border-white/20">
        <div className="text-center mb-4">
          <h2 className="text-base sm:text-lg font-black text-[#0B2345]">Select Login Role</h2>
          <p className="text-[11px] text-[#66758A]">Dedicated dashboard permissions for each role</p>
        </div>

        {/* 4 Role Selection Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F5F8FC] rounded-2xl mb-5 border border-[#E1E8F0]">
          <button
            type="button"
            onClick={() => handleRoleSelect('student')}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === 'student'
                ? 'bg-white shadow-sm text-[#123B70] font-bold border border-[#123B70]/30 scale-102'
                : 'text-[#66758A] hover:text-[#123B70]'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${selectedRole === 'student' ? 'text-[#123B70]' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-none">Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('parent')}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === 'parent'
                ? 'bg-white shadow-sm text-emerald-800 font-bold border border-emerald-500/30 scale-102'
                : 'text-[#66758A] hover:text-emerald-700'
            }`}
          >
            <HeartHandshake className={`w-4 h-4 ${selectedRole === 'parent' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-none">Parent</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('teacher')}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === 'teacher'
                ? 'bg-white shadow-sm text-[#2563A6] font-bold border border-[#2563A6]/30 scale-102'
                : 'text-[#66758A] hover:text-[#2563A6]'
            }`}
          >
            <Users className={`w-4 h-4 ${selectedRole === 'teacher' ? 'text-[#2563A6]' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-none">Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
              selectedRole === 'admin'
                ? 'bg-white shadow-sm text-[#0B2345] font-bold border border-amber-500/40 scale-102'
                : 'text-[#66758A] hover:text-[#0B2345]'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-[#F2B544]' : 'text-slate-400'}`} />
            <span className="text-[10px] leading-none">Admin</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#123B70] mb-1">
              {selectedRole === 'student' && 'Student ID or Roll No'}
              {selectedRole === 'parent' && 'Guardian Mobile No / Student ID'}
              {selectedRole === 'teacher' && 'Teacher ID or Email'}
              {selectedRole === 'admin' && 'Admin Account Identifier'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter ID"
                className="w-full bg-[#F5F8FC] border border-[#E1E8F0] focus:border-[#2563A6] focus:bg-white focus:outline-none rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#18263A] transition-colors"
              />
              <div className="absolute right-3.5 top-3 text-slate-400">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#123B70]">
                Password / PIN
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[10px] font-bold text-[#2563A6] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F8FC] border border-[#E1E8F0] focus:border-[#2563A6] focus:bg-white focus:outline-none rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#18263A] transition-colors"
              />
              <div className="absolute right-3.5 top-3 text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Hint */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/70 text-[#123B70] text-[10px] sm:text-[11px]">
            <Info className="w-3.5 h-3.5 text-[#2563A6] shrink-0 mt-0.5" />
            <p className="leading-tight">
              {selectedRole === 'student' && 'Demo: FLS-2026-0428 (Pass: 123456)'}
              {selectedRole === 'parent' && 'Demo: 01711-234567 (Pass: parent123)'}
              {selectedRole === 'teacher' && 'Demo: FLS-T-01 (Pass: teacher123)'}
              {selectedRole === 'admin' && 'Demo: admin (Pass: admin123)'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#123B70] to-[#2563A6] hover:from-[#0B2345] hover:to-[#123B70] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <span>
              {loading
                ? 'Authenticating...'
                : `Sign In as ${
                    selectedRole === 'student'
                      ? 'Student'
                      : selectedRole === 'parent'
                      ? 'Parent'
                      : selectedRole === 'teacher'
                      ? 'Teacher'
                      : 'Super Admin'
                  }`}
            </span>
            <ArrowRight className="w-4 h-4 text-[#F2B544]" />
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-[#18263A] shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B70] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#2563A6]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0B2345]">Account Recovery</h3>
                <p className="text-[11px] text-[#66758A]">Reset your portal password via SMS/Email</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Password reset link & temporary PIN sent to registered mobile!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#123B70] mb-1">
                    Student ID or Registered Mobile
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryId}
                    onChange={(e) => setRecoveryId(e.target.value)}
                    placeholder="e.g. FLS-2026-0428 or 017..."
                    className="w-full bg-[#F5F8FC] border border-[#E1E8F0] rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#2563A6]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-1/2 py-2 rounded-xl bg-slate-100 text-[#66758A] font-bold text-xs hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-xl bg-[#123B70] text-white font-bold text-xs hover:bg-[#2563A6]"
                  >
                    Send Reset PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Switcher */}
      <div className="text-center pt-4 pb-2 text-xs text-white/70">
        <p>© 2026 Future Leaders School • Official Portal</p>
        <button
          type="button"
          onClick={() => navigate('/home-web')}
          className="mt-1 text-[#F2B544] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1 text-[11px]"
        >
          <span>Open Full Public Website View</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
