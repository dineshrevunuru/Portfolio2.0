/**
 * Shipped case-study cards, shared by the homepage grid and /work.
 * One list, so the two pages cannot drift apart.
 */

export type ProjectSlug =
  | "hss"
  | "adani"
  | "amn"
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
  /** On /work only, not the homepage grid. */
  workOnly?: boolean;
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
    /* 2026-11-18: back on the grid, opening the new case study, with its original title and line. The picture
       is the case's redrawn Leadership Summary (every figure changed, the map left out) in the same laptop as the
       other cards. The old thumbnail is the real dashboard with its map and stays off the grid (NDA). */
    logo: "/logos/Adani-logo.png",
    logoAlt: "Adani",
    title: "Enterprise Cement manufacturing",
    description:
      "Redesigning manufacturing dashboard for easy consumption of data and keeping track of what is happening across various manufacturing plants.",
    cta: "case-study",
    href: "/adani-case-study",
    thumb: "/projects/adani-redrawn-thumbnail.png",
    thumbW: 1272,
    thumbH: 986,
    thumbVariant: "wide",
  },
  {
    slug: "amn",
    /* 2026-11-18: new card for the new case study. Title and line are DRAFT (Lorem's, in the grid's register;
       Dinesh to confirm). The picture is the case's own cover, redrawn: ShiftWise's staff list on the laptop,
       Passport's home on the phone, in the same frames as the other cards. */
    logo: "/sketches/logos/amn.png",
    logoAlt: "AMN Healthcare",
    title: "Healthcare staffing platform",
    description:
      "Apps for travel nurses and the hospitals that staff them, rebuilt to work as one on a shared design system.",
    cta: "case-study",
    href: "/amn-healthcare-case-study",
    thumb: "/projects/amn-thumbnail.png",
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
    /* 2026-11-18: back on the grid, opening the new 3 Stripes case study, with its original logo, title and
       picture. The line drops "sprint summaries", which the case does not show. */
    logo: "/logos/Jira-logo.png",
    logoAlt: "Jira Software",
    title: "Generative A.I Extension",
    description:
      "Plain-language prompts become well-formed epics and tickets, right inside Jira.",
    cta: "case-study",
    href: "/3-stripes-case-study",
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
    // Off the homepage grid since 2026-11-18 ("replace the current case studies from home page"); still on /work.
    workOnly: true,
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
    // Off the homepage grid since 2026-11-18 ("replace the current case studies from home page"); still on /work.
    workOnly: true,
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
    // Off the homepage grid since 2026-11-18 ("replace the current case studies from home page"); still on /work.
    workOnly: true,
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

// Cards shown on /work. Hidden entries stay in `projects` above.
export const visibleProjects = projects.filter((p) => !p.hidden);
// Cards shown on the homepage: the /work list without the work-only ones.
export const homeProjects = visibleProjects.filter((p) => !p.workOnly);
