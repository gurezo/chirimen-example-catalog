import path from "node:path";
import type {
  Catalog,
  DeviceExampleMapEntry,
  ExampleEntry,
  UpstreamEntry,
} from "./types.js";
import { writeFileIfChanged } from "./write-file-if-changed.js";

function backtick(value: string): string {
  return `\`${value}\``;
}

function formatUpstreamLabel(repo: string): string {
  return repo.replace(/^chirimen-oh\//, "");
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function renderUpstreamRepositoriesDoc(
  upstreams: UpstreamEntry[],
): string {
  const sorted = [...upstreams].sort((a, b) => a.id.localeCompare(b.id));
  const rows = sorted.map(
    (u) =>
      `| ${u.id} | ${backtick(u.repo)} | ${u.branch} | ${backtick(u.path)} | ${u.platform} | ${u.priority} |`,
  );

  return `# 同期元リポジトリ

このページは ${backtick("catalog/upstreams.json")} から生成されています。

| ID                      | Repository                     | Branch | Path                      | Platform   | Priority |
| ----------------------- | ------------------------------ | ------ | ------------------------- | ---------- | -------- |
${rows.join("\n")}
`;
}

export function renderDuplicatedDevicesDoc(
  deviceExampleMap: DeviceExampleMapEntry[],
): string {
  const duplicated = [...deviceExampleMap]
    .filter((entry) => entry.examples.length >= 2)
    .sort((a, b) => a.deviceId.localeCompare(b.deviceId));

  const rows = duplicated.map((entry) => {
    const platforms = uniqueSorted(entry.examples.map((ex) => ex.platform)).join(
      ", ",
    );
    const upstreams = uniqueSorted(
      entry.examples.map((ex) => formatUpstreamLabel(ex.upstreamRepository)),
    ).join(", ");
    return `| ${entry.deviceId} | ${platforms} | ${upstreams} |`;
  });

  return `# 重複デバイス一覧

同じ Device ID に対して、複数の platform または upstream repository に Example が存在するものを一覧化します。

| Device ID | Platforms                                                    | Upstreams                                |
| --------- | ------------------------------------------------------------ | ---------------------------------------- |
${rows.join("\n")}
`;
}

export function renderDeprecatedExamplesDoc(examples: ExampleEntry[]): string {
  const deprecated = examples
    .filter((ex) => ex.status === "legacy" || ex.status === "archive")
    .sort((a, b) => {
      const byDevice = a.deviceId.localeCompare(b.deviceId);
      if (byDevice !== 0) {
        return byDevice;
      }
      return a.platform.localeCompare(b.platform);
    });

  const rows = deprecated.map(
    (ex) =>
      `| ${ex.deviceId} | ${ex.platform} | ${backtick(ex.localPath)} | ${backtick(ex.upstreamRepository)} | ${backtick(ex.upstreamPath)} | ${ex.status} |`,
  );

  return `# 非推奨・旧サンプル一覧

このページでは、${backtick("legacy")} または ${backtick("archive")} として扱う Example を一覧化します。

| Device ID | Platform      | Local Path                                         | Upstream Repository    | Upstream Path        | 状態    |
| --------- | ------------- | -------------------------------------------------- | ---------------------- | -------------------- | ------- |
${rows.join("\n")}
`;
}

const APPENDIX_OUTPUTS = [
  {
    relativePath: "docs/appendix/upstream-repositories.md",
    render: (catalog: Catalog) =>
      renderUpstreamRepositoriesDoc(catalog.upstreams),
  },
  {
    relativePath: "docs/appendix/duplicated-devices.md",
    render: (catalog: Catalog) =>
      renderDuplicatedDevicesDoc(catalog.deviceExampleMap),
  },
  {
    relativePath: "docs/appendix/deprecated-examples.md",
    render: (catalog: Catalog) =>
      renderDeprecatedExamplesDoc(catalog.examples),
  },
] as const;

export async function generateAppendixDocs(
  catalog: Catalog,
  repoRoot: string,
): Promise<{ written: number; skipped: number }> {
  let written = 0;
  let skipped = 0;

  for (const { relativePath, render } of APPENDIX_OUTPUTS) {
    const content = render(catalog);
    const filePath = path.join(repoRoot, relativePath);
    const changed = await writeFileIfChanged(filePath, content);
    if (changed) {
      written += 1;
    } else {
      skipped += 1;
    }
  }

  return { written, skipped };
}
