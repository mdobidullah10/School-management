import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allFacultyAndStaff } from '../data/schoolData';
import {
  Search,
  Mail,
  GraduationCap,
  Users,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'Leadership & Administration',
  'Mathematics',
  'Science & Technology',
  'Languages & Humanities',
  'Early Childhood & Primary',
  'Physical Education & Arts',
];

export const TeachersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const filteredStaff = useMemo(() => {
    return allFacultyAndStaff.filter((member) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q) ||
        (member.subjects && member.subjects.some((s) => s.toLowerCase().includes(q))) ||
        (member.qualifications && member.qualifications.toLowerCase().includes(q));

      const matchDept = selectedDept === 'All Departments' || member.department === selectedDept;

      return matchSearch && matchDept;
    });
  }, [searchQuery, selectedDept]);

  return (
    <div className="flex flex-col w-full bg-[#F5F8FC] min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2345] via-[#123B70] to-[#2563A6] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F2B544_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#F2B544] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link to="/about" className="hover:text-[#F2B544] transition-colors">About Us</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-[#F2B544] font-semibold">Faculty & Staff</span>
          </nav>

          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-[#F2B544] rounded-full" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#F2B544]">
              ACADEMIC LEADERSHIP & EDUCATORS
            </span>
            <span className="w-6 h-0.5 bg-[#F2B544] rounded-full" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Teachers & Academic Staff
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl">
            Meet our certified, caring, and forward-thinking educators dedicated to nurturing intellectual curiosity, ethical character, and student leadership.
          </p>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="bg-white border-b border-[#E1E8F0] py-6 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search teacher by name, subject, or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E1E8F0] text-xs sm:text-sm bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-[#123B70] focus:border-[#123B70] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-[#123B70] text-white shadow-xs'
                      : 'bg-slate-100 text-[#18263A] hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-[#66758A]">
            Showing <strong className="text-[#18263A]">{filteredStaff.length}</strong> educators
            {selectedDept !== 'All Departments' && <span> in <strong>{selectedDept}</strong></span>}
          </p>

          <span className="text-xs text-[#2563A6] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
            Verified Faculty Members
          </span>
        </div>

        {filteredStaff.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-2xl border border-[#E1E8F0] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Photo container with fixed aspect ratio */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={staff.image}
                    alt={staff.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#123B70]/90 text-white backdrop-blur-xs">
                      {staff.experience || 'Faculty'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#2563A6] tracking-wider mb-1 block">
                    {staff.department}
                  </span>
                  
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#18263A] group-hover:text-[#123B70] transition-colors leading-snug">
                    {staff.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#123B70] mt-0.5">
                    {staff.role}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#E1E8F0] text-xs space-y-2 flex-1">
                    <div className="flex items-start gap-1.5 text-[#66758A]">
                      <GraduationCap className="w-3.5 h-3.5 text-[#F2B544] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight line-clamp-2">{staff.qualifications}</span>
                    </div>

                    <p className="text-[11px] text-[#66758A] line-clamp-2 leading-relaxed">
                      {staff.bio}
                    </p>

                    {staff.subjects && staff.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {staff.subjects.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {staff.email && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={`mailto:${staff.email}`}
                        className="text-[11px] font-semibold text-[#123B70] hover:text-[#2563A6] inline-flex items-center gap-1 transition-colors"
                      >
                        <Mail className="w-3 h-3 text-[#F2B544]" />
                        <span>Email Teacher</span>
                      </a>
                      <span className="text-[10px] text-slate-400">FLS Certified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E1E8F0] p-8 max-w-lg mx-auto">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#18263A]">No Faculty Members Found</h3>
            <p className="text-xs text-[#66758A] mt-1 mb-4">
              We couldn't find any educators matching "{searchQuery}". Try searching by department or clearing your filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All Departments');
              }}
              className="px-4 py-2 rounded-xl bg-[#123B70] text-white text-xs font-bold hover:bg-[#2563A6] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-white border-t border-[#E1E8F0] py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#F5F8FC] border border-[#E1E8F0] px-3 py-1 rounded-full text-xs font-semibold text-[#123B70] mb-3">
            <Award className="w-3.5 h-3.5 text-[#F2B544]" />
            <span>Academic Excellence & Mentorship</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18263A]">
            Interested in Joining Our Academic Faculty?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#66758A] max-w-xl mx-auto">
            Future Leaders School welcomes passionate, innovative educators. Review our curriculum standards or contact our administration.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="bg-[#123B70] hover:bg-[#2563A6] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
            >
              Contact Administration
            </Link>
            <Link
              to="/academics"
              className="bg-slate-100 hover:bg-slate-200 text-[#18263A] text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Explore Academic Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
