import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import styles from "./mate-case-study.module.css";

export const metadata: Metadata = {
  title: "The moment before Approve — an independent Mate concept | Dinesh Revunuru",
  description:
    "I traced one cross-channel campaign decision, then designed and built a preflight to make it easier to understand.",
  robots: { index: false, follow: false },
};

const externalLinkProps = { target: "_blank", rel: "noreferrer" } as const;

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-opensans",
  display: "swap",
});

// Same-origin static bundle at public/mate-prototype. Its own URL is
// /mate-prototype/index.html.
const PROTOTYPE_URL = "/mate-prototype/index.html";

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
        viewBox="0 0 1250 320"
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
          <marker id="current-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 Z" className={styles.chartArrow} />
          </marker>
        </defs>

        <path d="M205 160 H240" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M450 160 H485" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M680 160 H710" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M900 160 H940 V76 H978" className={styles.chartConnector} markerEnd="url(#current-arrow)" />
        <path d="M900 160 H940 V244 H978" className={styles.chartConnector} markerEnd="url(#current-arrow)" />

        <g className={styles.chartNode}>
          <rect x="10" y="122" width="195" height="76" rx="14" />
          <text x="107" y="153" textAnchor="middle">
            <tspan x="107">Brand journey</tspan>
            <tspan x="107" dy="24">active in Klaviyo</tspan>
          </text>
        </g>
        <g className={styles.chartNode}>
          <rect x="240" y="122" width="210" height="76" rx="14" />
          <text x="345" y="153" textAnchor="middle">
            <tspan x="345">Checkmate proposes</tspan>
            <tspan x="345" dy="24">an audience</tspan>
          </text>
        </g>
        <g className={styles.chartNode}>
          <rect x="485" y="122" width="195" height="76" rx="14" />
          <text x="582" y="153" textAnchor="middle">
            <tspan x="582">Operator reaches</tspan>
            <tspan x="582" dy="24">Approve</tspan>
          </text>
        </g>

        <g className={styles.chartDecision}>
          <path d="M805 96 L900 160 L805 224 L710 160 Z" />
          <text x="805" y="153" textAnchor="middle">
            <tspan x="805">Do both</tspan>
            <tspan x="805" dy="24">systems agree?</tspan>
          </text>
        </g>
        <text x="932" y="122" textAnchor="end" className={styles.chartBranchLabel}>YES</text>
        <text x="932" y="206" textAnchor="end" className={styles.chartBranchLabel}>UNCLEAR</text>

        <g className={`${styles.chartNode} ${styles.chartNodeGreen}`}>
          <rect x="978" y="38" width="262" height="76" rx="14" />
          <text x="1109" y="69" textAnchor="middle">
            <tspan x="1109">Protected shoppers</tspan>
            <tspan x="1109" dy="24">already excluded</tspan>
          </text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="978" y="206" width="262" height="76" rx="14" />
          <text x="1109" y="237" textAnchor="middle">
            <tspan x="1109">Protection needs</tspan>
            <tspan x="1109" dy="24">confirmation across teams</tspan>
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
        viewBox="0 0 1300 380"
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
          <marker id="proposed-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 Z" className={styles.chartArrow} />
          </marker>
        </defs>

        <path d="M185 200 H220" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M410 200 H445" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M635 200 H672 V96 H706" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M635 200 H672 V304 H706" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M896 304 H930" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M1105 304 H1139" className={styles.chartConnector} markerEnd="url(#proposed-arrow)" />
        <path d="M1214 266 V28 H540 V128" className={styles.chartLoop} markerEnd="url(#proposed-arrow)" />

        <g className={styles.chartNode}>
          <rect x="10" y="162" width="175" height="76" rx="14" />
          <text x="97" y="193" textAnchor="middle">
            <tspan x="97">Audience</tspan>
            <tspan x="97" dy="24">proposed</tspan>
          </text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="220" y="162" width="190" height="76" rx="14" />
          <text x="315" y="193" textAnchor="middle">
            <tspan x="315">Preflight checks</tspan>
            <tspan x="315" dy="24">coverage</tspan>
          </text>
        </g>
        <g className={styles.chartDecision}>
          <path d="M540 136 L635 200 L540 264 L445 200 Z" />
          <text x="540" y="193" textAnchor="middle">
            <tspan x="540">Coverage</tspan>
            <tspan x="540" dy="24">confirmed?</tspan>
          </text>
        </g>
        <text x="664" y="152" textAnchor="end" className={styles.chartBranchLabel}>YES</text>
        <text x="664" y="258" textAnchor="end" className={styles.chartBranchLabel}>NO</text>

        <g className={`${styles.chartNode} ${styles.chartNodeGreen}`}>
          <rect x="706" y="58" width="180" height="76" rx="14" />
          <text x="796" y="102" textAnchor="middle">Approve 299</text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="706" y="266" width="190" height="76" rx="14" />
          <text x="801" y="297" textAnchor="middle">
            <tspan x="801">Pause + inspect</tspan>
            <tspan x="801" dy="24">the journey</tspan>
          </text>
        </g>
        <g className={styles.chartNode}>
          <rect x="930" y="266" width="175" height="76" rx="14" />
          <text x="1017" y="297" textAnchor="middle">
            <tspan x="1017">Resolve in</tspan>
            <tspan x="1017" dy="24">Klaviyo</tspan>
          </text>
        </g>
        <g className={`${styles.chartNode} ${styles.chartNodeBlue}`}>
          <rect x="1139" y="266" width="150" height="76" rx="14" />
          <text x="1214" y="297" textAnchor="middle">
            <tspan x="1214">Recheck</tspan>
            <tspan x="1214" dy="24">in Mate</tspan>
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
    <main className={`${styles.page} cs-theme-mate ${openSans.variable}`} data-seq-group>
      <SiteNav active="case-study" />

      <CaseStudyHero
        title={
          <>
            {/* {" "} is load-bearing: the mobile rule hides the <br />, and JSX
                drops whitespace around it, so without the space the two halves
                render as one mashed word. Same pattern as the other cases. */}
            I found one decision{" "}
            <br />
            worth slowing down.
          </>
        }
      />

      {/* Overview — the house pattern: three fields on the wide rail, centered. */}
      <section className="cs-container-wide">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16 lg:gap-24">
          <div>
            <h3 className="cs-overview-head">What I did</h3>
            <p className="mt-4 cs-overview-body">Product design + front-end build</p>
          </div>
          <div>
            <h3 className="cs-overview-head">Built with</h3>
            <p className="mt-4 cs-overview-body">Figma, React, Next.js, TypeScript</p>
          </div>
          <div>
            <h3 className="cs-overview-head">Quick link</h3>
            <p className="mt-4 cs-overview-body">
              <Link href="#prototype">Interactive prototype</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Full-bleed hero: edge-to-edge, square corners (v1 layout). */}
      <figure className="w-full mt-8 sm:mt-12">
        <Image
          src="/images/mate-campaign-preflight/hero-full.png"
          alt="Campaign preflight showing 340 proposed shoppers, 38 excluded by confirmed journeys, 3 awaiting protection confirmation, and 299 currently eligible"
          width={1512}
          height={635}
          priority
          sizes="100vw"
          style={{ width: "100%", height: "auto", display: "block" }}
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
          src="/images/mate-campaign-preflight/preflight-journey-coverage.png"
          alt="Journey coverage: 340 proposed, 38 excluded, 3 awaiting confirmation, 299 eligible, with Browse Abandon flagged as needing confirmation"
          width={4281}
          height={2347}
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
          src="/images/mate-campaign-preflight/preflight-ready-confirmed.png"
          alt="Campaign ready-to-approve state: coverage confirmed, all 41 overlapping shoppers protected, 0 awaiting confirmation, 299 eligible"
          width={4569}
          height={2322}
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

      <article className={styles.story}>
        <StorySection title="Prototype in React">
          <p>The decision surface, built in Mate&rsquo;s product language.</p>
        </StorySection>
      </article>

      {/* Interactive prototype — same-origin bundle in a bounded browser frame. */}
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
            <p>Interactive concept · fictional data</p>
          </div>
          <iframe
            src={PROTOTYPE_URL}
            title="Interactive campaign eligibility preflight — review coverage, resolve, and approve"
            loading="lazy"
            className={styles.prototypeIframe}
          />
        </div>
        <figcaption className={styles.prototypeCaption}>
          Live prototype. Review coverage, resolve the unconfirmed journey, then approve.{" "}
          <a href={PROTOTYPE_URL} {...externalLinkProps}>
            Open full screen &#8599;
          </a>
        </figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="Why Mate got me curious">
          <p>Mate is working on a part of AI product design I keep thinking about.</p>
          <p>
            The agents can spot opportunities and suggest what to do next. But the marketer still has
            to understand the decision, trust it, and feel comfortable owning what reaches the
            customer.
          </p>
          <p>That mix of AI, judgment, and interface design is interesting to me.</p>
          <p>
            Then I noticed how the role is set up. It brings product thinking, visual design, and
            front-end work together across Mate and Checkmate. I like staying close to the whole
            thing, from the first question to the working product.
          </p>
        </StorySection>

        <StorySection title="A little about what I bring">
          <p>
            I&rsquo;ve spent the last seven years designing products across enterprise software, AI,
            and small businesses.
          </p>
          <p>
            I usually do my best work when the problem is still a little fuzzy. I like learning the
            system, finding the decision that matters, making the information easier to understand,
            and building the interface so we can try it for real.
          </p>
          <p>
            Recently, I shipped a live AI booking assistant and admin app. A native booking app is
            now in beta.
          </p>
          <p>
            This Mate concept came from the same habit. I followed one question until it became a
            working React and TypeScript prototype.
          </p>
        </StorySection>

        <StorySection title="Where I think I could help">
          <p>
            I see myself being useful wherever an agent&rsquo;s output has to become a clear decision
            for a person.
          </p>
          <p>
            Maybe the system found an opportunity. Maybe it has a recommendation. Maybe something
            needs approval. The interface should make the next step feel obvious.
          </p>
          <p>
            I&rsquo;d need the real product, customer conversations, and team context to know which
            opportunity matters most.
          </p>
          <p>That is the part I&rsquo;d be excited to figure out with the team.</p>
        </StorySection>
      </article>

      <SiteFooter />
    </main>
  );
}
