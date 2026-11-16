import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  HeartHandshake,
  BookOpen,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  X,
  PhoneCall,
  FileText,
} from 'lucide-react';
import { authenticateUser, type UserRole } from '../lib/auth';

interface RoleDetail {
  title: string;
  label: string;
  placeholder: string;
  passLabel: string;
  passPlaceholder: string;
  buttonText: string;
  icon: React.ComponentType<{ className?: string }>;
  recoveryPrompt: string;
}

const ROLE_MAP: Record<UserRole, RoleDetail> = {
  student: {
    title: 'Student',
    label: 'Student ID / Roll No',
    placeholder: 'Enter your ID',
    passLabel: 'Password / PIN',
    passPlaceholder: 'Enter password',
    buttonText: 'SIGN IN AS STUDENT →',
    icon: GraduationCap,
    recoveryPrompt: 'Enter your Student ID to receive a verification PIN on the registered guardian mobile.',
  },
  parent: {
    title: 'Parent',
    label: 'Parent ID / Mobile Number',
    placeholder: 'Enter your ID or mobile number',
    passLabel: 'Password / PIN',
    passPlaceholder: 'Enter password',
    buttonText: 'SIGN IN AS PARENT →',
    icon: HeartHandshake,
    recoveryPrompt: 'Enter your registered guardian mobile number to receive an account reset PIN via SMS.',
  },
  teacher: {
    title: 'Teacher',
    label: 'Employee ID',
    placeholder: 'Enter employee ID',
    passLabel: 'Password',
    passPlaceholder: 'Enter password',
    buttonText: 'SIGN IN AS TEACHER →',
    icon: BookOpen,
    recoveryPrompt: 'Enter your Employee ID or institutional email to reset your faculty credentials.',
  },
  admin: {
    title: 'Admin',
    label: 'Admin ID',
    placeholder: 'Enter admin ID',
    passLabel: 'Password',
    passPlaceholder: 'Enter password',
    buttonText: 'SIGN IN AS ADMIN →',
    icon: ShieldCheck,
    recoveryPrompt: 'Administrative credential resets require manual authorization from Executive Administration.',
  },
};

