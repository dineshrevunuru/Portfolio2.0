/**
 * Sign out of /conversations — clears the viewer cookie and returns to the
 * locked screen. A POST (not a link) so a stray prefetch or crawler can't log
 * anyone out by following a URL.
 */
import { NextResponse } from "next/server";
import { COOKIE } from "../../../conversations/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const res = NextResponse.redirect(`${origin}/conversations`, 303);
  res.cookies.set(COOKIE, "", { path: "/conversations", maxAge: 0 });
  return res;
}
