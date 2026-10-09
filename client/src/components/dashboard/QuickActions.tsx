import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, PlusCircle, MessageSquare, GitPullRequest } from 'lucide-react';
import { Card } from '../common/Card';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      label: 'Browse Projects',
      sub: 'Explore live showcase',
      path: '/projects',
      icon: FolderGit2,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Request Website',
      sub: 'Build custom product',
      path: '/request',
      icon: PlusCircle,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Contact Team',
      sub: 'Talk to an architect',
      path: '/contact',
      icon: MessageSquare,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'View Requests',
      sub: 'Track active status',
      path: '/dashboard/requests',
      icon: GitPullRequest,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-base font-bold text-white mb-1">Quick Actions</h3>
      <p className="text-xs text-gray-400 mb-4">Direct shortcuts to key platform workflows</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <Link
              key={i}
              to={act.path}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 transition-all flex items-center gap-3 group"
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${act.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {act.label}
                </p>
                <p className="text-[10px] text-gray-400 truncate">{act.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
