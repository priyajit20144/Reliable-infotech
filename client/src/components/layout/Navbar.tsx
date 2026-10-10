import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  ChevronRight,
  PlusCircle,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cmd+K / Ctrl+K shortcut listener to focus search
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/requests?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/requests/')) return { title: 'Request Details', badge: 'Milestones' };
    if (path.includes('/requests')) return { title: 'My Requests', badge: 'Active Specs' };
    if (path.includes('/messages')) return { title: 'Messages', badge: 'Dev Chat' };
    if (path.includes('/notifications')) return { title: 'Notifications', badge: 'Activity' };
    if (path.includes('/profile')) return { title: 'Account Profile', badge: 'Settings' };
    return { title: 'Overview', badge: 'Client Portal' };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="sticky top-20 z-20 h-14 w-full bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/8 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Drawer Trigger & Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        {/* Mobile Workspace Menu Trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-white transition-all text-xs font-semibold shadow-sm"
          aria-label="Open Workspace Menu"
        >
          <Menu className="w-4 h-4 text-indigo-400" />
          <span>Workspace Menu</span>
        </button>

        {/* Desktop Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400 font-medium">
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reliable Info Tech Workspace</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-white font-semibold">{pageInfo.title}</span>

          <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{pageInfo.badge}</span>
          </span>
        </div>
      </div>

      {/* Right Area: Workspace Search & Quick CTA Action */}
      <div className="flex items-center gap-3">
        {/* Workspace Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-44 sm:w-64 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests, builds..."
            className="w-full bg-[#111827]/70 text-xs text-white placeholder-gray-400 rounded-xl pl-8 pr-12 py-1.5 border border-white/10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
            <kbd className="px-1.5 py-0.5 text-[9px] font-semibold text-gray-400 bg-white/5 border border-white/10 rounded">
              ⌘K
            </kbd>
          </div>
        </form>

        {/* Quick Request Button */}
        <Link
          to="/request"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] shadow-glow-primary transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Request</span>
          <span className="sm:hidden">Request</span>
        </Link>
      </div>
    </div>
  );
};
