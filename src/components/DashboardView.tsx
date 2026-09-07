import React, { useState } from 'react';
import {
  Zap,
  Box,
  Sliders,
  Rocket,
  AlertTriangle,
  Database,
  Network,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Activity,
  Sparkles,
} from 'lucide-react';
import { HubTab, StorageVendor } from '../types/storage';

interface DashboardViewProps {
  onSelectTab: (tab: HubTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab }) => {
  const [quickWwn, setQuickWwn] = useState('');
  const [formattedWwn, setFormattedWwn] = useState('');
  const [wwnCopied, setWwnCopied] = useState(false);

  // Quick WWN Formatter tool inside dashboard
  const handleFormatWwn = (raw: string) => {
    setQuickWwn(raw);
    const cleaned = raw.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
    if (cleaned.length === 16) {
      const formatted = cleaned.match(/.{1,2}/g)?.join(':') || cleaned;
      setFormattedWwn(formatted);
    } else {
      setFormattedWwn('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setWwnCopied(true);
    setTimeout(() => setWwnCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section matching the user's screenshot */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#111625] to-[#0c101c] p-6 sm:p-10 shadow-2xl">
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Pill badge matching screenshot */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/60 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-300">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Enterprise Production Operations Portal</span>
          </div>

          {/* Master Headline matching screenshot */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Master Handbook for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Enterprise Storage &amp; SAN Admins
            </span>
          </h1>

          {/* Subtitle matching screenshot */}
          <p className="max-w-3xl text-base text-slate-300 sm:text-lg leading-relaxed">
            Complete end-to-end operational guide for NetApp ONTAP, Dell EMC PowerMax, Cisco SAN MDS,
            and Brocade Fabric OS. Built for daily administration, code upgrades, disaster recovery,
            and emergency troubleshooting.
          </p>

          {/* Action Buttons matching screenshot with enhancements */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-explore-netapp-btn"
              onClick={() => onSelectTab('netapp')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition hover:from-cyan-500 hover:to-blue-500 active:scale-95"
            >
              <Box className="h-4 w-4" />
              <span>Explore NetApp Hub</span>
            </button>

            <button
              id="hero-launch-zoning-btn"
              onClick={() => onSelectTab('zoning')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-200 shadow-sm transition hover:bg-slate-700 hover:text-white active:scale-95"
            >
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span>Launch Zoning Generator</span>
            </button>

            <button
              id="hero-code-upgrades-btn"
              onClick={() => onSelectTab('ndu')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-200 shadow-sm transition hover:bg-slate-700 hover:text-white active:scale-95"
            >
              <Rocket className="h-4 w-4 text-rose-400" />
              <span>Code Upgrades Center</span>
            </button>

            <button
              id="hero-p1-btn"
              onClick={() => onSelectTab('p1')}
              className="flex items-center gap-2 rounded-xl border border-rose-800/70 bg-rose-950/40 px-5 py-3 text-sm font-semibold text-rose-300 shadow-sm transition hover:bg-rose-900/60 active:scale-95"
            >
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>Emergency P1 Triage</span>
            </button>
          </div>

          {/* Quick Platform Switcher Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="font-semibold text-slate-400">Jump to Platform:</span>
            <button
              onClick={() => onSelectTab('netapp')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-cyan-300 hover:border-cyan-500 transition"
            >
              <Database className="h-3 w-3" /> NetApp ONTAP
            </button>
            <button
              onClick={() => onSelectTab('powermax')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-amber-300 hover:border-amber-500 transition"
            >
              <Zap className="h-3 w-3" /> EMC PowerMax
            </button>
            <button
              onClick={() => onSelectTab('cisco')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-blue-300 hover:border-blue-500 transition"
            >
              <Network className="h-3 w-3" /> Cisco SAN MDS
            </button>
            <button
              onClick={() => onSelectTab('brocade')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-purple-300 hover:border-purple-500 transition"
            >
              <Cpu className="h-3 w-3" /> Brocade FOS
            </button>
          </div>
        </div>
      </section>

      {/* 4 Feature Metric Cards matching screenshot */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: 4 Platforms */}
        <div
          onClick={() => onSelectTab('netapp')}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-[#0f1422] p-5 shadow-lg transition hover:border-slate-700 hover:bg-slate-800/50"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-2xl font-black text-white">4 Platforms</span>
            <div className="rounded-lg bg-blue-950/60 p-2 text-blue-400 border border-blue-800/40">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-200">
            NetApp, EMC, Cisco, Brocade
          </p>
          <p className="text-xs text-slate-400 pt-1">
            Standardized architectures, provisioning syntaxes, and troubleshooting trees.
          </p>
        </div>

        {/* Card 2: 100+ Commands */}
        <div
          onClick={() => onSelectTab('translator')}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-[#0f1422] p-5 shadow-lg transition hover:border-slate-700 hover:bg-slate-800/50"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-2xl font-black text-emerald-400">100+ Commands</span>
            <div className="rounded-lg bg-emerald-950/60 p-2 text-emerald-400 border border-emerald-800/40">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-200">
            Basic to Advanced CLI
          </p>
          <p className="text-xs text-slate-400 pt-1">
            Syntax with live parameter templating, impact notes, and verification scripts.
          </p>
        </div>

        {/* Card 3: NDU / ISSU */}
        <div
          onClick={() => onSelectTab('ndu')}
          className="group cursor-pointer rounded-2xl border border-slate-800 bg-[#0f1422] p-5 shadow-lg transition hover:border-slate-700 hover:bg-slate-800/50"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-2xl font-black text-sky-400">NDU / ISSU</span>
            <div className="rounded-lg bg-sky-950/60 p-2 text-sky-400 border border-sky-800/40">
              <Rocket className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-200">
            Firmware Code Upgrades
          </p>
          <p className="text-xs text-slate-400 pt-1">
            Pre-flight audits, non-disruptive execution sequences, and rollback contingencies.
          </p>
        </div>

        {/* Card 4: P1 Playbooks */}
        <div
          onClick={() => onSelectTab('p1')}
          className="group cursor-pointer rounded-2xl border border-rose-900/40 bg-[#160e18] p-5 shadow-lg transition hover:border-rose-800 hover:bg-rose-950/30"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-2xl font-black text-rose-400">P1 Playbooks</span>
            <div className="rounded-lg bg-rose-950/80 p-2 text-rose-400 border border-rose-800/50">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-semibold text-rose-200">
            Emergency Recovery
          </p>
          <p className="text-xs text-slate-400 pt-1">
            Step-by-step triage for slow-drain, aggregate exhaustion, and SRDF failovers.
          </p>
        </div>
      </section>

      {/* Two-Column Operational Section: Platform Overview + Interactive SAN Tool */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Storage Vendor Overview Matrix */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Vendor Architectures at a Glance</h2>
            <span className="text-xs text-slate-400">Click any card to open portal</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* NetApp ONTAP */}
            <div
              onClick={() => onSelectTab('netapp')}
              className="cursor-pointer rounded-2xl border border-cyan-900/40 bg-slate-900/60 p-5 transition hover:border-cyan-500/60 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-white">NetApp ONTAP</h3>
                </div>
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400 border border-cyan-800">
                  SAN / NAS
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Unified storage OS for AFF &amp; FAS. Master SVMs, FlexVols, LUN mappings, igroups, and SnapMirror DR relationships.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-cyan-400 font-medium">
                <span>View 20+ CLI Commands</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Dell EMC PowerMax */}
            <div
              onClick={() => onSelectTab('powermax')}
              className="cursor-pointer rounded-2xl border border-amber-900/40 bg-slate-900/60 p-5 transition hover:border-amber-500/60 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <h3 className="font-bold text-white">EMC PowerMax</h3>
                </div>
                <span className="rounded bg-amber-950 px-2 py-0.5 text-xs text-amber-400 border border-amber-800">
                  NVMe / Symmetrix
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                High-end mission-critical enterprise SAN. Masking Views (SG + PG + IG), SYMCLI operations, and SRDF synchronous replication.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-amber-400 font-medium">
                <span>View SYMCLI Reference</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Cisco SAN MDS */}
            <div
              onClick={() => onSelectTab('cisco')}
              className="cursor-pointer rounded-2xl border border-blue-900/40 bg-slate-900/60 p-5 transition hover:border-blue-500/60 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Network className="h-5 w-5 text-blue-400" />
                  <h3 className="font-bold text-white">Cisco SAN MDS</h3>
                </div>
                <span className="rounded bg-blue-950 px-2 py-0.5 text-xs text-blue-400 border border-blue-800">
                  NX-OS Fabric
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Director &amp; fabric switches running NX-OS. VSAN segmentation, CFS distributed device-alias, and slow-drain credit detection.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-blue-400 font-medium">
                <span>View NX-OS Commands</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Brocade FOS */}
            <div
              onClick={() => onSelectTab('brocade')}
              className="cursor-pointer rounded-2xl border border-purple-900/40 bg-slate-900/60 p-5 transition hover:border-purple-500/60 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-5 w-5 text-purple-400" />
                  <h3 className="font-bold text-white">Brocade FOS</h3>
                </div>
                <span className="rounded bg-purple-950 px-2 py-0.5 text-xs text-purple-400 border border-purple-800">
                  Fabric OS
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                Fibre Channel fabric switching. Real-time porterrshow analysis, aliCreate / zoneCreate pipelines, and firmwaredownload.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-purple-400 font-medium">
                <span>View FOS Cheatsheet</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Quick WWN Formatter & SAN Helper Widget */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Quick WWN Formatter</h3>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
              64-bit Hex
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Paste unformatted WWPN from ESXi, Windows, or AIX to clean and generate standard colon-separated hex format.
          </p>

          <div className="space-y-2">
            <input
              type="text"
              value={quickWwn}
              onChange={(e) => handleFormatWwn(e.target.value)}
              placeholder="e.g. 20000025b511aa01"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />

            {formattedWwn ? (
              <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-cyan-300">Valid WWPN Format:</span>
                  <button
                    onClick={() => copyToClipboard(formattedWwn)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-200"
                  >
                    {wwnCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{wwnCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-white font-semibold break-all bg-slate-900/80 p-1.5 rounded">
                  {formattedWwn}
                </p>
                <div className="text-[10px] text-slate-400">
                  Ready for Brocade <code>aliCreate</code> or Cisco <code>device-alias</code>.
                </div>
              </div>
            ) : quickWwn ? (
              <p className="text-[11px] text-rose-400">
                Must contain exactly 16 hexadecimal characters (0-9, a-f). Current: {quickWwn.replace(/[^0-9a-fA-F]/g, '').length}/16
              </p>
            ) : null}
          </div>

          {/* Quick links to deeper tools */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => onSelectTab('zoning')}
              className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-blue-600/30 transition"
            >
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5" />
                <span>Full Dual-Fabric Zoning Generator</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onSelectTab('prompts')}
              className="flex w-full items-center justify-between rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              <span>AI Storage Log Analyzer</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
