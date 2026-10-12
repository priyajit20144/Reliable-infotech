import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Avatar } from '../common/Avatar';

export const PublicNavbar: React.FC = () => {
  const { user, logout } = useAuth();
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

  const navLinks = [
    { label: 'Home', path: '/', active: isHome },
    ...(user?.role === 'ADMIN'
      ? [{ label: 'Admin Console', path: '/admin', active: location.pathname.startsWith('/admin'), isAdmin: true }]
      : [{ label: 'Dashboard', path: '/dashboard', active: location.pathname.startsWith('/dashboard'), isDashboard: true }]),
    { label: 'Projects', path: '/projects', active: location.pathname === '/projects' },
    { label: 'Services', path: '/services', active: location.pathname === '/services' },
    { label: 'About', path: '/about', active: location.pathname === '/about' },
    { label: 'Contact', path: '/contact', active: location.pathname === '/contact' },
    { label: 'Intro', path: '/intro', active: location.pathname === '/intro', isIntro: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto nf-frame bg-[#121212]/85 backdrop-blur-xl border border-[#262626] rounded shadow-nf">
        {/* Subtle corner brackets */}
        <span className="nf-c nf-c-tl" />
        <span className="nf-c nf-c-tr" />
        <span className="nf-c nf-c-bl" />
        <span className="nf-c nf-c-br" />

        <div className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded border border-[#363636] bg-[#181818] p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/reliable-symbol.png"
                alt="Reliable InfoTech Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[#EEEEEE] flex items-center">
              <span>Reliable</span>
              <span className="text-[#8D8D8D] font-serif italic ml-1.5 font-normal text-base">InfoTech</span>
            </span>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-[13.5px]">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3.5 py-1.5 rounded transition-colors font-medium ${
                  item.active
                    ? 'text-[#EEEEEE] bg-[#1E1E1E] border border-[#363636]'
                    : item.isIntro
                    ? 'text-[#C9C9C9] hover:text-[#EEEEEE] border border-dashed border-[#363636] hover:border-[#5D5D5D]'
                    : item.isAdmin
                    ? 'text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30'
                    : 'text-[#8D8D8D] hover:text-[#EEEEEE]'
                }`}
              >
                {item.active && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded bg-[#1E1E1E] -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="flex items-center gap-1.5">
                  {item.isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                  {item.isDashboard && <LayoutDashboard className="w-3.5 h-3.5 text-[#A1A1AA]" />}
                  {item.isIntro && <Sparkles className="w-3.5 h-3.5 text-[#E4E4E7]" />}
                  <span>{item.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Search Button / Input */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2 bg-[#181818] border border-[#363636] rounded px-3 py-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-[#8D8D8D]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search showcase..."
                    className="bg-transparent text-xs text-[#EEEEEE] focus:outline-none w-32 placeholder-[#5D5D5D]"
                    autoFocus
                    onBlur={() => !searchQuery && setSearchOpen(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-[#8D8D8D] hover:text-[#EEEEEE] text-xs"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818] border border-transparent hover:border-[#262626] transition-colors"
                  title="Search"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818] border border-transparent hover:border-[#262626] transition-colors relative focus:outline-none"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#EEEEEE] text-[#121212] text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Quick Notifications Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded bg-[#181818] border border-[#363636] shadow-2xl p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#EEEEEE] font-mono">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-[#A1A1AA] hover:text-[#EEEEEE] font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#8D8D8D] text-center py-6 font-mono">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => markAsRead(n._id)}
                            className={`p-2.5 rounded text-xs transition-colors cursor-pointer border ${
                              n.isRead
                                ? 'bg-[#121212] border-[#262626] text-[#8D8D8D]'
                                : 'bg-[#1E1E1E] border-[#363636] text-[#EEEEEE]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-[#EEEEEE]">{n.title}</span>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#EEEEEE] shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="mt-1 text-[#A1A1AA] text-[11px] leading-relaxed line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="pt-3 border-t border-[#262626] mt-3 text-center">
                      <Link
                        to="/dashboard/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-[#C9C9C9] hover:text-[#EEEEEE] font-medium inline-flex items-center gap-1 font-mono"
                      >
                        <span>View all notifications</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Pill / Dropdown */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-[#181818] hover:bg-[#1E1E1E] border border-[#262626] hover:border-[#363636] transition-colors focus:outline-none"
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="xs"
                    className="!w-6 !h-6 ring-1 ring-[#363636]"
                  />
                  <div className="text-left text-xs leading-none pr-1">
                    <span className="font-semibold text-[#EEEEEE] block truncate max-w-[90px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-[#8D8D8D] capitalize block mt-0.5 font-mono">
                      {user.role || 'User'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#8D8D8D]" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded bg-[#181818] border border-[#363636] shadow-2xl p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-[#262626] mb-1">
                        <p className="text-xs font-semibold text-[#EEEEEE] truncate">{user.name}</p>
                        <p className="text-[10px] text-[#8D8D8D] truncate font-mono">{user.email}</p>
                      </div>
                      {user.role === 'ADMIN' ? (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded transition-colors border border-amber-500/30"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Admin Console</span>
                          </Link>
                          <Link
                            to="/admin?tab=requests"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C9C9C9] hover:bg-[#262626] hover:text-[#EEEEEE] rounded transition-colors mt-1"
                          >
                            <FolderGit2 className="w-3.5 h-3.5 text-[#A1A1AA]" />
                            <span>All Website Requests</span>
                          </Link>
                          <Link
                            to="/admin?tab=projects"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C9C9C9] hover:bg-[#262626] hover:text-[#EEEEEE] rounded transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#A1A1AA]" />
                            <span>Showcase Catalog</span>
                          </Link>
                          <Link
                            to="/admin?tab=messages"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C9C9C9] hover:bg-[#262626] hover:text-[#EEEEEE] rounded transition-colors"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                            <span>Client Messages</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#EEEEEE] bg-[#1E1E1E] hover:bg-[#262626] rounded transition-colors border border-[#363636]"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-[#EEEEEE]" />
                            <span>Client Dashboard</span>
                          </Link>
                          <Link
                            to="/dashboard/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C9C9C9] hover:bg-[#262626] hover:text-[#EEEEEE] rounded transition-colors mt-1"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/dashboard/requests"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C9C9C9] hover:bg-[#262626] hover:text-[#EEEEEE] rounded transition-colors"
                          >
                            <FolderGit2 className="w-3.5 h-3.5 text-[#A1A1AA]" />
                            <span>My Requests</span>
                          </Link>
                        </>
                      )}
                      <div className="border-t border-[#262626] my-1" />
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-[#C9C9C9] hover:text-[#EEEEEE] transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
            )}

            {/* Inverted Template CTA Button */}
            <Link
              to="/request"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-[#121212] bg-[#EEEEEE] hover:bg-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818] transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[#262626] px-4 pt-3 pb-6 space-y-3 bg-[#121212]"
            >
              <nav className="flex flex-col space-y-1.5 text-sm font-medium">
                {navLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2 rounded flex items-center justify-between text-xs font-medium ${
                      item.active
                        ? 'bg-[#1E1E1E] text-[#EEEEEE] border border-[#363636]'
                        : 'text-[#8D8D8D] hover:text-[#EEEEEE] hover:bg-[#181818]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                      {item.isDashboard && <LayoutDashboard className="w-3.5 h-3.5 text-[#A1A1AA]" />}
                      {item.isIntro && <Sparkles className="w-3.5 h-3.5 text-[#E4E4E7]" />}
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="pt-3 border-t border-[#262626] flex flex-col gap-2">
                {user ? (
                  <Link
                    to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-semibold text-[#EEEEEE] bg-[#181818] border border-[#363636] rounded"
                  >
                    {user.role === 'ADMIN' ? 'Go to Admin Console' : 'Go to Dashboard'}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2 text-center text-xs font-medium text-[#C9C9C9] hover:text-[#EEEEEE] bg-[#181818] rounded"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  to="/request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-semibold text-[#121212] bg-[#EEEEEE] hover:bg-white rounded"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
