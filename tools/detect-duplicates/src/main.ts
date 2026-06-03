import path from "node:path";
import { fileURLToPath } from "node:url";
import { detectDuplicatedDevices } from "./detect-duplicated-devices.js";
import { loadCatalog } from "./load-catalog.js";
import { renderDuplicatedDevicesReport } from "./render-duplicated-devices-report.js";
import { writeFileIfChanged } from "./write-file-if-changed.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const REPORT_PATH = "generated/reports/duplicated-devices.md";

async function main(): Promise<void> {
  const catalog = await loadCatalog(repoRoot);

  console.log(`Loaded examples: ${catalog.examples.length}`);
  console.log(`Loaded device maps: ${catalog.deviceExampleMap.length}`);

  const duplicated = detectDuplicatedDevices(catalog.deviceExampleMap);
  console.log(`Duplicated devices: ${duplicated.length}`);

  const content = renderDuplicatedDevicesReport(duplicated);
  const reportPath = path.join(repoRoot, REPORT_PATH);
  const changed = await writeFileIfChanged(reportPath, content);

  if (changed) {
    console.log(`Report written: ${REPORT_PATH}`);
  } else {
    console.log(`Report unchanged: ${REPORT_PATH}`);
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
