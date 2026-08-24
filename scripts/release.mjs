/**
 * The release gate. The ONLY sanctioned path to production.
 *
 *   npm run release              review + approve + ship a patch bump
 *   npm run release -- 2.1.0     explicit version
 *   npm run release -- --minor   bump kind (--major / --minor / --patch)
 *   npm run release -- --review  print the review and STOP (no prompt)
 *
 * Why this exists (2026-08-21, Dinesh's rule): the black-hole entrance
 * reached production by accident — two sessions shared one checkout, and a
 * push made to ship one feature silently carried another underneath it. His
 * directive: releases are VERSIONED, the changeset is REVIEWED — what was
 * added, what was removed — and nothing deploys without APPROVAL.
 *
 * The mechanics that enforce it:
 *   · Work lands on `dev`. Vercel builds previews from it; production stays
 *     wherever `main` points, and main only moves here.
 *   · The review is generated from git itself (commits + file A/M/D between
 *     main and dev), so it cannot omit what a changelog author forgot —
 *     the accident above would have appeared as three commits and two added
 *     components nobody asked for.
 *   · Approval is typed: the exact version string, after reading the review.
 *     FOR AGENTS: you do not approve. Show Dinesh the review, get his yes in
 *     his own words, and only then confirm — his approval is the release.
 *   · The release is one merge commit on main + an annotated tag, so
 *     `git log --first-parent main` reads as version history and any release
 *     can be diffed or reverted as a unit.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";

const sh = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }).trim();
const git = (...args) => sh("git", args);
const fail = (msg) => {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
};

/* ── preconditions ───────────────────────────────────────────────────────── */
const argv = process.argv.slice(2);
const reviewOnly = argv.includes("--review");

if (git("rev-parse", "--abbrev-ref", "HEAD") !== "dev")
  fail("Releases run from `dev`. You are on " + git("rev-parse", "--abbrev-ref", "HEAD") + ".");
if (git("status", "--porcelain") !== "")
  fail("The tree is dirty. A release reviews commits, not loose files — commit or stash first.");

git("fetch", "-q", "origin", "main", "dev");

// main must be an ancestor of dev: if someone pushed main directly, the review
// below would silently exclude their change — the exact failure this replaces.
try {
  git("merge-base", "--is-ancestor", "origin/main", "HEAD");
} catch {
  fail(
    "origin/main has commits that dev does not. Someone bypassed the release\n" +
      "    path. Merge origin/main into dev, review what arrived, then re-run.",
  );
}

/* ── version ─────────────────────────────────────────────────────────────── */
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const explicit = argv.find((a) => /^\d+\.\d+\.\d+$/.test(a));
const lastTag = (() => {
  try {
    return sh("git", ["describe", "--tags", "--abbrev=0", "--match", "v[0-9]*"]);
  } catch {
    return null;
  }
})();
const base = (lastTag ?? `v${pkg.version}`).replace(/^v/, "").split(".").map(Number);
const bump = argv.includes("--major")
  ? [base[0] + 1, 0, 0]
  : argv.includes("--minor")
    ? [base[0], base[1] + 1, 0]
    : [base[0], base[1], base[2] + 1];
// First release: no v-tag exists yet, so package.json (2.0.0) IS the version.
const version = explicit ?? (lastTag ? bump.join(".") : pkg.version);
const tag = `v${version}`;

try {
  git("rev-parse", "-q", "--verify", `refs/tags/${tag}`);
  fail(`Tag ${tag} already exists. Pass an explicit version: npm run release -- 2.1.0`);
} catch {
  /* good — tag is free */
}

/* ── the review: what this release adds and removes ──────────────────────── */
const range = "origin/main..HEAD";
const commits = git("log", "--oneline", "--no-decorate", range).split("\n").filter(Boolean);
if (!commits.length) fail("Nothing to release — dev and origin/main are identical.");

const status = git("diff", "--name-status", "origin/main...HEAD")
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const [code, ...rest] = l.split("\t");
    return { code: code[0], path: rest[rest.length - 1] };
  });
const bucket = (c) => status.filter((s) => s.code === c).map((s) => s.path);
const added = bucket("A"), removed = bucket("D"), modified = bucket("M"), renamed = bucket("R");
const publicTouched = status.filter((s) => s.path.startsWith("public/"));

const stamp = new Date().toISOString().slice(0, 10);
const lines = [];
const put = (s = "") => lines.push(s);
put(`## ${tag} — ${stamp}`);
put();
put(`${commits.length} commit(s) · +${added.length} added · −${removed.length} removed · ~${modified.length} modified${renamed.length ? ` · →${renamed.length} renamed` : ""}`);
put();
put(`### Commits`);
for (const c of commits) put(`- ${c}`);
if (added.length) { put(); put(`### Added`); for (const p of added) put(`- ${p}`); }
if (removed.length) { put(); put(`### Removed`); for (const p of removed) put(`- ${p}`); }
if (modified.length) { put(); put(`### Modified`); for (const p of modified) put(`- ${p}`); }
if (publicTouched.length) {
  put();
  put(`### ⚠ public/ — served to the internet as-is`);
  for (const s of publicTouched) put(`- [${s.code}] ${s.path}`);
}
const review = lines.join("\n");

console.log("\n" + "═".repeat(72));
console.log(`  RELEASE REVIEW — ${tag}  (dev → main → production)`);
console.log("═".repeat(72) + "\n");
console.log(review);
console.log("\n" + "═".repeat(72));

if (reviewOnly) {
  console.log("  --review: stopping here. Nothing was deployed.\n");
  process.exit(0);
}

/* ── approval ────────────────────────────────────────────────────────────── */
console.log(`
  Deploying this makes it live at dineshrevunuru.com.
  AGENTS: show Dinesh this review and get his yes BEFORE typing anything.
  To approve, type exactly:  ${tag}
`);
const answer = await new Promise((r) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question("  approve> ", (a) => (rl.close(), r(a.trim())));
});
if (answer !== tag) {
  console.log(`\n  Not approved ("${answer}" ≠ "${tag}"). Nothing was deployed.\n`);
  process.exit(1);
}

/* ── ship: version, history, merge, tag, push ────────────────────────────── */
pkg.version = version;
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

const RELEASES = "RELEASES.md";
const head = existsSync(RELEASES)
  ? readFileSync(RELEASES, "utf8")
  : `# Releases\n\nEvery production deploy, as a reviewed, versioned unit. Generated by\n\`npm run release\` — see scripts/release.mjs for the rules.\n\n`;
const [intro, ...rest] = head.split(/\n(?=## v)/);
writeFileSync(RELEASES, [intro.trimEnd(), "", review, "", ...rest].join("\n"));

git("add", "package.json", RELEASES);
git("commit", "-q", "-m", `release: ${tag}`);
git("checkout", "-q", "main");
git("merge", "--no-ff", "-q", "-m", `Release ${tag}`, "dev");
git("tag", "-a", tag, "-m", `Release ${tag}\n\n${review}`);
git("push", "-q", "origin", "main", "dev", tag);
git("checkout", "-q", "dev");

console.log(`
  ✓ ${tag} merged to main, tagged, pushed — Vercel is deploying it now.
  ✓ RELEASES.md updated · back on dev for the next cycle.
`);
