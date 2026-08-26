import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import CaseStudySection from "../components/case-study/CaseStudySection";
import CaseStudyPhase from "../components/case-study/CaseStudyPhase";
import { HssDemoEmbed } from "../components/case-study/HssDemoEmbed";
import CaseStudyImage from "../components/case-study/CaseStudyImage";
import CaseStudyVideo from "../components/case-study/CaseStudyVideo";
import CaseStudyList from "../components/case-study/CaseStudyList";
import CaseStudyCallout from "../components/case-study/CaseStudyCallout";
import CaseStudyGallery from "../components/case-study/CaseStudyGallery";

export const metadata: Metadata = {
  title: "An AI assistant that books customers on its own — Dinesh Revunuru",
  description:
    "An AI assistant for a hair-replacement studio that answers questions and books real appointments on its own. I designed and built it, along with the booking platform underneath it and the automation that brings customers back.",
};

/* ------------------------------------------------------------------ *
 * Built entirely on the portfolio design system: cs-* classes, the
 * CaseStudy* components, and the per-project card tokens. No bespoke
 * CSS. Empty CaseStudyImage slots render as labelled placeholders.
 * ------------------------------------------------------------------ */

/**
 * The outcome row.
 *
 * `note` is the bar the number was measured against. A bare figure is a claim;
 * a figure beside its target is evidence, and it lets the row stay honest about
 * the one target that was missed instead of hiding it 700 lines further down.
 *
 * `lead` marks the single accent card. Exactly one — the row previously ran
 * three gold cards, which left no level-1 and spent the accent until it was
 * not one.
 *
 * The conversion rate is deliberately NOT here. It is the only figure on the
 * page whose denominator was never settled, and a card gives it the same
 * billing as two audited numbers. It survives in prose under "What changed",
 * where the caveat has room to be stated properly.
 */
const metrics = [
  {
    k: "cost per new customer",
    from: "$105",
    v: "$40",
    note: "the number the owners had been asking for",
    lead: true,
  },
  {
    k: "new customers who came back",
    from: "40%",
    v: "72%",
    // "against a target of 80%" is the whole honest statement — the reader can
    // see 72 is under it. Spelling out "short of it" made the card's last words
    // an apology, and the miss is already named in "What is still open".
    note: "against a target of 80%",
  },
  {
    // No baseline: this channel did not exist before, so there is nothing
    // honest to count down from. The card carries the scale instead, which is
    // what the two percentages need to be sized against.
    k: "bookings through the assistant",
    v: "86",
    note: "in two months",
  },
];

/** Drawn from the eight interviews and the system audit, not invented. */
const personas = [
  {
    who: "The first-timer",
    pain: "Has never worn a hair system and arrives with a lot of questions and no vocabulary for the services. Cannot tell which appointment is the right one to book, so books nothing.",
  },
  {
    who: "The returning client",
    pain: "Knows exactly what they want and just needs a slot. Ends up phoning the store because that is faster than the website, which puts them back in the queue behind everyone else.",
  },
  {
    who: "The Spanish speaker",
    pain: "Could not get a question answered at all. Not a slow experience, an absent one.",
  },
  {
    who: "The stylist and managing partner",
    pain: "Expert with hair, not with software. Expected to move between a booking system, a chatbot tool and everything else, and reasonably worried that anything new would be worse.",
  },
  {
    who: "The owner",
    pain: "Was the booking system. Read a list, phoned each person, negotiated a time, entered it by hand. Found out about Saturday on Monday.",
  },
];

/** The provenance chain. Captions are causal edges, never descriptions. */
const chain = [
  {
    /* Built 2026-07-30, Figma node 188:240.

       The slot used to read "Eight customer interviews, redacted", which
       promised transcripts. Those artifacts do not exist to publish, and
       drawing simulated ones would be inventing research evidence rather than
       presenting it. What is documented is the study's shape and its finding,
       so the board shows that and the alt now says so. Every figure on it
       (six loyal, two new, the funnel audit) is recorded elsewhere in this
       case study. */
    src: "/case-studies/hss/i2-eight-interviews-v4.png",
    width: 2400,
    height: 1578,
    alt: "IMG-02 · Eight interviews, and every step audited. Six loyal customers, two new, plus an audit of every step between an ad and an appointment.",
    /* Carries two hops, because the slot that used to carry the second one is
       gone. IMG-03 was "the ad-to-appointment journey, two stages sharp" — the
       same ad click down both paths that the U4 board already draws further
       down the page, so it was cut rather than built twice (2026-07-30). Its
       causal edge could not go with it: without "the drop-off named the
       conversation", this caption ends on the drop-off and the next image
       opens on intents, with nothing joining them. */
    caption:
      "The interviews named the drop-off, and the drop-off named the conversation the assistant had to have.",
  },
  {
    /* Built 2026-07-30 in the boards' own grammar (1200 rail, 80px margins,
       the 13/15/22/36 ramp, #002526 accent). Content is the page's own three
       arrivals, not new claims. Figma node 186:240. */
    src: "/case-studies/hss/i4-three-arrivals-v3.png",
    width: 2400,
    height: 1430,
    alt: "IMG-04 · Three arrivals, one conversation. The new prospect, the returning client and the decided booker, and what the assistant gives each.",
    caption: "The intents became the flow.",
  },
  {
    alt: "IMG-05 · The assistant live: confirmation over a live slot grid",
    caption: null,
  },
];

