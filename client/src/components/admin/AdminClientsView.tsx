import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  DollarSign,
  Briefcase,
  ExternalLink,
  MoreVertical,
  Check,
  X,
} from 'lucide-react';
import { User } from '../../types';

interface ClientItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projectsCount: number;
  totalSpent: number;
  status: 'ACTIVE' | 'ONBOARDING' | 'LEAD';
  avatar: string;
  joinedDate: string;
}

interface AdminClientsViewProps {
  users?: User[];
}

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ONBOARDING' | 'LEAD'>('ALL');
  const [createModal, setCreateModal] = useState(false);

  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const defaultClients: ClientItem[] = [
    {
      id: 'cl_1',
      name: 'Rahul Sharma',
      company: 'Horizon Creative Studio',
      email: 'client@devcraft.io',
      phone: '+1 (555) 234-5678',
      projectsCount: 3,
      totalSpent: 9800,
      status: 'ACTIVE',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'Jan 15, 2026',
    },
    {
      id: 'cl_2',
      name: 'Priya Sharma',
      company: 'NextGen Mobility Solutions',
      email: 'priya@nextgenmobility.com',
      phone: '+1 (555) 987-6543',
      projectsCount: 2,
      totalSpent: 6400,
      status: 'ACTIVE',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'Feb 02, 2026',
    },
    {
      id: 'cl_3',
      name: 'Amit Verma',
      company: 'Apex Logistics & Freight',
      email: 'amit@apexlogistics.io',
      phone: '+1 (555) 456-7890',
      projectsCount: 1,
      totalSpent: 3500,
      status: 'ONBOARDING',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'Mar 10, 2026',
    },
    {
      id: 'cl_4',
      name: 'Neha Singh',
      company: 'Verve Haute Couture',
      email: 'neha@vervefashion.com',
      phone: '+1 (555) 321-7654',
      projectsCount: 4,
      totalSpent: 14200,
      status: 'ACTIVE',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'Dec 18, 2025',
    },
    {
      id: 'cl_5',
      name: 'Rohit Kumar',
      company: 'Lumina Global Fintech',
      email: 'rohit@luminaglobal.com',
      phone: '+1 (555) 654-3210',
      projectsCount: 1,
      totalSpent: 4800,
      status: 'LEAD',
      avatar:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'Apr 05, 2026',
    },
    {
      id: 'cl_6',
      name: 'Sneha Patel',
      company: 'Synapse Cognitive Systems',
      email: 'sneha@synapseai.org',
      phone: '+1 (555) 890-1234',
      projectsCount: 2,
      totalSpent: 7500,
      status: 'ACTIVE',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'Feb 24, 2026',
    },
  ];

  const [clients, setClients] = useState<ClientItem[]>(defaultClients);

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newClient: ClientItem = {
      id: `cl_${Date.now()}`,
      name: newName,
      company: newCompany || 'Independent Business',
      email: newEmail,
      phone: newPhone || '+1 (555) 000-0000',
      projectsCount: 1,
      totalSpent: 3000,
      status: 'ACTIVE',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'Just now',
    };

    setClients([newClient, ...clients]);
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
    setCreateModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D1527] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Client Accounts & Corporate Accounts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enterprise customer profiles, active contracts, project history, and revenue metrics
            </p>
          </div>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Client</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Total Client Portfolio</span>
          <p className="text-2xl font-black text-white mt-1">{clients.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Active Retainers</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {clients.filter((c) => c.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Avg Lifetime Spend</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">$7,680</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Client Retention</span>
          <p className="text-2xl font-black text-purple-400 mt-1">96.4%</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, company, or email..."
            className="w-full bg-[#111827] text-xs text-white rounded-xl pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          {(['ALL', 'ACTIVE', 'ONBOARDING', 'LEAD'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Top row: Avatar & Status */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>{client.company}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    client.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : client.status === 'ONBOARDING'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {client.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 py-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{client.phone}</span>
                </div>
              </div>

              {/* Financial & Delivery Metrics */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#111827] border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Builds Delivered</span>
                  <span className="font-bold text-white mt-0.5 block">{client.projectsCount} Projects</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Total Invoiced</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block font-mono">
                    ${client.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Member since {client.joinedDate}</span>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${client.email}`}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Send Direct Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => alert(`Opening client workspace for ${client.name}...`)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold border border-blue-500/30 transition-colors"
                >
                  Workspace
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Onboard Client */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCreateModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white">Onboard New Corporate Client</h3>
              <button onClick={() => setCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Apex Global Ventures"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="elena@apex.io"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 012-3456"
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
