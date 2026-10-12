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
  Settings,
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
    <header className="sticky top-0 z-30 h-16 w-full bg-[#121212]/95 backdrop-blur-md border-b border-[#262626] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left Area: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-[#888888] hover:text-[#EEEEEE] hover:bg-[#181818] transition-colors shrink-0"
          aria-label="Open Admin Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search console..."
            className="w-full bg-[#0B0B0B] text-xs sm:text-sm text-[#EEEEEE] placeholder-[#666666] font-mono pl-8 sm:pl-9 pr-6 sm:pr-14 py-2 border border-[#262626] hover:border-[#383838] focus:outline-none focus:border-[#EEEEEE] transition-all truncate"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#888888] bg-[#181818] border border-[#262626] flex items-center gap-0.5">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Area: Notification Bell & Admin Profile */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#AAAAAA] hover:text-[#EEEEEE] hover:bg-[#181818] transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EEEEEE] text-[#0B0B0B] text-[10px] font-mono font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="nf-frame absolute right-0 sm:right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm bg-[#121212] border border-[#262626] shadow-2xl z-50">
              <span className="nf-c nf-c-tl" />
              <span className="nf-c nf-c-tr" />
              <span className="nf-c nf-c-bl" />
              <span className="nf-c nf-c-br" />

              <div className="p-3.5 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#EEEEEE] uppercase tracking-wider">Telemetry Notifications</span>
                  <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#181818] text-[#AAAAAA] border border-[#262626]">
                    {unreadCount} New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-mono text-[#888888] hover:text-[#EEEEEE] transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#262626]">
                {notificationsList.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-left transition-colors hover:bg-[#181818] flex items-start gap-3 ${
                      n.unread ? 'bg-[#181818]/60' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 mt-1.5 shrink-0 ${
                        n.unread ? 'bg-[#EEEEEE]' : 'bg-[#444444]'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#EEEEEE] truncate">{n.title}</p>
                      <p className="text-[11px] text-[#888888] mt-0.5 line-clamp-2">{n.desc}</p>
                      <span className="text-[10px] font-mono text-[#666666] mt-1 block">{n.time}</span>
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
            className="flex items-center gap-3 p-1.5 sm:px-2.5 sm:py-1.5 border border-[#262626] bg-[#181818] hover:bg-[#222222] transition-colors text-left focus:outline-none group"
          >
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                }
                alt="Admin"
                className="w-7 h-7 object-cover grayscale"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400" />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-mono font-bold text-[#EEEEEE] tracking-tight leading-none">
                {user?.name?.split(' ')[0] || 'Admin'}
              </p>
              <p className="text-[9px] font-mono text-[#777777] uppercase tracking-wider mt-1 leading-none">
                Master Admin
              </p>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#888888] group-hover:text-white transition-transform duration-200" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showUserMenu && (
            <div className="nf-frame absolute right-0 mt-2 w-56 bg-[#121212] border border-[#262626] shadow-2xl py-1.5 z-50">
              <span className="nf-c nf-c-tl" />
              <span className="nf-c nf-c-tr" />
              <span className="nf-c nf-c-bl" />
              <span className="nf-c nf-c-br" />

              <div className="px-3.5 py-2 border-b border-[#262626]">
                <p className="text-xs font-bold text-[#EEEEEE]">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] font-mono text-[#888888] truncate">{user?.email || 'admin@reliableinfotech.io'}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#181818] text-[#CCCCCC] border border-[#333333]">
                  SUPER ADMIN
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/admin?tab=settings');
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-[#AAAAAA] hover:text-white hover:bg-[#181818] transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-[#888888]" />
                  <span>Platform Settings</span>
                </button>

                <Link
                  to="/"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono text-[#AAAAAA] hover:text-white hover:bg-[#181818] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[#888888]" />
                    <span>View Live Website</span>
                  </div>
                </Link>
              </div>

              <div className="pt-1 border-t border-[#262626]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-[#FF5555] hover:text-red-300 hover:bg-[#181818] transition-colors text-left"
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
