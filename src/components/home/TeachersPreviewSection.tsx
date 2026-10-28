import React from 'react';
import { Link } from 'react-router-dom';
import { allFacultyAndStaff } from '../../data/schoolData';
import { GraduationCap, ArrowRight, Mail } from 'lucide-react';

export const TeachersPreviewSection: React.FC = () => {
  // Show 4 representative educators on homepage
  const previewMembers = allFacultyAndStaff.slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#E1E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-0.5 bg-[#F2B544] rounded-full" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#123B70]">
                FACULTY & LEADERSHIP
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B2345] tracking-tight">
              Experienced Teachers & Educators
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#66758A] max-w-xl">
              Our compassionate teachers combine academic rigor with supportive mentorship to inspire every learner.
            </p>
          </div>

          <Link
            to="/teachers"
            className="inline-flex items-center gap-2 bg-[#123B70] hover:bg-[#2563A6] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>View All Teachers & Staff</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2B544]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewMembers.map((staff) => (
            <div
              key={staff.id}
              className="bg-[#F5F8FC] rounded-2xl border border-[#E1E8F0] shadow-xs hover:shadow-md hover:border-[#123B70] transition-all duration-200 overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                <img
                  src={staff.image}
                  alt={staff.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#123B70] text-white">
                    {staff.experience || 'Faculty'}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#2563A6] tracking-wide block mb-1">
                    {staff.department}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#0B2345] group-hover:text-[#123B70] transition-colors leading-snug">
                    {staff.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#123B70] mt-0.5">
                    {staff.role}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs flex items-start gap-1.5 text-[#66758A]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#F2B544] shrink-0 mt-0.5" />
                    <span className="text-[11px] line-clamp-1">{staff.qualifications}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <Link
                    to="/teachers"
                    className="text-[11px] font-bold text-[#123B70] hover:text-[#2563A6] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Full Profile</span>
                    <ArrowRight className="w-3 h-3 text-[#F2B544]" />
                  </Link>

                  {staff.email && (
                    <a
                      href={`mailto:${staff.email}`}
                      className="p-1 rounded text-slate-400 hover:text-[#123B70] transition-colors"
                      title={`Email ${staff.name}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
