export interface ExampleEntry {
  deviceId: string;
  platform: string;
  localPath: string;
  upstreamRepository: string;
  upstreamPath: string;
  status: string;
  verified: boolean;
}

export interface CatalogInput {
  examples: ExampleEntry[];
}

export interface MissingDeviceMetadataEntry {
  deviceId: string;
  note: string;
}

export interface MissingPlatformDirEntry {
  deviceId: string;
  platform: string;
  localPath: string;
}

export interface MissingDashboardLinkEntry {
  deviceId: string;
  metadataPath: string;
}
