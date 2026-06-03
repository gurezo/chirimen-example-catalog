import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PLATFORM_DEFINITIONS } from "./platform-definitions.js";
import { renderDeviceReadme } from "./render-device-readme.js";
import { renderMetadata } from "./render-metadata.js";
import { renderPlatformReadme } from "./render-platform-readme.js";
import { validateDeviceId } from "./validate-device-id.js";
import { writeFileIfNotExists } from "./write-file-if-not-exists.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

export type CreateDeviceContext = {
  repoRoot: string;
  deviceId: string;
  deviceDir: string;
  name?: string;
  dashboardUrl?: string;
};

type ParsedArgs = {
  deviceId?: string;
  name?: string;
  dashboardUrl?: string;
};

function printUsage(): void {
  console.error(`Usage: pnpm device:create <device-id> [--name <name>] [--dashboard-url <url>]

Options:
  --name            Device name / model number
  --dashboard-url   chirimen-device-dashboard URL for this device

Examples:
  pnpm device:create adt7410
  pnpm device:create adt7410 --name ADT7410
  pnpm device:create adt7410 --name ADT7410 --dashboard-url https://chirimen-device-dashboard.web.app/devices/adt7410`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {};
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--name") {
      const value = argv[++i];
      if (!value || value.startsWith("--")) {
        throw new Error("--name requires a value");
      }
      result.name = value;
    } else if (arg === "--dashboard-url") {
      const value = argv[++i];
      if (!value || value.startsWith("--")) {
        throw new Error("--dashboard-url requires a value");
      }
      result.dashboardUrl = value;
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length > 1) {
    throw new Error(`Expected one device-id, got ${positional.length}: ${positional.join(", ")}`);
  }

  if (positional.length === 1) {
    result.deviceId = positional[0];
  }

  return result;
}

export function buildCreateDeviceContext(args: ParsedArgs): CreateDeviceContext {
  if (!args.deviceId) {
    throw new Error("deviceId is required");
  }

  validateDeviceId(args.deviceId);

  const deviceDir = path.join(repoRoot, "examples", "devices", args.deviceId);

  return {
    repoRoot,
    deviceId: args.deviceId,
    deviceDir,
    name: args.name,
    dashboardUrl: args.dashboardUrl,
  };
}

async function assertDeviceDirNotExists(deviceDir: string): Promise<void> {
  try {
    await access(deviceDir);
    const relative = path.relative(repoRoot, deviceDir);
    throw new Error(
      `Device directory already exists: ${relative}. Refusing to overwrite.`,
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith("Device directory already exists:")) {
      throw err;
    }
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      throw err;
    }
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.deviceId) {
    printUsage();
    process.exit(1);
  }

  const context = buildCreateDeviceContext(args);
  await assertDeviceDirNotExists(context.deviceDir);

  const metadataPath = path.join(context.deviceDir, "metadata.md");
  const metadataContent = renderMetadata({
    deviceId: context.deviceId,
    name: context.name,
    dashboardUrl: context.dashboardUrl,
  });
  await writeFileIfNotExists(metadataPath, metadataContent);

  const deviceReadmePath = path.join(context.deviceDir, "README.md");
  const deviceReadmeContent = renderDeviceReadme({
    deviceId: context.deviceId,
    deviceName: context.name,
  });
  await writeFileIfNotExists(deviceReadmePath, deviceReadmeContent);

  for (const def of PLATFORM_DEFINITIONS) {
    const platformReadmePath = path.join(
      context.deviceDir,
      "platforms",
      def.platform,
      "README.md",
    );
    const platformReadmeContent = renderPlatformReadme({
      deviceId: context.deviceId,
      deviceName: context.name,
      platform: def.platform,
      upstreamRepository: def.upstreamRepo,
      upstreamPath: def.upstreamPathTemplate(context.deviceId),
      status: def.status,
    });
    await writeFileIfNotExists(platformReadmePath, platformReadmeContent);
  }

  console.log(`Created device: ${context.deviceId}`);
  console.log(`  metadata: ${path.relative(repoRoot, metadataPath)}`);
  console.log(`  readme: ${path.relative(repoRoot, deviceReadmePath)}`);
  console.log(
    `  platforms: ${PLATFORM_DEFINITIONS.length} README(s) under platforms/`,
  );
  if (context.name) {
    console.log(`  name: ${context.name}`);
  }
  if (context.dashboardUrl) {
    console.log(`  dashboard-url: ${context.dashboardUrl}`);
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
