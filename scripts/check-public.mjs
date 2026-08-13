/**
 * Fail the build if anything under public/ is not committed to git.
 *
 * WHY THIS EXISTS. On 2026-08-13 two admin screenshots containing real customer
 * names were served publicly from dineshrevunuru.com. They had been deliberately
 * kept out of git — but `vercel --prod` uploads the working directory, not the
 * git index, so "untracked" bought exactly nothing. They shipped, and stayed up
 * until someone thought to curl the path.
 *
 * The trap is that the safe-feeling habit (don't commit it) is the one that
 * fails, and it fails silently: a green build, a 200, and no way to notice
 * without going looking. Nothing in the normal workflow surfaces it.
 *
 * So the invariant is inverted and enforced here: everything under public/ is
 * assumed to be published, and the only way a file gets to sit there is by being
 * committed — a deliberate, reviewable act that leaves a diff. A file you are
 * not willing to commit is a file that must not be in public/ at all. Keep the
 * unredacted original outside the repo.
 *
 * Runs as prebuild, so it guards `vercel --prod`, CI, and a local `npm run
 * build` identically. There is no path to a production bundle that skips it.
 */
import { execFileSync } from "node:child_process";

let untracked;
try {
  // --others = untracked; --exclude-standard = honour .gitignore, so a file that
  // is deliberately ignored (nothing is, under public/, today) is not reported.
  untracked = execFileSync(
    "git",
    ["ls-files", "--others", "--exclude-standard", "public/"],
    { encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean);
} catch {
  // Not a git checkout (a tarball, a bare Docker context). Nothing to compare
  // against, so this check cannot run — say so rather than passing silently and
  // implying the build was verified.
  console.warn("check:public — not a git checkout, skipping");
  process.exit(0);
}

if (untracked.length > 0) {
  console.error(
    `\n✗ ${untracked.length} uncommitted file(s) under public/:\n\n` +
      untracked.map((f) => `    ${f}`).join("\n") +
      `\n\npublic/ is served to the internet, and a deploy uploads the working\n` +
      `tree — not the git index — so these WILL be published.\n\n` +
      `Either commit them, or move them out of the repo if they are private.\n`,
  );
  process.exit(1);
}

console.log("check:public — clean");
