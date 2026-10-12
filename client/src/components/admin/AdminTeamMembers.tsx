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
      localStorage.removeItem('reliable_admin_team_members');
      localStorage.removeItem('devcraft_team_members');
      const saved = localStorage.getItem('reliable_foundation_team_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const fakeNames = [
            'sarah chen',
            'rahul sharma',
            'priya mehta',
            'amit verma',
            'neha singh',
            'alex rivera',
          ];
          const demoIds = ['tm_1', 'tm_2', 'tm_3', 'tm_4', 'tm_5', 'tm_6'];
          const validReal = parsed.filter(
            (m: any) =>
              m &&
              m.name &&
              !demoIds.includes(m.id) &&
              !fakeNames.includes(m.name.toLowerCase().trim())
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
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-white tracking-tight flex items-center gap-2 font-mono uppercase">
                <span>Team Members</span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#181818] text-[#EEEEEE] border border-[#262626]">
                  {members.length > 0 ? `${members.length} Active` : '0 Configured'}
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs text-[#EEEEEE] hover:underline font-mono transition-colors cursor-pointer"
          >
            VIEW ALL
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
              className="flex items-center gap-3 p-2.5 rounded bg-[#181818] border border-[#262626] transition-colors group"
            >
              {/* Avatar with Status indicator */}
              <div className="relative shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      member.name
                    )}&background=262626&color=eee&bold=true`;
                  }}
                  className="w-10 h-10 rounded-full object-cover border border-[#262626] bg-[#121212]"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#121212] ${
                    member.status === 'online'
                      ? 'bg-[#4ADE80]'
                      : member.status === 'away'
                      ? 'bg-amber-400'
                      : 'bg-[#71717A]'
                  }`}
                />
              </div>

              {/* Member info */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate transition-colors">
                  {member.name}
                </p>
                <p className="text-[11px] text-[#A1A1AA] truncate mt-0.5 font-mono">
                  {member.role}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      member.status === 'online'
                        ? 'bg-[#4ADE80]'
                        : member.status === 'away'
                        ? 'bg-amber-400'
                        : 'bg-[#71717A]'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono capitalize ${
                      member.status === 'online'
                        ? 'text-[#4ADE80]'
                        : member.status === 'away'
                        ? 'text-amber-400'
                        : 'text-[#71717A]'
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
  </div>
);
};
