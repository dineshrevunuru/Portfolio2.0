/**
 * The pre-rendered audio must match the words the app actually speaks.
 *
 * This is the silent failure this file exists to prevent: a manifest is keyed
 * by the EXACT string passed to say(), so changing a single character in
 * greeting.ts orphans its audio. Nothing throws. The line just quietly
 * synthesises on Flash instead, losing the v3 delivery and the [warm] tag that
 * carries this agent's warmth, and the only symptom is that it sounds slightly
 * flatter than it did yesterday.
 */
import assert from "node:assert/strict";
import { buildGreeting, GREETING_VARIANTS } from "../.test-build/components/lorem/greeting.js";
import { PRERENDERED } from "../.test-build/components/lorem/prerendered.generated.js";

const keys = Object.keys(PRERENDERED);
assert.ok(keys.length > 0, "manifest is empty — run: node scripts/prerender-voice.mjs");

for (const { id, vars } of GREETING_VARIANTS) {
  const text = buildGreeting(vars);
  assert.ok(
    PRERENDERED[text],
    `no pre-rendered audio for ${id}.\n  wanted: ${JSON.stringify(text)}\n  have:   ${keys.map((k) => JSON.stringify(k)).join("\n          ")}\n\n  Re-run: node scripts/prerender-voice.mjs`,
  );
}

// And nothing stale: every manifest entry must still be a line the app can say.
const spoken = new Set(GREETING_VARIANTS.map(({ vars }) => buildGreeting(vars)));
for (const k of keys) {
  assert.ok(spoken.has(k), `manifest holds a line the app no longer speaks: ${JSON.stringify(k)}`);
}

/* The prohibition the greeting exists under: it may not claim a feeling. */
for (const { vars } of GREETING_VARIANTS) {
  const g = buildGreeting(vars).toLowerCase();
  for (const claim of ["excited", "i'm glad", "happy to", "i love", "i enjoy", "i'd rather", "i feel", "delighted", "thrilled"]) {
    assert.ok(!g.includes(claim), `the greeting claims an inner state: "${claim}"`);
  }
  assert.ok(!g.includes("—"), "the greeting contains an em dash");
  for (const banned of ["very ", "really ", "just ", "seamless", "delightful"]) {
    assert.ok(!g.includes(banned), `the greeting uses a banned word: "${banned.trim()}"`);
  }
}

console.log(`PASS — ${GREETING_VARIANTS.length} greeting variants all have v3 audio, no stale entries, no claimed feelings`);
