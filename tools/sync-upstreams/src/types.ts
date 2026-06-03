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

export type CopyAction =
  | "copied"
  | "skipped-protected"
  | "skipped-no-marker"
  | "skipped-unknown-device-id"
  | "skipped-no-device-dir"
  | "skipped-non-src";

export interface CopyLogEntry {
  sourceId: string;
  upstreamDirName: string;
  deviceId?: string;
  platform: string;
  relativePath: string;
  action: CopyAction;
}

export interface SourceSyncResult {
  sourceId: string;
  repo: string;
  branch: string;
  path: string;
  platform: string;
  mirrorPath: string;
  commitSha?: string;
  exampleCount: number;
  errors: string[];
  copyLog: CopyLogEntry[];
}

export interface SyncSummary {
  generatedAt: string;
  repoRoot: string;
  sources: SourceSyncResult[];
  fatalErrors: string[];
}
