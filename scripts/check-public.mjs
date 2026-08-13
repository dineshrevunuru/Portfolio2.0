/**
 * Fail the build if anything under public/ would deploy without a commit.
 *
 * WHY THIS EXISTS. On 2026-08-13 two admin screenshots containing real customer
 * names were served publicly from dineshrevunuru.com. They had been deliberately
 * kept out of git — but `vercel --prod` uploads the working directory, not the
 * git index, so "untracked" bought exactly nothing. They shipped, and stayed up
 * until someone thought to curl the path.
 *
 * The invariant is inverted and enforced here: everything under public/ is
 * assumed to be published, and the only way a file gets to sit there is by
 * being committed — a deliberate, reviewable act that leaves a diff. A file you
 * are not willing to commit is a file that must not be in public/ at all.
 *
 * WHAT COUNTS AS "would deploy without a commit" — three classes, because the
 * first version checked only the first and review caught the other two:
 *
 *   - untracked files (the incident's own shape)
 *   - gitignored files: the deploy uploads them exactly like untracked ones,
 *     and a future `.gitignore` rule touching public/ would otherwise make a
 *     leak invisible to this very check
 *   - tracked files with uncommitted modifications: a committed redacted
 *     screenshot overwritten in place by the unredacted original would deploy
 *     with no diff anywhere to review
 *
 * WHERE THIS ACTUALLY RUNS — and where it does not. As prebuild it guards a
 * local `npm run build`. It does NOT guard `vercel deploy --prod` invoked
 * directly: that uploads the working tree first and builds it on Vercel, where
 * there is no .git, so this check skips — after the step that leaks. Deploy
 * through `npm run deploy`, which runs this locally first. The durable fix is
 * structural: point production at a git branch, so Vercel builds from a commit
 * and an uncommitted file is unreachable by construction.
 */
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Anchor to the repo root by the script's own location, never the caller's
// cwd: `git ls-files public/` run from a subdirectory resolves the pathspec
// against that subdirectory, finds nothing, and reports clean — a silent false
// pass reproduced during review.
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Finder metadata, gitignored on purpose, no payload. Anything else ignored
// under public/ fails the check.
const ALLOWED = new Set([".DS_Store"]);

const git = (...args) =>
  execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" });

let porcelain;
try {
  // --ignored=matching includes gitignored files; modified tracked files show
  // up on their own. Every status line is a file whose deployed content would
  // differ from (or not exist in) the last commit.
  porcelain = git(
    "status",
    "--porcelain",
    "--ignored=matching",
    "--",
    "public/",
  );
} catch (err) {
  const text = `${err.stderr ?? ""} ${err.message ?? ""}`;
  if (err.code === "ENOENT" || /not a git repository/i.test(text)) {
    // No git binary, or not a checkout (a tarball, Vercel's remote builder).
    // Nothing to compare against, so the check cannot run — say so rather than
    // passing silently and implying the build was verified.
    console.warn("check:public — no git or not a checkout, cannot verify");
    process.exit(0);
  }
  // Any OTHER git failure — dubious-ownership refusals in CI containers, a
  // held index.lock, a corrupted repo — does not mean there is nothing to
  // check. A security gate that converts its own breakage into a pass is not
  // a gate. Fail closed.
  console.error(`check:public — git failed, refusing to pass:\n${text.trim()}`);
  process.exit(1);
}

const offending = porcelain
  .split("\n")
  .filter(Boolean)
  .map((line) => ({ status: line.slice(0, 2), path: line.slice(3) }))
  .filter(({ path }) => !ALLOWED.has(path.split("/").pop()));

if (offending.length > 0) {
  console.error(
    `\n✗ ${offending.length} file(s) under public/ differ from the last commit:\n\n` +
      offending.map(({ status, path }) => `    ${status} ${path}`).join("\n") +
      `\n\npublic/ is served to the internet, and a deploy uploads the working\n` +
      `tree — not the git index — so these WILL be published as they are now.\n\n` +
      `Commit them, or move them out of the repo if they are private.\n`,
  );
  process.exit(1);
}

console.log("check:public — clean");
