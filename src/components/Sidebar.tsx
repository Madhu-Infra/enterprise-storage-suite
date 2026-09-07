import React from 'react';
import {
  Home,
  Database,
  Zap,
  Network,
  Cpu,
  Rocket,
  AlertOctagon,
  Sliders,
  Repeat,
  Terminal,
  Bot,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { HubTab } from '../types/storage';

interface SidebarProps {
  currentTab: HubTab;
  onSelectTab: (tab: HubTab) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const handleSelect = (tab: HubTab) => {
    onSelectTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const navItemClass = (tab: HubTab) => {
    const isActive = currentTab === tab;
    return `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white font-semibold shadow-md shadow-blue-500/20'
        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
    } ${isCollapsed ? 'justify-center px-2' : ''}`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800/80 bg-[#0c101c] transition-all duration-300 ease-in-out lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Top items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Landing Dashboard */}
          <div>
            <button
              id="nav-landing-dashboard"
              onClick={() => handleSelect('dashboard')}
              className={navItemClass('dashboard')}
              title="Landing Dashboard"
            >
              <Home className="h-4 w-4 shrink-0 text-amber-400" />
              {!isCollapsed && <span>Landing Dashboard</span>}
            </button>
          </div>

          {/* STORAGE VENDORS SECTION */}
          <div>
            {!isCollapsed ? (
              <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Storage Vendors
              </p>
            ) : (
              <div className="mx-auto my-1 h-px w-8 bg-slate-800" />
            )}

            <div className="space-y-1">
              <button
                id="nav-vendor-netapp"
                onClick={() => handleSelect('netapp')}
                className={navItemClass('netapp')}
                title="NetApp ONTAP (SAN/NAS)"
              >
                <Database className="h-4 w-4 shrink-0 text-cyan-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>NetApp ONTAP</span>
                    <span className="rounded bg-cyan-950/80 border border-cyan-800/40 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400">
                      SAN/NAS
                    </span>
                  </div>
                )}
              </button>

              <button
                id="nav-vendor-powermax"
                onClick={() => handleSelect('powermax')}
                className={navItemClass('powermax')}
                title="EMC PowerMax (NVMe)"
              >
                <Zap className="h-4 w-4 shrink-0 text-amber-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>EMC PowerMax</span>
                    <span className="rounded bg-amber-950/80 border border-amber-800/40 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                      NVMe
                    </span>
                  </div>
                )}
              </button>

              <button
                id="nav-vendor-cisco"
                onClick={() => handleSelect('cisco')}
                className={navItemClass('cisco')}
                title="Cisco SAN MDS (NX-OS)"
              >
                <Network className="h-4 w-4 shrink-0 text-blue-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>Cisco SAN MDS</span>
                    <span className="rounded bg-blue-950/80 border border-blue-800/40 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                      NX-OS
                    </span>
                  </div>
                )}
              </button>

              <button
                id="nav-vendor-brocade"
                onClick={() => handleSelect('brocade')}
                className={navItemClass('brocade')}
                title="Brocade FOS (Fabric)"
              >
                <Cpu className="h-4 w-4 shrink-0 text-purple-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>Brocade FOS</span>
                    <span className="rounded bg-purple-950/80 border border-purple-800/40 px-1.5 py-0.5 text-[10px] font-medium text-purple-300">
                      Fabric
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* PRODUCTION HUB SECTION */}
          <div>
            {!isCollapsed ? (
              <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Production Hub
              </p>
            ) : (
              <div className="mx-auto my-1 h-px w-8 bg-slate-800" />
            )}

            <div className="space-y-1">
              <button
                id="nav-hub-ndu"
                onClick={() => handleSelect('ndu')}
                className={navItemClass('ndu')}
                title="Code Upgrades (NDU)"
              >
                <Rocket className="h-4 w-4 shrink-0 text-rose-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>Code Upgrades (NDU)</span>
                    <span className="rounded bg-rose-950/70 border border-rose-800/30 px-1.5 py-0.5 text-[10px] text-rose-400">
                      ISSU
                    </span>
                  </div>
                )}
              </button>

              <button
                id="nav-hub-p1"
                onClick={() => handleSelect('p1')}
                className={navItemClass('p1')}
                title="Emergency P1 Playbooks"
              >
                <AlertOctagon className="h-4 w-4 shrink-0 text-rose-500" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="font-semibold text-rose-200">Emergency P1 Playbooks</span>
                    <span className="rounded bg-red-900/80 border border-red-700/50 px-1.5 py-0.5 text-[10px] font-bold text-red-300 animate-pulse">
                      SOS
                    </span>
                  </div>
                )}
              </button>

              <button
                id="nav-hub-zoning"
                onClick={() => handleSelect('zoning')}
                className={navItemClass('zoning')}
                title="SAN Zoning Generator"
              >
                <Sliders className="h-4 w-4 shrink-0 text-cyan-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>SAN Zoning Generator</span>
                    <span className="rounded bg-cyan-950/70 border border-cyan-800/40 px-1.5 py-0.5 text-[10px] text-cyan-300">
                      Dual-Fabric
                    </span>
                  </div>
                )}
              </button>

              <button
                id="nav-hub-translator"
                onClick={() => handleSelect('translator')}
                className={navItemClass('translator')}
                title="CLI Command Translator"
              >
                <Repeat className="h-4 w-4 shrink-0 text-emerald-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>CLI Command Translator</span>
                    <span className="rounded bg-emerald-950/70 border border-emerald-800/40 px-1.5 py-0.5 text-[10px] text-emerald-300">
                      Cross-OS
                    </span>
                  </div>
                )}
              </button>

              <button
                id="nav-hub-automation"
                onClick={() => handleSelect('automation')}
                className={navItemClass('automation')}
                title="Python & Ansible Hub"
              >
                <Terminal className="h-4 w-4 shrink-0 text-teal-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>Python & Ansible Hub</span>
                  </div>
                )}
              </button>

              <button
                id="nav-hub-prompts"
                onClick={() => handleSelect('prompts')}
                className={navItemClass('prompts')}
                title="AI Storage Prompt Library"
              >
                <Bot className="h-4 w-4 shrink-0 text-violet-400" />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>AI Storage Prompt Library</span>
                    <span className="rounded bg-violet-950/70 border border-violet-800/40 px-1.5 py-0.5 text-[10px] text-violet-300">
                      GenAI
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer & collapse trigger */}
        <div className="border-t border-slate-800/80 p-3">
          {!isCollapsed && (
            <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/70">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Fabric Guard: Active</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">99.999% HA</span>
            </div>
          )}

          <button
            id="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            className="hidden w-full items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:flex"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
