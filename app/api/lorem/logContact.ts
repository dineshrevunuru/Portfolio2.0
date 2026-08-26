/**
 * A visitor's volunteered contact details, for Dinesh to follow up.
 *
 * This is the one place Lorem collects personal data on purpose. It exists
 * because Dinesh made Lorem a networker (2026-08-20): when a conversation
 * earns it, Lorem offers a way through and, if the visitor wants Dinesh to
 * reach them, takes an email or LinkedIn. The prompt's rules govern the asking
 * — only what they volunteer for this purpose, never in passing, never twice.
 *
 * GATED, and off by default. LOREM_CONTACT_CAPTURE=on is required, because
 * collecting contact details needs a visible disclosure on the page and that
 * line ships WITH this flag, not before it. With the flag off, a contact the
 * model captured is dropped here with one console line — the visitor is
 * never told their details were saved when they were not.
 *
 * Same fail-open shape as logTurn: fire-and-forget, errors swallowed, the
 * visitor's answer never waits on it. Same table family, same RLS posture:
 * service key only.
 */
const URL_ = process.env.SUPABASE_URL ?? "";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ON = (process.env.LOREM_CONTACT_CAPTURE ?? "").toLowerCase() === "on";

let warned = false;

export type Contact = {
  sessionId: string;
  name?: string;
  email?: string;
  linkedin?: string;
  note?: string;
};

/** Returns the insert's promise for next/server after() — see logTurn.ts. */
export function logContact(c: Contact): Promise<void> {
  if (!ON) {
    if (!warned) {
      warned = true;
      console.log("[lorem] contact capture is OFF (LOREM_CONTACT_CAPTURE) — a volunteered contact was dropped");
    }
    return Promise.resolve();
  }
  if (!URL_ || !KEY) {
    if (!warned) {
      warned = true;
      console.log("[lorem] contact capture on but SUPABASE_* unset — dropped");
    }
    return Promise.resolve();
  }
  return fetch(`${URL_}/rest/v1/lorem_contacts`, {
    method: "POST",
    headers: {
      apikey: KEY,
      authorization: `Bearer ${KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      session_id: c.sessionId,
      name: c.name ?? null,
      email: c.email ?? null,
      linkedin: c.linkedin ?? null,
      note: c.note ?? null,
    }),
    signal: AbortSignal.timeout(4_000),
  })
    .then((r) => {
      if (!r.ok) console.error(`[lorem] contact log rejected: ${r.status}`);
    })
    .catch(() => {
      /* never worth an error a visitor could feel */
    });
}
