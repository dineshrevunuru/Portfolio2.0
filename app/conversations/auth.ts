/**
 * The gate on /conversations.
 *
 * Real visitors tell Lorem real things — names it remembers, that they were
 * laid off, where they live. This page shows those words, so it must never be
 * open. One shared password, set in LOREM_VIEWER_PASSWORD, is the whole policy;
 * that is proportionate for a personal viewer and it is honest about being
 * exactly one secret, not a user system pretending to be more.
 *
 * The cookie never contains the password. It holds an HMAC of a fixed message
 * keyed BY the password, so:
 *   · it cannot be forged without knowing the password (HMAC is one-way),
 *   · it reveals nothing about the password if the cookie leaks,
 *   · changing the password silently invalidates every old cookie, because the
 *     digest stops matching — no session store, no revocation list needed.
 *
 * If LOREM_VIEWER_PASSWORD is unset the gate FAILS CLOSED: no password means no
 * valid token can exist, so the page shows the locked screen and never the
 * data. A viewer that defaults to open would be the exact leak this guards.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "lorem_viewer";
const MESSAGE = "lorem-viewer-v1"; // fixed; the password is the HMAC key

/** The token a correct password produces. Empty string when no password is
 *  configured — which no cookie value can equal, so the gate stays shut. */
export function expectedToken(): string {
  const pw = process.env.LOREM_VIEWER_PASSWORD ?? "";
  if (!pw) return "";
  return createHmac("sha256", pw).update(MESSAGE).digest("hex");
}

/** Constant-time compare, so a wrong cookie can't be narrowed by timing. */
export function tokenValid(token: string | undefined): boolean {
  const expected = expectedToken();
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Is THIS request carrying a valid viewer cookie? */
export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return tokenValid(jar.get(COOKIE)?.value);
}

/** Does the submitted password match the configured one? */
export function passwordMatches(submitted: string): boolean {
  const pw = process.env.LOREM_VIEWER_PASSWORD ?? "";
  if (!pw || !submitted) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}
