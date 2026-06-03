import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export function serializeJson(data: unknown): string {
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function writeJsonIfChanged(
  filePath: string,
  data: unknown,
): Promise<boolean> {
  const content = serializeJson(data);

  try {
    const existing = await readFile(filePath, "utf8");
    if (existing === content) {
      return false;
    }
  } catch (err: unknown) {
    if (
      !(err instanceof Error) ||
      !("code" in err) ||
      (err as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      throw err;
    }
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
  return true;
}
