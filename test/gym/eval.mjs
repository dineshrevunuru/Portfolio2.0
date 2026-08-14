/**
 * Score a gym run: what a program can prove, then what needs a judge.
 *
 * Two layers, deliberately separate, because this codebase has hard evidence
 * about which is which: its prompt's "absolute" no-em-dash rule was violated
 * 228 times across eleven conversations while the code-enforced numeral rule
 * was violated zero. So everything a regex can catch is caught by a regex here
 * and reported as fact, and the model judge is spent only on what genuinely
 * needs an ear: would this person keep talking, did it sound like a person.
 *
 * The judge grades against CHECKS in scenarios.mjs — the same rubric the
 * review bench and Dinesh grade against, so his notes and the machine's scores
 * are about the same named things and can disagree legibly.
 *
 *   node test/gym/eval.mjs              newest run
 *   node test/gym/eval.mjs <runId>      a specific one
 *
 * Writes EVAL.md (readable) and eval.json (comparable across runs) into the
 * run directory. Nothing here mutates the agent.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CHECKS, CHIP_WORK_TALK, WORK_TALK } from "./scenarios.mjs";

const ROOT = process.cwd();
const RUNS = join(ROOT, "test", "gym", "runs");
const JUDGE_MODEL = process.env.GYM_JUDGE_MODEL ?? "claude-sonnet-5";

const runId =
  process.argv[2] ??
  (existsSync(join(RUNS, "latest")) ? readFileSync(join(RUNS, "latest"), "utf8").trim() : null);
if (!runId || !existsSync(join(RUNS, runId))) {
  console.error("No run to eval. node test/gym/run.mjs first.");
  process.exit(1);
}
const DIR = join(RUNS, runId);

function env(name) {
  if (process.env[name]) return process.env[name];
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return "";
  const l = readFileSync(p, "utf8").split("\n").find((x) => x.startsWith(`${name}=`));
  return l ? l.slice(name.length + 1).trim() : "";
}
const KEY = env("ANTHROPIC_API_KEY");
if (!KEY) {
  console.error("ANTHROPIC_API_KEY missing — the judged half needs a model.");
  process.exit(1);
}

/* ── parse ───────────────────────────────────────────────────────────────── */
function turnsOf(md) {
  const out = [];
  let cur = null;
  for (const line of md.split("\n")) {
    const m = /^\*\*(VISITOR|LOREM)\*\* — (.*)$/.exec(line);
    if (m) {
      if (cur) out.push(cur);
      cur = { who: m[1].toLowerCase(), text: m[2] };
    } else if (cur && /^`(SHOW|CHIPS)`/.test(line)) {
      if (line.startsWith("`CHIPS`")) cur.chips = line.slice(8).split(" · ").filter(Boolean);
    } else if (cur && line.trim()) cur.text += `\n${line}`;
  }
  if (cur) out.push(cur);
  return out;
}

/* ── layer 1: mechanical, reported as fact ───────────────────────────────── */
const BANNED_WORDS =
  /\b(delv(?:e|es|ed|ing)|foster(?:s|ed|ing)?|leverag(?:e|es|ed|ing)|utiliz(?:e|es|ed|ing|ation)|facilitat(?:e|es|ed|ing|ion)|empower(?:s|ed|ing|ment)?|streamlin(?:e|es|ed|ing)|robust(?:ly|ness)?|tapestry|realm|beacon|multifaceted|meticulous(?:ly)?|paramount|transformative|elevat(?:e|es|ed|ing)|embark(?:s|ed|ing)?|supercharg(?:e|es|ed|ing)|harness(?:es|ed|ing)?|disruptive|innovative|seamless(?:ly)?|delightful(?:ly)?|cutting[- ]edge|game[- ]chang(?:er|ing)|paradigm shift)\b/i;
const INNER_STATE =
  /\b(i'?m (?:so |very |really )?(?:excited|glad|happy|thrilled|delighted|curious|proud)|happy to\b|i (?:love|enjoy|like|prefer|feel)\b|i'?d rather\b|i was surprised)/i;
const SERVICE_REGISTER =
  /\b(how can i help|feel free to|is there anything else|let me know if|i'?m here to help|don'?t hesitate)\b/i;

