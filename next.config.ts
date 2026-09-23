import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    contentDispositionType: "inline",
  },
  /**
   * Every one of these exists because a URL is already live and indexed
   * somewhere we do not control.
   *
   * The WordPress site this replaces has nine URLs in its Yoast sitemap. Five
   * carry over unchanged (/, /resume, and the three Maxc case studies, whose
   * slugs happen to match exactly). Four have no home in the new site, and
   * without the rules below they start returning 404 the moment DNS moves.
   *
   * That matters more than a normal 404: these are in Google's index, and
   * /surface-knowledge-portal in particular is the kind of link that is sitting
   * in a recruiter's inbox or on a LinkedIn profile right now. A stale page
   * beats a dead one; a correct redirect beats both.
   *
   * Next normalises the trailing slash before matching, so `/foo` here also
   * catches WordPress's `/foo/` (verified against all nine URLs, not assumed).
   *
   * `permanent: true` issues a 308 and passes ranking signal to the new URL.
   * It is also cached hard by browsers, so a wrong destination here is
   * genuinely difficult to take back. Change one only if the new destination
   * is certainly right.
   */
  async redirects() {
    return [
      // The assistant was called Boo until the Lorem rename. Anything already
      // linking to /boo, a shared link or a bookmark, still lands correctly.
      { source: "/boo", destination: "/lorem", permanent: true },

      /* The one orphan with a true equivalent. Points at the real case study
         rather than the generic strip, because someone following this URL wants
         the Surface work specifically.
         ⚠ That page still renders 15 labelled image placeholders. Fill them
         before DNS cutover, or this redirect delivers a visibly unfinished page
         to the highest-intent inbound link on the site. */
      {
        source: "/surface-knowledge-portal",
        destination: "/microsoft-case-study",
        permanent: true,
      },

      /* No equivalent page exists for these three, so they land on the section
         that actually names the work instead of dumping the visitor at the top
         of the home page.

         "Three Stripes" was Neudesic's generative-AI product; the Jira extension
         was a component of it, and that card is in the strip. Neuron7 is the one
         with no card yet, so this redirect lands near-but-not-exactly; give it a
         card if that inbound link turns out to matter. Employee onboarding was a
         learning exercise and is gone on purpose. */
      {
        source: "/three-stripes-generative-ai",
        destination: "/#enterprise",
        permanent: true,
      },
      { source: "/neuron-7-ai", destination: "/#enterprise", permanent: true },
      { source: "/employee-onboarding", destination: "/#enterprise", permanent: true },

      /* WordPress's sitemap addresses. Search Console may still hold one of
         these as the submitted sitemap; pointing them at the real one means it
         finds the current list instead of a 404. */
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },

      /* One host. Under WordPress, www 301'd to the apex; on Vercel both hosts
         served the full site (verified 2026-09-23), a duplicate of every page.
         The canonical tags already name the apex; this makes it true for
         visitors and crawlers too. Safe only while the apex is the primary
         domain in Vercel: if the project is ever switched to redirect apex →
         www, this rule would loop and must go. */
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.dineshrevunuru.com" }],
        destination: "https://dineshrevunuru.com/:path*",
        permanent: true,
      },
    ];
  },

  /**
   * Prototype bundles and demo surfaces: reachable, never indexed.
   *
   * These used to be blocked in robots.txt instead, which does the opposite of
   * what it looks like: a disallowed URL is never fetched, so Google never
   * sees a noindex, and any page that links to it can still put the bare URL
   * in results. A header works for the static HTML bundles in public/ without
   * editing their build output, and robots.txt now lets crawlers read it.
   */
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex" }];
    return [
      "/mate-prototype/:path*",
      "/indeed-match-check-prototype/:path*",
      "/publix-prototype/:path*",
      "/hss-demo/:path*",
      "/hss-band-lab/:path*",
    ].map((source) => ({ source, headers: noindex }));
  },
};

export default nextConfig;
