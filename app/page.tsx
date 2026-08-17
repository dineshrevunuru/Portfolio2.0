import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import BlackHole from "./components/blackhole/BlackHole";
import BubbleStrip from "./components/BubbleStrip";

type ProjectSlug =
  | "hss"
  | "adani"
  | "microsoft"
  | "jira"
  | "lcg"
  | "uniquefit"
  | "reporters"
  | "b2b";

type ThumbVariant = "wide" | "tall" | "composite";

type Project = {
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

const projects: Project[] = [
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
const visibleProjects = projects.filter((p) => !p.hidden);

/**
 * Enterprise work at Neudesic, as a credential strip rather than case-study
 * cards.
 *
 * This section previously held three "Fun projects" that shared one identical
 * description (with two typos in it) and three CTAs that all resolved to
 * href="#". Three cards saying the same sentence and going nowhere read as an
 * unfinished site, which is the opposite of what the section was for.
 *
 * What replaced them is the work that actually needed a home. Microsoft, Adani
 * and Learning Care Group are recognisable names, and per the capability intake
 * they are the whole of what Neudesic gives him: design depth at enterprise
 * scale, alongside names a reader already trusts. That value survives without a
 * clickable case study. A dead card destroys it.
 *
 * Every line here is deliberately scope, not outcome. This work was designed and
 * prototyped under NDA and did not ship to production, so there are no metrics
 * and no "shipped" claim anywhere in this array. Adding one would be the exact
 * over-claim an interviewer catches by asking "can I see it?".
 */
/**
 * `logoH` is per-logo on purpose, and it is the whole trick to this row.
 *
 * Setting one height for all four is the obvious move and it is wrong, because
 * these are four different KINDS of lockup. Jira is a single-line wordmark at
 * 6.5:1; Learning Care Group is a star mark beside a two-line stack at 2.1:1.
 * Matched on height, Jira renders three times the visual mass of its neighbours
 * while Learning Care Group's second line collapses into an unreadable smudge —
 * measured at 26px it came out 56px wide with roughly 8px of cap height.
 *
 * So each height is tuned to land the four at comparable optical weight and to
 * keep every wordmark legible: the stacked lockup gets the most height, the long
 * single-line wordmark gets the least. Widths land at 131 / 92 / 69 / 77, which
 * is as even as four real logos get.
 *
 * If a logo is ever swapped, re-tune its height by eye against the other three.
 * Do not normalise them back to one value.
 */
const enterprise: {
  title: string;
  description: string;
  logo: string;
  logoAlt: string;
  logoH: number;
}[] = [
  {
    title: "Microsoft Surface knowledge portal",
    description:
      "Research across four countries, a new information hierarchy, and an assistant that surfaces the existing answer before someone raises a duplicate request.",
    logo: "/logos/Microsoft-logo.png",
    logoAlt: "Microsoft",
    logoH: 24,
  },
  {
    title: "Adani cement manufacturing",
    description:
      "Dashboards for reading plant performance at a glance, across seven clusters and thirty-four plants.",
    logo: "/logos/Adani-logo.png",
    logoAlt: "Adani",
    logoH: 26,
  },
  {
    title: "Learning Care Group",
    description:
      "Enrollment forms that school administrators can edit themselves, without waiting on an engineering release.",
    logo: "/logos/Learing-care-group-logo.png",
    logoAlt: "Learning Care Group",
    /* The tallest of the four: a two-line stack needs ~1.5x a single-line
       wordmark's height before its second line becomes readable. */
    logoH: 36,
  },
  {
    /* Jira is the platform the extension was built for, not a fourth client —
       which is why the subhead above names only Microsoft, Adani and Learning
       Care Group. The logo identifies what it plugs into. */
    title: "Generative AI extension for Jira",
    description:
      "Plain-language prompts become well-formed tickets and sprint summaries, inside the tool teams already work in.",
    logo: "/logos/Jira-logo.png",
    logoAlt: "Jira Software",
    /* The shortest: at 6.5:1 this wordmark is already the widest thing in the
       row, so height is what keeps it from dominating. */
    logoH: 20,
  },
];

function WArrow() {
  return (
    <span className="warrow" aria-hidden="true">
      &rarr;
    </span>
  );
}

export default function Home() {
  return (
    <main className="w-full">
      <SiteNav active="work" />

      {/* Hero */}
      <section className="pad-hero mx-auto w-full max-w-[1440px] pt-[50px]">
        <div className="hero-card">
          <div className="grid h-full grid-cols-1 items-center gap-0 lg:grid-cols-[1.2fr_1fr]">
            {/* Left — copy (2nd on mobile, 1st on desktop) */}
            <div
              className="hero-copy seq order-2 lg:order-1"
              style={{ "--sd": "180ms" } as CSSProperties}
            >
              <h1 className="t-serif-hero text-[color:var(--color-ink)]">
                Hi, I&rsquo;m Dinesh,
              </h1>
              <h2 className="mt-2 t-sans-hero text-[color:var(--color-accent)]">
                Sr. Product Designer
              </h2>
              <p className="mt-6 max-w-[480px] t-body-lg text-[color:var(--color-body-ink)]">
                {/* Order is deliberate. R1 people-patterns §6: the headline
                    formula is dual-claim (designs AND builds) with no
                    brand-gravity restraint, because there is no title or logo
                    here to carry it. R2 demand-voice Rank 3 (build-in-code) is
                    the most evidence-converged hiring signal in that file, and
                    the h2 above only says "designer", so the build claim leads.
                    The credential lands last, where every Tier-T exemplar puts
                    it: a timing signal, not an opening credential.

                    Wording is Dinesh's own (2026-08-07), proofread only.
                    Three things were fixed and should not be reverted:
                    "HCI graduate" sits OUTSIDE the bold span, because inside it
                    the line read "Neudesic, an IBM company & HCI graduate" and
                    attributed the degree to the employer. "test for every edge
                    case and broader user groups" did not parse (you test for an
                    edge case, not for a user group). And the ampersands are now
                    "and" per core-voice.md, which allows "&" only inside a
                    brand name. */}
                I find the problem, then use AI to research, design, and build. I
                write evals and test every edge case, across user groups, and
                iterate on what works. Previously, generative AI at{" "}
                <strong className="font-semibold">
                  Neudesic, an IBM company
                </strong>
                . <strong className="font-semibold">HCI graduate</strong>.
              </p>
              <div className="mt-6">
                <Link
                  href="/resume"
                  className="group inline-flex items-center t-cta text-[color:var(--color-brand-blue)]"
                >
                  View my resume
                  <WArrow />
                </Link>
              </div>
            </div>

            {/* Right — portrait (1st on mobile, 2nd on desktop) */}
            <div
              className="seq order-1 lg:order-2 lg:h-full"
              style={{ "--sd": "360ms" } as CSSProperties}
            >
              <div className="hero-portrait">
                <Image
                  src="/hero/profile.png"
                  alt="Dinesh Revunuru"
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 320px, 260px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lorem banner — the voice-assistant add-on's front door. BlackHole
          wraps it: the card is still the link to /lorem, but the orb is its
          own button that folds the whole page into Lorem's space theme. */}
      <section
        className="pad-cards mx-auto w-full max-w-[1440px] seq pt-11"
        style={{ "--sd": "540ms" } as CSSProperties}
      >
        <BlackHole />
      </section>

      {/* Projects heading */}
      <section
        id="work"
        className="pad-cards mx-auto w-full max-w-[1440px] seq pt-20 sm:pt-24"
      >
        <h3 className="t-section-head">Projects I have worked on</h3>
      </section>

      {/* Projects grid */}
      <section className="pad-cards mx-auto w-full max-w-[1440px] pt-8 sm:pt-10">
        <div
          className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10"
          data-seq-group
        >
          {visibleProjects.map((p) => (
            <article key={p.slug} className={`project-card card-${p.slug} group`}>
              {p.logo && (
                <div className="mb-6 flex h-[40px] items-center">
                  <Image
                    src={p.logo}
                    alt={p.logoAlt ?? ""}
                    width={200}
                    height={40}
                    loading="eager"
                    unoptimized
                    className="h-[38px] w-auto object-contain"
                  />
                </div>
              )}

              <h4 className="t-serif-title whitespace-pre-line">{p.title}</h4>
              <p className="mt-5 t-body">{p.description}</p>
              <Link href={p.href} className="group mt-5 inline-flex items-center t-cta">
                {p.cta === "password"
                  ? "Updating (Required Password)"
                  : "View case study"}
                <WArrow />
              </Link>

              <div className={`thumb thumb-${p.thumbVariant} mt-8`}>
                <Image
                  src={p.thumb}
                  alt={p.title}
                  width={p.thumbW}
                  height={p.thumbH}
                  sizes="(min-width: 1024px) 508px, (min-width: 640px) 60vw, 90vw"
                  loading="eager"
                  unoptimized={p.unoptimized}
                  className="block h-auto w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Enterprise strip.

          Shown at every breakpoint, unlike the "Fun projects" section it
          replaces, which was desktop-only. That gate made sense for filler; it
          does not for the only enterprise credential on the page, and phone is
          where a recruiter opens a link from LinkedIn.

          The subhead does the honest framing once, so no individual card has to
          hedge. Saying "designed and prototyped" here is what lets each line
          below state scope plainly without implying it shipped. */}
      {/* id is a redirect target, not decoration. Three retired WordPress URLs
          (/three-stripes-generative-ai, /neuron-7-ai, /employee-onboarding) land
          here rather than at the top of the page, so an inbound visitor arrives
          at the section that names the work they were looking for. Renaming this
          id silently breaks those three. */}
      <section id="enterprise" className="pad-cards mx-auto w-full max-w-[1440px] pt-20 sm:pt-24">
        <h3 className="t-section-head">Enterprise work at Neudesic</h3>
        <p className="mt-4 max-w-[620px] t-body">
          Designed and prototyped for Microsoft, Adani and Learning Care Group.
          This work is under NDA and stayed in development, so there are no
          screens to show and no numbers to claim. The scope is the point.
        </p>
      </section>

      <section className="pad-cards mx-auto w-full max-w-[1440px] pt-8 pb-24 sm:pt-10">
        {/* No CTA on these cards, deliberately. The previous version put
            "Updating (Required Password)" and an arrow on every one, which reads
            as a link, resolves to href="#", and teaches a visitor that this
            site's arrows do nothing. A card with no affordance promises
            nothing and cannot disappoint. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4" data-seq-group>
          {enterprise.map((e) => (
            <article key={e.title} className="fun-card">
              <div>
                {/* Fixed-height box sized to the tallest lockup, so the four
                    titles share one baseline however tall each logo renders.
                    Without it the cards' text starts at four different heights
                    and the row reads as broken rather than as a set.

                    Height comes from the item (see logoH above), width is capped
                    as a backstop so no future logo can blow out the row. */}
                <div className="mb-5 flex h-[36px] items-center">
                  <Image
                    src={e.logo}
                    alt={e.logoAlt}
                    width={200}
                    height={40}
                    loading="eager"
                    unoptimized
                    style={{ height: e.logoH }}
                    className="w-auto max-w-[135px] object-contain object-left"
                  />
                </div>
                <h4 className="t-fun-title">{e.title}</h4>
                <p className="mt-4 t-body-fun">{e.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Spacer for mobile/tablet after last project row */}
      <div className="h-16 lg:hidden" />

      <SiteFooter tagline="scroll on — the footer hides bubble wrap ↓" />
      <BubbleStrip />
    </main>
  );
}
