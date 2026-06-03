import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CatalogInput, ExampleEntry } from "./types.js";

const defaultRepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

export async function loadCatalog(
  repoRoot = defaultRepoRoot,
): Promise<CatalogInput> {
  const relativePath = "catalog/examples.json";
  const filePath = path.join(repoRoot, relativePath);

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

  return { examples: parsed as ExampleEntry[] };
}
