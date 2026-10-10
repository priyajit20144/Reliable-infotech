import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ExternalLink,
  Check,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface AdminNavbarProps {
  onOpenMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount?: number;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
  unreadCount = 5,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notificationsList = [
    {
      id: '1',
      title: 'New project inquiry received',
      desc: 'E-commerce Website requirement by rahul@example.com',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Custom request submitted',
      desc: 'Business Website Development #REQ-002',
      time: '3 hours ago',
      unread: true,
    },
    {
      id: '3',
      title: 'User registered',
      desc: 'rahul@example.com created a client account',
      time: '4 hours ago',
      unread: true,
    },
    {
      id: '4',
      title: 'Request status updated',
      desc: '#REQ-001 moved to Under Review',
      time: '5 hours ago',
      unread: false,
    },
    {
      id: '5',
      title: 'New message received',
      desc: 'Discussion on project #PRJ-003',
      time: '6 hours ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#0B101E]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Open Admin Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything..."
            className="w-full bg-[#111827]/80 text-sm text-white placeholder-slate-400 rounded-xl pl-9 pr-14 py-2 border border-slate-700/60 hover:border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800/90 border border-slate-700/60 rounded flex items-center gap-0.5 shadow-sm">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Area: Notification Bell & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Notifications</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {unreadCount} New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notificationsList.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-left transition-colors hover:bg-slate-800/40 flex items-start gap-3 ${
                      n.unread ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.unread ? 'bg-blue-400 ring-4 ring-blue-500/20' : 'bg-slate-600'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-800/60 transition-colors text-left focus:outline-none group"
          >
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                }
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-400/60 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B101E]" />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white tracking-tight leading-none">
                {user?.name?.split(' ')[0] || 'Admin'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">
                Administrator
              </p>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@reliableinfotech.io'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SUPER ADMIN
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Client Workspace View</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard/profile');
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Account Profile</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
