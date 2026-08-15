/**
 * SITE_URL's fallback chain, with the empty string as the headline case.
 *
 * .env.local carries a literal `NEXT_PUBLIC_SITE_URL=` — blank deliberately, so
 * that only production claims the real domain. A blank env line is an empty
 * STRING, not undefined, so the original `??` passed it through untouched:
 * SITE_URL became "", `new URL("")` threw inside layout.tsx's metadataBase, and
 * every route 500ed locally. The API kept answering 200 the whole time, which
 * is why it went unnoticed — the failure was in the page, not the route.
 *
 * The chain is resolved at module load from process.env, so each case runs in
 * its own child process with a purpose-built environment.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const CANONICAL = "https://dineshrevunuru.com";

/** Resolve SITE_URL and IS_CANONICAL_HOST under a given environment. */
function resolve(env) {
  const out = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import { SITE_URL, IS_CANONICAL_HOST } from "./.test-build/site.js";
       process.stdout.write(JSON.stringify({ SITE_URL, IS_CANONICAL_HOST }));`,
    ],
    {
      encoding: "utf8",
      // A clean slate: inherited VERCEL_* from a real shell would silently
      // change what these cases mean.
      env: {
        PATH: process.env.PATH,
        NEXT_PUBLIC_SITE_URL: undefined,
        VERCEL_ENV: undefined,
        VERCEL_URL: undefined,
        ...env,
      },
    },
  );
  return JSON.parse(out);
}

/* 1 ─ THE REGRESSION. Blank var must fall through to the chain, not become "". */
{
  const { SITE_URL, IS_CANONICAL_HOST } = resolve({ NEXT_PUBLIC_SITE_URL: "" });
  assert.equal(
    SITE_URL,
    "http://localhost:3000",
    "a blank NEXT_PUBLIC_SITE_URL did not fall through — every page will 500 on new URL('')",
  );
  assert.doesNotThrow(() => new URL(SITE_URL), "SITE_URL is not a constructable URL");
  assert.equal(IS_CANONICAL_HOST, false, "localhost claimed to be the canonical host");
}

/* 2 ─ unset behaves identically to blank. */
{
  const { SITE_URL } = resolve({});
  assert.equal(SITE_URL, "http://localhost:3000");
}

/* 3 ─ explicit always wins, and the trailing slash is stripped. */
{
  assert.equal(resolve({ NEXT_PUBLIC_SITE_URL: CANONICAL }).SITE_URL, CANONICAL);
  assert.equal(resolve({ NEXT_PUBLIC_SITE_URL: `${CANONICAL}/` }).SITE_URL, CANONICAL);
  assert.equal(resolve({ NEXT_PUBLIC_SITE_URL: CANONICAL }).IS_CANONICAL_HOST, true);
}

/* 4 ─ production resolves to the real domain; a preview must NOT. This is the
      gate that keeps previews out of the index and out of analytics, so a
      preview claiming canonical is the expensive direction. */
{
  const prod = resolve({ VERCEL_ENV: "production", VERCEL_URL: "whatever.vercel.app" });
  assert.equal(prod.SITE_URL, CANONICAL, "production did not resolve to the real domain");
  assert.equal(prod.IS_CANONICAL_HOST, true);

  const preview = resolve({ VERCEL_ENV: "preview", VERCEL_URL: "p-abc123.vercel.app" });
  assert.equal(preview.SITE_URL, "https://p-abc123.vercel.app");
  assert.equal(preview.IS_CANONICAL_HOST, false, "a preview claimed to be the canonical host");
}

/* 5 ─ a hostname merely CONTAINING the domain is not the domain. The predicate
      compares hostnames exactly for this reason. */
for (const impostor of [
  "https://dineshrevunuru.com.evil.example",
  "https://notdineshrevunuru.com",
  "https://evil.example/?x=dineshrevunuru.com",
]) {
  assert.equal(
    resolve({ NEXT_PUBLIC_SITE_URL: impostor }).IS_CANONICAL_HOST,
    false,
    `impostor host passed the canonical check: ${impostor}`,
  );
}

console.log(
  "PASS — SITE_URL: blank falls through to localhost, production resolves canonical, " +
    "previews and impostor hosts fail closed",
);
