import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  GitPullRequest,
  MessageSquare,
  Bell,
  User,
  ShieldCheck,
  Rocket,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../common/Avatar';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout, isTeamMember } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Requests', path: '/dashboard/requests', icon: GitPullRequest },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare, badge: 3 },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <aside className="h-full w-full bg-[#121212] border-r border-[#262626] flex flex-col justify-between overflow-y-auto select-none p-4">
      {/* Top Branding */}
      <div className="space-y-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-2 py-1 group"
          onClick={onCloseMobile}
        >
          <img
            src="/reliable-symbol.png"
            alt="Reliable InfoTech Logo"
            className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center">
              <span className="font-sans font-medium text-base text-[#EEEEEE] tracking-tight">Reliable</span>
              <span className="font-serif italic text-base ml-1 text-white/90">InfoTech</span>
            </div>
            <p className="text-[10px] font-mono text-[#71717A] tracking-wider uppercase">Workspace · v2.0</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-mono tracking-wider text-[#71717A] uppercase mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#181818] text-[#EEEEEE] border border-[#262626] font-medium shadow-sm'
                      : 'text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818]/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0 text-[#A1A1AA]" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-[#EEEEEE] bg-[#262626] border border-[#363636]">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}

          {/* Admin panel section if privileged */}
          {isTeamMember && (
            <div className="pt-4 space-y-1">
              <div className="px-3 pb-1 flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
                  <span>Admin Console</span>
                </p>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono text-[#4ADE80] bg-[#142319] border border-[#1D3B26]">
                  ROOT
                </span>
              </div>

              <NavLink
                to="/admin"
                end
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#181818] text-[#EEEEEE] border border-[#262626] font-medium'
                      : 'text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818]/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span>Console Overview</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=requests"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#181818] text-[#EEEEEE] border border-[#262626] font-medium'
                      : 'text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818]/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span>All Requests</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=inquiries"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#181818] text-[#EEEEEE] border border-[#262626] font-medium'
                      : 'text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818]/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span>Inquiries</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=projects"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#181818] text-[#EEEEEE] border border-[#262626] font-medium'
                      : 'text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818]/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span>Showcase Catalog</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=users"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#181818] text-[#EEEEEE] border border-[#262626] font-medium'
                      : 'text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818]/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span>Clients</span>
                </div>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Section: Architectural CTA & User pill */}
      <div className="space-y-4 pt-6">
        {/* Architectural CTA Box */}
        <div className="nf-frame nf-frame-hover">
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />

          <div className="rounded bg-[#181818] border border-[#262626] p-3.5 text-center">
            <div className="w-8 h-8 rounded border border-[#363636] bg-[#1E1E1E] flex items-center justify-center mx-auto mb-2 text-[#EEEEEE]">
              <Rocket className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-medium text-[#EEEEEE] font-sans">Have a new idea?</h4>
            <p className="text-[10px] text-[#8D8D8D] font-mono mt-0.5 leading-relaxed">
              Architect your next web platform with us.
            </p>
            <Link
              to="/request"
              onClick={onCloseMobile}
              className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 text-xs font-semibold rounded text-[#121212] bg-[#EEEEEE] hover:bg-white shadow-sm transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Request</span>
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="pt-2 border-t border-[#262626] flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar
              src={user?.avatar}
              name={user?.name}
              size="sm"
            />
            <div className="truncate">
              <p className="text-xs font-medium text-[#EEEEEE] truncate font-sans">{user?.name || 'User'}</p>
              <p className="text-[10px] font-mono text-[#71717A] truncate uppercase">{user?.role || 'CLIENT'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded text-[#71717A] hover:text-red-400 hover:bg-[#1E1E1E] transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[9px] font-mono text-[#5D5D5D] text-center">
          © 2026 Reliable InfoTech
        </p>
      </div>
    </aside>
  );
};
