// Starter template for new case studies. Underscore-prefixed folder is excluded
// from Next.js routing — copy this into a new folder (e.g. `app/my-case-study/`)
// and rename. Pair with a sibling `images.ts` that exports an object of
// `{ src, width, height }` entries (see `app/uniquefit-case-study/images.ts`).
//
// Container widths:
//   .cs-container       → 800px  (default body text)
//   .cs-container-wide  → 1100px (overview block, hero)
//   .cs-container-full  → 1600px (full-bleed images via `wide` prop)
//
// Heading variants:
//   default   → 18px Poppins (most sections)
//   prototype → 38px Playfair, set via `headingVariant="prototype"` on
//               CaseStudySection, or className `cs-section-head-prototype`.

import Image from "next/image";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import CaseStudyPhase from "../components/case-study/CaseStudyPhase";
import CaseStudySection from "../components/case-study/CaseStudySection";
import CaseStudyImage from "../components/case-study/CaseStudyImage";
import CaseStudyGallery from "../components/case-study/CaseStudyGallery";
import CaseStudyList from "../components/case-study/CaseStudyList";
import CaseStudyVideo from "../components/case-study/CaseStudyVideo";
// import { projectImages as img } from "./images";

export default function CaseStudyTemplate() {
  return (
    // Add a matching `.cs-theme-<slug>` rule in globals.css if the project
    // needs custom brand tokens (--cs-brand-dark, --cs-accent-bg, etc).
    <main className="w-full cs-theme-template">
      <SiteNav active="case-study" />

      <CaseStudyHero
        title={
          <>
            One-line punchy
            <br />
            project headline
          </>
        }
      />

      {/* ─── Overview block ─── */}
      <section className="cs-container-wide pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-20 lg:gap-32">
          <div>
            <h3 className="cs-overview-head">Project overview</h3>
            <p className="mt-4 cs-overview-body">One-paragraph intro.</p>
          </div>
          <div>
            <h3 className="cs-overview-head">My role</h3>
            <p className="mt-4 cs-overview-body">
              <strong>Role title | Company</strong>
            </p>
            <p className="mt-3 cs-overview-body">
              Comma, separated, responsibilities.
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">Duration</h3>
            <p className="mt-4 cs-overview-body">Mon YYYY – Mon YYYY</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="cs-overview-head">Client</h3>
          {/*
          <Image
            src={img.clientLogo.src}
            alt="Client logo"
            width={img.clientLogo.width}
            height={img.clientLogo.height}
            className="h-auto w-auto max-w-[240px]"
          />
          */}
        </div>
      </section>

      {/* ─── Intro band — brand-color strip ─── */}
      <section className="cs-intro-band">
        <div className="cs-container">
          <h2 className="cs-intro-label">Intro</h2>

          <h3 className="cs-section-head mt-8">Project overview</h3>
          <div className="mt-5 cs-prose">
            <p>Multi-paragraph framing of the problem space.</p>
          </div>

          <h3 className="cs-section-head mt-10">Business goals</h3>
          <div className="mt-5 cs-prose">
            <CaseStudyList items={["Goal 1", "Goal 2", "Goal 3"]} />
          </div>
        </div>
      </section>

      <CaseStudySection heading="Design process">
        <p>
          Approach paragraph — design thinking, double-diamond, lean UX, etc.
        </p>
      </CaseStudySection>

      {/* ─── Discover ─── */}
      <CaseStudyPhase label="Discover" />

      <CaseStudySection heading="Research / Discovery section">
        <p>Section copy.</p>
      </CaseStudySection>
      {/* <CaseStudyImage {...img.someAsset} alt="…" caption="…" /> */}

      {/* ─── Define ─── */}
      <CaseStudyPhase label="Define" />

      <CaseStudySection heading="Persona / Problem framing">
        <p>Section copy.</p>
      </CaseStudySection>

      {/* ─── Ideate ─── */}
      <CaseStudyPhase label="Ideate" />

      <CaseStudySection heading="Flows / Architecture">
        <p>Section copy.</p>
      </CaseStudySection>

      {/* ─── Design ─── */}
      <CaseStudyPhase label="Design" />

      <CaseStudySection heading="Wireframes / Visuals">
        <p>Section copy.</p>
      </CaseStudySection>
      <CaseStudyGallery
        items={[
          { alt: "First artefact" },
          { alt: "Second artefact" },
        ]}
        cols={2}
      />

      {/*
      Ad-hoc layouts — write inline, vary per case study. Examples below:

      ─ Two-column phone-mockup (mobile video LEFT, body RIGHT):
        <div className="cs-container mt-12 sm:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="flex justify-center md:justify-start">
              <figure className="cs-figure mt-0" style={{ maxWidth: "320px" }}>
                <video src="…" autoPlay loop muted playsInline
                  style={{ aspectRatio: "9 / 16" }} />
              </figure>
            </div>
            <div>
              <h2 className="cs-section-head-prototype">Section title</h2>
              <div className="cs-prose mt-3"><p>Body…</p></div>
            </div>
          </div>
        </div>

      ─ Dark-band image wrapper (used for hi-fi reveals, heatmaps):
        <div className="w-full py-10 sm:py-14 [&>figure]:mt-0"
             style={{ background: "#54595F" }}>
          <CaseStudyImage {...img.hifiMobile} alt="…" wide />
        </div>

      ─ Italic gray note (live-site quirks, footnotes):
        <div className="cs-container mt-8">
          <p style={{ fontStyle: "italic", fontSize: "15px",
                      lineHeight: "24px", color: "rgba(0,0,0,0.45)" }}>
            small note text
          </p>
        </div>

      ─ Centered Playfair heading (above a focal asset):
        <section className="cs-container pt-12 sm:pt-16 text-center">
          <h3 className="cs-section-head-prototype">Heading text</h3>
        </section>

      ─ Insight quote list (under user interviews):
        <div className="cs-insights mt-4 space-y-4">
          {quotes.map((q, i) => (
            <blockquote key={i} className="cs-insight-quote">“{q}”</blockquote>
          ))}
        </div>
      */}

      <CaseStudySection heading="Disclaimer">
        <p>Closing remarks. Credits inline if needed.</p>
      </CaseStudySection>

      <div className="pb-16 sm:pb-24" />
      <SiteFooter />
    </main>
  );
}
