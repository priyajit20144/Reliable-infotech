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
  Code2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

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
    <aside className="h-full w-full bg-[#0F172A] border-r border-white/8 flex flex-col justify-between overflow-y-auto select-none p-4">
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
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center">
              <span className="font-bold text-base text-white tracking-tight">Reliable</span>
              <span className="text-cyan-400 font-bold text-base ml-1">Info</span>
              <span className="text-purple-400 font-bold text-base">Tech</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Your Vision • Our Technology</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Workspace
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
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-devcraft-primary to-devcraft-secondary text-white shadow-glow-primary font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500 text-white">
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
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Command</span>
                </p>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO
                </span>
              </div>

              <NavLink
                to="/admin"
                end
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                      : 'text-gray-300 hover:text-amber-300 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Console</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=requests"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                      : 'text-gray-300 hover:text-amber-300 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-amber-400" />
                  <span>All Website Requests</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=inquiries"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                      : 'text-gray-300 hover:text-amber-300 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Project Inquiries</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=projects"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                      : 'text-gray-300 hover:text-amber-300 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Showcase Catalog</span>
                </div>
              </NavLink>

              <NavLink
                to="/admin?tab=users"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                      : 'text-gray-300 hover:text-amber-300 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Client Accounts</span>
                </div>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Section: Rocket CTA & User pill */}
      <div className="space-y-4 pt-6">
        {/* Rocket CTA Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 p-4 text-center">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400">
            <Rocket className="w-5 h-5 animate-pulse" />
          </div>
          <h4 className="text-xs font-bold text-white">Have a new idea?</h4>
          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
            Let's build something amazing together.
          </p>
          <Link
            to="/request"
            onClick={onCloseMobile}
            className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-devcraft-primary hover:bg-devcraft-primaryHover text-white shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Request a Project</span>
          </Link>
        </div>

        {/* User Card & Logout */}
        <div className="pt-2 border-t border-white/8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.role || 'CLIENT'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          © 2026 DevCraft. All rights reserved.
        </p>
      </div>
    </aside>
  );
};
