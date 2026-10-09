import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../landing/PublicNavbar';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileDrawer } from './MobileDrawer';

export const AppShell: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-[#F8FAFC] flex flex-col">
      {/* 1. Global Public Navbar: Always visible across all sections including Dashboard */}
      <PublicNavbar />

      {/* Mobile Drawer for Workspace Sidebar Navigation */}
      <MobileDrawer
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Responsive Workspace Body Layout
          - Desktop (lg: >= 1024px): CSS Grid [260px Sidebar + flexible main content]
          - Mobile / Tablet (< 1024px): 1-column layout with workspace drawer
      */}
      <div className="flex-1 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] w-full">
        {/* Desktop Workspace Sidebar Column: Pinned under PublicNavbar (top-20 = 5rem / 80px) */}
        <div className="hidden lg:block h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto z-30">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col min-w-0 w-full min-h-[calc(100vh-5rem)] bg-[#0B0F19]">
          {/* Workspace Context Toolbar */}
          <Navbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

          {/* Page Routed Content with min-width: 0 to prevent any flex container overflow */}
          <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
