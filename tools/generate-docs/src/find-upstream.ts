import {
  formatRepositoryLink,
  formatUpstreamPathLink,
} from "./format-links.js";
import type { ExampleEntry, UpstreamEntry } from "./types.js";

export function findUpstreamForExample(
  upstreams: UpstreamEntry[],
  example: ExampleEntry,
): UpstreamEntry | undefined {
  return upstreams.find(
    (u) =>
      u.repo === example.upstreamRepository &&
      u.platform === example.platform,
  );
}

export function formatUpstreamRepositoryForExample(
  upstreams: UpstreamEntry[],
  example: ExampleEntry,
): string {
  return formatRepositoryLink(example.upstreamRepository);
}

export function formatUpstreamPathForExample(
  upstreams: UpstreamEntry[],
  example: ExampleEntry,
): string {
  const upstream = findUpstreamForExample(upstreams, example);
  if (!upstream) {
    return formatRepositoryLink(example.upstreamRepository);
  }
  return formatUpstreamPathLink(
    example.upstreamRepository,
    upstream.branch,
    example.upstreamPath,
  );
}
