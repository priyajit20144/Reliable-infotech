import React from 'react';
import { Layers, Eye, ArrowRight } from 'lucide-react';
import { CustomRequest } from '../../types';

export interface RequestRowItem {
  id: string;
  type: string;
  client: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  date: string;
  originalRequest?: CustomRequest;
}

interface AdminRecentRequestsTableProps {
  requests?: CustomRequest[];
  onViewRequest: (req: RequestRowItem) => void;
  onViewAll?: () => void;
}

export const AdminRecentRequestsTable: React.FC<AdminRecentRequestsTableProps> = ({
  requests,
  onViewRequest,
  onViewAll,
}) => {
  // Default mock rows matching the exact image
  const defaultRows: RequestRowItem[] = [
    {
      id: '#REQ-001',
      type: 'Custom Website',
      client: 'Priya Sharma',
      status: 'Under Review',
      priority: 'High',
      date: 'Apr 28, 2025',
    },
    {
      id: '#REQ-002',
      type: 'Project Inquiry',
      client: 'Amit Verma',
      status: 'New',
      priority: 'Medium',
      date: 'Apr 28, 2025',
    },
    {
      id: '#REQ-003',
      type: 'Custom Website',
      client: 'Neha Singh',
      status: 'Requirements',
      priority: 'High',
      date: 'Apr 27, 2025',
    },
    {
      id: '#REQ-004',
      type: 'Existing Project',
      client: 'Rohit Kumar',
      status: 'Quoted',
      priority: 'Medium',
      date: 'Apr 27, 2025',
    },
    {
      id: '#REQ-005',
      type: 'Custom Website',
      client: 'Sneha Patel',
      status: 'In Development',
      priority: 'Low',
      date: 'Apr 26, 2025',
    },
  ];

  // If real requests array is passed, use it; only fallback to default mock rows if undefined
  const displayRows: RequestRowItem[] =
    Array.isArray(requests)
      ? requests.slice(0, 5).map((r, i) => {
          const formattedStatus =
            r.status === 'UNDER_REVIEW'
              ? 'Under Review'
              : r.status === 'IN_DEVELOPMENT'
              ? 'In Development'
              : r.status === 'NEW'
              ? 'New'
              : r.status === 'REQUIREMENTS'
              ? 'Requirements'
              : r.status === 'QUOTATION'
              ? 'Quoted'
              : r.status;

          const formattedPriority: 'High' | 'Medium' | 'Low' =
            r.priority === 'HIGH' || r.priority === 'URGENT'
              ? 'High'
              : r.priority === 'LOW'
              ? 'Low'
              : 'Medium';

          return {
            id: `#REQ-${String(i + 1).padStart(3, '0')}`,
            type: r.websiteType || 'Custom Website',
            client: r.name || 'Client',
            status: formattedStatus,
            priority: formattedPriority,
            date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            originalRequest: r,
          };
        })
      : defaultRows;

  // Status badge styling helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-950/90 text-blue-400 border border-blue-800/80 inline-block whitespace-nowrap">
            Under Review
          </span>
        );
      case 'New':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-950/90 text-sky-400 border border-sky-800/80 inline-block whitespace-nowrap">
            New
          </span>
        );
      case 'Requirements':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/90 text-amber-400 border border-amber-800/80 inline-block whitespace-nowrap">
            Requirements
          </span>
        );
      case 'Quoted':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 inline-block whitespace-nowrap">
            Quoted
          </span>
        );
      case 'In Development':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-950/90 text-purple-400 border border-purple-800/80 inline-block whitespace-nowrap">
            In Development
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 inline-block whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  // Priority badge styling helper
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800/60 inline-block">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60 inline-block">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-slate-400 border border-slate-700/60 inline-block">
            Low
          </span>
        );
    }
  };

  return (
    <div className="h-full rounded-2xl bg-[#0D1527] border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
            Recent Requests
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          View All
        </button>
      </div>

      {/* Empty State or Table Content */}
      {displayRows.length === 0 ? (
        <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-2.5">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-xs font-bold text-white">No Client Requests</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
            No recent inquiries found. Incoming project inquiries will automatically appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card List (sm:hidden) */}
          <div className="space-y-3 pt-3 sm:hidden">
            {displayRows.map((row) => (
              <div
                key={row.id}
                className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-slate-300">
                    {row.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {renderPriorityBadge(row.priority)}
                    {renderStatusBadge(row.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{row.type}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {row.client} · <span className="text-slate-400">{row.date}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => onViewRequest(row)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-blue-500 transition-all shadow-sm shrink-0"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / Tablet Responsive Table (hidden sm:block) */}
          <div className="hidden sm:block overflow-x-auto -mx-5 px-5 pt-2 pb-1 scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-slate-800/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 pr-3">ID</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Client</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 pl-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-xs">
            {displayRows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-800/30 transition-colors group"
              >
                {/* ID */}
                <td className="py-3 pr-3 font-mono font-medium text-slate-300">
                  {row.id}
                </td>

                {/* Type */}
                <td className="py-3 px-3 font-medium text-white truncate max-w-[150px]">
                  {row.type}
                </td>

                {/* Client */}
                <td className="py-3 px-3 text-slate-300 truncate max-w-[130px]">
                  {row.client}
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  {renderStatusBadge(row.status)}
                </td>

                {/* Priority */}
                <td className="py-3 px-3">
                  {renderPriorityBadge(row.priority)}
                </td>

                {/* Date */}
                <td className="py-3 px-3 text-slate-400 font-normal whitespace-nowrap">
                  {row.date}
                </td>

                {/* Action */}
                <td className="py-3 pl-3 text-right">
                  <button
                    onClick={() => onViewRequest(row)}
                    className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700/80 hover:border-blue-500 transition-all shadow-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}
</div>
  );
};
