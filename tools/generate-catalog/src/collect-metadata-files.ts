import { readdir } from "node:fs/promises";
import path from "node:path";

async function collectInDir(
  dir: string,
  results: string[],
): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return;
    }
    throw err;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectInDir(fullPath, results);
    } else if (entry.isFile() && entry.name === "metadata.md") {
      results.push(fullPath);
    }
  }
}

export async function collectMetadataFiles(
  repoRoot: string,
): Promise<string[]> {
  const devicesDir = path.join(repoRoot, "examples/devices");
  const results: string[] = [];
  await collectInDir(devicesDir, results);
  return results.sort((a, b) => a.localeCompare(b));
}