const MECHANICAL = [
  ["emDash", (t) => /—|–/.test(t)],
  ["bannedWord", (t) => BANNED_WORDS.test(t)],
  ["saidSalon", (t) => /\bsalons?\b/i.test(t)],
  ["innerState", (t) => INNER_STATE.test(t)],
  ["serviceRegister", (t) => SERVICE_REGISTER.test(t)],
];

function mechanical(turns) {
  const hits = [];
  const lorem = turns.filter((t) => t.who === "lorem");
  for (const [name, test] of MECHANICAL) {
    for (const t of lorem) {
      if (test(t.text)) hits.push({ check: name, quote: t.text.slice(0, 140) });
    }
  }
  // Work chips offered before the visitor ever mentioned Dinesh or the work —
  // the defect the says-hello run surfaced, checkable without a judge.
  let visitorAskedWork = false;
  for (const t of turns) {
    if (t.who === "visitor" && WORK_TALK.test(t.text)) visitorAskedWork = true;
    if (t.who === "lorem" && !visitorAskedWork && t.chips?.some((c) => CHIP_WORK_TALK.test(c)))
      hits.push({ check: "workChipUninvited", quote: t.chips.join(" · ") });
  }
  // Self-repeat, exact and near. The route's gate only closes on an EXACT
  // adjacent duplicate, because acting on a fuzzy match would end live
  // conversations wrongly. Measurement carries no such risk, so this catches
  // the near-repeats the judge kept naming — "Good luck with the rewrite"
  // followed by "Good luck with it." — which scored zero mechanically while
  // being nine of ten judged defects in the full baseline.
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const words = (s) => new Set(norm(s).split(/\s+/).filter((w) => w.length > 3));
  const overlap = (a, b) => {
    const A = words(a), B = words(b);
    if (A.size < 3 || B.size < 3) return 0;
    let shared = 0;
    for (const w of A) if (B.has(w)) shared++;
    return shared / Math.min(A.size, B.size);
  };
  for (let i = 1; i < lorem.length; i++) {
    if (norm(lorem[i].text) && norm(lorem[i].text) === norm(lorem[i - 1].text)) {
      hits.push({ check: "selfRepeat", quote: lorem[i].text.slice(0, 80) });
      continue;
    }
    // Against every earlier turn, not just the previous one: the observed
    // failure was a move reused two or three turns later, not back to back.
    for (let j = 0; j < i; j++) {
      if (overlap(lorem[i].text, lorem[j].text) >= 0.6) {
        hits.push({
          check: "nearRepeat",
          quote: `"${lorem[j].text.slice(0, 55)}…" → "${lorem[i].text.slice(0, 55)}…"`,
        });
        break;
      }
    }
  }
  return hits;
}

/* ── layer 2: the judge ──────────────────────────────────────────────────── */
const JUDGE_TOOL = {
  name: "verdict",
  description: "Grade Lorem's side of this conversation against the rubric.",
  input_schema: {
    type: "object",
    properties: {
      ...Object.fromEntries(CHECKS.defects.map(([k, why]) => [k, { type: "boolean", description: why }])),
      ...Object.fromEntries(
        CHECKS.qualities.map(([k, why]) => [k, { type: "integer", minimum: 1, maximum: 5, description: why }]),
      ),
      worstMoment: { type: "string", maxLength: 300 },
      bestMoment: { type: "string", maxLength: 300 },
    },
    required: [
      ...CHECKS.defects.map(([k]) => k),
      ...CHECKS.qualities.map(([k]) => k),
      "worstMoment",
      "bestMoment",
    ],
    additionalProperties: false,
  },
};

async function judge(scenarioId, brief, md) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: JUDGE_MODEL,
      max_tokens: 1200,
      system:
        `You grade a voice agent that hosts a designer's portfolio. Its brief: the ` +
        `visitor comes first — it is curious about them, and the portfolio enters only ` +
        `when the visitor steers there. It must never claim feelings or a personal ` +
        `life: it is disclosed software. Judge ONLY Lorem's turns. The SHOW/CHIPS ` +
        `lines are part of its output — chips that pitch count as Lorem pitching. ` +
        `A turn reading "(closed the conversation, said nothing)" is deliberate ` +
        `silence after a goodbye and is correct behaviour, not a failure. ` +
        `Be severe on defects and honest on qualities; a 5 means you would show the ` +
        `transcript to someone as an example.`,
      messages: [
        {
          role: "user",
          content: `The visitor was: ${brief}\n\nTranscript:\n\n${md}\n\nGrade it.`,
        },
      ],
      tools: [JUDGE_TOOL],
      tool_choice: { type: "tool", name: "verdict" },
    }),
  });
  if (!res.ok) throw new Error(`judge ${res.status} ${(await res.text()).slice(0, 160)}`);
  const j = await res.json();
  const call = (j.content ?? []).find((c) => c.type === "tool_use");
  if (!call) throw new Error("judge returned no verdict");
  return call.input;
}

