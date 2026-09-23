import { pageMetadata } from "../seo";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import ProjectGrid from "../components/ProjectGrid";
import styles from "./work.module.css";

const SEO = {
  path: "/work",
  title: "Work: product design case studies — Dinesh Revunuru",
  description:
    "Case studies by product designer Dinesh Revunuru: an AI booking platform, custom clothing e-commerce, a journalism platform, a B2B trading app, and concepts.",
};

export const metadata = pageMetadata(SEO);

type Concept = {
  slug: string;
  company: string;
  /**
   * The company's own logo file (Dinesh supplied the Amazon Quick, Mate and Publix
   * files), reversed to white: what these brands use on dark grounds (Indeed's
   * guidelines allow only Indeed Blue or white, and blue fails on #202124).
   */
  logo?: { src: string; w: number; h: number; /** Rendered height, tuned per logo for equal optical weight. */ px: number };
  title: string;
  description: string;
  href: string;
  image: { src: string; w: number; h: number };
  /** Tint behind the screenshot, taken from the company's own palette. */
  tint: string;
  /** Portrait phone captures sit centred; desktop captures bleed off the right edge. */
  phone?: boolean;
};

/**
 * Newest first (by when each went up on this site). The first entry becomes the
 * feature; the rest fill the library grid below it.
 *
 * These pages stay noindex (see each route's metadata). This index is what gets
 * found, so a search for a company name never lands on a concept of its product.
 */
const concepts: Concept[] = [
  {
    slug: "quick",
    company: "Amazon Quick",
    logo: { src: "/logos/amazon-quick-logo.svg", w: 1203, h: 201, px: 24 },
    title: "Come back to what was held",
    description:
      "Delegate a bounded task, keep working, and come back to a result that names what was held, not only what finished.",
    href: "/amazon-quick-delegation",
    image: { src: "/images/amazon-quick-delegation/hero-full.png", w: 3024, h: 1520 },
    tint: "#e6ddfb",
  },
  {
    slug: "publix",
    company: "Publix",
    logo: { src: "/logos/publix-wordmark.svg", w: 1025, h: 190, px: 17 },
    title: "The trip, not the list",
    description: "Public customer evidence, one interaction idea, and a working shopping-trip prototype.",
    href: "/publix-the-trip",
    image: { src: "/images/publix-the-trip-v3/official-shopping-list.png", w: 1206, h: 2622 },
    tint: "#dcecd3",
    phone: true,
  },
  {
    slug: "indeed",
    company: "Indeed",
    logo: { src: "/images/indeed-match-check/indeed-logo.svg", w: 1333, h: 357, px: 23 },
    title: "Before a hiring rule removes someone",
    description:
      "A recruiter tightens one required qualification. The moment that shows them who it removes, and what their own job post still promises.",
    href: "/indeed-match-check",
    image: { src: "/images/indeed-match-check/02-conflict.png", w: 1236, h: 1350 },
    tint: "#dce7f8",
  },
  {
    slug: "mate",
    company: "Mate",
    logo: { src: "/logos/mate-wordmark.svg", w: 1350, h: 400, px: 25 },
    title: "The moment before Approve",
    description:
      "I traced one cross-channel campaign decision, then designed and built a preflight to make it easier to understand.",
    href: "/mate-campaign-preflight",
    image: { src: "/images/mate-campaign-preflight/hero-full.png", w: 3024, h: 1270 },
    tint: "#d9eaf4",
  },
];

function CompanyMark({ c, scale = 1 }: { c: Concept; scale?: number }) {
  if (!c.logo) return <div className={`${styles.mark} ${styles.markText}`}>{c.company}</div>;
  return (
    <div className={styles.mark}>
      <Image
        src={c.logo.src}
        alt={c.company}
        width={c.logo.w}
        height={c.logo.h}
        unoptimized
        style={{ height: Math.round(c.logo.px * scale), width: "auto" }}
      />
    </div>
  );
}

