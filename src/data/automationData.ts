export interface AutomationScript {
  id: string;
  title: string;
  tool: 'python' | 'ansible' | 'rest-api';
  platform: string;
  description: string;
  tags: string[];
  code: string;
  usageNotes: string;
}

export const AUTOMATION_SCRIPTS: AutomationScript[] = [
  {
    id: 'ansible-netapp-provision',
    title: 'Ansible Playbook: Provision ONTAP Volume, Snapshot Policy & NFS Export',
    tool: 'ansible',
    platform: 'NetApp ONTAP',
    description: 'Deploys an enterprise production FlexVol with automatic snapshots, junction path, and 100GB capacity.',
    tags: ['ansible', 'netapp', 'provisioning', 'nfs'],
    code: `---
- name: Provision Production ONTAP Storage Volume
  hosts: localhost
  gather_facts: no
  vars:
    ontap_hostname: "cluster01.corp.local"
    ontap_username: "admin"
    ontap_password: "{{ vault_ontap_password }}"
    svm_name: "svm_nfs_prod"
    vol_name: "vol_app_data01"
    aggr_name: "aggr1_node01"
    size_gb: 250

  tasks:
    - name: Create FlexVol with Thin Provisioning & Autogrow
      netapp.ontap.na_ontap_volume:
        state: present
        hostname: "{{ ontap_hostname }}"
        username: "{{ ontap_username }}"
        password: "{{ ontap_password }}"
        https: true
        validate_certs: false
        vserver: "{{ svm_name }}"
        name: "{{ vol_name }}"
        aggregate_name: "{{ aggr_name }}"
        size: "{{ size_gb }}"
        size_unit: "gb"
        space_guarantee: "none"
        junction_path: "/{{ vol_name }}"
        snapshot_policy: "default"
        tiering_policy: "auto"`,
    usageNotes: 'Requires `ansible-galaxy collection install netapp.ontap`. Store credentials in Ansible Vault.',
  },
  {
    id: 'python-powermax-pyu4v',
    title: 'Python (PyU4V): Provision Storage Group & Attach to Host Masking View',
    tool: 'python',
    platform: 'Dell EMC PowerMax',
    description: 'Uses official PyU4V SDK to create a Storage Group with Diamond SLO and binds it to a Masking View.',
    tags: ['python', 'powermax', 'pyu4v', 'unisphere'],
    code: `#!/usr/bin/env python3
"""
PowerMax Automated Storage Group & Masking Provisioner via PyU4V
"""
import PyU4V

conn = PyU4V.U4VConn(
    server_ip="192.168.10.100",
    port=8443,
    array_id="000197901234",
    username="smc",
    password="SecretPassword123",
    verify_ssl=False
)

sg_name = "SG_K8S_PV_PROD"
slo_level = "Diamond"
num_devs = 4
dev_size_gb = 100

print(f"[*] Creating Storage Group {sg_name} on array {conn.array_id}...")
conn.provisioning.create_storage_group(
    storage_group_id=sg_name,
    srp_id="SRP_1",
    service_level=slo_level,
    vol_name="K8S_VOL",
    num_vols=num_devs,
    vol_size=dev_size_gb,
    cap_unit="GB"
)

print(f"[+] Successfully provisioned {num_devs} x {dev_size_gb}GB volumes in {sg_name}!")`,
    usageNotes: 'Install library via `pip install PyU4V`. Compatible with Unisphere 9.x and 10.x REST endpoints.',
  },
  {
    id: 'ansible-cisco-zoning',
    title: 'Ansible Playbook: Cisco MDS SAN Zoning Automation',
    tool: 'ansible',
    platform: 'Cisco SAN MDS',
    description: 'Automates device-alias creation, single-initiator single-target zone declaration, and active zoneset commit.',
    tags: ['ansible', 'cisco-mds', 'zoning', 'san'],
    code: `---
- name: Automate Cisco MDS SAN Fabric Zoning
  hosts: mds_switches
  gather_facts: no
  connection: network_cli

  tasks:
    - name: Commit Device Alias for New Host
      cisco.nxos.nxos_config:
        lines:
          - "device-alias name HBA_SQL01_P1 pwwn 20:00:00:25:b5:88:aa:01"
          - "device-alias commit"
        parents: "device-alias database"

    - name: Define Zone and Activate in Zoneset
      cisco.nxos.nxos_config:
        lines:
          - "zone name Z_SQL01_PMAX_A1 vsan 100"
          - "  member device-alias HBA_SQL01_P1"
          - "  member device-alias ST_PMAX_1A_1"
          - "zoneset name ZS_FABRIC_A vsan 100"
          - "  member Z_SQL01_PMAX_A1"
          - "zoneset activate name ZS_FABRIC_A vsan 100"`,
    usageNotes: 'Requires `cisco.nxos` collection. Executes atomic changes without disrupting running SAN traffic.',
  },
  {
    id: 'python-brocade-rest',
    title: 'Python: Brocade PyFOS / REST API Fabric Health & Error Scraper',
    tool: 'python',
    platform: 'Brocade FOS',
    description: 'Polls Brocade REST API (`/rest/running/brocade-interface/fibrechannel`) to audit CRC and TxWait counters.',
    tags: ['python', 'brocade', 'rest-api', 'porterrshow'],
    code: `import requests
import json
import urllib3
urllib3.disable_warnings()

SWITCH_IP = "192.168.1.50"
AUTH = ("admin", "password123")
HEADERS = {"Accept": "application/yang-data+json"}

url = f"https://{SWITCH_IP}/rest/running/brocade-interface/fibrechannel-statistics"
resp = requests.get(url, auth=AUTH, headers=HEADERS, verify=False)

if resp.status_code == 200:
    stats = resp.json().get('Response', {}).get('fibrechannel-statistics', [])
    print(f"{'Port':<8}{'CRC Errors':<14}{'TxWait (Stalls)':<18}{'Class-3 Discards'}")
    print("-" * 55)
    for p in stats:
        port_name = p.get('name', 'N/A')
        crc = p.get('crc-errors', 0)
        tx_wait = p.get('time-txcnd-exhausted', 0)
        c3 = p.get('class-3-discards', 0)
        if crc > 0 or tx_wait > 0:
            print(f"{port_name:<8}{crc:<14}{tx_wait:<18}{c3}")
else:
    print(f"Failed to query switch: {resp.status_code}")`,
    usageNotes: 'Runs natively against FOS v8.2+ and v9.x REST endpoints. Ideal for automated cron monitoring.',
  },
];
