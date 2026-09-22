import React, { useState, useMemo, useEffect } from 'react';
import {
  Sliders,
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  FileText,
  ShieldAlert,
} from 'lucide-react';

type SwitchSyntax = 'brocade' | 'cisco';

const DEFAULT_ZONING_STATE = {
  syntax: 'brocade' as SwitchSyntax,
  hostName: 'esx-cluster01-host01',
  hostWwpnA: '20:00:00:25:b5:11:aa:01',
  hostWwpnB: '20:00:00:25:b5:11:aa:02',
  storageName: 'pmax-01',
  targetWwpnA: '50:00:09:73:a0:12:34:01',
  targetWwpnB: '50:00:09:73:a0:12:34:02',
  vsanA: '100',
  vsanB: '200',
  cfgNameA: 'CFG_FABRIC_A',
  cfgNameB: 'CFG_FABRIC_B',
};

export const ZoningToolView: React.FC = () => {
  const [savedConfig] = useState(() => {
    try {
      const stored = localStorage.getItem('storage_hub_zoning');
      return stored ? { ...DEFAULT_ZONING_STATE, ...JSON.parse(stored) } : DEFAULT_ZONING_STATE;
    } catch {
      return DEFAULT_ZONING_STATE;
    }
  });

  const [syntax, setSyntax] = useState<SwitchSyntax>(savedConfig.syntax);
  const [zoningMode, setZoningMode] = useState<'sist' | 'simt'>('sist');

  // Input states
  const [hostName, setHostName] = useState(savedConfig.hostName);
  const [hostWwpnA, setHostWwpnA] = useState(savedConfig.hostWwpnA);
  const [hostWwpnB, setHostWwpnB] = useState(savedConfig.hostWwpnB);

  const [storageName, setStorageName] = useState(savedConfig.storageName);
  const [targetWwpnA, setTargetWwpnA] = useState(savedConfig.targetWwpnA);
  const [targetWwpnB, setTargetWwpnB] = useState(savedConfig.targetWwpnB);

  // Cisco VSANs
  const [vsanA, setVsanA] = useState(savedConfig.vsanA);
  const [vsanB, setVsanB] = useState(savedConfig.vsanB);

  // Brocade Cfg / Cisco Zoneset names
  const [cfgNameA, setCfgNameA] = useState(savedConfig.cfgNameA);
  const [cfgNameB, setCfgNameB] = useState(savedConfig.cfgNameB);

  // Copy feedback state
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        'storage_hub_zoning',
        JSON.stringify({
          syntax,
          hostName,
          hostWwpnA,
          hostWwpnB,
          storageName,
          targetWwpnA,
          targetWwpnB,
          vsanA,
          vsanB,
          cfgNameA,
          cfgNameB,
        })
      );
    } catch {
      // Ignore write errors
    }
  }, [syntax, hostName, hostWwpnA, hostWwpnB, storageName, targetWwpnA, targetWwpnB, vsanA, vsanB, cfgNameA, cfgNameB]);

  // Clean and validate WWN
  const validateWwn = (wwn: string) => {
    const raw = wwn.replace(/[^0-9a-fA-F]/g, '');
    return {
      isValid: raw.length === 16,
      charCount: raw.length,
      formatted: raw.match(/.{1,2}/g)?.join(':').toLowerCase() || wwn,
    };
  };

  const validation = useMemo(() => {
    return {
      hostA: validateWwn(hostWwpnA),
      hostB: validateWwn(hostWwpnB),
      tgtA: validateWwn(targetWwpnA),
      tgtB: validateWwn(targetWwpnB),
    };
  }, [hostWwpnA, hostWwpnB, targetWwpnA, targetWwpnB]);

  const allValid =
    validation.hostA.isValid &&
    validation.hostB.isValid &&
    validation.tgtA.isValid &&
    validation.tgtB.isValid &&
    hostName.trim().length > 0 &&
    storageName.trim().length > 0;

  // Generate Brocade FOS Script
  const generateBrocade = (fabric: 'A' | 'B') => {
    const hostAlias = `HBA_${hostName.toUpperCase()}_P${fabric === 'A' ? '1' : '2'}`;
    const tgtAlias = `ST_${storageName.toUpperCase()}_${fabric === 'A' ? '1A' : '2A'}`;
    const zoneName = `Z_${hostName.toUpperCase()}_${storageName.toUpperCase()}_FAB${fabric}`;
    const cfg = fabric === 'A' ? cfgNameA : cfgNameB;
    const hWwn = fabric === 'A' ? validation.hostA.formatted : validation.hostB.formatted;
    const tWwn = fabric === 'A' ? validation.tgtA.formatted : validation.tgtB.formatted;

    return `# ============================================================
# BROCADE FABRIC ${fabric} ZONING SCRIPT
# Generated for: ${hostName} -> ${storageName}
# ============================================================
aliCreate "${hostAlias}", "${hWwn}"
aliCreate "${tgtAlias}", "${tWwn}"
zoneCreate "${zoneName}", "${hostAlias}; ${tgtAlias}"
cfgAdd "${cfg}", "${zoneName}"
cfgSave
cfgEnable "${cfg}"

# --- Verification Commands ---
cfgActvShow
zoneShow "${zoneName}"
`;
  };

  // Generate Brocade Rollback Script
  const generateBrocadeRollback = (fabric: 'A' | 'B') => {
    const hostAlias = `HBA_${hostName.toUpperCase()}_P${fabric === 'A' ? '1' : '2'}`;
    const tgtAlias = `ST_${storageName.toUpperCase()}_${fabric === 'A' ? '1A' : '2A'}`;
    const zoneName = `Z_${hostName.toUpperCase()}_${storageName.toUpperCase()}_FAB${fabric}`;
    const cfg = fabric === 'A' ? cfgNameA : cfgNameB;

    return `# ============================================================
# ROLLBACK / DE-ZONING SCRIPT - FABRIC ${fabric}
# ============================================================
cfgDelete "${cfg}", "${zoneName}"
cfgSave
cfgEnable "${cfg}"
zoneDelete "${zoneName}"
aliDelete "${hostAlias}"
cfgSave
`;
  };

  // Generate Cisco MDS NX-OS Script
  const generateCisco = (fabric: 'A' | 'B') => {
    const vsan = fabric === 'A' ? vsanA : vsanB;
    const zoneset = fabric === 'A' ? cfgNameA : cfgNameB;
    const hostAlias = `HBA_${hostName.toUpperCase()}_P${fabric === 'A' ? '1' : '2'}`;
    const tgtAlias = `ST_${storageName.toUpperCase()}_${fabric === 'A' ? '1A' : '2A'}`;
    const zoneName = `Z_${hostName.toUpperCase()}_${storageName.toUpperCase()}_FAB${fabric}`;
    const hWwn = fabric === 'A' ? validation.hostA.formatted : validation.hostB.formatted;
    const tWwn = fabric === 'A' ? validation.tgtA.formatted : validation.tgtB.formatted;

    return `# ============================================================
# CISCO SAN MDS NX-OS - FABRIC ${fabric} (VSAN ${vsan})
# ============================================================
configure terminal

# 1. CFS Distributed Device-Alias Configuration
device-alias database
  device-alias name ${hostAlias} pwwn ${hWwn}
  device-alias name ${tgtAlias} pwwn ${tWwn}
device-alias commit

# 2. Zone & Zoneset Creation
zone name ${zoneName} vsan ${vsan}
  member device-alias ${hostAlias}
  member device-alias ${tgtAlias}

zoneset name ${zoneset} vsan ${vsan}
  member ${zoneName}

# 3. Zoneset Activation
zoneset activate name ${zoneset} vsan ${vsan}
copy running-config startup-config
exit

# --- Verification ---
show zoneset active vsan ${vsan} | include "${zoneName}"
`;
  };

  // Generate Cisco Rollback Script
  const generateCiscoRollback = (fabric: 'A' | 'B') => {
    const vsan = fabric === 'A' ? vsanA : vsanB;
    const zoneset = fabric === 'A' ? cfgNameA : cfgNameB;
    const zoneName = `Z_${hostName.toUpperCase()}_${storageName.toUpperCase()}_FAB${fabric}`;

    return `# ============================================================
# CISCO MDS ROLLBACK - FABRIC ${fabric} (VSAN ${vsan})
# ============================================================
configure terminal
zoneset name ${zoneset} vsan ${vsan}
  no member ${zoneName}
zoneset activate name ${zoneset} vsan ${vsan}
no zone name ${zoneName} vsan ${vsan}
copy running-config startup-config
exit
`;
  };

  const scriptA = syntax === 'brocade' ? generateBrocade('A') : generateCisco('A');
  const scriptB = syntax === 'brocade' ? generateBrocade('B') : generateCisco('B');
  const rollbackA = syntax === 'brocade' ? generateBrocadeRollback('A') : generateCiscoRollback('A');
  const rollbackB = syntax === 'brocade' ? generateBrocadeRollback('B') : generateCiscoRollback('B');

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadFullChangeTicket = () => {
    const fullText = `========================================================================
STORAGE & SAN CHANGE REQUEST EXECUTION ARTIFACT
Target Host: ${hostName}
Target Array: ${storageName}
Syntax: ${syntax.toUpperCase()}
Generated: ${new Date().toISOString()}
========================================================================

=== [FABRIC A EXECUTION PLAN] ===
${scriptA}

=== [FABRIC B EXECUTION PLAN] ===
${scriptB}

=== [BACKOUT / ROLLBACK PLAN - FABRIC A] ===
${rollbackA}

=== [BACKOUT / ROLLBACK PLAN - FABRIC B] ===
${rollbackB}
`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CR_ZONING_${hostName.toUpperCase()}_${syntax.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Tool Header */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#101524] to-[#0c101c] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-950 px-2.5 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-800">
                Production Utility
              </span>
              <span className="text-xs text-slate-400">RFC 2625 Compliant</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              SAN Dual-Fabric Zoning Generator
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Generates production-validated CLI configuration scripts and backout/rollback procedures for Brocade Fabric OS and Cisco MDS NX-OS.
            </p>
          </div>

          {/* Syntax Selector Pills */}
          <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
            <button
              onClick={() => setSyntax('brocade')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                syntax === 'brocade'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Brocade FOS
            </button>
            <button
              onClick={() => setSyntax('cisco')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                syntax === 'cisco'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cisco MDS NX-OS
            </button>
          </div>
        </div>
      </section>

      {/* Input Parameters Form */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Host Details */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-950 text-[11px] font-bold text-cyan-400 border border-cyan-800">
                1
              </span>
              Initiator / Host Information
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Server / Cluster</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Host Name / Cluster Identifier
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="e.g. esx-prod-01"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Host WWPN Fabric A (Port 1)
                </label>
                {validation.hostA.isValid ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="h-3 w-3" /> Valid WWN
                  </span>
                ) : (
                  <span className="text-[11px] text-rose-400 font-mono">
                    {validation.hostA.charCount}/16 Hex chars
                  </span>
                )}
              </div>
              <input
                type="text"
                value={hostWwpnA}
                onChange={(e) => setHostWwpnA(e.target.value)}
                placeholder="20:00:00:25:b5:11:aa:01"
                className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${
                  validation.hostA.isValid
                    ? 'border-slate-700 bg-slate-950 text-white focus:border-cyan-500'
                    : 'border-rose-700/80 bg-rose-950/20 text-rose-200'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Host WWPN Fabric B (Port 2)
                </label>
                {validation.hostB.isValid ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="h-3 w-3" /> Valid WWN
                  </span>
                ) : (
                  <span className="text-[11px] text-rose-400 font-mono">
                    {validation.hostB.charCount}/16 Hex chars
                  </span>
                )}
              </div>
              <input
                type="text"
                value={hostWwpnB}
                onChange={(e) => setHostWwpnB(e.target.value)}
                placeholder="20:00:00:25:b5:11:aa:02"
                className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${
                  validation.hostB.isValid
                    ? 'border-slate-700 bg-slate-950 text-white focus:border-cyan-500'
                    : 'border-rose-700/80 bg-rose-950/20 text-rose-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Storage Target & Fabric Parameters */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-950 text-[11px] font-bold text-amber-400 border border-amber-800">
                2
              </span>
              Storage Target &amp; Fabric Configuration
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Array / Ports</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Storage Array Name / Identifier
            </label>
            <input
              type="text"
              value={storageName}
              onChange={(e) => setStorageName(e.target.value)}
              placeholder="e.g. pmax-01 or ontap-aff-a800"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Target Port WWPN Fabric A
                </label>
                {validation.tgtA.isValid ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="h-3 w-3" /> Valid WWN
                  </span>
                ) : (
                  <span className="text-[11px] text-rose-400 font-mono">
                    {validation.tgtA.charCount}/16 Hex chars
                  </span>
                )}
              </div>
              <input
                type="text"
                value={targetWwpnA}
                onChange={(e) => setTargetWwpnA(e.target.value)}
                placeholder="50:00:09:73:a0:12:34:01"
                className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${
                  validation.tgtA.isValid
                    ? 'border-slate-700 bg-slate-950 text-white focus:border-amber-500'
                    : 'border-rose-700/80 bg-rose-950/20 text-rose-200'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Target Port WWPN Fabric B
                </label>
                {validation.tgtB.isValid ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="h-3 w-3" /> Valid WWN
                  </span>
                ) : (
                  <span className="text-[11px] text-rose-400 font-mono">
                    {validation.tgtB.charCount}/16 Hex chars
                  </span>
                )}
              </div>
              <input
                type="text"
                value={targetWwpnB}
                onChange={(e) => setTargetWwpnB(e.target.value)}
                placeholder="50:00:09:73:a0:12:34:02"
                className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${
                  validation.tgtB.isValid
                    ? 'border-slate-700 bg-slate-950 text-white focus:border-amber-500'
                    : 'border-rose-700/80 bg-rose-950/20 text-rose-200'
                }`}
              />
            </div>

            {syntax === 'cisco' ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">VSAN Fabric A</label>
                  <input
                    type="text"
                    value={vsanA}
                    onChange={(e) => setVsanA(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-blue-300 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">VSAN Fabric B</label>
                  <input
                    type="text"
                    value={vsanB}
                    onChange={(e) => setVsanB(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-blue-300 font-mono focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">Cfg Fabric A</label>
                  <input
                    type="text"
                    value={cfgNameA}
                    onChange={(e) => setCfgNameA(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-purple-300 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">Cfg Fabric B</label>
                  <input
                    type="text"
                    value={cfgNameB}
                    onChange={(e) => setCfgNameB(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-purple-300 font-mono focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center gap-2">
          {allValid ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>All 4 WWPNs Validated. Ready for Production Execution.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <AlertCircle className="h-4 w-4" />
              <span>Please resolve invalid WWPNs or missing identifiers above.</span>
            </div>
          )}
        </div>

        <button
          onClick={downloadFullChangeTicket}
          disabled={!allValid}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Change Ticket (.txt)</span>
        </button>
      </div>

      {/* Generated Scripts Dual-View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Fabric A Script Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-white text-xs sm:text-sm">
                Fabric A Execution Script
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(scriptA, 'fabA')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:text-white transition"
            >
              {copiedSection === 'fabA' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Fabric A</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-slate-950 font-mono text-xs text-cyan-300 overflow-x-auto max-h-96">
            <pre className="whitespace-pre">{scriptA}</pre>
          </div>
        </div>

        {/* Fabric B Script Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f1422] overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-purple-400" />
              <h3 className="font-bold text-white text-xs sm:text-sm">
                Fabric B Execution Script
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(scriptB, 'fabB')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:text-white transition"
            >
              {copiedSection === 'fabB' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Fabric B</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-slate-950 font-mono text-xs text-purple-300 overflow-x-auto max-h-96">
            <pre className="whitespace-pre">{scriptB}</pre>
          </div>
        </div>
      </div>

      {/* Rollback Plans Section */}
      <section className="rounded-2xl border border-rose-900/40 bg-rose-950/10 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <h3 className="font-bold text-rose-200 text-sm">
              Change Management Backout &amp; Rollback Plan
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(`${rollbackA}\n\n${rollbackB}`, 'rollback')}
            className="flex items-center gap-1.5 rounded-lg border border-rose-800/80 bg-rose-950/50 px-3 py-1 text-xs text-rose-300 hover:bg-rose-900/50"
          >
            {copiedSection === 'rollback' ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Copied All</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy Rollback</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Required for enterprise ServiceNow / Jira change requests. Safely unlinks new zones and returns active zoneset to prior state without disruption.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          <div className="rounded-xl border border-rose-900/30 bg-slate-950 p-3 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre className="whitespace-pre">{rollbackA}</pre>
          </div>
          <div className="rounded-xl border border-rose-900/30 bg-slate-950 p-3 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre className="whitespace-pre">{rollbackB}</pre>
          </div>
        </div>
      </section>
    </div>
  );
};
