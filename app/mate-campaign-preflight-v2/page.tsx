import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./mate-case-study.module.css";

export const metadata: Metadata = {
  title: "The moment before Approve — an independent Mate concept | Dinesh Revunuru",
  description:
    "I traced one cross-channel campaign decision, then designed and built a preflight to make it easier to understand.",
  robots: { index: false, follow: false },
};

const externalLinkProps = { target: "_blank", rel: "noreferrer" } as const;

function StorySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function CurrentHandoffChart() {
  return (
    <div className={styles.chartViewport}>
      <svg
        className={styles.chart}
        viewBox="0 0 1280 310"
        role="img"
        aria-labelledby="current-flow-title current-flow-description"
      >
        <title id="current-flow-title">Illustrative current cross-system handoff</title>
        <desc id="current-flow-description">
          A brand journey is active in Klaviyo, Checkmate proposes an audience, and the operator
          reaches approval. If the systems agree, protected shoppers are excluded. If the answer is
          unclear, protection needs confirmation through a manual cross-team handoff.
        </desc>
        <defs>
          <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" className={styles.chartArrow} />
          </marker>
        </defs>

        <path d="M206 155 H250" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M436 155 H480" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M666 155 H700" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M870 155 H905 V82 H930" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M870 155 H905 V238 H930" className={styles.chartConnector} markerEnd="url(#current-arrow)" />

        <g className={styles.chartNode}>
          <rect x="20" y="116" width="186" height="78" rx="16" />
          <text x="113" y="148" textAnchor="middle">
            <tspan x="113">Brand journey</tspan>
            <tspan x="113" dy="22">active in Klaviyo</tspan>
          </text>
        </g>
        <g className={styles.chartNode}>
          <rect x="250" y="116" width="186" height="78" rx="16" />
          <text x="343" y="148" textAnchor="middle">
            <tspan x="343">Checkmate proposes</tspan>
            <tspan x="343" dy="22">an audience</tspan>
          </text>
        </g>
        <g className={styles.chartNode}>
          <rect x="480" y="116" width="186" height="78" rx="16" />
          <text x="573" y="148" textAnchor="middle">
            <tspan x="573">Operator reaches</tspan>
            <tspan x="573" dy="22">Approve</tspan>
          </text>
        </g>

        <g className={styles.chartDecision}>
          <path d="M785 98 L870 155 L785 212 L700 155 Z" />
          <text x="785" y="149" textAnchor="middle">
            <tspan x="785">Do both systems</tspan>
            <tspan x="785" dy="21">agree?</tspan>
          </text>
        </g>
        <text x="892" y="78" className={styles.chartBranchLabel}>YES</text>
        <text x="882" y="235" className={styles.chartBranchLabel}>UNCLEAR</text>

        <g className={`${styles.chartNode} ${styles.chartNodeGreen}`}>
          <rect x="930" y="43" width="320" height="78" rx="16" />
          <text x="1090" y="75" textAnchor="middle">
            <tspan x="1090">Protected shoppers</tspan>
            <tspan x="1090" dy="22">already excluded</tspan>
          </text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="930" y="199" width="320" height="78" rx="16" />
          <text x="1090" y="231" textAnchor="middle">
            <tspan x="1090">Protection needs confirmation</tspan>
            <tspan x="1090" dy="22">across teams</tspan>
          </text>
        </g>
      </svg>

      <div className={styles.mobileFlow} aria-hidden="true">
        <div>Brand journey active in Klaviyo</div>
        <i />
        <div>Checkmate proposes an audience</div>
        <i />
        <div>Operator reaches Approve</div>
        <i />
        <div className={styles.mobileDecision}>Do both systems agree?</div>
        <div className={styles.mobileBranches}>
          <div className={styles.mobileGreen}><span>Yes</span>Protected shoppers already excluded</div>
          <div><span>Unclear</span>Protection needs confirmation</div>
        </div>
      </div>
    </div>
  );
}

