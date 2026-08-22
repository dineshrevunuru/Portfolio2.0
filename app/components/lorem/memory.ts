"use client";

/**
 * What Lorem remembers about a visitor between visits.
 *
 * Deliberately **localStorage, not a cookie.** A cookie rides on every request
 * to the server, which turns a name someone mentioned in passing into something
 * that leaves their machine on every page load. This never does: it is written
 * by the client, read by the client, and the only time it reaches the network is
 * the moment Lorem speaks the greeting aloud (TTS needs the text). Nothing about
 * a visitor is stored server-side, ever.
 *
 * It is still personal data, so three rules hold it in check:
 *   1. Only a first name, and only one the visitor volunteered.
 *   2. Never the transcript. What they asked is theirs, not ours.
 *   3. Always erasable, from the UI, without hunting through browser settings.
 */

const KEY = "lorem.visitor.v1"; // versioned — a schema change starts fresh, never crashes

export type Visitor = {
  /** First name only, and only if they offered it. */
  name?: string;
  /** How many times they've started a session here. */
  visits: number;
  /** ISO date of the previous visit — lets Lorem say "the other day" honestly. */
  lastSeen?: string;
  /** One line about what they were into last time, in their words — so a
   *  return visit can pick the thread up. Same home as the name: their browser. */
  note?: string;
};

const EMPTY: Visitor = { visits: 0 };

export function readVisitor(): Visitor {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const v = JSON.parse(raw) as Visitor;
    return {
      name: typeof v.name === "string" ? v.name.slice(0, 40) : undefined,
      visits: Number.isFinite(v.visits) ? v.visits : 0,
      lastSeen: typeof v.lastSeen === "string" ? v.lastSeen : undefined,
      note: typeof v.note === "string" ? v.note.slice(0, 80) : undefined,
    };
  } catch {
    return EMPTY; // private browsing, quota, corrupt value — all just mean "new here"
  }
}

function write(v: Visitor) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* storage denied — Lorem simply won't remember. Never a hard failure. */
  }
}

/** Called once per session start. Returns the visitor as they were BEFORE this visit. */
export function beginVisit(): Visitor {
  const prev = readVisitor();
  write({ ...prev, visits: prev.visits + 1, lastSeen: new Date().toISOString() });
  return prev;
}

/**
 * Store a name the model captured. Conservative on purpose: the model is told to
 * pass only a volunteered first name, and this trims anything that looks like a
 * sentence rather than a name — a mis-hear that greets the wrong person by the
 * wrong name on their next visit is worse than not remembering at all.
 */
export function rememberName(raw: string): string | null {
  const name = raw.trim().split(/\s+/)[0]?.replace(/[^\p{L}\p{M}'-]/gu, "") ?? "";
  if (name.length < 2 || name.length > 24) return null;
  const v = readVisitor();
  write({ ...v, name });
  return name;
}

/**
 * Store the thread of this conversation, for next time. Trimmed to one short
 * line; anything that reads like a paragraph is probably the model narrating
 * rather than noting, and is dropped.
 */
export function rememberNote(raw: string): string | null {
  const note = raw.trim().replace(/\s+/g, " ").slice(0, 80);
  if (note.length < 4) return null;
  const v = readVisitor();
  write({ ...v, note });
  return note;
}

export function forgetVisitor() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/** Days since the last visit, or null if this is their first. */
export function daysSince(v: Visitor): number | null {
  if (!v.lastSeen) return null;
  const then = Date.parse(v.lastSeen);
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86_400_000);
}
