/* ---------------------------------------------------------------------------
 * Demo chat for the embedded Tara prototype.
 *
 * Mirrors the shipped route's contract exactly — same `[[suggestions: …]]`
 * convention, same `{ reply, suggestions, action }` response, same
 * `start_booking` hand-off — so the ported widget needs no changes. What it
 * does NOT share is any connection to the client: no Supabase, no real
 * catalogue, no contact details. Tools read the demo catalogue only.
 *
 * The architecture on show is the case study's own claim: the model handles
 * conversation, a deterministic form handles commitment. The model here can
 * OPEN the booking form; it cannot make a booking.
 *
 * Calls Anthropic over HTTP with the same config module Lorem uses, rather than
 * adding the SDK as a dependency for one route.
 * ------------------------------------------------------------------------- */

import { NextResponse } from "next/server";
import { ANTHROPIC_KEY, ANTHROPIC_URL } from "../config";
import { SERVICES, slotsFor, serviceById } from "@/lib/hss-demo/catalogue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Haiku: the shipped assistant runs on it for the same reasons — the task is
 *  bounded, public and latency-sensitive, and a visitor is waiting. */
const MODEL = process.env.HSS_DEMO_MODEL ?? "claude-haiku-4-5-20251001";
const MAX_TOKENS = 700;
const MAX_TURNS = 4;
const MAX_HISTORY = 12;

/* ── Rate limiting ─────────────────────────────────────────────────────────
 * A public demo is an open endpoint on someone else's bill. Same shape as
 * /api/lorem: per-IP sliding window, with a cheap sweep so the map cannot grow
 * without bound. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

const SYSTEM = `You are Tara, the booking assistant for a non-surgical hair-replacement studio.
You speak like a customer-service expert who has helped hair-system clients for years:
warm, discreet, genuinely useful. Never pushy.

Many customers feel sensitive about hair loss. Be kind, never make anyone feel
awkward, and mention that the service is private and confidential when it helps.

STYLE
- Concise. Usually one to three short sentences. Never a wall of text.
- Plain everyday language. Join sentences with commas or periods, not dashes.
- Ask for one thing at a time.
- Never diagnose anything medical. Offer a free consultation, or suggest a medical
  professional, instead.

BOOKING
- The moment someone wants to book or is ready to pick a time, call start_booking.
- Do NOT ask for their email, a verification code, or a time yourself. The booking
  form collects all of that. You open it; it does the rest.
- Never invent a time. Use get_availability, or just open the form.

SCOPE
- Only discuss this studio, its services, and booking. Decline anything else briefly
  and steer back.
- This is a portfolio demonstration. If asked whether the booking is real, say
  plainly that it is a sandbox and no appointment is actually made.

End most replies with a suggestions line the interface turns into tappable chips:
[[suggestions: Book an appointment | What does a consultation involve?]]
Two or three, short, in the customer's voice.`;

type Tool = { name: string; description: string; input_schema: Record<string, unknown> };

const TOOLS: Tool[] = [
  {
    name: "list_services",
    description: "List the services a customer can book, with duration and price.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_availability",
    description:
      "Real open appointment times for a service on a date. Always use this before naming any time. Never invent times.",
    input_schema: {
      type: "object",
      properties: {
        service_id: { type: "string", description: "Service id from list_services." },
        date: { type: "string", description: "Date as YYYY-MM-DD." },
      },
      required: ["service_id", "date"],
    },
  },
  {
    name: "start_booking",
    description:
      "Open the tap-through booking form. Call this as soon as the customer wants to book or pick a time. Pass service_id if known; otherwise leave it out and they will choose.",
    input_schema: { type: "object", properties: { service_id: { type: "string" } } },
  },
];

function runTool(name: string, input: Record<string, unknown>): string {
  if (name === "list_services") {
    return JSON.stringify(
      SERVICES.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        minutes: s.duration_minutes,
        price: s.price_cents === 0 ? "free" : `$${(s.price_cents / 100).toFixed(0)}`,
      })),
    );
  }
  if (name === "get_availability") {
    const svc = serviceById(String(input.service_id ?? ""));
    if (!svc) return JSON.stringify({ error: "Unknown service." });
    const slots = slotsFor(String(input.date ?? ""), svc.duration_minutes).slice(0, 10);
    return JSON.stringify({
      date: input.date,
      service: svc.name,
      times: slots.map((s) =>
        new Date(s.slot_start).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ),
    });
  }
  return JSON.stringify({ ok: true });
}

function extractSuggestions(text: string): { reply: string; suggestions: string[] } {
  const m = text.match(/\[\[\s*suggestions:\s*([^\]]+)\]\]/i);
  if (!m) return { reply: text.trim(), suggestions: [] };
  return {
    reply: text.replace(m[0], "").trim(),
    suggestions: m[1].split("|").map((s) => s.trim()).filter(Boolean).slice(0, 3),
  };
}

/** Never leave the widget without a usable reply — a demo that has simply gone
 *  silent is the worst outcome on a portfolio. */
const OFFLINE = {
  reply:
    "My model is not connected in this demo, but the booking flow still works. Tap Book an appointment and I will take you through it.",
  suggestions: ["Book an appointment"],
  action: null,
};

type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input?: Record<string, unknown> }
  | Record<string, unknown>;

export async function POST(req: Request) {
  if (!ANTHROPIC_KEY) return NextResponse.json(OFFLINE);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json({
      reply: "Give me a moment to catch up, then ask me again.",
      suggestions: [],
      action: null,
    });
  }

  let messages: unknown[];
  try {
    const body = (await req.json()) as { messages?: unknown[] };
    messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_HISTORY) : [];
  } catch {
    return NextResponse.json(OFFLINE);
  }

  let action: { type: "start_booking"; serviceId?: string } | null = null;

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const res = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: `${SYSTEM}\n\nToday is ${new Date().toDateString()}.`,
          tools: TOOLS,
          messages,
        }),
        signal: AbortSignal.timeout(20_000),
      });

      if (!res.ok) {
        // Never surface the upstream body — it can echo request details.
        console.error("[hss-demo-chat] upstream", res.status);
        return NextResponse.json(OFFLINE);
      }

      const data = (await res.json()) as { content?: Block[] };
      const content = data.content ?? [];
      const toolUses = content.filter(
        (c): c is { type: "tool_use"; id: string; name: string; input?: Record<string, unknown> } =>
          (c as { type?: string }).type === "tool_use",
      );

      if (!toolUses.length) {
        const raw = content
          .filter((c): c is { type: "text"; text: string } => (c as { type?: string }).type === "text")
          .map((c) => c.text)
          .join("")
          .trim();
        const { reply, suggestions } = extractSuggestions(raw);
        return NextResponse.json({ reply, suggestions, action, messages });
      }

      messages.push({ role: "assistant", content });
      const results = toolUses.map((tu) => {
        if (tu.name === "start_booking") {
          action = { type: "start_booking", serviceId: tu.input?.service_id as string | undefined };
        }
        return {
          type: "tool_result",
          tool_use_id: tu.id,
          content: runTool(tu.name, tu.input ?? {}),
        };
      });
      messages.push({ role: "user", content: results });
    }

    // Loop ceiling reached — hand off rather than keep spending turns.
    return NextResponse.json({
      reply: "Let me open the booking form for you.",
      suggestions: [],
      action: action ?? { type: "start_booking" },
    });
  } catch (err) {
    console.error("[hss-demo-chat]", err);
    return NextResponse.json(OFFLINE);
  }
}
