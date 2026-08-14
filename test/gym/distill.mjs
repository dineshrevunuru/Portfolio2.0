/**
 * Turn a pile of per-turn notes into something that changes the agent.
 *
 * A review bench that only produces opinions is a diary. This is the step that
 * makes the loop close: it collects every note Dinesh wrote, groups them by
 * what they are actually complaining about, and writes a report that names the
 * specific lines to fix. With --synthesise it also asks a model to propose
 * prompt rules, phrased as rules rather than as vibes.
 *
 *   node test/gym/distill.mjs                 report from the newest run
 *   node test/gym/distill.mjs 2026-08-14T...  a specific run
 *   node test/gym/distill.mjs --synthesise    also draft prompt amendments
 *
 * The synthesis is a DRAFT and is never applied automatically. Prompt rules
 * that nobody read are how an agent drifts; every rule that lands in prompt.ts
 * should be one a human agreed to.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RUNS = join(ROOT, "test", "gym", "runs");
const args = process.argv.slice(2);
const synth = args.includes("--synthesise") || args.includes("--synthesize");
const named = args.find((a) => !a.startsWith("--"));

const runId =
  named ?? (existsSync(join(RUNS, "latest")) ? readFileSync(join(RUNS, "latest"), "utf8").trim() : null);
if (!runId || !existsSync(join(RUNS, runId))) {
  console.error("No run found. node test/gym/run.mjs first.");
  process.exit(1);
}
const DIR = join(RUNS, runId);
const FB = join(DIR, "feedback");

if (!existsSync(FB)) {
  console.error(`No feedback for ${runId}. Grade it first:  node test/gym/bench.mjs`);
  process.exit(1);
}

/* Re-parse the transcripts so every note can be shown with the line it is
   about. A note without its turn is unreadable a week later. */
const turnsOf = (md) => {
  const out = [];
  let cur = null;
  for (const line of md.split("\n")) {
    const m = /^\*\*(VISITOR|LOREM)\*\* — (.*)$/.exec(line);
    if (m) {
      if (cur) out.push(cur);
      cur = { who: m[1].toLowerCase(), text: m[2] };
    } else if (cur && !/^`(SHOW|CHIPS)`/.test(line) && line.trim()) cur.text += `\n${line}`;
  }
  if (cur) out.push(cur);
  return out;
};

import { createHash } from "node:crypto";
const turnId = (t) => createHash("sha256").update(t.trim()).digest("hex").slice(0, 12);

const scenarios = readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
const collected = [];
let counts = { good: 0, weak: 0, bad: 0 };
const overall = [];

for (const s of scenarios) {
  const fbFile = join(FB, `${s}.json`);
  if (!existsSync(fbFile)) continue;
  const fb = JSON.parse(readFileSync(fbFile, "utf8"));
  const turns = turnsOf(readFileSync(join(DIR, `${s}.md`), "utf8"));
  const byId = new Map(turns.map((t) => [turnId(t.text), t]));

  for (const [id, v] of Object.entries(fb)) {
    if (id === "_overall") {
      if (v.verdict || v.note) overall.push({ scenario: s, ...v });
      continue;
    }
    if (v.verdict) counts[v.verdict] = (counts[v.verdict] ?? 0) + 1;
    const turn = byId.get(id);
    collected.push({ scenario: s, id, verdict: v.verdict, note: v.note, who: turn?.who ?? "?", text: turn?.text ?? "(turn no longer in this run)" });
  }
}

if (!collected.length && !overall.length) {
  console.error(`Feedback directory exists but is empty. Nothing to distil.`);
  process.exit(1);
}

const withNotes = collected.filter((c) => c.note?.trim());

/* ── report ──────────────────────────────────────────────────────────────── */
const lines = [
  `# Review — ${runId}`,
  ``,
  `${collected.length} turns annotated across ${new Set(collected.map((c) => c.scenario)).size} conversations.`,
  `**${counts.bad ?? 0} bad · ${counts.weak ?? 0} weak · ${counts.good ?? 0} good**`,
  ``,
];

if (overall.length) {
  lines.push(`## Whole conversations`, ``);
  for (const o of overall) {
    lines.push(`**${o.scenario}** — ${o.verdict ?? "no verdict"}`);
    if (o.note?.trim()) lines.push(`> ${o.note.replace(/\n/g, "\n> ")}`);
    lines.push(``);
  }
}

