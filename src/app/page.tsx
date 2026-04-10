'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ToastContainer from '@/components/ToastContainer';
import Dashboard from '@/components/Dashboard';
import GeneratorPanel from '@/components/GeneratorPanel';
import ProjectsGrid from '@/components/ProjectsGrid';
import TemplatesPage from '@/components/TemplatesPage';
import SettingsPage from '@/components/SettingsPage';

export default function Home() {
  const { currentPage } = useAppState();

  useEffect(() => {
    // Prevent hydration issues
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'create':
        return <GeneratorPanel />;
      case 'projects':
        return <ProjectsGrid />;
      case 'templates':
        return <TemplatesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
