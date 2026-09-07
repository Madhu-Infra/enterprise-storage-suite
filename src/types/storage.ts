export type StorageVendor = 'netapp' | 'powermax' | 'cisco' | 'brocade';

export type HubTab =
  | 'dashboard'
  | 'netapp'
  | 'powermax'
  | 'cisco'
  | 'brocade'
  | 'zoning'
  | 'p1'
  | 'ndu'
  | 'translator'
  | 'automation'
  | 'prompts';

export type CommandLevel = 'basic' | 'intermediate' | 'advanced' | 'destructive' | 'emergency';

export interface CommandParameter {
  name: string;
  placeholder: string;
  defaultVal: string;
  description: string;
}

export interface StorageCommand {
  id: string;
  vendor: StorageVendor;
  category: string;
  title: string;
  description: string;
  syntax: string;
  example: string;
  level: CommandLevel;
  tags: string[];
  parameters?: CommandParameter[];
  impactNote?: string;
  verificationCommand?: string;
}

export interface PlaybookStep {
  stepNumber: number;
  instruction: string;
  command: string;
  expectedOutput: string;
  abnormalIndication: string;
  actionIfAbnormal: string;
}

export interface EmergencyPlaybook {
  id: string;
  title: string;
  severity: 'P1 - Critical Outage' | 'P2 - Degraded / Redundancy Loss' | 'P3 - Performance Bottleneck';
  platforms: StorageVendor[];
  estimatedTtr: string;
  summary: string;
  symptoms: string[];
  rootCauses: string[];
  triageSteps: PlaybookStep[];
  emergencyRemediation: string[];
  verificationChecklist: string[];
}

export interface NduGuide {
  id: string;
  platform: StorageVendor;
  platformName: string;
  recommendedVersion: string;
  method: string;
  preChecks: { title: string; command: string; passCriteria: string }[];
  executionSteps: { step: number; title: string; command: string; notes: string }[];
  postChecks: { title: string; command: string; passCriteria: string }[];
  rollbackGuide: string[];
}

export interface CommandTranslation {
  id: string;
  operation: string;
  category: string;
  description: string;
  commands: {
    netapp?: string;
    powermax?: string;
    cisco?: string;
    brocade?: string;
  };
  notes: string;
}

export interface StoragePrompt {
  id: string;
  title: string;
  category: string;
  targetPlatform: string;
  description: string;
  systemRole: string;
  promptTemplate: string;
  sampleInput: string;
}