function ProposedPreflightChart() {
  return (
    <div className={`${styles.chartViewport} ${styles.chartViewportBlue}`}>
      <svg
        className={styles.chart}
        viewBox="0 0 1320 350"
        role="img"
        aria-labelledby="proposed-flow-title proposed-flow-description"
      >
        <title id="proposed-flow-title">Proposed campaign preflight loop</title>
        <desc id="proposed-flow-description">
          Mate checks journey coverage before approval. Confirmed coverage leads to approval. Unclear
          coverage pauses the decision, lets the owner inspect and resolve the journey in Klaviyo,
          then rechecks the evidence in Mate.
        </desc>
        <defs>
          <marker id="proposed-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" className={styles.chartArrow} />
          </marker>
        </defs>

        <path d="M200 170 H245" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M425 170 H465" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M635 170 H665 V80 H700" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M635 170 H665 V260 H700" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M890 260 H925" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M1115 260 H1150" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M1245 221 V25 H550 V108" className={styles.chartLoop} markerEnd="url(#proposed-arrow)" />

        <g className={styles.chartNode}>
          <rect x="20" y="131" width="180" height="78" rx="16" />
          <text x="110" y="164" textAnchor="middle">
            <tspan x="110">Audience</tspan>
            <tspan x="110" dy="22">proposed</tspan>
          </text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="245" y="131" width="180" height="78" rx="16" />
          <text x="335" y="164" textAnchor="middle">
            <tspan x="335">Preflight checks</tspan>
            <tspan x="335" dy="22">coverage</tspan>
          </text>
        </g>
        <g className={styles.chartDecision}>
          <path d="M550 108 L635 170 L550 232 L465 170 Z" />
          <text x="550" y="164" textAnchor="middle">
            <tspan x="550">Coverage</tspan>
            <tspan x="550" dy="21">confirmed?</tspan>
          </text>
        </g>
        <text x="656" y="76" className={styles.chartBranchLabel}>YES</text>
        <text x="650" y="256" className={styles.chartBranchLabel}>NO</text>

        <g className={`${styles.chartNode} ${styles.chartNodeGreen}`}>
          <rect x="700" y="41" width="190" height="78" rx="16" />
          <text x="795" y="87" textAnchor="middle">Approve 299</text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="700" y="221" width="190" height="78" rx="16" />
          <text x="795" y="253" textAnchor="middle">
            <tspan x="795">Pause + inspect</tspan>
            <tspan x="795" dy="22">the journey</tspan>
          </text>
        </g>
        <g className={styles.chartNode}>
          <rect x="925" y="221" width="190" height="78" rx="16" />
          <text x="1020" y="253" textAnchor="middle">
            <tspan x="1020">Resolve in</tspan>
            <tspan x="1020" dy="22">Klaviyo</tspan>
          </text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="1150" y="221" width="170" height="78" rx="16" />
          <text x="1235" y="253" textAnchor="middle">
            <tspan x="1235">Recheck</tspan>
            <tspan x="1235" dy="22">in Mate</tspan>
          </text>
        </g>
      </svg>

      <div className={styles.mobileFlow} aria-hidden="true">
        <div>Audience proposed</div>
        <i />
        <div className={styles.mobileBlue}>Preflight checks coverage</div>
        <i />
        <div className={styles.mobileDecision}>Coverage confirmed?</div>
        <div className={styles.mobileBranches}>
          <div className={styles.mobileGreen}><span>Yes</span>Approve 299</div>
          <div><span>No</span>Pause + inspect → Resolve in Klaviyo → Recheck in Mate</div>
        </div>
      </div>
    </div>
  );
}

