import type { UpstreamEntry, UpstreamSource } from "./types.js";

export function generateUpstreamsJson(sources: UpstreamSource[]): UpstreamEntry[] {
  return sources
    .map((source) => ({
      id: source.id,
      repo: source.repo,
      branch: source.branch,
      path: source.path,
      platform: source.platform,
      priority: source.priority,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
