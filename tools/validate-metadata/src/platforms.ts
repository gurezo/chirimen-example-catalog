export const ALLOWED_PLATFORMS = new Set([
  "pizero-esm",
  "raspi-node",
  "node",
  "microbit-driver",
  "microbit-web",
  "legacy-gc-gpio",
  "legacy-gc-i2c",
  "remote",
  "pre-arranged",
]);

export const REQUIRED_HEADINGS = [
  "## 基本情報",
  "## Platform 別 Example",
  "## 推奨 Example",
  "## 移行メモ",
] as const;
