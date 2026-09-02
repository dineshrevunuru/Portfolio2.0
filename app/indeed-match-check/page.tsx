import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import { PrototypeEmbed } from "./prototype-embed";
import styles from "./indeed-case-study.module.css";

export const metadata: Metadata = {
  title: "Before a hiring rule removes someone — a Match Check concept | Dinesh Revunuru",
  description:
    "A recruiter tightens one Required qualification on a live job. I designed and built the moment that shows them who it removes, and what their own job post still promises.",
  // Addressed to one company. Not for the index.
  robots: { index: false, follow: false },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cs-container mt-16 sm:mt-24">
      <h2 className="cs-section-head">{title}</h2>
      <div className="cs-prose mt-5">{children}</div>
    </section>
  );
}

/** Where the two documents come apart. Words carry it; the diagram confirms it. */
function DriftDiagram() {
  return (
    <figure className={`${styles.flowFigure} mt-8`}>
      <div className={styles.chartViewport}>
        <svg
          className={styles.chart}
          viewBox="0 0 980 300"
          role="img"
          aria-labelledby="drift-title drift-desc"
        >
          <title id="drift-title">How a job post and its screening rule come apart</title>
          <desc id="drift-desc">
            A recruiter publishes a job description and sets applicant qualifications at the
            same time, so the two agree. Later the recruiter edits only the qualification,
            raising a Required threshold. The job description is a separate field and does not
            change with it. Applicants who do not meet the new Required answer are moved to the
            Rejected list, while the description continues to promise something else. Nothing in
            the flow shows the recruiter that the two no longer agree.
          </desc>
          <defs>
            <marker id="mc-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0 0 L9 4.5 L0 9 Z" className={styles.chartArrow} />
            </marker>
          </defs>

          {/* Row 1 — the two artefacts, born aligned */}
          <rect x="14" y="30" width="210" height="66" rx="10" className={styles.chartBox} />
          <text x="34" y="58" className={styles.chartLabel}>Job description</text>
          <text x="34" y="78" className={styles.chartSub}>What candidates read</text>

          <rect x="14" y="176" width="210" height="66" rx="10" className={styles.chartBox} />
          <text x="34" y="204" className={styles.chartLabel}>Applicant qualifications</text>
          <text x="34" y="224" className={styles.chartSub}>What actually filters</text>

          <path d="M224 63 H300" className={styles.chartConnector} markerEnd="url(#mc-arrow)" />
          <path d="M224 209 H300" className={styles.chartConnector} markerEnd="url(#mc-arrow)" />

          {/* Row 2 — one of them is edited */}
          <rect x="300" y="30" width="220" height="66" rx="10" className={styles.chartBoxMuted} />
          <text x="320" y="58" className={styles.chartLabel}>Left as published</text>
          <text x="320" y="78" className={styles.chartSub}>&ldquo;we hire for trajectory&rdquo;</text>

          <rect x="300" y="176" width="220" height="66" rx="10" className={styles.chartBox} />
          <text x="320" y="204" className={styles.chartLabel}>Edited later</text>
          <text x="320" y="224" className={styles.chartSub}>Required raised 2 &rarr; 5 years</text>

          {/* the gap */}
          <path d="M410 100 V170" className={styles.chartConnector} strokeDasharray="5 5" />
          <text x="424" y="140" className={styles.chartGapLabel}>no link between them</text>

          <path d="M520 209 H596" className={styles.chartConnector} markerEnd="url(#mc-arrow)" />

          {/* Row 3 — the consequence */}
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
      <figcaption className="cs-caption mt-3">
        The two documents are created together and edited apart. Everything downstream follows
        from that.
      </figcaption>
    </figure>
  );
}

