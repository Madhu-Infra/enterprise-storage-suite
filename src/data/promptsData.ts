import { StoragePrompt } from '../types/storage';

export const PROMPTS_DATA: StoragePrompt[] = [
  {
    id: 'prompt-porterrshow',
    title: 'Brocade porterrshow / CRC Error Deep Diagnostics',
    category: 'SAN Diagnostics',
    targetPlatform: 'Brocade Fabric OS',
    description: 'Instructs AI to analyze a raw porterrshow terminal dump, identify bad SFPs vs bad cables, and pinpoint slow-drain ports.',
    systemRole: 'Senior SAN Fabric Architect & FC Protocol Specialist',
    promptTemplate: `You are an expert SAN fabric engineer specializing in Brocade Fabric OS.
Analyze the following \`porterrshow\` and \`sfpshow\` output from my Brocade SAN director.
1. Categorize all ports into: Critical (Hardware Failure), Degraded (Optical/Cable Loss), or Stalled (Slow Drain / TxWait).
2. For any port with incrementing CRC without enc-out vs CRC with enc-out, explain whether the root cause is cable/connector reflection or internal ASIC error.
3. Check tim_txcnd / tx_wait values and identify if any edge F-Port is starving ISL buffer-to-buffer credits.
4. Output exact remediation CLI commands to isolate or clean up the suspect links.

RAW OUTPUT:
{PASTE_YOUR_PORTERRSHOW_HERE}`,
    sampleInput: `              frames      enc    crc    crc    too    too    bad    enc   disc   link   loss   loss   frjt   fbsy   c3fc   tim
       rTx         rRx    in     err    gds    shrt   long   eof    out   c3     fail   sync   sig                  txcnd  txcnd
 12:  12.4m       11.8m    0     4821     0      0      0      0    1204    0      0      0      0      0      0      0      0
 18:   4.2m        3.9m    0        0     0      0      0      0       0  150      0      0      0      0      0  48102  48102`,
  },
  {
    id: 'prompt-ontap-asup',
    title: 'NetApp EMS Event Log & Autosupport Triage',
    category: 'Storage System Triage',
    targetPlatform: 'NetApp ONTAP',
    description: 'Diagnoses ONTAP EMS log events (e.g. wafl.vol.full, scsi.cmd.aborted, vifmgr.lif.down) and generates an incident recovery brief.',
    systemRole: 'Principal NetApp Certified Implementation Engineer (NCIE SAN/NAS)',
    promptTemplate: `You are a NetApp storage specialist reviewing EMS / AutoSupport events for a P1 incident.
Given the following EMS messages:
1. Decode the event codes and state the primary cascading failure.
2. Determine if any storage aggregate or volume is within 5 minutes of hard read-only lockdown.
3. Identify affected SVMs, LIFs, and host mount points.
4. Provide a 4-step emergency recovery CLI sequence with copyable ONTAP 9.x commands.

EMS LOGS:
{PASTE_EMS_LOGS_HERE}`,
    sampleInput: `Sun Sep 07 14:12:01 UTC [cluster01-01: wafl_exempt00: wafl.vol.full:alert]: Volume 'vol_ora_db_01@vserver:svm_san_prod' is full (using 100% of available space).
Sun Sep 07 14:12:04 UTC [cluster01-01: kernel: scsi.cmd.aborted:error]: SCSI command aborted on LUN /vol/vol_ora_db_01/lun_data01: Space exhausted.`,
  },
  {
    id: 'prompt-powermax-slo',
    title: 'PowerMax SLO Latency & Masking View Health Review',
    category: 'Performance Tuning',
    targetPlatform: 'Dell EMC PowerMax',
    description: 'Reviews IOPS, response time (RT), and queue depth telemetry to isolate host bottleneck vs backend flash contention.',
    systemRole: 'Dell Technologies Proven Professional Storage Architect',
    promptTemplate: `You are evaluating a Dell EMC PowerMax 8000 array exhibiting latency spikes on a critical Oracle RAC cluster.
Analyze the following symstat and symsg metrics:
1. Is the latency dominated by Front-End (FA/Director) queue wait, Cache wait, or Backend (DA/Disk) flash skew?
2. Is the Storage Group compliant with its assigned SLO (Diamond: <0.8ms vs Platinum: <1.2ms)?
3. Recommend whether to adjust host Queue Depth, rebalance port groups across director pairs, or isolate heavy sequential backups.

METRICS DUMP:
{PASTE_SYMSTAT_DUMP_HERE}`,
    sampleInput: `SG: SG_ORACLE_RAC_PROD | SLO: Diamond | Current RT: 4.2ms (Target: <0.8ms)
FE Read RT: 3.8ms | FE Write RT: 4.5ms | Cache Hit%: 98.2%
FA 1D: 88% Utilization | FA 2D: 91% Utilization | FA 1E: 14% Utilization | FA 2E: 12% Utilization`,
  },
  {
    id: 'prompt-san-design',
    title: 'SAN Fabric Architecture & Dual-Fabric Redundancy Audit',
    category: 'Architecture & Design',
    targetPlatform: 'Cisco MDS & Brocade FOS',
    description: 'Reviews SAN topology, ISL trunk subscription ratios, and zoning policies to eliminate single points of failure (SPOF).',
    systemRole: 'Lead Enterprise Datacenter Infrastructure Architect',
    promptTemplate: `Conduct an enterprise architecture audit of the following dual-fabric SAN topology.
Assess:
1. Oversubscription ratio across Host Edge F-Ports vs Core ISL Trunk bandwidth (recommended: < 4:1 for OLTP).
2. Best-practice zoning enforcement: Verify Single-Initiator Single-Target (SIST) compliance.
3. Air-gap separation between Fabric A and Fabric B (ensure zero shared ISLs or domain overlaps).
4. List top 3 architectural risks and a concrete hardening remediation matrix.

TOPOLOGY DETAILS:
{PASTE_SAN_TOPOLOGY_DETAILS_HERE}`,
    sampleInput: `Fabric A: Cisco MDS 9710 Core + 4x MDS 9148V Edge. 192x 32Gb Host ports, 4x 32Gb ISL to Core.
Target: NetApp AFF A800 (4x 32Gb ports) + PowerMax 2000 (8x 16Gb ports).
Zoning: Single Initiator Multiple Target (SIMT) with 6 targets per host zone.`,
  },
];
