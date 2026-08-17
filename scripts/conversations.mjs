/**
 * One command to read real visitor conversations.
 *
 *   npm run conversations            last 48h
 *   npm run conversations 2026-08-20 since a date
 *
 * Pulls the latest turns from Supabase into gym-transcript form, then opens
 * the review bench pointed straight at them — so "where do I read the
 * conversations" has a single answer: run this, open the printed URL.
 *
 * It is the pull + the bench, chained, because doing them separately meant
 * remembering the run id the pull printed and pasting it into the bench. This
 * removes that step; both underlying commands still exist for when you want
 * one without the other.
 */
import { execFileSync, spawn } from "node:child_process";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RUNS = join(ROOT, "test", "gym", "runs");
const since = process.argv[2];

/* 1 · pull — inherit stdio so its own messages (and empty-table notice) show */
try {
  execFileSync("node", ["scripts/pull-conversations.mjs", ...(since ? [since] : [])], {
    stdio: "inherit",
  });
} catch {
  process.exit(1); // pull already explained why
}

/* 2 · find the run the pull just wrote — newest real-* dir by mtime */
const realRuns = existsSync(RUNS)
  ? readdirSync(RUNS)
      .filter((d) => d.startsWith("real-") && statSync(join(RUNS, d)).isDirectory())
      .map((d) => ({ d, t: statSync(join(RUNS, d)).mtimeMs }))
      .sort((a, b) => b.t - a.t)
  : [];

if (!realRuns.length) {
  // Empty table: pull already said "it fills as people talk". Nothing to open.
  process.exit(0);
}

const run = realRuns[0].d;
console.log(`\n  Opening the review bench on ${run} …`);
console.log("  Grade turn by turn; notes save as you type. Ctrl-C to stop.\n");

/* 3 · hand off to the bench, pointed at that run */
const bench = spawn("node", ["test/gym/bench.mjs", run], { stdio: "inherit" });
bench.on("exit", (code) => process.exit(code ?? 0));
