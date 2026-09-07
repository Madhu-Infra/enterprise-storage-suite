import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert,
  Terminal,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { PLAYBOOKS_DATA } from '../data/playbooksData';
import { EmergencyPlaybook } from '../types/storage';

export const PlaybooksView: React.FC = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<EmergencyPlaybook>(PLAYBOOKS_DATA[0]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleStep = (stepNumber: number) => {
    const key = `${selectedPlaybook.id}-${stepNumber}`;
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyCommand = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="rounded-3xl border border-rose-900/60 bg-gradient-to-r from-[#1f0f18] to-[#120c15] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-rose-950 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-800 animate-pulse">
                INCIDENT RESPONSE
              </span>
              <span className="text-xs text-slate-400">War Room Operational Playbooks</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Emergency P1 Outage Playbooks
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Deterministic, production-validated diagnostic trees and remediation commands for severe storage outages.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-rose-800/80 bg-rose-950/40 px-4 py-2.5 text-xs text-rose-300">
            <Clock className="h-4 w-4 text-rose-400" />
            <span>Target TTR: <strong>15 - 30 Minutes</strong></span>
          </div>
        </div>
      </section>

      {/* Playbook Selector Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PLAYBOOKS_DATA.map((pb) => {
          const isSelected = selectedPlaybook.id === pb.id;
          return (
            <button
              key={pb.id}
              onClick={() => setSelectedPlaybook(pb)}
              className={`rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500'
                  : 'border-slate-800 bg-[#0f1422] hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono">
                  {pb.severity.split(' - ')[0]}
                </span>
                <span className="text-[10px] text-slate-400">{pb.estimatedTtr}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                {pb.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Playbook Content */}
      <div className="space-y-6">
        {/* Playbook Overview Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] p-6 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded bg-rose-950 px-2 py-0.5 font-bold text-rose-400 border border-rose-800">
                  {selectedPlaybook.severity}
                </span>
                <span className="text-slate-400">Target Platforms:</span>
                <div className="flex gap-1 font-mono uppercase text-cyan-400 font-semibold">
                  {selectedPlaybook.platforms.join(', ')}
                </div>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">
                {selectedPlaybook.title}
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedPlaybook.summary}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-2">
            {/* Symptoms */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Observable Production Symptoms
              </h3>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {selectedPlaybook.symptoms.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Root Causes */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Primary Root Causes
              </h3>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {selectedPlaybook.rootCauses.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Step-by-Step Triage Workflow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              Triage &amp; Isolation Steps
            </h3>
            <span className="text-xs text-slate-400">
              Check off steps as you execute in the war room
            </span>
          </div>

          <div className="space-y-3">
            {selectedPlaybook.triageSteps.map((step) => {
              const stepKey = `${selectedPlaybook.id}-${step.stepNumber}`;
              const isChecked = !!completedSteps[stepKey];

              return (
                <div
                  key={step.stepNumber}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isChecked
                      ? 'border-emerald-800/80 bg-emerald-950/10'
                      : 'border-slate-800 bg-[#0f1422]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-slate-900/70 p-4 gap-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleStep(step.stepNumber)}
                        className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-500 text-black'
                            : 'border-slate-600 bg-slate-800 hover:border-slate-400'
                        }`}
                      >
                        {isChecked && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>
                      <span className="text-sm font-bold text-white">
                        Step {step.stepNumber}: {step.instruction}
                      </span>
                    </div>

                    <button
                      onClick={() => copyCommand(stepKey, step.command)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:text-white"
                    >
                      {copiedKey === stepKey ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Diagnostic CLI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Command display */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-cyan-300 overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{step.command}</pre>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                      <div className="rounded-xl bg-slate-900/60 p-3 border border-slate-800">
                        <span className="font-bold text-slate-300 block mb-1">Expected Normal Output:</span>
                        <p className="text-slate-400">{step.expectedOutput}</p>
                      </div>

                      <div className="rounded-xl bg-rose-950/20 p-3 border border-rose-900/30">
                        <span className="font-bold text-rose-300 block mb-1">Abnormal / Failure Trigger:</span>
                        <p className="text-slate-300">{step.abnormalIndication}</p>
                        <p className="text-amber-300 mt-1 font-semibold">Action: {step.actionIfAbnormal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Remediation Actions */}
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/10 p-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Emergency Recovery &amp; Remediation Directives
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            {selectedPlaybook.emergencyRemediation.map((rem, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-950 text-[10px] font-bold text-amber-400 border border-amber-800 mt-0.5">
                  {idx + 1}
                </span>
                <span>{rem}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Verification Checklist */}
        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/10 p-6 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Post-Recovery Verification Checklist
          </h3>
          <ul className="space-y-2 text-xs text-slate-200">
            {selectedPlaybook.verificationChecklist.map((ver, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{ver}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
