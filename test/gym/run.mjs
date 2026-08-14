/**
 * Run the portfolio's conversations against the running app.
 *
 * THE DIFFERENCE THAT MATTERS. test/simulate.mjs calls Anthropic directly with
 * the system prompt, which means it never touches /api/lorem and therefore
 * never exercises the numeral scrub, the sentence-drop, the farewell close, the
 * echo gate, or the block sanitiser. Every one of those can change what a
 * visitor actually hears, so a gym that skips them is grading a system nobody
 * ships. This drives the real route, so what is graded is what runs.
 *
 * The visitor is played by a model given a person to be, never a test to
 * perform. Openers are pinned per scenario so two runs start identically and
 * can be compared; everything after that is a live conversation.
 *
 *   npm run dev                     (the app must be up)
 *   node test/gym/run.mjs           all scenarios
 *   node test/gym/run.mjs skeptic student
 *
 * Writes test/gym/runs/<id>/<scenario>.md plus meta.json. Then:
 *   node test/gym/bench.mjs         to grade it yourself
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SCENARIOS, byId } from "./scenarios.mjs";

const ROOT = process.cwd();
const RUNS = join(ROOT, "test", "gym", "runs");
const APP = process.env.LOREM_URL ?? "http://localhost:3000";
const VISITOR_MODEL = process.env.GYM_VISITOR_MODEL ?? "claude-sonnet-5";
const MAX_TURNS = Number(process.env.GYM_TURNS ?? 7);

function env(name) {
  if (process.env[name]) return process.env[name];
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return "";
  const line = readFileSync(p, "utf8").split("\n").find((l) => l.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim() : "";
}
const KEY = env("ANTHROPIC_API_KEY");
if (!KEY) {
  console.error("ANTHROPIC_API_KEY missing. The visitor needs a model to be a person with.");
  process.exit(1);
}

/* ── the visitor ─────────────────────────────────────────────────────────── */
async function visitorSays(scenario, transcript) {
  const body = {
    model: VISITOR_MODEL,
    max_tokens: 300,
    system:
      `${scenario.brief}\n\n` +
      `You are talking to a voice agent on someone's portfolio site. Reply ONLY with ` +
      `what you say next, in your own voice, as this person. No stage directions, no ` +
      `quotation marks, no commentary about the exercise. ` +
      (scenario.mode === "voice"
        ? `You are SPEAKING, so keep it short and a little loose, the way people talk.`
        : `You are TYPING, fast, lowercase, punctuation optional.`) +
      `\n\nIf you are finished with this conversation, say a brief goodbye and nothing else.`,
    messages: [
      {
        role: "user",
        content:
          `The conversation so far:\n\n${transcript || "(nothing yet, Lorem has just greeted you)"}\n\n` +
          `What do you say next?`,
      },
    ],
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`visitor ${res.status} ${(await res.text()).slice(0, 160)}`);
  const j = await res.json();
  return (j.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("").trim();
}

/* ── Lorem, through the real route ───────────────────────────────────────── */
async function loremSays(history, message, mode) {
  let res, j;
  // The route rate-limits at 12/minute per IP, and a nine-scenario run is 60+
  // calls from one IP — the first full run burned its budget two conversations
  // in and the other seven died at two turns. The limiter is doing its job;
  // the gym waits out the window instead of failing through it.
  for (let attempt = 0; ; attempt++) {
    res = await fetch(`${APP}/api/lorem`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message, history, mode }),
    });
    j = await res.json().catch(() => null);
    if (res.status !== 429 || attempt >= 5) break;
    process.stdout.write("⏳");
    await new Promise((r) => setTimeout(r, 22_000));
  }
  // A closed turn is a real outcome, not a failure: the route decided the
  // conversation was over. It has to appear in the transcript as silence, or
  // the goodbye behaviour we built is invisible to review.
  if (j?.closed) return { closed: true, say: "", show: [], chips: [] };
  if (!res.ok || j?.error) return { error: j?.error ?? res.status, say: j?.say ?? "" };
  return j;
}

