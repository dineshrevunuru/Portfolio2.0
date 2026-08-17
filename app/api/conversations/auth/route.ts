/**
 * The login POST for /conversations. Validates the password against
 * LOREM_VIEWER_PASSWORD and, on a match, sets the unforgeable viewer cookie
 * (see ../../../conversations/auth.ts). Wrong password → back to the locked
 * screen with ?e=1, deliberately vague: it never says whether a password is
 * even configured.
 */
import { NextResponse } from "next/server";
import { COOKIE, expectedToken, passwordMatches } from "../../../conversations/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A brute-force speed bump. In-memory and per-instance, like the other rate
// limits here — friction, not a wall. The real ceiling is that the password
// is a full HMAC key, not a 4-digit PIN.
const WINDOW_MS = 60_000;
const MAX_TRIES = 8;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_TRIES;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";

  const origin = new URL(req.url).origin;
  const back = (params = "") => NextResponse.redirect(`${origin}/conversations${params}`, 303);

  if (tooMany(ip)) return back("?e=slow");

  let password = "";
  try {
    const form = await req.formData();
    password = String(form.get("password") ?? "");
  } catch {
    return back("?e=1");
  }

  if (!passwordMatches(password)) return back("?e=1");

  const res = back();
  res.cookies.set(COOKIE, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/conversations",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

/** Sign out — clears the cookie. */
export async function DELETE(req: Request) {
  const origin = new URL(req.url).origin;
  const res = NextResponse.redirect(`${origin}/conversations`, 303);
  res.cookies.set(COOKIE, "", { path: "/conversations", maxAge: 0 });
  return res;
}
