import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2, Layers, Cpu } from 'lucide-react';
import { AUTOMATION_SCRIPTS, AutomationScript } from '../data/automationData';

export const AutomationView: React.FC = () => {
  const [filterTool, setFilterTool] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredScripts = AUTOMATION_SCRIPTS.filter((s) => {
    if (filterTool === 'all') return true;
    return s.tool === filterTool;
  });

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="rounded-3xl border border-teal-900/40 bg-gradient-to-r from-[#0c1a17] to-[#0a101c] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-teal-950 px-2.5 py-0.5 text-xs font-bold text-teal-400 border border-teal-800">
                INFRASTRUCTURE AS CODE
              </span>
              <span className="text-xs text-slate-400">DevOps &amp; SRE Automation</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Python &amp; Ansible Automation Hub
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Battle-tested automation playbooks and SDK scripts using official collections for NetApp ONTAP, Dell EMC PyU4V, Cisco MDS, and Brocade FOS.
            </p>
          </div>

          <div className="flex gap-1.5 rounded-xl border border-slate-700 bg-slate-900 p-1">
            <button
              onClick={() => setFilterTool('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filterTool === 'all'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTool('ansible')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filterTool === 'ansible'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ansible
            </button>
            <button
              onClick={() => setFilterTool('python')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filterTool === 'python'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python SDK
            </button>
          </div>
        </div>
      </section>

      {/* Script Cards */}
      <div className="space-y-6">
        {filteredScripts.map((script) => (
          <div
            key={script.id}
            className="rounded-2xl border border-slate-800 bg-[#0f1422] overflow-hidden shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-3 gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase font-mono ${
                    script.tool === 'ansible'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}
                >
                  {script.tool}
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {script.platform}
                </span>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  {script.title}
                </h3>
              </div>

              <button
                onClick={() => copyCode(script.id, script.code)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                {copiedId === script.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-300">{script.description}</p>

              {/* Code display */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-teal-300 overflow-x-auto">
                <pre className="whitespace-pre">{script.code}</pre>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                <span>{script.usageNotes}</span>
                <div className="flex gap-1">
                  {script.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
