import React from 'react';
import { Sparkles, Eye, ExternalLink } from 'lucide-react';
import { Project } from '../../types';

interface TopProjectItem {
  id: string;
  title: string;
  category: string;
  views: string;
  statusBadge: 'Featured' | 'Published';
  thumbnail: string;
}

interface AdminTopProjectsProps {
  projects?: Project[];
  onViewAll?: () => void;
  onSelectProject?: (proj: TopProjectItem) => void;
}

export const AdminTopProjects: React.FC<AdminTopProjectsProps> = ({
  projects,
  onViewAll,
  onSelectProject,
}) => {
  const defaultProjects: TopProjectItem[] = [
    {
      id: '1',
      title: 'E-commerce Platform',
      category: 'E-commerce',
      views: '1.2k views',
      statusBadge: 'Featured',
      thumbnail:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '2',
      title: 'Portfolio Website',
      category: 'Portfolio',
      views: '850 views',
      statusBadge: 'Featured',
      thumbnail:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '3',
      title: 'Real Estate Platform',
      category: 'Real Estate',
      views: '620 views',
      statusBadge: 'Published',
      thumbnail:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '4',
      title: 'Task Management App',
      category: 'Productivity',
      views: '412 views',
      statusBadge: 'Published',
      thumbnail:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '5',
      title: 'Learning Management System',
      category: 'Education',
      views: '380 views',
      statusBadge: 'Published',
      thumbnail:
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const items: TopProjectItem[] =
    projects && projects.length > 0
      ? projects.slice(0, 5).map((p, idx) => ({
          id: p._id,
          title: p.title,
          category: p.category,
          views: `${Math.max(350, 1200 - idx * 210)} views`,
          statusBadge: p.featured ? 'Featured' : 'Published',
          thumbnail:
            p.thumbnail ||
            p.images?.[0] ||
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80',
        }))
      : defaultProjects;

  return (
    <div className="h-full rounded-2xl bg-[#0D1527] border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
            Top Performing Projects
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          View All
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3 pt-2 flex-1">
        {items.map((proj) => (
          <div
            key={proj.id}
            onClick={() => onSelectProject?.(proj)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/40 transition-colors group cursor-pointer"
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Thumbnail */}
              <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60 group-hover:border-blue-500/50 transition-colors">
                <img
                  src={proj.thumbnail}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Title & Stats */}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {proj.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  <span>{proj.category}</span>
                  <span className="mx-1.5">•</span>
                  <span>{proj.views}</span>
                </p>
              </div>
            </div>

            {/* Right: Status Badge */}
            <div className="shrink-0 pl-3">
              {proj.statusBadge === 'Featured' ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-700/60 shadow-sm">
                  Featured
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-950/80 text-teal-300 border border-teal-700/60 shadow-sm">
                  Published
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
