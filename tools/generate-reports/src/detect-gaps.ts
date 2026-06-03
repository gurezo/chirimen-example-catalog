import { access } from "node:fs/promises";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { collectMetadataFiles } from "../../generate-catalog/src/collect-metadata-files.js";
import { parseMetadataContent } from "../../generate-catalog/src/parse-metadata.js";
import { parseNoDeviceDirIds } from "./parse-sync-summary.js";
import type {
  CatalogInput,
  MissingDashboardLinkEntry,
  MissingDeviceMetadataEntry,
  MissingPlatformDirEntry,
} from "./types.js";

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function detectMissingDeviceMetadata(
  repoRoot: string,
  syncSummaryContent: string,
): Promise<MissingDeviceMetadataEntry[]> {
  const upstreamIds = parseNoDeviceDirIds(syncSummaryContent);
  const entries: MissingDeviceMetadataEntry[] = [];

  for (const deviceId of upstreamIds) {
    const metadataPath = path.join(
      repoRoot,
      "examples/devices",
      deviceId,
      "metadata.md",
    );
    if (!(await pathExists(metadataPath))) {
      entries.push({
        deviceId,
        note: "upstream に Example があるが examples/devices/<device-id>/metadata.md が無い",
      });
    }
  }

  return entries;
}

export async function detectMissingPlatformDirs(
  repoRoot: string,
  catalog: CatalogInput,
): Promise<MissingPlatformDirEntry[]> {
  const entries: MissingPlatformDirEntry[] = [];

  for (const example of catalog.examples) {
    const localPath = path.join(repoRoot, example.localPath);
    if (!(await pathExists(localPath))) {
      entries.push({
        deviceId: example.deviceId,
        platform: example.platform,
        localPath: example.localPath,
      });
    }
  }

  return entries.sort((a, b) => {
    const byDevice = a.deviceId.localeCompare(b.deviceId);
    if (byDevice !== 0) return byDevice;
    return a.platform.localeCompare(b.platform);
  });
}

export async function detectMissingDashboardLinks(
  repoRoot: string,
): Promise<MissingDashboardLinkEntry[]> {
  const metadataPaths = await collectMetadataFiles(repoRoot);
  const entries: MissingDashboardLinkEntry[] = [];

  for (const filePath of metadataPaths) {
    const content = await readFile(filePath, "utf8");
    const label = path.relative(repoRoot, filePath);
    const parsed = parseMetadataContent(content, label);
    if (!parsed.deviceDashboardUrl) {
      entries.push({
        deviceId: parsed.deviceId,
        metadataPath: label,
      });
    }
  }

  return entries.sort((a, b) => a.deviceId.localeCompare(b.deviceId));
}
