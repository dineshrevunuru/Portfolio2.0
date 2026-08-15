/**
 * Server-side configuration for Lorem's three model calls: the brain, the
 * voice out, and the voice in.
 *
 * Every provider choice is an env var, not a code path, so switching vendors
 * or model tiers is a Vercel setting rather than a deploy. Nothing here is
 * exported to the client — the browser learns what's available from
 * `GET /api/voice`, which reports capability without revealing configuration.
 *
 * NAMING. Anything this app decides is `LOREM_*`. Anything a vendor owns keeps
 * the vendor's conventional name (`ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`,
 * `OPENROUTER_API_KEY`) so it is obvious at a glance which line is a
 * credential and which is a choice this codebase made.
 *
 * The `LOREM_*` names replace `BOO_*`, from before the agent was renamed.
 * `envOf` reads the new name first and falls back to the old one, because a
 * bare rename would have silently dropped BOO_VOICE_PROVIDER and
 * BOO_STT_PROVIDER, which are set in Vercel production — and a dropped voice
 * provider does not error, it quietly degrades to browser speech. That exact
 * shape of failure has already cost this project twice: an env var overriding
 * a changed default, and a changed default ignored because an env var was set.
 * The fallback can be deleted once Vercel holds only LOREM_* names.
 */
function envOf(name: string, legacy?: string): string | undefined {
  return process.env[`LOREM_${name}`] ?? (legacy ? process.env[legacy] : undefined);
}

/* ── The brain ────────────────────────────────────────────────────────────── */

/**
 * Two providers, because they are not interchangeable at the wire level and
 * pretending otherwise is how a model swap turns into an outage.
 *
 * Anthropic's Messages API and OpenRouter's OpenAI-compatible API differ in
 * four places that all matter here: the system prompt is a top-level field
 * versus a first message; tools are `{name, input_schema}` versus
 * `{type:"function", function:{...parameters}}`; the forced-tool syntax
 * differs; and the returned arguments are a parsed object versus a JSON
 * STRING. The last one is the trap — the guardrail reads `input.say`, and on
 * the OpenAI shape that is a string until something parses it.
 *
 * LOREM_BRAIN=openrouter switches provider. Both paths are kept because a public
 * endpoint with one provider has no fallback when that provider's balance
 * hits zero, which is exactly what happened on 2026-08-14.
 */
export type Brain = "anthropic" | "openrouter";

export const BRAIN: Brain =
  (envOf("BRAIN", "BRAIN") ?? "").toLowerCase() === "openrouter"
    ? "openrouter"
    : process.env.OPENROUTER_API_KEY && !process.env.ANTHROPIC_API_KEY
      ? "openrouter"
      : "anthropic";

export const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? "";
export const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? "";

/** Overridable so this can sit behind a gateway, and so tests can mock it. */
export const ANTHROPIC_URL =
  envOf("API_URL", "BOO_API_URL") ?? "https://api.anthropic.com/v1/messages";
export const OPENROUTER_URL =
  envOf("OPENROUTER_URL", "OPENROUTER_URL") ?? "https://openrouter.ai/api/v1/chat/completions";

/** Whichever key the selected brain needs. */
export const BRAIN_KEY = BRAIN === "openrouter" ? OPENROUTER_KEY : ANTHROPIC_KEY;

/**
 * Sonnet by default on Anthropic. In a spoken conversation the visitor is
 * waiting in silence, so time-to-first-word beats the last few points of
 * composition quality. Set LOREM_MODEL=claude-opus-5 to trade back the other way.
 *
 * On OpenRouter the default is google/gemini-3.7-flash: 1.05M context, and it
 * lists tools + tool_choice in supported_parameters, which is the requirement
 * this whole design rests on — the guardrail reads a forced tool call and
 * never free text, so a model without them cannot drive this route at all.
 * $0.375/M in, $1.875/M out.
 *
 * One caveat worth knowing before tuning against it: Gemini also accepts
 * `temperature`, which neither of the other candidates exposed here. The route
 * does not set it, so the provider default applies. If answers come out more
 * varied than Sonnet's, that is the first dial to reach for, not the prompt.
 */
export const LOREM_MODEL =
  envOf("MODEL", "LOREM_MODEL") ?? (BRAIN === "openrouter" ? "google/gemini-3.7-flash" : "claude-sonnet-5");

/**
 * Effort lives inside `output_config`, not at the top level. Default `high` is
 * wrong for this surface: a visitor is waiting in silence for Lorem to speak, and
 * the task is short conversational composition — not multi-step reasoning.
 * `low` is the documented setting for latency-sensitive chat.
 */
export const LOREM_EFFORT = envOf("EFFORT", "LOREM_EFFORT") ?? "low";

/**
 * Adaptive, deliberately. Disabling thinking measured only ~0.55s faster
 * (3.93s vs 4.48s over 3 turns) — and what it buys that time with is exactly
 * the judgement this surface sells: which blocks to show, how to split say
 * from show, whether a question is answerable at all. The numbers guardrail
 * catches invented figures; nothing catches a careless block choice.
 * Set LOREM_THINKING=disabled to trade it back.
 */
export const LOREM_THINKING = envOf("THINKING", "LOREM_THINKING") ?? "adaptive";

/* ── Voice ────────────────────────────────────────────────────────────────── */

export type VoiceProvider = "browser" | "elevenlabs" | "openai";

const rawProvider = (envOf("TTS", "BOO_VOICE_PROVIDER") ?? "browser").toLowerCase();

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

const rawStt = (envOf("STT", "BOO_STT_PROVIDER") ?? "browser").toLowerCase();

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
