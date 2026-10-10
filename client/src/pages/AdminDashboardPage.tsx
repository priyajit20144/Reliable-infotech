import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  FolderGit2,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  X,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Calendar,
  Sparkles,
  AlertCircle,
  FileText,
  UserCheck,
  Layers,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { projectService } from '../services/projectService';
import { CustomRequest, User, ProjectInquiry, Project, CustomRequestStatus } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Skeleton } from '../components/common/Skeleton';

// New High-Fidelity Admin Dashboard Components
import { AdminWelcomeBanner } from '../components/admin/AdminWelcomeBanner';
import { AdminKpiCards } from '../components/admin/AdminKpiCards';
import { AdminProjectAnalyticsChart } from '../components/admin/AdminProjectAnalyticsChart';
import { AdminRequestTypesDonut } from '../components/admin/AdminRequestTypesDonut';
import { AdminRecentActivity } from '../components/admin/AdminRecentActivity';
import { AdminRecentRequestsTable, RequestRowItem } from '../components/admin/AdminRecentRequestsTable';
import { AdminTopProjects } from '../components/admin/AdminTopProjects';
import { AdminTeamMembers } from '../components/admin/AdminTeamMembers';
import { AdminQuickActionsAndStatus } from '../components/admin/AdminQuickActionsAndStatus';
import { AdminBuildCtaCard } from '../components/admin/AdminBuildCtaCard';
import { AdminRequestModal } from '../components/admin/AdminRequestModal';
import { AdminSystemStatusModal } from '../components/admin/AdminSystemStatusModal';
import { AdminDeleteProjectModal } from '../components/admin/AdminDeleteProjectModal';

// Dedicated Sub-views for All Sidebar Options
import { AdminClientsView } from '../components/admin/AdminClientsView';
import { AdminMessagesView } from '../components/admin/AdminMessagesView';
import { AdminTeamView } from '../components/admin/AdminTeamView';
import { AdminTestimonialsView } from '../components/admin/AdminTestimonialsView';
import { AdminContactMessagesView } from '../components/admin/AdminContactMessagesView';
import { AdminNotificationsView } from '../components/admin/AdminNotificationsView';
import { AdminSettingsView } from '../components/admin/AdminSettingsView';

