import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateMetadataContent } from "./validate.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

async function collectMetadataFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectMetadataFiles(fullPath)));
    } else if (entry.isFile() && entry.name === "metadata.md") {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function relativeLabel(filePath: string): string {
  return path.relative(repoRoot, filePath);
}

async function main(): Promise<void> {
  const devicesDir = path.join(repoRoot, "examples", "devices");
  const metadataFiles = await collectMetadataFiles(devicesDir);

  if (metadataFiles.length === 0) {
    console.warn("No metadata.md files found under examples/devices/");
  }

  const allMessages: { level: string; message: string }[] = [];

  for (const filePath of metadataFiles) {
    const content = await readFile(filePath, "utf8");
    const label = relativeLabel(filePath);
    allMessages.push(...validateMetadataContent(content, label));
  }

  const templatePath = path.join(repoRoot, "METADATA_TEMPLATE.md");
  try {
    const templateContent = await readFile(templatePath, "utf8");
    allMessages.push(
      ...validateMetadataContent(templateContent, "METADATA_TEMPLATE.md", {
        templateMode: true,
      }),
    );
  } catch {
    console.warn("METADATA_TEMPLATE.md not found, skipping");
  }

  const errors = allMessages.filter((m) => m.level === "error");
  const warnings = allMessages.filter((m) => m.level === "warning");

  for (const w of warnings) {
    console.warn(`warning: ${w.message}`);
  }

  for (const e of errors) {
    console.error(`error: ${e.message}`);
  }

  console.log(
    `Validated ${metadataFiles.length} device metadata file(s) + template: ${errors.length} error(s), ${warnings.length} warning(s)`,
  );

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
