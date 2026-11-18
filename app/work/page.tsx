import { pageMetadata } from "../seo";
import Image from "next/image";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import ProjectGrid from "../components/ProjectGrid";
import styles from "./work.module.css";

const SEO = {
  path: "/work",
  title: "Work: product design case studies — Dinesh Revunuru",
  description:
    "Case studies by product designer Dinesh Revunuru: an AI booking platform, a cement-plant dashboard, a healthcare staffing platform, a generative AI extension for Jira, custom clothing e-commerce, a journalism platform, a B2B trading app.",
};

export const metadata = pageMetadata(SEO);

export default function WorkPage() {
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
        <ProjectGrid on="work" />
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
