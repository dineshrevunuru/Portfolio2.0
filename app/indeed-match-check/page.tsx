import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import styles from "./indeed-case-study.module.css";

export const metadata: Metadata = {
  title: "Before a hiring rule removes someone — a Match Check concept | Dinesh Revunuru",
  description:
    "A recruiter tightens one Required qualification on a live job. I designed and built the moment that shows them who it removes, and what their own job post still promises.",
  // Addressed to one company. Not for the index.
  robots: { index: false, follow: false },
};

const externalLinkProps = { target: "_blank", rel: "noreferrer" } as const;

// Same type as the Mate case, whose scale this page borrows.
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-opensans",
  display: "swap",
});

const IMG = "/images/indeed-match-check";
// Same-origin static bundle at public/indeed-match-check-prototype.
const PROTOTYPE_URL = "/indeed-match-check-prototype/index.html";

function StorySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/** A screen from the prototype on the shared stage. */
function Screen({
  src,
  width,
  height,
  alt,
  caption,
  flush = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  flush?: boolean;
}) {
  return (
    <figure className={styles.designMedia}>
      <div className={`${styles.shotStage} ${flush ? styles.shotFlush : ""}`}>
        <Image
          src={`${IMG}/${src}`}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 900px) 100vw, 840px"
        />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** Where the two documents come apart. */
function DriftDiagram() {
  return (
    <div className={styles.chartViewport}>
      <svg
        className={styles.chart}
        viewBox="0 0 980 300"
        role="img"
        aria-labelledby="drift-title drift-desc"
      >
        <title id="drift-title">How a job post and its screening rule come apart</title>
        <desc id="drift-desc">
          A job description and its applicant qualifications are created together. Later only
          the qualification is edited, raising a Required threshold. The description does not
          change with it. Applicants below the new bar are moved to Rejected while the
          description still promises the opposite, and nothing shows the recruiter the gap.
        </desc>
        <defs>
          <marker id="mc-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 Z" className={styles.chartArrow} />
          </marker>
        </defs>

        <rect x="14" y="30" width="210" height="66" rx="10" className={styles.chartBox} />
        <text x="34" y="58" className={styles.chartLabel}>Job description</text>
        <text x="34" y="78" className={styles.chartSub}>What candidates read</text>

        <rect x="14" y="176" width="210" height="66" rx="10" className={styles.chartBox} />
        <text x="34" y="204" className={styles.chartLabel}>Applicant qualifications</text>
        <text x="34" y="224" className={styles.chartSub}>What actually filters</text>

        <path d="M224 63 H300" className={styles.chartConnector} markerEnd="url(#mc-arrow)" />
        <path d="M224 209 H300" className={styles.chartConnector} markerEnd="url(#mc-arrow)" />

        <rect x="300" y="30" width="220" height="66" rx="10" className={styles.chartBoxMuted} />
        <text x="320" y="58" className={styles.chartLabel}>Left as published</text>
        <text x="320" y="78" className={styles.chartSub}>&ldquo;we hire for trajectory&rdquo;</text>

        <rect x="300" y="176" width="220" height="66" rx="10" className={styles.chartBox} />
        <text x="320" y="204" className={styles.chartLabel}>Edited later</text>
        <text x="320" y="224" className={styles.chartSub}>Required raised 2 &rarr; 5 years</text>

        <path d="M410 100 V170" className={styles.chartConnector} strokeDasharray="5 5" />
        <text x="424" y="140" className={styles.chartGapLabel}>no link between them</text>

        <path d="M520 209 H596" className={styles.chartConnector} markerEnd="url(#mc-arrow)" />

        <rect x="596" y="176" width="220" height="66" rx="10" className={styles.chartBoxAlert} />
        <text x="616" y="204" className={styles.chartLabel}>41 applicants</text>
        <text x="616" y="224" className={styles.chartSub}>moved to Rejected</text>

        <rect x="596" y="30" width="220" height="66" rx="10" className={styles.chartBoxMuted} />
        <text x="616" y="58" className={styles.chartLabel}>Post still promises</text>
        <text x="616" y="78" className={styles.chartSub}>the opposite</text>

        <path d="M816 209 H892" className={styles.chartConnector} markerEnd="url(#mc-arrow)" />
        <rect x="836" y="176" width="130" height="66" rx="10" className={styles.chartBoxMuted} />
        <text x="856" y="204" className={styles.chartLabel}>Found later</text>
        <text x="856" y="224" className={styles.chartSub}>if at all</text>
      </svg>
    </div>
  );
}

export default function IndeedMatchCheckCaseStudy() {
  return (
    <main className={`${styles.page} cs-theme-indeed ${openSans.variable}`}>
      <SiteNav />

      <CaseStudyHero
        title={
          <>
            Before a hiring rule removes someone,{" "}
            <br />
            show who it removes.
          </>
        }
      />

      {/* Overview — the house pattern: three fields on the wide rail. */}
      <section className="cs-container-wide">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16 lg:gap-24">
          <div>
            <h3 className="cs-overview-head">What I did</h3>
            <p className="mt-4 cs-overview-body">
              Product direction, interaction design, and the working build
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">How it was made</h3>
            <p className="mt-4 cs-overview-body">
              Four-hour build in Indeed&rsquo;s employer design language, directing AI agents for
              research, implementation and adversarial review. The decisions are mine.
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">Quick link</h3>
            <p className="mt-4 cs-overview-body">
              <a href="#prototype">Interactive prototype</a>
            </p>
          </div>
        </div>
      </section>

      {/* Full-bleed hero: edge to edge, square corners, same as the Mate case. */}
      <figure className={`${styles.heroMedia} mt-8 sm:mt-12`}>
        <Image
          src={`${IMG}/hero-full.png`}
          alt="Indeed's Edit Job page. The Experience qualification has been raised to 5 years and marked Required. Beneath it, a red callout reads: This requirement contradicts your job description. 41 people already in your Reviewed list answered 2–4 years and will be moved to Rejected. The job description's own sentence is quoted underneath, with the options Make this Preferred instead and Keep as Required."
          width={2880}
          height={1560}
          priority
          sizes="100vw"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <figcaption className={styles.heroCaption}>
          Independent concept. Not affiliated with Indeed; based on public product references. The
          employer, applicants and every number shown are fictional.
        </figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="How did it start?">
          <p>
            I found Indeed through the UX Designer role. It asks for someone who can make complex
            flows legible on both sides of the marketplace.
          </p>
          <p className={styles.lead}>
            So I went looking for one moment where the employer and the job seeker are looking at
            the same decision from opposite sides.
          </p>
        </StorySection>

        <StorySection title="The problem">
          <p className={styles.statement}>
            When a recruiter tightens a Required qualification on a live job, they can&rsquo;t see
            who it removes &mdash;
            <br />
            <mark>or that their own job post still promises the opposite.</mark>
          </p>
          <p>
            The job description candidates read and the qualifications that filter them are
            separate fields in the same Edit Job form. Editing one does nothing to the other.
          </p>
          <p>
            Indeed is explicit about what a Required rule does: <em>&ldquo;Applicants who
            don&rsquo;t meet a required screener question are automatically moved to your Rejected
            list.&rdquo;</em>
          </p>
        </StorySection>
      </article>

      <section className={styles.flowStage} aria-label="How the job post and its rule drift apart">
        <p className={styles.flowEyebrow}>Created together · edited apart</p>
        <DriftDiagram />
        <p className={styles.mediaCaption}>
          Nothing in the flow shows the recruiter that the two no longer agree.
        </p>
      </section>

      <article className={styles.story}>
        <StorySection title="Who this is for">
          <p>Two people on opposite sides of the same sentence, and only one can see the rule.</p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="Primary and secondary persona">
        <div className={styles.personaCard}>
          <div>
            <p className={styles.cardLabel}>Primary</p>
            <h2>In-house recruiter, 50-to-500-person company</h2>
            <p>Hiring one specialised role, with more applicants than screening time.</p>
            <div className={styles.sees}>
              <span className={styles.seesLabel}>Sees</span>
              <span className={styles.chip}>Job post</span>
              <span className={styles.chip}>Qualifications</span>
              <span className={`${styles.chip} ${styles.chipNo}`}>Who a rule removes</span>
            </div>
          </div>
          <div>
            <p className={styles.cardLabel}>Secondary</p>
            <h2>The job seeker reading that post</h2>
            <p>Deciding whether to apply on a promise they expect to be honoured.</p>
            <div className={styles.sees}>
              <span className={styles.seesLabel}>Sees</span>
              <span className={styles.chip}>Job post</span>
              <span className={`${styles.chip} ${styles.chipNo}`}>Qualifications</span>
              <span className={`${styles.chip} ${styles.chipNo}`}>Who a rule removes</span>
            </div>
          </div>
        </div>
        <p className={styles.mediaCaption}>
          Working personas, not interviewed. The volume evidence behind the recruiter comes from
          500+-employee firms, a different segment.
        </p>
      </section>

      <article className={styles.story}>
        <StorySection title="The hypothesis">
          <p className={styles.statement}>
            If Indeed checks Required qualifications against the live post while a recruiter edits
            them, more harmful mismatches get resolved before applicants are affected &mdash;
            <br />
            <mark>without relaxing legitimate must-haves just to clear a warning.</mark>
          </p>
          <p>
            The second half is the guardrail. A screen that goes green because every Required
            became Preferred has made screening worse.
          </p>
          <p>
            And the edit moment, not a review dashboard, because a review pile finds the problem
            after the rule has acted.
          </p>
        </StorySection>

        <StorySection title="What Match Check does">
          <p>
            A fictional role, live for 21 days, 128 answers to its Experience question. The
            recruiter raises the minimum from two years to five.
          </p>
          <p>
            Match Check answers in place: 41 people you already reviewed will move to Rejected, and
            here is your own sentence that says otherwise.
          </p>
        </StorySection>
      </article>

      <Screen
        src="02-conflict.png"
        width={1236}
        height={1350}
        alt="The Experience qualification card at 5 years, Required. A red callout reads: This requirement contradicts your job description. You raised the minimum from 2 to 5 years. 41 people already in your Reviewed list answered 2–4 years and will be moved to Rejected. The post's sentence is quoted, followed by Apply this change to: Everyone who applied + new applicants, or New applicants only."
        caption="The count is derived from the fixture's per-year distribution, never typed in. It does not claim the 41 were qualified — only that a rule removed them and the post said something else."
      />

      <article className={styles.story}>
        <StorySection title="It says which kind of difference it found">
          <p>
            Flag every difference and it becomes a banner people learn to ignore. So it names three
            cases, in words rather than colour.
          </p>
        </StorySection>
      </article>

      <Screen
        src="02b-not-mentioned.png"
        width={1236}
        height={808}
        alt="The Education qualification card, Bachelor's degree, Required. A callout reads: This requirement isn't mentioned in your job description. Candidates can't see this requirement in your post, so they can't tell they'll be filtered on it."
        caption="Not mentioned. Candidates are filtered on something the post never told them. (Contradicts is the state shown above.)"
      />
      <Screen
        src="06-screening.png"
        width={1320}
        height={1552}
        alt="A custom screening question, Have you worked in a React codebase, with an amber callout: Possible difference from your job description — needs your judgment. The post's sentence about partnering with engineers is quoted, and the only action is Mark as reviewed."
        caption="Ambiguous. The post gestures at it without requiring it, so the only action offered is a person's judgement."
      />

      <article className={styles.story}>
        <StorySection title="Resolving it never produces a green light">
          <p>
            The primary action is small: <strong>Make this Preferred instead</strong> keeps the
            signal and keeps the person. The recruiter can also limit the bar to new applicants, or
            keep it Required and say why.
          </p>
          <p>Keeping it never clears the flag.</p>
        </StorySection>
      </article>

      <Screen
        src="03-preferred.png"
        width={1236}
        height={560}
        alt="The Experience card after choosing Make this Preferred instead: 5 years is still set, Preferred is selected, and the callout is gone."
        caption="Preferred keeps the five-year signal and keeps the 41 people in the pool, labelled."
      />
      <Screen
        src="04-save-dialog.png"
        width={1248}
        height={882}
        alt="A dialog: Save with unresolved differences? 1 of your Required qualifications contradicts what your job description promises, and 1 is not mentioned in it at all. If you save now, applicants will be moved to Rejected on those bases. 41 people already in your Reviewed list will be moved to Rejected. Buttons: Review differences, Save anyway."
        caption="Saving with open Required mismatches states the consequence and offers a way back."
      />
      <Screen
        src="05-saved.png"
        width={1320}
        height={132}
        alt="An amber status at the top of the page: Saved. 2 required qualifications still auto-reject applicants — 41 already-applied people moved to Rejected."
        caption="Saved anyway. The status says what is still true; it does not congratulate."
      />

      <article className={styles.story}>
        <StorySection title="And when it has nothing to say, it says only that">
          <p>
            Fixed rules over structured qualifications and pre-tagged sentences &mdash; not AI, not
            a fairness audit, and the interface says so.
          </p>
          <p>Its empty state is scoped to what it actually checked.</p>
        </StorySection>
      </article>

      <Screen
        src="07-quiet-footer.png"
        width={2416}
        height={138}
        alt="The Save footer reading: No differences found in the qualifications checked."
        caption="No green tick, no “all clear”. Just the boundary of what was checked."
        flush
      />

      <article className={styles.story}>
        <StorySection title="Prototype in React">
          <p>
            Raise the Experience requirement and watch the count change; switch it to Preferred and
            watch the warning resolve honestly.
          </p>
        </StorySection>
      </article>

      {/* Interactive prototype — same-origin bundle in a bounded browser frame.
          The frame is the boundary: Indeed's design language stays inside it. */}
      <figure
        id="prototype"
        className="cs-container-full mt-2 sm:mt-4"
        style={{ scrollMarginTop: "90px" }}
      >
        <div className={styles.prototypeFrame}>
          <div className={styles.prototypeBar} aria-hidden="true">
            <span />
            <span />
            <span />
            <p>Interactive concept · not affiliated with Indeed · fictional data</p>
          </div>
          <iframe
            src={PROTOTYPE_URL}
            title="Match Check — interactive concept prototype"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className={styles.prototypeIframe}
          />
        </div>
        <figcaption className={styles.prototypeCaption}>
          Live prototype. Raise the requirement, watch who it removes, resolve it.{" "}
          <a href={PROTOTYPE_URL} {...externalLinkProps}>
            Open full screen &#8599;
          </a>
        </figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="The first pass looked branded, not native">
          <p>
            My first build put verified Indeed tokens on an invented page structure. I threw it
            away, rebuilt from public references to the real Edit Job screens, and checked it
            element by element against live computed styles.
          </p>
          <p className={styles.smallPrint}>
            Indeed Sans and the logo are not licensed, so it ships Noto Sans and a typeset wordmark:
            token-matched, not pixel-identical.
          </p>
        </StorySection>

        <StorySection title="What I would test first">
          <p>
            Adversarially reviewed, not yet tested with recruiters. Five recruiters, one task,
            watching for comprehension rather than preference:
          </p>
          <p className={styles.lead}>
            &ldquo;This job has been live for 21 days. The hiring manager asks you to raise the
            experience requirement from two to five years. Make that change as you normally would,
            and save it.&rdquo;
          </p>
          <ul>
            <li>Do they notice the mismatch unprompted?</li>
            <li>Do they understand what happens to existing applicants versus new ones?</li>
            <li>Do they keep a real must-have Required rather than relaxing it to clear the warning?</li>
          </ul>
          <p>
            If it shipped: fewer applicants excluded by requirements the post contradicts, fewer
            restores from Rejected, fewer criteria edits after the first batch arrives.
          </p>
        </StorySection>

        <StorySection title="Evidence and limits">
          <ul className={styles.smallPrintList}>
            <li>
              Public documentation shows no surface that reconciles a post with its rules at the
              edit moment. That is an observation about documentation, not a claim that Indeed
              lacks one. <strong>The falsifier:</strong> if the authenticated Edit Job flow already
              does this, the concept is redundant.
            </li>
            <li>
              Indeed documents what Required and Preferred do to an applicant, not whether editing
              a qualification leaves the description untouched. I treat them as the separate
              fields they appear to be.
            </li>
            <li>The recruiter is a working persona. How often this mismatch happens is unknown.</li>
            <li>A reconciliation aid, not a fairness or job-relatedness audit. All data fictional.</li>
          </ul>
          <p className={styles.note}>
            <span>Sources</span>
            <a href="https://careers-indeed.icims.com/jobs/47125/ux-designer/job" {...externalLinkProps}>The role</a>
            {" · "}
            <a href="https://www.indeed.com/hire/resources/howtohub/how-to-use-screener-questions-on-indeed" {...externalLinkProps}>Indeed on screener questions</a>
            {" · "}
            <a href="https://www.indeed.com/help/employers/articles/setting-up-screening-criteria?co=US&hl=en" {...externalLinkProps}>Indeed on screening criteria</a>
            . Verified 30 August to 2 September 2026.
          </p>
        </StorySection>
      </article>

      <SiteFooter />
    </main>
  );
}
