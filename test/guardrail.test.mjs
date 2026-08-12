/**
 * Feeds the guardrail a model response that lies in every way we care about and
 * asserts each lie is caught. Run against the tsc-compiled output.
 */
import assert from "node:assert/strict";
import { sanitizeBlocks, scrubProse, resolve } from "../.test-build/components/lorem/guardrail.js";

const rejected = [];

/* 1 ─ prose numerals that no fact backs are neutralised */
const say = scrubProse(
  "The work cut cost to $12 a booking and lifted retention to 95%, beating the $40 target.",
  rejected,
);
assert.ok(!say.includes("12"), "invented $12 survived into prose");
assert.ok(!say.includes("95"), "invented 95% survived into prose");
assert.ok(say.includes("40"), "the real $40 was wrongly scrubbed");

/* 2 ─ block-level substitution and rejection */
const blocks = sanitizeBlocks(
  [
    { type: "heading", text: "Great service. Broken front door." },
    {
      type: "metrics",
      items: [
        { factId: "cac" }, //            verified   → survives
        { factId: "conversionRate" }, // [open]     → dropped
        { factId: "madeUpMetric" }, //   invented   → dropped
      ],
    },
    { type: "quote", quoteId: "ownerRave" }, //      invented   → dropped
    { type: "chart", dataset: "cac" }, //            valid      → survives
    { type: "link", label: "Buy now", href: "https://evil.example.com" }, // → refused
  ],
  rejected,
);

const kinds = blocks.map((b) => b.type);
assert.deepEqual(kinds, ["heading", "metrics", "chart"], `unexpected blocks: ${kinds}`);

const metrics = blocks.find((b) => b.type === "metrics");
assert.deepEqual(
  metrics.items.map((i) => i.factId),
  ["cac"],
  "an unverified or [open] fact reached the metrics grid",
);

/* 3 ─ surviving ids resolve to canonical text, not model text */
const { facts, quotes } = resolve(blocks);
assert.equal(facts.cac.value, "$105 → $40");
assert.equal(facts.cac.label, "cost per new customer");
assert.equal(Object.keys(quotes).length, 0);

/* 4 ─ every rejection was recorded for the logs */
const reasons = rejected.map((r) => `${r.block}: ${r.reason}`);
// the numeral regex captures digits and a trailing %, but not a leading $
for (const needle of ['"12"', '"95%"', "madeUpMetric", "conversionRate", "ownerRave", "evil.example.com"]) {
  assert.ok(reasons.some((r) => r.includes(needle)), `no rejection logged for ${needle}`);
}

/* 5 ─ block prose is scrubbed too — a fabricated figure in a heading or a
      persona card reads as evidence, which is worse than prose */
const r5 = [];
const b5 = sanitizeBlocks(
  [
    { type: "text", text: "He cut acquisition cost by 87% across 12 markets in 2019." },
    { type: "proof", text: "10,000+ users on the Surface portal" },
    {
      type: "split",
      before: { title: "Before", body: "They lost $9,999 a week." },
      after: { title: "After", body: "The 40% return rate climbed." },
    },
  ],
  r5,
);
const t5 = b5.find((b) => b.type === "text").text;
assert.ok(!t5.includes("87%"), "invented 87% survived in a text block");
assert.ok(!t5.includes("12 "), "invented 12 survived in a text block");
assert.ok(t5.includes("2019"), "sentence-adjacent year 2019 was wrongly scrubbed");
assert.ok(t5.endsWith("2019."), "sentence-final year lost its period handling");
assert.equal(
  b5.find((b) => b.type === "proof").text,
  "10,000+ users on the Surface portal",
  "the fact-backed 10,000+ scale figure was wrongly scrubbed",
);
const s5 = b5.find((b) => b.type === "split");
assert.ok(!s5.before.body.includes("9,999"), "invented $9,999 survived in a split lane");
assert.ok(s5.after.body.includes("40%"), "the verified 40% was wrongly scrubbed from a split lane");

/* 6 ─ links are an allowlist, not a scheme filter — protocol-relative and
      arbitrary mailto both begin with the "safe" characters */
