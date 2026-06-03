import type { DuplicatedDevice } from "./types.js";

export function renderDuplicatedDevicesReport(
  duplicated: DuplicatedDevice[],
): string {
  const rows = duplicated.map((entry) => {
    const platforms = entry.platforms.join(", ");
    const upstreams = entry.upstreams.join(", ");
    return `| ${entry.deviceId} | ${platforms} | ${upstreams} |`;
  });

  return `# 重複デバイス一覧

同じ Device ID に対して、複数の platform または upstream repository に Example が存在するものを一覧化します。

| Device ID | Platforms                                                    | Upstreams                                |
| --------- | ------------------------------------------------------------ | ---------------------------------------- |
${rows.join("\n")}
`;
}
