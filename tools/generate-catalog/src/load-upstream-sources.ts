import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { UpstreamSourcesFile } from "./types.js";

export async function loadUpstreamSources(
  repoRoot: string,
): Promise<UpstreamSourcesFile> {
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

  return parsed as UpstreamSourcesFile;
}
