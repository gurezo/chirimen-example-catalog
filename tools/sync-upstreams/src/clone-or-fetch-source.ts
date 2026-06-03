import { access, cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { UpstreamSource } from "./types.js";

const execFileAsync = promisify(execFile);

export type CloneOrFetchResult = {
  mirrorPath: string;
  commitSha?: string;
};

function repoCacheDirName(repo: string, branch: string): string {
  return `${repo.replace("/", "-")}--${branch}`;
}

function repoCachePath(repoRoot: string, repo: string, branch: string): string {
  return path.join(
    repoRoot,
    "generated/upstreams/_repos",
    repoCacheDirName(repo, branch),
  );
}

function mirrorPath(repoRoot: string, sourceId: string): string {
  return path.join(repoRoot, "generated/upstreams", sourceId);
}

async function runGit(args: string[], cwd?: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd,
      maxBuffer: 10 * 1024 * 1024,
    });
    return stdout.trim();
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      throw new Error(
        "git is required but was not found on PATH. Install git to run sync:upstreams.",
      );
    }
    const message =
      err instanceof Error && "stderr" in err
        ? String((err as { stderr?: string }).stderr ?? err.message)
        : err instanceof Error
          ? err.message
          : String(err);
    throw new Error(`git ${args.join(" ")} failed: ${message}`);
  }
}

async function isGitRepo(dir: string): Promise<boolean> {
  try {
    await access(path.join(dir, ".git"));
    return true;
  } catch {
    return false;
  }
}

async function ensureRepoClone(
  repoRoot: string,
  repo: string,
  branch: string,
): Promise<string> {
  const cacheDir = repoCachePath(repoRoot, repo, branch);
  const remoteUrl = `https://github.com/${repo}.git`;

  await mkdir(path.dirname(cacheDir), { recursive: true });

  if (await isGitRepo(cacheDir)) {
    await runGit(["fetch", "--depth", "1", "origin", branch], cacheDir);
    await runGit(["checkout", branch], cacheDir);
    await runGit(["reset", "--hard", `origin/${branch}`], cacheDir);
  } else {
    await rm(cacheDir, { recursive: true, force: true });
    await runGit(
      ["clone", "--depth", "1", "--branch", branch, remoteUrl, cacheDir],
      repoRoot,
    );
  }

  return cacheDir;
}

async function getCommitSha(cacheDir: string): Promise<string | undefined> {
  try {
    return await runGit(["rev-parse", "HEAD"], cacheDir);
  } catch {
    return undefined;
  }
}

export async function cloneOrFetchSource(
  repoRoot: string,
  source: UpstreamSource,
): Promise<CloneOrFetchResult> {
  const cacheDir = await ensureRepoClone(repoRoot, source.repo, source.branch);
  const commitSha = await getCommitSha(cacheDir);

  const sourceSubtree = path.join(cacheDir, source.path);
  const dest = mirrorPath(repoRoot, source.id);

  await rm(dest, { recursive: true, force: true });
  await mkdir(path.dirname(dest), { recursive: true });
  await cp(sourceSubtree, dest, { recursive: true, force: true });

  return {
    mirrorPath: dest,
    commitSha,
  };
}

export async function listExampleDirNames(mirrorPath: string): Promise<string[]> {
  const entries = await readdir(mirrorPath, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}
