import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { schoolInfo } from '../../data/schoolData';
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubError('Please enter a valid email address.');
      return;
    }
    setSubError('');
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#0B2244] text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: School Identity & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm pt-2">
              Future Leaders School is dedicated to nurturing academic excellence, inspiring creativity, and shaping ethical, confident global leaders in Bangladesh.
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#FFB800] block mb-2">
                Connect With Our Community
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={schoolInfo.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#123B70] flex items-center justify-center text-slate-300 transition-all"
                  aria-label="Facebook placeholder"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={schoolInfo.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#123B70] flex items-center justify-center text-slate-300 transition-all"
                  aria-label="Twitter placeholder"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a
                  href={schoolInfo.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#123B70] flex items-center justify-center text-slate-300 transition-all"
                  aria-label="Instagram placeholder"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={schoolInfo.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FFB800] hover:text-[#123B70] flex items-center justify-center text-slate-300 transition-all"
                  aria-label="YouTube placeholder"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Admissions 2026–27
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Campus Gallery
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> News & Events
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Contact & Directions
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#FFB800] hover:underline font-bold transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Super Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Student & Parent Portal
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5 font-semibold text-[#FFB800]">
                  <span className="text-[#FFB800] text-xs">›</span> Online Result Checker
                </Link>
              </li>
              <li>
                <Link to="/study-plan" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5 font-semibold text-[#FFB800]">
                  <span className="text-[#FFB800] text-xs">›</span> Daily Study Plan
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                  <span className="text-[#FFB800] text-xs">›</span> Super Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Programs */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide border-b border-white/10 pb-2">
              Academic Wings
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/academics" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Playgroup & KG (Early Years)
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Primary School (Grades 1–5)
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Middle School (Grades 6–8)
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Secondary School (Grades 9–12)
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> STEAM & Innovation Labs
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-[#FFB800] transition-colors flex items-center gap-1.5">
                  <span className="text-[#FFB800] text-xs">›</span> Co-Curricular & Athletics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide border-b border-white/10 pb-2">
              Contact & Inquiries
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                <span>{schoolInfo.addressPlaceholder}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{schoolInfo.phonePlaceholder}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFB800] shrink-0" />
                <span>{schoolInfo.emailPlaceholder}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                <span>{schoolInfo.officeHoursPlaceholder}</span>
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-medium text-slate-200 mb-2">
                Subscribe to our School Bulletin:
              </p>
              {subscribed ? (
                <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subscribed! Demo confirmation received.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-1.5">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="bg-white/10 border border-white/20 rounded-l-md px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FFB800] w-full"
                    />
                    <button
                      type="submit"
                      className="bg-[#FFB800] text-[#123B70] px-3 py-1.5 rounded-r-md text-xs font-bold hover:bg-yellow-400 transition-colors flex items-center cursor-pointer"
                      aria-label="Submit newsletter subscription"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {subError && <p className="text-[11px] text-rose-300">{subError}</p>}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-300 font-medium">Learn • Grow • Lead</span>
            <span>•</span>
            <span className="text-slate-400">Bangladesh</span>
            <span>•</span>
            <span className="text-slate-400">Sample Preview & Placeholder Data</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
