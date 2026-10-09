import React from 'react';
import {
  Activity,
  Mail,
  FileText,
  UserPlus,
  RefreshCw,
  MessageSquare,
  Rocket,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface AdminRecentActivityProps {
  onViewAll?: () => void;
}

export const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({ onViewAll }) => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      title: 'New project inquiry received',
      subtitle: 'E-commerce Website',
      time: '2 hours ago',
      icon: Mail,
      iconBg: 'bg-purple-600/20 border-purple-500/30',
      iconColor: 'text-purple-400',
    },
    {
      id: '2',
      title: 'Custom request submitted',
      subtitle: 'Business Website Development',
      time: '3 hours ago',
      icon: FileText,
      iconBg: 'bg-blue-600/20 border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      id: '3',
      title: 'User registered',
      subtitle: 'rahul@example.com',
      time: '4 hours ago',
      icon: UserPlus,
      iconBg: 'bg-cyan-600/20 border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      id: '4',
      title: 'Request status updated',
      subtitle: 'Moving to Development',
      time: '5 hours ago',
      icon: RefreshCw,
      iconBg: 'bg-emerald-600/20 border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      id: '5',
      title: 'New message received',
      subtitle: 'Project #PRJ-003',
      time: '6 hours ago',
      icon: MessageSquare,
      iconBg: 'bg-indigo-600/20 border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    {
      id: '6',
      title: 'Project published',
      subtitle: 'Portfolio Website',
      time: '7 hours ago',
      icon: Rocket,
      iconBg: 'bg-blue-600/20 border-blue-500/30',
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <div className="h-full rounded-2xl bg-[#0D1527] border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
            Recent Activity
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          View All
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3 pt-3 flex-1 overflow-y-auto">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-slate-800/40 transition-colors group cursor-default"
            >
              {/* Icon pill */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${item.iconBg} group-hover:scale-105 transition-transform`}
              >
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-white transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 shrink-0 mt-0.5 font-medium">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
