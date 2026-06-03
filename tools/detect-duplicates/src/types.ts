export interface CatalogInput {
  examples: ExampleEntry[];
  deviceExampleMap: DeviceExampleMapEntry[];
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

export interface DeviceExampleMapEntry {
  deviceId: string;
  deviceDashboardUrl?: string;
  examples: ExampleEntry[];
}

export interface DuplicatedDevice {
  deviceId: string;
  platforms: string[];
  upstreams: string[];
}
