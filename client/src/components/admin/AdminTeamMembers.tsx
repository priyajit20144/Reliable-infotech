import React, { useState, useEffect } from 'react';
import { Users2, Plus } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
}

interface AdminTeamMembersProps {
  onViewAll?: () => void;
}

export const AdminTeamMembers: React.FC<AdminTeamMembersProps> = ({ onViewAll }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('reliable_admin_team_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const demoIds = ['tm_1', 'tm_2', 'tm_3', 'tm_4', 'tm_5', 'tm_6'];
          const demoEmails = [
            'team@reliableinfotech.io',
            'rahul.dev@reliableinfotech.io',
            'priya.backend@reliableinfotech.io',
            'amit.design@reliableinfotech.io',
            'neha.fullstack@reliableinfotech.io',
          ];
          const validReal = parsed.filter(
            (m: any) => !demoIds.includes(m.id) && !demoEmails.includes(m.email)
          );
          setMembers(
            validReal.map((m: any) => ({
              id: m.id,
              name: m.name,
              role: m.role,
              avatar: m.avatar,
              status: m.status || 'online',
            }))
          );
        }
      }
    } catch (e) {}
  }, []);

  return (
    <div className="h-full rounded-2xl bg-[#0D1527] border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              <span>Team Members</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {members.length > 0 ? `${members.length} Active` : '0 Configured'}
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          View All
        </button>
      </div>

      {/* Members 2x2 or empty state */}
      {members.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center flex-1">
          <p className="font-semibold text-slate-300">No Team Members Configured</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
            All demo members have been removed. Add your real team members in the Team section.
          </p>
          <button
            onClick={onViewAll}
            className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Team Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 flex-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 transition-colors group"
            >
              {/* Avatar with Status indicator */}
              <div className="relative shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      member.name
                    )}&background=2563eb&color=fff&bold=true`;
                  }}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-blue-500/60 transition-all bg-slate-800"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#0D1527] ${
                    member.status === 'online'
                      ? 'bg-emerald-500'
                      : member.status === 'away'
                      ? 'bg-amber-400'
                      : 'bg-slate-500'
                  }`}
                />
              </div>

              {/* Member info */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {member.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {member.role}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      member.status === 'online'
                        ? 'bg-emerald-400'
                        : member.status === 'away'
                        ? 'bg-amber-400'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium capitalize ${
                      member.status === 'online'
                        ? 'text-emerald-400'
                        : member.status === 'away'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
