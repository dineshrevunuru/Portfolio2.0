import { NextResponse } from "next/server";
import { resolve, sanitizeBlocks, scrubProse, type Rejection } from "../../components/lorem/guardrail";
import { gateChips, isEcho, isFarewell, visitorSteeredToWork } from "../../components/lorem/closing";
import {
  RESPOND_TOOL,
  RESPOND_TOOL_FLAT,
  unflattenBlocks,
  withSayCap,
  type LoremTurn,
} from "../../components/lorem/protocol";
import {
  ANTHROPIC_URL,
  LOREM_EFFORT,
  LOREM_MODEL,
  LOREM_THINKING,
  BRAIN,
  BRAIN_KEY,
  OPENROUTER_URL,
} from "../config";
import { systemPrompt } from "./prompt";
import { logTurn } from "./logTurn";

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

/**
 * Off outside production, because the gym is a single machine driving hundreds
 * of turns through one IP and the limiter cannot tell it from a bored visitor.
 * A 20-conversation run is ~235 turns; at 12/min that is twenty minutes spent
 * being throttled by a protection that exists for a public endpoint.
 *
 * Gated on NODE_ENV rather than a flag of its own, deliberately: `next dev`
 * sets "development" and both `next build` and Vercel set "production", so
 * there is no switch anyone can leave in the wrong position. The live endpoint
 * is unaffected by construction, not by remembering.
 */
const RATE_LIMIT_ON = process.env.NODE_ENV === "production";