export default function MateCampaignPreflight() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Portfolio navigation">
        <Link href="/" className={styles.brand}>Rd<span>.</span></Link>
        <div>
          <Link href="/">Home</Link>
          <Link href="/resume">Resume</Link>
        </div>
      </nav>

      <header className={styles.hero}>
        <h1>I found one decision worth slowing down.</h1>
        <dl className={styles.meta}>
          <div>
            <dt>What I did</dt>
            <dd>Product design + front-end build</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>Figma, React, Next.js, TypeScript</dd>
          </div>
          <div>
            <dt>Quick link</dt>
            <dd><Link href="#prototype">Interactive prototype</Link></dd>
          </div>
        </dl>
      </header>

      <figure className={styles.heroMedia}>
        <Image
          src="/images/mate-campaign-preflight/hero-full.png"
          alt="Campaign preflight showing 340 proposed shoppers, 38 protected, 3 awaiting confirmation, and 299 eligible"
          width={1512}
          height={635}
          priority
          sizes="(max-width: 1512px) 100vw, 1512px"
        />
      </figure>

      <article className={styles.story}>
        <StorySection title="How did it start?">
          <p>
            I found Mate through the Design Engineer role. One approval decision kept pulling me
            deeper.
          </p>
          <p className={styles.lead}>
            So I traced it from audience to approval—and built the interaction I wanted to discuss.
          </p>
        </StorySection>

        <StorySection title="The problem">
          <p className={styles.statement}>
            What happens when a Checkmate campaign and a brand journey <mark>both want the same shopper?</mark>
          </p>
          <p>
            Mate documents stand-down setup inside Klaviyo or Attentive. The campaign decision
            happens in Mate. That makes approval a cross-system moment.
          </p>
        </StorySection>

        <aside className={styles.note}>
          <span>Evidence boundary</span>
          Public documentation confirms the handoff—not whether Mate&rsquo;s private dashboard already
          solves it. This is my proposal, not a missing-feature claim.
        </aside>

        <StorySection title="Who is making the call?">
          <p>
            A performance operator approves the campaign. A lifecycle marketer owns journey
            protection in Klaviyo. The decision sits between them.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="Primary user and collaborator">
        <div className={styles.personaCard}>
          <div>
            <p className={styles.cardLabel}>Primary user</p>
            <h2>Performance or growth operator</h2>
            <p>Owns the campaign decision in Mate.</p>
          </div>
          <div>
            <p className={styles.cardLabel}>Collaborator</p>
            <h2>Lifecycle or CRM marketer</h2>
            <p>Owns journey protection in Klaviyo.</p>
          </div>
        </div>
      </section>

      <article className={styles.story}>
        <StorySection title="A simple scenario">
          <p>
            Checkmate proposes <strong>340</strong> shoppers. <strong>41</strong> overlap with active
            journeys: <strong>38</strong> are protected and <strong>3</strong> are still unclear.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="Illustrative audience reconciliation">
        <div className={styles.mathCard}>
          <div><span>Proposed</span><strong>340</strong></div>
          <b aria-hidden="true">−</b>
          <div><span>Protected</span><strong>38</strong></div>
          <b aria-hidden="true">−</b>
          <div><span>Unclear</span><strong>3</strong></div>
          <b aria-hidden="true">=</b>
          <div><span>Eligible</span><strong>299</strong></div>
        </div>
        <p className={styles.mediaCaption}>Illustrative scenario · fictional data</p>
      </section>

      <article className={styles.story}>
        <StorySection title="Where the handoff gets fuzzy">
          <p>
            The operator reaches approval while the protection evidence lives in another system.
            If the answer is unclear, ownership moves between teams.
          </p>
        </StorySection>
      </article>

      <section className={styles.flowStage} aria-label="Current cross-system handoff">
        <p className={styles.flowEyebrow}>Current handoff · inferred from public documentation</p>
        <CurrentHandoffChart />
      </section>

      <article className={styles.story}>
        <StorySection title="My hypothesis">
          <p className={styles.lead}>
            Bring journey protection to the approval moment, so the operator can decide without
            rebuilding Klaviyo context from memory.
          </p>
        </StorySection>
      </article>

      <section className={`${styles.flowStage} ${styles.flowStageBlue}`} aria-label="Proposed preflight flow">
        <p className={styles.flowEyebrow}>Proposed preflight loop</p>
        <ProposedPreflightChart />
      </section>

      <article className={styles.story}>
        <StorySection title="What I designed">
          <p>
            One preflight, inside the existing approval moment. It shows what is protected, what is
            unclear, and who owns the next step.
          </p>
        </StorySection>
      </article>

      <figure className={styles.designMedia}>
        <Image
          src="/images/mate-campaign-preflight/preflight-uncovered-journey.jpg"
          alt="Journey coverage table with Browse Abandon highlighted as needing confirmation"
          width={925}
          height={465}
          sizes="(max-width: 900px) 100vw, 840px"
        />
        <figcaption>The unresolved journey becomes the next actionable object.</figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="The fix stays where it belongs">
          <p>
            Mate explains the uncertainty. The owner resolves it in Klaviyo. Mate rechecks. The
            operator decides.
          </p>
        </StorySection>
      </article>

      <figure className={styles.designMedia}>
        <Image
          src="/images/mate-campaign-preflight/preflight-safe-summary.png"
          alt="Campaign ready state showing all 41 overlapping shoppers protected and 299 eligible"
          width={925}
          height={373}
          sizes="(max-width: 900px) 100vw, 840px"
        />
        <figcaption>After confirmation, 41 overlaps stand down and 299 shoppers remain eligible.</figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="I designed the uncomfortable states too">
          <p>
            Missing confirmation, journey detail, recheck, unable to verify, ready, and receipt.
            Missing evidence never gets a green state.
          </p>
          <p className={styles.smallPrint}>
            Product-policy assumption: eligibility stays live until delivery. If Mate freezes the
            audience at approval, hold the 3 unclear shoppers and let 299 proceed.
          </p>
        </StorySection>
      </article>

      <section id="prototype" className={styles.prototypeSection}>
        <div className={styles.prototypeHeading}>
          <h2>Prototype in React</h2>
          <p>The decision surface, built in Mate&rsquo;s product language.</p>
        </div>
        <figure>
          <Image
            src="/images/mate-campaign-preflight/preflight-uncovered.jpg"
            alt="Full campaign preflight prototype in the unresolved state"
            width={1440}
            height={900}
            sizes="(max-width: 1512px) 100vw, 1464px"
          />
        </figure>
        <a
          className={styles.prototypeLink}
          href="/mate-prototype/index.html"
          target="_blank"
          rel="noreferrer"
        >
          Open working prototype &#8599;
        </a>
      </section>

      <article className={styles.story}>
        <StorySection title="What I would test first">
          <p>
            Show the screen for five seconds. Then ask: why did approval pause, which journey needs
            attention, and who owns the next step?
          </p>
        </StorySection>

        <StorySection title="The behavior I expect">
          <p className={styles.lead}>Faster decision. Clearer owner. Less ambiguity.</p>
          <p className={styles.smallPrint}>Expected behavior—not a measured result.</p>
        </StorySection>

        <StorySection title="Why I built this">
          <p>
            I didn&rsquo;t want to send another application into a one-minute review. I wanted to give
            us something real to talk about.
          </p>
          <p>
            Most recently, I shipped a live AI chatbot and admin app for a service business, and
            took its native booking app into beta. I like moving between product judgment and code
            until an idea is real enough to test.
          </p>
        </StorySection>

        <aside className={styles.note}>
          <span>About the evidence</span>
          Built from Mate&rsquo;s public{" "}
          <a href="https://usemate.ai/how-it-works" {...externalLinkProps}>product explanation</a>,{" "}
          <a href="https://usemate.ai/knowledge-hub/creating-stand-downs" {...externalLinkProps}>stand-down documentation</a>, and{" "}
          <a href="https://faqs.usemate.ai/additional-faqs" {...externalLinkProps}>brand FAQs</a>.
          Fictional data. Independent concept—not affiliated with Mate.
        </aside>

        <section className={styles.close}>
          <p>One last question</p>
          <h2>15 minutes to compare notes?</h2>
          <span>I&rsquo;ll bring the prototype—and the questions I could not answer from the outside.</span>
          <Link href="#prototype">Review the concept again</Link>
        </section>
      </article>
    </main>
  );
}
