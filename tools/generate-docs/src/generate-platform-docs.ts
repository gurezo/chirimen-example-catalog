import path from "node:path";
import type { Catalog, ExampleEntry, PlatformEntry } from "./types.js";
import { writeFileIfChanged } from "./write-file-if-changed.js";

function backtick(value: string): string {
  return `\`${value}\``;
}

function formatDashboardUrl(url?: string): string {
  return url ? backtick(url) : "未設定";
}

function buildDashboardUrlMap(
  catalog: Catalog,
): Map<string, string | undefined> {
  const map = new Map<string, string | undefined>();
  for (const entry of catalog.deviceExampleMap) {
    map.set(entry.deviceId, entry.deviceDashboardUrl);
  }
  return map;
}

function groupExamplesByPlatform(
  examples: ExampleEntry[],
): Map<string, ExampleEntry[]> {
  const groups = new Map<string, ExampleEntry[]>();
  for (const ex of examples) {
    const list = groups.get(ex.platform) ?? [];
    list.push(ex);
    groups.set(ex.platform, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => a.deviceId.localeCompare(b.deviceId));
  }
  return groups;
}

function buildPlatformDescriptionMap(
  platforms: PlatformEntry[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const p of platforms) {
    map.set(p.id, p.description);
  }
  return map;
}

function renderExamplesTable(
  examples: ExampleEntry[],
  dashboardUrls: Map<string, string | undefined>,
): string {
  const rows = examples.map(
    (ex) =>
      `| ${ex.deviceId} | ${formatDashboardUrl(dashboardUrls.get(ex.deviceId))} | ${backtick(ex.localPath)} | ${backtick(ex.upstreamRepository)} | ${backtick(ex.upstreamPath)} | ${ex.status} |`,
  );
  return rows.join("\n");
}

export function renderPlatformDoc(
  platformId: string,
  description: string | undefined,
  examples: ExampleEntry[],
  dashboardUrls: Map<string, string | undefined>,
): string {
  const overview = description ?? "説明未設定";

  return `# ${platformId}

## 概要

${overview}

## Example 一覧

| Device ID | Device Dashboard | Local Path | Upstream Repository | Upstream Path | 状態    |
| --------- | ---------------- | ----------------------------------------------- | -------------------------- | --------------------------------- | ------- |
${renderExamplesTable(examples, dashboardUrls)}
`;
}

export async function generatePlatformDocs(
  catalog: Catalog,
  repoRoot: string,
): Promise<{ written: number; skipped: number }> {
  let written = 0;
  let skipped = 0;

  const dashboardUrls = buildDashboardUrlMap(catalog);
  const descriptions = buildPlatformDescriptionMap(catalog.platforms);
  const groups = groupExamplesByPlatform(catalog.examples);

  const platformIds = [...groups.keys()].sort((a, b) => a.localeCompare(b));

  for (const platformId of platformIds) {
    const examples = groups.get(platformId) ?? [];
    const content = renderPlatformDoc(
      platformId,
      descriptions.get(platformId),
      examples,
      dashboardUrls,
    );
    const filePath = path.join(
      repoRoot,
      "docs/platforms",
      `${platformId}.md`,
    );
    const changed = await writeFileIfChanged(filePath, content);
    if (changed) {
      written += 1;
    } else {
      skipped += 1;
    }
  }

  return { written, skipped };
}
