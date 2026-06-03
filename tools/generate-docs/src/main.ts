import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateAppendixDocs } from "./generate-appendix-docs.js";
import { generateDeviceDocs } from "./generate-device-docs.js";
import { generatePlatformDocs } from "./generate-platform-docs.js";
import { loadCatalog } from "./load-catalog.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

async function main(): Promise<void> {
  const catalog = await loadCatalog(repoRoot);

  console.log(`Loaded examples: ${catalog.examples.length}`);
  console.log(`Loaded platforms: ${catalog.platforms.length}`);
  console.log(`Loaded device maps: ${catalog.deviceExampleMap.length}`);
  console.log(`Loaded upstreams: ${catalog.upstreams.length}`);

  const deviceResult = await generateDeviceDocs(
    catalog.upstreams,
    catalog.deviceExampleMap,
    repoRoot,
  );
  console.log(
    `Device docs: ${deviceResult.written} written, ${deviceResult.skipped} unchanged`,
  );

  const platformResult = await generatePlatformDocs(catalog, repoRoot);
  console.log(
    `Platform docs: ${platformResult.written} written, ${platformResult.skipped} unchanged`,
  );

  const appendixResult = await generateAppendixDocs(catalog, repoRoot);
  console.log(
    `Appendix docs: ${appendixResult.written} written, ${appendixResult.skipped} unchanged`,
  );
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
