import { access, copyFile, mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { CopyAction, CopyLogEntry } from "./types.js";

export const SYNC_MANAGED_MARKER = "<!-- sync-upstreams:managed -->";

const PROTECTED_BASENAMES = new Set(["metadata.md", "README.md"]);

type CopyExamplesParams = {
  repoRoot: string;
  sourceId: string;
  platform: string;
  deviceId: string;
  upstreamExamplePath: string;
};

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function deviceDirExists(repoRoot: string, deviceId: string): Promise<boolean> {
  return pathExists(path.join(repoRoot, "examples/devices", deviceId));
}

function platformDir(repoRoot: string, deviceId: string, platform: string): string {
  return path.join(repoRoot, "examples/devices", deviceId, "platforms", platform);
}

function isUnderSrc(relativePath: string): boolean {
  return relativePath === "src" || relativePath.startsWith("src/");
}

async function hasManagedMarker(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, "utf8");
  return content.includes(SYNC_MANAGED_MARKER);
}

async function collectFiles(
  rootDir: string,
  currentDir: string,
  relativePrefix: string,
): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const rel = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
    const abs = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(rootDir, abs, rel)));
    } else if (entry.isFile()) {
      files.push(rel);
    }
  }

  return files;
}

function logEntry(
  params: CopyExamplesParams,
  upstreamDirName: string,
  relativePath: string,
  action: CopyAction,
): CopyLogEntry {
  return {
    sourceId: params.sourceId,
    upstreamDirName,
    deviceId: params.deviceId,
    platform: params.platform,
    relativePath,
    action,
  };
}

export async function copyExamples(
  params: CopyExamplesParams,
  upstreamDirName: string,
): Promise<CopyLogEntry[]> {
  const log: CopyLogEntry[] = [];

  if (!(await deviceDirExists(params.repoRoot, params.deviceId))) {
    log.push({
      sourceId: params.sourceId,
      upstreamDirName,
      deviceId: params.deviceId,
      platform: params.platform,
      relativePath: "(device)",
      action: "skipped-no-device-dir",
    });
    return log;
  }

  const destPlatformDir = platformDir(
    params.repoRoot,
    params.deviceId,
    params.platform,
  );
  await mkdir(path.join(destPlatformDir, "src"), { recursive: true });

  const relativeFiles = await collectFiles(
    params.upstreamExamplePath,
    params.upstreamExamplePath,
    "",
  );

  for (const rel of relativeFiles) {
    const basename = path.basename(rel);

    if (PROTECTED_BASENAMES.has(basename)) {
      log.push(logEntry(params, upstreamDirName, rel, "skipped-protected"));
      continue;
    }

    if (!isUnderSrc(rel)) {
      log.push(logEntry(params, upstreamDirName, rel, "skipped-non-src"));
      continue;
    }

    const srcFile = path.join(params.upstreamExamplePath, rel);
    const destFile = path.join(destPlatformDir, rel);
    const destExists = await pathExists(destFile);

    if (destExists) {
      if (!(await hasManagedMarker(destFile))) {
        log.push(logEntry(params, upstreamDirName, rel, "skipped-no-marker"));
        continue;
      }
    }

    await mkdir(path.dirname(destFile), { recursive: true });
    await copyFile(srcFile, destFile);
    log.push(logEntry(params, upstreamDirName, rel, "copied"));
  }

  return log;
}

export async function copyExamplesForUnknownDeviceId(
  sourceId: string,
  upstreamDirName: string,
  platform: string,
): Promise<CopyLogEntry> {
  return {
    sourceId,
    upstreamDirName,
    platform,
    relativePath: "(device)",
    action: "skipped-unknown-device-id",
  };
}
