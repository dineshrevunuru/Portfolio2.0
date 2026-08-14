/**
 * Render Lorem's fixed lines to audio with Eleven v3, once, at build time.
 *
 * WHY THIS EXISTS. v3 is the expressive model and the only one that accepts
 * audio tags, but it is a larger model on a higher-fidelity codec and
 * ElevenLabs leaves it out of their own real-time recommendations. On a live
 * turn that cost lands on a visitor standing in silence, which is the one
 * currency this interface cannot spend. Rendered ahead of time it costs a
 * build instead, so the single line every visitor hears gets the best voice
 * available and arrives instantly, while live answers stay on Flash.
 *
 * It also removes a per-visit API call for the most-played line on the site.
 *
 * Run:  node scripts/prerender-voice.mjs
 * Needs ELEVENLABS_API_KEY in the environment (or .env.local).
 *
 * Writes public/voice/<id>.mp3 and a generated manifest the client imports.
 * Both are COMMITTED: a deploy must not depend on an API call succeeding, and
 * a missing file silently degrades to Flash, which is fine but is not what we
 * chose. Re-run whenever a fixed line changes.
 */
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public", "voice");
const MANIFEST = join(ROOT, "app", "components", "lorem", "prerendered.generated.ts");

/* ── env ─────────────────────────────────────────────────────────────────── */
// .env.local is not loaded outside Next, and this script is deliberately run by
// hand rather than in the build, so it reads the file itself.
function env(name) {
  if (process.env[name]) return process.env[name];
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return "";
  const line = readFileSync(p, "utf8")
    .split("\n")
    .find((l) => l.startsWith(`${name}=`));
  return line ? line.slice(name.length + 1).trim() : "";
}

const KEY = env("ELEVENLABS_API_KEY");
const VOICE = env("ELEVENLABS_VOICE_ID") || "X03mvPuTfprif8QBAVeJ";
const MODEL = env("ELEVENLABS_PRERENDER_MODEL") || "eleven_v3";

if (!KEY) {
  console.error("ELEVENLABS_API_KEY is not set. Nothing rendered.");
  process.exit(1);
}

/* ── the lines ───────────────────────────────────────────────────────────── */
// greeting.ts is TypeScript, and this script runs on bare node, so the lines
// are rebuilt here from the same rules rather than imported. That is a
// duplication with a guard: the check below fails the run if the two ever
// disagree, so drift is loud instead of silent.
const src = readFileSync(join(ROOT, "app/components/lorem/greeting.ts"), "utf8");

const howOf = (touch) =>
  touch ? "Tap the orb when you want to talk." : "Hold Space when you want to talk.";
const build = ({ returning, touch }) =>
  `${returning ? "Welcome back. " : ""}I'm Lorem. Ask me about Dinesh's work, the numbers behind it, ` +
  `or the parts that did not go well. ${howOf(touch)}`;

// Guard: every literal this script depends on must still be present in the TS.
for (const needle of [
  "I'm Lorem. Ask me about Dinesh's work, the numbers behind it, ",
  "or the parts that did not go well. ",
  "Tap the orb when you want to talk.",
  "Hold Space when you want to talk.",
  "Welcome back. ",
]) {
  if (!src.includes(needle)) {
    console.error(
      `greeting.ts no longer contains ${JSON.stringify(needle)}.\n` +
        "This script's copy of the lines has drifted. Update it, then re-run.",
    );
    process.exit(1);
  }
}

const TAG = (src.match(/PRERENDER_TAG = "([^"]+)"/) ?? [, "[warm]"])[1];

const VARIANTS = [
  { id: "greet-new-desktop", vars: { returning: false, touch: false } },
  { id: "greet-new-touch", vars: { returning: false, touch: true } },
  { id: "greet-back-desktop", vars: { returning: true, touch: false } },
  { id: "greet-back-touch", vars: { returning: true, touch: true } },
];

/* ── render ──────────────────────────────────────────────────────────────── */
mkdirSync(OUT_DIR, { recursive: true });
const manifest = {};

for (const { id, vars } of VARIANTS) {
  const text = build(vars);
  // The tag is v3 syntax and prefixes the text for delivery. It is never stored
  // in the manifest key: the key must match what the RUNTIME asks to speak, and
  // the runtime knows nothing about tags.
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(VOICE)}`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({
        text: `${TAG} ${text}`,
        model_id: MODEL,
        // Natural keeps the voice recognisably itself while still responding to
        // the tag. Creative drifts, Robust ignores direction.
        voice_settings: { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true },
      }),
    },
  );

  if (!res.ok) {
    console.error(`  ✗ ${id}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    process.exit(1);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(OUT_DIR, `${id}.mp3`), buf);
  manifest[text] = `/voice/${id}.mp3`;
  console.log(`  ✓ ${id}.mp3  ${(buf.length / 1024).toFixed(1)}kb`);
}

/* ── manifest ────────────────────────────────────────────────────────────── */
// Keyed by the EXACT string the client will pass to say(), so the lookup is a
// plain map hit with no hashing, no normalising, and no chance of a near-miss
// playing the wrong line.
writeFileSync(
  MANIFEST,
  `/**
 * GENERATED by scripts/prerender-voice.mjs. Do not edit.
 *
 * Maps a fixed line to its pre-rendered ${MODEL} audio. A miss is not an error:
 * the line is synthesised live on Flash instead, which is the same words in a
 * slightly plainer delivery.
 */
export const PRERENDERED: Record<string, string> = ${JSON.stringify(manifest, null, 2)};
`,
);

console.log(`\nWrote ${Object.keys(manifest).length} lines to public/voice/ + the manifest.`);
console.log("Commit both. A deploy must not depend on this API call.");
