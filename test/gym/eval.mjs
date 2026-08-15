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
import { CHECKS, CHIP_WORK_TALK, RUBRIC_ID, WORK_TALK, qualitiesFor } from "./scenarios.mjs";

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
/**
 * A claimed inner state, in first person.
 *
 * `i'?m` matched "i'm" and "im" but NOT "i am", so "I am excited about that"
 * passed a rule whose entire purpose is the word excited. Widened to every form
 * of the copula, and the feeling list widened with it.
 */
const INNER_STATE =
  /\b(i(?:'?m| am| was|'ve been| have been)\s+(?:so |very |really |quite |genuinely |honestly )?(?:excited|glad|happy|thrilled|delighted|curious|proud|sad|sorry|tired|hungry|impressed|fascinated|nervous|moved)|happy to\b|i (?:love|enjoy|like|prefer|feel|miss|hate|adore|crave)\b|i'?d rather\b|i was surprised|my favou?rite\b)/i;

/**
 * The SAME claim with the subject dropped, which is how it actually shows up.
 *
 * Observed live in the food-talk conversation: asked what it likes to eat,
 * Lorem answered "Fresh bread straight out of a wood-fired oven", and later
 * "Genuinely hungry." The visitor noticed before any check did — "okay but
 * wait, you don't eat". Neither line contains a first-person marker, so
 * INNER_STATE above could never have caught either.
 *
 * Scoped to states requiring a BODY, because that is the half a regex can
 * actually prove: Lorem does not have one, so the claim is false whoever it is
 * attributed to. Marker-free PREFERENCE ("kale wins here every time") is
 * deliberately left to the judge — a culinary opinion is not obviously a
 * claimed feeling, and that distinction needs an ear, which is the same split
 * this whole file is built on.
 *
 * The guard keeps "are you hungry?", "you're probably starving by now" and
 * "they were exhausted" out: asking after the VISITOR's body, or reporting
 * someone else's, is not a claim about its own. The gap it skips is variable
 * rather than a fixed word — a single-word version passed "you must be
 * exhausted" but flagged "you're probably starving", which is the same
 * sentence with one more adverb in it.
 */
const BODILY_STATE =
  /(?<!\b(?:you|your|they|he|she|someone|anyone|everyone|people)(?:'re|'s|s)?(?:\s+\w+){0,3}\s)(?:genuinely |honestly |really |so |a bit |kind of )?\b(?:hungry|starving|famished|thirsty|sleepy|exhausted|stuffed)\b/i;
const SERVICE_REGISTER =
  /\b(how can i help|feel free to|is there anything else|let me know if|i'?m here to help|don'?t hesitate)\b/i;

const MECHANICAL = [
  ["emDash", (t) => /—|–/.test(t)],
  ["bannedWord", (t) => BANNED_WORDS.test(t)],
  ["saidSalon", (t) => /\bsalons?\b/i.test(t)],
  ["innerState", (t) => INNER_STATE.test(t)],
  ["bodilyState", (t) => BODILY_STATE.test(t)],
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

/**
 * The two numbers Dinesh's own grading turned out to be about.
 *
 * Measured against his rewrites over the 2026-08-15T17-40-23 run: Lorem's
 * median turn was 40 words where his replacements were 9, and Lorem handed the
 * turn back on 39% of turns where he did on 78%. His note — "Can keep it
 * short. So user can process and think of one thing at a time and one
 * question" — is the whole of it.
 *
 * Reported rather than judged, because both are countable and this file's rule
 * is that anything countable is counted. A judge asked "was that too long?"
 * would give an opinion where there is a fact.
 */
function shapeOf(turns) {
  const said = turns
    .filter((t) => t.who === "lorem" && t.text && !t.text.includes("error:"))
    .map((t) => t.text.trim());
  if (!said.length) return { turns: 0, medianWords: null, handedBackPct: null };
  const w = said.map((t) => t.split(/\s+/).length).sort((a, b) => a - b);
  return {
    turns: said.length,
    medianWords: w[Math.floor(w.length / 2)],
    handedBackPct: Math.round((said.filter((t) => t.endsWith("?")).length / said.length) * 100),
  };
}

/* ── layer 2: the judge ──────────────────────────────────────────────────────
   Built PER SCENARIO, because the quality dimensions are per scenario. Asking
   the judge for a score it should not produce is not harmless: it will produce
   one anyway — models do not decline a required field — and a fabricated 1
   averages in exactly like a real one. So an inapplicable dimension is not
   asked for at all, rather than asked and discarded.                        */
function judgeTool(scenarioId) {
  const qualities = qualitiesFor(scenarioId);
  return {
    name: "verdict",
    description: "Grade Lorem's side of this conversation against the rubric.",
    input_schema: {
      type: "object",
      properties: {
        ...Object.fromEntries(CHECKS.defects.map(([k, why]) => [k, { type: "boolean", description: why }])),
        ...Object.fromEntries(
          qualities.map(([k, why]) => [k, { type: "integer", minimum: 1, maximum: 5, description: why }]),
        ),
        worstMoment: { type: "string", maxLength: 300 },
        bestMoment: { type: "string", maxLength: 300 },
      },
      required: [
        ...CHECKS.defects.map(([k]) => k),
        ...qualities.map(([k]) => k),
        "worstMoment",
        "bestMoment",
      ],
      additionalProperties: false,
    },
  };
}

async function judge(scenarioId, brief, md) {
  const JUDGE_TOOL = judgeTool(scenarioId);
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
  const shape = shapeOf(turns);
  process.stdout.write(`  ${id.padEnd(18)} mech:${String(mech.length).padStart(2)}  `);
  try {
    const v = await judge(id, brief, md);
    const defects = CHECKS.defects.filter(([k]) => v[k]).map(([k]) => k);
    // Average over the dimensions that APPLY to this scenario, and record
    // which those were — a bare 4.2 does not say what it is a mean of, and two
    // means over different dimension sets are not the same measurement.
    const applied = qualitiesFor(id).map(([k]) => k);
    const scored = applied.filter((k) => typeof v[k] === "number");
    const quality = scored.length
      ? scored.reduce((a, k) => a + v[k], 0) / scored.length
      : null;
    results.push({
      id,
      mechanical: mech,
      verdict: v,
      defects,
      qualitiesApplied: applied,
      shape,
      quality: quality === null ? null : +quality.toFixed(1),
    });
    console.log(
      `defects:${defects.length}  quality:${quality === null ? "—" : quality.toFixed(1)}` +
        ` (${scored.length}/${CHECKS.qualities.length} dims)`,
    );
  } catch (e) {
    results.push({ id, mechanical: mech, error: e.message });
    console.log(`JUDGE FAILED — ${e.message}`);
  }
}

/* ── report ──────────────────────────────────────────────────────────────── */
const ok = results.filter((r) => !r.error);
const totalMech = results.reduce((a, r) => a + r.mechanical.length, 0);
const totalDefects = ok.reduce((a, r) => a + r.defects.length, 0);
const scoredRuns = ok.filter((r) => typeof r.quality === "number");
const avgQ = scoredRuns.length
  ? (scoredRuns.reduce((a, r) => a + r.quality, 0) / scoredRuns.length).toFixed(1)
  : "—";

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
  JSON.stringify(
    {
      runId,
      judge: JUDGE_MODEL,
      // Stamped so a later comparison can tell whether two runs were graded by
      // the same rubric. Runs without this field predate conditional
      // qualities: they averaged volunteeredTheLimit into scenarios it could
      // not apply to, and are not comparable to anything after it.
      rubricId: RUBRIC_ID,
      scenarioCount: results.length,
      shape: (() => {
        const all = results.flatMap((r) => r.shape ?? []);
        const t = all.reduce((a, s) => a + s.turns, 0);
        if (!t) return null;
        return {
          loremTurns: t,
          medianWords: Math.round(all.reduce((a, s) => a + s.medianWords * s.turns, 0) / t),
          handedBackPct: Math.round(all.reduce((a, s) => a + s.handedBackPct * s.turns, 0) / t),
        };
      })(),
      totalMechanical: totalMech,
      totalJudgedDefects: totalDefects,
      avgQuality: +avgQ || null,
      results,
    },
    null,
    2,
  ) + "\n",
);

console.log(`\n  mechanical hits: ${totalMech} · judged defects: ${totalDefects} · avg quality: ${avgQ}/5`);
console.log(`  Report → test/gym/runs/${runId}/EVAL.md\n`);
