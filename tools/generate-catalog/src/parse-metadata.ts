import {
  extractTablesInSection,
  findTableRow,
  getColumnIndex,
  stripBackticks,
} from "../../validate-metadata/src/parse.js";
import type { ParsedDeviceMetadata, ParsedExample } from "./types.js";

function isPlaceholder(value: string): boolean {
  const v = stripBackticks(value);
  if (!v) return true;
  if (/^<.*>$/.test(v)) return true;
  if (v.includes("<例:") || v.includes("<...>")) return true;
  return false;
}

export function normalizeLocalPath(
  deviceId: string,
  relativePath: string,
): string {
  const stripped = stripBackticks(relativePath).replace(/\/$/, "");
  if (stripped.startsWith("examples/")) {
    return stripped;
  }
  if (stripped.startsWith("platforms/")) {
    return `examples/devices/${deviceId}/${stripped}`;
  }
  return `examples/devices/${deviceId}/platforms/${stripped}`;
}

function parseVerified(content: string): boolean {
  const tables = extractTablesInSection(content, "## 推奨 Example");
  for (const table of tables) {
    const row = findTableRow(table, "実機確認");
    if (!row) continue;
    const value = stripBackticks(row[1] ?? "");
    return value === "確認済み";
  }
  return false;
}

function parsePlatformExamples(
  content: string,
  deviceId: string,
): ParsedExample[] {
  const tables = extractTablesInSection(content, "## Platform 別 Example");
  const examples: ParsedExample[] = [];

  for (const table of tables) {
    const platformCol = getColumnIndex(table, "Platform");
    const localPathCol = getColumnIndex(table, "Local Path");
    const upstreamRepoCol = getColumnIndex(table, "Upstream Repository");
    const upstreamPathCol = getColumnIndex(table, "Upstream Path");
    const statusCol = getColumnIndex(table, "状態");

    if (
      platformCol < 0 ||
      localPathCol < 0 ||
      upstreamRepoCol < 0 ||
      upstreamPathCol < 0 ||
      statusCol < 0
    ) {
      throw new Error(
        "Platform 別 Example table missing required columns (Platform, Local Path, Upstream Repository, Upstream Path, 状態)",
      );
    }

    for (const row of table.rows) {
      const platform = stripBackticks(row[platformCol] ?? "");
      if (!platform || isPlaceholder(platform)) continue;

      const localPathRaw = row[localPathCol] ?? "";
      const upstreamRepository = stripBackticks(row[upstreamRepoCol] ?? "");
      const upstreamPath = stripBackticks(row[upstreamPathCol] ?? "");
      const status = stripBackticks(row[statusCol] ?? "");

      if (
        isPlaceholder(upstreamRepository) ||
        isPlaceholder(upstreamPath) ||
        isPlaceholder(status)
      ) {
        continue;
      }

      examples.push({
        platform,
        localPath: normalizeLocalPath(deviceId, localPathRaw),
        upstreamRepository,
        upstreamPath,
        status,
      });
    }
  }

  return examples;
}

export function parseMetadataContent(
  content: string,
  fileLabel: string,
): ParsedDeviceMetadata {
  const basicTables = extractTablesInSection(content, "## 基本情報");
  if (basicTables.length === 0) {
    throw new Error(`${fileLabel}: ## 基本情報 section has no valid table`);
  }

  const basicTable = basicTables[0];
  const deviceIdRow = findTableRow(basicTable, "Device ID");
  if (!deviceIdRow) {
    throw new Error(`${fileLabel}: Device ID row not found in 基本情報`);
  }

  const deviceId = stripBackticks(deviceIdRow[1] ?? "");
  if (!deviceId || isPlaceholder(deviceId)) {
    throw new Error(`${fileLabel}: Device ID is empty or placeholder`);
  }

  let deviceDashboardUrl: string | undefined;
  const dashboardRow = findTableRow(basicTable, "Device Dashboard");
  if (dashboardRow) {
    const url = stripBackticks(dashboardRow[1] ?? "");
    if (url && !isPlaceholder(url)) {
      deviceDashboardUrl = url;
    }
  }

  const verified = parseVerified(content);
  const examples = parsePlatformExamples(content, deviceId);

  return {
    deviceId,
    deviceDashboardUrl,
    verified,
    examples,
  };
}
