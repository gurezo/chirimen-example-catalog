import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { collectMetadataFiles } from "./collect-metadata-files.js";
import { generateDeviceExampleMapJson } from "./generate-device-example-map-json.js";
import { generateExamplesJson } from "./generate-examples-json.js";
import { generatePlatformsJson } from "./generate-platforms-json.js";
import { generateUpstreamsJson } from "./generate-upstreams-json.js";
import { loadUpstreamSources } from "./load-upstream-sources.js";
import { parseMetadataContent } from "./parse-metadata.js";
import { writeJsonIfChanged } from "./write-json-if-changed.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const CATALOG_OUTPUTS = [
  { relativePath: "catalog/examples.json", label: "examples.json" },
  { relativePath: "catalog/platforms.json", label: "platforms.json" },
  {
    relativePath: "catalog/device-example-map.json",
    label: "device-example-map.json",
  },
  { relativePath: "catalog/upstreams.json", label: "upstreams.json" },
] as const;

async function main(): Promise<void> {
  const metadataPaths = await collectMetadataFiles(repoRoot);
  const devices = [];

  for (const filePath of metadataPaths) {
    const relativePath = path.relative(repoRoot, filePath);
    const content = await readFile(filePath, "utf8");
    try {
      devices.push(parseMetadataContent(content, relativePath));
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse ${relativePath}: ${detail}`);
    }
  }

  const upstream = await loadUpstreamSources(repoRoot);

  const catalogData = {
    examples: generateExamplesJson(devices),
    platforms: generatePlatformsJson(upstream.sources),
    deviceExampleMap: generateDeviceExampleMapJson(devices),
    upstreams: generateUpstreamsJson(upstream.sources),
  };

  console.log(`Parsed metadata files: ${metadataPaths.length}`);
  console.log(`Examples: ${catalogData.examples.length}`);
  console.log(`Platforms: ${catalogData.platforms.length}`);
  console.log(`Device maps: ${catalogData.deviceExampleMap.length}`);
  console.log(`Upstreams: ${catalogData.upstreams.length}`);

  let written = 0;
  let unchanged = 0;

  const outputs: { path: string; data: unknown }[] = [
    { path: CATALOG_OUTPUTS[0].relativePath, data: catalogData.examples },
    { path: CATALOG_OUTPUTS[1].relativePath, data: catalogData.platforms },
    {
      path: CATALOG_OUTPUTS[2].relativePath,
      data: catalogData.deviceExampleMap,
    },
    { path: CATALOG_OUTPUTS[3].relativePath, data: catalogData.upstreams },
  ];

  for (const { path: relativePath, data } of outputs) {
    const label =
      CATALOG_OUTPUTS.find((o) => o.relativePath === relativePath)?.label ??
      relativePath;
    const filePath = path.join(repoRoot, relativePath);
    const changed = await writeJsonIfChanged(filePath, data);
    if (changed) {
      written += 1;
      console.log(`Wrote ${label}`);
    } else {
      unchanged += 1;
      console.log(`Unchanged ${label}`);
    }
  }

  console.log(`Catalog: ${written} written, ${unchanged} unchanged`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
