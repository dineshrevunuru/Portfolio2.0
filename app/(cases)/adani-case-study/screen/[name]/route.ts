import { readFile } from "node:fs/promises";
import path from "node:path";
import { isOpen, SCREENS, VAULT } from "../../lock";

// One real screen, only for a browser that has unlocked the page. Never cached by anyone in between.
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await isOpen())) return new Response("Locked", { status: 401, headers: { "Cache-Control": "no-store" } });
  const name = (await params).name.replace(/\.webp$/, "");
  if (!SCREENS.includes(name)) return new Response("Not found", { status: 404 });
  try {
    const file = await readFile(path.join(VAULT, `${name}.webp`));
    return new Response(new Uint8Array(file), { headers: { "Content-Type": "image/webp", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, noimageindex" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
