import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Filter, AlertTriangle, Shield, Layers, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  category: 'REQUESTS' | 'SYSTEM' | 'SECURITY' | 'INQUIRY';
  unread: boolean;
  severity: 'info' | 'warning' | 'success';
}

export const AdminNotificationsView: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'REQUESTS' | 'SYSTEM' | 'SECURITY'>('ALL');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n_1',
      title: 'New custom website requirement submitted',
      desc: 'Priya Sharma submitted requirement for NextGen EV Charging platform (#REQ-001). High priority.',
      time: '15m ago',
      category: 'REQUESTS',
      unread: true,
      severity: 'info',
    },
    {
      id: 'n_2',
      title: 'Database automated snapshot completed',
      desc: 'MongoDB Atlas daily multi-region snapshot succeeded with 0 latency impact.',
      time: '1h ago',
      category: 'SYSTEM',
      unread: true,
      severity: 'success',
    },
    {
      id: 'n_3',
      title: 'Stripe webhook received for milestone payment',
      desc: 'Escrow payment milestone of $3,500 released for Project #PRJ-002.',
      time: '3h ago',
      category: 'REQUESTS',
      unread: true,
      severity: 'success',
    },
    {
      id: 'n_4',
      title: 'New prospective client inquiry',
      desc: 'Jordan Belfort submitted inquiry regarding enterprise SaaS portal quote.',
      time: '4h ago',
      category: 'INQUIRY',
      unread: true,
      severity: 'info',
    },
    {
      id: 'n_5',
      title: 'Security notice: API token refreshed',
      desc: 'Administrative bearer token refreshed from recognized IP (192.168.1.1).',
      time: '6h ago',
      category: 'SECURITY',
      unread: true,
      severity: 'warning',
    },
    {
      id: 'n_6',
      title: 'Showcase build published',
      desc: 'LuminaPay fintech platform is now publicly visible in the showcase catalog.',
      time: '1 day ago',
      category: 'SYSTEM',
      unread: false,
      severity: 'info',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return n.unread;
    if (filter === 'REQUESTS') return n.category === 'REQUESTS';
    if (filter === 'SYSTEM') return n.category === 'SYSTEM';
    if (filter === 'SECURITY') return n.category === 'SECURITY';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D1527] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Administrative Notification Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live broadcast feed for pipeline updates, client inquiries, and security events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-blue-400" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-slate-800/60 hover:bg-red-500/10 text-xs font-semibold text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Total Notifications</span>
          <p className="text-2xl font-black text-white mt-1">{notifications.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">Unread Critical Pings</span>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {notifications.filter((n) => n.unread).length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400">System Health Alerts</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">100% Resolved</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['ALL', 'UNREAD', 'REQUESTS', 'SYSTEM', 'SECURITY'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
              filter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-[#0D1527] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.unread
                ? 'bg-[#0E172F] border-blue-500/30 shadow-lg shadow-blue-950/20'
                : 'bg-[#0D1527] border-slate-800/80 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              {/* Status dot / category icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-400'
                    : item.severity === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {item.category === 'SECURITY' ? (
                  <Shield className="w-4 h-4" />
                ) : item.category === 'SYSTEM' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Layers className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-slate-800 text-slate-300">
                    {item.category}
                  </span>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                <span className="text-[10px] text-slate-500 mt-1.5 block">{item.time}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => toggleRead(item.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                {item.unread ? 'Mark Read' : 'Mark Unread'}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
