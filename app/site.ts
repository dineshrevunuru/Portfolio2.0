/**
 * The site's own absolute origin, in one place.
 *
 * Needed because sitemap.xml, robots.txt and Open Graph tags all require
 * absolute URLs — a relative og:image silently fails to render a preview card,
 * which is the kind of bug you only discover after pasting a link somewhere
 * public.
 *
 * RESOLUTION ORDER — and why the fallback is NOT the production domain.
 *
 * This value feeds two gates that must fail CLOSED: robots.ts (previews refuse
 * crawlers) and Clarity.tsx (analytics loads only on the real domain). The
 * original version fell back to https://dineshrevunuru.com whenever
 * NEXT_PUBLIC_SITE_URL was unset — which is the actual state of every real
 * Vercel preview, since the var is set in the Production scope only. Verified
 * live: a preview deployment was serving `Allow: /` in robots.txt, meaning
 * previews were indexable and competing with the real site. The gate's default
 * state was "I am production."
 *
 * So the chain is now:
 *   1. NEXT_PUBLIC_SITE_URL — explicit wins, always.
 *   2. VERCEL_ENV === "production" — Vercel sets this on every production
 *      build, dashboard or CLI, so prod stays correct even if the var is lost.
 *   3. VERCEL_URL — the deployment's own *.vercel.app host. A preview now
 *      describes itself, which is what makes both gates fail closed there.
 *   4. localhost — a local build is never canonical.
 *
 * VERCEL_* are plain (non-NEXT_PUBLIC) vars, which works because every consumer
 * of this file runs server-side: robots, sitemap, layout metadata, and the
 * Clarity server component.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? "https://dineshrevunuru.com"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * "Is this build the real site?" — the single definition, shared by robots.ts
 * and Clarity.tsx, which previously each kept their own character-for-character
 * copy of this check. Two copies of a gate predicate is how a domain change
 * updates one and silently splits behavior: robots allows indexing while
 * analytics stays off, and nothing errors.
 *
 * An exact-hostname compare, not includes(): a substring match would accept any
 * URL merely containing the domain — "dineshrevunuru.com.evil.example" passes
 * includes() — and the whole point of the predicate is that it errs toward
 * "not production."
 */
export const IS_CANONICAL_HOST = (() => {
  try {
    const host = new URL(SITE_URL).hostname;
    return host === "dineshrevunuru.com" || host === "www.dineshrevunuru.com";
  } catch {
    return false;
  }
})();
