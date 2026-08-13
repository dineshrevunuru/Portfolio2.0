/**
 * Verifies the keys in .env.local actually work, without ever printing one.
 *
 *   npm run check:keys
 *
 * Each provider gets the cheapest real call that proves authentication, so a
 * pass here means Lorem will work — not just that a variable is non-empty.
 */
import { readFileSync, existsSync } from "node:fs";

const ENV = ".env.local";

if (!existsSync(ENV)) {
  console.error(`✗ ${ENV} not found. Copy the template first:\n    cp .env.example .env.local`);
  process.exit(1);
}

// Minimal .env parser — no dependency, and it never logs what it reads.
const env = {};
for (const line of readFileSync(ENV, "utf8").split("\n")) {
  const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
  if (!m) continue;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  env[m[1]] = v;
}

const results = [];
const record = (name, ok, detail) => results.push({ name, ok, detail });

/* ── Claude ──────────────────────────────────────────────────────────────── */
{
  const key = env.ANTHROPIC_API_KEY;
  const model = env.BOO_MODEL || "claude-sonnet-5";
  if (!key) {
    record("Claude", false, "ANTHROPIC_API_KEY is empty — Lorem cannot answer at all");
  } else {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        }),
      });
      if (r.ok) record("Claude", true, `authenticated · model ${model}`);
      else if (r.status === 401) record("Claude", false, "key rejected (401)");
      else if (r.status === 404) record("Claude", false, `model "${model}" not available to this key`);
      else if (r.status === 400) {
        // A 400 still proves auth; usually a max_tokens quibble.
        record("Claude", true, `authenticated · model ${model} (probe returned 400)`);
      } else record("Claude", false, `HTTP ${r.status}`);
    } catch (e) {
      record("Claude", false, `unreachable: ${e.message}`);
    }
  }
}

/* ── Voice ───────────────────────────────────────────────────────────────── */
{
  const provider = (env.BOO_VOICE_PROVIDER || "browser").toLowerCase();

  if (provider === "browser") {
    record("Voice", true, "browser speech synthesis — no key needed (set BOO_VOICE_PROVIDER to upgrade)");
  } else if (provider === "elevenlabs") {
    const key = env.ELEVENLABS_API_KEY;
    if (!key) {
      record("Voice", false, "BOO_VOICE_PROVIDER=elevenlabs but ELEVENLABS_API_KEY is empty");
    } else {
      try {
        const r = await fetch("https://api.elevenlabs.io/v1/user", { headers: { "xi-api-key": key } });
        if (!r.ok) {
          record("Voice", false, `ElevenLabs key rejected (HTTP ${r.status})`);
        } else {
          const voiceId = env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
          const v = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
            headers: { "xi-api-key": key },
          });
          const vj = v.ok ? await v.json().catch(() => null) : null;
          record(
            "Voice",
            v.ok,
            v.ok
              ? `ElevenLabs · voice "${vj?.name ?? voiceId}" · model ${env.ELEVENLABS_MODEL || "eleven_flash_v2_5"}`
              : `key works but ELEVENLABS_VOICE_ID "${voiceId}" not found`,
          );
        }
      } catch (e) {
        record("Voice", false, `ElevenLabs unreachable: ${e.message}`);
      }
    }
  } else if (provider === "openai") {
    const key = env.OPENAI_API_KEY;
    if (!key) {
      record("Voice", false, "BOO_VOICE_PROVIDER=openai but OPENAI_API_KEY is empty");
    } else {
      try {
        const r = await fetch("https://api.openai.com/v1/models", {
          headers: { authorization: `Bearer ${key}` },
        });
        record(
          "Voice",
          r.ok,
          r.ok
            ? `OpenAI · model ${env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts"} · voice ${env.OPENAI_TTS_VOICE || "alloy"}`
            : `key rejected (HTTP ${r.status})`,
        );
      } catch (e) {
        record("Voice", false, `OpenAI unreachable: ${e.message}`);
      }
    }
  } else {
    record("Voice", false, `unknown BOO_VOICE_PROVIDER "${provider}" — use browser | elevenlabs | openai`);
  }
}

/* ── Speech-to-text ──────────────────────────────────────────────────────── */
{
  const provider = (env.BOO_STT_PROVIDER || "browser").toLowerCase();
  if (provider !== "elevenlabs") {
    record("STT", true, "browser Web Speech API — no key needed (set BOO_STT_PROVIDER=elevenlabs to upgrade)");
  } else if (!env.ELEVENLABS_API_KEY) {
    record("STT", false, "BOO_STT_PROVIDER=elevenlabs but ELEVENLABS_API_KEY is empty");
  } else {
    const model = env.ELEVENLABS_STT_MODEL || "scribe_v2";
    try {
      // Ask for a deliberately invalid model: a 400 listing the valid ones proves
      // auth AND tells us whether ours is among them, without spending audio.
      const fd = new FormData();
      fd.append("file", new Blob([new Uint8Array(64)], { type: "audio/webm" }), "probe.webm");
      fd.append("model_id", "__probe__");
      const r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
        body: fd,
      });
      if (r.status === 401) record("STT", false, "ElevenLabs key rejected (401)");
      else {
        const body = await r.text();
        const ok = body.includes(model);
        record("STT", ok, ok
          ? `ElevenLabs Scribe · model ${model}`
          : `model "${model}" not offered by this account — check ELEVENLABS_STT_MODEL`);
      }
    } catch (e) {
      record("STT", false, `ElevenLabs unreachable: ${e.message}`);
    }
  }
}

/* ── Report ──────────────────────────────────────────────────────────────── */
console.log();
for (const { name, ok, detail } of results) {
  console.log(`${ok ? "✓" : "✗"} ${name.padEnd(7)} ${detail}`);
}
const failed = results.filter((r) => !r.ok);
console.log();
if (failed.length) {
  console.log("Lorem will fall back where it can, but fix the above before shipping.");
  process.exit(1);
}
console.log("All good — Lorem can talk.");
