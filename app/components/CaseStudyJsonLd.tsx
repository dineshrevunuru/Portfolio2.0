import { SITE_URL } from "../site";

/**
 * Structured data for an indexed case study: the work itself (CreativeWork,
 * authored by the same Person the home page describes) and where it sits on
 * the site (BreadcrumbList, which Google can show in place of the bare URL:
 * dineshrevunuru.com › Work › …).
 *
 * Only indexed case studies carry this. Concept pages are noindex, and the
 * Microsoft case waits until its images are in.
 */
export default function CaseStudyJsonLd({
  path,
  name,
  description,
  client,
}: {
  path: string;
  /** The case's own name, without the site suffix the <title> carries. */
  name: string;
  description: string;
  client: string;
}) {
  const url = `${SITE_URL}${path}`;
  const person = `${SITE_URL}/#person`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        name,
        description,
        url,
        genre: "Product design case study",
        about: { "@type": "Organization", name: client },
        author: { "@id": person },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      { "@type": "Person", "@id": person, name: "Dinesh Revunuru", url: SITE_URL },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: every value is a static string from the page.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