export default function IndeedMatchCheckCaseStudy() {
  return (
    <>
      <SiteNav />
      <main className="cs-theme-indeed">
        <CaseStudyHero
          eyebrow="Independent concept · Indeed"
          title={
            <>
              Before a hiring rule removes someone,{" "}
              <br />
              show who it removes.
            </>
          }
          subtitle="A recruiter tightens one Required qualification on a live job. I designed and built the moment that shows them who that change removes, and what their own job post is still promising."
        />

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
                Four-hour build, in Indeed&rsquo;s employer design language. I directed AI agents
                for research, implementation and adversarial review; the problem, the scope and
                the product decisions are mine, and I ruled on every critique.
              </p>
            </div>
            <div>
              <h3 className="cs-overview-head">Quick link</h3>
              <p className="mt-4 cs-overview-body">
                <a href="#prototype">Open the prototype</a>
              </p>
            </div>
          </div>
          <p className="cs-caption mt-10">
            Not affiliated with Indeed. Based on public product references. The employer,
            applicants and every number shown in the prototype are fictional.
          </p>
        </section>

        <Section title="A small edit can change who gets seen">
          <p>
            I found Indeed through its UX Designer opening. The role asks for designers who can
            make complex flows legible across both the employer and the job-seeker journey. I
            went looking for one moment where those two journeys are the same decision, seen
            from opposite sides.
          </p>
          <p>
            A recruiter writes the job description candidates use to decide whether to apply.
            Separately, in the same Edit Job form, they set the applicant qualifications that
            decide who stays in the pool. Those are two different fields. Changing one does not
            change the other, and Indeed&rsquo;s guidance is explicit about what the rule then
            does: <em>&ldquo;Applicants who don&rsquo;t meet a required screener question are
            automatically moved to your Rejected list in the Employer Dashboard.&rdquo;</em>
          </p>
          <p>So the question I wanted to answer:</p>
          <blockquote className="cs-insight-quote">
            How might Indeed show a recruiter who a Required qualification removes, and whether
            that rule still matches the job description, before they save it?
          </blockquote>
        </Section>

        <Section title="The recruiter owns two versions of the same decision">
          <p>
            I worked to an in-house recruiter at a company of 50 to 500 people, hiring one
            specialised role, with more applicants than screening time. Their job is not only to
            attract people. It is to keep the public promise and the private filter saying the
            same thing.
          </p>
          <p>
            This is a documented mechanism, not a measured frequency. I had no authenticated
            employer account, and I have not measured how often recruiters actually create this
            mismatch.
          </p>
          <DriftDiagram />
        </Section>

        <Section title="I chose the edit moment, not another dashboard">
          <p>
            Indeed already lets recruiters review who was rejected. But a review pile is a
            recovery mechanism: it asks a recruiter with no spare time to go and discover a
            problem after the rule has already acted. The cheapest place to prevent the error is
            the moment it is created.
          </p>
          <p>My hypothesis:</p>
          <blockquote className="cs-insight-quote">
            If Indeed compares Required applicant qualifications against the live job description
            while a recruiter is editing them, recruiters will notice and resolve more harmful
            mismatches before applicants are affected &mdash; without wrongly relaxing legitimate
            must-haves.
          </blockquote>
          <p>
            That second half is the part I care about. A system could report a perfect resolution
            rate simply because recruiters turned every Required rule into Preferred to make the
            warnings go away. That would clear the screen and make screening worse.
          </p>
        </Section>

        <Section title="The prototype turns an invisible consequence into a visible decision">
          <p>
            The scenario is a fictional Product Designer, Design Systems role at Northline
            Health, live for 21 days. Its description tells candidates:
          </p>
          <blockquote className="cs-insight-quote">
            &ldquo;We care more about how you think than how long you&rsquo;ve been doing it
            &mdash; if you&rsquo;ve shipped and maintained a component library at any scale,
            we&rsquo;ll help you grow into the systems strategy work.&rdquo;
          </blockquote>
          <p>
            The Experience question has been collecting answers since the job went live. It asks
            for two years. The recruiter raises it to five.
          </p>
          <p>
            Match Check answers in place: <strong>41 people already in the Reviewed list
            answered two to four years</strong>, and they will move to Rejected. It puts the
            recruiter&rsquo;s own sentence beside the rule that now contradicts it. The question
            has collected 128 answers in total, and every count is derived from the
            prototype&rsquo;s fictional distribution rather than typed in &mdash; a concept about
            systems deciding quietly should not invent its own headline number.
          </p>
          <p>
            It does not claim those 41 people were qualified. It claims only that a rule removed
            them, and that the job post said something else.
          </p>
        </Section>

        <Section title="Resolution stays where the decision already is">
          <p>
            The primary action is deliberately small: <strong>Make this Preferred instead.</strong>{" "}
            Preferred keeps the signal and keeps the person &mdash; Indeed&rsquo;s own guidance is
            that a preferred question labels a candidate rather than removing them. The recruiter
            can also apply the higher bar only to new applicants, or keep it Required and record
            why.
          </p>
          <p>
            Keeping a mismatch never produces a green success state. The rule still counts as
            exclusionary and the interface keeps saying so. Trying to save with unresolved
            Required mismatches opens a confirmation that states what will happen and offers a
            way back. The goal is not to make the decision. It is to make the consequence hard to
            miss.
          </p>
        </Section>

        <Section title="The system also has to know when to stay quiet">
          <p>
            A detector that flags every difference becomes another banner people learn to ignore.
            So the concept separates three things a difference can be, and says which one it is
            in words rather than colour: a Required rule that <em>contradicts</em> the post, a
            Required rule the post never <em>mentions</em>, and a difference that is genuinely
            <em> ambiguous</em> and needs a person&rsquo;s judgement.
          </p>
          <p>
            The checks are deterministic rules over structured qualifications and pre-tagged
            description claims. The interface says so, in those words: it is not AI, it does not
            read arbitrary prose, and it is not a fairness or compliance audit. When it has
            nothing to say it says only that it found nothing{" "}
            <em>in the qualifications it checked</em>.
          </p>
        </Section>

        <section className="cs-container mt-16 sm:mt-24" id="prototype">
          <h2 className="cs-section-head">Try it</h2>
          <div className="cs-prose mt-5">
            <p>
              Built in Next.js so the states could be tested as behaviour rather than argued over
              as static screens. Raise the Experience requirement and watch the count change;
              switch it to Preferred and watch the warning resolve honestly.
            </p>
          </div>
          <div className="mt-8">
            <PrototypeEmbed />
          </div>
        </section>

        <Section title="The first visual pass looked branded, not native">
          <p>
            My first build used verified Indeed colours and tokens and still looked wrong. I had
            taken the palette from a marketing page and never seen the employer product, so the
            page structure underneath was invented: a grey canvas, no application shell, pill
            controls, uppercase micro-labels.
          </p>
          <p>
            I threw it away and rebuilt the visual contract from public references to the real
            Edit Job and Applicant Qualifications screens: white canvas, the employer top bar, the
            left section navigation, qualification cards, stacked Required and Preferred controls,
            and a fixed Save Changes footer. I then checked the result element by element against
            live computed styles from Indeed&rsquo;s own pages rather than trusting my eye.
          </p>
          <p>
            Two differences are deliberate. Indeed Sans and the Indeed logo are not licensed for
            public use, so the prototype ships self-hosted Noto Sans and a typeset wordmark. It is
            layout- and token-matched, never pixel-identical, and I would rather say that than
            imply otherwise.
          </p>
        </Section>

        <Section title="The first test is comprehension, not preference">
          <p>
            This has been technically and adversarially reviewed. It has not been tested with
            recruiters. Here is the first study I would run:
          </p>
          <blockquote className="cs-insight-quote">
            &ldquo;This job has been live for 21 days. The hiring manager asks you to raise the
            experience requirement from two to five years. Make that change as you normally would,
            and save it.&rdquo;
          </blockquote>
          <p>Then I would watch for whether the recruiter:</p>
          <ul className="cs-list cs-list--bulleted">
            <li>notices the mismatch without being prompted;</li>
            <li>can say what the post promises and what the rule now does;</li>
            <li>understands what happens to existing applicants and to new ones;</li>
            <li>picks a resolution that matches their actual hiring intent;</li>
            <li>understands that keeping it Required preserves the exclusion;</li>
            <li>does not relax a real must-have just to clear the warning.</li>
          </ul>
          <p>
            Five recruiters, at least three of them in-house at 50-to-500-person companies. That
            is directional evidence about comprehension, not a measurement of how often the
            problem occurs.
          </p>
        </Section>

        <Section title="What this would be worth, stated as a hypothesis">
          <p>
            If it shipped, I would measure whether fewer applicants are excluded by requirements
            the post contradicts or never states, whether recruiters restore fewer applications
            from Rejected, and whether criteria get edited less after the first batch of
            applicants arrives.
          </p>
          <p>The chain I am willing to defend is a narrow one:</p>
          <blockquote className="cs-insight-quote">
            Better input alignment &rarr; fewer avoidable exclusions and misleading applications
            &rarr; a more usable candidate pool &rarr; stronger perceived employer value.
          </blockquote>
          <p>
            This work does not show that Match Check improves candidate quality, hiring outcomes
            or revenue. Those need product data and a baseline I do not have.
          </p>
        </Section>

        <Section title="Why this is the work I want">
          <p>
            The UX Designer role sits where complex flows, both sides of a marketplace,
            accessibility, design systems and AI-assisted experiences meet. Match Check touches
            all of that without handing the hiring decision to the system.
          </p>
          <p>
            I have moved from running my own design studio, to enterprise UX at Neudesic, an IBM
            company, to designing and shipping AI products in code. What I want to keep doing is
            product work where a system&rsquo;s behaviour has to be understandable before anyone
            can reasonably trust it.
          </p>
        </Section>

        <Section title="Evidence and limits">
          <ul className="cs-list cs-list--bulleted">
            <li>
              A forward-looking independent concept, not a claim about what Indeed ships. Public
              documentation shows no surface that reconciles a job post with its screening rules
              at the edit moment &mdash; that is an observation about public documentation, not a
              claim that Indeed lacks one.
            </li>
            <li>
              <strong>The falsifier:</strong> if the authenticated Edit Job flow already reconciles
              these two surfaces, this concept is redundant, and that would be worth knowing.
            </li>
            <li>
              Indeed publishes what a Required and a Preferred qualification do to an applicant. I
              did not find public documentation of whether editing a qualification leaves the job
              description untouched; in the prototype I treat them as the separate fields they
              appear to be, and I would confirm that inside the product.
            </li>
            <li>The recruiter segment is a working persona, not one validated through interviews.</li>
            <li>How often this mismatch actually happens is unknown.</li>
            <li>
              Northline Health, the role, the applicants and every count are fictional sample
              data.
            </li>
            <li>
              Match Check is a reconciliation aid. It is not a fairness, compliance or
              job-relatedness audit.
            </li>
            <li>Recruiter testing has not been run.</li>
          </ul>
          <p className="mt-6">
            <strong>Sources:</strong>{" "}
            <a
              href="https://careers-indeed.icims.com/jobs/47125/ux-designer/job"
              target="_blank"
              rel="noreferrer"
            >
              the role
            </a>
            ,{" "}
            <a
              href="https://www.indeed.com/hire/resources/howtohub/how-to-use-screener-questions-on-indeed"
              target="_blank"
              rel="noreferrer"
            >
              Indeed on screener questions
            </a>
            , and{" "}
            <a
              href="https://www.indeed.com/help/employers/articles/setting-up-screening-criteria?co=US&hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Indeed on screening criteria
            </a>
            . All verified between 30 August and 2 September 2026.
          </p>
        </Section>

        <div className="mt-24" />
      </main>
      <SiteFooter />
    </>
  );
}