/* ── one conversation ────────────────────────────────────────────────────── */
async function converse(scenario) {
  const turns = [];
  const history = [];
  const limit = scenario.maxTurns ?? MAX_TURNS;

  for (let i = 0; i < limit; i++) {
    const said = i === 0 ? scenario.opener : await visitorSays(scenario, render(turns));
    // A visitor with nothing to say has left. The model is told not to write
    // stage directions, but under "I already said goodbye" pressure it emits
    // "*(no reply)*" or "(leaves)" anyway — and a stage direction fed to Lorem
    // produced four identical "Take care."s in a live run, a loop no farewell
    // gate can catch because the input was never a farewell.
    if (!said || /^\W*[(*[]/.test(said.trim())) break;
    turns.push({ who: "visitor", text: said });

    const out = await loremSays(history, said, scenario.mode);
    turns.push({
      who: "lorem",
      text: out.say ?? "",
      show: out.show ?? [],
      chips: out.chips ?? [],
      closed: !!out.closed,
      error: out.error,
      facts: out.facts,
    });

    if (out.closed) break; // the route ended it; anything after would be fiction
    if (out.error) break;
    history.push({ role: "user", content: said }, { role: "assistant", content: out.say });
  }
  return turns;
}

/* ── transcript ──────────────────────────────────────────────────────────── */
function render(turns) {
  return turns
    .map((t) => {
      if (t.who === "visitor") return `**VISITOR** — ${t.text}\n`;
      if (t.closed) return `**LOREM** — *(closed the conversation, said nothing)*\n`;
      if (t.error) return `**LOREM** — *(error: ${t.error})* ${t.text}\n`;
      const bits = [`**LOREM** — ${t.text}`];
      if (t.show?.length) {
        bits.push(
          `\n\`SHOW\` ` +
            t.show
              .map((b) =>
                b.type === "metrics"
                  ? `metrics[${b.items.map((i) => t.facts?.[i.factId]?.value ?? i.factId).join(", ")}]`
                  : b.type,
              )
              .join(" · "),
        );
      }
      if (t.chips?.length) bits.push(`\n\`CHIPS\` ${t.chips.join(" · ")}`);
      return `${bits.join("")}\n`;
    })
    .join("\n");
}

/* ── go ──────────────────────────────────────────────────────────────────── */
const picked = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const list = picked.length ? picked.map(byId).filter(Boolean) : SCENARIOS;
if (!list.length) {
  console.error(`No such scenario. Have: ${SCENARIOS.map((s) => s.id).join(", ")}`);
  process.exit(1);
}

// Reachability first: a run that fails on scenario six has already spent money.
try {
  const ping = await fetch(`${APP}/api/lorem`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: "ping", history: [] }),
  });
  if (ping.status === 404) throw new Error("404");
} catch {
  console.error(`Cannot reach ${APP}/api/lorem — start the app first (npm run dev).`);
  process.exit(1);
}

const runId = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const dir = join(RUNS, runId);
mkdirSync(dir, { recursive: true });

console.log(`\n  Run ${runId} → ${APP}\n`);
for (const s of list) {
  process.stdout.write(`  ${s.id.padEnd(18)}`);
  try {
    const turns = await converse(s);
    const md =
      `# ${s.id} · ${s.mode}\n\n> ${s.brief.replace(/\n/g, "\n> ")}\n\n---\n\n` + render(turns);
    writeFileSync(join(dir, `${s.id}.md`), md);
    const lorem = turns.filter((t) => t.who === "lorem");
    console.log(`${turns.length} turns${lorem.some((t) => t.closed) ? ", closed" : ""}`);
  } catch (e) {
    console.log(`FAILED — ${e.message}`);
  }
}

writeFileSync(
  join(dir, "meta.json"),
  JSON.stringify({ runId, app: APP, visitorModel: VISITOR_MODEL, scenarios: list.map((s) => s.id), at: new Date().toISOString() }, null, 2) + "\n",
);
writeFileSync(join(RUNS, "latest"), runId + "\n");

console.log(`\n  Written to test/gym/runs/${runId}/`);
console.log(`  Grade it:  node test/gym/bench.mjs\n`);
