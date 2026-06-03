import { PLATFORM_DEFINITIONS } from "./platform-definitions.js";

export type RenderDeviceReadmeInput = {
  deviceId: string;
  deviceName?: string;
};

function renderPlatformLinksTable(): string {
  const rows = PLATFORM_DEFINITIONS.map((def) => {
    const platformPath = `./platforms/${def.platform}/`;
    return `| ${def.platform} | [platforms/${def.platform}](${platformPath}) |`;
  });
  return rows.join("\n");
}

export function renderDeviceReadme(input: RenderDeviceReadmeInput): string {
  const displayName = input.deviceName ?? input.deviceId;

  return `# ${displayName}

このディレクトリでは、${displayName} に関する CHIRIMEN Example を platform 別に整理します。

## メタデータ

- [metadata.md](./metadata.md)

## Platform 別 Example

| Platform | Path |
| -------- | ---- |
${renderPlatformLinksTable()}

## 注意

デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を正とします。

このリポジトリでは、Example の所在、状態、platform 差分、upstream との対応関係を管理します。
`;
}
