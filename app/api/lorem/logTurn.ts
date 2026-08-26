/**
 * Conversation logging — every real turn, into Supabase, for the gym.
 *
 * WHY THIS EXISTS. The gym's visitors are nine written personas plus eleven
 * general-conversation ones; every score so far measures Lorem against people
 * I invented. Dinesh asked for the real thing: "where can we have access to
 * conversations made by real users to train the model over time?" This is
 * where. scripts/pull-conversations.mjs converts what lands here into gym
 * transcripts, so real visitors flow into the same bench, the same judge, the
 * same distill loop as the simulated ones.
 *
 * THIS DELIBERATELY REVERSES an original design decision. route.ts promised
 * "the server keeps nothing: no visitor record exists on this side." That was
 * true and intentional; Dinesh reversed it on 2026-08-15 for the training
 * loop, with disclosure explicitly deferred ("let's skip disclosure for
 * now"). What keeps it defensible meanwhile:
 *
 *   - No IP is ever stored. The session id is a random UUID the client mints
 *     per page load — it links turns into a conversation, never a person to a
 *     conversation. It arrives in the body, not from headers.
 *   - Rows carry exactly what the visitor and Lorem said, nothing derived.
 *   - The table has RLS on with no policies, so only the service key —
 *     server-side only, never NEXT_PUBLIC — can touch it.
 *
 * FAIL-OPEN, ALWAYS. A logging failure must never cost a visitor an answer:
 * fire-and-forget, no await in the request path, all errors swallowed after
 * one console line. With the env unset this module is a no-op, so the feature
 * ships dark and lights up when the two vars land.
 */

const URL_ = process.env.SUPABASE_URL ?? "";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** One line, once, so a misconfigured deploy says so without spamming. */
let warned = false;

export type LoggedTurn = {
  sessionId: string;
  mode: "voice" | "text";
  message: string;
  say: string;
  show: unknown[];
  chips: string[];
  model: string;
  /** Whole-turn latency in ms, brain call included — free to capture here,
   *  impossible to reconstruct later. */
  ms: number;
  /** Set only on failure turns — 'upstream' | 'no_tool' | 'echo' | 'scrubbed'
   *  | 'self_repeat'. A failed turn is the most valuable training data there
   *  is; before this field, every guardrail return was invisible. */
  error?: string;
};

/**
 * The local sink — same rows, a JSONL file instead of a table.
 *
 * Two jobs. It makes the pipe PROVABLE before any account exists: real turns
 * off this machine flow through the same shape, the same pull script and into
 * the same bench, so wiring Supabase later is a switch rather than a leap.
 * And it stays useful afterwards, because a dev turn belongs in a scratch file
 * rather than in the same table the real visitors land in.
 *
 * DEV ONLY, gated on NODE_ENV exactly like the rate limiter: Vercel's
 * filesystem is read-only outside /tmp, and more to the point production has a
 * database. Writes go to .lorem-logs/, which is gitignored and — deliberately
 * — outside public/, since only public/ is served and this repo has published
 * files it did not mean to before.
 */
const LOCAL_DIR = ".lorem-logs";

async function logLocal(turn: LoggedTurn): Promise<void> {
  try {
    const { appendFile, mkdir } = await import("node:fs/promises");
    await mkdir(LOCAL_DIR, { recursive: true });
    const day = new Date().toISOString().slice(0, 10);
    await appendFile(
      `${LOCAL_DIR}/turns-${day}.jsonl`,
      JSON.stringify({
        session_id: turn.sessionId,
        mode: turn.mode,
        message: turn.message.slice(0, 500),
        say: turn.say.slice(0, 1000),
        show: turn.show,
        chips: turn.chips,
        model: turn.model,
        ms: Math.round(turn.ms),
        ...(turn.error ? { error: turn.error } : {}),
        created_at: new Date().toISOString(),
      }) + "\n",
      "utf8",
    );
  } catch {
    /* a dev convenience is never worth an error a visitor could feel */
  }
}

/**
 * Returns the insert's promise so the route can pass it to next/server's
 * after(): on Vercel the function is frozen the moment the response returns,
 * and a fire-and-forget fetch dies with it. That is not theoretical — a real
 * voice conversation observed in Clarity (2026-08-24) never reached the
 * table. after() keeps the instance alive until the insert settles. Errors
 * still never propagate: the chain swallows everything after one console line.
 */
export function logTurn(turn: LoggedTurn): Promise<void> {
  if (!URL_ || !KEY) {
    // No database configured. Off Vercel that means "log locally so the loop
    // still closes"; on Vercel it means the env is genuinely missing, and the
    // one-time line is the thing that says so.
    if (process.env.NODE_ENV !== "production") {
      if (!warned) {
        warned = true;
        console.log(`[lorem] logging to ${LOCAL_DIR}/ — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for the real table`);
      }
      return logLocal(turn);
    }
    if (!warned) {
      warned = true;
      console.log("[lorem] conversation logging off — SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY unset");
    }
    return Promise.resolve();
  }
  // PostgREST straight over fetch: one insert, no SDK, no new dependency.
  return fetch(`${URL_}/rest/v1/lorem_turns`, {
    method: "POST",
    headers: {
      apikey: KEY,
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      session_id: turn.sessionId,
      mode: turn.mode,
      message: turn.message.slice(0, 500),
      say: turn.say.slice(0, 1000),
      show: turn.show,
      chips: turn.chips,
      model: turn.model,
      ms: Math.round(turn.ms),
      ...(turn.error ? { error: turn.error } : {}),
    }),
    signal: AbortSignal.timeout(4_000),
  })
    .then((r) => {
      if (!r.ok) console.error(`[lorem] turn log rejected: ${r.status}`);
    })
    .catch(() => {
      /* logging is never worth an error a visitor could feel */
    });
}
