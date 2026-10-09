import React from 'react';
import { Users2 } from 'lucide-react';

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
  const members: TeamMember[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      role: 'Frontend Developer',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'online',
    },
    {
      id: '2',
      name: 'Priya Mehta',
      role: 'Backend Developer',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      status: 'online',
    },
    {
      id: '3',
      name: 'Amit Verma',
      role: 'UI/UX Designer',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      status: 'away',
    },
    {
      id: '4',
      name: 'Neha Singh',
      role: 'Full Stack Developer',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      status: 'online',
    },
  ];

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
                4 Active
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

      {/* Members 2x2 or responsive list */}
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
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-blue-500/60 transition-all"
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
    </div>
  );
};