export const MobileLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modals state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const activeRoleConfig = ROLE_MAP[selectedRole];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setIdentifier('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      if (selectedRole === 'student') setErrorMessage('Please enter your Student ID.');
      else if (selectedRole === 'parent') setErrorMessage('Please enter your Parent ID or Mobile Number.');
      else if (selectedRole === 'teacher') setErrorMessage('Please enter your Employee ID.');
      else setErrorMessage('Please enter your Admin ID.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await authenticateUser(selectedRole, cleanId, cleanPass);
      if (res.success && res.user) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else if (res.user.role === 'parent') {
          navigate('/parent-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        setErrorMessage(res.message || 'Invalid ID or password. Please try again.');
      }
    } catch {
      setErrorMessage('Invalid ID or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotInput('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#07182E] text-white flex flex-col justify-between relative overflow-y-auto selection:bg-[#F2B544] selection:text-[#0B2345]">
      {/* Subtle Academic Background Motif */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 z-0" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="academic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="30" cy="30" r="1.5" fill="#FFFFFF" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#academic-grid)" />
          {/* Subtle watermark shapes */}
          <g fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 6" className="opacity-40">
            <polygon points="120,80 200,40 280,80 200,120" />
            <path d="M 160 100 L 160 140 C 160 155 240 155 240 140 L 240 100" />
            <path d="M 600 300 C 650 280 750 280 800 300 L 800 450 C 750 430 650 430 600 450 Z" />
          </g>
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {/* Top Branding Section */}
        <header className="text-center mb-6 sm:mb-8">
          {/* Official School Logo Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-white p-2.5 shadow-2xl shadow-black/40 flex items-center justify-center border border-white/20 mb-3.5 transition-transform duration-300 hover:scale-105">
            <img
              src="/images/school-logo.jpg"
              alt="Future Leaders School Crest"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if image path differs
                (e.currentTarget as HTMLImageElement).src = '/images/logo.jpg';
              }}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif leading-tight">
            Future Leaders School
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-[#F2B544] tracking-[0.22em] uppercase mt-1">
            CAMPUS PORTAL &amp; MOBILE APP
          </p>
        </header>

        {/* Primary Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-[#18263A] shadow-2xl shadow-black/30 border border-white/40 backdrop-blur-sm transition-all duration-300">
          {/* Login Card Header */}
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2345] tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#66758A] mt-1">
              Choose your account type
            </p>
          </div>

          {/* 4 Role Selector Tabs */}
          <div
            role="tablist"
            aria-label="Account Type Selection"
            className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1 bg-[#F5F8FC] rounded-2xl border border-[#E1E8F0] mb-6"
          >
            {(Object.keys(ROLE_MAP) as UserRole[]).map((roleKey) => {
              const role = ROLE_MAP[roleKey];
              const Icon = role.icon;
              const isSelected = selectedRole === roleKey;

              return (
                <button
                  key={roleKey}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleRoleChange(roleKey)}
                  className={`py-2.5 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#123B70] ${
                    isSelected
                      ? 'bg-[#123B70] text-white shadow-md font-bold'
                      : 'bg-transparent text-[#66758A] hover:text-[#123B70] hover:bg-slate-100/70 font-semibold'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected ? 'scale-110 text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-[10px] sm:text-[11px] leading-none tracking-tight">
                    {role.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Login Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            {/* Role Specific Identifier Field */}
            <div>
              <label
                htmlFor="user-identifier"
                className="block text-xs font-bold uppercase tracking-wider text-[#123B70] mb-1.5"
              >
                {activeRoleConfig.label}
              </label>
              <div className="relative">
                <input
                  id="user-identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={activeRoleConfig.placeholder}
                  className="w-full min-h-[48px] bg-[#F5F8FC] border border-[#E1E8F0] focus:border-[#123B70] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123B70]/15 rounded-xl px-4 pr-11 text-sm font-semibold text-[#18263A] transition-all placeholder:text-slate-400"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="user-password"
                  className="block text-xs font-bold uppercase tracking-wider text-[#123B70]"
                >
                  {activeRoleConfig.passLabel}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotInput(identifier);
                  }}
                  className="text-xs font-bold text-[#2563A6] hover:text-[#123B70] hover:underline cursor-pointer transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={activeRoleConfig.passPlaceholder}
                  className="w-full min-h-[48px] bg-[#F5F8FC] border border-[#E1E8F0] focus:border-[#123B70] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123B70]/15 rounded-xl px-4 pr-11 text-sm font-semibold text-[#18263A] transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#123B70] transition-colors cursor-pointer rounded-lg focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Form Validation / Error Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#123B70] hover:bg-[#0B2345] active:scale-[0.99] text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-950/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed uppercase"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F2B544]" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>{activeRoleConfig.buttonText}</span>
                </>
              )}
            </button>
          </form>

          {/* Secondary Action: Visit School Website */}
          <div className="pt-5 mt-5 border-t border-[#E1E8F0] text-center">
            <Link
              to="/home-web"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123B70] hover:text-[#2563A6] transition-colors group cursor-pointer"
            >
              <span>Visit School Website</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F2B544] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <footer className="relative z-10 w-full text-center py-4 px-4 text-xs text-slate-300">
        <p className="font-medium tracking-wide">
          © 2026 Future Leaders School • Official Portal
        </p>
        <div className="flex items-center justify-center gap-4 mt-1.5 text-[11px] text-slate-400">
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="hover:text-[#F2B544] hover:underline transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="hover:text-[#F2B544] hover:underline transition-colors cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3 text-[#F2B544]" />
            <span>Help &amp; Support</span>
          </button>
        </div>
      </footer>

      {/* MODAL 1: Forgot Password Recovery */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full text-[#18263A] shadow-2xl relative border border-white/20">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSuccess(false);
              }}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#123B70] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#2563A6]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-[#0B2345]">Password Recovery</h3>
                <p className="text-[11px] font-semibold text-[#66758A]">
                  {activeRoleConfig.title} Portal Access
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {activeRoleConfig.recoveryPrompt}
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Verification request initiated. Please check your registered SMS/Email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#123B70] uppercase mb-1">
                    {activeRoleConfig.label}
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder={activeRoleConfig.placeholder}
                    className="w-full bg-[#F5F8FC] border border-[#E1E8F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#123B70]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-[#66758A] font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#123B70] text-white font-bold text-xs hover:bg-[#0B2345] transition-colors"
                  >
                    Send Recovery PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Privacy Policy */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full text-[#18263A] shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <FileText className="w-5 h-5 text-[#123B70]" />
              <h3 className="font-black text-base text-[#0B2345]">Data Privacy &amp; Security</h3>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Future Leaders School respects your privacy. All student academic records, exam results,
                attendance, and parental contact details are encrypted and stored in secure cloud
                infrastructure.
              </p>
              <p>
                Access to student dashboards is strictly role-gated. Parents can only access their enrolled
                children&apos;s information. Authentication tokens expire automatically to prevent unauthorized access.
              </p>
              <p className="font-semibold text-slate-800">
                For student record privacy inquiries, contact the Registrar Office at registrar@futureleadersschool.edu.bd.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#123B70] text-white font-bold text-xs hover:bg-[#0B2345] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Help & Support */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full text-[#18263A] shadow-2xl relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 mb-3">
              <PhoneCall className="w-5 h-5 text-[#123B70]" />
              <h3 className="font-black text-base text-[#0B2345]">Campus IT Helpdesk</h3>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600">
              <p>Need assistance signing in to your campus portal?</p>
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] space-y-1">
                <p>
                  <strong>Hotline:</strong> +880 1711-234567
                </p>
                <p>
                  <strong>Helpdesk Email:</strong> support@futureleadersschool.edu.bd
                </p>
                <p>
                  <strong>Hours:</strong> Sun – Thu: 8:00 AM – 4:00 PM
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Students may also obtain assistance from the School Information &amp; IT Desk on campus.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#123B70] text-white font-bold text-xs hover:bg-[#0B2345] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
