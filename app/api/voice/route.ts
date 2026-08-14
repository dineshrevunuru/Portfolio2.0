import { NextResponse } from "next/server";
import { ELEVENLABS, OPENAI, hostedVoice, voiceConfigWarning } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Abuse control ─────────────────────────────────────────────────────────
   TTS is billed per character, so this endpoint is the expensive one to leave
   open. Three limits stack: a character cap per request, a request cap per
   minute per IP, and — the only real ceiling — the spend cap you set in the
   provider console. Set one.                                                */

const MAX_CHARS = 600;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/**
 * Capability probe. The client calls this once on mount to decide whether to
 * use hosted audio or the browser's synthesiser. It reports *whether* voice is
 * hosted, never which vendor or with what credentials.
 */
export async function GET() {
  const warning = voiceConfigWarning();
  if (warning) console.warn(`[voice] ${warning}`);
  return NextResponse.json({ hosted: hostedVoice() !== null });
}

export async function POST(req: Request) {
  const provider = hostedVoice();
  if (!provider) {
    // Not an error: the browser synthesiser is a legitimate configuration.
    return NextResponse.json({ error: "browser_voice" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const input = text.slice(0, MAX_CHARS);

  let upstream: Response;
  try {
    upstream =
      provider === "elevenlabs"
        ? await fetch(
            // The /stream endpoint, not the plain one. Measured against this account:
            // the plain endpoint generates the whole file before sending a byte,
            // so v3 took 5,983ms to first audio on a 44-word answer. Streaming,
            // the same text starts in 585ms. The route already forwards
            // upstream.body untouched, so the only thing that was buffering was
            // the endpoint choice and the client's await res.blob().
            `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(ELEVENLABS.voiceId)}/stream`,
            {
              method: "POST",
              headers: {
                "xi-api-key": ELEVENLABS.key,
                "content-type": "application/json",
                accept: "audio/mpeg",
              },
              body: JSON.stringify({
                text: input,
                model_id: ELEVENLABS.model,
                /* Tuned for human-ness over speed, 2026-08-12.
                   speed was 1.03. A 3% speed-up is below the threshold where a
                   listener consciously notices tempo, but it is exactly where
                   they start hearing "synthetic": natural speech varies its
                   pace, and a uniform nudge reads as a machine in a hurry. 1.0
                   lets the model's own phrasing carry the rhythm.
                   stability 0.4 -> 0.35 widens prosodic variation. Below ~0.3
                   this voice starts drifting in timbre between sentences, which
                   is worse than flat, so 0.35 is the floor worth holding.
                   style adds expressiveness; use_speaker_boost tightens
                   similarity to the source voice. Both are ignored by models
                   that do not support them, so this stays safe across a model
                   switch. */
                voice_settings: {
                  stability: 0.35,
                  similarity_boost: 0.75,
                  style: 0.35,
                  use_speaker_boost: true,
                  speed: 1.0,
                },
              }),
              signal: AbortSignal.timeout(20_000),
            },
          )
        : await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
              authorization: `Bearer ${OPENAI.key}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              model: OPENAI.model,
              voice: OPENAI.voice,
              input,
              response_format: "mp3",
            }),
            signal: AbortSignal.timeout(20_000),
          });
  } catch {
    // The client falls back to browser speech on any non-200 — Lorem keeps
    // talking, just less well.
    console.error(`[voice] ${provider} unreachable`);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    // Never echo the upstream body; it can contain request detail.
    console.error(`[voice] ${provider} returned ${upstream.status}`);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": "audio/mpeg",
      "cache-control": "no-store",
    },
  });
}
