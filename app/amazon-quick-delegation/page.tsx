import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import styles from "./quick-case-study.module.css";
import Walkthrough from "./Walkthrough";
import Source from "./Source";
import { ForumEvidence, ReturnNeeds, DesignDecisions } from "./PresentationArtifacts";
import ConceptElements from "./ConceptElements";
import { SaidVsHappened, Funnel, ReleaseStrip, KillCriteria, LogVsNarrative, SourceMap } from "./visuals";
import {
  ResearchLanes,
  ClusterChart,
  AdmissionsWall,
  GapMap,
  InspectionLog,
  CandidateCompare,
  StateContract,
  ConversationThread,
  QaBeforeAfter,
} from "./artifacts";

export const metadata: Metadata = {
  title:
    "Let Quick do the work. Keep the important decisions. — an independent Amazon Quick concept | Dinesh Revunuru",
  description:
    "An independent Amazon Quick design exploration: delegate a bounded task, keep working, and come back to a result that names what was held — not only what finished.",
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

// Same-origin route: the concept runs in the portfolio itself, framed here.
const IMG = "/images/amazon-quick-delegation";
const PROTOTYPE_URL = "/amazon-quick-delegation/prototype";

const sources = [
  {
    name: "Amazon Quick Community · Repetitive action approvals",
    href: "https://community.amazonquick.com/t/repetitive-action-approvals/51943",
    note: "March 26, 2026. A member calls repeated integration approvals “particularly distracting for an Agent that makes many API calls.” A community responder notes multiple users share the frustration and escalates it. Verified September 10, 2026.",
  },
  {
    name: "Amazon Quick Community · Full autonomous mode request",
    href: "https://community.amazonquick.com/t/feature-request-full-autonomous-mode-auto-approve-all-actions-like-claude-code-chatgpt-work/53512",
    note: "August 28, 2026. Asks for global, per-connector, and session-level auto-approval; acknowledged by a community responder the same day. Links the March thread, so the two are not independent estimates.",
  },
  {
    name: "AWS · Security in Amazon Quick, “Limits stated plainly”",
    href: "https://docs.aws.amazon.com/quick/latest/userguide/sec-agentic-security.html#sec-agentic-security-honest-limits",
    note: "Product documentation. States that on-demand actions execute immediately and that human review is not a system-wide requirement. Fetched September 8, 2026.",
  },
  {
    name: "Amazon Jobs · UX Designer II, Conversational, Amazon Quick",
    href: "https://www.amazon.jobs/en/jobs/10522869/ux-designer-ii-conversational-amazon-quick",
    note: "The role this concept was made for. Scopes error states, limitations, trust repair, and steering.",
  },
  {
    name: "miniOrange · AI agent audit trails",
    href: "https://www.miniorange.com/blog/ai-agent-audit-trail/",
    note: "Describes the governance practice of logging blocked and denied agent actions for engineers and compliance teams.",
  },
  {
    name: "Microsoft · Agent Governance Toolkit, audit & compliance",
    href: "https://microsoft.github.io/agent-governance-toolkit/tutorials/04-audit-and-compliance/",
    note: "Same practice, first-party: denied actions and policy decisions captured as audit records.",
  },
  {
    name: "AWS · Best practices for building agentic automations with Amazon Quick Automate",
    href: "https://aws.amazon.com/blogs/machine-learning/best-practices-for-building-agentic-automations-with-amazon-quick-automate/",
    note: "September 3, 2026, Sumit Wasuja. The rubber-stamp versus missed-error framing of human review. Also: “Because agent behavior can vary from one run to the next, evaluation matters more here.”",
  },
  {
    name: "AWS · Amazon Quick Apps limitations",
    href: "https://docs.aws.amazon.com/quick/latest/userguide/apps-limitations.html",
    note: "Product documentation. Silent failure on unstable connections; guardrail false positives that lock a session for 15 to 20 minutes; no investigate-only mode.",
  },
  {
    name: "Amazon Quick Community · Session persistence and reasoning quality",
    href: "https://community.amazonquick.com/t/session-persistence-and-reasoning-quality/51916",
    note: "March 23 to April 23, 2026. A member reports earlier conversations bleeding into fresh sessions, and a month later: “Quick is unusable at this point.” Amazon staff point to Private Mode.",
  },
  {
    name: "Constellation Research · Why Amazon Quick could be more strategic than recognized",
    href: "https://www.constellationr.com/insights/news/why-amazon-quick-could-be-more-strategic-recognized",
    note: "Larry Dignan, June 19, 2026. Desktop and web “doesn't quite sync”; “it's early in the Amazon Quick development.”",
  },
  {
    name: "Moor Insights & Strategy · AWS Summit New York field notes",
    href: "https://moorinsightsstrategy.com/field-notes/aws-summit-new-york-strong-infrastructure-and-developer-gains-with-quick-and-messaging-to-watch/",
    note: "Jason Andersen, June 17, 2026. “It needs more soak time with customers on usability.”",
  },
  {
    name: "AWS · Using Amazon Quick chat",
    href: "https://docs.aws.amazon.com/quick/latest/userguide/using-quick-chat.html",
    note: "Product documentation. The seven thumbs-down reasons, four of which are grounding failures; memory guidance that asks the user to “be explicit about your preferences.”",
  },
  {
    name: "Microsoft 365 Message Center · RM560339",
    href: "https://mc.merill.net/message/RM560339",
    note: "Published April 22, 2026, updated August 26, 2026. Planned proactive Copilot mobile notifications withdrawn: “We have decided not to move forward with this change at this time.”",
  },
  {
    name: "Alexandre Agius · A week using Amazon Quick",
    href: "https://www.agiusalexandre.com/blog/2026-05-14-amazon-quick-future-of-development/",
    note: "May 14, 2026. The author identifies as an AWS Solutions Architect, so read it as an affiliated account. Describes useful orchestration alongside dropped connections and delegation that needs inspection.",
  },
];

function StorySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Insight({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <span className={styles.insightTag}>Insight {n}</span>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function AmazonQuickDelegation() {
  return (
    <main className={`${styles.page} cs-theme-quick ${openSans.variable}`} data-seq-group>
      <SiteNav active="case-study" />

      <CaseStudyHero
        title={
          <>
            {/* {" "} is load-bearing: the mobile rule hides the <br />, and JSX
                drops whitespace around it. Same pattern as the other cases. */}
            Let Quick do the work. <br />
            Keep the important decisions.
          </>
        }
      />

      <section className="cs-container-wide">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16 lg:gap-24">
          <div>
            <h3 className="cs-overview-head">What I did</h3>
            <p className="mt-4 cs-overview-body">
              Discovery research, problem framing, conversational + interaction design, React
              prototype
            </p>
          </div>
          <div>
            <h3 className="cs-overview-head">Built with</h3>
            <p className="mt-4 cs-overview-body">
              React, Next.js, TypeScript · AI-assisted research and implementation
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

      <figure className="w-full mt-8 sm:mt-12">
        <Image
          src={`${IMG}/hero-full.png`}
          alt="The concept's opening state: a brief to prepare Friday's operating update, and an agreement card scoped to this one run — what Quick may use, prepare, send, and must keep out"
          width={3024}
          height={1520}
          priority
          sizes="100vw"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </figure>

      {/* ------------------------------------------------------------ */}
      {/* Part 1 · How it started                                        */}
      {/* ------------------------------------------------------------ */}

      <article className={styles.story}>
        <StorySection title="How did it start?">
          <p>
            I found Amazon Quick through the Conversational UX role. One question kept pulling me
            in: when you hand work to an assistant and step away, what do you need to know when you
            come back?
          </p>
          <p>
            I didn&rsquo;t start with an answer. I started with a week of finding out what people
            actually hit when they use Quick, what Amazon says about it in its own words, and then
            what I could see for myself inside the app.
          </p>
          <p className={styles.lead}>
            The goal wasn&rsquo;t more conversation. It was less supervision.
          </p>
        </StorySection>
      </article>

      {/* ------------------------------------------------------------ */}
      {/* Part 2 · Where the problem came from                           */}
      {/* ------------------------------------------------------------ */}

      <article className={styles.story}>
        <StorySection title="Where the problem came from">
          <p>
            Four lanes of research, run in parallel, each with a rule: quote only what was read on a
            fetched page, mark what was observed versus what I inferred, and list every source that
            was blocked rather than guess at it. Some sources were inaccessible in the initial
            sweep; a later pass reached Reddit and part of Gartner. Amazon&rsquo;s own community
            forum provided the clearest reports for this direction.
          </p>
        </StorySection>
      </article>

      <section className={styles.wideBlock} aria-label="The four research lanes">
        <ResearchLanes />
      </section>

      <section className={styles.mediaBlock} aria-label="Which venues could be read">
        <SourceMap />
      </section>

      <section className={styles.mediaBlock} aria-label="Original community reports">
        <ForumEvidence />
      </section>

      <article className={styles.story}>
        <Insight n="01" title="A recurring theme was uncertainty about the product’s state.">
          <p className={styles.statement}>
            In the public reports I reviewed, one recurring theme was{" "}
            <mark>uncertainty about what the product had actually done.</mark>
          </p>
          <p>
            Connectors that say Connected but aren&rsquo;t. A feed agent that fails silently every
            fifteen minutes. A flow that says Running after it finished. A meter that vanishes. An
            app that shows an empty profile while the data sits on disk. <Source n={9} />{" "}
            <Source n={10} />
          </p>
          <p>
            When I clustered the eighty-seven sourced complaints, nine of thirteen clusters were
            about state, not about the model. The one rigorous answer-quality test I could find
            dates from October 2025 and was never replicated. That reordered what I thought this
            role was for.
          </p>
        </Insight>
      </article>

      <section
        className={styles.mediaBlock}
        aria-label="Complaint clusters ranked by independent sources"
      >
        <ClusterChart />
      </section>

      <article className={styles.story}>
        <Insight n="02" title="Amazon says it too, in its own documentation.">
          <p>
            I expected marketing. I found a security guide with a section literally titled
            &ldquo;Limits stated plainly,&rdquo; a September blog post admitting review queues fail
            in both directions, and a job description that uses the word <em>repaired</em> about
            trust. <Source n={3} /> <Source n={7} /> <Source n={4} />
          </p>
          <p>
            Read together, the release notes tell a story too: autonomous agents shipped in June.
            Per-tool consent, the securing-for-production guide and the automation best-practices
            post all landed in the first three days of September. Governance arrived after autonomy.
            That sequence prompted a design question about how people understand and manage
            delegated actions.
          </p>
        </Insight>
      </article>

      <section
        className={styles.mediaBlock}
        aria-label="Verbatim admissions from Amazon's documentation and hiring"
      >
        <AdmissionsWall Source={Source} />
      </section>

      <section className={styles.mediaBlock} aria-label="Release dates: capability in June, governance in September">
        <ReleaseStrip />
      </section>

      <article className={styles.story}>
        <Insight n="03" title="The loudest complaints weren't mine to fix.">
          <p>
            The most repeated pain in the whole corpus is a desktop app that loses weeks of local
            work on update. Then front-door reliability, then the $250 account fee, then three
            renames in five months. A conversational designer cannot fix any of those, and
            pretending otherwise would be the fastest way to lose the room.
          </p>
          <p>
            So every gap got three more questions: is it in this role&rsquo;s remit, does the job
            description name it, and has Amazon already shipped a fix. A gap had to clear all three
            to be a candidate.
          </p>
        </Insight>
      </article>

      <section className={styles.wideBlock} aria-label="The ranked gap map">
        <GapMap />
      </section>

      <section className={styles.mediaBlock} aria-label="How thirteen clusters narrowed to one problem">
        <Funnel />
      </section>

      <article className={styles.story}>
        <Insight n="04" title="Then I looked myself, and my first claim was wrong.">
          <p>
            Second-hand evidence has a ceiling. Almost nothing public critiques the conversational
            surface itself: turn-taking, disambiguation, error recovery. So at my request an
            AI-assisted inspection ran five controlled tests on the installed macOS app, with
            fictional data and explicit limits: no files, no connectors, no sending.
          </p>
          <p>
            My checkpoint recommendation had said Quick has no uncertainty UX. The first two tests
            refuted it. Quick produced a known/unknown table, kept two conflicting estimates
            visible, and labelled a draft “Not sent”. I logged the correction the same day. What
            survived was narrower and more interesting, and it appeared only after delegation.
          </p>
        </Insight>
      </article>

      <section
        className={styles.wideBlock}
        aria-label="The five tests and the sequence inside test three"
      >
        <InspectionLog />
      </section>

      <article className={styles.story}>
        <StorySection title="What that one moment is, and isn't">
          <p>
            The safeguard worked. The denied write was stopped by the approval control Quick already
            ships. The final statement, nothing sent and no files created, was compatible with the observed denial. What was
            missing was the exception itself: the person had to inspect permissions and ask a
            follow-up to learn what had been attempted.
          </p>
          <p>
            An independent adversarial review of the observation reached the same reading:
            compatible with the denial, not deception. The opportunity is connecting a blocked step
            to the completion narrative. Not alleging a defect.
          </p>
          <p className={styles.smallPrint}>
            Evidence limit: one event, one account, one Preview build. It did not recur in a
            fresh-chat repeat, which is real counterevidence against any deterministic claim. Two
            runs do not estimate a rate. This is grounds to design an interaction, and nothing more.
          </p>
        </StorySection>

      </article>

      <section className={styles.wideBlock} aria-label="What the completion said versus what happened">
        <SaidVsHappened />
      </section>

      <article className={styles.story}>
        <StorySection title="The problem">
          <p className={styles.statement}>
            A completion message that describes only the output can leave you piecing together{" "}
            <mark>what was attempted, stopped, or changed.</mark>
          </p>
          <p>
            Quick&rsquo;s users have asked for fewer interruptions. <Source n={1} />{" "}
            <Source n={2} /> I took that as evidence of friction, not as a spec to remove every
            checkpoint. The harder question is what happens when a delegated step crosses a limit
            you set.
          </p>
        </StorySection>
      </article>

      {/* ------------------------------------------------------------ */}
      {/* Part 3 · Directions and decisions                              */}
      {/* ------------------------------------------------------------ */}

      <article className={styles.story}>
        <StorySection title="Choosing a focused problem">
          <p>
            The inspection narrowed the opportunity. I compared three candidate problems by the
            evidence behind them, whether a small prototype could test them, and what would make me
            change direction.
          </p>
        </StorySection>
      </article>

      <section className={styles.wideBlock} aria-label="Three candidate problems compared">
        <CandidateCompare />
      </section>

      <article className={styles.story}>
        <StorySection title="Who is making the call?">
          <p>
            A knowledge worker who delegates preparation but still owns the result. An operations
            lead sending a weekly update is the fictional scenario, not a validated persona or a
            claim about Quick&rsquo;s primary audience. No source in the corpus establishes a
            business-user persona; complainers are mostly Amazon-internal, ISV developers and IT
            admins. I say that plainly rather than invent one.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="Primary user and what they need">
        <ReturnNeeds />
      </section>

      <article className={styles.story}>
        <StorySection title="My hypothesis, and what kills it">
          <p className={styles.lead}>
            If Quick keeps the limits you set while it works, and explains any exception both when
            it happens and at completion, you can answer the four questions from the interface
            alone.
          </p>
          <p>
            I wrote the kill criteria before the build, so the prototype couldn&rsquo;t quietly
            redefine success. The concept dies if people already answer those questions from
            Quick&rsquo;s existing interface unaided. It dies if the exception moment is too rare to
            design for. And it dies if telling the truth about it would require inventing backend
            guarantees the UI can&rsquo;t honestly make.
          </p>
          <p className={styles.smallPrint}>
            A hypothesis about comprehension and supervision. No measured reduction in workload or
            increase in trust is claimed. The first kill criterion is still open until the
            participant study runs.
          </p>
        </StorySection>
      </article>

      {/* ------------------------------------------------------------ */}
      <section className={styles.wideBlock} aria-label="The three kill criteria and their status">
        <KillCriteria />
      </section>

      {/* Part 4 · What I designed                                       */}
      {/* ------------------------------------------------------------ */}

      <section className={styles.flowStage} aria-label="Interactive storyboard of the five moments">
        <p className={styles.flowEyebrow}>
          Five moments · driven by the prototype&rsquo;s own state logic
        </p>
        <Walkthrough />
      </section>

      <article className={styles.story}>
        <StorySection title="What I designed">
          <p>
            One Friday update for Northline, a fictional business: prepare a report, send a short
            summary to eight internal teammates, keep customer details out. The task is ordinary on
            purpose. The exceptions carry the design.
          </p>
          <p>
            I kept Quick&rsquo;s installed shell: light canvas, familiar left navigation, central
            conversation, the existing task rail. The inspection had shown task visibility,
            approvals and an activity-feed interface. None of that needed inventing. Four decisions
            did.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="The four design decisions">
        <DesignDecisions />
      </section>

      <article className={styles.story}>
        <StorySection title="The interface elements I designed for this concept">
          <p>
            The familiar Quick shell stays. My design work is in the handoff, how a person can keep
            talking while work continues, how a changed action asks for attention, and what the
            ending remembers.
          </p>
        </StorySection>
      </article>
      <section
        className={styles.wideBlock}
        aria-label="Interface elements designed for this concept"
      >
        <ConceptElements />
      </section>

      <article className={styles.story}>
        <StorySection title="The contract behind the screens">
          <p>
            Before any pixels, I wrote what the person must understand in each state and, more
            importantly, what the interface must never imply. The second column is the one that
            catches design mistakes. Every screen was checked against it, and the QA pass later used
            it as the spec.
          </p>
        </StorySection>
      </article>

      <section className={styles.wideBlock} aria-label="The eight-state contract">
        <StateContract />
      </section>

      <article className={styles.story}>
        <StorySection title="What Quick actually says">
          <p>
            For a role titled <em>Conversational</em>, the words are the design. Quick&rsquo;s
            narration is a thread that accumulates, not one line that gets replaced. It speaks each
            exception when it happens and names every held action at the end. Cards carry evidence
            and choices. The conversation carries what happened. The two never duplicate each other.
          </p>
          <p>
            Two rules I held to: name agency, always (the roster added it, I didn&rsquo;t), and
            never manufacture a cause. In the inspection, Quick offered a plausible story for why it
            tried the file write and then admitted it couldn&rsquo;t verify it. The concept explains
            known events and stops there.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="What Quick says at each moment, verbatim">
        <ConversationThread />
      </section>

      <article className={styles.story}>
        <StorySection title="The moment the audience changes">
          <p>
            The roster adds an external supplier mid-run. Quick says who added it, that it did not,
            and that only the send is held. The report is still moving underneath.
          </p>
        </StorySection>
      </article>

      <figure className={styles.designMedia}>
        <Image
          src={`${IMG}/state-exception.png`}
          alt="The exception state: Quick's thread says the ops roster added an external supplier and the send is held; the card below shows 8 internal teammates unchanged, Jordan · Northstar Supply added as external, and three choices"
          width={3024}
          height={2600}
          sizes="(max-width: 900px) 100vw, 840px"
        />
        <figcaption>Only the send is held. The person chooses; the report keeps going.</figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="The ending must distinguish completed from prevented">
          <p>
            The receipt names the output, the simulated destination, the figure used, and everything
            held along the way. A cancelled send is never dressed up as a delivery.
          </p>
        </StorySection>
      </article>

      <figure className={styles.designMedia}>
        <Image
          src={`${IMG}/state-receipt.png`}
          alt="The completion receipt: 'Held along the way' lists the held file export and the roster change; below it, internal summary delivered (simulated) to 8 teammates, external supplier not sent, figure delivered $131,200 — your edit, revision 2"
          width={3024}
          height={2600}
          sizes="(max-width: 900px) 100vw, 840px"
        />
        <figcaption>
          Held actions survive into the result, in Quick&rsquo;s words and on the receipt.
        </figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="What is actually new here">
          <p>
            Recording blocked actions is not new. Agent audit trails do it thoroughly: denied tool
            calls, policy decisions, risk scores. <Source n={5} /> <Source n={6} /> Amazon&rsquo;s
            own guidance is candid that on-demand actions execute immediately and human review is
            not system-wide. <Source n={3} />
          </p>
          <p>
            Those records support engineering and compliance review. This concept puts the exception
            in the completion narrative the person actually reads, and gates delivery on it in
            state, so this scripted interface cannot report simulated delivery before its local
            checks pass. Real delivery would need backend enforcement.
          </p>
          <p className={styles.smallPrint}>
            Stated carefully: I found no product doing this in what I surveyed. I did not survey
            completion-receipt design across assistants specifically, so that is a claim about my
            corpus, not the market.
          </p>
        </StorySection>
      </article>

      <section className={styles.wideBlock} aria-label="Where the exception lives: an audit log versus the completion narrative">
        <LogVsNarrative />
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Part 5 · Trying to break it                                    */}
      {/* ------------------------------------------------------------ */}

      <article className={styles.story}>
        <StorySection title="Then I tried to break it">
          <p>
            A full verification pass on the working prototype: computed styles rather than
            eyeballing, real keyboard traversal, every code-level claim checked against source,
            three viewports. Twenty flags. Four were blockers. The worst one was that a reviewer
            could finish the entire run and never see the concept&rsquo;s differentiating moment,
            because it only fired from a demo button.
          </p>
          <p>
            Then a second, harder question: had the build drifted off the locked problem? It had, in
            one way that mattered. The receipt named the exception. Quick&rsquo;s own line
            didn&rsquo;t. The origin failure, a completion summary omitting a held action, had been
            reproduced one layer up, in the conversation. That was the last thing fixed, and the one
            I&rsquo;d have been most embarrassed to ship.
          </p>
        </StorySection>
      </article>

      <section className={styles.wideBlock} aria-label="QA findings, before and after">
        <QaBeforeAfter />
      </section>

      <article className={styles.story}>
        <StorySection title="What I chose not to fix">
          <p>
            The origin was a parallel run: a parent task and two subtasks, with the parent
            flattening the exception. The prototype is a single linear run. It reproduces the
            flattening, not the structure it happened in. The fresh-chat repeat also surfaced a
            second gap, results that needed prompting to arrive, which nothing here addresses. Both
            are named rather than hidden, because they are the first two things I&rsquo;d want to
            explore with the real product.
          </p>
          <p className={styles.smallPrint}>
            Scope, honestly: one scripted run. No live model, connectors, file export, or delivery.
            Voice is optional and simulated; the microphone is off. In production the delivery gate
            needs the same enforcement in the backend. The UI alone cannot promise it.
          </p>
        </StorySection>

        <StorySection title="Prototype in React">
          <p>
            The decision surface, built in Quick&rsquo;s product language. Start it and touch
            nothing: the exceptions arrive on their own.
          </p>
        </StorySection>
      </article>

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
            <p>Interactive concept · simulated · fictional data</p>
          </div>
          <iframe
            src={PROTOTYPE_URL}
            title="Interactive change-aware delegation concept — start the update, decide on the exception, finish"
            loading="lazy"
            className={styles.prototypeIframe}
          />
        </div>
        <figcaption className={styles.prototypeCaption}>
          Live prototype. Start the update, then decide when the audience changes.{" "}
          <a href={PROTOTYPE_URL} {...externalLinkProps}>
            Open full screen &#8599;
          </a>
        </figcaption>
      </figure>

      {/* ------------------------------------------------------------ */}
      {/* Part 6 · What's next, and the close                            */}
      {/* ------------------------------------------------------------ */}

      <article className={styles.story}>
        <StorySection title="What I would test first">
          <p>
            Three to five people who regularly delegate work and use an AI assistant. An equivalent
            task on their everyday assistant first, then this concept, order counterbalanced where
            practical.
          </p>
          <p>
            Returning to the finished task, unaided: What finished? Was a file created or only
            requested? Was anything sent, and to whom? What caused the interruption? Did the summary
            use the corrected figure?
          </p>
          <p>
            I would record answer accuracy, follow-up questions, backtracking, and recovery. Any
            mistaken belief about an external action outranks a favourable preference rating.
          </p>
          <p className={styles.lead}>
            The direction dies if people already answer those questions from the existing interface,
            if the exception turns out too rare to design for, or if it needs guarantees the system
            cannot honestly make.
          </p>
        </StorySection>

        <StorySection title="Why Quick got me curious">
          <p>
            Quick is working on the part of AI product design I keep thinking about: an agent can do
            more every month, and every exchange is a moment where the person decides whether to
            trust it with more, or pull back.
          </p>
          <p>
            The role sits exactly there. Confidence, uncertainty, and limitations. Trust built,
            maintained, and repaired. I like that the small team owns the invisible interactions,
            not just the screens.
          </p>
        </StorySection>

        <StorySection title="A little about what I bring">
          <p>
            I&rsquo;ve spent the last seven years designing products across enterprise software, AI,
            and small businesses.
          </p>
          <p>
            I do my best work when the problem is still fuzzy: learn the system, find the decision
            that matters, make it easier to understand, then build it so we can try it for real.
          </p>
          <p>
            Recently I shipped a live AI booking assistant and an admin app. This concept came from
            the same habit: I followed one observation until it was a working React prototype with
            tests, and I kept the receipts on every claim along the way.
          </p>
        </StorySection>

        <StorySection title="Where I think I could help">
          <p>
            Wherever an agent&rsquo;s work has to become something a person can understand without
            watching it.
          </p>
          <p>
            I&rsquo;d need the real product, the science team&rsquo;s failure clusters, and customer
            conversations to know which moment matters most. That is the part I&rsquo;d be excited
            to figure out with the team.
          </p>
        </StorySection>

        <StorySection title="What this story rests on">
          <details id="sources-details" className={styles.sourcesDetails}>
            <summary>
              <span className={styles.showLabel}>Show the {sources.length} sources</span>
              <span className={styles.hideLabel}>Hide the sources</span>
              <i aria-hidden="true" />
            </summary>
            <ol className={styles.sources}>
            {sources.map((s, i) => (
              <li key={s.href} id={`source-${i + 1}`}>
                <a href={s.href} {...externalLinkProps}>
                  {s.name}
                </a>
                <span>{s.note}</span>
              </li>
            ))}
            </ol>
          </details>
          <p className={styles.smallPrint}>
            Independent exploration, September 2026. The four research lanes, the desktop
            inspection, code implementation, and technical checks were AI-assisted; problem
            selection, the gap-map criteria, interaction direction, conversational and visual
            design, and prototype review are mine. Not affiliated with or commissioned by Amazon.
            Northline is fictional; every action is simulated.
          </p>
        </StorySection>
      </article>

      <SiteFooter tagline="Independent concept · not affiliated with Amazon" />
    </main>
  );
}
