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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-card">
      {/* Background radial glow */}
      <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-indigo-300 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reliable Info Tech Client Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {user?.name || 'Rahul Sharma'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Here's what's happening with your digital builds, pending quotations, and live deployment sprints.
          </p>
        </div>

        {/* Dynamic status beacons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Projects: {activeProjectsCount}</span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span>Pending Requests: {pendingRequestsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
