import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AdminSidebar, AdminNavTab } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current active tab
  const getActiveTab = (): AdminNavTab => {
    const tabParam = searchParams.get('tab') as AdminNavTab;
    if (tabParam) return tabParam;

    const path = location.pathname.replace('/admin', '').replace('/', '');
    if (path === 'projects') return 'projects';
    if (path === 'requests') return 'requests';
    if (path === 'users') return 'users';
    return 'dashboard';
  };

  const activeTab = getActiveTab();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTab = (tab: AdminNavTab) => {
    if (tab === 'dashboard') {
      navigate('/admin');
    } else {
      setSearchParams({ tab });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-[#F8FAFC]">
      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0D1322] z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Responsive Grid Layout
          - Desktop (lg: >= 1024px): 260px Sidebar + flexible main content
          - Mobile / Tablet (< 1024px): 1-column layout with mobile sliding drawer
      */}
      <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[265px_minmax(0,1fr)] min-h-screen w-full">
        {/* Desktop Sidebar Column */}
        <div className="hidden lg:block h-screen sticky top-0 overflow-y-auto z-40">
          <AdminSidebar activeTab={activeTab} onSelectTab={handleSelectTab} />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col min-w-0 w-full min-h-screen bg-[#0B0F19]">
          {/* Top Navbar */}
          <AdminNavbar
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Page Routed Content */}
          <main className="flex-1 w-full min-w-0 p-3.5 sm:p-6 lg:p-7">
            <Outlet context={{ searchQuery, activeTab, onSelectTab: handleSelectTab }} />
          </main>
        </div>
      </div>
    </div>
  );
};
