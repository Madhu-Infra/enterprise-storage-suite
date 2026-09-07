import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Shield,
  ArrowRight,
  RefreshCcw,
  Terminal,
} from 'lucide-react';
import { NDU_GUIDES_DATA } from '../data/nduData';
import { NduGuide, StorageVendor } from '../types/storage';

export const NduView: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<NduGuide>(NDU_GUIDES_DATA[0]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checkedPre, setCheckedPre] = useState<Record<string, boolean>>({});

  const togglePre = (title: string) => {
    setCheckedPre((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const copyCommand = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="rounded-3xl border border-rose-900/40 bg-gradient-to-r from-[#180e1a] to-[#0d0f1a] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-rose-950 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-800">
                LIFECYCLE MANAGEMENT
              </span>
              <span className="text-xs text-slate-400">Zero Downtime Architecture</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Non-Disruptive Upgrade (NDU) Center
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Pre-flight audits, step-by-step rolling firmware sequencing, and rollback procedures for ONTAP, Cisco MDS, Brocade FOS, and PowerMax.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
            <span className="text-slate-400 block font-semibold">Recommended GA Target:</span>
            <span className="font-mono text-cyan-300 font-bold text-sm">
              {selectedGuide.recommendedVersion}
            </span>
          </div>
        </div>
      </section>

      {/* Platform Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {NDU_GUIDES_DATA.map((guide) => (
          <button
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              selectedGuide.id === guide.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {guide.platformName}
          </button>
        ))}
      </div>

      {/* Main Guide Content */}
      <div className="space-y-6">
        {/* Method & Overview */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white">
              {selectedGuide.platformName} Upgrade Pipeline
            </h2>
            <span className="rounded bg-slate-800 px-2.5 py-1 text-xs font-mono text-cyan-300 border border-slate-700">
              Method: {selectedGuide.method}
            </span>
          </div>
        </div>

        {/* Phase 1: Pre-Upgrade Health Verification */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Phase 1: Pre-Upgrade Health Checks (Gatekeeper)
            </h3>
            <span className="text-xs text-slate-400">All checks must pass before proceeding</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selectedGuide.preChecks.map((chk, idx) => {
              const isPassed = !!checkedPre[chk.title];
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 transition ${
                    isPassed
                      ? 'border-emerald-800/80 bg-emerald-950/20'
                      : 'border-slate-800 bg-[#0f1422]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePre(chk.title)}
                        className={`flex h-5 w-5 items-center justify-center rounded border ${
                          isPassed
                            ? 'border-emerald-500 bg-emerald-500 text-black'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        {isPassed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </button>
                      <h4 className="text-xs font-bold text-white">{chk.title}</h4>
                    </div>

                    <button
                      onClick={() => copyCommand(`pre-${idx}`, chk.command)}
                      className="text-slate-400 hover:text-white"
                      title="Copy command"
                    >
                      {copiedKey === `pre-${idx}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="rounded bg-slate-950 p-2 font-mono text-[11px] text-cyan-300 overflow-x-auto my-2">
                    <code>{chk.command}</code>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    <strong className="text-slate-400">Pass Criteria:</strong> {chk.passCriteria}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 2: Execution Steps */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <Rocket className="h-4 w-4" /> Phase 2: Live Execution Sequencing
          </h3>

          <div className="space-y-3">
            {selectedGuide.executionSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-slate-800 bg-[#0f1422] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-950 text-xs font-bold text-rose-300 border border-rose-800">
                      {step.step}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {step.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => copyCommand(`exec-${step.step}`, step.command)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                  >
                    {copiedKey === `exec-${step.step}` ? (
                      <span className="text-emerald-400">Copied</span>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded bg-slate-950 p-2.5 font-mono text-xs text-cyan-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{step.command}</pre>
                </div>

                <p className="text-xs text-slate-400">{step.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 3: Post-Upgrade Verification */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Phase 3: Post-Upgrade Health Auditing
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {selectedGuide.postChecks.map((post, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#0f1422] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{post.title}</h4>
                  <button
                    onClick={() => copyCommand(`post-${idx}`, post.command)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === `post-${idx}` ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <div className="rounded bg-slate-950 p-2 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                  <code>{post.command}</code>
                </div>
                <p className="text-[11px] text-slate-400">{post.passCriteria}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rollback Contingency */}
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/10 p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Abort &amp; Rollback Protocols
          </h3>
          <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
            {selectedGuide.rollbackGuide.map((rb, idx) => (
              <li key={idx}>{rb}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
