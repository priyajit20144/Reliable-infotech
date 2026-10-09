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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C152E] via-[#0E1A38] to-[#122147] border border-blue-500/20 shadow-2xl p-5 sm:p-8 lg:p-10 min-h-[180px] sm:min-h-[190px] flex flex-col justify-between group">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top right floating pill widget with Admin & Date */}
      <div className="flex sm:absolute sm:top-6 sm:right-6 z-20 items-center justify-between sm:justify-end gap-2 mb-3 sm:mb-0">
        <div className="inline-flex sm:hidden items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-cyan-300">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Command Center</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#0D1836]/90 backdrop-blur-md border border-blue-400/25 shadow-lg shadow-blue-900/20 text-xs font-semibold text-slate-200">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-200" />
          </div>
          <span className="text-white font-bold tracking-tight text-[11px] sm:text-xs">Admin</span>
          <span className="text-slate-500">•</span>
          <div className="flex items-center gap-1 sm:gap-1.5 text-slate-300 font-medium text-[10px] sm:text-[11px]">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400" />
            <span>{displayDate}</span>
          </div>
        </div>
      </div>

      {/* 3D Glowing Workstation Illustration in Right Background */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 lg:w-5/12 pointer-events-none overflow-hidden flex items-center justify-end z-10">
        <div className="relative h-full w-full max-w-[460px] flex items-center justify-end">
          {/* Subtle gradient mask to seamlessly blend into banner background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C152E] via-[#0C152E]/70 to-transparent sm:bg-gradient-to-r sm:from-[#0C152E] sm:via-transparent sm:to-transparent z-10" />
          <img
            src="/admin-hero.jpg"
            alt="DevCraft Admin Workstation"
            className="w-full h-full object-cover object-center opacity-30 sm:opacity-95 filter drop-shadow-[0_10px_25px_rgba(37,99,235,0.35)] scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
      </div>

      {/* Left Content */}
      <div className="relative z-20 max-w-xl py-1 sm:py-2">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-cyan-300 mb-2">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>DevCraft Command Center</span>
        </div>

        <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2 flex-wrap">
          <span>Good Morning, {firstName}!</span>
          <span className="inline-block animate-bounce origin-bottom-right">👋</span>
        </h1>

        <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal mt-1.5 sm:mt-2.5 leading-relaxed max-w-md">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Bottom glowing accent bar */}
      <div className="relative z-20 pt-2 flex items-center gap-2">
        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        <div className="h-1 w-4 rounded-full bg-blue-600/60" />
        <div className="h-1 w-1.5 rounded-full bg-blue-600/30" />
      </div>
    </div>
  );
};
