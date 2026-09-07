import { NduGuide } from '../types/storage';

export const NDU_GUIDES_DATA: NduGuide[] = [
  {
    id: 'ndu-netapp-ontap',
    platform: 'netapp',
    platformName: 'NetApp ONTAP 9.x',
    recommendedVersion: 'ONTAP 9.14.1P4 (Target GA)',
    method: 'Automated Non-Disruptive Upgrade (ANDU)',
    preChecks: [
      {
        title: 'Cluster & Node Failover Readiness Check',
        command: 'cluster image validate -version <target_version>',
        passCriteria: 'Validation status must return "Passed with no warnings".',
      },
      {
        title: 'Storage Failover Interconnect & SFO Status',
        command: 'storage failover show',
        passCriteria: 'All partner nodes must show "Connected to <partner>" and "Takeover possible: true".',
      },
      {
        title: 'LIF Health & SAN Multipath Redundancy',
        command: 'network interface show -is-home false',
        passCriteria: 'Output must be empty (all LIFs must reside on their designated home nodes).',
      },
      {
        title: 'Disk & Aggregate Health Audit',
        command: 'storage disk show -broken ; storage aggregate show -state !online',
        passCriteria: 'No broken disks; all aggregates in online state; no ongoing parity scrubbing.',
      },
    ],
    executionSteps: [
      {
        step: 1,
        title: 'Download Image package to Cluster Package Repository',
        command: 'cluster image package get -url http://<internal_web_server>/9141P4_q_image.tgz',
        notes: 'Verifies checksum and stores software image across all node boot media.',
      },
      {
        step: 2,
        title: 'Launch Automated Non-Disruptive Upgrade (ANDU)',
        command: 'cluster image update -version 9.14.1P4',
        notes: 'ONTAP automatically sequences node takeovers, upgrades partner kernel, reboots, waits for giveback and LIF stabilization, then repeats for the next HA pair.',
      },
      {
        step: 3,
        title: 'Monitor Live ANDU Progress & Phase Updates',
        command: 'cluster image show-update-progress',
        notes: 'Watch for phase transitions: In-Progress -> Takeover -> Waiting for giveback -> Completed.',
      },
    ],
    postChecks: [
      {
        title: 'Verify Cluster Node Software Versions',
        command: 'version -v ; cluster image show',
        passCriteria: 'All nodes must report the identical target ONTAP version.',
      },
      {
        title: 'Verify LIF Home Reversion',
        command: 'network interface revert * ; network interface show -is-home false',
        passCriteria: 'Zero non-home LIFs detected; all interfaces balanced across controllers.',
      },
      {
        title: 'Inspect Autosupport Trigger Notification',
        command: 'system autosupport history show -node * -sort-by seq-num -desc',
        passCriteria: 'Autosupport triggered "UPGRADE_COMPLETED" with status sent-ok.',
      },
    ],
    rollbackGuide: [
      'If ANDU halts during phase 1: Issue `cluster image cancel-update` to abort before irreversible metadata writes.',
      'If node fails to give back: Inspect `storage failover show-giveback` for vetoes (CIFS open files or snapshot locks) and resolve before forcing.',
    ],
  },
  {
    id: 'ndu-cisco-mds',
    platform: 'cisco',
    platformName: 'Cisco MDS 9000 SAN Director / Fabric Switch',
    recommendedVersion: 'NX-OS 9.3(2b)',
    method: 'In-Service Software Upgrade (ISSU)',
    preChecks: [
      {
        title: 'Verify Dual Supervisor Engine Redundancy (Directors)',
        command: 'show system redundancy status',
        passCriteria: 'Active and Standby supervisors in "ha-standby" state with full configuration sync.',
      },
      {
        title: 'Validate In-Service Software Upgrade Compatibility',
        command: 'show install all impact kickstart bootflash:<kickstart_img> system bootflash:<system_img>',
        passCriteria: 'Upgrade method must report "ISSU: Non-disruptive" for all modules.',
      },
      {
        title: 'Check Bootflash Free Space (Minimum 1.5GB required)',
        command: 'dir bootflash: ; show file system',
        passCriteria: 'Bootflash has > 2,000,000 KB free space.',
      },
    ],
    executionSteps: [
      {
        step: 1,
        title: 'Copy Software Images to Active & Standby Supervisors',
        command: 'copy scp://admin@server/m9000-ek9-kickstart.9.3.2b.bin bootflash:\ncopy scp://admin@server/m9000-ek9-mz.9.3.2b.bin bootflash:',
        notes: 'Images will automatically sync to standby bootflash on directors.',
      },
      {
        step: 2,
        title: 'Trigger Non-Disruptive ISSU',
        command: 'install all kickstart bootflash:m9000-ek9-kickstart.9.3.2b.bin system bootflash:m9000-ek9-mz.9.3.2b.bin',
        notes: 'Confirm prompt. Switch updates standby supervisor, switches control non-disruptively, and hits linecards.',
      },
    ],
    postChecks: [
      {
        title: 'Verify Active Image & Running Version',
        command: 'show version ; show module',
        passCriteria: 'All modules and supervisors report target 9.3(2b) and state "ok".',
      },
      {
        title: 'Audit FLOGI and FCNS Active Device Registrations',
        command: 'show flogi database ; show fcns database',
        passCriteria: 'Total device count identical to pre-maintenance baseline snapshot.',
      },
    ],
    rollbackGuide: [
      'If ISSU pre-check indicates disruptive upgrade: STOP. Do not proceed during production hours; plan outage or maintenance window.',
      'Check EPLD compatibility if linecards require FPGA upgrades.',
    ],
  },
  {
    id: 'ndu-brocade-fos',
    platform: 'brocade',
    platformName: 'Brocade Fabric OS (FOS) Gen 6 & Gen 7',
    recommendedVersion: 'FOS v9.1.1d / v9.2.0b',
    method: 'firmwaredownload Non-Disruptive Dual-CP Upgrade',
    preChecks: [
      {
        title: 'Audit High Availability & CP Synchronization (Directors)',
        command: 'hashow ; firmwareshow',
        passCriteria: 'Local CP and Remote CP synchronized; HA state "Active/Standby healthy".',
      },
      {
        title: 'Fabric Consistency & Principal Switch State',
        command: 'fabricshow ; switchshow',
        passCriteria: 'Switch is Healthy; no segmented ports; Domain ID stable.',
      },
      {
        title: 'Clear Port Stats to Establish Clean Telemetry Baseline',
        command: 'statsclear',
        passCriteria: 'Port error counters reset to 0 for post-upgrade delta verification.',
      },
    ],
    executionSteps: [
      {
        step: 1,
        title: 'Execute Interactive Non-Disruptive Firmware Download',
        command: 'firmwaredownload',
        notes: 'Input FTP/SCP host IP, username, password, and path to FOS release directory. Answer "yes" to proceed with non-disruptive dual-CP firmware activation.',
      },
      {
        step: 2,
        title: 'Monitor Live Firmware Upgrade Daemon Status',
        command: 'firmwaredownloadstatus',
        notes: 'Displays progress across primary slot, standby slot reboot, failover, and linecard firmware flashing.',
      },
    ],
    postChecks: [
      {
        title: 'Confirm Dual-CP Active Version',
        command: 'firmwareshow',
        passCriteria: 'Both CP0 and CP1 report the exact target FOS build.',
      },
      {
        title: 'Check Effective Configuration and Active Zoneset',
        command: 'cfgactvshow ; switchshow',
        passCriteria: 'Active configuration loaded and unchanged; all F-Ports and E-Ports online.',
      },
    ],
    rollbackGuide: [
      'If firmware download fails before second CP reboot: Use `firmwarerestore` to revert to previous image slot.',
      'Never power cycle switch while firmwaredownload status is in firmware commit phase.',
    ],
  },
  {
    id: 'ndu-powermax',
    platform: 'powermax',
    platformName: 'Dell EMC PowerMax 2000 / 8000 / 2500 / 8500',
    recommendedVersion: 'PowerMaxOS 10.1 (Target Release)',
    method: 'Dell Service Directed Microcode NDU',
    preChecks: [
      {
        title: 'Validate Health & Director Status (symcfg)',
        command: 'symcfg -sid <sid> verify -director_status',
        passCriteria: 'All emulation directors (FA, DA, RA, EDS) reporting online and balanced.',
      },
      {
        title: 'Check Lockbox & Microcode Sync',
        command: 'symaudit -sid <sid> list',
        passCriteria: 'No uncommitted schema changes or pending locks.',
      },
      {
        title: 'Verify SRDF Consistency State Across Links',
        command: 'symrdf -sid <sid> list',
        passCriteria: 'All active RDF groups synchronized or consistent; no half-split states.',
      },
    ],
    executionSteps: [
      {
        step: 1,
        title: 'Pre-load Microcode Package onto Service Processor',
        command: 'symcfg -sid <sid> load -pkg <pkg_id>',
        notes: 'Distributes microcode bundles across engine director memory.',
      },
      {
        step: 2,
        title: 'Execute Engine-by-Engine Sequential Microcode Flash',
        command: 'symcfg -sid <sid> upgrade -microcode -online',
        notes: 'Director pairs failover I/O to sibling directors in engine enclosure while firmware restarts.',
      },
    ],
    postChecks: [
      {
        title: 'Confirm Installed Microcode Build',
        command: 'symcfg -sid <sid> list -v | grep "Microcode Version"',
        passCriteria: 'Target microcode build confirmed on all directors.',
      },
      {
        title: 'Verify Masking Views & Host Pathing',
        command: 'symaccess -sid <sid> list view',
        passCriteria: 'All masking views online; zero device errors.',
      },
    ],
    rollbackGuide: [
      'Engine failover is automatic. If an engine fails health audit, NDU pauses automatically and prompts rollback to prior microcode slot without disruption to remaining engines.',
    ],
  },
];
