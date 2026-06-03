import { loadCatalog } from "./load-catalog.js";

async function main(): Promise<void> {
  const catalog = await loadCatalog();

  console.log(`Loaded examples: ${catalog.examples.length}`);
  console.log(`Loaded platforms: ${catalog.platforms.length}`);
  console.log(`Loaded device maps: ${catalog.deviceExampleMap.length}`);
  console.log(`Loaded upstreams: ${catalog.upstreams.length}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
