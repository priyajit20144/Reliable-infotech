import React, { useState, useEffect } from 'react';
import {
  Users2,
  Plus,
  Mail,
  Phone,
  Shield,
  Code2,
  CheckCircle,
  ExternalLink,
  X,
  Sparkles,
  Trash2,
  UserMinus,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Frontend' | 'Backend' | 'Full Stack' | 'UI/UX' | 'DevOps';
  email: string;
  phone: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  activeProjects: number;
  skills: string[];
}

export const AdminTeamView: React.FC = () => {
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [addModal, setAddModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [headerRemoveModal, setHeaderRemoveModal] = useState(false);
  const [selectedHeaderMemberId, setSelectedHeaderMemberId] = useState<string>('');
  const [reassignTo, setReassignTo] = useState<string>('Sarah Chen (Lead Cloud)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHeaderRemoveModal(false);
        setMemberToRemove(null);
        setAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'tm_1',
      name: 'Alex Rivera',
      role: 'Platform Architect & Lead Admin',
      department: 'Full Stack',
      email: 'admin@devcraft.io',
      phone: '+1 (555) 019-2834',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      activeProjects: 4,
      skills: ['Architecture', 'Kubernetes', 'Go', 'React', 'Security'],
    },
    {
      id: 'tm_2',
      name: 'Sarah Chen',
      role: 'Lead Cloud & Systems Engineer',
      department: 'DevOps',
      email: 'team@devcraft.io',
      phone: '+1 (555) 876-5432',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      activeProjects: 3,
      skills: ['AWS', 'Docker', 'PostgreSQL', 'Terraform', 'Node.js'],
    },
    {
      id: 'tm_3',
      name: 'Rahul Sharma',
      role: 'Senior Frontend Developer',
      department: 'Frontend',
      email: 'rahul.dev@devcraft.io',
      phone: '+1 (555) 234-5678',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      activeProjects: 3,
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    {
      id: 'tm_4',
      name: 'Priya Mehta',
      role: 'Senior Backend Engineer',
      department: 'Backend',
      email: 'priya.backend@devcraft.io',
      phone: '+1 (555) 987-6543',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      activeProjects: 2,
      skills: ['Express', 'MongoDB', 'Redis', 'GraphQL', 'Python'],
    },
    {
      id: 'tm_5',
      name: 'Amit Verma',
      role: 'Principal UI/UX Designer',
      department: 'UI/UX',
      email: 'amit.design@devcraft.io',
      phone: '+1 (555) 456-7890',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      status: 'away',
      activeProjects: 2,
      skills: ['Figma', 'Design Systems', 'Micro-interactions', 'Prototyping'],
    },
    {
      id: 'tm_6',
      name: 'Neha Singh',
      role: 'Full Stack Engineer',
      department: 'Full Stack',
      email: 'neha.fullstack@devcraft.io',
      phone: '+1 (555) 321-7654',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      activeProjects: 3,
      skills: ['Next.js', 'PostgreSQL', 'Stripe', 'Docker'],
    },
  ]);

  // New member form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Frontend Developer');
  const [newMemberDept, setNewMemberDept] = useState<
    'Frontend' | 'Backend' | 'Full Stack' | 'UI/UX' | 'DevOps'
  >('Frontend');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const filteredMembers = members.filter(
    (m) => filterDept === 'ALL' || m.department === filterDept
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    const newM: TeamMember = {
      id: `tm_${Date.now()}`,
      name: newMemberName,
      role: newMemberRole,
      department: newMemberDept,
      email: newMemberEmail,
      phone: '+1 (555) 000-0000',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      activeProjects: 1,
      skills: ['TypeScript', 'Modern Web', 'DevCraft Stack'],
    };

    setMembers([...members, newM]);
    setNewMemberName('');
    setNewMemberEmail('');
    setAddModal(false);
    showToast(`Team member "${newM.name}" added successfully!`);
  };

  const handleConfirmRemove = () => {
    if (!memberToRemove) return;
    const removedName = memberToRemove.name;
    setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
    setMemberToRemove(null);
    showToast(`Team member "${removedName}" removed successfully.`);
  };

  const handleHeaderRemoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = members.find((m) => m.id === selectedHeaderMemberId);
    if (!target) return;
    setHeaderRemoveModal(false);
    setMemberToRemove(target);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl shadow-emerald-600/40 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D1527] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              DevCraft Core Engineering & Product Team
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Engineers, designers, sprint allocations, and technical capabilities
            </p>
          </div>
        </div>

        {/* Action Buttons: Add & Remove Team Member */}
        <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          {/* Remove Team Member Button */}
          <button
            onClick={() => {
              if (members.length > 0) {
                setSelectedHeaderMemberId(members[0].id);
                setHeaderRemoveModal(true);
              }
            }}
            disabled={members.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 active:scale-95 text-red-300 hover:text-red-200 border border-red-800/60 hover:border-red-600 text-xs font-bold transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserMinus className="w-4 h-4 text-red-400" />
            <span>Remove Team Member</span>
          </button>

          {/* Add Team Member Button */}
          <button
            onClick={() => setAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Total Team Members</span>
          <p className="text-2xl font-black text-white mt-1">{members.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Online & Active</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {members.filter((m) => m.status === 'online').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Assigned Sprints</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">
            {members.reduce((acc, m) => acc + m.activeProjects, 0)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Sprint SLA Delivery</span>
          <p className="text-2xl font-black text-purple-400 mt-1">99.2%</p>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {['ALL', 'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'DevOps'].map((dept) => (
          <button
            key={dept}
            onClick={() => setFilterDept(dept)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
              filterDept === dept
                ? 'bg-blue-600 text-white'
                : 'bg-[#0D1527] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Team Members Grid or Empty State */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0D1527] border border-slate-800">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mb-4">
            <Users2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No team members found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {filterDept === 'ALL'
              ? 'There are currently no active team members in DevCraft Core.'
              : `No team members found in the "${filterDept}" department.`}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {filterDept !== 'ALL' && (
              <button
                onClick={() => setFilterDept('ALL')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Clear Filter
              </button>
            )}
            <button
              onClick={() => setAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-colors"
            >
              Add Member
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#0D1527] ${
                          member.status === 'online'
                            ? 'bg-emerald-400'
                            : member.status === 'away'
                            ? 'bg-amber-400'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{member.role}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {member.department}
                  </span>
                </div>

                {/* Contact */}
                <div className="space-y-1.5 py-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 font-medium block mb-1.5">
                    Core Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[#111827] text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Workload + Direct Ping + Remove Team Member */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  <strong className="text-white font-bold">{member.activeProjects}</strong> Active Builds
                </span>

                <div className="flex items-center gap-2">
                  {/* Direct Ping */}
                  <a
                    href={`mailto:${member.email}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Direct Ping
                  </a>

                  {/* Remove Team Member Option on each card */}
                  <button
                    type="button"
                    onClick={() => setMemberToRemove(member)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-800/60 hover:border-red-500 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    title={`Remove ${member.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Quick Header "Remove Team Member" Selection Modal */}
      {headerRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setHeaderRemoveModal(false)}
          />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-red-400">
                <UserMinus className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">Select Member to Remove</h3>
              </div>
              <button
                onClick={() => setHeaderRemoveModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHeaderRemoveSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">
                  Choose Team Member for Offboarding
                </label>
                <select
                  value={selectedHeaderMemberId}
                  onChange={(e) => setSelectedHeaderMemberId(e.target.value)}
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-red-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.role} ({m.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Member Preview */}
              {(() => {
                const target = members.find((m) => m.id === selectedHeaderMemberId);
                if (!target) return null;
                return (
                  <div className="p-3 rounded-xl bg-[#111827] border border-slate-800 flex items-center gap-3">
                    <img
                      src={target.avatar}
                      alt={target.name}
                      className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-700"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-bold text-white truncate">{target.name}</p>
                      <p className="text-slate-400 text-[11px] truncate">{target.role}</p>
                      <p className="text-amber-400 text-[10px] font-medium mt-0.5">
                        {target.activeProjects} active project sprint(s)
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHeaderRemoveModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all"
                >
                  <span>Proceed to Removal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Confirm Removal Modal with Reassignment Options */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setMemberToRemove(null)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F172A] border border-red-500/30 shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    Remove Team Member
                  </h3>
                  <p className="text-xs text-slate-400">
                    Offboard member and reallocate engineering responsibilities
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMemberToRemove(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Member Profile Preview Card */}
            <div className="my-4 p-4 rounded-2xl bg-[#111827] border border-slate-800 flex items-center gap-3.5">
              <img
                src={memberToRemove.avatar}
                alt={memberToRemove.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-red-500/40"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {memberToRemove.name}
                </h4>
                <p className="text-xs text-slate-400 truncate">{memberToRemove.role}</p>
                <p className="text-[11px] text-indigo-400 font-mono mt-0.5 truncate">
                  {memberToRemove.email}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {memberToRemove.department}
              </span>
            </div>

            {/* Warning Details */}
            <div className="space-y-3.5 text-xs text-slate-300">
              {memberToRemove.activeProjects > 0 ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Active Workload Alert</span>
                  </p>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    This engineer currently has{' '}
                    <strong>{memberToRemove.activeProjects} active project builds</strong>{' '}
                    assigned. Please designate a replacement engineer to take over their
                    sprint commitments.
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 leading-relaxed">
                  Are you sure you want to remove <strong>{memberToRemove.name}</strong> from
                  the DevCraft core organization? This will revoke their team member
                  privileges.
                </p>
              )}

              {/* Reassignment Dropdown */}
              {memberToRemove.activeProjects > 0 && (
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    Reassign Active Project Sprints To:
                  </label>
                  <select
                    value={reassignTo}
                    onChange={(e) => setReassignTo(e.target.value)}
                    className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    {members
                      .filter((m) => m.id !== memberToRemove.id)
                      .map((m) => (
                        <option key={m.id} value={`${m.name} (${m.role})`}>
                          {m.name} — {m.role}
                        </option>
                      ))}
                    <option value="Unassigned Pool">Unassigned Pool</option>
                  </select>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm & Remove Member</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Add Team Member */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setAddModal(false)}
          />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white">Add Engineering Team Member</h3>
              <button onClick={() => setAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Engineering Role</label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Department</label>
                <select
                  value={newMemberDept}
                  onChange={(e) => setNewMemberDept(e.target.value as any)}
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="vikram@devcraft.io"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg"
                >
                  Confirm & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
