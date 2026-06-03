import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { UpstreamSource, UpstreamSourcesFile } from "./types.js";

const REQUIRED_FIELDS = [
  "id",
  "repo",
  "branch",
  "path",
  "platform",
  "priority",
  "description",
] as const;

function assertSource(source: unknown, index: number): asserts source is UpstreamSource {
  if (typeof source !== "object" || source === null) {
    throw new Error(`upstream/sources.yaml: sources[${index}] must be an object`);
  }

  const record = source as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (typeof record[field] !== "string" || record[field] === "") {
      throw new Error(
        `upstream/sources.yaml: sources[${index}].${field} must be a non-empty string`,
      );
    }
  }
}

export async function loadSources(repoRoot: string): Promise<UpstreamSource[]> {
  const filePath = path.join(repoRoot, "upstream/sources.yaml");
  const raw = await readFile(filePath, "utf8");
  const parsed = parseYaml(raw) as unknown;

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("sources" in parsed) ||
    !Array.isArray((parsed as UpstreamSourcesFile).sources)
  ) {
    throw new Error("upstream/sources.yaml: expected sources array");
  }

  const { sources } = parsed as UpstreamSourcesFile;
  sources.forEach((source, index) => assertSource(source, index));
  return sources;
}
