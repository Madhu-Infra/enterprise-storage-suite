import React, { useState, useMemo, useEffect } from 'react';
import {
  Database,
  Zap,
  Network,
  Cpu,
  Search,
  Copy,
  Check,
  AlertTriangle,
  SlidersHorizontal,
  Terminal,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { StorageVendor, StorageCommand } from '../types/storage';
import { COMMANDS_DATA } from '../data/commandsData';

interface VendorViewProps {
  vendor: StorageVendor;
  onSelectTab?: (vendor: StorageVendor) => void;
}

const DEFAULT_PARAMS: Record<string, string> = {
  svm_name: 'svm_prod_01',
  vol_name: 'vol_app_data',
  size: '+200GB',
  sid: '1234',
  sg_name: 'SG_PROD_APP',
  vsan_id: '100',
  interface: '1/12',
  alias_host: 'HBA_ESX01_P1',
  pwwn_host: '20:00:00:25:b5:11:aa:01',
  alias_tgt: 'ST_TGT_1A',
  pwwn_tgt: '50:00:09:73:a0:12:34:01',
};

const VENDOR_CONFIG: Record<
  StorageVendor,
  {
    name: string;
    sub: string;
    badge: string;
    icon: typeof Database;
    color: string;
    description: string;
    architectureSummary: string;
  }
> = {
  netapp: {
    name: 'NetApp ONTAP',
    sub: 'ONTAP 9.x Unified Storage (SAN & NAS)',
    badge: 'SAN/NAS',
    icon: Database,
    color: 'from-cyan-500 to-blue-600',
    description: 'Enterprise clustered data management architecture featuring Storage Virtual Machines (SVM), FlexVol / FlexGroup logical containers, WAFL file system, and SnapMirror disaster recovery.',
    architectureSummary: 'Clustered ONTAP separates data access from physical controllers via virtualized Storage Virtual Machines (SVMs) and Logical Interfaces (LIFs). High availability is maintained through pair-node Storage Failover (SFO) interconnects.',
  },
  powermax: {
    name: 'Dell EMC PowerMax',
    sub: 'PowerMaxOS / HYPERMAX (Symmetrix NVMe)',
    badge: 'NVMe',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    description: 'Mission-critical NVMe flash architecture with multi-engine active-active directors, Service Level Objectives (SLO), Masking Views (SG + PG + IG), and SRDF synchronous replication.',
    architectureSummary: 'PowerMax utilizes high-speed NVMe fabric backends and multi-core Front-End (FA), Back-End (DA), and Remote Adapter (RA) directors. Provisioning strictly follows the Masking View triad: Storage Group (SG), Port Group (PG), and Initiator Group (IG).',
  },
  cisco: {
    name: 'Cisco SAN MDS',
    sub: 'MDS 9000 Series NX-OS SAN Switching',
    badge: 'NX-OS',
    icon: Network,
    color: 'from-blue-500 to-indigo-600',
    description: 'Enterprise Fibre Channel fabric director switches with hardware-enforced VSAN isolation, Cisco Fabric Services (CFS) distributed device-alias database, and In-Service Software Upgrades (ISSU).',
    architectureSummary: 'Cisco MDS decouples physical fabric switches into isolated Virtual SANs (VSANs). Zoning is activated atomically across the VSAN using CFS distribution, preventing race conditions or split-brain states.',
  },
  brocade: {
    name: 'Brocade FOS',
    sub: 'Fabric OS Gen 6 & Gen 7 Fibre Channel Switches',
    badge: 'Fabric',
    icon: Cpu,
    color: 'from-purple-500 to-pink-600',
    description: 'Industry-standard FC switches with ASIC-level hardware zoning, fabric principal switch arbitration, real-time error auditing (porterrshow), and non-disruptive dual-CP firmware downloads.',
    architectureSummary: 'Brocade Fabric OS manages the fabric name server and routing tables. The active zoning database is managed via `aliCreate`, `zoneCreate`, and `cfgEnable` pipelines with support for automated Trunking and Bottleneck Detection.',
  },
};

export const VendorView: React.FC<VendorViewProps> = ({ vendor }) => {
  const meta = VENDOR_CONFIG[vendor];
  const Icon = meta.icon;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic parameter state with localStorage persistence
  const [paramOverrides, setParamOverrides] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('storage_hub_params');
      return saved ? { ...DEFAULT_PARAMS, ...JSON.parse(saved) } : DEFAULT_PARAMS;
    } catch {
      return DEFAULT_PARAMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('storage_hub_params', JSON.stringify(paramOverrides));
    } catch {
      // Ignore write errors
    }
  }, [paramOverrides]);

  const commands = useMemo(() => {
    return COMMANDS_DATA.filter((c) => c.vendor === vendor);
  }, [vendor]);

  const categories = useMemo(() => {
    const cats = new Set(commands.map((c) => c.category));
    return ['All', ...Array.from(cats)];
  }, [commands]);

  const filteredCommands = useMemo(() => {
    return commands.filter((c) => {
      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.syntax.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [commands, selectedCategory, searchQuery]);

  // Substitute user parameter overrides into command syntax
  const substituteParameters = (text: string) => {
    let result = text;
    Object.entries(paramOverrides).forEach(([key, val]) => {
      if (typeof val === 'string' && val.trim()) {
        result = result.replaceAll(`<${key}>`, val);
      }
    });
    return result;
  };

  const copyCommand = (id: string, text: string) => {
    const resolved = substituteParameters(text);
    navigator.clipboard.writeText(resolved);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-[#101524] to-[#0c101c] p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} shadow-lg shadow-blue-500/10`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                  {meta.name}
                </h1>
                <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs font-semibold text-cyan-400 font-mono">
                  {meta.badge}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-300 mt-1">{meta.sub}</p>
              <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {meta.description}
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Note */}
        <div className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5 text-xs text-slate-300">
          <span className="font-bold text-slate-200">Architecture Directive: </span>
          {meta.architectureSummary}
        </div>
      </section>

      {/* Interactive Variable Substitution Box */}
      <section className="rounded-2xl border border-cyan-900/40 bg-slate-900/40 p-4">
        <div className="flex items-center gap-2 pb-2">
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Variable Replacer (Auto-injects your parameters into all CLI outputs below)
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 pt-1">
          {vendor === 'netapp' && (
            <>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;svm_name&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.svm_name || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, svm_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;vol_name&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.vol_name || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, vol_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;size&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.size || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, size: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {vendor === 'powermax' && (
            <>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;sid&gt; (Array)</label>
                <input
                  type="text"
                  value={paramOverrides.sid || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, sid: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;sg_name&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.sg_name || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, sg_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {vendor === 'cisco' && (
            <>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;vsan_id&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.vsan_id || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, vsan_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-blue-300 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;interface&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.interface || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, interface: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-blue-300 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {vendor === 'brocade' && (
            <>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;alias_host&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.alias_host || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, alias_host: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-purple-300 font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">&lt;pwwn_host&gt;</label>
                <input
                  type="text"
                  value={paramOverrides.pwwn_host || ''}
                  onChange={(e) => setParamOverrides({ ...paramOverrides, pwwn_host: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-purple-300 font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Command Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter CLI syntax..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Command Cards List */}
      <div className="space-y-4">
        {filteredCommands.map((cmd) => {
          const resolvedSyntax = substituteParameters(cmd.syntax);
          const isCopied = copiedId === cmd.id;

          return (
            <div
              key={cmd.id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f1422] shadow-md transition hover:border-slate-700"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-5 py-3 gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {cmd.title}
                  </h3>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-700">
                    {cmd.category}
                  </span>
                  {cmd.level === 'destructive' && (
                    <span className="rounded bg-rose-950 border border-rose-800 px-2 py-0.5 text-[10px] font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Destructive
                    </span>
                  )}
                  {cmd.level === 'emergency' && (
                    <span className="rounded bg-red-950 border border-red-800 px-2 py-0.5 text-[10px] font-bold text-red-300">
                      Emergency DR
                    </span>
                  )}
                </div>

                <button
                  id={`copy-cmd-${cmd.id}`}
                  onClick={() => copyCommand(cmd.id, cmd.syntax)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy CLI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-300">{cmd.description}</p>

                {/* Syntax Terminal Box */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <div className="flex items-center justify-between pb-1.5 text-[10px] text-slate-400 border-b border-slate-800/80 mb-2 font-sans">
                    <span className="flex items-center gap-1 font-mono">
                      <Terminal className="h-3 w-3 text-slate-400" /> CLI Syntax
                    </span>
                    <span>Ready to run</span>
                  </div>
                  <pre className="whitespace-pre-wrap">{resolvedSyntax}</pre>
                </div>

                {/* Verification Command if present */}
                {cmd.verificationCommand && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-900/60 px-3.5 py-2 text-xs border border-slate-800/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-400">Verify:</span>
                    <code className="font-mono text-emerald-300 text-xs">
                      {substituteParameters(cmd.verificationCommand)}
                    </code>
                  </div>
                )}

                {/* Impact warning note if present */}
                {cmd.impactNote && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 px-3.5 py-2 text-xs text-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Operational Impact:</strong> {cmd.impactNote}</span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {cmd.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-800/70 px-2 py-0.5 text-[10px] font-mono text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredCommands.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No commands found matching your search. Try changing categories or clearing search.
          </div>
        )}
      </div>
    </div>
  );
};
