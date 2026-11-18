import { cookies } from "next/headers";
import { COOKIE, HOME, pass, rightPassword } from "../lock";

// The password form posts here. Right: a cookie the page's scripts cannot read, for a week. Wrong: back
// to the form with a note. "again" locks it again.
export async function POST(request: Request) {
  const form = await request.formData(), jar = await cookies();
  const back = (q: string) => new Response(null, { status: 303, headers: { Location: `${HOME}${q}#screens` } });
  if (form.get("again")) { jar.delete({ name: COOKIE, path: HOME }); return back(""); }
  if (!rightPassword(String(form.get("password") ?? ""))) return back("?wrong=1");
  jar.set(COOKIE, pass(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: HOME, maxAge: 60 * 60 * 24 * 7 });
  return back("");
}
