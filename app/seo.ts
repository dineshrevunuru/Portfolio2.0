import type { Metadata } from "next";

/** The home page's title and description, and the default for any page without its own. */
export const SITE_TITLE = "Dinesh Revunuru — Senior Product Designer";
export const SITE_DESCRIPTION =
  "Dinesh Revunuru designs and builds AI products in Chicago. MS in HCI from DePaul; previously generative AI design at Neudesic, an IBM company.";

/**
 * The generated link-preview card (app/opengraph-image.tsx), named explicitly.
 *
 * Next injects that file-convention image only into the openGraph object it
 * owns. A page that sets its own openGraph replaces the layout's object whole,
 * image included, so every page built with pageMetadata() was sharing with no
 * image at all. Naming the route here puts it back. It gives up the file's
 * content-hash query, so after changing the card, bump `v` to make LinkedIn,
 * X and Slack fetch it again.
 */
const DEFAULT_IMAGE = {
  url: "/opengraph-image?v=1",
  width: 1200,
  height: 630,
  alt: "Dinesh Revunuru, Senior Product Designer",
};

/**
 * Per-page SEO in one call: title, description, a self-referencing canonical,
 * and matching Open Graph / Twitter text and image.
 *
 * Next shallow-merges `openGraph` and `twitter` per page, so a page that sets
 * either replaces the layout's object whole. Repeating the shared fields here is
 * what keeps siteName, locale, the image and the large card on every page.
 *
 * Every public page uses this, including noindex ones: noindex keeps a page out
 * of search, but its title, description and card still decide how the link
 * looks when someone pastes it into LinkedIn, Slack or an email.
 */
export function pageMetadata({
  path,
  title,
  description,
  image = DEFAULT_IMAGE,
}: {
  path: string;
  title: string;
  description: string;
  image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Dinesh Revunuru",
      locale: "en_US",
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * Concept pages: shareable, but not for the index (the rule since 2026-09-09:
 * a search for a company's name should not land on my concept of its product).
 * `follow` stays on so the links out of the page still count.
 */
export const NOINDEX = { robots: { index: false, follow: true } } satisfies Metadata;
