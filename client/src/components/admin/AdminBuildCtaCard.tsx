import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';

interface AdminBuildCtaCardProps {
  onViewAnalytics?: () => void;
}

export const AdminBuildCtaCard: React.FC<AdminBuildCtaCardProps> = ({ onViewAnalytics }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F1836] via-[#111A3A] to-[#0A1024] border border-blue-500/25 p-4 sm:p-5 lg:p-6 flex flex-col justify-between group shadow-xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/15 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/25 transition-all duration-500" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top section: Rocket illustration + Heading */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Rocket badge with glowing artwork */}
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shrink-0 shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0A1024] flex items-center justify-center relative">
            <img
              src="/admin-rocket.jpg"
              alt="Rocket Art"
              className="w-full h-full object-cover opacity-90 scale-125"
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
            Keep Building
            <br />
            Great Products
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Your platform is running smoothly. Keep up the amazing work!
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 pt-4">
        <button
          onClick={onViewAnalytics}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all group/btn"
        >
          <span>View Analytics</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
