import React from 'react';
import { X, CheckCircle2, Server, Database, HardDrive, Cpu, Radio } from 'lucide-react';

interface AdminSystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSystemStatusModal: React.FC<AdminSystemStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const metrics = [
    {
      title: 'Database Cluster (MongoDB)',
      status: 'Healthy',
      details: 'Connections: 42 / 100 • Latency: 12ms • Replication: Active',
      icon: Database,
    },
    {
      title: 'MongoDB AI Model APIs (Voyage AI)',
      status: 'Connected',
      details: 'Gateway: ai.mongodb.com • Models: voyage-3, rerank-2 • Vector Search: Ready',
      icon: Cpu,
    },
    {
      title: 'Node.js API Services',
      status: 'Healthy',
      details: 'Memory: 182 MB • CPU: 4.2% • Uptime: 99.98%',
      icon: Server,
    },
    {
      title: 'Distributed Storage & CDN',
      status: 'Healthy',
      details: 'Object Store: 28.4 GB / 100 GB • Cache Hit Rate: 94.6%',
      icon: HardDrive,
    },
    {
      title: 'Real-time WebSocket Gateway',
      status: 'Healthy',
      details: 'Active Channels: 16 • Average Ping: 18ms',
      icon: Radio,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              System Infrastructure Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-3.5">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {m.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {m.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
