/**
 * The two ways a conversation used to fail to end.
 *
 * Both came out of live simulated conversations: recruiter.md closes with
 * "Bye." five times, and skeptic.md:60 has Lorem repeat the visitor's sentence
 * back verbatim. This file exists because the fix has an asymmetric failure
 * mode — a missed farewell costs one redundant turn, a false positive silently
 * swallows a real question — so the false-positive list matters more than the
 * true-positive one and is deliberately full of traps.
 */
import assert from "node:assert/strict";
import { isEcho, isFarewell } from "../.test-build/components/lorem/closing.js";

/* 1 ─ real farewells close */
const farewells = [
  "Bye.", "bye", "Bye!", "byeee", "Later.", "later", "laters",
  "see ya", "see you", "cya", "ciao", "peace", "cheers",
  "thanks", "Thanks!", "Thank you.", "thx", "ty",
  "Take care.", "take care", "gn", "good night", "goodnight", "night",
  "I'm out", "im out", "gotta go", "g2g", "Done.", "that's it",
  "all good", "ok bye", "okay bye",
];
for (const s of farewells) {
  assert.ok(isFarewell(s), `missed a farewell: ${JSON.stringify(s)}`);
}

/* 2 ─ FALSE POSITIVES — the expensive direction. A farewell word carrying real
      freight must reach the model. These are the messages that would be
      silently swallowed by a looser rule. */
const mustPass = [
  "thanks, what did that cost?",
  "Thanks for that. What broke first?",
  "thank you, but what about the denominator",
  "later he rewrote the migration",
  "see you mentioned a migration, tell me more",
  "done anything with agents?",
  "are you done talking about the numbers",
  "peace of mind was the actual goal here right",
  "night shifts were when the bugs showed up",
  "all good designers do research though",
  "that's it? seems thin for eleven weeks",
  "what's he actually bad at?",
  "Show me the numbers",
  "cheers to that, now tell me the weak part",
  "ok bye is what the customer said and then left",
];
for (const s of mustPass) {
  assert.ok(!isFarewell(s), `swallowed a real message: ${JSON.stringify(s)}`);
}

/* 3 ─ empty and whitespace are not farewells */
for (const s of ["", "   ", "\n"]) {
  assert.ok(!isFarewell(s), `treated blank as a farewell: ${JSON.stringify(s)}`);
}

/* 4 ─ echo detection: the skeptic.md:60 failure */
assert.ok(
  isEcho("That's the tab I'll actually use.", "That's the tab I'll actually use."),
  "the verbatim echo from the transcript was not caught",
);
// normalised, because the failure is the repetition, not the characters
assert.ok(isEcho("thats the tab ill actually use", "That's the tab I'll actually use."), "casing/punctuation defeated echo detection");
assert.ok(isEcho("  Bye.  ", "bye"), "whitespace defeated echo detection");

/* 5 ─ a real answer that merely quotes the visitor is NOT an echo */
assert.ok(
  !isEcho(
    "That's the tab I'll actually use, and the case study is the longer version.",
    "That's the tab I'll actually use.",
  ),
  "an answer that builds on the visitor's words was flagged as an echo",
);
assert.ok(!isEcho("No.", "Did he ship it alone?"), "a short honest answer was flagged as an echo");
assert.ok(!isEcho("", "bye"), "empty say was treated as an echo rather than a scrub failure");

console.log(
  `PASS — ${farewells.length} farewells close, ${mustPass.length} real messages pass through, echo caught both ways`,
);
