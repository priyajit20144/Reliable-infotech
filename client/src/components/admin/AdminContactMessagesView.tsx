import React, { useState } from 'react';
import { Send, Search, Mail, Check, Trash2, Clock, CheckCircle2, X } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'UNREAD' | 'READ' | 'RESOLVED';
}

export const AdminContactMessagesView: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'RESOLVED'>('ALL');
  const [search, setSearch] = useState('');
  const [replyModalMessage, setReplyModalMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  const [messages, setMessages] = useState<ContactMessage[]>([
    {
      id: 'cm_1',
      name: 'Jordan Belfort',
      email: 'jordan@strattongroup.com',
      subject: 'Inquiry regarding full stack SaaS platform quotation',
      message:
        'Hi, we are looking for a complete end-to-end rewrite of our financial portfolio analytics engine. Do you have availability for Q4 sprint start?',
      date: '2 hours ago',
      status: 'UNREAD',
    },
    {
      id: 'cm_2',
      name: 'Claire Dupont',
      email: 'claire@dupontluxury.fr',
      subject: 'Custom 3D Product Configurator inquiry',
      message:
        'Hello team Reliable Info Tech! We were blown away by VerveCommerce. Can you build a customized 3D jewelry configurator for our Parisian retail store?',
      date: '5 hours ago',
      status: 'UNREAD',
    },
    {
      id: 'cm_3',
      name: 'David Miller',
      email: 'david@cloudscale.net',
      subject: 'Enterprise SLA & Multi-region redundancy question',
      message:
        'We require 99.99% availability and SOC2 compliance audit logs for our cloud dashboard. Can you provide custom SLA agreement terms?',
      date: '1 day ago',
      status: 'UNREAD',
    },
    {
      id: 'cm_4',
      name: 'Samantha Ray',
      email: 'samantha@greenleaftech.io',
      subject: 'Contract milestone delivery confirmation',
      message:
        'Thank you for delivering the milestone ahead of schedule! The micro-animations look stunning on our staging server.',
      date: '2 days ago',
      status: 'RESOLVED',
    },
  ]);

  const handleMarkResolved = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'RESOLVED' } : m))
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this contact message?')) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalMessage || !replyText) return;
    alert(`Reply sent to ${replyModalMessage.email}`);
    handleMarkResolved(replyModalMessage.id);
    setReplyModalMessage(null);
    setReplyText('');
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'UNREAD' && m.status === 'UNREAD') ||
      (filter === 'RESOLVED' && m.status === 'RESOLVED');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D1527] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Inbound Contact Submissions & Landing Form Inquiries
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Messages received from prospective clients via the public /contact form
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Total Form Inquiries</span>
          <p className="text-2xl font-black text-white mt-1">{messages.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Unread Submissions</span>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {messages.filter((m) => m.status === 'UNREAD').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Resolved / Answered</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {messages.filter((m) => m.status === 'RESOLVED').length}
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, email, subject..."
            className="w-full bg-[#111827] text-xs text-white rounded-xl pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'UNREAD', 'RESOLVED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111827] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      msg.status === 'UNREAD' ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {msg.name}
                  </h3>
                  <span className="text-xs text-slate-400">({msg.email})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">{msg.date}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.status === 'UNREAD'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-200 mt-3">{msg.subject}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{msg.message}</p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
              <button
                onClick={() => setReplyModalMessage(msg)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply to Client</span>
              </button>

              {msg.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleMarkResolved(msg.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              )}

              <button
                onClick={() => handleDelete(msg.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyModalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setReplyModalMessage(null)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-base text-white">Reply to {replyModalMessage.name}</h3>
                <p className="text-xs text-slate-400">{replyModalMessage.email}</p>
              </div>
              <button onClick={() => setReplyModalMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#111827] text-xs text-slate-400 italic">
                "{replyModalMessage.message}"
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Your Response</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official consultation response..."
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyModalMessage(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
