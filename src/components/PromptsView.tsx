import React, { useState } from 'react';
import { Bot, Copy, Check, Sparkles, Send, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import { PROMPTS_DATA } from '../data/promptsData';
import { StoragePrompt } from '../types/storage';

export const PromptsView: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<StoragePrompt>(PROMPTS_DATA[0]);
  const [customInput, setCustomInput] = useState(PROMPTS_DATA[0].sampleInput);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleSelectPrompt = (prompt: StoragePrompt) => {
    setSelectedPrompt(prompt);
    setCustomInput(prompt.sampleInput);
    setAnalysisResult(null);
  };

  const copyPrompt = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Realistic expert storage diagnostic simulation
    setTimeout(() => {
      setIsAnalyzing(false);
      if (selectedPrompt.id === 'prompt-porterrshow') {
        setAnalysisResult(`[+] SAN FABRIC DIAGNOSTIC ASSESSMENT:
--------------------------------------------------
1. Port 18: SEVERE SLOW-DRAIN DETECTED (tim_txcnd: 48,102).
   - Root Cause: Edge F-Port device (host HBA or SAN controller) is failing to return B2B credits, stalling ISLs and causing Class-3 discards (disc c3: 150).
   - Immediate Remediation:
     * Brocade FOS: portdisable 18
     * Verify ISL credit flow: statsclear ; sleep 30 ; porterrshow

2. Port 12: OPTICAL / PHYSICAL MEDIA ERROR (crc err: 4,821, enc out: 1,204).
   - Root Cause: Matching CRC and enc-out increments indicate physical layer bit-level corruption (bad patch cable, dirty LC connector, or failing SFP).
   - Action: Inspect SFP Rx power with \`sfpshow 12\`. Clean fiber end-faces with One-Click cleaner.`);
      } else if (selectedPrompt.id === 'prompt-ontap-asup') {
        setAnalysisResult(`[+] NETAPP ONTAP 9.x INCIDENT TRIAGE:
--------------------------------------------------
1. Critical Alert: Volume 'vol_ora_db_01' is at 100% capacity; SCSI write commands are actively ABORTING.
2. Immediate Risk: Database corruption or emergency read-only freeze within 60 seconds.
3. Emergency Action Sequence:
   * Expand volume immediately:
     volume size -vserver svm_san_prod -volume vol_ora_db_01 -new-size +500GB
   * Enable emergency autogrow:
     volume modify -vserver svm_san_prod -volume vol_ora_db_01 -space-mgmt-try-first volume_grow -autosize-mode grow_shrink -max-autosize 3TB
   * Re-enable paused LUNs:
     lun modify -vserver svm_san_prod -path /vol/vol_ora_db_01/lun_data01 -state online`);
      } else if (selectedPrompt.id === 'prompt-powermax-slo') {
        setAnalysisResult(`[+] POWERMAX SLO PERFORMANCE REVIEW:
--------------------------------------------------
1. Bottleneck Root Cause: Front-End Director Asymmetry & Contention.
   - Directors FA 1D & 2D are running at >88-91% utilization, causing front-end response time to spike to 4.2ms (exceeding Diamond SLO target of <0.8ms).
   - Backend DA utilization and cache hit rate (98.2%) remain healthy.
2. Recommended Action:
   * Rebalance host initiator paths across FA 1E and 2E (currently idle at 12-14%).
   * Update Port Group in Masking View:
     symaccess -sid 1234 -name PG_ORACLE_FA add -dir 1E -port 0`);
      } else {
        setAnalysisResult(`[+] SAN TOPOLOGY AUDIT & SIZING:
--------------------------------------------------
1. Risk Detected: Oversubscription ratio across Edge to Core ISL is 48:1 (exceeds recommended 4:1).
2. Zone Policy: Single-Initiator Multiple-Target (SIMT) with 6 targets risks cross-talk RSCN storms.
3. Hardening Recommendation:
   * Convert zones to Single-Initiator Single-Target (SIST).
   * Activate trunking on 4 additional core ISL links.`);
      }
    }, 900);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <section className="rounded-3xl border border-violet-900/40 bg-gradient-to-r from-[#170e24] to-[#0a101c] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-violet-950 px-2.5 py-0.5 text-xs font-bold text-violet-400 border border-violet-800">
                AI PROMPT WORKSPACE
              </span>
              <span className="text-xs text-slate-400">Engineered for LLMs &amp; AI Agents</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              AI Storage Prompt Library
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Prompt templates tailored for storage engineering: log analysis, porterrshow decoding, root-cause isolation, and capacity forecasting.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-violet-800 bg-violet-950/30 p-3 text-xs text-violet-300">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>Tested with Gemini 1.5 &amp; Claude 3.5</span>
          </div>
        </div>
      </section>

      {/* Prompts Selector Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROMPTS_DATA.map((p) => {
          const isSelected = selectedPrompt.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPrompt(p)}
              className={`rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? 'border-violet-500 bg-violet-950/40 shadow-lg shadow-violet-950/50 ring-1 ring-violet-500'
                  : 'border-slate-800 bg-[#0f1422] hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider font-mono">
                  {p.category}
                </span>
                <span className="text-[10px] text-slate-400">{p.targetPlatform.split(' ')[0]}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                {p.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Prompt Editor & Interactive Playground */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Prompt Template */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">{selectedPrompt.title}</h2>
              <p className="text-xs text-slate-400">{selectedPrompt.description}</p>
            </div>
            <button
              onClick={() => copyPrompt('prompt-body', selectedPrompt.promptTemplate)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:text-white"
            >
              {copiedKey === 'prompt-body' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-violet-300 block mb-1">
              System Persona:
            </span>
            <p className="text-xs text-slate-300 bg-slate-900 p-2 rounded-lg font-mono">
              {selectedPrompt.systemRole}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-300 block mb-1">
              Prompt Instructions:
            </span>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{selectedPrompt.promptTemplate}</pre>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Log Input & Diagnostic Runner */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              Live Terminal Log Input &amp; Triage Simulator
            </h2>
            <button
              onClick={() => setCustomInput(selectedPrompt.sampleInput)}
              className="text-xs text-cyan-400 hover:underline"
            >
              Reset Sample
            </button>
          </div>

          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            rows={6}
            placeholder="Paste raw porterrshow, EMS logs, or symstat output..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-cyan-300 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/20 transition hover:from-violet-500 hover:to-indigo-500 active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="animate-pulse">Analyzing SAN Log Telemetry...</span>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Simulate AI Expert Analysis</span>
              </>
            )}
          </button>

          {/* Analysis Output */}
          {analysisResult && (
            <div className="rounded-xl border border-violet-800/60 bg-violet-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  AI Expert Diagnostic Report
                </span>
                <button
                  onClick={() => copyPrompt('analysis-report', analysisResult)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {copiedKey === 'analysis-report' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-slate-800">
                {analysisResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
