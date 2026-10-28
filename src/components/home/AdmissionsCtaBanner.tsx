import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, Phone } from 'lucide-react';

export const AdmissionsCtaBanner: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#0B2345] via-[#123B70] to-[#2563A6] p-8 sm:p-12 border border-[#E1E8F0] shadow-md text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6 max-w-3xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-8 h-8 text-[#F2B544]" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#F2B544]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ENROLLMENT FOR ACADEMIC SESSION 2026–2027</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Your Child’s Journey to a Brighter Future Starts Here.
                </h3>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  Discover an inclusive learning environment where every student is encouraged to learn, grow, and lead. Connect with our admissions counselors or submit an online application today.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 bg-[#F2B544] hover:bg-[#E5A736] text-[#0B2345] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4 text-[#0B2345]" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-[#F2B544]" />
                <span>Call Hotline</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
