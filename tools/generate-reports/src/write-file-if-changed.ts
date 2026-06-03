import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeFileIfChanged(
  filePath: string,
  content: string,
): Promise<boolean> {
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
