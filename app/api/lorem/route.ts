import { NextResponse } from "next/server";
import { resolve, sanitizeBlocks, scrubProse, type Rejection } from "../../components/lorem/guardrail";
import { RESPOND_TOOL, type LoremTurn } from "../../components/lorem/protocol";
import { ANTHROPIC_KEY, ANTHROPIC_URL, BOO_EFFORT, BOO_MODEL, BOO_THINKING } from "../config";
import { systemPrompt } from "./prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_HISTORY_TURNS = 16;
const MAX_MESSAGE_CHARS = 500;

/* ── Rate limiting ─────────────────────────────────────────────────────────
   In-memory and therefore per-instance: a serverless fleet gives each cold
   instance its own window, so this is friction, not a wall. It stops a bored
   visitor holding down Enter. The real ceiling is the spend cap in the
   Anthropic console — set one.                                              */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear(); // crude bound; this is not a datastore
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const key = ANTHROPIC_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "unconfigured", say: "My model isn't connected yet — ask me again once it is." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", say: "Give me a second to catch up — ask me again in a moment." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { message, history, mode } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
    mode?: unknown;
  };
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Whether they spoke or typed changes what a good answer looks like — a
  // listener can't rewind, so spoken turns want fewer words and more on screen.
  // The client knows this and never told the model; now it does.
  const inputMode = mode === "voice" ? "voice" : "text";

  const priorTurns = (Array.isArray(history) ? history : [])
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        typeof m === "object" &&
        ((m as { role?: unknown }).role === "user" ||
          (m as { role?: unknown }).role === "assistant") &&
        typeof (m as { content?: unknown }).content === "string",
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  const messages = [
    ...priorTurns,
    { role: "user" as const, content: message.slice(0, MAX_MESSAGE_CHARS) },
  ];

  let res: Response;
  try {
    res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: BOO_MODEL,
        max_tokens: 1400,
        // Effort is nested in output_config — it is not a top-level field.
        output_config: { effort: BOO_EFFORT },
        thinking: { type: BOO_THINKING },
        system: systemPrompt(inputMode),
        messages,
        tools: [RESPOND_TOOL],
        tool_choice: { type: "tool", name: "respond" },
      }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    return NextResponse.json(
      { error: "upstream", say: "I lost my connection there. Try me again?" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    // Never surface the upstream body — it can echo request details.
    console.error(`[lorem] upstream ${res.status}`);
    return NextResponse.json(
      { error: "upstream", say: "Something went wrong on my end. Try me again?" },
      { status: 502 },
    );
  }

  const data = (await res.json()) as {
    content?: { type: string; name?: string; input?: unknown }[];
  };
  const call = data.content?.find((c) => c.type === "tool_use" && c.name === "respond");
  const input = (call?.input ?? {}) as Record<string, unknown>;

  // No usable tool call is an ERROR, not an answer. Returning it as 200 would
  // let the client record "I didn't quite catch that" into history and the
  // transcript — the next turn's context would contain Lorem apologising for its
  // own parse failure.
  if (typeof input.say !== "string" || !input.say.trim()) {
    console.error("[lorem] model returned no usable respond call");
    return NextResponse.json(
      { error: "no_tool", say: "I didn't quite catch that — try me again?" },
      { status: 502 },
    );
  }

  const rejected: Rejection[] = [];
  const turn: LoremTurn = {
    say: scrubProse(input.say.trim(), rejected),
    show: sanitizeBlocks(input.show, rejected),
    chips: (Array.isArray(input.chips) ? input.chips : [])
      .filter((c): c is string => typeof c === "string" && !!c.trim())
      .slice(0, 3),
    // Passed straight back to the client, which decides whether to store it.
    // The server keeps nothing: no visitor record exists on this side.
    rememberName:
      typeof input.rememberName === "string" && input.rememberName.trim()
        ? input.rememberName.trim().slice(0, 24)
        : undefined,
    forgetName: input.forgetName === true ? true : undefined,
  };

  if (rejected.length) {
    // Visible in `vercel logs`. A recurring rejection means the prompt needs
    // work — not that the guardrail does.
    console.warn("[lorem] guardrail rejections", rejected);
  }

  // The scrub drops whole sentences that carried an unbacked numeral, so it can
  // empty `say` outright: every sentence was fabricated figures. That is a real
  // failure, not an answer, and it takes the same path as a missing tool call —
  // speaking an empty string would leave the orb silent with no explanation,
  // and letting it into history would record a blank Lorem turn.
  if (!turn.say.trim()) {
    console.error("[lorem] say was emptied by the guardrail", rejected);
    return NextResponse.json(
      { error: "scrubbed", say: "I got that one wrong. Ask me again?" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ...turn, ...resolve(turn.show) });
}
