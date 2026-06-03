export interface ExampleEntry {
  deviceId: string;
  platform: string;
  localPath: string;
  upstreamRepository: string;
  upstreamPath: string;
  status: string;
  verified: boolean;
}

export interface DeviceExampleEntry {
  platform: string;
  localPath: string;
  upstreamRepository: string;
  upstreamPath: string;
  status: string;
  verified: boolean;
}

export interface PlatformEntry {
  id: string;
  description: string;
}

export interface DeviceExampleMapEntry {
  deviceId: string;
  deviceDashboardUrl?: string;
  examples: DeviceExampleEntry[];
}

export interface UpstreamEntry {
  id: string;
  repo: string;
  branch: string;
  path: string;
  platform: string;
  priority: string;
}

export interface ParsedExample {
  platform: string;
  localPath: string;
  upstreamRepository: string;
  upstreamPath: string;
  status: string;
}

export interface ParsedDeviceMetadata {
  deviceId: string;
  deviceDashboardUrl?: string;
  verified: boolean;
  examples: ParsedExample[];
}

export interface UpstreamSource {
  id: string;
  repo: string;
  branch: string;
  path: string;
  platform: string;
  priority: string;
  description: string;
}

export interface UpstreamSourcesFile {
  sources: UpstreamSource[];
}
