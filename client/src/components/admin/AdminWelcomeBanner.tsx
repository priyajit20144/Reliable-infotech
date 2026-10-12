import React from 'react';
import { ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminWelcomeBannerProps {
  customDate?: string;
}

export const AdminWelcomeBanner: React.FC<AdminWelcomeBannerProps> = ({
  customDate = 'April 28, 2025',
}) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin';

  // Format today's date if user prefers or show the reference date
  const displayDate = customDate || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="nf-frame relative overflow-hidden rounded bg-[#121212] border border-[#262626] p-5 sm:p-8 min-h-[170px] flex flex-col justify-between group">
      <span className="nf-c nf-c-tl" />
      <span className="nf-c nf-c-tr" />
      <span className="nf-c nf-c-bl" />
      <span className="nf-c nf-c-br" />

      {/* Subtle hatched band */}
      <div
        className="absolute inset-x-0 top-0 h-1 pointer-events-none opacity-30"
        style={{
          background: 'repeating-linear-gradient(45deg, #EEEEEE 0, #EEEEEE 2px, transparent 0, transparent 8px)',
        }}
      />

      {/* Top right floating pill widget with Admin & Date */}
      <div className="flex sm:absolute sm:top-6 sm:right-6 z-20 items-center justify-between sm:justify-end gap-2 mb-3 sm:mb-0">
        <div className="inline-flex sm:hidden items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#181818] border border-[#262626] text-[11px] font-mono text-[#A1A1AA]">
          <Sparkles className="w-3 h-3 text-[#EEEEEE]" />
          <span>COMMAND CONSOLE</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-[#181818] border border-[#262626] text-xs font-mono text-[#EEEEEE]">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-[#262626] flex items-center justify-center text-white">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#4ADE80]" />
          </div>
          <span className="text-white font-bold tracking-tight text-[11px] sm:text-xs">ADMIN</span>
          <span className="text-[#363636]">•</span>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[#A1A1AA] font-mono text-[10px] sm:text-[11px]">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#EEEEEE]" />
            <span>{displayDate}</span>
          </div>
        </div>
      </div>

      {/* Left Content */}
      <div className="relative z-20 max-w-xl py-1 sm:py-2">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#181818] border border-[#262626] text-[11px] font-mono text-[#A1A1AA] mb-2">
          <Sparkles className="w-3 h-3 text-[#EEEEEE]" />
          <span>RELIABLE INFOTECH COMMAND CENTER</span>
        </div>

        <h1 className="text-xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight flex items-center gap-2 flex-wrap">
          <span>Good Morning, <span className="font-serif italic text-white/90">{firstName}!</span></span>
        </h1>

        <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1.5 sm:mt-2 leading-relaxed max-w-md">
          Here's what's happening with your platform, client submissions, and deployment pipelines today.
        </p>
      </div>

      {/* Bottom accent indicator */}
      <div className="relative z-20 pt-2 flex items-center gap-2">
        <div className="h-0.5 w-16 bg-[#EEEEEE]" />
        <div className="h-0.5 w-4 bg-[#4ADE80]" />
        <div className="h-0.5 w-2 bg-[#262626]" />
      </div>
    </div>
  );
};