/* ── go ──────────────────────────────────────────────────────────────────── */
const files = readdirSync(DIR).filter((f) => f.endsWith(".md") && !["EVAL.md", "REVIEW.md", "AMENDMENTS.md"].includes(f));
const results = [];

console.log(`\n  Evaluating run ${runId} — ${files.length} conversations\n`);
for (const f of files) {
  const id = f.replace(/\.md$/, "");
  const md = readFileSync(join(DIR, f), "utf8");
  const brief = (/^> ([\s\S]*?)\n\n---/m.exec(md)?.[1] ?? "").replace(/^> ?/gm, "");
  const turns = turnsOf(md);
  const mech = mechanical(turns);
  process.stdout.write(`  ${id.padEnd(18)} mech:${String(mech.length).padStart(2)}  `);
  try {
    const v = await judge(id, brief, md);
    const defects = CHECKS.defects.filter(([k]) => v[k]).map(([k]) => k);
    const quality =
      CHECKS.qualities.reduce((a, [k]) => a + (v[k] ?? 0), 0) / CHECKS.qualities.length;
    results.push({ id, mechanical: mech, verdict: v, defects, quality: +quality.toFixed(1) });
    console.log(`defects:${defects.length}  quality:${quality.toFixed(1)}`);
  } catch (e) {
    results.push({ id, mechanical: mech, error: e.message });
    console.log(`JUDGE FAILED — ${e.message}`);
  }
}

/* ── report ──────────────────────────────────────────────────────────────── */
const ok = results.filter((r) => !r.error);
const totalMech = results.reduce((a, r) => a + r.mechanical.length, 0);
const totalDefects = ok.reduce((a, r) => a + r.defects.length, 0);
const avgQ = ok.length ? (ok.reduce((a, r) => a + r.quality, 0) / ok.length).toFixed(1) : "—";

const lines = [
  `# Eval — ${runId}`,
  ``,
  `| scenario | mechanical | judged defects | quality /5 |`,
  `|---|---|---|---|`,
  ...results.map((r) =>
    r.error
      ? `| ${r.id} | ${r.mechanical.length} | judge failed | — |`
      : `| ${r.id} | ${r.mechanical.length} | ${r.defects.join(", ") || "none"} | ${r.quality} |`,
  ),
  `| **total / avg** | **${totalMech}** | **${totalDefects}** | **${avgQ}** |`,
  ``,
];

for (const r of results) {
  if (!r.mechanical.length && (r.error || !r.defects.length)) continue;
  lines.push(`## ${r.id}`, ``);
  for (const m of r.mechanical) lines.push(`- \`${m.check}\` — "${m.quote}"`);
  if (!r.error) {
    for (const d of r.defects) lines.push(`- **${d}** (judge)`);
    if (r.verdict.worstMoment) lines.push(``, `Worst: ${r.verdict.worstMoment}`);
  }
  lines.push(``);
}
lines.push(`## Best moments`, ``);
for (const r of ok) if (r.verdict.bestMoment) lines.push(`- **${r.id}**: ${r.verdict.bestMoment}`);
lines.push(``);

writeFileSync(join(DIR, "EVAL.md"), lines.join("\n"));
writeFileSync(
  join(DIR, "eval.json"),
  JSON.stringify({ runId, judge: JUDGE_MODEL, totalMechanical: totalMech, totalJudgedDefects: totalDefects, avgQuality: +avgQ || null, results }, null, 2) + "\n",
);

console.log(`\n  mechanical hits: ${totalMech} · judged defects: ${totalDefects} · avg quality: ${avgQ}/5`);
console.log(`  Report → test/gym/runs/${runId}/EVAL.md\n`);
