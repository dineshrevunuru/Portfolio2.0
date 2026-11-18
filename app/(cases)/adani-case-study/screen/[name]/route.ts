import { isOpen, readScreen, SCREENS } from "../../lock";

// One real screen, only for a browser that has unlocked the page. Never cached by anyone in between.
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await isOpen())) return new Response("Locked", { status: 401, headers: { "Cache-Control": "no-store" } });
  const name = (await params).name.replace(/\.webp$/, "");
  if (!SCREENS.includes(name)) return new Response("Not found", { status: 404 });
  const shot = await readScreen(name);
  if (!shot) return new Response("Not found", { status: 404 });
  return new Response(shot.body, { headers: { "Content-Type": shot.type, "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, noimageindex" } });
}
