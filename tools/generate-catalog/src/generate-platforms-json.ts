import type { PlatformEntry, UpstreamSource } from "./types.js";

export function generatePlatformsJson(sources: UpstreamSource[]): PlatformEntry[] {
  const byPlatform = new Map<string, string>();

  for (const source of sources) {
    if (!byPlatform.has(source.platform)) {
      byPlatform.set(source.platform, source.description);
    }
  }

  return [...byPlatform.entries()]
    .map(([id, description]) => ({ id, description }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
