/**
 * Shipped case-study cards, shared by the homepage grid and /work.
 * One list, so the two pages cannot drift apart.
 */

export type ProjectSlug =
  | "hss"
  | "adani"
  | "microsoft"
  | "jira"
  | "lcg"
  | "uniquefit"
  | "reporters"
  | "b2b";

export type ThumbVariant = "wide" | "tall" | "composite";

export type Project = {
  slug: ProjectSlug;
  logo?: string;
  logoAlt?: string;
  title: string;
  description: string;
  cta: "password" | "case-study";
  href: string;
  thumb: string;
  thumbW: number;
  thumbH: number;
  thumbVariant: ThumbVariant;
  /** Keep the entry but omit it from the grid. Flip to false to show again. */
  hidden?: boolean;
  /** Serve the original file untouched, no Next.js downscaling. */
  unoptimized?: boolean;
};

export const projects: Project[] = [
  {
    slug: "hss",
    title: "AI booking platform",
    description:
      "Customers were dropping out between the ad and the appointment. I designed and built the system that closed the gap.",
    cta: "case-study",
    href: "/hss-case-study",
    thumb: "/projects/hss-tara-mobile.png",
    thumbW: 1808,
    thumbH: 2424,
    thumbVariant: "tall",
  },
  {
    slug: "adani",
    // Hidden from the grid for now — entry kept intact, flip to show again.
    hidden: true,
    logo: "/logos/Adani-logo.png",
    logoAlt: "Adani",
    title: "Enterprise Cement manufacturing",
    description:
      "Redesigning manufacturing dashboard for easy consumption of data and keeping track of what is happening across various manufacturing plants.",
    cta: "password",
    href: "#",
    thumb: "/projects/Adani-dashboard-Thumbnail.png",
    thumbW: 1272,
    thumbH: 986,
    thumbVariant: "wide",
  },
  {
    slug: "microsoft",
    /* Hidden from the grid 2026-08-12, with jira and lcg, and re-surfaced in the
       Neudesic strip below. A card promising "View case study" that resolves to
       href="#" is a say/show gap on the highest-traffic screen on the site, and
       it costs a visitor part of a 7-30 second scan to learn nothing. The name
       is the asset here, not the empty card.

       Promote back to a live card when /microsoft-case-study has its visuals —
       the route already exists and builds; it is only the 15 image slots that
       are still placeholders. */
    hidden: true,
    logo: "/logos/Microsoft-logo.png",
    logoAlt: "Microsoft",
    title: "MS Surface knowledge\nportal",
    description:
      "One-stop solution to raise and track service requests & find all Surface-related information in one place.",
    cta: "password",
    href: "#",
    thumb: "/projects/microsoft-thumbnail.png",
    thumbW: 1300,
    thumbH: 938,
    thumbVariant: "wide",
  },
  {
    slug: "jira",
    /* Hidden 2026-08-12 — see the note on microsoft. Surfaced in the Neudesic
       strip instead. */
    hidden: true,
    logo: "/logos/Jira-logo.png",
    logoAlt: "Jira Software",
    title: "Generative A.I Extension",
    description:
      "Plain-language prompts become well-formed tickets and sprint summaries, right inside Jira.",
    cta: "password",
    href: "#",
    thumb: "/projects/Jira-thumbnail.png",
    thumbW: 1272,
    thumbH: 986,
    thumbVariant: "wide",
  },
  {
    slug: "lcg",
    /* Hidden 2026-08-12 — see the note on microsoft. Surfaced in the Neudesic
       strip instead. */
    hidden: true,
    logo: "/logos/Learing-care-group-logo.png",
    logoAlt: "Learning Care Group",
    title: "Editable School Application",
    description:
      "Enrollment forms that school admins edit themselves, without waiting on engineering.",
    cta: "password",
    href: "#",
    thumb: "/projects/LCG-thumbnail.png",
    thumbW: 1272,
    thumbH: 986,
    thumbVariant: "wide",
  },
  {
    slug: "uniquefit",
    title: "Online custom clothing platform",
    description:
      "people can customise their clothes online with a wide range of customising options at affordable prices.",
    cta: "case-study",
    href: "/uniquefit-case-study",
    thumb: "/projects/Uniquefit-landing-page-image2.png",
    thumbW: 1827,
    thumbH: 1482,
    thumbVariant: "composite",
  },
  {
    slug: "reporters",
    title: "Freelance Journalists\nPlatform",
    description:
      "A platform for freelance journalists who can & are open to write articles and blogs on their own interest.",
    cta: "case-study",
    href: "/101-reporters-case-study",
    thumb: "/projects/101-reporters-landing-page-image.png",
    thumbW: 1398,
    thumbH: 1521,
    thumbVariant: "tall",
  },
  {
    slug: "b2b",
    title: "B2B retailer and Reseller Platform",
    description:
      "B2B Dock is an application that connects with manufacturers, wholesalers, traders, and retailers.",
    cta: "case-study",
    href: "/b2b-dock-case-study",
    thumb: "/projects/B2b-lanidng-page.png",
    thumbW: 1210,
    thumbH: 1102,
    thumbVariant: "wide",
  },
];

// Cards shown in the work grid. Hidden entries stay in `projects` above.
export const visibleProjects = projects.filter((p) => !p.hidden);
