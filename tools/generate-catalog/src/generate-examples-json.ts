import type { ExampleEntry, ParsedDeviceMetadata } from "./types.js";

export function generateExamplesJson(
  devices: ParsedDeviceMetadata[],
): ExampleEntry[] {
  const entries: ExampleEntry[] = [];

  for (const device of devices) {
    for (const ex of device.examples) {
      entries.push({
        deviceId: device.deviceId,
        platform: ex.platform,
        localPath: ex.localPath,
        upstreamRepository: ex.upstreamRepository,
        upstreamPath: ex.upstreamPath,
        status: ex.status,
        verified: device.verified,
      });
    }
  }

  return entries.sort((a, b) => {
    const byDevice = a.deviceId.localeCompare(b.deviceId);
    if (byDevice !== 0) return byDevice;
    return a.platform.localeCompare(b.platform);
  });
}
