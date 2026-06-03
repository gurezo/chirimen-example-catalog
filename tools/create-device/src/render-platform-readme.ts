export type RenderPlatformReadmeInput = {
  deviceId: string;
  deviceName?: string;
  platform: string;
  upstreamRepository: string;
  upstreamPath: string;
  status: string;
};

function backtick(value: string): string {
  return `\`${value}\``;
}

export function renderPlatformReadme(input: RenderPlatformReadmeInput): string {
  const displayName = input.deviceName ?? input.deviceId;

  return `# ${displayName} / ${input.platform}

## 概要

${displayName} の ${backtick(input.platform)} 向け Example です。

## Upstream

| 項目 | 内容 |
| ---- | ---- |
| Repository | ${backtick(input.upstreamRepository)} |
| Path | ${backtick(input.upstreamPath)} |
| Branch | ${backtick("master")} |

## 状態

| 項目 | 内容 |
| ---- | ---- |
| Status | ${backtick(input.status)} |
| 実機確認 | ${backtick("未確認")} |

## 備考

Example 本体を追加する場合は、このディレクトリ配下に ${backtick("src/")} を作成してください。
`;
}
