import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { requestService } from '../services/requestService';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { CustomRequest } from '../types';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { KpiCards } from '../components/dashboard/KpiCards';
import { RecentRequests } from '../components/dashboard/RecentRequests';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';
import { RecentNotifications } from '../components/dashboard/RecentNotifications';
import { DashboardSkeleton } from '../components/common/Skeleton';

const DEFAULT_CLIENT_REQUESTS: CustomRequest[] = [
  {
    _id: 'req_102',
    userId: 'usr_client_1',
    name: 'Rahul Sharma',
    email: 'client@devcraft.io',
    phone: '+1 (555) 234-5678',
    businessName: 'NextGen Mobility',
    websiteType: 'E-Commerce Platform',
    description: 'High-performance e-commerce website for luxury electric vehicle charging accessories with multi-currency checkout.',
    requiredFeatures: ['Product Filters', 'Stripe Integration', 'Shipping Calculator', 'Customer Reviews'],
    budgetMin: 2000,
    budgetMax: 3500,
    deadline: '2026-12-15',
    referenceUrls: ['https://apple.com'],
    attachments: [],
    contactMethod: 'EMAIL',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    assignedTo: 'DevCraft Core Team',
    createdAt: '2026-03-04T08:15:00.000Z',
    updatedAt: '2026-03-04T08:15:00.000Z',
  },
  {
    _id: 'req_101',
    userId: 'usr_client_1',
    name: 'Rahul Sharma',
    email: 'client@devcraft.io',
    phone: '+1 (555) 234-5678',
    businessName: 'Horizon Creative Studio',
    websiteType: 'Custom SaaS Platform',
    description: 'We need an interactive digital showcase platform for our creative design studio featuring real-time client revision tracking, custom proposal approval workflows, and interactive project galleries.',
    requiredFeatures: ['Custom Portfolio Showcase', 'Client Dashboard', 'Invoicing & Milestone Payments', 'Dark Mode UI'],
    budgetMin: 3000,
    budgetMax: 5000,
    deadline: '2026-11-30',
    referenceUrls: ['https://linear.app', 'https://stripe.com'],
    attachments: [],
    contactMethod: 'EMAIL',
    status: 'IN_DEVELOPMENT',
    priority: 'HIGH',
    assignedTo: 'Sarah Chen (Lead Architect)',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-05T14:30:00.000Z',
  },
  {
    _id: 'req_103',
    userId: 'usr_client_1',
    name: 'Rahul Sharma',
    email: 'client@devcraft.io',
    phone: '+1 (555) 234-5678',
    businessName: 'Rahul Sharma Portfolio',
    websiteType: 'Personal Portfolio',
    description: 'Personal tech lead portfolio website with blog and GitHub repositories showcase.',
    requiredFeatures: ['Animated Hero', 'Responsive Layout', 'Contact Form', 'SEO Optimized'],
    budgetMin: 1000,
    budgetMax: 1800,
    deadline: '2026-09-30',
    referenceUrls: ['https://leerob.io'],
    attachments: [],
    contactMethod: 'EMAIL',
    status: 'COMPLETED',
    priority: 'LOW',
    assignedTo: 'Alex Rivera',
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-03-01T16:00:00.000Z',
  },
];

export const DashboardPage: React.FC = () => {
  const { isTeamMember, user } = useAuth();
  const [requests, setRequests] = useState<CustomRequest[]>(DEFAULT_CLIENT_REQUESTS);
  const [allClientRequests, setAllClientRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserDefaultRequests = (userName?: string, userEmail?: string): CustomRequest[] => {
    const name = userName || 'Rahul Sharma';
    const email = userEmail || 'client@devcraft.io';
    return [
      {
        ...DEFAULT_CLIENT_REQUESTS[0],
        name,
        email,
      },
      {
        ...DEFAULT_CLIENT_REQUESTS[1],
        name,
        email,
      },
      {
        ...DEFAULT_CLIENT_REQUESTS[2],
        name,
        email,
        businessName: `${name} Portfolio`,
      },
    ];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const promises: Promise<any>[] = [requestService.getMyRequests()];
        if (isTeamMember) {
          promises.push(adminService.getAllRequests());
        }

        const [myRes, adminRes] = await Promise.all(promises);
        if (myRes && myRes.success && Array.isArray(myRes.data)) {
          const sorted = [...myRes.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRequests(sorted);
        } else {
          setRequests([]);
        }
        if (adminRes && adminRes.success && adminRes.data) {
          setAllClientRequests(adminRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isTeamMember, user?.name, user?.email]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Active metrics based on role
  const sourceRequests = isTeamMember && allClientRequests.length > 0 ? allClientRequests : requests;

  const activeProjectsCount = sourceRequests.filter((r) =>
    ['APPROVED', 'IN_DEVELOPMENT', 'TESTING'].includes(r.status)
  ).length;

  const pendingRequestsCount = sourceRequests.filter((r) =>
    ['NEW', 'UNDER_REVIEW', 'REQUIREMENTS', 'QUOTATION'].includes(r.status)
  ).length;

  const completedProjectsCount = sourceRequests.filter((r) =>
    ['COMPLETED', 'DELIVERED'].includes(r.status)
  ).length;

  const stats = {
    totalRequests: sourceRequests.length,
    activeProjects: activeProjectsCount,
    pendingRequests: pendingRequestsCount,
    completedProjects: completedProjectsCount,
  };

  const newAdminRequestsCount = allClientRequests.filter((r) => r.status === 'NEW').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      {/* Admin Command Quick Access Notice Banner */}
      {isTeamMember && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Admin Access Active</span>
                {newAdminRequestsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    {newAdminRequestsCount} New Client Request{newAdminRequestsCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                You have {allClientRequests.length} total client website requests in the database.
              </p>
            </div>
          </div>

          <Link
            to="/admin?tab=requests"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shrink-0 shadow-md"
          >
            <span>Open Admin Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 1. Welcome Hero Banner */}
      <WelcomeBanner
        activeProjectsCount={activeProjectsCount}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* 2. 4 KPI Metrics */}
      <KpiCards stats={stats} />

      {/* 3. Middle Grid: Recent Requests (2 cols desktop) + Quick Actions (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          <RecentRequests
            requests={requests}
            allClientRequests={allClientRequests}
            isAdmin={isTeamMember}
          />
        </div>
        <div className="min-w-0">
          <QuickActions />
        </div>
      </div>

      {/* 4. Bottom Grid: Velocity Area Chart (2 cols desktop) + Recent Notifications (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          <AnalyticsChart />
        </div>
        <div className="min-w-0">
          <RecentNotifications />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
