import type { MetadataRoute } from "next";
import { IS_CANONICAL_HOST, SITE_URL } from "./site";

/**
 * robots.txt, generated rather than static so it points at the same origin the
 * sitemap does.
 *
 * Everything is crawlable except the API routes and the two surfaces that are
 * not pages. /api/ matters most: every request to /api/lorem and /api/voice
 * spends real money on a model call and a TTS render, and a crawler walking
 * them would do that repeatedly for nothing. They are POST-only so a crawler
 * would fail anyway, but stating it is free.
 *
 * AI crawlers are deliberately NOT blocked. This is a portfolio whose whole
 * argument is that its author builds AI products; being quotable by the tools
 * a hiring team actually uses is the point, not a leak.
 */
/**
 * Anything that is not the real domain refuses crawlers outright.
 *
 * A *.vercel.app preview is a full, public copy of the site. Left crawlable it
 * gets indexed, and then the portfolio competes with itself: two URLs, the same
 * content, and Google picking which one a recruiter sees. Vercel only adds its
 * own noindex header to deployments it classes as previews, and the first
 * deployment of a project is classed as production, so that safety net does not
 * cover this case.
 *
 * The predicate itself lives in site.ts next to SITE_URL — one definition,
 * shared with the Clarity gate, exact-hostname rather than substring, and
 * failing closed when SITE_URL cannot identify itself as the real domain.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_CANONICAL_HOST) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/hss-demo", "/hss-band-lab", "/mate-prototype", "/indeed-match-check-prototype", "/publix-prototype"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
