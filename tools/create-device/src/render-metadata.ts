export type RenderMetadataInput = {
  deviceId: string;
  name?: string;
  dashboardUrl?: string;
};

type PlatformDefinition = {
  platform: string;
  upstreamRepo: string;
  upstreamPathTemplate: (deviceId: string) => string;
  status: string;
  note: string;
};

const PLATFORM_DEFINITIONS: PlatformDefinition[] = [
  {
    platform: "pizero-esm",
    upstreamRepo: "chirimen-oh/chirimen.org",
    upstreamPathTemplate: (id) => `pizero/src/esm-examples/${id}`,
    status: "primary",
    note: "現行候補",
  },
  {
    platform: "raspi-node",
    upstreamRepo: "chirimen-oh/chirimen-drivers",
    upstreamPathTemplate: (id) => `raspi-examples/${id}`,
    status: "legacy",
    note: "参照用",
  },
  {
    platform: "node",
    upstreamRepo: "chirimen-oh/chirimen-drivers",
    upstreamPathTemplate: (id) => `node-examples/${id}`,
    status: "legacy",
    note: "参照用",
  },
  {
    platform: "microbit-driver",
    upstreamRepo: "chirimen-oh/chirimen-drivers",
    upstreamPathTemplate: (id) => `microbit-examples/${id}`,
    status: "legacy",
    note: "参照用",
  },
  {
    platform: "microbit-web",
    upstreamRepo: "chirimen-oh/chirimen-micro-bit",
    upstreamPathTemplate: (id) => `examples/${id}`,
    status: "legacy",
    note: "参照用",
  },
  {
    platform: "legacy-gc-gpio",
    upstreamRepo: "chirimen-oh/chirimen",
    upstreamPathTemplate: (id) => `gc/gpio/${id}`,
    status: "archive",
    note: "旧構成",
  },
  {
    platform: "legacy-gc-i2c",
    upstreamRepo: "chirimen-oh/chirimen",
    upstreamPathTemplate: (id) => `gc/i2c/${id}`,
    status: "archive",
    note: "旧構成",
  },
  {
    platform: "remote",
    upstreamRepo: "chirimen-oh/remote-connection",
    upstreamPathTemplate: (id) => `examples/${id}`,
    status: "special",
    note: "特殊用途",
  },
  {
    platform: "pre-arranged",
    upstreamRepo: "chirimen-oh/pre-arrangement-contributions",
    upstreamPathTemplate: (id) => id,
    status: "incubator",
    note: "整理前",
  },
];

const DASHBOARD_NOTE =
  "デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を正とする";

function backtick(value: string): string {
  return `\`${value}\``;
}

function renderPlatformTable(deviceId: string): string {
  const rows = PLATFORM_DEFINITIONS.map((def) => {
    const localPath = `platforms/${def.platform}/`;
    const upstreamPath = def.upstreamPathTemplate(deviceId);
    return `| ${def.platform} | ${backtick(localPath)} | ${backtick(def.upstreamRepo)} | ${backtick(upstreamPath)} | ${def.status} | ${def.note} |`;
  });
  return rows.join("\n");
}

export function renderMetadata(input: RenderMetadataInput): string {
  const displayName = input.name ?? input.deviceId;
  const deviceNameCell = backtick(input.name ?? input.deviceId);
  const dashboardCell = input.dashboardUrl ? backtick(input.dashboardUrl) : "";

  return `# Example メタデータ: ${displayName}

## 基本情報

| 項目 | 内容 |
|---|---|
| Device ID | ${backtick(input.deviceId)} |
| デバイス名 / 型番 | ${deviceNameCell} |
| Device Dashboard | ${dashboardCell} |
| 備考 | ${DASHBOARD_NOTE} |

## Platform 別 Example

| Platform | Local Path | Upstream Repository | Upstream Path | 状態 | 備考 |
|---|---|---|---|---|---|
${renderPlatformTable(input.deviceId)}

## 推奨 Example

| 項目 | 内容 |
|---|---|
| 推奨 Platform | ${backtick("pizero-esm")} |
| 推奨理由 | CHIRIMEN Pi Zero 向けの現行 ESM example として扱うため |
| 実機確認 | ${backtick("未確認")} |
| 確認日 |  |
| 確認者 |  |

## 移行メモ

- 同じデバイスの Example が複数リポジトリに存在する場合、このファイルで対応関係を整理する。
- このリポジトリでは Example の所在、状態、platform 差分、upstream との対応関係を管理する。
- デバイス本体の情報、商品リンク、商品画像、回路図、データシートは chirimen-device-dashboard を参照する。
`;
}
