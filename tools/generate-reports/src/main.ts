import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  detectMissingDashboardLinks,
  detectMissingDeviceMetadata,
  detectMissingPlatformDirs,
} from "./detect-gaps.js";
import { loadCatalog } from "./load-catalog.js";
import {
  renderMissingDashboardLinkReport,
  renderMissingMetadataReport,
} from "./render-reports.js";
import { writeFileIfChanged } from "./write-file-if-changed.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const REPORTS = [
  {
    relativePath: "generated/reports/missing-metadata.md",
    label: "missing-metadata.md",
  },
  {
    relativePath: "generated/reports/missing-device-dashboard-link.md",
    label: "missing-device-dashboard-link.md",
  },
] as const;

async function readSyncSummary(): Promise<string> {
  const syncPath = path.join(repoRoot, "generated/reports/sync-summary.md");
  try {
    return await readFile(syncPath, "utf8");
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      console.warn("sync-summary.md not found, skipping upstream metadata gaps");
      return "";
    }
    throw err;
  }
}

async function main(): Promise<void> {
  const catalog = await loadCatalog(repoRoot);
  console.log(`Loaded examples: ${catalog.examples.length}`);

  const syncSummary = await readSyncSummary();
  const missingMetadata = await detectMissingDeviceMetadata(
    repoRoot,
    syncSummary,
  );
  const missingPlatformDirs = await detectMissingPlatformDirs(
    repoRoot,
    catalog,
  );
  const missingDashboard = await detectMissingDashboardLinks(repoRoot);

  console.log(`Missing device metadata: ${missingMetadata.length}`);
  console.log(`Missing platform dirs: ${missingPlatformDirs.length}`);
  console.log(`Missing dashboard links: ${missingDashboard.length}`);

  const outputs = [
    {
      ...REPORTS[0],
      content: renderMissingMetadataReport(
        missingMetadata,
        missingPlatformDirs,
      ),
    },
    {
      ...REPORTS[1],
      content: renderMissingDashboardLinkReport(missingDashboard),
    },
  ];

  for (const { relativePath, label, content } of outputs) {
    const filePath = path.join(repoRoot, relativePath);
    const changed = await writeFileIfChanged(filePath, content);
    if (changed) {
      console.log(`Report written: ${label}`);
    } else {
      console.log(`Report unchanged: ${label}`);
    }
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
