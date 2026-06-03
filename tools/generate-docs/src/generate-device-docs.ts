import path from "node:path";
import type { Catalog, DeviceExampleMapEntry, ExampleEntry } from "./types.js";
import { writeFileIfChanged } from "./write-file-if-changed.js";

const DASHBOARD_NOTE =
  "デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を参照してください。";

function backtick(value: string): string {
  return `\`${value}\``;
}

function formatDashboardUrl(url?: string): string {
  return url ? backtick(url) : "未設定";
}

function formatVerified(verified: boolean): string {
  return verified ? "確認済み" : "未確認";
}

function findRecommendedExample(
  examples: ExampleEntry[],
): ExampleEntry | undefined {
  return examples.find((ex) => ex.status === "primary");
}

function renderPlatformExamplesTable(examples: ExampleEntry[]): string {
  const sorted = [...examples].sort((a, b) =>
    a.platform.localeCompare(b.platform),
  );
  const rows = sorted.map(
    (ex) =>
      `| ${ex.platform} | ${backtick(ex.localPath)} | ${backtick(ex.upstreamRepository)} | ${backtick(ex.upstreamPath)} | ${ex.status} | ${formatVerified(ex.verified)} |`,
  );
  return rows.join("\n");
}

function renderRecommendedSection(examples: ExampleEntry[]): string {
  const recommended = findRecommendedExample(examples);
  if (!recommended) {
    return `| 推奨 Platform | 未設定 |
| 状態 | 未設定 |
| 実機確認 | 未設定 |`;
  }
  return `| 推奨 Platform | ${backtick(recommended.platform)} |
| 状態 | ${recommended.status} |
| 実機確認 | ${formatVerified(recommended.verified)} |`;
}

export function renderDeviceDoc(entry: DeviceExampleMapEntry): string {
  const { deviceId, deviceDashboardUrl, examples } = entry;

  return `# ${deviceId}

このページは ${backtick("catalog/device-example-map.json")} から生成されています。

## デバイス情報

| 項目             | 内容                                   |
| ---------------- | -------------------------------------- |
| Device ID        | ${backtick(deviceId)}                  |
| Device Dashboard | ${formatDashboardUrl(deviceDashboardUrl)} |

${DASHBOARD_NOTE}

## Platform 別 Example

| Platform   | Local Path | Upstream Repository | Upstream Path | 状態    | 実機確認 |
| ---------- | ----------------------------------------------- | ------------------------------ | --------------------------------- | ------- | -------- |
${renderPlatformExamplesTable(examples)}

## 推奨 Example

| 項目          | 内容         |
| ------------- | ------------ |
${renderRecommendedSection(examples)}
`;
}

export async function generateDeviceDocs(
  catalog: Catalog,
  repoRoot: string,
): Promise<{ written: number; skipped: number }> {
  let written = 0;
  let skipped = 0;

  const sorted = [...catalog.deviceExampleMap].sort((a, b) =>
    a.deviceId.localeCompare(b.deviceId),
  );

  for (const entry of sorted) {
    const content = renderDeviceDoc(entry);
    const filePath = path.join(
      repoRoot,
      "docs/devices",
      `${entry.deviceId}.md`,
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
