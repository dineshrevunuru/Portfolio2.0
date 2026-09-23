import { SITE_URL } from "../site";

/**
 * Structured data for the home page: who this site is about (Person) and the
 * site itself (WebSite). This is what lets a name search show the right
 * profile details and links. Every field is from the verified resume record.
 */
export default function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Dinesh Revunuru",
        alternateName: "Dinesh Reddy Revunuru",
        url: SITE_URL,
        image: `${SITE_URL}/about/profile-circle.webp`,
        jobTitle: "Senior Product Designer",
        description:
          "Product designer in Chicago who designs and builds AI products.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Chicago",
          addressRegion: "IL",
          addressCountry: "US",
        },
        alumniOf: { "@type": "CollegeOrUniversity", name: "DePaul University" },
        worksFor: {
          "@type": "Organization",
          name: "Hair System Salons",
          url: "https://hairsystemsalons.com",
        },
        knowsAbout: [
          "Product design",
          "UX design",
          "Conversational AI",
          "Human-computer interaction",
          "Design systems",
        ],
        sameAs: [
          "https://www.linkedin.com/in/dinesh-revunuru/",
          "https://www.instagram.com/dinesh_revunuru/",
          "https://twitter.com/dinesh_revunuru/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Dinesh Revunuru",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: every value is a static string above.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
