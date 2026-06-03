import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CopyAction, SyncSummary } from "./types.js";

const ACTION_LABELS: Record<CopyAction, string> = {
  copied: "copied",
  "skipped-protected": "skipped (protected)",
  "skipped-no-marker": "skipped (no marker)",
  "skipped-unknown-device-id": "skipped (unknown deviceId)",
  "skipped-no-device-dir": "skipped (no device dir)",
  "skipped-non-src": "skipped (non-src)",
};

function countByAction(
  summary: SyncSummary,
  action: CopyAction,
): number {
  let count = 0;
  for (const source of summary.sources) {
    for (const entry of source.copyLog) {
      if (entry.action === action) {
        count += 1;
      }
    }
  }
  return count;
}

function renderSourceSection(summary: SyncSummary): string {
  const lines: string[] = [];

  for (const source of summary.sources) {
    lines.push(`### ${source.sourceId}`);
    lines.push("");
    lines.push(`| 項目 | 内容 |`);
    lines.push(`| --- | --- |`);
    lines.push(`| Repository | \`${source.repo}\` |`);
    lines.push(`| Branch | \`${source.branch}\` |`);
    lines.push(`| Path | \`${source.path}\` |`);
    lines.push(`| Platform | \`${source.platform}\` |`);
    lines.push(`| Mirror | \`${path.relative(summary.repoRoot, source.mirrorPath)}\` |`);
    if (source.commitSha) {
      lines.push(`| Commit | \`${source.commitSha}\` |`);
    }
    lines.push(`| Examples detected | ${source.exampleCount} |`);
    lines.push("");

    if (source.errors.length > 0) {
      lines.push("**Errors**");
      lines.push("");
      for (const err of source.errors) {
        lines.push(`- ${err}`);
      }
      lines.push("");
    }

    const copied = source.copyLog.filter((e) => e.action === "copied");
    const skipped = source.copyLog.filter((e) => e.action !== "copied");

    if (copied.length > 0) {
      lines.push("**Copied**");
      lines.push("");
      for (const entry of copied) {
        const device = entry.deviceId ?? "?";
        lines.push(
          `- \`${entry.upstreamDirName}\` → \`examples/devices/${device}/platforms/${entry.platform}/${entry.relativePath}\``,
        );
      }
      lines.push("");
    }

    if (skipped.length > 0) {
      lines.push("**Skipped**");
      lines.push("");
      for (const entry of skipped) {
        lines.push(
          `- \`${entry.upstreamDirName}\` / \`${entry.relativePath}\`: ${ACTION_LABELS[entry.action]}`,
        );
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

export function renderSyncSummaryMarkdown(summary: SyncSummary): string {
  const lines: string[] = [
    "# Upstream sync summary",
    "",
    `Generated at: ${summary.generatedAt}`,
    "",
    "## Overview",
    "",
    `| 項目 | 値 |`,
    `| --- | --- |`,
    `| Sources | ${summary.sources.length} |`,
    `| Copied files | ${countByAction(summary, "copied")} |`,
    `| Skipped (protected) | ${countByAction(summary, "skipped-protected")} |`,
    `| Skipped (no marker) | ${countByAction(summary, "skipped-no-marker")} |`,
    `| Skipped (unknown deviceId) | ${countByAction(summary, "skipped-unknown-device-id")} |`,
    `| Skipped (no device dir) | ${countByAction(summary, "skipped-no-device-dir")} |`,
    `| Skipped (non-src) | ${countByAction(summary, "skipped-non-src")} |`,
    "",
  ];

  if (summary.fatalErrors.length > 0) {
    lines.push("## Fatal errors");
    lines.push("");
    for (const err of summary.fatalErrors) {
      lines.push(`- ${err}`);
    }
    lines.push("");
  }

  lines.push("## Sources");
  lines.push("");
  lines.push(renderSourceSection(summary));

  return `${lines.join("\n").trimEnd()}\n`;
}

export async function writeSyncSummary(
  repoRoot: string,
  summary: SyncSummary,
): Promise<string> {
  const outPath = path.join(repoRoot, "generated/reports/sync-summary.md");
  await mkdir(path.dirname(outPath), { recursive: true });
  const content = renderSyncSummaryMarkdown(summary);
  await writeFile(outPath, content, "utf8");
  return outPath;
}
