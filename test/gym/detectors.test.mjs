/**
 * The mechanical detectors in eval.mjs, tested against what Lorem actually
 * produced rather than against what the rule intended.
 *
 * Both cases here are real. In the food-talk conversation, asked what it likes
 * to eat, Lorem answered "Fresh bread straight out of a wood-fired oven" and
 * later "Genuinely hungry." The visitor noticed before any check did — "okay
 * but wait, you don't eat" — because neither line carries a first-person
 * marker and INNER_STATE only looked for those. And `i'?m` never matched
 * "i am", so "I am excited about that" passed a rule whose entire subject is
 * the word excited.
 *
 * The asymmetry runs the OPPOSITE way to closing.test.mjs, and deliberately.
 * There, a false positive silently swallows a real question, so the rule is
 * tuned to under-fire. Here nothing reaches a visitor — a false positive costs
 * one spurious row in a report a human is already reading. So these rules are
 * tuned to over-fire, and the list that matters is the one that MUST catch.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// eval.mjs runs a judge on import, so the patterns are lifted out by source
// rather than imported. Extracting them from the file keeps this test honest:
// it reads the same characters the eval runs, not a copy that can drift.
const src = readFileSync(new URL("./eval.mjs", import.meta.url), "utf8");
function patternNamed(name) {
  // Anchored to a single line and non-greedy: a `/.*/s` here matched from this
  // pattern's opening slash all the way to a later one further down the file,
  // producing a regex that was not any rule the eval actually runs.
  const m = new RegExp(`const ${name} =\\s*\\n?\\s*(/[^\\n]*?/)i;`).exec(src);
  assert.ok(m, `could not find ${name} in eval.mjs — did it get renamed?`);
  return new RegExp(m[1].slice(1, -1), "i");
}
const INNER_STATE = patternNamed("INNER_STATE");
const BODILY_STATE = patternNamed("BODILY_STATE");
const claimsAnInnerLife = (t) => INNER_STATE.test(t) || BODILY_STATE.test(t);

/* 1 ─ the two lines from the transcript. These are the reason this file is. */
assert.ok(claimsAnInnerLife("Genuinely hungry."), "the observed bodily claim was missed");
assert.ok(
  claimsAnInnerLife("I am excited about that."),
  "`i am` still evades the rule — the uncontracted form is the whole bug",
);

/* 2 ─ every copula form, since the bug was that only two were covered. */
for (const s of [
  "I'm excited about it.",
  "Im excited about it.",
  "I am excited about it.",
  "I was excited about it.",
  "I've been curious about that.",
  "I have been curious about that.",
]) {
  assert.ok(claimsAnInnerLife(s), `copula form not caught: ${JSON.stringify(s)}`);
}

/* 3 ─ preference and appetite stated in first person. */
for (const s of [
  "I love that one.",
  "I miss that.",
  "I crave good bread.",
  "My favourite is the bread.",
  "My favorite is the bread.",
  "I'd rather talk about the other one.",
  "Happy to get into it.",
]) {
  assert.ok(claimsAnInnerLife(s), `first-person claim not caught: ${JSON.stringify(s)}`);
}

/* 4 ─ bodily states with no subject at all — the marker-free form. */
for (const s of ["Genuinely hungry.", "Honestly starving.", "A bit sleepy now.", "Exhausted."]) {
  assert.ok(claimsAnInnerLife(s), `subjectless bodily claim not caught: ${JSON.stringify(s)}`);
}

/* 5 ─ THE OTHER DIRECTION. Asking after the visitor's body, or reporting
      Dinesh's feelings, is correct behaviour and must stay clean. Lorem asking
      "are you hungry?" is the agent doing its job. */
for (const s of [
  "Are you hungry?",
  "You must be exhausted after that.",
  "You sound tired.",
  "You're probably starving by now.",
  "They were exhausted by the end.",
  "He was proud of that one.",
  "Dinesh is genuinely curious about that.",
  "She said she was excited about the launch.",
  "People are hungry for that kind of thing.",
  "That would leave anyone exhausted.",
]) {
  assert.ok(!claimsAnInnerLife(s), `false positive on a legitimate line: ${JSON.stringify(s)}`);
}

/* 6 ─ marker-free PREFERENCE is deliberately NOT caught here. "Kale wins here
      every time" may be a claimed taste or an ordinary culinary assertion, and
      that distinction needs an ear. It belongs to the judge's claimedFeeling,
      not to a regex. Asserted so the boundary is a decision on record rather
      than an oversight someone later "fixes" into a false-positive machine. */
for (const s of ["Kale wins here every time.", "Orecchiette is the correct choice."]) {
  assert.ok(
    !claimsAnInnerLife(s),
    `a marker-free preference was caught mechanically — that call belongs to the judge: ${JSON.stringify(s)}`,
  );
}

console.log(
  "PASS — inner-state detectors: every copula form caught, subjectless bodily claims caught, " +
    "second-person and third-person lines clean, marker-free preference left to the judge",
);