function rateLimited(ip: string): boolean {
  if (!RATE_LIMIT_ON) return false;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear(); // crude bound; this is not a datastore
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const started = Date.now();
  const key = BRAIN_KEY;
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

  const { message, history, mode, sessionId } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
    mode?: unknown;
    sessionId?: unknown;
  };
  // A conversation key, minted client-side per page load so it links turns to
  // each other and never to a person. Validated to a UUID shape because it is
  // written to a datastore: a client can send anything, and "anything" must
  // not include a 2MB string or someone's email address in a query param.
  const session =
    typeof sessionId === "string" && /^[a-z0-9-]{8,40}$/i.test(sessionId) ? sessionId : "untagged";
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

  // ── Terminal close ──────────────────────────────────────────────────────
  // The recruiter transcript ends with "Bye." five times, which is the last
  // thing the highest-value visitor sees. The cause is structural rather than
  // stylistic: every visitor turn produces a model call, and a model handed
  // "bye" for the fourth time has nothing left but to say bye again. No prompt
  // wording fixes a loop the architecture guarantees.
  //
  // So the SECOND farewell is answered by not answering. The first still gets a
  // real reply from the model, because ignoring someone's first goodbye is its
  // own kind of rude. Detection runs before the upstream call, so a goodbye
  // loop costs neither a model call nor a TTS render.
  const lastAssistant = [...priorTurns].reverse().find((t) => t.role === "assistant");
  if (isFarewell(message) && lastAssistant && isFarewell(lastAssistant.content)) {
    return NextResponse.json({ closed: true, say: "", show: [], chips: [] });
  }

  const messages = [
    ...priorTurns,
    { role: "user" as const, content: message.slice(0, MAX_MESSAGE_CHARS) },
  ];

  // Computed BEFORE the call now, not just after it. The chip gate has always
  // used this signal; the length cap needs it too, and both must read the same
  // one or a visitor could get small-talk-length answers with work chips.
  const steered = visitorSteeredToWork([
    ...priorTurns.filter((t) => t.role === "user").map((t) => t.content),
    message,
  ]);
  const tool = withSayCap(BRAIN === "openrouter" ? RESPOND_TOOL_FLAT : RESPOND_TOOL, steered);

  // The two providers disagree about the system prompt's home, the tool's
  // shape, how a tool is forced, and — the one that bites — whether the
  // returned arguments arrive parsed or as a JSON string. Kept side by side
  // rather than abstracted into sameness, because the differences are the
  // whole point and a leaky shim would hide the next one.
  const anthropicBody = {
    model: LOREM_MODEL,
    max_tokens: 1400,
    // Effort is nested in output_config — it is not a top-level field.
    output_config: { effort: LOREM_EFFORT },
    thinking: { type: LOREM_THINKING },
    system: systemPrompt(inputMode),
    messages,
    tools: [tool],
    tool_choice: { type: "tool", name: "respond" },
  };

  const openrouterBody = {
    model: LOREM_MODEL,
    max_tokens: 1400,
    // OpenAI-compatible: the system prompt is the first message, and effort is
    // a top-level string rather than a nested object.
    reasoning_effort: LOREM_EFFORT,
    messages: [{ role: "system" as const, content: systemPrompt(inputMode) }, ...messages],
    // The FLAT schema, not the strict one. Google accepts `oneOf` and then
    // ignores it, leaving the model to answer `show: [{}]` — see the comment
    // above RESPOND_TOOL_FLAT. This is the fifth wire-level difference between
    // the two providers, and the only one that fails silently.
    tools: [
      {
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.input_schema,
        },
      },
    ],
    tool_choice: { type: "function", function: { name: RESPOND_TOOL.name } },
  };

  let res: Response;
  try {
    res = await fetch(BRAIN === "openrouter" ? OPENROUTER_URL : ANTHROPIC_URL, {
      method: "POST",
      headers:
        BRAIN === "openrouter"
          ? {
              "content-type": "application/json",
              authorization: `Bearer ${key}`,
              // OpenRouter attributes traffic by these; harmless and it keeps
              // the dashboard legible when something misbehaves.
              "HTTP-Referer": "https://dineshrevunuru.com",
              "X-Title": "Lorem",
            }
          : {
              "content-type": "application/json",
              "x-api-key": key,
              "anthropic-version": "2023-06-01",
            },
      body: JSON.stringify(BRAIN === "openrouter" ? openrouterBody : anthropicBody),
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
    choices?: { message?: { tool_calls?: { function?: { name?: string; arguments?: string } }[] } }[];
  };

  // Anthropic hands back a parsed object. OpenAI-compatible hands back a JSON
  // STRING, and a model under length pressure can truncate it mid-object, so
  // the parse is guarded: a malformed argument blob is a failed turn, not a
  // crash, and it takes the same path as a missing tool call.
  let input: Record<string, unknown> = {};
  if (BRAIN === "openrouter") {
    const raw = data.choices?.[0]?.message?.tool_calls?.find(
      (t) => t.function?.name === RESPOND_TOOL.name,
    )?.function?.arguments;
    if (typeof raw === "string" && raw.trim()) {
      try {
        input = JSON.parse(raw) as Record<string, unknown>;
        // Convert the flat schema's {label} step elements back to the bare
        // strings every renderer expects, before the guardrail sees them.
        if (input.show !== undefined) input.show = unflattenBlocks(input.show);
      } catch {
        console.error("[lorem] openrouter returned unparseable tool arguments");
      }
    }
  } else {
    const call = data.content?.find((c) => c.type === "tool_use" && c.name === RESPOND_TOOL.name);
    input = (call?.input ?? {}) as Record<string, unknown>;
  }

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
    // The direction gate runs in code because it lost as a prompt rule three
    // evaluated runs straight — see gateChips. Steering is judged from the
    // visitor's own words only, current message included.
    chips: gateChips(
      (Array.isArray(input.chips) ? input.chips : [])
        .filter((c): c is string => typeof c === "string" && !!c.trim())
        .slice(0, 3),
      steered,
    ),
    // Passed straight back to the client, which decides whether to store it.
    // No PERSON record exists on this side. Turns are logged for the
    // training loop (see logTurn.ts) keyed by an anonymous per-pageload id —
    // the name memory itself still lives only in the visitor's browser.
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

  // ── Self-repeat ─────────────────────────────────────────────────────────
  // A model that produces its own previous line verbatim has nothing left to
  // add — seen live as "Take care." four times against a visitor who had gone
  // quiet, a loop the farewell gate cannot catch because the visitor's turns
  // were never farewells. Saying the same thing twice in a row is what closing
  // exists for, so it closes.
  if (lastAssistant && isEcho(turn.say, lastAssistant.content)) {
    console.warn("[lorem] model repeated its own previous turn");
    return NextResponse.json({ closed: true, say: "", show: [], chips: [] });
  }

  // ── Echo ────────────────────────────────────────────────────────────────
  // skeptic.md:60 has the visitor say "That's the tab I'll actually use." and
  // Lorem reply with that sentence, verbatim. It is the same failure as the
  // goodbye loop wearing different clothes: a model with nothing left to add,
  // handed a statement rather than a question, returns the input.
  //
  // Reading someone's own words back to them is strictly worse than silence, so
  // it never ships. Which path depends on what they were doing: someone signing
  // off gets the close, and someone who asked a real question gets an honest
  // failure they can retry, because leaving them at a dead end would be worse.
  if (isEcho(turn.say, message)) {
    console.warn("[lorem] model echoed the visitor verbatim");
    return isFarewell(message)
      ? NextResponse.json({ closed: true, say: "", show: [], chips: [] })
      : NextResponse.json(
          { error: "echo", say: "That came back wrong. Ask me again?" },
          { status: 502 },
        );
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

  // The one place a real visitor's turn becomes trainable data. After the
  // response is fully assembled, fire-and-forget — see logTurn.ts for the
  // design (and for the reversal of the old "server keeps nothing" promise).
  logTurn({
    sessionId: session,
    mode: inputMode,
    message: message.slice(0, MAX_MESSAGE_CHARS),
    say: turn.say,
    show: turn.show,
    chips: turn.chips,
    model: LOREM_MODEL,
    ms: Date.now() - started,
  });

  return NextResponse.json({ ...turn, ...resolve(turn.show) });
}
