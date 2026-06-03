import type {
  DeviceExampleMapEntry,
  DeviceExampleEntry,
  ParsedDeviceMetadata,
} from "./types.js";

export function generateDeviceExampleMapJson(
  devices: ParsedDeviceMetadata[],
): DeviceExampleMapEntry[] {
  const sorted = [...devices].sort((a, b) =>
    a.deviceId.localeCompare(b.deviceId),
  );

  return sorted.map((device) => {
    const examples: DeviceExampleEntry[] = device.examples
      .map((ex) => ({
        platform: ex.platform,
        localPath: ex.localPath,
        upstreamRepository: ex.upstreamRepository,
        upstreamPath: ex.upstreamPath,
        status: ex.status,
        verified: device.verified,
      }))
      .sort((a, b) => a.platform.localeCompare(b.platform));

    return {
      deviceId: device.deviceId,
      ...(device.deviceDashboardUrl
        ? { deviceDashboardUrl: device.deviceDashboardUrl }
        : {}),
      examples,
    };
  });
}
