import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import CaseStudySection from "../components/case-study/CaseStudySection";
import CaseStudyImage from "../components/case-study/CaseStudyImage";
import styles from "./mate-case-study.module.css";

export const metadata: Metadata = {
  title: "The moment before Approve — an independent Mate concept | Dinesh Revunuru",
  description:
    "I traced one cross-channel campaign question to the approval moment, then designed and built a preflight to make that decision clearer.",
  robots: { index: false, follow: false },
};

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-opensans",
  display: "swap",
});

const externalLinkProps = { target: "_blank", rel: "noreferrer" } as const;

// The interactive preflight is a static export bundled into the portfolio at
// public/mate-prototype, so it ships same-origin with the site: one deploy, no
// env var, no cross-origin. Its own separate URL is /mate-prototype/index.html.
const PROTOTYPE_URL = "/mate-prototype/index.html";

const currentFlow = [
  "Brand journey is active",
  "Checkmate proposes an audience",
  "Operator reviews the campaign",
  "The two systems need to agree",
  "Protection needs confirmation",
  "Operator decides whether to approve",
];

const proposedFlow = [
  "Audience proposed",
  "Coverage checked",
  "Approval pauses if unclear",
  "Owner resolves in Klaviyo",
  "Mate rechecks",
  "Operator approves 299",
];

function Flow({ items, highlight }: { items: string[]; highlight?: number }) {
  return (
    <ol className={styles.flow}>
      {items.map((item, index) => (
        <li key={item} className={index === highlight ? styles.flowStepHighlight : undefined}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          {item}
        </li>
      ))}
    </ol>
  );
}

