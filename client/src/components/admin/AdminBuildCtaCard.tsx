import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';

interface AdminBuildCtaCardProps {
  onViewAnalytics?: () => void;
}

export const AdminBuildCtaCard: React.FC<AdminBuildCtaCardProps> = ({ onViewAnalytics }) => {
  return (
    <div className="nf-frame relative h-full bg-[#121212] border border-[#262626] p-4 sm:p-5 lg:p-6 flex flex-col justify-between group">
      {/* Corner Brackets */}
      <span className="nf-c nf-c-tl" />
      <span className="nf-c nf-c-tr" />
      <span className="nf-c nf-c-bl" />
      <span className="nf-c nf-c-br" />

      {/* Top section: Rocket illustration + Heading */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Rocket badge with architectural border */}
        <div className="relative w-12 h-12 border border-[#262626] bg-[#181818] p-1 shrink-0 group-hover:border-[#444444] transition-colors">
          <div className="w-full h-full bg-[#0B0B0B] flex items-center justify-center relative overflow-hidden">
            <img
              src="/admin-rocket.jpg"
              alt="Rocket Art"
              className="w-full h-full object-cover opacity-80 filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#777777] mb-1">Status: Operational</div>
          <h3 className="text-sm sm:text-base font-bold text-[#EEEEEE] tracking-tight leading-snug">
            Keep Building
            <br />
            Great Products
          </h3>
          <p className="text-xs text-[#888888] mt-1 leading-relaxed">
            All microservices and real-time WebSocket channels active.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 pt-4">
        <button
          onClick={onViewAnalytics}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#EEEEEE] hover:bg-white text-[#0B0B0B] text-xs font-bold transition-all group/btn"
        >
          <span>View Analytics</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
