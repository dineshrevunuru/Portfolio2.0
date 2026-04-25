import Image from "next/image";
import Link from "next/link";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

type ProjectSlug =
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
};

const projects: Project[] = [
  {
    slug: "adani",
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
    logo: "/logos/Microsoft-logo.png",
    logoAlt: "Microsoft",
    title: "MS Surface\u00A0knowledge\nportal",
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
    logo: "/logos/Jira-logo.png",
    logoAlt: "Jira Software",
    title: "Generative A.I Extension",
    description:
      "people can customise their clothes online with a wide range of customising options at affordable prices.",
    cta: "password",
    href: "#",
    thumb: "/projects/Jira-thumbnail.png",
    thumbW: 1272,
    thumbH: 986,
    thumbVariant: "wide",
  },
  {
    slug: "lcg",
    logo: "/logos/Learing-care-group-logo.png",
    logoAlt: "Learning Care Group",
    title: "Editable School Application",
    description:
      "A platform for freelance journalists who can & are open to write articles and blogs on their own interest.",
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
    title: "Freelance\u00A0Journalists\nPlatform",
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

const experiments: { title: string; description: string }[] = [
  {
    title: "Employee on boarding",
    description:
      "A learning exercise to gain hands on experience in applying UX strategies to build responsible A.I to simpilifiy, automate and enrich recruitment process.",
  },
  {
    title: "HCAI Research & Findings",
    description:
      "A learning exercise to gain hands on experience in applying UX strategies to build responsible A.I to simpilifiy, automate and enrich recruitment process.",
  },
  {
    title: "Initiative Design system",
    description:
      "A learning exercise to gain hands on experience in applying UX strategies to build responsible A.I to simpilifiy, automate and enrich recruitment process.",
  },
];

function Arrow() {
  return (
    <svg
      className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="w-full">
      <SiteNav active="home" />

      {/* Hero */}
      <section className="pad-hero mx-auto w-full max-w-[1440px] pt-[50px]">
        <div className="hero-card">
          <div className="grid h-full grid-cols-1 items-center gap-0 lg:grid-cols-[1.2fr_1fr]">
            {/* Left — copy (2nd on mobile, 1st on desktop) */}
            <div className="hero-copy order-2 lg:order-1">
              <h1 className="t-serif-hero text-[color:var(--color-ink)]">
                Hi, I&rsquo;m Dinesh,
              </h1>
              <h2 className="mt-2 t-sans-hero text-[color:var(--color-accent)]">
                UX UI Designer
              </h2>
              <p className="mt-6 max-w-[480px] t-body-lg text-[color:var(--color-body-ink)]">
                Currently, HCI student at{" "}
                <strong className="font-semibold">Depaul University</strong>.
                Earlier worked on Generative A.I at{" "}
                <strong className="font-semibold">Neudesic</strong>{" "}
                <strong className="font-semibold">(an IBM Company)</strong>.
              </p>
              <div className="mt-6">
                <Link
                  href="/resume"
                  className="group inline-flex items-center t-cta text-[color:var(--color-brand-blue)]"
                >
                  View my resume
                  <Arrow />
                </Link>
              </div>
            </div>

            {/* Right — portrait (1st on mobile, 2nd on desktop) */}
            <div className="order-1 lg:order-2 lg:h-full">
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

      {/* Projects heading */}
      <section className="pad-section mx-auto w-full max-w-[1440px] pt-20 sm:pt-24">
        <h3 className="t-section-head">Projects I have worked on</h3>
      </section>

      {/* Projects grid */}
      <section className="pad-cards mx-auto w-full max-w-[1440px] pt-8 sm:pt-10">
        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          {projects.map((p) => (
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
              <Link href={p.href} className="mt-5 inline-flex items-center t-cta">
                {p.cta === "password"
                  ? "Updating (Required Password)"
                  : "View case study"}
                <Arrow />
              </Link>

              <div className={`thumb thumb-${p.thumbVariant} mt-8`}>
                <Image
                  src={p.thumb}
                  alt={p.title}
                  width={p.thumbW}
                  height={p.thumbH}
                  sizes="(min-width: 1024px) 508px, (min-width: 640px) 60vw, 90vw"
                  loading="eager"
                  className="block h-auto w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Fun projects heading — desktop only (matches live elementor-hidden-tablet/mobile) */}
      <section className="pad-section mx-auto hidden w-full max-w-[1440px] pt-24 lg:block">
        <h3 className="t-section-head">Fun projects &amp; Experiments</h3>
      </section>

      {/* Fun projects grid — desktop only */}
      <section className="pad-cards mx-auto hidden w-full max-w-[1440px] pt-10 pb-24 lg:block">
        <div className="grid grid-cols-3 gap-5">
          {experiments.map((e) => (
            <article key={e.title} className="fun-card group">
              <div>
                <h4 className="t-fun-title">{e.title}</h4>
                <p className="mt-4 t-body-fun">{e.description}</p>
              </div>
              <Link href="#" className="mt-6 inline-flex items-center t-cta">
                Updating (Required Password)
                <Arrow />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Spacer for mobile/tablet after last project row */}
      <div className="h-16 lg:hidden" />

      <SiteFooter />
    </main>
  );
}
