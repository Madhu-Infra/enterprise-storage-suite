import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Command, ArrowRight, Database, Zap, Network, Cpu, AlertTriangle, Sliders } from 'lucide-react';
import { COMMANDS_DATA } from '../data/commandsData';
import { PLAYBOOKS_DATA } from '../data/playbooksData';
import { HubTab } from '../types/storage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: HubTab) => void;
  onSelectCommand?: (commandId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return COMMANDS_DATA.slice(0, 6);
    const q = query.toLowerCase();
    return COMMANDS_DATA.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.syntax.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.vendor.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const filteredPlaybooks = useMemo(() => {
    if (!query.trim()) return PLAYBOOKS_DATA.slice(0, 2);
    const q = query.toLowerCase();
    return PLAYBOOKS_DATA.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.symptoms.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-[#0f1422] shadow-2xl overflow-hidden">
        {/* Search Input bar */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, CLI syntax, error codes, playbooks..."
            className="flex-1 bg-transparent px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick jump categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800/80 bg-slate-900/40 px-4 py-2 text-xs">
          <span className="text-slate-400 font-medium mr-1">Quick Jump:</span>
          <button
            onClick={() => { onSelectTab('netapp'); onClose(); }}
            className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-cyan-300 hover:bg-cyan-950/60"
          >
            <Database className="h-3 w-3" /> NetApp
          </button>
          <button
            onClick={() => { onSelectTab('powermax'); onClose(); }}
            className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-amber-300 hover:bg-amber-950/60"
          >
            <Zap className="h-3 w-3" /> PowerMax
          </button>
          <button
            onClick={() => { onSelectTab('cisco'); onClose(); }}
            className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-blue-300 hover:bg-blue-950/60"
          >
            <Network className="h-3 w-3" /> Cisco MDS
          </button>
          <button
            onClick={() => { onSelectTab('brocade'); onClose(); }}
            className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-purple-300 hover:bg-purple-950/60"
          >
            <Cpu className="h-3 w-3" /> Brocade FOS
          </button>
          <button
            onClick={() => { onSelectTab('zoning'); onClose(); }}
            className="flex items-center gap-1 rounded bg-cyan-900/40 border border-cyan-700/50 px-2 py-1 text-cyan-200 hover:bg-cyan-800/50"
          >
            <Sliders className="h-3 w-3" /> Zoning Generator
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* CLI Commands */}
          <div>
            <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              CLI Commands ({filteredCommands.length})
            </p>
            <div className="space-y-1">
              {filteredCommands.map((cmd) => (
                <div
                  key={cmd.id}
                  onClick={() => {
                    onSelectTab(cmd.vendor);
                    onClose();
                  }}
                  className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition hover:bg-slate-800/80"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm group-hover:text-cyan-400">
                        {cmd.title}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                        {cmd.vendor.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-400 line-clamp-1">
                      {cmd.syntax}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Playbooks */}
          {filteredPlaybooks.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-rose-400">
                P1 Emergency Playbooks ({filteredPlaybooks.length})
              </p>
              <div className="space-y-1">
                {filteredPlaybooks.map((pb) => (
                  <div
                    key={pb.id}
                    onClick={() => {
                      onSelectTab('p1');
                      onClose();
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-rose-900/30 bg-rose-950/20 p-2.5 transition hover:bg-rose-900/40"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        <span className="font-semibold text-rose-200 text-sm">
                          {pb.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {pb.summary}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-rose-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCommands.length === 0 && filteredPlaybooks.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching storage commands or playbooks found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400">
          <span>StorageAdmin Enterprise Intelligence</span>
          <div className="flex items-center gap-2">
            <span>ESC to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
