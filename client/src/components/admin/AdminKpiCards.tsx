import React from 'react';
import { Users, FolderGit2, FileText, Rocket, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface AdminKpiCardsProps {
  stats?: {
    totalUsers?: number;
    totalProjects?: number;
    newRequests?: number;
    activeProjects?: number;
    completedProjects?: number;
  };
}

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({ stats }) => {
  const kpis = [
    {
      id: 'users',
      label: 'Total Users',
      value: stats?.totalUsers ? stats.totalUsers.toLocaleString() : '1,248',
      trend: '12%',
      subtext: '+135 new this month',
      icon: Users,
      iconBg: 'bg-blue-600',
      iconGlow: 'shadow-blue-500/30',
      iconColor: 'text-white',
    },
    {
      id: 'projects',
      label: 'Total Projects',
      value: stats?.totalProjects ? stats.totalProjects.toString() : '86',
      trend: '8%',
      subtext: '+7 new this month',
      icon: FolderGit2,
      iconBg: 'bg-purple-600',
      iconGlow: 'shadow-purple-500/30',
      iconColor: 'text-white',
    },
    {
      id: 'requests',
      label: 'New Requests',
      value: stats?.newRequests ? stats.newRequests.toString() : '24',
      trend: '20%',
      subtext: '+4 pending review',
      icon: FileText,
      iconBg: 'bg-emerald-600',
      iconGlow: 'shadow-emerald-500/30',
      iconColor: 'text-white',
    },
    {
      id: 'active',
      label: 'Active Projects',
      value: stats?.activeProjects ? stats.activeProjects.toString() : '32',
      trend: '6%',
      subtext: '+2 published this week',
      icon: Rocket,
      iconBg: 'bg-amber-600',
      iconGlow: 'shadow-amber-500/30',
      iconColor: 'text-white',
    },
    {
      id: 'completed',
      label: 'Completed Projects',
      value: stats?.completedProjects ? stats.completedProjects.toString() : '18',
      trend: '18%',
      subtext: '+3 this month',
      icon: CheckCircle2,
      iconBg: 'bg-green-600',
      iconGlow: 'shadow-green-500/30',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`nf-frame relative ${
              idx === 4 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-1' : ''
            }`}
          >
            <span className="nf-c nf-c-tl" />
            <span className="nf-c nf-c-tr" />
            <span className="nf-c nf-c-bl" />
            <span className="nf-c nf-c-br" />

            <div className="rounded bg-[#121212] border border-[#262626] p-4 transition-colors hover:border-[#EEEEEE]/30 flex items-center gap-3.5 h-full">
              {/* Left: Icon square */}
              <div
                className="w-10 h-10 rounded bg-[#181818] border border-[#262626] flex items-center justify-center shrink-0 text-[#EEEEEE]"
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Right: Text and values */}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider truncate">
                  {kpi.label}
                </p>

                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
                    {kpi.value}
                  </span>
                  <span className="inline-flex items-center text-[10px] font-mono font-bold text-[#4ADE80] shrink-0">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    <span>{kpi.trend}</span>
                  </span>
                </div>

                <p className="text-[10px] text-[#71717A] mt-1 truncate font-mono">
                  {kpi.subtext}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
