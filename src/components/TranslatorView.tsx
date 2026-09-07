import React, { useState, useMemo } from 'react';
import {
  Repeat,
  Search,
  Copy,
  Check,
  Database,
  Zap,
  Network,
  Cpu,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TRANSLATOR_DATA } from '../data/translatorData';

export const TranslatorView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredTranslations = useMemo(() => {
    if (!searchQuery.trim()) return TRANSLATOR_DATA;
    const q = searchQuery.toLowerCase();
    return TRANSLATOR_DATA.filter(
      (t) =>
        t.operation.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        Object.values(t.commands).some((cmd) => cmd?.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const copyCommand = (key: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="rounded-3xl border border-emerald-900/40 bg-gradient-to-r from-[#0d1c14] to-[#0a101c] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-800">
                CROSS-PLATFORM MATRIX
              </span>
              <span className="text-xs text-slate-400">Rosetta Stone for Storage Engineers</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              CLI Command Translator
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Translate operational tasks across NetApp ONTAP, Dell EMC PowerMax, Cisco MDS, and Brocade Fabric OS simultaneously.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operational task..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Translations List */}
      <div className="space-y-6">
        {filteredTranslations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-[#0f1422] p-5 shadow-lg space-y-4"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
                  {item.category}
                </span>
                <h2 className="mt-1 text-base font-bold text-white">
                  {item.operation}
                </h2>
              </div>
              <p className="text-xs text-slate-400 max-w-md">{item.description}</p>
            </div>

            {/* 4 Vendor Commands Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* NetApp ONTAP */}
              <div className="rounded-xl border border-cyan-900/40 bg-slate-950 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <Database className="h-3.5 w-3.5" />
                    <span>NetApp ONTAP</span>
                  </div>
                  {item.commands.netapp && (
                    <button
                      onClick={() => copyCommand(`${item.id}-netapp`, item.commands.netapp)}
                      className="text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      {copiedKey === `${item.id}-netapp` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <div className="font-mono text-xs text-cyan-200 overflow-x-auto min-h-[3rem] flex items-center">
                  <pre className="whitespace-pre-wrap">{item.commands.netapp || 'N/A for this layer'}</pre>
                </div>
              </div>

              {/* EMC PowerMax */}
              <div className="rounded-xl border border-amber-900/40 bg-slate-950 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Dell EMC PowerMax (SYMCLI)</span>
                  </div>
                  {item.commands.powermax && (
                    <button
                      onClick={() => copyCommand(`${item.id}-pmax`, item.commands.powermax)}
                      className="text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      {copiedKey === `${item.id}-pmax` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <div className="font-mono text-xs text-amber-200 overflow-x-auto min-h-[3rem] flex items-center">
                  <pre className="whitespace-pre-wrap">{item.commands.powermax || 'N/A for this layer'}</pre>
                </div>
              </div>

              {/* Cisco SAN MDS */}
              <div className="rounded-xl border border-blue-900/40 bg-slate-950 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                    <Network className="h-3.5 w-3.5" />
                    <span>Cisco SAN MDS (NX-OS)</span>
                  </div>
                  {item.commands.cisco && (
                    <button
                      onClick={() => copyCommand(`${item.id}-cisco`, item.commands.cisco)}
                      className="text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      {copiedKey === `${item.id}-cisco` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <div className="font-mono text-xs text-blue-200 overflow-x-auto min-h-[3rem] flex items-center">
                  <pre className="whitespace-pre-wrap">{item.commands.cisco || 'N/A for this layer'}</pre>
                </div>
              </div>

              {/* Brocade FOS */}
              <div className="rounded-xl border border-purple-900/40 bg-slate-950 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>Brocade FOS</span>
                  </div>
                  {item.commands.brocade && (
                    <button
                      onClick={() => copyCommand(`${item.id}-brocade`, item.commands.brocade)}
                      className="text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      {copiedKey === `${item.id}-brocade` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
                <div className="font-mono text-xs text-purple-200 overflow-x-auto min-h-[3rem] flex items-center">
                  <pre className="whitespace-pre-wrap">{item.commands.brocade || 'N/A for this layer'}</pre>
                </div>
              </div>
            </div>

            {/* Architectural Translation Note */}
            <div className="flex items-start gap-2 rounded-xl bg-slate-900/60 p-3 text-xs text-slate-300 border border-slate-800">
              <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{item.notes}</span>
            </div>
          </div>
        ))}

        {filteredTranslations.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No matching translation operations found for &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};
