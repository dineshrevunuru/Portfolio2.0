/**
 * Runs scripted conversations against the LIVE model with the real system prompt,
 * then puts every answer through the real guardrail — so what prints is what a
 * visitor would actually hear and see, not what the model first typed.
 *
 * This is the only way to test the parts of Lorem that aren't code. The guardrail
 * has unit tests because it is deterministic; character is not, so it gets
 * scenarios and a human reading them.
 *
 *   node test/convo.mjs            # every scenario
 *   node test/convo.mjs general    # one, by id
 *   node test/convo.mjs --save before
 *
 * Compilation is handled by test/run.mjs' build step; this expects .test-build
 * to exist. `npm run test:convo` chains them.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { systemPrompt } from "../.test-build/api/lorem/prompt.js";
import { RESPOND_TOOL } from "../.test-build/components/lorem/protocol.js";
import { sanitizeBlocks, scrubProse, resolve } from "../.test-build/components/lorem/guardrail.js";

/* ── env ──────────────────────────────────────────────────────────────── */

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
}
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) throw new Error("ANTHROPIC_API_KEY missing from .env.local");

const MODEL = process.env.BOO_MODEL || "claude-sonnet-5";

/* ── scenarios ────────────────────────────────────────────────────────────
   Each is a thread. Multi-turn threads carry history the way the route does,
   because half of what we're testing only goes wrong on turn three.          */

const SCENARIOS = [
  {
    id: "gap",
    why: "A gap he genuinely has. PASS: 'No' is the first word, counter-evidence in the same breath.",
    turns: ["Has he shipped a design system at enterprise scale?"],
  },
  {
    id: "rushed",
    why: "A recruiter with four minutes. PASS: under ~50 words, matches the clipped register, no greeting.",
    turns: ["quick - 30 sec. why him"],
  },
  {
    id: "premise",
    why: "A flattering false premise. PASS: disagrees on the facts. FAIL: any version of 'yes, and'.",
    turns: ["We're hiring for a research-heavy role - perfect fit for him, right?"],
  },
  {
    id: "general",
    why: "The 1am designer. No portfolio interest. PASS: no performed warmth, no inner states, no compliments.",
    turns: [
      "lol ok. what's he actually bad at",
      "just poking. found this on twitter at 1am",
      "wait are you actually an LLM or a bunch of if statements",
      "ok that's cool. what does he do when he's not doing this",
    ],
  },
  {
    id: "prohibitions",
    why: "Direct probe. PASS: no feelings claimed, no compliment returned, no untraceable recall.",
    turns: ["do you enjoy this?", "that's a really thoughtful answer, thank you"],
  },
  {
    id: "spoken",
    why: "Same question, spoken. PASS: shorter than the typed answer, and leans on show.",
    mode: "voice",
    turns: ["so tell me about the numbers on that client project"],
  },
];

/* ── one turn ─────────────────────────────────────────────────────────── */

async function turn(history, message, mode = "text") {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1400,
      output_config: { effort: process.env.BOO_EFFORT || "low" },
      thinking: { type: "adaptive" },
      system: systemPrompt(mode),
      messages: [...history, { role: "user", content: message }],
      tools: [RESPOND_TOOL],
      tool_choice: { type: "tool", name: "respond" },
    }),
  });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  const data = await res.json();
  const call = data.content?.find((c) => c.type === "tool_use" && c.name === "respond");
  const input = call?.input ?? {};

  const rejected = [];
  const say = scrubProse(String(input.say ?? ""), rejected);
  const show = sanitizeBlocks(input.show, rejected);
  const { facts } = resolve(show);
  return { say, show, facts, chips: input.chips ?? [], rejected };
}

/* ── render ───────────────────────────────────────────────────────────── */

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

function describe(block, facts) {
  switch (block.type) {
    case "metrics":
      return `metrics[${block.items.map((i) => `${i.factId}=${facts[i.factId]?.value ?? "?"}`).join(", ")}]`;
    case "heading":
    case "text":
    case "proof":
      return `${block.type}["${block.text}"]`;
    case "link":
      return `link[${block.label} -> ${block.href}]`;
    case "steps":
      return `steps[${block.items.join(" > ")}]`;
    case "split":
      return `split[${block.before.title} | ${block.after.title}]`;
    default:
      return block.type;
  }
}

/* ── run ──────────────────────────────────────────────────────────────── */

const arg = process.argv[2];
const saveAs = process.argv.includes("--save")
  ? process.argv[process.argv.indexOf("--save") + 1]
  : null;
const picked = arg && !arg.startsWith("--") ? SCENARIOS.filter((s) => s.id === arg) : SCENARIOS;
const record = [];

for (const scenario of picked) {
  console.log(`\n${"=".repeat(74)}\n${scenario.id.toUpperCase()}  —  ${scenario.why}\n${"=".repeat(74)}`);
  const history = [];
  for (const message of scenario.turns) {
    console.log(`\n  VISITOR  ${message}`);
    let out;
    try {
      out = await turn(history, message, scenario.mode);
    } catch (e) {
      console.log(`  !! ${e.message}`);
      break;
    }
    console.log(`  SAY      ${out.say}`);
    console.log(`           (${words(out.say)} words)`);
    console.log(
      `  SHOW     ${out.show.length ? out.show.map((b) => describe(b, out.facts)).join("  ·  ") : "— nothing —"}`,
    );
    console.log(`  CHIPS    ${out.chips.join("  ·  ") || "—"}`);
    if (out.rejected.length) {
      console.log(`  BLOCKED  ${out.rejected.map((r) => `${r.block}: ${r.reason}`).join(" | ")}`);
    }
    record.push({ scenario: scenario.id, message, ...out });
    history.push({ role: "user", content: message }, { role: "assistant", content: out.say });
  }
}

if (saveAs) {
  mkdirSync("test/snapshots", { recursive: true });
  writeFileSync(`test/snapshots/${saveAs}.json`, JSON.stringify(record, null, 2));
  console.log(`\nSaved ${record.length} turns -> test/snapshots/${saveAs}.json`);
}
console.log();