export default function MateCampaignPreflight() {
  return (
    <main className={`w-full cs-theme-mate ${openSans.variable}`} data-seq-group>
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

      {/* Overview block — the house pattern: three fields, matching the Figma. */}
      <section className="cs-container-wide pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16 lg:gap-24">
          <div>
            <h3 className="cs-overview-head">What I did</h3>
            <p className="mt-4 cs-overview-body">
              Product design + front-end build
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">Built with</h3>
            <p className="mt-4 cs-overview-body">
              Figma, React, Next.js, TypeScript
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">Quick link</h3>
            <p className="mt-4 cs-overview-body">
              <Link href="#prototype">Interactive prototype</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Full-bleed hero: edge-to-edge, square corners. CaseStudyImage caps at
          cs-container-full (1600px) with gutters and a radius, so this one is a
          plain w-full figure instead. priority + sizes=100vw because it is the
          LCP image, above the fold. */}
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

      <CaseStudySection heading="How did it start?">
        <p>
          I found Mate through the Design Engineer role. The more I understood the product, the
          more curious I got about one decision inside it.
        </p>
        <p>
          So I traced that decision from audience to approval and built the interaction I wanted to
          discuss.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Problem statement">
        <p className={styles.statement}>
          What happens when a Checkmate campaign and a brand journey{" "}
          <mark>both want the same shopper?</mark>
        </p>
        <p>
          Mate publicly documents stand-down controls configured inside a brand&rsquo;s Klaviyo or
          Attentive journeys. The campaign decision happens in Mate, while protection is owned
          somewhere else.
        </p>
        <p>
          I chose to design for the last responsible moment before Approve: how might an operator
          confirm both systems agree?
        </p>
        <div className={styles.note}>
          <span>Evidence boundary</span>
          Public documentation confirms the cross-channel handoff. It does not show whether
          Mate&rsquo;s private dashboard already solves this exact moment. The interaction below is
          my proposal, not a missing-feature claim.
        </div>
      </CaseStudySection>

      <CaseStudySection heading="Who I designed for">
        <p>
          The primary user is a performance or growth operator accountable for campaign results and
          customer experience. A lifecycle or CRM marketer owns the journeys and protection setup in
          Klaviyo.
        </p>
        <div className={styles.personaGrid}>
          <div>
            <p className={styles.cardLabel}>Primary user</p>
            <h3>Performance or growth operator</h3>
            <p>Owns the campaign decision inside Mate.</p>
          </div>
          <div>
            <p className={styles.cardLabel}>Collaborator</p>
            <h3>Lifecycle or CRM marketer</h3>
            <p>Owns journey configuration inside Klaviyo.</p>
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection heading="Persona and moment">
        <p>
          Right before approval, the operator needs a plain answer: can I send without contacting
          shoppers protected by brand journeys, who is already receiving brand messages, and what
          must happen before I continue?
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Why this decision matters">
        <p>
          Mate can propose the audience. Klaviyo can own the protection. The operator still carries
          the consequence of approving.
        </p>
        <div className={styles.mathCard}>
          <div>
            <span>Proposed</span>
            <strong>340</strong>
          </div>
          <b aria-hidden="true">&minus;</b>
          <div>
            <span>Confirmed protection</span>
            <strong>38</strong>
          </div>
          <b aria-hidden="true">&minus;</b>
          <div>
            <span>Awaiting confirmation</span>
            <strong>3</strong>
          </div>
          <b aria-hidden="true">=</b>
          <div>
            <span>Currently eligible</span>
            <strong>299</strong>
          </div>
        </div>
        <p className={styles.mediaCaption}>Illustrative scenario · fictional data.</p>
      </CaseStudySection>

      <CaseStudySection heading="User journey" subheading="Current flow — inferred from public documentation">
        <Flow items={currentFlow} highlight={4} />
      </CaseStudySection>

      <CaseStudySection heading="Where the problem fits">
        <p>
          Not during journey setup, and not after delivery. It appears at the approval moment, when
          the campaign audience and journey protection must agree.
        </p>
        <p>
          My hypothesis: if Mate reconciles a proposed audience against confirmed journey protection
          at approval, the operator can make a more informed decision without reconstructing Klaviyo
          setup from memory.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="New flow">
        <Flow items={proposedFlow} highlight={2} />
      </CaseStudySection>

      <CaseStudySection heading="Design">
        <p>
          I kept the behavior inside the existing approval moment. No new setup flow, no extra
          dashboard, and no attempt to edit Klaviyo from Mate.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        src="/images/mate-campaign-preflight/preflight-uncovered-journey.jpg"
        alt="Journey coverage table with Browse Abandon highlighted as needing confirmation"
        width={925}
        height={465}
        caption="The unresolved journey becomes the next actionable object."
      />

      <CaseStudySection heading="The ownership stays clear">
        <p>
          Mate explains what is unclear. The lifecycle owner resolves it in Klaviyo. Mate rechecks
          the evidence. The performance operator makes the approval decision.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        src="/images/mate-campaign-preflight/preflight-safe-summary.png"
        alt="Campaign preflight ready state showing all 41 overlapping shoppers protected and 299 currently eligible"
        width={925}
        height={373}
        caption="After confirmation, all 41 overlaps stand down and 299 shoppers remain eligible."
      />

      <CaseStudySection heading="I designed the uncomfortable states too">
        <p>
          The concept covers loading, missing confirmation, journey detail, setup guidance,
          rechecking with last-known values preserved, ready to approve, unable to verify, and an
          approval receipt.
        </p>
        <p>Stale or missing evidence must never look like confirmed safety.</p>
      </CaseStudySection>

      <CaseStudySection heading="One product-policy assumption">
        <p>
          This concept assumes audience eligibility remains live until delivery. Another shopper
          could enter an unprotected journey after approval, so the system cannot safely freeze the
          exposure at the three people visible now.
        </p>
        <p>
          If Mate instead freezes the audience at approval, the alternative is to hold the three
          unclear shoppers and allow the confirmed 299 to proceed.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Prototype in React" headingVariant="prototype">
        <p>The complete decision surface, built in Mate&rsquo;s product language.</p>
      </CaseStudySection>

      <figure id="prototype" className="cs-container-full mt-6 sm:mt-8">
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

      <CaseStudySection heading="How I would validate it">
        <p>
          First, a five-second comprehension test with performance or growth marketers: why did
          approval pause, which journey needs attention, and who owns the next step?
        </p>
        <p>
          With product access, I would then measure time to decision, coverage gaps found before
          approval, recheck completion, and abandonment after a pause.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Expected behavior — not a measured result">
        <ul className="cs-prose">
          <li>A faster, more defensible approval decision.</li>
          <li>A clearer handoff between performance and lifecycle teams.</li>
          <li>Less ambiguity about who is protected and what happens next.</li>
        </ul>
      </CaseStudySection>

      <CaseStudySection heading="Why I built this">
        <p>
          I did not want to send another application into a one-minute review. I wanted to give us
          something real to talk about.
        </p>
        <p>
          So I researched the system, found a question I could not answer from the outside, and
          built the interaction I wanted to discuss.
        </p>
        <p>
          Most recently, I shipped a live AI chatbot and admin app for a service business, and took
          its native booking app into beta. This concept uses the same loop: understand the system,
          find the hard state, and build until the idea is real enough to test.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="A note about the evidence">
        <p>
          This independent concept uses Mate&rsquo;s public{" "}
          <a href="https://usemate.ai/how-it-works" {...externalLinkProps}>
            product explanation
          </a>
          ,{" "}
          <a href="https://usemate.ai/knowledge-hub/creating-stand-downs" {...externalLinkProps}>
            stand-down documentation
          </a>
          , and{" "}
          <a href="https://faqs.usemate.ai/additional-faqs" {...externalLinkProps}>
            published brand FAQs
          </a>
          . It does not describe Mate&rsquo;s private product or claim that brands are currently
          sending duplicate messages. All names, counts, timings, and campaign data are fictional.
          Not affiliated with, endorsed by, or produced for Mate or Checkmate Intelligence, Inc.
        </p>
      </CaseStudySection>

      <section className="cs-container pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className={styles.close}>
          <p>One last question</p>
          <h3>15 minutes to compare notes?</h3>
          <span>
            I&rsquo;ll bring the concept walkthrough — and the questions I could not answer from the
            outside.
          </span>
          <br />
          <a href="#prototype">Review the concept again</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
