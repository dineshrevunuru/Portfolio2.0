import { createHash, timingSafeEqual } from "node:crypto";
import { access } from "node:fs/promises";
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

// Whether the real screens can be read here. On the live host they cannot yet (they are in no repository and
// no storage the server reaches), so an unlocked page there shows the redrawn case and keeps each full screen
// veiled, where it would otherwise show a broken picture.
export const hasVault = () => access(path.join(VAULT, "summary-light.webp")).then(() => true, () => false);
