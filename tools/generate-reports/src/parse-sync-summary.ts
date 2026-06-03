const DEVICE_SKIP_RE =
  /^- `([^`]+)` \/ `\(device\)`: skipped \(no device dir\)$/;

export function parseNoDeviceDirIds(content: string): string[] {
  const ids = new Set<string>();
  for (const line of content.split("\n")) {
    const match = DEVICE_SKIP_RE.exec(line.trim());
    if (match) {
      ids.add(match[1]);
    }
  }
  return [...ids].sort((a, b) => a.localeCompare(b));
}
