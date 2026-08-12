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
 *   placeholders. Add it the moment those are filled; an indexed page that
 *   looks unfinished is worse than one Google has not found yet.
 * - /hss-demo — the booking widget. It is built to run inside an iframe on the
 *   case study, and out of that frame it is a UI with no context.
 * - /hss-band-lab — a disposable layout jig that should not be in the build at
 *   all, let alone the index.
 *
 * priority is a hint search engines mostly ignore, and it only ever expresses
 * relative order within one site. The ranking here is what a hiring reader
 * should hit first: the flagship case, then the resume, then everything else.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/hss-case-study`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/lorem`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${SITE_URL}/uniquefit-case-study`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/101-reporters-case-study`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/b2b-dock-case-study`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
