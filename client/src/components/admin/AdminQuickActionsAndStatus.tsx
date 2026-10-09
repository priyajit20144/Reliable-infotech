import React from 'react';
import {
  Plus,
  Users,
  FileText,
  Mail,
  Activity,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface AdminQuickActionsAndStatusProps {
  onAddNewProject: () => void;
  onManageUsers: () => void;
  onViewRequests: () => void;
  onContactClients: () => void;
  onViewStatusDetails?: () => void;
}

export const AdminQuickActionsAndStatus: React.FC<AdminQuickActionsAndStatusProps> = ({
  onAddNewProject,
  onManageUsers,
  onViewRequests,
  onContactClients,
  onViewStatusDetails,
}) => {
  const systemServices = [
    { name: 'Database', status: 'Online', latency: '12ms' },
    { name: 'Server', status: 'Online', latency: '99.9%' },
    { name: 'Storage', status: 'Online', latency: '42% used' },
    { name: 'API', status: 'Online', latency: '24ms' },
  ];

  return (
    <div className="h-full rounded-2xl bg-[#0D1527] border border-slate-800/80 p-5 flex flex-col justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 h-full">
        {/* Left column: Quick Actions */}
        <div className="flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-slate-800/60 pb-4 sm:pb-0 sm:pr-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Quick Actions
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Add New Project */}
              <button
                onClick={onAddNewProject}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition-all active:scale-95 text-left"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">Add New Project</span>
              </button>

              {/* Manage Users */}
              <button
                onClick={onManageUsers}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white text-xs font-semibold transition-all active:scale-95 text-left"
              >
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">Manage Users</span>
              </button>

              {/* View Requests */}
              <button
                onClick={onViewRequests}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-950/60 hover:bg-teal-900/60 border border-teal-700/50 text-teal-200 text-xs font-semibold transition-all active:scale-95 text-left"
              >
                <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">View Requests</span>
              </button>

              {/* Contact Clients */}
              <button
                onClick={onContactClients}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white text-xs font-semibold transition-all active:scale-95 text-left"
              >
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Contact Clients</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: System Status */}
        <div className="flex flex-col justify-between sm:pl-2">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                System Status
              </h4>
              <button
                onClick={onViewStatusDetails}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                View Details
              </button>
            </div>

            <div className="space-y-2.5">
              {systemServices.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between text-xs py-0.5"
                >
                  <span className="text-slate-300 font-medium">{service.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                    <span className="text-emerald-400 font-bold text-[11px]">
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