for (const verdict of ["bad", "weak", "good"]) {
  const rows = collected.filter((c) => c.verdict === verdict);
  if (!rows.length) continue;
  lines.push(`## ${verdict === "bad" ? "Bad" : verdict === "weak" ? "Weak" : "Good"} — ${rows.length}`, ``);
  for (const r of rows) {
    lines.push(`### ${r.scenario} · ${r.who}`);
    lines.push(`> ${r.text.replace(/\n/g, "\n> ").slice(0, 600)}`);
    if (r.note?.trim()) lines.push(``, `**${r.note.trim()}**`);
    lines.push(``);
  }
}

const unrated = withNotes.filter((c) => !c.verdict);
if (unrated.length) {
  lines.push(`## Noted without a verdict — ${unrated.length}`, ``);
  for (const r of unrated) lines.push(`- **${r.scenario}**: ${r.note.trim()}`);
  lines.push(``);
}

writeFileSync(join(DIR, "REVIEW.md"), lines.join("\n"));
console.log(`\n  ${collected.length} annotations · ${counts.bad ?? 0} bad, ${counts.weak ?? 0} weak, ${counts.good ?? 0} good`);
console.log(`  Report → test/gym/runs/${runId}/REVIEW.md`);

/* ── synthesis ───────────────────────────────────────────────────────────── */
if (!synth) {
  console.log(`\n  Add --synthesise to draft prompt rules from these notes.\n`);
  process.exit(0);
}
if (!withNotes.length) {
  console.log(`\n  Nothing written to synthesise from: every annotation is a verdict with no note.\n`);
  process.exit(0);
}

function env(name) {
  if (process.env[name]) return process.env[name];
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return "";
  const l = readFileSync(p, "utf8").split("\n").find((x) => x.startsWith(`${name}=`));
  return l ? l.slice(name.length + 1).trim() : "";
}
const KEY = env("ANTHROPIC_API_KEY");
if (!KEY) { console.error("  ANTHROPIC_API_KEY missing — cannot synthesise."); process.exit(1); }

const evidence = withNotes
  .map((c) => `[${c.verdict ?? "note"}] ${c.scenario} · ${c.who} said:\n"${c.text.slice(0, 400)}"\nDinesh: ${c.note.trim()}`)
  .join("\n\n---\n\n");

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
  body: JSON.stringify({
    model: process.env.GYM_SYNTH_MODEL ?? "claude-sonnet-5",
    max_tokens: 2000,
    system:
      `Dinesh reviewed his portfolio's voice agent turn by turn. Below are his own notes, ` +
      `each with the line it is about.\n\n` +
      `Turn them into prompt rules. Constraints:\n` +
      `- Group notes that are the same complaint. One rule per underlying problem, not one per note.\n` +
      `- Write each rule the way the existing prompt is written: imperative, specific, with the ` +
      `reason attached, and a concrete example of the better version drawn from his actual words.\n` +
      `- Distinguish what belongs in the PROMPT from what needs CODE. A rule a model will drift ` +
      `from under pressure (never say X, never repeat a line) is better enforced in the guardrail, ` +
      `and this codebase has evidence for that: its "absolute" no-em-dash prompt rule was violated ` +
      `228 times while its code-enforced numeral rule was violated zero times.\n` +
      `- If his notes contradict each other, say so plainly rather than averaging them.\n` +
      `- Do not invent rules he did not imply.\n\n` +
      `Output markdown with three sections: "Prompt rules", "Better enforced in code", "Contradictions and open questions".`,
    messages: [{ role: "user", content: evidence }],
  }),
});
if (!res.ok) { console.error(`  synthesis failed: ${res.status}`); process.exit(1); }
const j = await res.json();
const draft = (j.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("");

writeFileSync(
  join(DIR, "AMENDMENTS.md"),
  `# Proposed prompt amendments — ${runId}\n\n` +
    `> DRAFT, synthesised from ${withNotes.length} of Dinesh's notes. Nothing here is applied\n` +
    `> automatically. Read it, cut what is wrong, then move what survives into prompt.ts\n` +
    `> or into the guardrail.\n\n` +
    draft + "\n",
);
console.log(`  Draft amendments → test/gym/runs/${runId}/AMENDMENTS.md\n`);
