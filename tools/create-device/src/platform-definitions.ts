export type PlatformDefinition = {
  platform: string;
  upstreamRepo: string;
  upstreamPathTemplate: (deviceId: string) => string;
  status: string;
  note: string;
};

export const PLATFORM_DEFINITIONS: PlatformDefinition[] = [
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
