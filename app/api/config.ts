/**
 * Server-side configuration for Lorem's two model calls.
 *
 * Every provider choice is an env var, not a code path, so switching TTS
 * vendors or Claude tiers is a Vercel setting rather than a deploy. Nothing
 * here is exported to the client — the browser learns what's available from
 * `GET /api/voice`, which reports capability without revealing configuration.
 */

/* ── Claude ───────────────────────────────────────────────────────────────── */

export const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? "";

/** Overridable so this can sit behind a gateway, and so tests can mock it. */
export const ANTHROPIC_URL = process.env.BOO_API_URL ?? "https://api.anthropic.com/v1/messages";

/**
 * Sonnet by default. In a spoken conversation the visitor is waiting in
 * silence, so time-to-first-word beats the last few points of composition
 * quality. Set BOO_MODEL=claude-opus-5 to trade back the other way.
 */
export const BOO_MODEL = process.env.BOO_MODEL ?? "claude-sonnet-5";

/**
 * Effort lives inside `output_config`, not at the top level. Default `high` is
 * wrong for this surface: a visitor is waiting in silence for Lorem to speak, and
 * the task is short conversational composition — not multi-step reasoning.
 * `low` is the documented setting for latency-sensitive chat.
 */
export const BOO_EFFORT = process.env.BOO_EFFORT ?? "low";

/**
 * Adaptive, deliberately. Disabling thinking measured only ~0.55s faster
 * (3.93s vs 4.48s over 3 turns) — and what it buys that time with is exactly
 * the judgement this surface sells: which blocks to show, how to split say
 * from show, whether a question is answerable at all. The numbers guardrail
 * catches invented figures; nothing catches a careless block choice.
 * Set BOO_THINKING=disabled to trade it back.
 */
export const BOO_THINKING = process.env.BOO_THINKING ?? "adaptive";

/* ── Voice ────────────────────────────────────────────────────────────────── */

export type VoiceProvider = "browser" | "elevenlabs" | "openai";

const rawProvider = (process.env.BOO_VOICE_PROVIDER ?? "browser").toLowerCase();

export const VOICE_PROVIDER: VoiceProvider =
  rawProvider === "elevenlabs" || rawProvider === "openai" ? rawProvider : "browser";

/**
 * Defaults match the voice already in use by `aria-portfolio` and `saathi`, so
 * Lorem sounds like itself across projects rather than being re-cast per surface.
 */
export const ELEVENLABS = {
  key: process.env.ELEVENLABS_API_KEY ?? "",
  voiceId: process.env.ELEVENLABS_VOICE_ID ?? "X03mvPuTfprif8QBAVeJ",
  /**
   * v3 everywhere, live turns included. Dinesh's call, and it is only
   * affordable because the audio path streams.
   *
   * Measured on this account, 44-word answer, median of three:
   *
   *                    first audio    complete
   *   flash, buffered      497ms        513ms
   *   v3,    buffered    5,983ms      6,060ms   ← what this used to be
   *   flash, streaming     135ms        513ms
   *   v3,    streaming     585ms      6,335ms   ← what it is now
   *
   * Buffered, v3 costs five and a half extra seconds of silence per turn on
   * top of the model call, which is not a trade, it is a wall. Streaming, it
   * costs about 450ms more to first word than Flash, which sits inside a
   * normal conversational gap. Generation finishes in 6.3s while the same
   * words take roughly fifteen seconds to speak, so playback never catches up
   * with it.
   *
   * WHAT THIS BUYS: audio tags, which are v3-only, on every line rather than
   * only the pre-rendered ones. That is the one mechanism that gets warmth
   * into this agent without breaking the rule against claiming an inner state.
   *
   * ⚠ The gain is entirely dependent on streaming, in BOTH places: the route
   * must call the /stream endpoint, and useSpeech must feed MediaSource rather
   * than await res.blob(). Undo either and this silently becomes a six-second
   * wait. Safari has no MediaSource for audio/mpeg and takes the buffered
   * path, so it pays the full generation time.
   *
   * Set ELEVENLABS_MODEL=eleven_flash_v2_5 to trade the tags back for ~450ms.
   */
  model: process.env.ELEVENLABS_MODEL ?? "eleven_v3",
  /**
   * v3, for lines whose text is known ahead of time and can therefore be
   * rendered once. Audio tags ([warm], [laughs], [sighs]) are v3-only, and
   * they are the one way this agent can carry warmth without breaking the rule
   * that it must never claim an inner state: a warm delivery is not a claimed
   * feeling, it is how the line is said.
   */
  prerenderModel: process.env.ELEVENLABS_PRERENDER_MODEL ?? "eleven_v3",
  /**
   * Scribe, for voice IN. Verified against the account on 2026-07-25 — the API
   * accepts scribe_v1, scribe_v1_experimental and scribe_v2 on the file endpoint.
   */
  sttModel: process.env.ELEVENLABS_STT_MODEL ?? "scribe_v2",
};

export const OPENAI = {
  key: process.env.OPENAI_API_KEY ?? "",
  model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
  voice: process.env.OPENAI_TTS_VOICE ?? "alloy",
};

/**
 * A provider is only "hosted" if it is both selected AND has a key. A selected
 * provider with no key must fall back to the browser rather than fail silently
 * — a portfolio that has simply gone mute is the worst outcome here.
 */
export function hostedVoice(): Exclude<VoiceProvider, "browser"> | null {
  if (VOICE_PROVIDER === "elevenlabs" && ELEVENLABS.key) return "elevenlabs";
  if (VOICE_PROVIDER === "openai" && OPENAI.key) return "openai";
  return null;
}

const rawStt = (process.env.BOO_STT_PROVIDER ?? "browser").toLowerCase();

export const STT_PROVIDER: "browser" | "elevenlabs" =
  rawStt === "elevenlabs" ? "elevenlabs" : "browser";

/**
 * Hosted speech-to-text. Only ElevenLabs Scribe today; the browser's own
 * recognizer stays the fallback wherever this is off or fails, so voice input
 * never depends on a vendor being up.
 */
export function hostedStt(): boolean {
  return STT_PROVIDER === "elevenlabs" && !!ELEVENLABS.key;
}

/** Human-readable misconfiguration, for logs and `npm run check:keys`. */
export function voiceConfigWarning(): string | null {
  if (VOICE_PROVIDER === "elevenlabs" && !ELEVENLABS.key)
    return "BOO_VOICE_PROVIDER=elevenlabs but ELEVENLABS_API_KEY is unset — falling back to browser speech.";
  if (VOICE_PROVIDER === "openai" && !OPENAI.key)
    return "BOO_VOICE_PROVIDER=openai but OPENAI_API_KEY is unset — falling back to browser speech.";
  return null;
}