function Thumb({ c, sizes }: { c: Concept; sizes: string }) {
  // The image is a link too. Hidden from screen readers and the tab order: the
  // title link is the accessible one, so the item isn't announced twice.
  return (
    <Link
      href={c.href}
      tabIndex={-1}
      aria-hidden="true"
      className={`${styles.art} ${c.phone ? styles.artPhone : ""}`}
      style={{ backgroundColor: c.tint }}
    >
      <Image src={c.image.src} alt="" width={c.image.w} height={c.image.h} sizes={sizes} />
    </Link>
  );
}

export default function WorkPage() {
  const [feature, ...rest] = concepts;

  return (
    <main className="w-full">
      <SiteNav active="work" />

      {/* Every block on this page reveals in reading order: title, intro, the
          section heading, each card, the panel and everything inside it, the
          About section, then the footer. Groups stagger their children;
          SeqReveal batches whatever enters view together into one sequence. */}
      <header className="pad-cards mx-auto w-full max-w-[1440px] pt-16 sm:pt-20" data-seq-group>
        <h1 className={styles.title}>Work</h1>
        <p className={styles.lede}>
          Work I&apos;ve done for real clients, and things I built because I couldn&apos;t stop
          thinking about them.
        </p>
      </header>

      <section className="pad-cards mx-auto w-full max-w-[1440px] seq pt-20 sm:pt-24">
        <h2 className="t-section-head">Projects I worked on</h2>
      </section>
      <section className="pad-cards mx-auto w-full max-w-[1440px] pt-8 sm:pt-10">
        <ProjectGrid />
      </section>

      <section className={`${styles.funWrap} mx-auto w-full max-w-[1440px] pt-28 sm:pt-40`}>
        {/* The one dark zone on the site: a single rounded stage panel on a light
            page, the form design-taste sanctions. Structure follows design.google
            (a feature, then a two-column library). */}
        <div className={`${styles.fun} seq`} role="region" aria-labelledby="fun-time">
          <h2 id="fun-time" className={`${styles.funTitle} seq`} style={{ ["--sd" as string]: "180ms" }}>
            My fun time
          </h2>
          <p className={`${styles.cap} seq`} style={{ ["--sd" as string]: "300ms" }}>
            I can&apos;t sing, I can&apos;t dance, and I&apos;m not athletic.{" "}
            <span>
              This is what I do instead. When I&apos;m curious about a company, I build the thing
              its own website says is hard.
            </span>
          </p>

          <article className={`${styles.item} ${styles.feature}`} data-seq-group>
            <div>
              <CompanyMark c={feature} scale={1.25} />
              <h3>
                <Link href={feature.href}>{feature.title}</Link>
              </h3>
              <p>{feature.description}</p>
            </div>
            {/* Wrapped so the reveal's transition never lands on .art, whose own
                transition drives the hover zoom. */}
            <div>
              <Thumb c={feature} sizes="(min-width: 1024px) 560px, 90vw" />
            </div>
          </article>

          <div className={styles.lib} data-seq-group>
            {rest.map((c) => (
              <article key={c.slug} className={styles.item}>
                <div>
                  <CompanyMark c={c} />
                  <h3>
                    <Link href={c.href}>{c.title}</Link>
                  </h3>
                  <p>{c.description}</p>
                </div>
                <Thumb c={c} sizes="200px" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser. Copy is DRAFT (Lorem, from the verified resume record); Dinesh locks the voice. */}
      <section className="pad-cards mx-auto w-full max-w-[1440px] pt-28 sm:pt-40">
        <div className={styles.about} data-seq-group>
          <div className={styles.aboutPhoto}>
            <Image
              src="/about/profile-circle.webp"
              alt="Dinesh Revunuru"
              fill
              sizes="(min-width: 1024px) 420px, 80vw"
              className="object-contain"
            />
          </div>
          <div>
            <h2 className={styles.aboutTitle}>About me</h2>
            <p className={styles.aboutText}>
              I&apos;m a product designer in Chicago. I started freelancing in 2017, ran my own
              studio, then designed generative AI tools at Neudesic, an IBM company. After my
              master&apos;s in HCI at DePaul, I now design and build AI products for Hair System
              Salons: an assistant, a booking app, and the tools the staff run on.
            </p>
          </div>
        </div>
      </section>

      <div className="h-24" />
      <div className="seq">
        <SiteFooter />
      </div>
    </main>
  );
}
