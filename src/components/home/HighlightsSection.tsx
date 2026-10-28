import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Bell, Calendar, Users, Phone, ArrowUpRight } from 'lucide-react';

const INFO_CARDS = [
  {
    title: 'Admission Information',
    description: 'Eligibility, application steps & online enrollment',
    path: '/admissions',
    icon: FileCheck,
    tag: 'Admissions 2026–27',
  },
  {
    title: 'Latest Notices',
    description: 'Campus circulars, announcements & exam notices',
    path: '/news',
    icon: Bell,
    tag: 'Notice Board',
  },
  {
    title: 'Academic Calendar',
    description: 'Class routines, daily study plans & homework',
    path: '/study-plan',
    icon: Calendar,
    tag: 'Curriculum & Routine',
  },
  {
    title: 'Teachers & Staff',
    description: 'Certified faculty directory & department coordinators',
    path: '/teachers',
    icon: Users,
    tag: 'Faculty Directory',
  },
  {
    title: 'Contact the School',
    description: 'Campus address, visiting hours & admission hotline',
    path: '/contact',
    icon: Phone,
    tag: 'Helpdesk & Inquiries',
  },
];

export const HighlightsSection: React.FC = () => {
  return (
    <section className="py-8 bg-white border-b border-[#E1E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {INFO_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.path}
                className="group p-4 rounded-xl bg-[#F5F8FC] border border-[#E1E8F0] hover:border-[#123B70] hover:bg-white hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E1E8F0] group-hover:border-[#123B70] group-hover:bg-[#123B70] flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-[#123B70] group-hover:text-[#F2B544] transition-colors" />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#123B70] transition-colors" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563A6] block mb-0.5">
                    {card.tag}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#18263A] group-hover:text-[#123B70] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#66758A] mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-bold text-[#123B70]">
                  <span>Explore</span>
                  <span className="text-[#F2B544] font-black group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
