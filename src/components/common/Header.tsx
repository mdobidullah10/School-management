import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Phone, Mail, Clock, Award, Calendar, ShieldAlert } from 'lucide-react';
import { Logo } from './Logo';
import { schoolInfo } from '../../data/schoolData';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect for shadow and blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Study Plan', path: '/study-plan' },
    { name: 'Results', path: '/results' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News & Events', path: '/news' },
    { name: 'Contact', path: '/contact' },
    { name: 'Portal', path: '/portal' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white transition-all duration-300">
      {/* Top Notification / Utility Bar */}
      <div className="bg-[#123B70] text-white text-xs py-2 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>{schoolInfo.phonePlaceholder}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>{schoolInfo.emailPlaceholder}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Sun – Thu: 8:00 AM – 4:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/results"
              className="text-slate-200 hover:text-[#FFB800] transition-colors flex items-center gap-1 font-medium"
            >
              <Award className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Result Checker</span>
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/study-plan"
              className="text-slate-200 hover:text-[#FFB800] transition-colors flex items-center gap-1 font-medium"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Daily Study Plan</span>
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/admin"
              className="bg-amber-400 hover:bg-amber-300 text-[#123B70] font-extrabold px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors shadow-xs"
            >
              <ShieldAlert className="w-3 h-3 text-[#123B70]" />
              <span>Super Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md shadow-slate-900/5 py-2' : 'border-b border-slate-100 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-[#123B70] font-semibold after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:bg-[#FFB800] after:rounded-full'
                      : 'text-slate-600 hover:text-[#123B70] hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Button & Admin Pill */}
          <div className="hidden xl:flex items-center gap-3">
            <Link
              to="/admissions"
              className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2167B2] text-white text-xs lg:text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </Link>
          </div>

          {/* Tablet & Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              to="/results"
              className="inline-flex items-center text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-full"
            >
              Results
            </Link>
            <Link
              to="/admissions"
              className="inline-flex items-center text-xs font-semibold bg-[#123B70] text-white px-3 py-1.5 rounded-full"
            >
              Apply
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#123B70] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#123B70]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F3F8FD] text-[#123B70] font-semibold border-l-4 border-[#FFB800]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/admin"
              className="px-3 py-2.5 rounded-lg text-base font-bold text-[#123B70] bg-amber-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Super Admin Panel</span>
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-extrabold uppercase">
                Staff Only
              </span>
            </Link>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/admissions"
              className="w-full flex items-center justify-center gap-2 bg-[#123B70] text-white py-3 rounded-lg font-semibold text-center hover:bg-[#2167B2] transition-colors"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </Link>
            <div className="text-xs text-slate-500 text-center space-y-1 mt-2">
              <p>Hotline: {schoolInfo.phonePlaceholder}</p>
              <p>{schoolInfo.emailPlaceholder}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
