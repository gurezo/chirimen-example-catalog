import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeFileIfNotExists(
  filePath: string,
  content: string,
): Promise<void> {
  try {
    await access(filePath);
    throw new Error(`File already exists: ${filePath}`);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith("File already exists:")) {
      throw err;
    }
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      throw err;
    }
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}
