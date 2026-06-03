export interface Catalog {
  examples: ExampleEntry[];
  platforms: PlatformEntry[];
  deviceExampleMap: DeviceExampleMapEntry[];
  upstreams: UpstreamEntry[];
}

export interface ExampleEntry {
  deviceId: string;
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
  examples: ExampleEntry[];
}

export interface UpstreamEntry {
  id: string;
  repo: string;
  branch: string;
  path: string;
  platform: string;
  priority: string;
}
