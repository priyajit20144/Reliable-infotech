import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  ChevronRight,
  PlusCircle,
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
    if (path.includes('/messages')) return { title: 'Messages', badge: 'Live Gateway' };
    if (path.includes('/notifications')) return { title: 'Notifications', badge: 'Activity' };
    if (path.includes('/profile')) return { title: 'Account Profile', badge: 'Settings' };
    return { title: 'Overview', badge: 'Client Portal' };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="sticky top-20 z-20 h-14 w-full bg-[#121212]/95 backdrop-blur-xl border-b border-[#262626] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Drawer Trigger & Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        {/* Mobile Workspace Menu Trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded bg-[#181818] hover:bg-[#1E1E1E] border border-[#262626] text-[#EEEEEE] transition-colors text-xs font-mono font-medium"
          aria-label="Open Workspace Menu"
        >
          <Menu className="w-3.5 h-3.5 text-[#A1A1AA]" />
          <span>Menu</span>
        </button>

        {/* Desktop Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#8D8D8D]">
            <LayoutDashboard className="w-3.5 h-3.5 text-[#A1A1AA]" />
            <span>Workspace</span>
          </div>
          <ChevronRight className="w-3 h-3 text-[#363636]" />
          <span className="text-[#EEEEEE] font-medium font-sans">{pageInfo.title}</span>

          <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-[#4ADE80] bg-[#142319] border border-[#1D3B26]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            <span>{pageInfo.badge}</span>
          </span>
        </div>
      </div>

      {/* Right Area: Workspace Search & Quick CTA Action */}
      <div className="flex items-center gap-3">
        {/* Workspace Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-44 sm:w-64 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests, builds..."
            className="w-full bg-[#181818] text-xs font-mono text-[#EEEEEE] placeholder-[#71717A] rounded pl-8 pr-12 py-1.5 border border-[#262626] hover:border-[#363636] focus:outline-none focus:border-[#EEEEEE] focus:ring-1 focus:ring-[#EEEEEE] transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-[#71717A] bg-[#121212] border border-[#262626] rounded">
              ⌘K
            </kbd>
          </div>
        </form>

        {/* Quick Request Button */}
        <Link
          to="/request"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-[#121212] bg-[#EEEEEE] hover:bg-white shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Request</span>
          <span className="sm:hidden">Request</span>
        </Link>
      </div>
    </div>
  );
};
