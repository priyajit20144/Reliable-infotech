import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Monitor,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../common/Card';

interface KpiCardsProps {
  stats: {
    totalRequests: number;
    activeProjects: number;
    pendingRequests: number;
    completedProjects: number;
  };
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      trend: '+20% from last month',
      icon: FolderGit2,
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      link: '/dashboard/requests',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      trend: '+100% active sprint',
      icon: Monitor,
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      link: '/dashboard/requests',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      trend: 'Under team review',
      icon: Clock,
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      link: '/dashboard/requests',
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects,
      trend: 'Successfully launched',
      icon: CheckCircle2,
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      link: '/dashboard/requests',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} brackets={true} className="p-5 flex flex-col justify-between hover:border-[#EEEEEE]/30">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">{c.title}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {c.value}
                </h3>
              </div>
              <div
                className={`w-9 h-9 rounded border flex items-center justify-center shrink-0 ${c.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#262626] mt-4 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#A1A1AA]">
                <TrendingUp className="w-3 h-3 text-[#4ADE80]" />
                <span>{c.trend}</span>
              </span>
              <Link
                to={c.link}
                className="w-6 h-6 rounded bg-[#262626] hover:bg-[#363636] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors"
                aria-label={`View ${c.title}`}
              >
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
