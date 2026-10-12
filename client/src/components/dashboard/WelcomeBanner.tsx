import React from 'react';
import { Sparkles, Activity, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WelcomeBannerProps {
  activeProjectsCount?: number;
  pendingRequestsCount?: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  activeProjectsCount = 2,
  pendingRequestsCount = 1,
}) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="nf-frame relative overflow-hidden rounded bg-[#121212] border border-[#262626] p-6 sm:p-8">
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

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#181818] text-xs font-mono text-[#A1A1AA] border border-[#262626]">
            <Sparkles className="w-3.5 h-3.5 text-[#EEEEEE]" />
            <span>RELIABLE INFOTECH CLIENT WORKSPACE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
            {getGreeting()},{' '}
            <span className="font-serif italic text-white/90">
              {user?.name || 'Rahul Sharma'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            Here's what's happening with your digital builds, pending quotations, and live deployment sprints.
          </p>
        </div>

        {/* Dynamic status beacons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded bg-[#181818] border border-[#262626] text-[#4ADE80] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <span>ACTIVE PROJECTS: {activeProjectsCount}</span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded bg-[#181818] border border-[#262626] text-[#EEEEEE] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#EEEEEE]" />
            <span>PENDING REQUESTS: {pendingRequestsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
