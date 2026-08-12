/**
 * The site's own absolute origin, in one place.
 *
 * Needed because sitemap.xml, robots.txt and Open Graph tags all require
 * absolute URLs — a relative og:image silently fails to render a preview card,
 * which is the kind of bug you only discover after pasting a link somewhere
 * public.
 *
 * Reads NEXT_PUBLIC_SITE_URL first so a Vercel preview deployment describes
 * itself rather than claiming to be production, which would otherwise point
 * every preview's canonical and sitemap at the live domain.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel to https://dineshrevunuru.com for the
 * production environment, and to the preview URL for preview environments.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dineshrevunuru.com"
).replace(/\/$/, "");