function ChainArrow() {
  return (
    <div className="mt-5 flex justify-center opacity-30" aria-hidden="true">
      <svg
        width="18"
        height="30"
        viewBox="0 0 18 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M9 1v25M2 20l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Benefit({ bold, plain }: { bold: string; plain: string }) {
  return (
    <div>
      <p className="cs-section-head">{bold}</p>
      <p className="mt-2 t-body text-[color:var(--color-body-ink)]">{plain}</p>
    </div>
  );
}

/**
 * The five acts — Diagnose, Assistant, Platform, Automate, Results — plus the
 * handoff line that introduces them.
 *
 * Set false for the 2026-08-12 launch: the acts need another pass and shipping
 * them half-finished is worse than shipping the short case. Flip to true to
 * restore all of it. Nothing else has to change — the region is one contiguous
 * block, the only link into it (href="#results") lives inside it, and no other
 * page links to the act anchors.
 *
 * A flag rather than commented-out JSX on purpose. The region is ~900 lines and
 * already contains block comments, so wrapping it in another one terminates at
 * the first inner asterisk-slash and breaks the file. This also keeps the code
 * typechecked and compiled, so it cannot rot silently while it is switched off.
 *
 * Not CSS display:none: that would still ship every word of client work in the
 * HTML, where view-source, crawlers and screen readers all reach it.
 *
 * The page still reads as complete without it — hero, overview, problem,
 * solution, outcome, then the live demo as the closing artifact.
 */
const SHOW_ACTS = false;

/**
 * The two closing screenshots — the admin calendar and the marketing screen.
 *
 * ⚠ Both frames carry real production data. The calendar shows several real
 * customer names legible at the source file's full 715px, a staff email address
 * and the live admin subdomain; the marketing frame adds real booking and
 * audience counts. The gallery renders them at ~388px, where the names are too
 * small to read, but the source file would ship intact and this repository is
 * public, so anyone could open the asset directly.
 *
 * This case study's own copy says these customers "are private about why they
 * are there." Publishing their names contradicts the thing the case study is
 * about, and they never agreed to it.
 *
 * So the flag is false and the two PNGs are deliberately NOT committed. Both
 * conditions matter: the flag stops them rendering, and leaving them untracked
 * is what keeps them out of git history, which a later deletion would not undo.
 * To ship them, re-capture with anonymised names, add the files, flip this.
 *
 * (This note previously quoted two of the names as evidence, which republished
 * exactly what it was arguing against. Describe the risk; never restate the
 * data.)
 */
const SHOW_CLOSING_IMAGES = false;

export default function HssCaseStudy() {
  return (
    <main className="w-full cs-theme-hss" data-seq-group>
      <SiteNav active="case-study" />

      {/* 1 · Hero — title only, matching the other case studies: a plain
          statement of what the project is, not a hook. */}
      <CaseStudyHero
        title={
          <>
            {/* The {" "} is load-bearing: JSX drops the whitespace around a
                <br />, so when the mobile rule hides the break the two halves
                would otherwise render as one mashed word. */}
            Booking got easier. Cost per{" "}
            <br />
            conversion fell by more than 60%
          </>
        }
        /* No subtitle, and now it costs nothing. The old note here recorded a
           known gap: a removed subtitle had been the only verified figure above
           the Intro band, so dropping it delayed the first number. The title
           carries the number itself now, so the gap is closed rather than
           tolerated.

           "More than 60%" is the floor, not the measurement, and it is true
           against both records: $105 to $40 per new customer is 61.9%, and the
           P1 capability intake puts the cost-per-conversion fall at ~75%.
           Understating deliberately — the two are different denominators and
           only the floor is safe for both. Do not sharpen this to a single
           figure without settling which metric it names. */
      />

      {/* 2 · Overview block — the house pattern: three fields, then the client. */}
      <section className="cs-container-wide pt-6 sm:pt-10 pb-12 sm:pb-16">
        {/* Three columns only from lg: at md they measured 192px with 80px
            gutters — ~26 characters a line against a 50–75 floor. But dropping
            straight from 3 to 1 left 768–1023px as a single 480px column in an
            881px container: 46% dead space and a 662px-tall block. Two columns
            carry that band at ~420px each (~58 chars), and Duration — the
            fourth item — completes the 2×2 instead of stranding a row. */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 xl:gap-24">
          {/* My role and Tools share one structure — head, a single-line bold
              lead, then body — so their body paragraphs start on the same
              baseline. Leads must stay short enough not to wrap at this
              measure, or that alignment breaks.

              Company overview no longer follows it: its bold lead ("A
              hair-replacement studio") was removed 2026-08-11 when the client
              was named, since the opening clause now does the lead's job. The
              cost is that this column's body starts one line higher than the
              other two. Restoring the baseline would mean dropping both other
              leads, which is a larger change than was asked for. */}
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Company overview</h3>
            <p className="mt-4 cs-overview-body">
              Hair System Salons sells hair systems and related products online, with in-person
              services offered through its studios. After the first location proved the model, the
              company began expanding to five studios across the US.
            </p>
          </div>
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">My role</h3>
            <p className="mt-4 cs-overview-body">
              <strong>Senior Product Designer</strong>
            </p>
            <p className="mt-3 cs-overview-body">
            Talk, talk & TALK to stake holders and users, Find problems, research, design and write production code, test & deploy solutions.
            </p>
          </div>
          {/* Tools are a list of tools. Where each one was used belongs to the
              sections that use them, not here. */}
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Tools</h3>
            <p className="mt-4 cs-overview-body">
              <strong>Cursor and Claude Code</strong>
            </p>
            <p className="mt-3 cs-overview-body">
              Next.js, React, TypeScript, Supabase, Claude, Vercel, Klaviyo, Resend, GA4, Google
              Ads, Figma.
            </p>
          </div>
          {/* Duration is the fourth peer and lives inside the grid, so it takes
              the grid's own row gap and fills the empty cell at md rather than
              hanging below the rail. It has no bold lead — the date IS the
              value, and inventing one would only pad the column to match. */}
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Duration</h3>
            <p className="mt-4 cs-overview-body">Apr &ndash; late Jun 2026, (11 weeks)</p>
          </div>
          {/* Team fills the cell that row two left empty, and it is the first
              step of reframing this case study around how the work was done
              rather than only what shipped.

              It sits in row two on purpose. Row one (Company overview, My role,
              Tools) shares a baseline across three columns and adding a
              non-text element there would break it. Duration already breaks the
              head/lead/body pattern by having no bold lead, so row two is where
              a different shape costs nothing.

              The split is stated rather than implied. "Team: me and an AI" with
              no division of labour invites the reading that the model did the
              thinking, which is the opposite of the claim. */}
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Team</h3>
            {/* Stacked, not spaced. Both avatars are supplied square and
                pre-cropped to a circle, so there is no object-fit or offset
                maths here — the earlier version needed it because
                /dinesh.png is a 441x468 torso shot, and that code went with it.

                The overlap is -12px, a quarter of the 48px avatar. The white
                ring is what makes the stack legible: the page behind is white
                too, so the ring is invisible except exactly where the second
                avatar crosses the first, which is the only place it is needed. */}
            <div className="mt-4 flex items-center">
              <img
                src="/team/dinesh-avatar.png"
                alt="Dinesh Reddy Revunuru"
                width={48}
                height={48}
                className="h-12 w-12 flex-none rounded-full ring-2 ring-white"
              />
              <img
                src="/team/claude-avatar.png"
                alt="Claude Code"
                width={48}
                height={48}
                className="-ml-3 h-12 w-12 flex-none rounded-full ring-2 ring-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2b · Establishing shot — HIDDEN 2026-07-30.
          Its scroll did not sync with the rest of the page: a 1588px-tall
          full-bleed band between the overview and the intro band interrupted
          the rhythm rather than joining it. The overview now runs straight
          into the olive intro band, which is a cut the page already knows how
          to make.

          Restoring it is uncommenting this block. Before doing so, three
          things about the asset are still unresolved, all of them reasons it
          may be better rebuilt than restored:
            - the headline is baked into the bitmap, so it renders ~9.5px on a
              phone and cannot rewrap
            - that headline reads "...from business with no human needed ."
            - the frame still carries the client's domain, logo and two
              legible customer names

          hero-v4.png stays on disk. The .cs-hero-band rule stays in
          globals.css and shares the artifact-stage cream with .cs-figure-band;
          if this never returns, both can be deleted together. */}
      {/*
      <section className="cs-hero-band">
        <CaseStudyImage
          src="/case-studies/hss/hero-v4.png"
          width={2880}
          height={1588}
          alt="The admin calendar on a laptop beside the assistant mid-booking on a phone — one week of appointments, and the conversation that fills them."
          wide
          aspectRatio="1440 / 794"
        />
      </section>
      */}

      {/* 3 · Intro band — brand-dark, house pattern. */}
      <section className="cs-intro-band">
        <div className="cs-container">
          <h2 className="cs-intro-label">Intro</h2>

          <h3 className="cs-section-head mt-8">Project overview</h3>
          <div className="mt-5 cs-prose">
            {/* Two paragraphs, house pattern: the situation, then what it cost and
                what the case study is about. The 40%/80% figures are deliberately
                left in words here — the Business goals list below carries the
                numbers, and stating them twice this close reads as a stutter. */}
            <p>
            Most new customers discover the business through paid Google ads, usually while researching privately. 
            The owners had already noticed a shift in user behavior: people were doing most of their research and learning 
            everything they could before contacting the studio.
            </p>
            <p>
            Once customers had made a decision, the website gave them three ways forward. They could call the studio, struggle with a third-party booking widget embedded in the website, or talk to a chatbot that appeared to take a booking but only emailed their details to the owner.
            The chatbot felt like the most comfortable option, but the experience quickly fell apart. Customers received no confirmation, while the owner still had to read their emails, call them back, and enter each appointment by hand. Google could not track which ads became bookings either. Together, these problems were dragging the business down.
            </p>
            <p>
            Fixing the booking system was only the visible part. I needed to make the experience easier for customers, remove the manual work from the owner, and make every booking measurable for the business.
            </p>
          </div>

          <h3 className="cs-section-head mt-10">Business goals</h3>
          <div className="mt-5 cs-prose">
            <CaseStudyList
              items={[
                "Move the new-customer return rate from 40% toward the owners’ target of at least 80%.",
                "Connect paid ads to confirmed appointments and lower the cost per new customer that's as good a best competitors.",
                "Customers should get confirmation notifications and reminders about their appointments.",
                "Support more bookings and scalable systems as the business grows.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* 4 · Problem → Solution → Outcome. The 30-second layer, and the shape
          the market actually asks for: a reader who stops here has the whole
          case, and the five acts below are the evidence for it.

          One container for all three so the labels, statements and metric cards
          share a single left edge — the summary has to read as one object, and
          a second alignment line would break it into three unrelated blocks.
          The rail is cs-container, matching the Intro band's measure exactly. */}
      <section className="cs-container pt-14 sm:pt-20">
        {/* cs-summary-block on all three: each owns 75px of clear air above and
            below on desktop, as padding rather than margin so the values do not
            collapse against each other — 150px of real separation between
            blocks. See .cs-summary-block in globals.css. */}
        <div className="cs-summary-block">
          {/* Same heading style as the Intro band's "Project overview" and
              "Business goals" — these are sections of the case, not metadata,
              and an h3 also puts them in the heading outline where a screen
              reader can navigate them. */}
          <h3 className="cs-section-head">The problem</h3>
          {/* Rewritten 2026-08-11. The previous statement opened on the
              first-timer and closed on "So they book nothing." — verbatim from
              the interviews, and a sharper user image than what replaced it.
              The trade was deliberate: this version names both halves of the
              problem in one sentence, which is the page's thesis (user
              experience is not separate from growth), and the user image moves
              down into the prose. If the verbatim is ever wanted back, it is
              "So they book nothing."

              The full stop lives inside the mark, as on the Uniquefit graphic:
              outside it, the highlight ends on a letter and the stray period
              reads as a detached artefact. */}
          {/* Two rules govern the mark, and both are easy to lose in a rewrite.
              One: read the marked words alone and they must still be a claim —
              "wait for a callback." is the barrier, standalone. Two: the barrier
              has to sit in its own clause to be markable at all. The previous
              draft phrased it inside the need ("needed a way to book without
              waiting for a callback"), and highlighting that reads as a feature
              the customer wanted rather than the thing blocking them.

              Length is the third constraint: the mark is a shortcut past the
              statement, so there has to be a statement to shortcut. At seven
              lines it is a paragraph and the highlight is decoration. Four to
              five is the size this block was tuned for — see the line-height
              note on .cs-summary-statement.

              The full stop lives inside the mark, as on the Uniquefit graphic:
              outside it, the highlight ends on a letter and the stray period
              reads as a detached artefact. */}
          {/* Two tiers of emphasis, chosen 2026-08-11 over one mark and over
              four. The statement carries all four elements of the problem —
              user, need, barrier, business impact — but only two are emphasised,
              and at different weights, so there is still a level-1.

              Bold on the barrier, slab on the impact. Not the reverse: this is a
              business-first case, so the block has to close on what the friction
              cost, and the slab is the last thing read. Four slabs was the
              rejected version — everything emphasised is nothing emphasised,
              the same failure recorded on the outcome cards above.

              The impact sentence is compressed on purpose. A mark is a reading
              shortcut, so it has to be short enough to take in at a glance; the
              fuller version ("Google Ads lost the conversion data...") is
              already carried by the Intro band, which says Google could not
              track which ads became bookings.

              The full stop lives inside the mark and outside the bold. Inside
              the slab because otherwise the highlight ends on a letter and the
              stray period reads as a detached artefact; outside the bold
              because that is just ordinary typography. */}
          <p className="cs-summary-statement mt-6">
            First-time customers researching hair replacement needed a private way to understand
            their options and confirm an appointment. Every way in asked them to pick a service they
            could not name, sign into an account, or{" "}
            <mark className="cs-summary-mark">wait for a callback.</mark>{" "}
            {/* This bridge is load-bearing, not filler. Without it the two slabs
                butt against each other and the last two lines render as one
                striped bar — the colours stop reading as a key and read as a
                single highlight that changed hue. It also states the argument
                the two colours are drawing. */}
            Behind the same handoff,{" "}
            <mark className="cs-summary-mark cs-summary-mark--business">
              the business lost bookings, time, and the data to fix it.
            </mark>
          </p>
          {/* Provenance. The only claim to credibility in this block — the
              statement above it is an assertion until something says where it
              came from. */}

        </div>

        <div className="cs-summary-block">
          <h3 className="cs-section-head">The solution</h3>
          {/* Deliberately the same shape as the problem statement above:
              context, then the pivot in bold, then the business close in the
              slab. The two blocks are read one after the other, so matching the
              emphasis pattern is what makes the solution read as an answer to
              the problem rather than a separate paragraph about the product.

              The bold carries the design judgment — conversation and commitment
              are handled by different systems on purpose. That is the actual
              decision in this project, and burying it in prose would leave the
              block describing what was built instead of why it was split.

              The slab closes on business value, mirroring the problem's close on
              business cost. Written to survive being read alone: no leading
              pronoun, because the marked words have to carry a claim by
              themselves. */}
          <p className="cs-summary-statement mt-6">
            I designed and built one connected path, from research to a confirmed appointment and
            the next visit.{" "}
            <mark className="cs-summary-mark">
              Conversational guidance helped customers understand their options.
            </mark>{" "}
            A predictable booking flow handled the commitment, so{" "}
            <mark className="cs-summary-mark cs-summary-mark--business">
              every booking recorded its conversion and triggered the follow-up.
            </mark>
          </p>
          {/* The four things that were actually built. Kept: the statement above
              says what changed, this says what exists, and the migration counts
              are the only code-verified figures in the block. */}
          <div className="mt-8">
            <CaseStudyList
              items={[
                /* The {" "} after each </strong> is deliberate. A bare space
                   there survives only until the next reflow moves the line
                   break — one of these four already lost it and rendered as
                   "The assistant.Answers". Explicit is the only stable form. */
                <>
                  <strong>The assistant.</strong>{" "}
                  Answers in the brand&rsquo;s voice, guides the service pick, and books before the
                  visitor leaves the page.
                </>,
                <>
                  <strong>The booking platform.</strong>{" "}
                  Built underneath it, because the existing one could not take a booking from
                  someone without an account.
                </>,
                <>
                  <strong>The migration.</strong>{" "}
                  210 stylist notes and 483 photos that existed in no export, loaded behind a match
                  ladder that flagged the ambiguous ones for a person.
                </>,
                <>
                  <strong>The retention machine.</strong>{" "}
                  Email and SMS, because a first visit only roughly breaks even.
                </>,
              ]}
            />
          </div>
        </div>

        <div className="cs-summary-block">
          <h3 className="cs-section-head">The outcome</h3>
          {/* The stage — chosen over the bare variant 2026-07-28 on the
              /outcomes-compare jig. Items run figure-first so the payoff lands
              before its category; see .cs-stage in globals.css for the ladder. */}
          <div className="cs-stage mt-6">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-10">
              {metrics.map((m) => (
                <div key={m.k}>
                  {/* Always rendered, empty where there is no honest baseline,
                      so all three figures share one baseline. Hidden from
                      assistive tech when empty — it is spacing, not content. */}
                  <p className="cs-stage-from" aria-hidden={m.from ? undefined : true}>
                    {m.from ? `from ${m.from}` : " "}
                  </p>
                  <p className={`cs-stage-value${m.lead ? " cs-stage-value--lead" : ""}`}>
                    {m.v}
                  </p>
                  <p className="cs-stage-label">{m.k}</p>
                  <p className="cs-stage-note">{m.note}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Provenance belongs beside the numbers, not in a section 700 lines
              later that most readers never reach. "Reviewed with the owners
              rather than self-reported" is the whole claim to credibility here. */}
          {/* Centred, which is .cs-caption's own default — the text-left
              override that used to be here is gone. It had been aligning the
              line to the stage's left edge; centring sets it under the three
              figures as a group instead, which is what it describes. */}
          <p className="cs-caption mt-5">
            Measured in Google Ads and the client&rsquo;s own booking data, April to late June
            2026, and reviewed with the owners rather than self-reported.
          </p>
        </div>
      </section>

      {/* The shipped-screen moments, moved up out of act three to sit with the
          demo. They are the same argument the demo makes — here is the thing,
          working — so they read as its setup rather than as a detail buried 500
          lines later. Ordered as the customer meets them: choose, book, ask,
          return, get nudged. Media alternates R-L-R-L-R down the band. */}
      <section className="cs-container pt-14 sm:pt-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="order-2 md:order-1">
            <h3 className="cs-section-head-prototype">
            Helping customers choose without knowing the language
            </h3>
            <div className="mt-3 cs-prose">
              <p>
              First-time customers knew they wanted help, but not which of the seven services to book. I added a “Help me choose” path that asks two simple questions and narrows the list to the options that fit. Customers who already know what they want can skip it entirely.
              </p>
            </div>
          </div>
          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            {/* 376 = 344 plus the 32px gutter cs-container subtracts. */}
            <div style={{ maxWidth: 376, width: "100%" }}>
              <CaseStudyVideo
                src="/case-studies/hss/service-guidance.mp4"
                poster="/case-studies/hss/service-guidance-poster.jpg"
                alt="A first-time visitor opens the service list, seven options priced from $45 to $250, and taps Not sure which one? Help me choose. Two questions, whether this is a first system and what they want today, narrow it to the two services that apply, and the flow continues into the date picker."
                aspectRatio="790 / 1236"
                maxWidth={344}
                autoPlay
                loop
                muted
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cs-container pt-14 sm:pt-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex justify-center md:justify-start">
            {/* 376 = the 344 the design asks for, plus the 32px gutter
                cs-container subtracts via width:min(100% - 32px, …). Without
                the compensation the figure resolves to 312. */}
            <div style={{ maxWidth: 376, width: "100%" }}>
              {/* Plays itself, no chrome: the clip reads as a live artifact
                  rather than a media player parked in the page. Muted is not a
                  preference, it is the condition every browser requires before
                  it will autoplay at all (the file carries no audio track
                  either). preload="metadata" rather than "none" because an
                  autoplaying clip has to be ready when it scrolls into view.

                  Sized 344 wide per the design. Height follows the source's own
                  790x1236 aspect and lands at 538, not the 614 the design spec
                  paired with it — forcing 614 would crop 48px of width, taking
                  the avatar off the left edge and the close button off the
                  right. Width is the dimension that matters in a fluid column;
                  height follows. */}
              <CaseStudyVideo
                src="/case-studies/hss/booking-flow.mp4"
                poster="/case-studies/hss/booking-flow-poster.jpg"
                alt="Booking a free consultation on a phone: picking the service and a time, verifying an email with a six-digit code, and landing on a confirmation card that restates the service, stylist, time and location."
                aspectRatio="790 / 1236"
                maxWidth={344}
                autoPlay
                loop
                muted
                preload="metadata"
              />
            </div>
          </div>
          <div>
            <h3 className="cs-section-head-prototype">Making sure every booking ends with certainty</h3>
            <div className="mt-3 cs-prose">
              <p>
              A booking is not complete until the customer knows it worked. The confirmation shows the service, date, time, and address, and only promises an email after one has actually been sent. Returning customers are recognized by email and can finish in four taps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Copy left, video right — the reverse of the section above, so the two
          shipped-screen moments alternate rather than stack the same way. */}
      <section className="cs-container pt-14 sm:pt-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="order-2 md:order-1">
            <h3 className="cs-section-head-prototype">
            Answering the question without overstepping
            </h3>
            <div className="mt-3 cs-prose">
              <p>
              The assistant can explain a service and help customers understand their options. It does not decide whether someone should get a hair system. That judgment stays with the stylist, so the assistant offers a free consultation instead.
              </p>
            </div>
          </div>
          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            {/* 376 = 344 plus the 32px gutter cs-container subtracts. */}
            <div style={{ maxWidth: 376, width: "100%" }}>
              <CaseStudyVideo
                src="/case-studies/hss/service-questions.mp4"
                poster="/case-studies/hss/service-questions-poster.jpg"
                alt="A new visitor reads what the Hair System Service involves, asks whether it is right for them, then asks whether they should get a hair system at all. The assistant declines that one and points them to the stylist and a free consultation."
                aspectRatio="790 / 1236"
                maxWidth={344}
                autoPlay
                loop
                muted
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Media left again, so the four shipped-screen moments alternate
          L-R-L-R down the band without having to reorder the nudge. */}
      <section className="cs-container pt-14 sm:pt-20">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex justify-center md:justify-start">
            {/* 376 = 344 plus the 32px gutter cs-container subtracts. */}
            <div style={{ maxWidth: 376, width: "100%" }}>
              <CaseStudyVideo
                src="/case-studies/hss/account-bookings.mp4"
                poster="/case-studies/hss/account-bookings-poster.jpg"
                alt="Logging in from the greeting: an email address, the same six-digit code used to confirm a booking, then the account opens onto a list of past appointments with the service, date and stylist for each, and a number to call to change one."
                aspectRatio="790 / 1236"
                maxWidth={344}
                autoPlay
                loop
                muted
                preload="metadata"
              />
            </div>
          </div>
          <div>
            <h3 className="cs-section-head-prototype">
            Keeping sign-in out of the way until it is useful
            </h3>
            <div className="mt-3 cs-prose">
              <p>
              The old system required an account before showing an available time. I moved sign-in until after booking, when customers have a reason to use it. The same six-digit email code opens their appointment history, with the service, date, stylist, and a number to call if something changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breaks the two-up rhythm on purpose. This is the only artifact on the
          page that is a REAL conversation rather than a demonstration, and it
          carries a Booked badge, so it gets a centred stack and 1.5x the width
          the paired sections use (344 -> 516). Copy on top, evidence beneath
          it. The customer identifier is blurred in the source file.

          120px above it rather than the band's 80: the extra air is what marks
          the shift from four demonstrations to the one piece of real evidence,
          before the copy has to say so. */}
      <section className="cs-container pt-20 sm:pt-[120px]">
        {/* Measure held to 620 rather than the container's 800: centred text
            past roughly 65 characters a line gets hard to track back to. */}
        <div className="mx-auto max-w-[620px] text-center">
          <h3 className="cs-section-head-prototype">
          Making space for the questions people ask in private
          </h3>
          <div className="mt-3 cs-prose">
            <p>
            Do I have to shave my head? What will it cost? Will it irritate my scalp? These are personal questions customers may feel more comfortable typing than asking aloud. The assistant answers clearly, without pushing for a sale, and opens the booking flow only when the customer is ready.
          
            The conversation below is real—and it ended in a booking
          
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-center sm:mt-10">
          {/* 548 = 516 plus the 32px gutter cs-container subtracts. */}
          <div style={{ maxWidth: 548, width: "100%" }}>
            <CaseStudyImage
              src="/case-studies/hss/conversation-booked.png"
              width={1062}
              height={2526}
              alt="A real customer conversation in the admin transcript, marked Booked. The customer asks whether they have to shave their head, what it costs, and whether a system will irritate a scalp that sweats. Each answer ends by pointing at the free consultation, and the last message opens the booking form."
              maxWidth={516}
            />
          </div>
        </div>
      </section>

      {/* The rebook nudge had a section here. Removed 2026-08-10: its copy was
          a near-verbatim duplicate of act four ("Automate the coming back"),
          which makes the same consent-split argument in more depth, and its
          recording was never captured. The retention story is not lost, it just
          lives in one place now. */}

      {/* The proof of life, immediately after the proof. A visitor who reads
          only the summary still gets to operate the thing — which is the whole
          point of shipping an operable demo rather than a video. A sibling of
          the summary section, not a child: it runs a 1200px rail, and inside
          the 800px container its copy column was being squeezed to 296px. */}
      <HssDemoEmbed />

      {/* ── The 30-second layer ends here ── */}

      {/* 4a · The hand-off from summary to case. One line, then air.
          This was a contents list with a read-time and five jump links — which
          braked the reader at the exact moment the outcome had earned their
          attention, and duplicated navigation the act landmarks already
          provide. The Phase One band below is a strong enough visual event on
          its own; what it needed in front of it was a sentence, not a menu. */}
      {/* Everything from here to the Next rail is gated on SHOW_ACTS. The
          contents are left at their original indentation deliberately:
          re-indenting ~900 lines to sit inside this block would bury a
          four-line change in a nine-hundred-line diff and make the eventual
          restore unreviewable. */}
      {SHOW_ACTS && (
        <>
      <section className="cs-container cs-handoff">
        <p className="cs-handoff-line">That is what changed. What follows is how.</p>
      </section>

      {/* 4 · Act one */}
      <div id="diagnose">
        <CaseStudyPhase
          number="one"
          label="Diagnose"
          claim="Three complaints, from two owners, turned out to be one broken handover."
        />
      </div>

      <CaseStudySection heading="Three problems, from the people who own them">
        <p>
          I started with the stakeholders rather than the screens. Two people run this business and
          they arrived with three separate problems that turned out to be one problem.
        </p>
        {/* These three quotes also appear on the P1 board directly below, so on
            desktop they would be read twice. But the board is a 1200px drawing:
            at a 375px viewport it scales to 0.286 and its 21px quotes land at
            6px, which is not small, it is gone. So the duplication is the
            mobile edition of this content, not waste.

            md:sr-only, not md:hidden. Both remove the quotes from view at the
            md breakpoint; sr-only keeps them in the accessibility tree, which
            matters because the board is pixels and its alt text describes the
            composition rather than carrying the three quotes. Switching this to
            md:hidden would silently drop three verbatim customer quotes for
            every screen-reader user on desktop.

            sr-only is position:absolute, so the mt-6 rhythm collapses cleanly
            on desktop rather than leaving three empty gaps. */}
        <blockquote className="cs-insight-quote md:sr-only">
          We have damn good customer feedback and everyone is loving the service, but the new
          customer return is pathetic. We expect at least 80%. We&rsquo;re at 40%.
          <span className="mt-2 block text-[13px] not-italic opacity-60">
            Managing partner and stylist
          </span>
        </blockquote>
        <blockquote className="cs-insight-quote mt-6 md:sr-only">
          We&rsquo;re spending more on ads for less than our competitors.
          <span className="mt-2 block text-[13px] not-italic opacity-60">CEO</span>
        </blockquote>
        <blockquote className="cs-insight-quote mt-6 md:sr-only">
          There&rsquo;s huge scope selling products online and it isn&rsquo;t going as expected. We
          planned a second store last year and didn&rsquo;t have the confidence to open it.
          <span className="mt-2 block text-[13px] not-italic opacity-60">CEO</span>
        </blockquote>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/p1-three-complaints-v3.png"
          width={2400}
          height={2074}
          alt="P1 · Three complaints. One cause. Three quoted columns converging on one broken handover."
          maxWidth={1200}
          aspectRatio="16 / 10"
          wide
        />

      </section>

      <CaseStudySection heading="How I found out" spacing="tight">
        {/* The interview count and the audit are already stated in the Problem
            section above, so this no longer re-introduces them — it just says
            what the audit actually covered. */}
        <p>
          The audit ran the whole path: the website, the booking tool embedded in it, the existing
          chatbot and the questions people actually asked it, site performance, what people search
          for before they arrive, and where the Google and Meta ad money was going.
        </p>
        <p>
          I also pulled apart what the competition was doing to the same customer. Lord Hair and
          LaVivid both run mature email programmes into this market, so I read their sequences the
          way a customer receives them &mdash; what arrives, when, and what it asks for &mdash; and
          used the gaps as the brief for what this business should send instead.
        </p>
      </CaseStudySection>

      {/* The loop. This is the diagnosis the rest of the case rests on, and it
          was buried in a bullet under "for the business". */}
      <CaseStudySection heading="A booking problem that had become an ad problem">
        <p>
          The most expensive thing wrong here was not visible from any single seat in the business.
          The old form collected an enquiry and emailed it to the owner, which meant no conversion
          event ever reached Google. The bidding algorithm kept spending, but it could no longer see
          which clicks turned into customers &mdash; so it optimised against numbers nobody in the
          business trusted, and the cost of every acquisition climbed.
        </p>
        <p>
          That is a loop, not a line. A higher cost per conversion buys fewer bookings, fewer
          bookings produce even less signal, and the next round of spending is worse informed than
          the last. In the worst month the ads were paying between $98 and $110 for a conversion
          the system could not even confirm had happened.
        </p>
        <p>
          <strong>
            The owner saw phone tag. The stylist saw customers leaving. The ad account saw rising
            cost. Same loop.
          </strong>{" "}
          Three separate complaints, one broken handover &mdash; which is exactly why it had gone
          unsolved.
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/b4-one-loop-v3.png"
          width={2400}
          height={2080}
          alt="B4 · One loop, feeding itself. Four stages wired into a closed circuit, with the cost it produced sitting inside it."
          maxWidth={1200}
          aspectRatio="16 / 9"
          wide
        />

      </section>

      {/* Personas, drawn from the interviews and the audit. */}
      <CaseStudySection heading="Who was losing out">
        <div className="mt-2 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
          {personas.map((p) => (
            <div key={p.who}>
              <p className="cs-section-head">{p.who}</p>
              <p className="mt-2 t-body text-[color:var(--color-body-ink)]">{p.pain}</p>
            </div>
          ))}
        </div>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/u2-five-ways-v3.png"
          width={2400}
          height={1964}
          maxWidth={1200}
          alt="U2 · The same failure, five different ways. Five peers — three who buy from the business, two who are the business."
          wide
          aspectRatio="16 / 10"
        />

      </section>

      <CaseStudySection heading="What was actually broken">
        <p>
          The same failure hit all three groups differently, which is why nobody had solved it. Each
          person only saw their share of it.
        </p>

        <p className="cs-meta-label mt-8">For the customer</p>
        <CaseStudyList
          items={[
            <>
              The chatbot could answer questions but could not take a booking. It behaved like a
              contact form.
            </>,
            <>
              No confirmation, no date, no time. People asked &ldquo;will I get a confirmation
              email?&rdquo; and nothing came.
            </>,
            <>
              The booking tool loaded so slowly inside the site that people assumed the site was
              broken, and called the store instead.
            </>,
            <>
              A first-timer&rsquo;s questions went unanswered. A Spanish speaker&rsquo;s went
              unanswered entirely.
            </>,
          ]}
        />

        <p className="cs-meta-label mt-8">For the staff</p>
        <CaseStudyList
          items={[
            <>A booking made on Saturday was not seen until Monday.</>,
            <>
              Every booking meant a call back to agree a time and the services. Tedious in both
              directions.
            </>,
            <>
              The stylist was expected to be fluent in several pieces of software at once, which was
              never her job.
            </>,
          ]}
        />

        <p className="cs-meta-label mt-8">For the business</p>
        <CaseStudyList
          items={[
            <>
              Google Ads could not track the conversions, so spend was being optimised against
              numbers nobody trusted. In the worst month, $98 to $110 per conversion.
            </>,
            <>
              Bookings from the chatbot were invisible to Google Ads and Tag Manager entirely.
            </>,
            <>
              A first visit roughly breaks even. The profit is in the second one. So a retention
              problem was really a margin problem.
            </>,
          ]}
        />
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/p3-two-doors-v3.png"
          width={2400}
          height={2074}
          alt="P3 · Two ways in. Both leaked. One entrance forking into a silent form and a sign-in wall, each with its own failure."
          maxWidth={1200}
          aspectRatio="16 / 10"
          wide
        />

      </section>

      <CaseStudyCallout label="The three problems were one problem">
        Retention, ad cost, and the confidence to open a second store were all downstream of the
        same broken handover between the business and its customers.
      </CaseStudyCallout>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/p2-problem-statement-v3.png"
          width={2400}
          height={1616}
          alt="P2 · The problem statement and the bet I took to the owner."
          maxWidth={1200}
          aspectRatio="16 / 10"
          wide
        />

      </section>

      {/* The provenance chain. */}
      <section className="pt-12 sm:pt-16">
        {chain.map((c, i) => (
          <div key={c.alt}>
            {/* src/width/height are optional across the chain: entries that
                have a real asset render it, the rest stay labelled
                placeholders. aspectRatio only governs the placeholder, so it
                is inert once a source exists. */}
            <CaseStudyImage
              src={c.src}
              width={c.width}
              height={c.height}
              alt={c.alt}
              caption={c.caption ?? undefined}
              aspectRatio="16 / 10"
            />
            {i < chain.length - 1 && <ChainArrow />}
          </div>
        ))}
      </section>

      {/* The one pull moment. */}
      {/* The old headline, given its second life — here the reader has the
          evidence for the metaphor, which they did not have at the top. */}
      <CaseStudySection
        heading="Great service. Broken front door."
        headingVariant="prototype"
      >
        <></>
      </CaseStudySection>

      <CaseStudySection heading="Where I started">
        <p>
          In-store revenue was the backbone, so the path into the chair went first. I mapped every
          candidate fix on an impact and effort matrix and started where the impact was highest and
          the effort was survivable.
        </p>
        <p>
          The biggest decision was what <em>not</em> to do. Replacing the live booking system and
          POS outright, in the middle of the summer peak, would have put the client&rsquo;s busiest
          weeks on software that had existed for a fortnight. So the assistant shipped
          <em> alongside</em> Vagaro rather than instead of it. Availability was cross-checked
          against both systems so the two could never double-book, and the entire rollback plan was
          removing one script tag from the site.
        </p>
        <p>
          I also chose not to let the model do the booking. Free-text chat can collect a service, a
          date and an email, but it can do it wrong, and a wrong booking costs a real person a real
          trip. The assistant handles the conversation; a deterministic form handles the commitment.
          The AI charms, the form executes.
        </p>
        <p>
          Ecommerce was the third candidate and scored highest on ambition and lowest on
          survivability, so it was cut. It is still the weakest part of the business, and naming it
          as unfinished is more useful to the owners than a half-built store.
        </p>
      </CaseStudySection>

      {/* Built 2026-07-31, Figma node 190:240. The slot used to promise "the
          impact and effort matrix" and was marked BLOCKED because the full
          candidate list was never written down. A 2x2 with three dots would
          claim to be the whole matrix, so the board is a decision record
          instead: the three calls the prose above puts on record, with their
          verdicts and reasons, plus the architectural refusal. Nothing on it
          goes beyond what the section already states.

          Rendered at 1200 in a cream band like the other boards — at the old
          720 cap its 13px labels would land at 7.8px. */}
      <section className="cs-figure-band">
        <CaseStudyImage
          src="/case-studies/hss/s1-three-candidates-v3.png"
          width={2400}
          height={1480}
          alt="S1 · Three candidates. One shipped. The assistant alongside Vagaro shipped, replacing the booking system outright was rejected, ecommerce was cut."
          maxWidth={1200}
          wide
        />
      </section>

      {/* 5 · Act two */}
      <div id="assistant">
        <CaseStudyPhase
          number="two"
          label="Ship the assistant in three days"
          claim="The hard part was not the three days. It was making a stranger feel unhurried enough to book."
        />
      </div>

      <section className="cs-container pt-12 sm:pt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <Benefit
            bold="She answers at midnight and books before you close the tab."
            plain="Guided service pick, real slots, and a confirmation with a date and time on it."
          />
          <Benefit
            bold="She checks you are real before she holds a chair."
            plain="A one-time code on email, which quietly ended the spam bookings."
          />
        </div>
      </section>

      {/* Conversation design. The case had none of this — the interface most
          people will actually meet was described only by its outcomes. */}
      <CaseStudySection heading="The hardest constraint was not technical">
        <p>
          These customers are often self-conscious about hair loss. Many arrive from an ad, quietly,
          researching something they have not told anyone about. So the assistant had to feel
          private and unhurried, never like a form interrogating them &mdash; and that single
          principle decided more of the design than any technical requirement did.
        </p>
        <p>
          It answers in one to three short sentences, plain language, one question at a time. It
          never invents a price, a time or a policy: if a fact is not in front of it, it says so and
          offers the phone number. And it hands off to a person the moment something is genuinely
          human &mdash; a complaint, a refund, a change to an appointment someone already has.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Three people arrive, wanting different things">
        <CaseStudyList
          items={[
            <>
              <strong>The new prospect.</strong> Anxious, researching discreetly, wants to
              understand what the process actually involves and what it costs. Gets a warm answer
              and a nudge toward a free consultation &mdash; never a hard sell.
            </>,
            <>
              <strong>The returning client.</strong> Knows exactly what they want and needs a slot.
              Recognised by email, greeted by first name, four taps to done.
            </>,
            <>
              <strong>The decided booker.</strong> Knows the service, wants the first open time and
              out. &ldquo;Book an appointment&rdquo; opens the wizard immediately.
            </>,
          ]}
        />
        <p>
          The same system serves all three because the conversation and the booking are separate
          mechanisms. Talking is open-ended and forgiving; booking is a fixed sequence that cannot
          be improvised. Each is good at exactly the thing the other is bad at.
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/c4-four-tools-v3.png"
          width={2400}
          height={1352}
          alt="C4 · Four tools. None of them writes. Four named tools on one row, and a fifth position left empty."
          maxWidth={1200}
          aspectRatio="16 / 9"
          wide
        />

      </section>

      <CaseStudySection heading="One decision per screen, never a form wall">
        <p>
          Booking runs as a step machine &mdash; service, date, time, email, a six-digit code, name,
          confirm, done. Only genuinely open times appear. Identity is verified with a code rather
          than a password, so there is nothing to remember and nothing to leak. A returning customer
          skips the name step entirely and the flow collapses to four taps.
        </p>
        <p>
          On confirm, the appointment writes to the salon&rsquo;s own database and the card restates
          the date, time, service and address &mdash; because the thing the old form never did was
          tell anyone what happened next. It does not claim a confirmation email was sent unless the
          system actually sent one.
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/c2-machine-collapsed-v3.png"
          width={2400}
          height={1748}
          maxWidth={1200}
          alt="C2 · The same machine, collapsed. Eight screens, three of them struck through for a returning customer."
          wide
          aspectRatio="16 / 9"
        />

      </section>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/c5-facts-and-prices-v3.png"
          width={2400}
          height={1902}
          maxWidth={1200}
          alt="C5 · Facts are baked in. Prices never are. Two stores with opposite rules, and what happens when a price changes."
          wide
          aspectRatio="16 / 10"
        />

      </section>

      <CaseStudySection heading="Then the integration failed">
        <p>
          Vagaro&rsquo;s API could read, but it could not write a booking for anyone who was not
          already in their system. Their create-customer endpoint routed to a delete handler, and
          create-appointment rejected inline customer data with &ldquo;No customer was found.&rdquo;
        </p>
        <p>
          I proved it with seven probe scripts and more than fifty API calls, wrote up the finding,
          and gave the owner three costed paths rather than picking one myself. A first-time
          customer talking to the assistant could never reach the booking calendar.
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/t3-api-stranger-v3.png"
          width={2400}
          height={2328}
          alt="T3 · The API that couldn't meet a stranger. Seven probes down a spine, the verbatim error, and three costed paths."
          maxWidth={1200}
          aspectRatio="16 / 10"
          wide
        />

      </section>

      <CaseStudyCallout label="Why the rebuild happened">
        The replacement booking system was not ambition. It was the only way the chatbot could
        produce a real appointment.
      </CaseStudyCallout>

      {/* 6 · Act three */}
      <div id="platform">
        <CaseStudyPhase
          number="three"
          label="Rebuild the booking platform"
          claim="The old system could not take a booking from a stranger, and its best records existed in no export."
        />
      </div>

      <CaseStudySection heading="What the API could not give me">
        <p>
          The client&rsquo;s most valuable records were not in any API or any export. The dated
          stylist notes with colour formulas and allergies, and the before and after photos, existed
          only inside Vagaro&rsquo;s logged-in web interface.
        </p>
        <p>
          I reverse-engineered the internal merchant API and pulled them into a staging folder that
          touched no database, then loaded them behind a match ladder that skipped anyone whose name
          was ambiguous and printed those cases for a person to resolve. 210 notes and 483 photos
          landed in production.
        </p>
        <p>
          <strong>A returning client sat down and their stylist already knew their formula.</strong>
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/t4-match-ladder-v3.png"
          width={2400}
          height={2370}
          alt="T4 · What the loader refused to guess. A descending match ladder that stops at ambiguous, and the 210 it wrote."
          maxWidth={1200}
          aspectRatio="4 / 3"
          wide
        />

      </section>

      <section className="cs-container pt-12 text-center sm:pt-16">
        <h3 className="cs-section-head-prototype">The dashboard the team actually runs on</h3>
      </section>
      <CaseStudyImage
        alt="RECORDING · Admin dashboard — calendar resolving, a customer record opening with visit photos and stylist notes."
        wide
        aspectRatio="16 / 9"
      />

      {/* 7 · Act four. Starved on purpose. Anchored like its siblings — it was
          the one act with no id, so the threshold list could not reach it. */}
      <div id="automate">
        <CaseStudyPhase
          number="four"
          label="Automate the coming back"
          claim="A first visit breaks even. The profit is in the second one, so I built the machine that goes and gets it."
        />
      </div>

      <CaseStudySection>
        <p>
          A first visit roughly breaks even. The profit is in the second one. So the machinery that
          brings people back is not a nicety at the end of the project &mdash; it is where the
          margin actually lives, and it was the last thing standing between the business and a
          second store.
        </p>
        <p>
          Email became the default. Then customers started asking for texts instead, so I added SMS,
          split in code between the appointment texts someone consents to by booking and the
          marketing they have not, with the legal reasoning written inline beside the split so the
          next person to touch it cannot get it wrong by accident.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Ten campaigns, and the time they used to take">
        <p>
          I designed and built the campaign library the business now runs on &mdash; a welcome
          email, a new-client offer, bestsellers, seasonal sales, and a Memorial Day set that went
          through four rounds before it went out. Each one is hand-built HTML with its own artwork
          rather than a template with the logo swapped.
        </p>
        <p>
          <strong>
            Planning, designing, building and sending a campaign used to take three to five hours.
            It now takes about five minutes.
          </strong>{" "}
          That figure is my own measurement of the work before and after, not a number the system
          reports.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        alt="SCREENS · The campaign library, with the four-round Memorial Day progression."
        wide
        aspectRatio="16 / 9"
      />

      {/* The brand system. Real, substantial, and previously invisible in the
          case — which left "answers in the brand's voice" unexplained. */}
      <CaseStudySection heading="There was a brand, because I built that too">
        <p>
          Before any of this, the business had no consistent identity to speak in. I designed the
          wordmark and monogram through to final artwork, in light and dark, square and circular
          lockups &mdash; then the things a physical business actually needs: window glass, the
          reception wall, exterior signage with and without the tagline, social covers and the
          in-store poster that points customers at the booking flow.
        </p>
        <p>
          That work is why the assistant can be said to answer &ldquo;in the brand&rsquo;s
          voice&rdquo; at all. There was a voice to answer in, and the same person defined it.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        alt="ARTWORK · Identity system — wordmark, monogram lockups, signage, and window applications."
        wide
        aspectRatio="16 / 9"
      />

      {/* ── Optional-depth band opens ── */}
      <div className="cs-depth-band">
        <div className="cs-container cs-depth-band__head">
          <p className="cs-meta-label">The build, in detail</p>
          <a href="#results" className="cs-depth-band__skip">
            Skip to results
          </a>
        </div>

        <CaseStudySection heading="The design system is written in TypeScript">
        <p>
          There is no Figma library for this product. The system lives in the code, as tokens with
          the reasoning kept next to them: one accent used sparingly, a gold reserved for a single
          spot, warm near-whites rather than stark ones, text that is never pure black, and 1px
          hairlines instead of borders. The chatbot&rsquo;s tokens deliberately mirror the native
          app&rsquo;s, so the two surfaces stay one product.
        </p>
        <p>
          Designing directly in the running build is a choice I would defend rather than apologise
          for &mdash; it is only available to someone who owns both halves, and it is why the
          shipped interface and the design never drifted apart. The tradeoff is honest: there is no
          artefact to show a client mid-project, so the working product has to be the artefact.
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/ds-token-file-v3.png"
          width={2400}
          height={2124}
          alt="DS · The design system is written in TypeScript. Six tokens with their shipped comments beside them."
          maxWidth={1200}
          aspectRatio="16 / 9"
          wide
        />

      </section>

      {/* 8 · Designed for everyone. Every row verifiable in the codebase. */}
      <CaseStudySection heading="The front door has to work for everyone">
        <p>
          The system in front of it should do the same. Most of this never gets noticed, which is
          the point.
        </p>
        <CaseStudyList
          items={[
            <>
              <strong>People who find hair loss hard to talk about.</strong> The second paragraph of
              the assistant&rsquo;s instructions tells it to be kind and discreet and never make anyone
              feel awkward. It will not diagnose. It offers a free consultation or a medical
              professional instead.
            </>,
            <>
              <strong>Older eyes and unsteady hands.</strong> High contrast on the primary action,
              every control at least 40px tall, and inputs at 16px so iPhones stop zooming the page
              on focus.
            </>,
            <>
              <strong>People who get motion sick.</strong> Reduced-motion collapses every animation,
              and the typewriter effect returns the full text instantly instead of animating it.
            </>,
            <>
              <strong>Screen reader users.</strong> The transcript announces new messages without
              re-reading the conversation. Every icon-only control has a real label.
            </>,
            /* Cut from eight items to five. "People who do not know what to
               book" restated the "One decision per screen" section, and "Staff
               who are not technical" restated the stylist persona — both were
               the list agreeing with the case rather than adding to it.
               "Anyone in private browsing" was true but the thinnest claim
               here. The owner-override stays: it is the one item that shows a
               rule being deliberately broken, which is a judgment call rather
               than a compliance checkbox. */
            <>
              <strong>The owner who needs to break the rule.</strong> Double-booking is blocked by
              the database, then deliberately overridable. The slot turns red and the button
              relabels itself to &ldquo;Create double booking.&rdquo;
            </>,
          ]}
        />
      </CaseStudySection>

      {/* 9 · Technical. Written from the codebase. */}
      <CaseStudySection heading="How it is built">
        <p>
          Bookings live in Postgres. Availability comes from one database function that replaced
          three conflicting versions of the same logic, and a database constraint makes
          double-booking impossible rather than unlikely. While both systems ran, a time was offered
          only if it was free in both, so we never showed an hour we would then have to take back.
        </p>
        <p>
          Identity runs on a hashed, rate-limited six-digit email code rather than a password, and
          the verified email and its short-lived token live in a signed blob the model can neither
          read nor set. The language model is structurally walled off from the auth material rather
          than politely asked to leave it alone.
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/t2-both-calendars-v3.png"
          width={2400}
          height={2080}
          maxWidth={1200}
          alt="T2 · Free in both, or not offered. One morning checked against both calendars, and only one time survives."
          wide
          aspectRatio="16 / 10"
        />

      </section>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/t1-one-record-v3.png"
          width={2400}
          height={2126}
          maxWidth={1200}
          alt="T1 · Every surface, one record. Four doors dropping into one database."
          wide
          aspectRatio="16 / 10"
        />

      </section>

      {/* The framework. The most portable thing in the project. */}
      <CaseStudySection heading="How I build with a model: define, constrain, write, iterate">
        <p>
          A reliable AI product is not a clever prompt, it is a repeatable process. I wrote this one
          as a contract the model has to operate inside, and the order matters &mdash; the
          constraints come before the capabilities.
        </p>
        <CaseStudyList
          items={[
            <>
              <strong>Define.</strong> One narrow job: answer questions about this business, and
              move a ready customer into a booking. The reader is an anxious person on a website, so
              the output is short and plain, never a wall of text.
            </>,
            <>
              <strong>Constrain.</strong> The never-dos, written before a line of the prompt. Never
              invent a price or a time, never compute a date, hand off to a human the moment
              something is genuinely human &mdash; a complaint, a refund, a change to an existing
              appointment. Guardrails before tools.
            </>,
            <>
              <strong>Write.</strong> Only then the contract itself: role, context, instructions,
              guardrails, acceptance criteria, and a fixed output shape. The shape is enforced in
              code, not requested in prose.
            </>,
            <>
              <strong>Iterate.</strong> Test against real booking attempts, off-topic questions and
              prompt-injection tries. When something fails, fix the one layer responsible &mdash;
              usually a guardrail &mdash; and re-run. After launch the same loop ran against real
              transcripts, which is where the knowledge base got the questions I had not thought of.
            </>,
          ]}
        />
        <p>
          The model choice fell out of the constraints rather than the other way round. The task is
          bounded, public and latency-sensitive, so it runs on Claude Haiku &mdash; fast and cheap,
          with the deterministic tools doing the exact work. The system prompt is cached rather than
          re-paid every turn, history is capped, and output is capped, so a conversation costs a
          fraction of a cent on a page that has to stay fast under ad traffic.
        </p>
      </CaseStudySection>

        <CaseStudyCallout label="Stack">
          Next.js · React · TypeScript · Supabase Postgres · Claude · Deno Edge Functions · Resend ·
          Klaviyo · GA4 and Google Ads · Vercel
        </CaseStudyCallout>
      </div>
      {/* ── Optional-depth band closes ── */}

      <CaseStudySection heading="Going live was designed to be reversible">
        <p>
          Every migration was additive &mdash; a new enum value, a few functions, tables that
          nothing existing depended on. The website integration was a single script tag replacing
          the old form, so rolling the whole thing back meant deleting one line. When the time came
          to leave the old system behind for good, that turned out to be two environment variables
          rather than a rewrite.
        </p>
        <p>
          I tested it the way a customer would: book through the widget, confirm the appointment
          lands in the admin calendar tagged as a website booking, the owner&rsquo;s email fires,
          the reminder queues, and the conversion records against the ad account.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Then I watched people use it">
        <p>
          Shipping was the halfway point. Starting a second booking could overlap the first, so I
          fixed the state handling. People wanted to change their mind mid-flow, so I made every
          step navigable backwards without starting over. Real transcripts showed questions the
          knowledge base had never anticipated, and each one went in.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="The honest part" spacing="tight">
        <p>
          My Vagaro status mapping had no branch for &ldquo;Deleted,&rdquo; so a cancelled
          appointment came back as booked. It held the slot, and rebooking that hour failed to sync
          at all. Cancel and rebook, the most routine thing a front desk does, was quietly broken
          until I found it. The fix was one line. The comment explaining the damage was six.
        </p>
      </CaseStudySection>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/t6-cancelled-booked-v3.png"
          width={2400}
          height={2250}
          maxWidth={1200}
          alt="T6 · Cancelled came back as booked. A status mapping with one missing branch, and what fell through it."
          wide
          aspectRatio="16 / 10"
        />

      </section>

      {/* 10 · Results — act four. It had no landmark at all: the case's only
          outcome section opened at the same weight as "How I found out", so the
          one thing a recruiter came for was indistinguishable from a method note. */}
      <div id="results">
        <CaseStudyPhase
          number="five"
          label="Results"
          claim="$105 to $40 per new customer, and a return rate that moved from 40% to 72%."
        />

        <CaseStudySection heading="What changed">
          <p>
            Both systems went live within a month of each other. Cost per new customer fell from
            $105 to $50, then to $40 &mdash; the number the owners had been asking for. 86 bookings
            came through the assistant in two months. Return rate moved from 40% to 72%, against a
            target of 80%.
          </p>
          <p>
            About a third of conversations end in a booking. I am not putting a cleaner number on
            that than I can defend: what the percentage is <em>of</em> was never resolved, and a
            conversion rate without a settled denominator is a number that looks like evidence
            without being any.
          </p>
          <p>
            We asked loyal customers open-ended questions about the booking experience without
            telling them which system was which. They preferred the new one.
          </p>
        </CaseStudySection>
      </div>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/u4-intent-paths-v3.png"
          width={2400}
          height={1724}
          maxWidth={1200}
          alt="U4 · Where the intent used to go to die. The same ad click down both paths, stage by stage."
          wide
          aspectRatio="16 / 10"
        />

      </section>

      <section className="cs-figure-band">

        <CaseStudyImage
          src="/case-studies/hss/r1-what-it-came-to-v3.png"
          width={2400}
          height={1760}
          alt="R1 · What it came to. $105 to $40, 86 bookings, and the retention that stopped short of its target."
          maxWidth={1200}
          aspectRatio="16 / 7"
          wide
        />

      </section>

      {/* 11 · Verification */}
      <CaseStudySection heading="Who verified it" spacing="tight">
        <p>
          The cost figures come from the client&rsquo;s Google Ads account and the return rate from
          their own booking data; both were reviewed with the owners rather than self-reported. The
          migration counts are the ones the loader actually wrote, not the ones it extracted.
        </p>
      </CaseStudySection>

      {/* 12 · Honest limits */}
      <CaseStudySection heading="What is still open" spacing="tight">
        <p>
          Retention reached 72% against a target of 80%, so it is not finished. Ecommerce is still
          the weakest part of the business, and the next thing to fix.
        </p>
        <p>
          The Spanish gap I found in research is still a gap. Nothing in the system is translated
          yet. It is the clearest piece of unfinished work in this project and I would rather name
          it than let the case imply otherwise.
        </p>
        <p>
          What comes next is sequenced by risk, not by appetite. A voice agent to replace the
          owner&rsquo;s confirmation calls, then cancel and reschedule inside the conversation.
          Retiring Vagaro entirely &mdash; payments, POS and all &mdash; waits until after peak
          season, because a checkout failure in August costs real clients and a checkout failure in
          November costs a weekend.
        </p>
      </CaseStudySection>
        </>
      )}

      {/* 12c · Conclusion. Sits outside the SHOW_ACTS gate on purpose, so it
          closes the page in both states — after the demo while the acts are
          hidden, and after act five when they return.

          It is doing real work right now: with the acts off, the page would
          otherwise end on an embedded widget and a Next link. This is the only
          place the case says what the work meant rather than what it did. */}
      {/* Asymmetric padding on purpose. The Next rail contributes only its own
          48px above itself, which left the closing line sitting almost on top of
          the navigation — measured 0px between the paragraph box and the rail.
          More air above than below is the right imbalance here: the statement
          needs separating from the demo it follows, while the rail beneath it is
          minor navigation rather than a peer section. */}
      <section className="cs-container pt-16 sm:pt-24 pb-8 sm:pb-12">
        <h3 className="cs-section-head-prototype">The chatbot was only the beginning.</h3>
        <div className="mt-4 cs-prose">
          <p>
            What looked like a chatbot problem turned out to include booking, measurement, and
            retention. Solving those pieces together taught me where I do my best work: finding
            the point where a better customer experience also creates a healthier business.
          </p>
        </div>
      </section>

      {/* The two admin surfaces, answering the sentence above rather than
          decorating it: the paragraph claims the work grew to include booking
          and retention, and these are those two systems.

          Captions are one line each and describe what the screen does, not what
          it contains — a caption that lists widgets makes the reader audit the
          image instead of reading the claim. */}
      {SHOW_CLOSING_IMAGES && (
        <CaseStudyGallery
          cols={2}
          items={[
            {
              src: "/case-studies/hss/admin-calendar.png",
              width: 715,
              height: 446,
              alt: "The admin calendar, one week of appointments, colour-coded by status",
              caption:
                "The calendar that replaced the owner’s phone. Colour carries status, and each card is badged with where the booking came from — web chat, app, Instagram or the front desk.",
            },
            {
              src: "/case-studies/hss/admin-marketing.png",
              width: 715,
              height: 446,
              alt: "The marketing screen, where booking events are wired to email and SMS flows",
              caption:
                "The retention side. Every booking event syncs to the email and SMS platform on its own, so the follow-up that earns a second visit runs without anyone remembering to send it.",
            },
          ]}
        />
      )}

      {/* 13 · Next rail — removed 2026-08-11. The page now ends on the closing
          statement and its two screenshots, and a Home/Next rail underneath was
          reaching for the reader before the last sentence had landed. The
          footer already carries the way out. */}

      <SiteFooter />
    </main>
  );
}
