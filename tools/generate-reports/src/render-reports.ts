import type {
  MissingDashboardLinkEntry,
  MissingDeviceMetadataEntry,
  MissingPlatformDirEntry,
} from "./types.js";

export function renderMissingMetadataReport(
  missingMetadata: MissingDeviceMetadataEntry[],
  missingPlatformDirs: MissingPlatformDirEntry[],
): string {
  const metadataRows = missingMetadata.map(
    (entry) => `| ${entry.deviceId} | ${entry.note} |`,
  );

  const platformRows = missingPlatformDirs.map(
    (entry) =>
      `| ${entry.deviceId} | ${entry.platform} | ${entry.localPath} |`,
  );

  const metadataSection =
    metadataRows.length > 0
      ? metadataRows.join("\n")
      : "| （なし） | upstream 検出デバイスはすべて metadata.md を持つ |";

  const platformSection =
    platformRows.length > 0
      ? platformRows.join("\n")
      : "| （なし） | catalog 上の Example はすべて localPath が存在する |";

  return `# metadata 不足レポート

catalog / upstream 同期の観点で、metadata または platform ディレクトリが不足している Example を一覧化します。

## metadata.md が無いデバイス（upstream 同期で skipped (no device dir)）

| Device ID | 備考 |
| --------- | ---- |
${metadataSection}

## platform ディレクトリが無い Example（catalog 上は登録済み）

| Device ID | Platform | Local Path |
| --------- | -------- | ---------- |
${platformSection}
`;
}

export function renderMissingDashboardLinkReport(
  entries: MissingDashboardLinkEntry[],
): string {
  const rows = entries.map(
    (entry) => `| ${entry.deviceId} | ${entry.metadataPath} |`,
  );

  const body =
    rows.length > 0
      ? rows.join("\n")
      : "| （なし） | すべての metadata.md に Device Dashboard URL が設定済み |";

  return `# Device Dashboard リンク不足レポート

\`examples/devices/**/metadata.md\` の Device Dashboard が未設定またはプレースホルダのデバイスを一覧化します。

| Device ID | metadata.md |
| --------- | ----------- |
${body}
`;
}
