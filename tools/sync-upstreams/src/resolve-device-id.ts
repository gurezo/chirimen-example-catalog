import { validateDeviceId } from "../../create-device/src/validate-device-id.js";

const LEGACY_GC_PREFIXES = ["i2c-", "gpio-"] as const;

function tryValidate(candidate: string): string | null {
  try {
    validateDeviceId(candidate);
    return candidate;
  } catch {
    return null;
  }
}

function normalizeLegacyGcName(dirName: string): string | null {
  const lower = dirName.toLowerCase();
  for (const prefix of LEGACY_GC_PREFIXES) {
    if (lower.startsWith(prefix)) {
      const stripped = lower.slice(prefix.length);
      return tryValidate(stripped);
    }
  }
  return null;
}

export function resolveDeviceId(upstreamDirName: string): string | null {
  const direct = tryValidate(upstreamDirName);
  if (direct) {
    return direct;
  }

  const lower = upstreamDirName.toLowerCase();
  const fromLower = tryValidate(lower);
  if (fromLower) {
    return fromLower;
  }

  return normalizeLegacyGcName(upstreamDirName);
}
