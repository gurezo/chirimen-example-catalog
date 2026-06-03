import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Catalog } from "./types.js";

const defaultRepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const CATALOG_FILES = [
  { relativePath: "catalog/examples.json", key: "examples" as const },
  { relativePath: "catalog/platforms.json", key: "platforms" as const },
  {
    relativePath: "catalog/device-example-map.json",
    key: "deviceExampleMap" as const,
  },
  { relativePath: "catalog/upstreams.json", key: "upstreams" as const },
] as const;

async function readJsonArray<T>(
  filePath: string,
  relativePath: string,
): Promise<T[]> {
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      throw new Error(`Catalog file not found: ${relativePath}`);
    }
    throw err;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err: unknown) {
    const detail =
      err instanceof SyntaxError ? err.message : String(err);
    throw new Error(
      `Failed to parse JSON in ${relativePath}: ${detail}`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array in ${relativePath}`);
  }

  return parsed as T[];
}

export async function loadCatalog(repoRoot = defaultRepoRoot): Promise<Catalog> {
  const result: Partial<Catalog> = {};

  for (const { relativePath, key } of CATALOG_FILES) {
    const filePath = path.join(repoRoot, relativePath);
    result[key] = await readJsonArray(filePath, relativePath);
  }

  return result as Catalog;
}
