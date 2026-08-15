/**
 * Pull real visitor conversations out of Supabase and into the gym.
 *
 *   node scripts/pull-conversations.mjs             yesterday + today
 *   node scripts/pull-conversations.mjs 2026-08-20  since a date
 *
 * Writes test/gym/runs/real-<stamp>/<n>-<session>.md in the exact transcript
 * format run.mjs produces, so the review bench, the judge and distill treat a
 * real recruiter identically to a simulated one:
 *
 *   node test/gym/bench.mjs real-<stamp>     grade them
 *   node test/gym/eval.mjs  real-<stamp>     judge them
 *
 * This is the far end of the pipe that starts in app/api/lorem/logTurn.ts —
 * the point of the whole feature: the training corpus stops being personas I
 * wrote and starts being the people who actually showed up.
 *
 * Deliberately NOT a gym "run" in the comparable sense: no meta.json model
 * stamp comparisons, no rubricId trending. A real conversation has no pinned
 * opener, so cross-run deltas mean nothing here — these are for READING and
 * GRADING, and the judged defects feed distill like any other feedback.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function env(name) {
  if (process.env[name]) return process.env[name];
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return "";
  const l = readFileSync(p, "utf8").split("\n").find((x) => x.startsWith(`${name}=`));
  return l ? l.slice(name.length + 1).trim() : "";
}

const URL_ = env("SUPABASE_URL");
const KEY = env("SUPABASE_SERVICE_ROLE_KEY");
if (!URL_ || !KEY) {
  console.error(
    "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing from .env.local.\n" +
      "Logging is off until they exist — nothing to pull.",
  );
  process.exit(1);
}

const since =
  process.argv[2] ?? new Date(Date.now() - 48 * 3600 * 1000).toISOString().slice(0, 10);

const res = await fetch(
  `${URL_}/rest/v1/lorem_turns?created_at=gte.${since}&order=session_id,created_at&limit=2000`,
  { headers: { apikey: KEY, authorization: `Bearer ${KEY}` } },
);
if (!res.ok) {
  console.error(`Supabase said ${res.status}: ${(await res.text()).slice(0, 200)}`);
  process.exit(1);
}
const rows = await res.json();
if (!rows.length) {
  console.log(`No real conversations since ${since}. The table fills as visitors talk.`);
  process.exit(0);
}

/* group turns into conversations */
const bySession = new Map();
for (const r of rows) {
  if (!bySession.has(r.session_id)) bySession.set(r.session_id, []);
  bySession.get(r.session_id).push(r);
}

const stamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
const dir = join(ROOT, "test", "gym", "runs", `real-${stamp}`);
mkdirSync(dir, { recursive: true });

let n = 0;
for (const [session, turns] of bySession) {
  // Single-turn drive-bys are still data — quick-bounce is a persona for a
  // reason — but tag length in the filename so graders can pick their battles.
  n++;
  const name = `${String(n).padStart(2, "0")}-${turns.length}turns-${session.slice(0, 8)}`;
  const when = new Date(turns[0].created_at);
  const lines = [
    `# real visitor · ${session.slice(0, 8)} · ${turns[0].mode}`,
    "",
    `> A real conversation from ${when.toISOString().slice(0, 16).replace("T", " ")} UTC.`,
    `> ${turns.length} turns · model ${turns[0].model} · median latency ${median(turns.map((t) => t.ms))}ms.`,
    `> Not simulated: there is no brief, because nobody wrote this person.`,
    "",
    "---",
    "",
  ];
  for (const t of turns) {
    lines.push(`**VISITOR** — ${t.message}`, "");
    lines.push(`**LOREM** — ${t.say}`);
    if (Array.isArray(t.show) && t.show.length)
      lines.push(`\`SHOW\` ${t.show.map((b) => b?.type ?? "?").join(" · ")}`);
    if (Array.isArray(t.chips) && t.chips.length) lines.push(`\`CHIPS\` ${t.chips.join(" · ")}`);
    lines.push("");
  }
  writeFileSync(join(dir, `${name}.md`), lines.join("\n"));
}

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

writeFileSync(
  join(dir, "meta.json"),
  JSON.stringify(
    { source: "real-visitors", since, pulledAt: new Date().toISOString(), conversations: n, turns: rows.length },
    null,
    2,
  ) + "\n",
);

console.log(`\n  ${n} real conversation${n === 1 ? "" : "s"} (${rows.length} turns) → test/gym/runs/real-${stamp}/`);
console.log(`  Read + grade them:  node test/gym/bench.mjs real-${stamp}`);
console.log(`  Judge them:         node test/gym/eval.mjs real-${stamp}\n`);
