import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  cloneOrFetchSource,
  listExampleDirNames,
} from "./clone-or-fetch-source.js";
import {
  copyExamples,
  copyExamplesForUnknownDeviceId,
} from "./copy-examples.js";
import { loadSources } from "./load-sources.js";
import { resolveDeviceId } from "./resolve-device-id.js";
import type { SourceSyncResult, SyncSummary } from "./types.js";
import { writeSyncSummary } from "./write-sync-summary.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

async function syncSource(
  source: Awaited<ReturnType<typeof loadSources>>[number],
): Promise<SourceSyncResult> {
  const result: SourceSyncResult = {
    sourceId: source.id,
    repo: source.repo,
    branch: source.branch,
    path: source.path,
    platform: source.platform,
    mirrorPath: path.join(repoRoot, "generated/upstreams", source.id),
    exampleCount: 0,
    errors: [],
    copyLog: [],
  };

  try {
    const { mirrorPath: mirror, commitSha } = await cloneOrFetchSource(
      repoRoot,
      source,
    );
    result.mirrorPath = mirror;
    result.commitSha = commitSha;

    const dirNames = await listExampleDirNames(mirror);
    result.exampleCount = dirNames.length;

    for (const upstreamDirName of dirNames) {
      const deviceId = resolveDeviceId(upstreamDirName);
      const upstreamExamplePath = path.join(mirror, upstreamDirName);

      if (!deviceId) {
        result.copyLog.push(
          await copyExamplesForUnknownDeviceId(
            source.id,
            upstreamDirName,
            source.platform,
          ),
        );
        continue;
      }

      const entries = await copyExamples(
        {
          repoRoot,
          sourceId: source.id,
          platform: source.platform,
          deviceId,
          upstreamExamplePath,
        },
        upstreamDirName,
      );
      result.copyLog.push(...entries);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    result.errors.push(message);
  }

  return result;
}

async function main(): Promise<void> {
  const sources = await loadSources(repoRoot);
  const sourceResults: SourceSyncResult[] = [];
  const fatalErrors: string[] = [];

  for (const source of sources) {
    const result = await syncSource(source);
    sourceResults.push(result);
    if (result.errors.length > 0) {
      fatalErrors.push(`${source.id}: ${result.errors.join("; ")}`);
    }
  }

  const summary: SyncSummary = {
    generatedAt: new Date().toISOString(),
    repoRoot,
    sources: sourceResults,
    fatalErrors,
  };

  const summaryPath = await writeSyncSummary(repoRoot, summary);
  const relativeSummary = path.relative(repoRoot, summaryPath);

  console.log(`Sync complete. Summary: ${relativeSummary}`);

  for (const source of sourceResults) {
    const relMirror = path.relative(repoRoot, source.mirrorPath);
    const status = source.errors.length > 0 ? "ERROR" : "OK";
    console.log(
      `  [${status}] ${source.sourceId}: ${source.exampleCount} example(s) → ${relMirror}`,
    );
  }

  if (fatalErrors.length > 0) {
    console.error("\nFatal errors:");
    for (const err of fatalErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