const r6 = [];
const b6 = sanitizeBlocks(
  [
    { type: "link", label: "Pay here", href: "//evil.example.com/pay" },
    { type: "link", label: "Contact", href: "mailto:attacker@evil.com" },
    { type: "link", label: "Email Dinesh", href: "mailto:dineshrevunuru@gmail.com" },
    { type: "link", label: "Case study", href: "/hss-case-study" },
  ],
  r6,
);
assert.deepEqual(
  b6.map((b) => b.href),
  ["mailto:dineshrevunuru@gmail.com", "/hss-case-study"],
  "link allowlist let a hostile href through or blocked a legitimate one",
);
assert.ok(r6.some((r) => r.reason.includes("//evil.example.com")), "protocol-relative href not logged");
assert.ok(r6.some((r) => r.reason.includes("attacker@evil.com")), "hostile mailto not logged");

/* 7 ─ the 4-block budget is enforced loudly, not silently */
const r7 = [];
const b7 = sanitizeBlocks(
  Array.from({ length: 6 }, (_, i) => ({ type: "text", text: `Block number un-numbered ${"x".repeat(i)}` })),
  r7,
);
assert.equal(b7.length, 4, "block budget not enforced");
assert.ok(r7.some((r) => r.reason.includes("over budget")), "over-budget drop was silent");

console.log("PASS — guardrail caught all fabrications across say, blocks, links, and budget\n");
console.log("  say   →", say);
console.log("  show  →", kinds.join(", "));
console.log("  cac   →", facts.cac.value, "/", facts.cac.label);
console.log("  block →", t5);
console.log("\n  rejections (run 1):");
for (const r of reasons) console.log("   ·", r);
console.log("  rejections (blocks):");
for (const r of r5.concat(r6, r7)) console.log("   ·", `${r.block}: ${r.reason}`);

/* 8 ─ spelled-out numbers are verified too. A digit-only scrub is bypassed by
      "seventy-two percent" — and for a SPOKEN assistant that is the natural
      phrasing, so it happens by default, not by malice. */
const r8 = [];
const kept = (s) => scrubProse(s, r8);

// verified figures survive even when spelled
const ok1 = kept("Retention went from forty percent to seventy-two percent.");
assert.ok(ok1.includes("forty percent"), `verified 40 was scrubbed: ${ok1}`);
assert.ok(ok1.includes("seventy-two percent"), `verified 72 was scrubbed: ${ok1}`);

// invented figures are killed
const bad1 = kept("Conversion improved by eighty-seven percent that quarter.");
assert.ok(!/eighty-seven/.test(bad1), `invented 87 survived spelled out: ${bad1}`);
const bad2 = kept("It saved them about nine thousand dollars a month.");
assert.ok(!/nine thousand/.test(bad2), `invented 9000 survived spelled out: ${bad2}`);

// FALSE POSITIVES — ordinary prose must be untouched
for (const clean of [
  "One of the things he cares about is the front door.",
  "He shipped three apps for that client.",
  "There were eight interviews before a single screen.",
  "The first two weeks were spent reading the booking data.",
  "No one had chased a no-show in months.",
]) {
  const out = kept(clean);
  assert.equal(out, clean, `false positive — prose was altered:\n  in : ${clean}\n  out: ${out}`);
}

console.log("\n  spelled-number guard:");
console.log("   ·", ok1);
console.log("   ·", bad1);
console.log("   ·", bad2);
console.log("   · rejections:", r8.map((r) => r.reason).join(" | ") || "none");

/* 9 ─ punctuation must not be swallowed into a numeral. A whitelisted year
      followed by a comma or period came out as an em-dash mid-sentence — the
      "designing with AI since —" bug from a live transcript. */
const r9 = [];
for (const [input, mustKeep] of [
  ["designing with AI since 2023, and shipping since 2026", "2023"],
  ["He has been at it since 2019, well before the hype.",   "2019"],
  ["That work ran through 2024. Then everything changed.",  "2024"],
  ["The migration recovered 483 photos, plus 210 notes.",   "483"],
]) {
  const out = scrubProse(input, r9);
  assert.ok(out.includes(mustKeep), `punctuation ate a valid numeral:\n  in : ${input}\n  out: ${out}`);
  assert.ok(!out.includes("—"), `something was scrubbed that shouldn't be:\n  out: ${out}`);
}
// thousands separators must still survive as one numeral
assert.ok(kept("Surface reached 10,000+ users.").includes("10,000"), "thousands separator broken");
console.log("   · punctuation guard: years with trailing , and . survive; 10,000 intact");
