import type { DeviceExampleMapEntry, DuplicatedDevice } from "./types.js";

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function formatUpstreamLabel(repo: string): string {
  return repo.replace(/^chirimen-oh\//, "");
}

export function detectDuplicatedDevices(
  deviceExampleMap: DeviceExampleMapEntry[],
): DuplicatedDevice[] {
  return [...deviceExampleMap]
    .filter((entry) => entry.examples.length >= 2)
    .sort((a, b) => a.deviceId.localeCompare(b.deviceId))
    .map((entry) => ({
      deviceId: entry.deviceId,
      platforms: uniqueSorted(entry.examples.map((ex) => ex.platform)),
      upstreams: uniqueSorted(
        entry.examples.map((ex) => formatUpstreamLabel(ex.upstreamRepository)),
      ),
    }));
}
