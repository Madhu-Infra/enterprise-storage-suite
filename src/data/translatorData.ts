import { CommandTranslation } from '../types/storage';

export const TRANSLATOR_DATA: CommandTranslation[] = [
  {
    id: 'tr-provision-lun',
    operation: 'Create LUN / Storage Volume & Present to Host',
    category: 'Provisioning',
    description: 'Provisions raw block storage device and maps it to a host initiator group or masking view.',
    commands: {
      netapp: 'lun create -vserver <svm> -path /vol/<vol>/<lun> -size <size> -ostype vmware\nlun map -vserver <svm> -path /vol/<vol>/<lun> -igroup <igroup>',
      powermax: 'symdev -sid <sid> create -tdev -cap <size> -cap_type GB -N 1 -sg <sg_name>\n(Masking view automatically presents new device to host)',
      cisco: '(SAN fabric level - ensures VSAN zoning connects Host PWWN to Storage Target PWWN)',
      brocade: '(SAN fabric level - ensures zone contains Host WWPN and Target Port WWPN)',
    },
    notes: 'In NetApp, LUN resides within a FlexVol. In PowerMax, TDEV is created and placed in a Storage Group (SG) associated with a Masking View (MV).',
  },
  {
    id: 'tr-expand-volume',
    operation: 'Expand / Grow Volume or LUN Capacity Online',
    category: 'Provisioning',
    description: 'Increases storage capacity of an existing volume or LUN without causing downtime.',
    commands: {
      netapp: 'volume size -vserver <svm> -volume <vol> -new-size +<size>\nlun resize -vserver <svm> -path /vol/<vol>/<lun> -size <new_size>',
      powermax: 'symdev -sid <sid> modify <dev_id> -tdev -cap <new_size> -cap_type GB',
      cisco: 'N/A (Fabric does not manage block allocation)',
      brocade: 'N/A (Fabric does not manage block allocation)',
    },
    notes: 'PowerMax allows expanding TDEV directly using Solutions Enabler or Unisphere. NetApp requires expanding both the containing volume (if full) and the LUN.',
  },
  {
    id: 'tr-host-login-audit',
    operation: 'Check Host / Target Login Status (FLOGI / FCP Login)',
    category: 'SAN Fabric & Connectivity',
    description: 'Queries which host HBAs and storage target ports are actively logged into the SAN fabric.',
    commands: {
      netapp: 'fcp initiator show -vserver <svm>\nnetwork fcp adapter show -node <node>',
      powermax: 'symaccess -sid <sid> list -type initiator\nsymcfg -sid <sid> list -fa all',
      cisco: 'show flogi database vsan <vsan_id>\nshow fcns database vsan <vsan_id>',
      brocade: 'switchshow\nnsshow\nportloginshow <port_index>',
    },
    notes: 'Cisco MDS uses `show flogi database` and FCNS database. Brocade uses `switchshow` for physical port states and `nsshow` for fabric name server registrations.',
  },
  {
    id: 'tr-port-errors',
    operation: 'Inspect Port Physical Errors, CRC, and Bit Inversions',
    category: 'Troubleshooting & Diagnostics',
    description: 'Checks for optical signal loss, damaged fiber cables, CRC frame corruptions, and invalid transmission words.',
    commands: {
      netapp: 'system node run -node <node> sysconfig -v <adapter>',
      powermax: 'symcfg -sid <sid> list -port_errors',
      cisco: 'show interface counters detailed\nshow interface fc<port> transceiver details',
      brocade: 'porterrshow\nsfpshow <port_index>',
    },
    notes: 'Brocade `porterrshow` and Cisco `show interface counters detailed` are the industry standards for discovering dirty fibers and failing SFPs.',
  },
  {
    id: 'tr-take-snapshot',
    operation: 'Create Instant Point-in-Time Snapshot',
    category: 'Data Protection',
    description: 'Captures an immediate, space-efficient zero-impact snapshot copy of the volume or storage group.',
    commands: {
      netapp: 'volume snapshot create -vserver <svm> -volume <vol> -snapshot <snap_name>',
      powermax: 'symsnapvx -sid <sid> -sg <sg_name> establish -name <snap_name>',
      cisco: 'N/A',
      brocade: 'N/A',
    },
    notes: 'NetApp snapshots are WAFL pointer copies with zero space reservation. PowerMax uses SnapVX with target-less snapshots.',
  },
  {
    id: 'tr-alias-configuration',
    operation: 'Create Friendly Alias for Host Port WWN',
    category: 'Zoning & Aliases',
    description: 'Associates a 16-hex WWPN with a descriptive human-readable hostname or HBA port name.',
    commands: {
      netapp: 'fcp alias create -vserver <svm> -alias <alias> -wwpn <wwpn>',
      powermax: 'symaccess -sid <sid> create -name <ig_name> -type initiator\nsymaccess -sid <sid> -name <ig_name> -type initiator add -wwn <wwn>',
      cisco: 'device-alias database\n  device-alias name <alias_name> pwwn <pwwn>\ndevice-alias commit',
      brocade: 'aliCreate "<alias_name>", "<pwwn>"',
    },
    notes: 'Cisco device-alias distributes across all switches via CFS. Brocade aliCreate is tied to the zoning database and activated via cfgSave / cfgEnable.',
  },
];
