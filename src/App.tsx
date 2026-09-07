import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { DashboardView } from './components/DashboardView';
import { VendorView } from './components/VendorView';
import { ZoningToolView } from './components/ZoningToolView';
import { PlaybooksView } from './components/PlaybooksView';
import { NduView } from './components/NduView';
import { TranslatorView } from './components/TranslatorView';
import { AutomationView } from './components/AutomationView';
import { PromptsView } from './components/PromptsView';
import { HubTab, StorageVendor } from './types/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<HubTab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSelectTab = (tab: HubTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-900 text-slate-100'}`}>
      {/* Top Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace Layout */}
      <div className="flex">
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Primary Content View Container */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 max-w-7xl mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView onSelectTab={handleSelectTab} />
          )}

          {(currentTab === 'netapp' ||
            currentTab === 'powermax' ||
            currentTab === 'cisco' ||
            currentTab === 'brocade') && (
            <VendorView vendor={currentTab as StorageVendor} />
          )}

          {currentTab === 'zoning' && <ZoningToolView />}

          {currentTab === 'p1' && <PlaybooksView />}

          {currentTab === 'ndu' && <NduView />}

          {currentTab === 'translator' && <TranslatorView />}

          {currentTab === 'automation' && <AutomationView />}

          {currentTab === 'prompts' && <PromptsView />}
        </main>
      </div>

      {/* Global Command Palette Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}
