import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  UserCheck,
  FileText,
  HelpCircle,
  Mail,
  Users2,
  Star,
  Send,
  Bell,
  Settings,
  Rocket,
  Code2,
  X,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export type AdminNavTab =
  | 'dashboard'
  | 'projects'
  | 'users'
  | 'clients'
  | 'requests'
  | 'inquiries'
  | 'messages'
  | 'team'
  | 'testimonials'
  | 'contact_messages'
  | 'notifications'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminNavTab;
  onSelectTab: (tab: AdminNavTab) => void;
  onCloseMobile?: () => void;
  counts?: {
    requests?: number;
    inquiries?: number;
    messages?: number;
    contactMessages?: number;
    notifications?: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onCloseMobile,
  counts = {
    requests: 12,
    inquiries: 8,
    messages: 5,
    contactMessages: 3,
    notifications: 5,
  },
}) => {
  const navItems = [
    { id: 'dashboard' as AdminNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as AdminNavTab, label: 'Projects', icon: FolderGit2 },
    { id: 'users' as AdminNavTab, label: 'Users', icon: Users },
    { id: 'clients' as AdminNavTab, label: 'Clients', icon: UserCheck },
    {
      id: 'requests' as AdminNavTab,
      label: 'Custom Requests',
      icon: FileText,
      badge: counts.requests ?? 12,
    },
    {
      id: 'inquiries' as AdminNavTab,
      label: 'Project Inquiries',
      icon: HelpCircle,
      badge: counts.inquiries ?? 8,
    },
    {
      id: 'messages' as AdminNavTab,
      label: 'Messages',
      icon: Mail,
      badge: counts.messages ?? 5,
    },
    { id: 'team' as AdminNavTab, label: 'Team', icon: Users2 },
    { id: 'testimonials' as AdminNavTab, label: 'Testimonials', icon: Star },
    {
      id: 'contact_messages' as AdminNavTab,
      label: 'Contact Messages',
      icon: Send,
      badge: counts.contactMessages ?? 3,
    },
    { id: 'notifications' as AdminNavTab, label: 'Notifications', icon: Bell },
    { id: 'settings' as AdminNavTab, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: AdminNavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="h-full w-full bg-[#0D1322] border-r border-slate-800/80 flex flex-col justify-between overflow-y-auto select-none p-3.5 scrollbar-thin scrollbar-thumb-slate-800">
      {/* Top Section: Logo & Navigation */}
      <div className="space-y-4">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Link
            to="/"
            className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
            title="Return to Main Website"
          >
            {/* Diamond Logo Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/25 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-white tracking-tight">DevCraft</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Admin Panel</p>
            </div>
          </Link>

          {/* Close button on mobile if provided */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Items List */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-600/30 text-indigo-300 group-hover:bg-indigo-600/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Exit Links */}
          <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-1">
            <Link
              to="/dashboard"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Client Workspace</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </Link>

            <Link
              to="/"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Main Site</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Sidebar Card: Build Amazing Digital Solutions */}
      <div className="pt-6 pb-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/70 via-blue-950/60 to-slate-900 border border-blue-500/20 p-4 text-center group shadow-xl">
          {/* Subtle curved background glow effect */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

          {/* Floating glowing rocket icon */}
          <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 mx-auto mb-3 shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0D1424] rounded-[10px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <h4 className="relative z-10 text-xs font-bold text-white tracking-tight leading-snug">
            Build Amazing
            <br />
            Digital Solutions
          </h4>
          <p className="relative z-10 text-[10px] text-slate-400 mt-1 leading-relaxed">
            Together we create
            <br />
            better tomorrow.
          </p>
        </div>
      </div>
    </aside>
  );
};
