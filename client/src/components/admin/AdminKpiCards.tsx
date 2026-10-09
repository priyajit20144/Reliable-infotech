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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="group relative overflow-hidden rounded-2xl bg-[#0D1527] border border-slate-800/80 hover:border-slate-700 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/30 flex items-center gap-3.5"
          >
            {/* Subtle card corner shine */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-white/[0.04] transition-all" />

            {/* Left: Icon square */}
            <div
              className={`w-12 h-12 rounded-xl ${kpi.iconBg} flex items-center justify-center shrink-0 shadow-lg ${kpi.iconGlow} group-hover:scale-105 transition-transform duration-300`}
            >
              <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
            </div>

            {/* Right: Text and values */}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-400 tracking-wide truncate">
                {kpi.label}
              </p>

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                  {kpi.value}
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 shrink-0">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  <span>{kpi.trend}</span>
                </span>
              </div>

              <p className="text-[10px] text-slate-400 mt-1 truncate font-normal">
                {kpi.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
