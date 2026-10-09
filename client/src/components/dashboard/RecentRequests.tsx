import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { CustomRequest, CustomRequestStatus } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface RecentRequestsProps {
  requests: CustomRequest[];
  allClientRequests?: CustomRequest[];
  isAdmin?: boolean;
}

export const RecentRequests: React.FC<RecentRequestsProps> = ({
  requests,
  allClientRequests = [],
  isAdmin = false,
}) => {
  const [viewMode, setViewMode] = useState<'admin' | 'my'>(
    isAdmin && allClientRequests.length > 0 ? 'admin' : 'my'
  );

  const displayedRequests = viewMode === 'admin' ? allClientRequests : requests;

  const getStatusBadge = (status: CustomRequestStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="purple" size="sm" dot>NEW</Badge>;
      case 'IN_DEVELOPMENT':
        return <Badge variant="sky" size="sm" dot>In Progress</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="amber" size="sm" dot>Under Review</Badge>;
      case 'QUOTATION':
        return <Badge variant="purple" size="sm">Quotation</Badge>;
      case 'COMPLETED':
      case 'DELIVERED':
        return <Badge variant="emerald" size="sm">Completed</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/8 mb-4 gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Recent Website Requests</h3>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin View
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {viewMode === 'admin'
                ? 'All incoming client website requirements & quotes'
                : 'Track your personal website requirement milestones'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && allClientRequests.length > 0 && (
              <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('admin')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    viewMode === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All Clients ({allClientRequests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('my')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    viewMode === 'my'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  My Own ({requests.length})
                </button>
              </div>
            )}

            <Link
              to={viewMode === 'admin' ? '/admin?tab=requests' : '/dashboard/requests'}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors ml-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {displayedRequests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs text-gray-400">
              {viewMode === 'admin'
                ? 'No client website requests found in database.'
                : 'No active personal custom website requests found.'}
            </p>
            <Link
              to="/request"
              className="mt-3 inline-block text-xs font-semibold text-indigo-400 hover:underline"
            >
              Submit a new request
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedRequests.slice(0, 5).map((req) => (
              <div
                key={req._id}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {req.businessName || req.websiteType}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      · ${req.budgetMin}–${req.budgetMax}
                    </span>
                    {viewMode === 'admin' && (
                      <span className="text-[11px] text-amber-300 font-medium">
                        (Client: {req.name})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  {getStatusBadge(req.status)}
                  <Link
                    to={
                      viewMode === 'admin'
                        ? `/admin?tab=requests`
                        : `/dashboard/requests/${req._id}`
                    }
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={viewMode === 'admin' ? 'Manage in Admin Console' : 'View request timeline'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
        {isAdmin ? (
          <Link
            to="/admin?tab=requests"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Master Admin Console</span>
          </Link>
        ) : (
          <span className="text-[11px] text-gray-400">Fixed scope & custom quote</span>
        )}

        <Link
          to="/request"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          + Request New Website Project
        </Link>
      </div>
    </Card>
  );
};
