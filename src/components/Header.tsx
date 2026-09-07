import React from 'react';
import {
  HardDrive,
  Search,
  Zap,
  Sun,
  Moon,
  Menu,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { HubTab } from '../types/storage';

interface HeaderProps {
  currentTab: HubTab;
  onSelectTab: (tab: HubTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  onOpenSearch,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0e17]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0e17]/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Title matching screenshot */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            onClick={() => onSelectTab('dashboard')}
            className="group flex cursor-pointer items-center gap-3"
          >
            {/* Floppy disk icon container matching screenshot */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
              <HardDrive className="h-5 w-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  StorageAdmin Hub
                </span>
                <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-[11px] font-semibold text-cyan-400 border border-cyan-800/50">
                  v2.5 PROD
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-400 sm:block">
                NetApp • EMC PowerMax • Cisco SAN • Brocade • AI Prompts
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Quick Search Bar matching screenshot */}
        <div className="hidden max-w-md flex-1 px-6 md:block">
          <button
            id="global-search-btn"
            onClick={onOpenSearch}
            className="flex w-full items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/90 px-3.5 py-2 text-sm text-slate-400 shadow-inner transition hover:border-slate-600 hover:text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Search commands, error codes, CLI...</span>
            </div>
            <kbd className="hidden rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400 border border-slate-700 sm:inline-block">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Actions & Theme */}
        <div className="flex items-center gap-2.5">
          {/* Real-time Telemetry Health status */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-400 xl:flex">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Fabrics: Nominal</span>
          </div>

          {/* Emergency P1 Fast Access */}
          <button
            id="header-p1-btn"
            onClick={() => onSelectTab('p1')}
            className="hidden items-center gap-1.5 rounded-lg border border-rose-800/60 bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 sm:flex"
            title="Emergency P1 Outage Playbooks"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>P1 Triage</span>
          </button>

          {/* Quick Zoning Tool Button matching screenshot */}
          <button
            id="header-zoning-tool-btn"
            onClick={() => onSelectTab('zoning')}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition hover:from-cyan-500 hover:to-blue-500 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            <span>SAN Zoning Tool</span>
          </button>

          {/* Search button on small mobile */}
          <button
            id="mobile-search-trigger-btn"
            onClick={onOpenSearch}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-2 text-amber-400 hover:bg-slate-800 hover:text-amber-300"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
