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
  projects = [],
  onViewAll,
  onSelectProject,
}) => {
  const items: TopProjectItem[] = (projects || []).slice(0, 5).map((p, idx) => ({
    id: p._id,
    title: p.title,
    category: p.category || 'General',
    views: `${Math.max(120, 1200 - idx * 210)} views`,
    statusBadge: p.featured ? 'Featured' : 'Published',
    thumbnail:
      p.thumbnail ||
      p.images?.[0] ||
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80',
  }));

  return (
    <div className="nf-frame relative h-full">
      <span className="nf-c nf-c-tl" />
      <span className="nf-c nf-c-tr" />
      <span className="nf-c nf-c-bl" />
      <span className="nf-c nf-c-br" />

      <div className="h-full rounded bg-[#121212] border border-[#262626] p-4 sm:p-5 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#181818] text-[#EEEEEE] border border-[#262626] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-white tracking-tight font-mono uppercase">
              Top Performing Projects
            </h3>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs text-[#EEEEEE] hover:underline font-mono transition-colors cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>

        {/* Projects List or Empty State */}
        {items.length === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center flex-1">
            <div className="w-12 h-12 rounded bg-[#181818] border border-[#262626] flex items-center justify-center text-[#71717A] mb-2.5">
              <Sparkles className="w-5 h-5 text-[#EEEEEE]" />
            </div>
            <p className="text-xs font-semibold text-white">No Showcase Projects</p>
            <p className="text-[11px] text-[#A1A1AA] mt-1 max-w-[240px] font-mono">
              No live projects in catalog. Add a showcase project to feature it here.
            </p>
            <button
              onClick={onViewAll}
              className="mt-3 px-3 py-1.5 rounded bg-[#EEEEEE] hover:bg-white text-[#0B0B0B] text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              Manage Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2 flex-1">
            {items.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject?.(proj)}
                className="flex items-center justify-between p-2 rounded hover:bg-[#181818] transition-colors group cursor-pointer"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div className="w-12 h-10 rounded overflow-hidden bg-[#181818] shrink-0 border border-[#262626] group-hover:border-[#EEEEEE]/50 transition-colors">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Stats */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-white truncate transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-[11px] text-[#A1A1AA] mt-0.5 truncate font-mono">
                      <span>{proj.category}</span>
                      <span className="mx-1.5">•</span>
                      <span>{proj.views}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Status Badge */}
                <div className="shrink-0 pl-3">
                  {proj.statusBadge === 'Featured' ? (
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#181818] text-[#EEEEEE] border border-[#262626]">
                      Featured
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#181818] text-[#A1A1AA] border border-[#262626]">
                      Published
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
