import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { requestService } from '../services/requestService';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { CustomRequest, CustomRequestStatus } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';

export const MyRequestsPage: React.FC = () => {
  const { isTeamMember } = useAuth();
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [allClientRequests, setAllClientRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [scope, setScope] = useState<'my' | 'all'>('my');

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const promises: Promise<any>[] = [requestService.getMyRequests()];
        if (isTeamMember) {
          promises.push(adminService.getAllRequests());
        }

        const [myRes, allRes] = await Promise.all(promises);
        if (myRes.success && myRes.data) {
          setRequests(myRes.data);
        }
        if (allRes && allRes.success && allRes.data) {
          setAllClientRequests(allRes.data);
          // If the admin has no personal requests, default view to All Client Requests
          if (myRes.data.length === 0 && allRes.data.length > 0) {
            setScope('all');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [isTeamMember]);

  const activeList = isTeamMember && scope === 'all' ? allClientRequests : requests;

  const filteredRequests = activeList.filter((r) => {
    const matchesSearch =
      searchTerm === '' ||
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.websiteType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CustomRequestStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="purple" size="sm" dot>NEW</Badge>;
      case 'IN_DEVELOPMENT':
        return <Badge variant="sky" size="sm" dot>In Development</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="amber" size="sm" dot>Under Review</Badge>;
      case 'REQUIREMENTS':
        return <Badge variant="purple" size="sm">Requirements</Badge>;
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
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">
              {isTeamMember && scope === 'all'
                ? 'All Client Website Requests'
                : 'My Website Requests'}
            </h1>
            {isTeamMember && (
              <Badge variant="purple" size="sm">Admin Enabled</Badge>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {isTeamMember && scope === 'all'
              ? 'Reviewing all incoming website builds from client submissions across the platform'
              : 'Track sprint progression, quotation milestones, and development status'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isTeamMember && (
            <Link to="/admin?tab=requests">
              <Button
                variant="secondary"
                size="md"
                icon={<ShieldCheck className="w-4 h-4 text-amber-400" />}
              >
                <span>Admin Console</span>
              </Button>
            </Link>
          )}

          <Link to="/request">
            <Button variant="primary" size="md" icon={<PlusCircle className="w-4 h-4" />}>
              <span>New Request</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Scope Switcher Banner if Admin */}
      {isTeamMember && (
        <div className="nf-frame relative">
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />
          <div className="p-3.5 rounded bg-[#121212] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-[#4ADE80] shrink-0" />
              <span className="text-[#A1A1AA]">
                ADMIN SCOPE:
              </span>
              <div className="flex items-center p-0.5 rounded bg-[#181818] border border-[#262626] text-xs">
                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className={`px-3 py-1 rounded font-mono font-medium transition-colors cursor-pointer ${
                    scope === 'all'
                      ? 'bg-[#EEEEEE] text-[#0B0B0B]'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  All Clients ({allClientRequests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope('my')}
                  className={`px-3 py-1 rounded font-mono font-medium transition-colors cursor-pointer ${
                    scope === 'my'
                      ? 'bg-[#EEEEEE] text-[#0B0B0B]'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  My Own ({requests.length})
                </button>
              </div>
            </div>

            <Link
              to="/admin?tab=requests"
              className="text-xs text-[#EEEEEE] hover:underline font-mono inline-flex items-center gap-1"
            >
              <span>MANAGE STATUSES IN MASTER CONSOLE</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by archetype, client name, business, or keywords..."
            className="w-full bg-[#181818] text-xs text-white rounded border border-[#262626] pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#EEEEEE]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#71717A]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181818] text-xs text-white rounded border border-[#262626] px-3 py-2.5 focus:outline-none focus:border-[#EEEEEE] font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="REQUIREMENTS">Requirements</option>
            <option value="QUOTATION">Quotation</option>
            <option value="IN_DEVELOPMENT">In Development</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* List / Cards */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded" />
          <Skeleton className="h-28 rounded" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card brackets={true} className="text-center py-16">
          <p className="text-sm font-semibold text-white">No requests found</p>
          <p className="text-xs text-[#A1A1AA] mt-1 font-mono">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria.'
              : isTeamMember && scope === 'my'
              ? 'You have not submitted personal requests. Click "All Clients" above to see client submissions.'
              : 'You have not submitted any custom website requests yet.'}
          </p>
          <div className="flex justify-center gap-3 mt-4">
            {isTeamMember && scope === 'my' && allClientRequests.length > 0 && (
              <Button variant="secondary" size="sm" onClick={() => setScope('all')}>
                View All Client Requests ({allClientRequests.length})
              </Button>
            )}
            <Link to="/request">
              <Button variant="primary" size="sm">Submit a Request</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <Card
              key={req._id}
              brackets={true}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#EEEEEE]/30 transition-all"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base font-semibold text-white">
                    {req.businessName || req.websiteType}
                  </span>
                  {getStatusBadge(req.status)}
                  {scope === 'all' && isTeamMember && (
                    <span className="text-xs text-[#EEEEEE] font-mono">
                      (Client: {req.name})
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                  {req.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1A1AA] pt-1 font-mono">
                  <span className="flex items-center gap-1 font-mono text-[#4ADE80] font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    ${req.budgetMin} – ${req.budgetMax}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#EEEEEE]" />
                    Deadline: {req.deadline || 'Flexible'}
                  </span>
                  <span className="text-[#EEEEEE]">
                    Lead: {req.assignedTo || 'Core Team'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#262626]">
                {isTeamMember && (
                  <Link to="/admin?tab=requests">
                    <Button variant="secondary" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                      Manage Status
                    </Button>
                  </Link>
                )}
                <Link to={`/dashboard/requests/${req._id}`}>
                  <Button variant="primary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Track Timeline
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;
