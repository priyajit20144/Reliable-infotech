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
    { name: 'Server (WebSocket)', status: 'Online', latency: 'Live' },
    { name: 'Storage', status: 'Online', latency: '42% used' },
    { name: 'API Core', status: 'Online', latency: '24ms' },
  ];

  return (
    <div className="nf-frame relative h-full rounded-none bg-[#121212] border border-[#262626] p-4 sm:p-5 flex flex-col justify-between">
      {/* Corner Bracket Accents */}
      <span className="nf-c nf-c-tl" />
      <span className="nf-c nf-c-tr" />
      <span className="nf-c nf-c-bl" />
      <span className="nf-c nf-c-br" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 h-full relative z-10">
        {/* Left column: Quick Actions */}
        <div className="flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-[#262626] pb-4 sm:pb-0 sm:pr-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#777777]">Command</span>
              <h4 className="text-xs font-mono font-bold text-[#EEEEEE] uppercase tracking-wider">
                Quick Actions
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* Add New Project */}
              <button
                onClick={onAddNewProject}
                className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-[#EEEEEE] hover:bg-white text-[#0B0B0B] text-[11px] sm:text-xs font-bold transition-all active:scale-95 text-left"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Add Project</span>
              </button>

              {/* Manage Users */}
              <button
                onClick={onManageUsers}
                className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] text-[#CCCCCC] hover:text-white text-[11px] sm:text-xs font-medium transition-all active:scale-95 text-left"
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888] shrink-0" />
                <span className="truncate">Manage Users</span>
              </button>

              {/* View Requests */}
              <button
                onClick={onViewRequests}
                className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] text-[#CCCCCC] hover:text-white text-[11px] sm:text-xs font-medium transition-all active:scale-95 text-left"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888] shrink-0" />
                <span className="truncate">Requests</span>
              </button>

              {/* Contact Clients */}
              <button
                onClick={onContactClients}
                className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#262626] text-[#CCCCCC] hover:text-white text-[11px] sm:text-xs font-medium transition-all active:scale-95 text-left"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888] shrink-0" />
                <span className="truncate">Clients</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: System Status */}
        <div className="flex flex-col justify-between sm:pl-2">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#777777]">Telemetry</span>
                <h4 className="text-xs font-mono font-bold text-[#EEEEEE] uppercase tracking-wider">
                  System Status
                </h4>
              </div>
              <button
                onClick={onViewStatusDetails}
                className="text-[11px] font-mono text-[#AAAAAA] hover:text-white underline underline-offset-4 transition-colors"
              >
                Details
              </button>
            </div>

            <div className="space-y-2">
              {systemServices.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between text-xs py-1 px-2 bg-[#0B0B0B] border border-[#262626]/70"
                >
                  <span className="text-[#CCCCCC] font-mono text-[11px]">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#777777]">{service.latency}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#181818] border border-[#333333] text-[10px] font-mono text-[#CCCCCC]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
