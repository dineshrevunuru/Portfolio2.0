import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

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
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/hss-demo", "/hss-band-lab"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
