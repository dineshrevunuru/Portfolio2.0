import { createHash, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { get } from "@vercel/blob";
import path from "node:path";
import { cookies } from "next/headers";

/* The lock on the Adani screens. His words (2026-11-17): "Adani is NDA project and can not reveal the
   full UI images in public. Can I use them with password protected."

   What it protects: the real screens are NOT in /public and NOT in this repository (it is public on
   GitHub). They sit in a folder outside it, and ./screen/[name]/route.ts hands one over only to a
   browser that holds the cookie ./unlock/route.ts sets after the right password.

   It fails closed: no password set in production means nobody gets in; a missing folder means no
   picture. The password is the ADANI_CASE_PASSWORD environment variable, set by Dinesh, never written
   here. Local preview only (never production) falls back to a preview word so the lock can be
   tried. Before release this still needs: the screens in private storage the server can read, and a
   limit on wrong tries. */
const DEV_ONLY = process.env.NODE_ENV === "production" ? "" : "preview-adani";
const PASS = process.env.ADANI_CASE_PASSWORD || DEV_ONLY;
export const COOKIE = "adani_case";
export const VAULT = process.env.ADANI_CASE_DIR || path.resolve(process.cwd(), "..", "private", "adani");
export const HOME = "/adani-case-study";

const mark = (s: string) => createHash("sha256").update(`adani-case:${s}`).digest();
const same = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

export const rightPassword = (tried: string) => PASS !== "" && same(mark(tried), mark(PASS));
export const pass = () => mark(PASS).toString("hex");
export async function isOpen() {
  if (PASS === "") return false;
  const held = (await cookies()).get(COOKIE)?.value ?? "";
  return /^[0-9a-f]{64}$/.test(held) && same(Buffer.from(held, "hex"), mark(PASS));
}

// The only pictures the route will hand over.
export const SCREENS = ["summary-light", "summary-dark", "map", "plant", "drill", "plant-summary", "silo", "manual", "diy",
  ...["sales", "logistics", "hr", "finance", "procurement", "benchmark", "safety", "inventory", "micro-market", "fpc", "alerts", "quality"].map((n) => `wall-${n}`)];

// Where the real screens are read from. On his machine: the private folder beside this checkout (VAULT). On the live
// host: a private Vercel Blob store connected to the project (connecting it sets BLOB_STORE_ID or
// BLOB_READ_WRITE_TOKEN), never this repository. A store's files can sit under adani/ or at its root.
const REMOTE = Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

export async function readScreen(name: string): Promise<{ body: BodyInit; type: string } | null> {
  try {
    return { body: new Uint8Array(await readFile(path.join(VAULT, `${name}.webp`))), type: "image/webp" };
  } catch {}
  if (!REMOTE) return null;
  for (const key of [`adani/${name}.webp`, `${name}.webp`]) {
    try {
      const found = await get(key, { access: "private" });
      if (found?.statusCode === 200) return { body: found.stream, type: found.blob.contentType || "image/webp" };
    } catch {}
  }
  return null;
}

// Whether the real screens can be read here. Where they cannot (no folder, no store, or a store without the files),
// an unlocked page shows the redrawn case and keeps each full screen veiled, where it would otherwise show a broken
// picture. Asked only for an unlocked visitor; a found answer is kept for ten minutes so a store is read once, not on
// every page view.
let found = { ok: false, at: 0 };
export async function hasVault() {
  if (found.ok && Date.now() - found.at < 600_000) return true;
  const shot = await readScreen("summary-light");
  if (shot && shot.body instanceof ReadableStream) await shot.body.cancel();
  found = { ok: Boolean(shot), at: Date.now() };
  return found.ok;
}