export const AdminDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'dashboard';

  const [activeTab, setActiveTab] = useState<string>(
    [
      'dashboard',
      'requests',
      'inquiries',
      'users',
      'projects',
      'clients',
      'team',
      'messages',
      'testimonials',
      'contact_messages',
      'notifications',
      'settings',
    ].includes(initialTab)
      ? initialTab
      : 'dashboard'
  );

  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search for requests
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [viewingRequest, setViewingRequest] = useState<CustomRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [newStatus, setNewStatus] = useState<string>('IN_DEVELOPMENT');
  const [statusNote, setStatusNote] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New High-Fidelity Modals State
  const [selectedRowRequest, setSelectedRowRequest] = useState<RequestRowItem | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [systemStatusModalOpen, setSystemStatusModalOpen] = useState(false);

  // Project modal
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Cloud / DevOps');
  const [projShortDesc, setProjShortDesc] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('React, TypeScript, Node.js, Tailwind CSS');
  const [projPrice, setProjPrice] = useState(3500);
  const [projDemoUrl, setProjDemoUrl] = useState('');
  const [projGithubUrl, setProjGithubUrl] = useState('');
  const [creatingProj, setCreatingProj] = useState(false);

  // Showcase project deletion & filter state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  // Sync tab with URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'dashboard';
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab });
    }
  };

  const handleSaveModalStatus = async (
    reqId: string,
    updatedStatus: string,
    note: string,
    leadAssigned: string
  ) => {
    try {
      await adminService.updateRequestStatus(reqId, updatedStatus, note);
      if (leadAssigned) {
        await adminService.assignRequestTeam(reqId, leadAssigned);
      }
      setRequests((prev) =>
        prev.map((r) =>
          r._id === reqId || r._id === selectedRowRequest?.originalRequest?._id
            ? { ...r, status: updatedStatus as any, assignedTo: leadAssigned || r.assignedTo }
            : r
        )
      );
      await fetchAdminData(true);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const fetchAdminData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const results = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getAllRequests(),
        adminService.getAllUsers(),
        adminService.getAllInquiries(),
        projectService.getProjects(),
      ]);

      if (results[0].status === 'fulfilled' && results[0].value?.success) {
        setStats(results[0].value.stats);
      }
      if (results[1].status === 'fulfilled' && results[1].value?.success) {
        setRequests(results[1].value.data || []);
      }
      if (results[2].status === 'fulfilled' && results[2].value?.success) {
        setUsers(results[2].value.data || []);
      }
      if (results[3].status === 'fulfilled' && results[3].value?.success) {
        setInquiries(results[3].value.data || []);
      }
      if (results[4].status === 'fulfilled' && results[4].value?.success) {
        setProjects(results[4].value.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();

    // Listen to real-time showcase project updates across tabs and components
    const handleSync = () => fetchAdminData(true);
    window.addEventListener('devcraft_projects_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('devcraft_projects_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.businessName?.toLowerCase().includes(q) ||
        r.websiteType?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, searchQuery, statusFilter, priorityFilter]);

  // Request status updater
  const handleUpdateStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetReq = selectedRequest || viewingRequest;
    if (!targetReq) return;

    try {
      setUpdating(true);
      await adminService.updateRequestStatus(targetReq._id, newStatus, statusNote);
      if (assignedTo && assignedTo !== targetReq.assignedTo) {
        await adminService.assignRequestTeam(targetReq._id, assignedTo);
      }

      // Update in local state immediately for snappy response
      setRequests((prev) =>
        prev.map((r) =>
          r._id === targetReq._id
            ? { ...r, status: newStatus as any, assignedTo: assignedTo || r.assignedTo }
            : r
        )
      );

      if (viewingRequest && viewingRequest._id === targetReq._id) {
        setViewingRequest({
          ...viewingRequest,
          status: newStatus as any,
          assignedTo: assignedTo || viewingRequest.assignedTo,
        });
      }

      setSelectedRequest(null);
      setStatusNote('');
      await fetchAdminData(true);
    } catch (err: any) {
      alert(err.message || 'Error updating request');
    } finally {
      setUpdating(false);
    }
  };

  // Delete request
  const handleDeleteRequest = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the website request from "${name}"?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await adminService.deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      if (viewingRequest?._id === id) setViewingRequest(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete request');
    } finally {
      setDeletingId(null);
    }
  };

  // Create showcase project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingProj(true);
      const technologies = projTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await adminService.createProject({
        title: projTitle,
        category: projCategory,
        shortDescription: projShortDesc,
        description: projDesc,
        technologies,
        price: projPrice,
        demoUrl: projDemoUrl || '',
        githubUrl: projGithubUrl || '',
        images: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        ],
        thumbnail:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        features: ['Production Architecture', 'High Availability SLA', 'Database Indexing'],
      });

      if (res.success && res.data) {
        setProjects((prev) => [res.data, ...prev]);
        setCreateProjectModal(false);
        setProjTitle('');
        setProjShortDesc('');
        setProjDesc('');
        setProjDemoUrl('');
        setProjGithubUrl('');
        window.dispatchEvent(new Event('devcraft_projects_updated'));
        localStorage.setItem('devcraft_last_project_update', Date.now().toString());
        await fetchAdminData(true);
      }
    } catch (err: any) {
      alert(err.message || 'Error creating project');
    } finally {
      setCreatingProj(false);
    }
  };

  // Delete showcase project
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeletingProject(true);
      const targetId = projectToDelete._id || projectToDelete.slug;
      await adminService.deleteProject(targetId);

      // Instantly update local state
      setProjects((prev) =>
        prev.filter((p) => p._id !== projectToDelete._id && p.slug !== projectToDelete.slug)
      );

      if (stats) {
        setStats((prevStats: any) => ({
          ...prevStats,
          totalProjects: Math.max(0, (prevStats?.totalProjects || 1) - 1),
        }));
      }

      // Notify home page, catalog, and other tabs in real-time
      window.dispatchEvent(new Event('devcraft_projects_updated'));
      localStorage.setItem('devcraft_last_project_update', Date.now().toString());

      showToast(`Showcase project "${projectToDelete.title}" deleted successfully.`);
      setProjectToDelete(null);

      await fetchAdminData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to delete showcase project');
    } finally {
      setIsDeletingProject(false);
    }
  };

  const projectCategories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['ALL', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = projectSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.technologies?.some((t) => t.toLowerCase().includes(q));

      const matchesCat =
        projectCategoryFilter === 'ALL' ||
        p.category?.toLowerCase() === projectCategoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [projects, projectSearchQuery, projectCategoryFilter]);

  // Status Badge Helper
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
      case 'APPROVED':
        return <Badge variant="emerald" size="sm">Approved</Badge>;
      case 'TESTING':
        return <Badge variant="sky" size="sm">Testing</Badge>;
      case 'COMPLETED':
      case 'DELIVERED':
        return <Badge variant="emerald" size="sm">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="gray" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">URGENT</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">HIGH</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">LOW</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">MEDIUM</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0 p-4 sm:p-6">
        <Skeleton className="h-28 rounded-3xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  const newRequestsCount = requests.filter((r) => r.status === 'NEW').length;
  const inDevCount = requests.filter((r) => r.status === 'IN_DEVELOPMENT').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full min-w-0 pb-12">
      {/* ========================================================================= */}
      {/* 1. MASTER DASHBOARD OVERVIEW (PIXEL-PERFECT AS GIVEN IN SCREENSHOT)       */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          {/* Top Welcome Banner */}
          <AdminWelcomeBanner />

          {/* 5 KPI Metric Cards Row */}
          <AdminKpiCards stats={stats} />

          {/* Middle Row (3 Cards): Project Analytics, Request Types Donut, Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5">
            <div className="col-span-1 md:col-span-1 xl:col-span-5" id="project-analytics-card">
              <AdminProjectAnalyticsChart />
            </div>
            <div className="col-span-1 md:col-span-1 xl:col-span-4">
              <AdminRequestTypesDonut />
            </div>
            <div className="col-span-1 md:col-span-2 xl:col-span-3">
              <AdminRecentActivity onViewAll={() => handleTabChange('notifications')} />
            </div>
          </div>

          {/* Lower Row (2 Cards): Recent Requests Table (Left) + Top Performing Projects (Right) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5">
            <div className="col-span-1 xl:col-span-7">
              <AdminRecentRequestsTable
                requests={requests}
                onViewRequest={(req) => {
                  setSelectedRowRequest(req);
                  setRequestModalOpen(true);
                }}
                onViewAll={() => handleTabChange('requests')}
              />
            </div>
            <div className="col-span-1 xl:col-span-5">
              <AdminTopProjects
                projects={projects}
                onViewAll={() => handleTabChange('projects')}
                onSelectProject={() => handleTabChange('projects')}
              />
            </div>
          </div>

          {/* Bottom Row (3 Cards): Team Members, Quick Actions & Status, Build CTA Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5">
            <div className="col-span-1 md:col-span-1 xl:col-span-4">
              <AdminTeamMembers onViewAll={() => handleTabChange('team')} />
            </div>
            <div className="col-span-1 md:col-span-1 xl:col-span-5">
              <AdminQuickActionsAndStatus
                onAddNewProject={() => setCreateProjectModal(true)}
                onManageUsers={() => handleTabChange('users')}
                onViewRequests={() => handleTabChange('requests')}
                onContactClients={() => handleTabChange('clients')}
                onViewStatusDetails={() => setSystemStatusModalOpen(true)}
              />
            </div>
            <div className="col-span-1 md:col-span-2 xl:col-span-3">
              <AdminBuildCtaCard
                onViewAnalytics={() => {
                  document
                    .getElementById('project-analytics-card')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sub-tabs header with "Back to Dashboard" when navigating details */}
      {activeTab !== 'dashboard' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabChange('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <h2 className="text-lg sm:text-xl font-extrabold text-white capitalize">
              {activeTab === 'requests'
                ? 'All Website Requests'
                : activeTab === 'inquiries'
                ? 'Project Inquiries'
                : activeTab === 'projects'
                ? 'Showcase Catalog'
                : activeTab === 'users'
                ? 'Platform User Directory'
                : activeTab === 'clients'
                ? 'Corporate Clients Directory'
                : activeTab === 'messages'
                ? 'Direct Client Messages'
                : activeTab === 'team'
                ? 'Core Engineering Team'
                : activeTab === 'testimonials'
                ? 'Client Reviews Showcase'
                : activeTab === 'contact_messages'
                ? 'Inbound Contact Submissions'
                : activeTab === 'notifications'
                ? 'Notification Center'
                : activeTab === 'settings'
                ? 'Platform & System Settings'
                : activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {[
              { id: 'requests', label: `Requests (${requests.length})` },
              { id: 'inquiries', label: `Inquiries (${inquiries.length})` },
              { id: 'projects', label: `Showcase (${projects.length})` },
              { id: 'users', label: `Users (${users.length})` },
              { id: 'clients', label: 'Clients' },
              { id: 'messages', label: 'Messages' },
              { id: 'team', label: 'Team' },
              { id: 'testimonials', label: 'Reviews' },
              { id: 'contact_messages', label: 'Contact' },
              { id: 'notifications', label: 'Alerts' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: WEBSITE REQUESTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <Card className="p-4 sm:p-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by client name, email, business name, or archetype..."
                  className="w-full bg-[#111827] text-white text-xs sm:text-sm rounded-xl border border-white/10 pl-9 pr-8 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status and Priority Filters */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#111827] text-white text-xs rounded-xl border border-white/10 px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="REQUIREMENTS">REQUIREMENTS</option>
                  <option value="QUOTATION">QUOTATION</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="IN_DEVELOPMENT">IN_DEVELOPMENT</option>
                  <option value="TESTING">TESTING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-[#111827] text-white text-xs rounded-xl border border-white/10 px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>

                {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setPriorityFilter('ALL');
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Quick status filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-3 border-t border-white/5 scrollbar-none text-xs">
              <span className="text-gray-400 font-medium shrink-0 mr-1">Quick:</span>
              {[
                { label: 'All', value: 'ALL', count: requests.length },
                { label: 'New', value: 'NEW', count: requests.filter((r) => r.status === 'NEW').length },
                { label: 'Under Review', value: 'UNDER_REVIEW', count: requests.filter((r) => r.status === 'UNDER_REVIEW').length },
                { label: 'In Dev', value: 'IN_DEVELOPMENT', count: requests.filter((r) => r.status === 'IN_DEVELOPMENT').length },
                { label: 'Delivered', value: 'DELIVERED', count: requests.filter((r) => r.status === 'DELIVERED' || r.status === 'COMPLETED').length },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setStatusFilter(pill.value)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === pill.value
                      ? 'bg-indigo-500/25 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-gray-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({pill.count})</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Results count & feedback */}
          <div className="flex items-center justify-between px-1 text-xs text-gray-400">
            <span>
              Showing <strong>{filteredRequests.length}</strong> of {requests.length} client website requests
            </span>
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Click any request to view complete functional requirements & client specifications
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <Card className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No website requests found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                {requests.length === 0
                  ? 'No clients have submitted website requests yet. Any request submitted from the public builder or client portal will show up right here in real-time.'
                  : 'No requests matched the current search or status filter criteria. Try clearing the filter.'}
              </p>
              {requests.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setPriorityFilter('ALL');
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </Card>
          ) : (
            <>
              {/* RESPONSIVE VIEW 1: Mobile & Tablet Card List (< lg) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3.5">
                {filteredRequests.map((r) => (
                  <Card
                    key={r._id}
                    className="p-4 sm:p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Client & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {r.businessName || r.websiteType}
                          </h4>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {r.name} · <span className="text-gray-400">{r.email}</span>
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5">
                          {getStatusBadge(r.status)}
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-gray-300">
                          <span className="text-gray-400 text-[11px]">Archetype:</span>
                          <span className="font-semibold text-white">{r.websiteType}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-300">
                          <span className="text-gray-400 text-[11px]">Budget Scope:</span>
                          <span className="font-mono font-bold text-emerald-400">
                            ${r.budgetMin} – ${r.budgetMax}
                          </span>
                        </div>
                        {r.deadline && (
                          <div className="flex items-center justify-between text-gray-300">
                            <span className="text-gray-400 text-[11px]">Target Launch:</span>
                            <span className="font-mono text-gray-200">{r.deadline}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-gray-300">
                          <span className="text-gray-400 text-[11px]">Priority:</span>
                          <span>{getPriorityBadge(r.priority || 'MEDIUM')}</span>
                        </div>
                      </div>

                      {/* Description excerpt */}
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {r.description}
                      </p>

                      {/* Required Features snippet */}
                      {r.requiredFeatures && r.requiredFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.requiredFeatures.slice(0, 3).map((feat, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-gray-300 border border-white/5"
                            >
                              {feat}
                            </span>
                          ))}
                          {r.requiredFeatures.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-white/5 text-gray-400">
                              +{r.requiredFeatures.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setViewingRequest(r)}
                      >
                        <span>Full Specs</span>
                      </Button>

                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedRequest(r);
                            setNewStatus(r.status);
                            setAssignedTo(r.assignedTo || 'Reliable Info Tech Core Team');
                          }}
                        >
                          <span>Manage</span>
                        </Button>
                        <button
                          onClick={() => handleDeleteRequest(r._id, r.name)}
                          disabled={deletingId === r._id}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* RESPONSIVE VIEW 2: Desktop High-Density Table (>= lg) */}
              <div className="hidden lg:block">
                <Card className="p-0 overflow-hidden border border-white/10 shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.03] text-gray-400 uppercase font-mono border-b border-white/10">
                        <tr>
                          <th className="p-4 pl-5">Client Profile</th>
                          <th className="p-4">Business / Archetype</th>
                          <th className="p-4">Budget Range</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Priority</th>
                          <th className="p-4">Assigned Team</th>
                          <th className="p-4">Received</th>
                          <th className="p-4 pr-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredRequests.map((r) => (
                          <tr
                            key={r._id}
                            className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            onClick={() => setViewingRequest(r)}
                          >
                            <td className="p-4 pl-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                  {r.name?.charAt(0) || 'C'}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    {r.name}
                                  </p>
                                  <p className="text-[11px] text-gray-400 truncate max-w-[150px]">
                                    {r.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <p className="font-semibold text-gray-200">
                                {r.businessName || r.websiteType}
                              </p>
                              <span className="text-[11px] text-gray-400">{r.websiteType}</span>
                            </td>

                            <td className="p-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                              ${r.budgetMin?.toLocaleString()} – ${r.budgetMax?.toLocaleString()}
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              {getStatusBadge(r.status)}
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              {getPriorityBadge(r.priority || 'MEDIUM')}
                            </td>

                            <td className="p-4 text-gray-300">
                              <span className="line-clamp-1">{r.assignedTo || 'Unassigned'}</span>
                            </td>

                            <td className="p-4 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                              {r.createdAt
                                ? new Date(r.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </td>

                            <td
                              className="p-4 pr-5 text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setViewingRequest(r)}
                                >
                                  <span>View Specs</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => {
                                    setSelectedRequest(r);
                                    setNewStatus(r.status);
                                    setAssignedTo(r.assignedTo || 'Reliable Info Tech Core Team');
                                  }}
                                >
                                  <span>Manage</span>
                                </Button>
                                <button
                                  onClick={() => handleDeleteRequest(r._id, r.name)}
                                  disabled={deletingId === r._id}
                                  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  title="Delete Request"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INQUIRIES MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'inquiries' && (
        <Card className="p-0 overflow-hidden border border-white/10">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Catalog Acquisition Inquiries</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Questions and purchase requests submitted by visitors on showcase catalog items
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400">Total: {inquiries.length}</span>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No showcase inquiries yet.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card List (sm:hidden) */}
              <div className="p-3.5 space-y-3 sm:hidden divide-y divide-white/5">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-xs text-white truncate">{inq.name}</p>
                      <span className="font-mono text-[10px] text-gray-400">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-indigo-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{inq.email}</span>
                      </a>
                      <span className="text-gray-500">•</span>
                      <span className="font-mono text-indigo-300 text-[10px]">{inq.projectId}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      {inq.message}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop & Tablet Table (hidden sm:block) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-white/[0.03] text-gray-400 uppercase font-mono border-b border-white/10">
                    <tr>
                      <th className="p-4 pl-5">Client Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Referenced Project</th>
                      <th className="p-4">Message</th>
                      <th className="p-4 pr-5 text-right">Received Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-white/[0.02]">
                        <td className="p-4 pl-5 font-bold text-white">{inq.name}</td>
                        <td className="p-4">
                          <a
                            href={`mailto:${inq.email}`}
                            className="text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{inq.email}</span>
                          </a>
                        </td>
                        <td className="p-4 font-mono text-indigo-300 font-semibold">{inq.projectId}</td>
                        <td className="p-4 text-gray-300 max-w-md leading-relaxed">{inq.message}</td>
                        <td className="p-4 pr-5 text-right text-gray-400 font-mono text-[11px]">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SHOWCASE PROJECTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white">Live Showcase Portfolio Catalog</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {projects.length} Total
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage demo websites, tech stacks, acquisition pricing, and delete showcase builds
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setCreateProjectModal(true)}
            >
              <span>Add Showcase</span>
            </Button>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0D1527] border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search showcase by title, stack, or category..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
              {projectSearchQuery && (
                <button
                  type="button"
                  onClick={() => setProjectSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setProjectCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    projectCategoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat === 'ALL' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-gray-400 mb-3">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">No Showcase Projects Found</h4>
              <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
                {projectSearchQuery || projectCategoryFilter !== 'ALL'
                  ? 'No projects matched your search criteria. Try resetting your search filters.'
                  : 'There are currently no projects in the live showcase catalog.'}
              </p>
              {projectSearchQuery || projectCategoryFilter !== 'ALL' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setProjectSearchQuery('');
                    setProjectCategoryFilter('ALL');
                  }}
                >
                  Reset Filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setCreateProjectModal(true)}
                >
                  Add Showcase
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProjects.map((proj) => {
                const isTargetDeleting =
                  isDeletingProject &&
                  (projectToDelete?._id === proj._id ||
                    (proj.slug && projectToDelete?.slug === proj.slug));

                return (
                  <Card
                    key={proj._id || proj.slug}
                    className={`p-0 overflow-hidden flex flex-col justify-between group hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-950/20 transition-all duration-300 relative bg-[#0F172A]/90 ${
                      isTargetDeleting ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div>
                      {/* Thumbnail Header */}
                      <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                        <img
                          src={
                            proj.thumbnail ||
                            proj.images?.[0] ||
                            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/30 pointer-events-none" />

                        {/* Top-Right Price & Badges */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {proj.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                              Featured
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/85 text-emerald-400 border border-emerald-500/30 backdrop-blur-md font-mono shadow-sm">
                            ${proj.price?.toLocaleString()}
                          </span>
                        </div>

                        {/* Category Badge on Bottom-Left */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/80 text-gray-200 border border-white/10 backdrop-blur-md shadow-sm">
                            {proj.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {proj.shortDescription || proj.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies?.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-gray-300 border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2 bg-[#0B1222]/40">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] text-gray-400 font-mono">
                          <strong className="text-emerald-400 font-medium">{proj.status}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 pt-1">
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="View Live Demo"
                            aria-label={`View live demo of ${proj.title}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          to={`/projects/${proj.slug || proj._id}`}
                          className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-white/10 transition-colors"
                          title="Inspect Public View"
                          aria-label={`Inspect ${proj.title} public page`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(proj)}
                          className="p-1.5 sm:p-2 rounded-xl text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all group/del"
                          title="Delete Showcase Project"
                          aria-label={`Delete ${proj.title}`}
                        >
                          <Trash2 className="w-4 h-4 text-rose-400 group-hover/del:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: USERS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <Card className="p-0 overflow-hidden border border-white/10">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Platform User Directory</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                All registered client profiles, team accounts, and system administrators
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400">Total: {users.length}</span>
          </div>

          {/* Mobile User Card List (sm:hidden) */}
          <div className="p-3.5 space-y-3 sm:hidden divide-y divide-white/5">
            {users.map((u) => (
              <div key={u.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate">{u.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono truncate">{u.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={u.role === 'ADMIN' ? 'purple' : u.role === 'TEAM_MEMBER' ? 'sky' : 'gray'}
                    size="sm"
                  >
                    {u.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pl-10">
                  <span>Phone: {u.phone || '—'}</span>
                  <span className="font-mono text-[10px] text-gray-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table (hidden sm:block) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead className="bg-white/[0.03] text-gray-400 uppercase font-mono border-b border-white/10">
                <tr>
                  <th className="p-4 pl-5">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 pr-5 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-mono">{u.email}</td>
                    <td className="p-4 text-gray-400">{u.phone || '—'}</td>
                    <td className="p-4">
                      <Badge
                        variant={u.role === 'ADMIN' ? 'purple' : u.role === 'TEAM_MEMBER' ? 'sky' : 'gray'}
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4 pr-5 text-right text-gray-400 font-mono text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CORPORATE CLIENTS DIRECTORY                                        */}
      {/* ========================================================================= */}
      {activeTab === 'clients' && <AdminClientsView users={users} />}

      {/* ========================================================================= */}
      {/* TAB 6: MESSAGES & SPRINT CONVERSATIONS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'messages' && <AdminMessagesView />}

      {/* ========================================================================= */}
      {/* TAB 7: CORE ENGINEERING & DESIGN TEAM                                     */}
      {/* ========================================================================= */}
      {activeTab === 'team' && <AdminTeamView />}

      {/* ========================================================================= */}
      {/* TAB 8: CLIENT TESTIMONIALS & REVIEWS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'testimonials' && <AdminTestimonialsView />}

      {/* ========================================================================= */}
      {/* TAB 9: INBOUND CONTACT MESSAGES                                           */}
      {/* ========================================================================= */}
      {activeTab === 'contact_messages' && <AdminContactMessagesView />}

      {/* ========================================================================= */}
      {/* TAB 10: NOTIFICATION CENTER                                               */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && <AdminNotificationsView />}

      {/* ========================================================================= */}
      {/* TAB 11: PLATFORM & SYSTEM SETTINGS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && <AdminSettingsView />}

      {/* ========================================================================= */}
      {/* MODAL 1: COMPLETE FUNCTIONAL SPECIFICATIONS & REQUEST DETAILS */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(viewingRequest)}
        onClose={() => setViewingRequest(null)}
        title="Custom Website Requirement Specifications"
      >
        {viewingRequest && (
          <div className="space-y-5 text-left text-xs">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider">
                  Request ID: {viewingRequest._id}
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {viewingRequest.businessName || viewingRequest.websiteType}
                </h3>
                <span className="text-xs text-gray-400">{viewingRequest.websiteType}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(viewingRequest.status)}
                {getPriorityBadge(viewingRequest.priority || 'MEDIUM')}
              </div>
            </div>

            {/* Client Profile */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Client Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-gray-400 text-[11px] block">Full Name:</span>
                  <span className="font-semibold text-white">{viewingRequest.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] block">Email:</span>
                  <a
                    href={`mailto:${viewingRequest.email}`}
                    className="font-mono text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{viewingRequest.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] block">Phone / WhatsApp:</span>
                  {viewingRequest.phone ? (
                    <a
                      href={`tel:${viewingRequest.phone}`}
                      className="font-mono text-gray-200 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{viewingRequest.phone}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] block">Preferred Contact Channel:</span>
                  <span className="font-bold text-amber-300">
                    {viewingRequest.contactMethod || 'EMAIL'}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Requirements Description */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Detailed Requirement Scope
              </h4>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-200 leading-relaxed whitespace-pre-line text-xs">
                {viewingRequest.description}
              </div>
            </div>

            {/* Required Features Tags */}
            {viewingRequest.requiredFeatures && viewingRequest.requiredFeatures.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Key Functional Features Requested
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewingRequest.requiredFeatures.map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold"
                    >
                      <Check className="w-3 h-3 text-indigo-400" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Budget & Timeline */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <span className="text-gray-400 text-[11px] block">Budget Range:</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm mt-0.5 block">
                  ${viewingRequest.budgetMin?.toLocaleString()} – ${viewingRequest.budgetMax?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Target Launch Deadline:</span>
                <span className="font-mono text-white text-sm mt-0.5 block">
                  {viewingRequest.deadline || 'Flexible timeline'}
                </span>
              </div>
            </div>

            {/* Reference URLs */}
            {viewingRequest.referenceUrls && viewingRequest.referenceUrls.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Inspiration & Reference URLs
                </h4>
                <div className="space-y-1">
                  {viewingRequest.referenceUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url.startsWith('http') ? url : `https://${url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="truncate">{url}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {viewingRequest.attachments && viewingRequest.attachments.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Client Attachments / Wireframes
                </h4>
                <div className="space-y-1">
                  {viewingRequest.attachments.map((file, i) => (
                    <a
                      key={i}
                      href={file}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 flex items-center gap-2 text-xs transition-colors"
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">{file}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions in Footer */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => handleDeleteRequest(viewingRequest._id, viewingRequest.name)}
              >
                <span>Delete</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setViewingRequest(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(viewingRequest);
                    setNewStatus(viewingRequest.status);
                    setAssignedTo(viewingRequest.assignedTo || 'Reliable Info Tech Core Team');
                  }}
                >
                  <span>Update Sprint Status</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: UPDATE REQUEST STATUS & ASSIGN SPRINT LEAD */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title={`Manage Sprint: ${selectedRequest?.businessName || selectedRequest?.websiteType}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Sprint Milestone Status *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-[#111827] text-white text-xs rounded-xl border border-white/10 px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="NEW">NEW — Newly Received</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW — Architect Assessing Scope</option>
              <option value="REQUIREMENTS">REQUIREMENTS — Gathering Details</option>
              <option value="QUOTATION">QUOTATION — Quotation Prepared</option>
              <option value="APPROVED">APPROVED — Client Approved & Funded</option>
              <option value="IN_DEVELOPMENT">IN_DEVELOPMENT — In Active Sprint</option>
              <option value="TESTING">TESTING — QA & User Acceptance</option>
              <option value="COMPLETED">COMPLETED — Ready to Launch</option>
              <option value="DELIVERED">DELIVERED — Successfully Handed Over</option>
              <option value="CANCELLED">CANCELLED — Cancelled</option>
            </select>
          </div>

          <Input
            label="Assigned Lead Engineer / Squad"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="e.g. Sarah Chen (Lead Architect) or Reliable Info Tech Core Team"
          />

          <Textarea
            label="Milestone Progress Note (Sent to Client)"
            rows={3}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Explain milestones achieved or upcoming deliverables..."
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="ghost" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={updating}>
              Save & Notify Client
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: ADD SHOWCASE PROJECT */}
      {/* ========================================================================= */}
      <Modal
        isOpen={createProjectModal}
        onClose={() => setCreateProjectModal(false)}
        title="Add Showcase Project to Public Catalog"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <Input
            label="Project Title *"
            required
            value={projTitle}
            onChange={(e) => setProjTitle(e.target.value)}
            placeholder="e.g. NexusFlow AI Distributed Telemetry"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Category *"
              required
              value={projCategory}
              onChange={(e) => setProjCategory(e.target.value)}
              placeholder="e.g. FinTech / Artificial Intelligence"
            />
            <Input
              label="Acquisition Price (USD)"
              type="number"
              value={projPrice}
              onChange={(e) => setProjPrice(Number(e.target.value))}
            />
          </div>

          <Input
            label="Short Summary *"
            required
            value={projShortDesc}
            onChange={(e) => setProjShortDesc(e.target.value)}
            placeholder="1-2 sentences highlighting core value"
          />

          <Textarea
            label="Detailed Architecture Description *"
            required
            rows={4}
            value={projDesc}
            onChange={(e) => setProjDesc(e.target.value)}
            placeholder="Deep dive into stack topology, performance benchmarks, and features..."
          />

          <Input
            label="Technologies (comma separated)"
            value={projTech}
            onChange={(e) => setProjTech(e.target.value)}
            placeholder="React, TypeScript, Go, PostgreSQL, Redis"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Live Demo URL (Optional)"
              value={projDemoUrl}
              onChange={(e) => setProjDemoUrl(e.target.value)}
              placeholder="https://demo.reliableinfotech.io/nexus"
            />
            <Input
              label="GitHub Repo URL (Optional)"
              value={projGithubUrl}
              onChange={(e) => setProjGithubUrl(e.target.value)}
              placeholder="https://github.com/reliable-infotech/nexus"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button type="button" variant="ghost" onClick={() => setCreateProjectModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={creatingProj}>
              Publish Showcase Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Request Details & Status Modal */}
      <AdminRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        request={selectedRowRequest}
        onSaveStatus={handleSaveModalStatus}
      />

      {/* System Infrastructure Diagnostics Modal */}
      <AdminSystemStatusModal
        isOpen={systemStatusModalOpen}
        onClose={() => setSystemStatusModalOpen(false)}
      />

      {/* Delete Showcase Project Modal */}
      <AdminDeleteProjectModal
        isOpen={!!projectToDelete}
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDeleteProject}
        isDeleting={isDeletingProject}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl shadow-emerald-600/40 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
