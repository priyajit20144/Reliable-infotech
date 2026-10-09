import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Code2,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  FolderGit2,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const PublicNavbar: React.FC = () => {
  const { user, logout, isTeamMember } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/8 transition-all">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            DevCraft
          </span>
        </Link>

        {/* Center Desktop Navigation Pill Container */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/[0.03] border border-white/8 backdrop-blur-md text-sm font-medium">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isHome
                ? 'bg-[#1E2342] text-white border border-indigo-500/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
              location.pathname.startsWith('/dashboard')
                ? 'bg-[#1E2342] text-white border border-indigo-500/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/projects"
            className={`px-4 py-1.5 rounded-full transition-all ${
              location.pathname === '/projects'
                ? 'bg-[#1E2342] text-white border border-indigo-500/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </Link>
          <Link
            to="/services"
            className={`px-4 py-1.5 rounded-full transition-all ${
              location.pathname === '/services'
                ? 'bg-[#1E2342] text-white border border-indigo-500/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Services
          </Link>
          <Link
            to="/about"
            className={`px-4 py-1.5 rounded-full transition-all ${
              location.pathname === '/about'
                ? 'bg-[#1E2342] text-white border border-indigo-500/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`px-4 py-1.5 rounded-full transition-all ${
              location.pathname === '/contact'
                ? 'bg-[#1E2342] text-white border border-indigo-500/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Contact
          </Link>
          <Link
            to="/intro"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] ml-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Intro</span>
          </Link>
        </nav>

        {/* Action CTAs (Search, Bell, User Profile Pill, Get Started) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Icon button */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-[#111827] border border-white/10 rounded-full px-3 py-1.5 animate-in fade-in duration-200">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search showcase..."
                  className="bg-transparent text-xs text-white focus:outline-none w-32"
                  autoFocus
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Notification Bell with Badge & Interactive Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative focus:outline-none"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Quick Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111827] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2.5">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n._id}
                        onClick={() => markAsRead(n._id)}
                        className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                          n.isRead
                            ? 'bg-white/[0.02] border-white/5 text-gray-400'
                            : 'bg-indigo-500/10 border-indigo-500/20 text-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-white">{n.title}</span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="mt-1 text-gray-300 text-[11px] leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-3 border-t border-white/10 mt-3 text-center">
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>View all notifications</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill matching reference design with dropdown */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-1 ring-white/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="text-left text-xs leading-none pr-1">
                  <span className="font-semibold text-white block truncate max-w-[90px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-gray-400 capitalize block mt-0.5">
                    {user.role || 'User'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111827] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl transition-colors border border-indigo-500/30"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Client Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors mt-1"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/requests"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>My Requests</span>
                  </Link>
                  <Link
                    to="/request"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Request New Project</span>
                  </Link>
                  {isTeamMember && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Admin Console</span>
                    </Link>
                  )}
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium text-gray-300 hover:text-white transition-colors px-2 py-1"
            >
              Sign In
            </Link>
          )}

          {/* Get Started Pill Button */}
          <Link
            to="/request"
            className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] shadow-glow-primary transition-all hover:scale-105 active:scale-95"
          >
            <span>Get Started</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-white/10 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-300">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl transition-all ${
                isHome ? 'bg-[#1E2342] text-white font-semibold' : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl flex items-center justify-between transition-all ${
                location.pathname.startsWith('/dashboard')
                  ? 'bg-gradient-to-r from-devcraft-primary to-devcraft-secondary text-white font-semibold shadow-glow-primary'
                  : 'bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20 border border-indigo-500/20 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Client Dashboard</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Workspace
              </span>
            </Link>
            <Link
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-white/5 hover:text-white"
            >
              Projects
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-white/5 hover:text-white"
            >
              Services
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-xl transition-all ${
                location.pathname === '/about'
                  ? 'bg-[#1E2342] text-white'
                  : 'hover:bg-white/5 hover:text-white text-gray-300'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-white/5 hover:text-white"
            >
              Contact Team
            </Link>
            <Link
              to="/intro"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center justify-between"
            >
              <span>Experience Intro Page</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </Link>
          </nav>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-white bg-white/10 rounded-full"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-gray-300 hover:text-white bg-white/5 rounded-full"
              >
                Sign In
              </Link>
            )}
            <Link
              to="/request"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-devcraft-primary to-devcraft-secondary rounded-full shadow-glow-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
