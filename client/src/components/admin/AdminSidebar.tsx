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
    <aside className="h-full w-full bg-[#121212] border-r border-[#262626] flex flex-col justify-between overflow-y-auto select-none p-3.5 scrollbar-thin scrollbar-thumb-[#262626]">
      {/* Top Section: Logo & Navigation */}
      <div className="space-y-4">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Link
            to="/"
            className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
            title="Return to Main Website"
          >
            {/* Logo Icon */}
            <img
              src="/reliable-symbol.png"
              alt="Reliable InfoTech Logo"
              className="w-9 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center">
                <span className="font-extrabold text-base text-[#EEEEEE] tracking-tight">Reliable</span>
                <span className="text-[#AAAAAA] font-normal text-base ml-1">InfoTech</span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">Console Admin</p>
            </div>
          </Link>

          {/* Close button on mobile if provided */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-none text-[#777777] hover:text-[#EEEEEE] hover:bg-[#181818] transition-colors"
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs sm:text-[13px] font-medium transition-all duration-200 group text-left ${
                  isActive
                    ? 'bg-[#EEEEEE] text-[#0B0B0B] font-bold shadow-md'
                    : 'text-[#999999] hover:text-[#EEEEEE] hover:bg-[#181818]'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#0B0B0B]' : 'text-[#777777] group-hover:text-[#CCCCCC]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#0B0B0B] text-[#EEEEEE]'
                        : 'bg-[#181818] text-[#888888] border border-[#262626] group-hover:text-[#CCCCCC]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Exit Links */}
          <div className="pt-3 mt-3 border-t border-[#262626] space-y-1">
            <Link
              to="/"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono text-[#888888] hover:text-[#EEEEEE] hover:bg-[#181818] transition-all group"
            >
              <ArrowLeft className="w-4 h-4 text-[#888888] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Main Site</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Sidebar Card */}
      <div className="pt-6 pb-2">
        <div className="nf-frame relative bg-[#181818] border border-[#262626] p-3.5 text-center group">
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />

          <div className="relative z-10 w-8 h-8 bg-[#0B0B0B] border border-[#262626] p-1 mx-auto mb-2 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-[#CCCCCC]" />
          </div>

          <h4 className="relative z-10 text-xs font-bold text-[#EEEEEE] tracking-tight leading-snug">
            Reliable InfoTech
          </h4>
          <p className="relative z-10 text-[10px] font-mono text-[#777777] mt-1 leading-relaxed">
            Enterprise SaaS Suite
          </p>
        </div>
      </div>
    </aside>
  );
};
