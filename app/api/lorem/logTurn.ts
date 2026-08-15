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
};

export function logTurn(turn: LoggedTurn): void {
  if (!URL_ || !KEY) {
    if (!warned) {
      warned = true;
      console.log("[lorem] conversation logging off — SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY unset");
    }
    return;
  }
  // PostgREST straight over fetch: one insert, no SDK, no new dependency.
  void fetch(`${URL_}/rest/v1/lorem_turns`, {
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
