import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Award,
  Calendar,
  ShieldCheck,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { Logo } from './Logo';
import { schoolInfo } from '../../data/schoolData';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicsDropdown, setAcademicsDropdown] = useState(false);
  const [mobileAcademicsOpen, setMobileAcademicsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAcademicsDropdown(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAcademicsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAcademicsActive =
    location.pathname === '/academics' ||
    location.pathname === '/study-plan' ||
    location.pathname === '/results';

  return (
    <header className="sticky top-0 z-40 w-full bg-white transition-all duration-200">
      {/* Top Utility Information Bar */}
      <div className="bg-[#123B70] text-white text-xs py-2 px-4 border-b border-white/10 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Phone className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>{schoolInfo.phonePlaceholder}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Mail className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>{schoolInfo.emailPlaceholder}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Sun – Thu: 8:00 AM – 4:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              to="/results"
              className="text-slate-200 hover:text-[#F2B544] transition-colors flex items-center gap-1 font-medium"
            >
              <Award className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Result Checker</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link
              to="/study-plan"
              className="text-slate-200 hover:text-[#F2B544] transition-colors flex items-center gap-1 font-medium"
            >
              <Calendar className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Daily Study Plan</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link
              to="/dashboard"
              className="bg-[#F2B544] hover:bg-[#E5A736] text-[#123B70] font-extrabold px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#123B70]" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full bg-white transition-all duration-200 ${
          scrolled ? 'shadow-md py-2 border-b border-[#E1E8F0]' : 'border-b border-[#E1E8F0] py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo on Left */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`
              }
            >
              About Us
            </NavLink>

            {/* Academics Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAcademicsDropdown(!academicsDropdown)}
                className={`px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  isAcademicsActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`}
                aria-expanded={academicsDropdown}
              >
                <span>Academics</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${academicsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {academicsDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E1E8F0] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    to="/academics"
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#F5F8FC] transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-[#123B70] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-[#18263A] block">Curriculum & Programs</span>
                      <span className="text-[11px] text-[#66758A]">Playgroup to Secondary tracks</span>
                    </div>
                  </Link>

                  <Link
                    to="/study-plan"
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#F5F8FC] transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#2563A6] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-[#18263A] block">Daily Study Plan</span>
                      <span className="text-[11px] text-[#66758A]">Class schedule & homework tracker</span>
                    </div>
                  </Link>

                  <Link
                    to="/results"
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#F5F8FC] transition-colors"
                  >
                    <Award className="w-4 h-4 text-[#F2B544] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-[#18263A] block">Result Portal & Transcripts</span>
                      <span className="text-[11px] text-[#66758A]">Online report cards & GPA lookup</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <NavLink
              to="/teachers"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`
              }
            >
              Teachers & Staff
            </NavLink>

            <NavLink
              to="/admissions"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`
              }
            >
              Admissions
            </NavLink>

            <NavLink
              to="/news"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`
              }
            >
              Notices
            </NavLink>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`
              }
            >
              Gallery
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#123B70] bg-[#F5F8FC] border-b-2 border-[#123B70]'
                    : 'text-[#18263A] hover:text-[#123B70] hover:bg-slate-50'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Action CTAs on Right */}
          <div className="hidden xl:flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 bg-[#F2B544] hover:bg-[#E5A736] text-[#123B70] text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#123B70]" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admissions"
              className="inline-flex items-center gap-1.5 bg-[#123B70] hover:bg-[#2563A6] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F2B544]" />
            </Link>
          </div>

          {/* Mobile Right Action + Hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-[11px] font-bold bg-[#F2B544] text-[#123B70] px-2.5 py-1 rounded-lg shadow-xs"
            >
              Dashboard
            </Link>
            <Link
              to="/admissions"
              className="inline-flex items-center text-xs font-semibold bg-[#123B70] text-white px-3 py-1.5 rounded-lg"
            >
              Apply
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#18263A] hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#123B70]" /> : <Menu className="w-6 h-6 text-[#123B70]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#E1E8F0] bg-white px-4 pt-3 pb-6 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1 text-sm font-semibold">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl ${isActive ? 'bg-[#F5F8FC] text-[#123B70] font-bold border-l-4 border-[#123B70]' : 'text-[#18263A]'}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl ${isActive ? 'bg-[#F5F8FC] text-[#123B70] font-bold border-l-4 border-[#123B70]' : 'text-[#18263A]'}`
              }
            >
              About Us
            </NavLink>

            {/* Mobile Academics Submenu */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAcademicsOpen(!mobileAcademicsOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[#18263A]"
              >
                <span>Academics</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAcademicsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileAcademicsOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-xl my-1 text-xs">
                  <Link to="/academics" className="block py-2 px-3 text-[#18263A] hover:text-[#123B70] font-medium">
                    • Curriculum & Programs
                  </Link>
                  <Link to="/study-plan" className="block py-2 px-3 text-[#18263A] hover:text-[#123B70] font-medium">
                    • Daily Study Plan & Homework
                  </Link>
                  <Link to="/results" className="block py-2 px-3 text-[#18263A] hover:text-[#123B70] font-medium">
                    • Online Result Portal & Transcripts
                  </Link>
                </div>
              )}
            </div>

            <NavLink
              to="/teachers"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl ${isActive ? 'bg-[#F5F8FC] text-[#123B70] font-bold border-l-4 border-[#123B70]' : 'text-[#18263A]'}`
              }
            >
              Teachers & Staff
            </NavLink>

            <NavLink
              to="/admissions"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl ${isActive ? 'bg-[#F5F8FC] text-[#123B70] font-bold border-l-4 border-[#123B70]' : 'text-[#18263A]'}`
              }
            >
              Admissions
            </NavLink>

            <NavLink
              to="/news"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl ${isActive ? 'bg-[#F5F8FC] text-[#123B70] font-bold border-l-4 border-[#123B70]' : 'text-[#18263A]'}`
              }
            >
              Notices & Circulars
            </NavLink>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl ${isActive ? 'bg-[#F5F8FC] text-[#123B70] font-bold border-l-4 border-[#123B70]' : 'text-[#18263A]'}`
              }
            >
              Gallery & Campus Tour
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl ${isActive ? 'bg-[#F5F8FC] text-[#123B70] font-bold border-l-4 border-[#123B70]' : 'text-[#18263A]'}`
              }
            >
              Contact Us
            </NavLink>

            <Link
              to="/dashboard"
              className="px-3.5 py-2.5 rounded-xl font-bold bg-[#F2B544]/20 text-[#123B70] flex items-center justify-between border border-[#F2B544]/50 mt-2"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#123B70]" />
                <span>Super Admin Dashboard</span>
              </span>
              <span className="text-[10px] bg-[#123B70] text-white px-2 py-0.5 rounded font-bold">
                Admin
              </span>
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/admissions"
              className="w-full flex items-center justify-center gap-2 bg-[#123B70] text-white py-2.5 rounded-xl font-bold text-center text-xs"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4 text-[#F2B544]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
