import { NextResponse } from "next/server";
import { ELEVENLABS, hostedStt } from "../config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Abuse control ─────────────────────────────────────────────────────────
   Scribe bills per minute of audio, and this endpoint accepts uploads, so it
   is the easiest thing on the site to abuse. Three limits stack: a byte cap, a
   request cap per minute per IP, and the spend cap in the provider console.  */

const MAX_BYTES = 4 * 1024 * 1024; // ~4 min of webm/opus at 128kbps
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

/** Capability probe — mirrors /api/voice so the client can decide once, on mount. */
export async function GET() {
  return NextResponse.json({ hosted: hostedStt() });
}

export async function POST(req: Request) {
  if (!hostedStt()) {
    // Not an error: the browser recognizer is a legitimate configuration.
    return NextResponse.json({ error: "browser_stt" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let audio: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("audio");
    if (f instanceof File) audio = f;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!audio || audio.size === 0) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (audio.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const upstream = new FormData();
  // Scribe's field is `file`; ours is `audio` so the two can't be confused.
  upstream.append("file", audio, audio.name || "speech.webm");
  upstream.append("model_id", ELEVENLABS.sttModel);
  // Single speaker, no timings needed, and tag_audio_events defaults to TRUE —
  // left on it injects "(laughs)"-style markers into the transcript we hand to
  // Claude. All three verified against the API reference.
  upstream.append("diarize", "false");
  upstream.append("tag_audio_events", "false");
  upstream.append("timestamps_granularity", "none");

  let res: Response;
  try {
    res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": ELEVENLABS.key },
      body: upstream,
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    console.error("[stt] elevenlabs unreachable");
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  if (!res.ok) {
    // Never echo the upstream body — it can carry request detail.
    console.error(`[stt] elevenlabs returned ${res.status}`);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  const data = (await res.json().catch(() => null)) as {
    text?: string;
    language_code?: string;
    language_probability?: number;
  } | null;

  const text = data?.text?.trim() ?? "";
  if (!text) {
    // Silence or unintelligible audio — a normal outcome, not a failure.
    return NextResponse.json({ text: "", empty: true });
  }

  return NextResponse.json({
    text,
    language: data?.language_code ?? null,
    confidence: data?.language_probability ?? null,
  });
}
