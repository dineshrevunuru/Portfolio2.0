import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

/**
 * The sitemap the WordPress site got from Yoast and this one had nothing to
 * replace it with.
 *
 * Written as a route rather than a static public/sitemap.xml so it cannot drift
 * from the app: a file would still be listing pages months after they moved.
 *
 * Only pages a visitor should land on cold are listed. Deliberately absent:
 *
 * - /microsoft-case-study — real content, but 15 image slots still render as
 *   placeholders, so the page is noindex. Add it here in the same change that
 *   lifts the noindex.
 * - The four independent concepts (/mate-campaign-preflight and the rest) —
 *   noindex by rule; /work is the indexed shelf that links to them.
 * - /hss-demo — the booking widget. It is built to run inside an iframe on the
 *   case study, and out of that frame it is a UI with no context.
 * - /hss-band-lab — a disposable layout jig that should not be in the build at
 *   all, let alone the index.
 *
 * priority is a hint search engines mostly ignore, and it only ever expresses
 * relative order within one site. The ranking here is what a hiring reader
 * should hit first: the flagship case, then the resume, then everything else.
 */
/**
 * The date each page's content last really changed. Update it with the page.
 * A lastmod that is always "now" (what this used to send) is one Google learns
 * to ignore, so it stops being a signal at all.
 */
const pages: {
  path: string;
  updated: string;
  changeFrequency: "monthly" | "yearly";
  priority: number;
}[] = [
  { path: "/", updated: "2026-09-23", changeFrequency: "monthly", priority: 1 },
  { path: "/hss-case-study", updated: "2026-09-23", changeFrequency: "monthly", priority: 0.9 },
  { path: "/resume", updated: "2026-09-23", changeFrequency: "monthly", priority: 0.8 },
  { path: "/work", updated: "2026-09-23", changeFrequency: "monthly", priority: 0.8 },
  { path: "/lorem", updated: "2026-09-23", changeFrequency: "monthly", priority: 0.7 },
  { path: "/agents", updated: "2026-09-23", changeFrequency: "monthly", priority: 0.6 },
  { path: "/uniquefit-case-study", updated: "2026-09-23", changeFrequency: "yearly", priority: 0.6 },
  { path: "/101-reporters-case-study", updated: "2026-09-23", changeFrequency: "yearly", priority: 0.6 },
  { path: "/b2b-dock-case-study", updated: "2026-09-23", changeFrequency: "yearly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: p.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${p.path}`,
    lastModified: new Date(p.updated),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
