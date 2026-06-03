export function markdownLink(label: string, url: string): string {
  return `[${label}](${url})`;
}

export function githubRepositoryUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

export function githubTreeUrl(
  repo: string,
  branch: string,
  path: string,
): string {
  const normalizedPath = path === "." ? "" : `/${path}`;
  return `https://github.com/${repo}/tree/${branch}${normalizedPath}`;
}

export function formatRepositoryLink(repo: string): string {
  return markdownLink(repo, githubRepositoryUrl(repo));
}

export function formatUpstreamPathLink(
  repo: string,
  branch: string,
  path: string,
): string {
  return markdownLink(path, githubTreeUrl(repo, branch, path));
}

export function formatDeviceDashboardLink(
  deviceId: string,
  url?: string,
): string {
  return url ? markdownLink(deviceId, url) : "未設定";
}
