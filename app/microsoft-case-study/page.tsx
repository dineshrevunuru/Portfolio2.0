import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import CaseStudySection from "../components/case-study/CaseStudySection";
import CaseStudyPhase from "../components/case-study/CaseStudyPhase";
import CaseStudyImage from "../components/case-study/CaseStudyImage";
import CaseStudyGallery from "../components/case-study/CaseStudyGallery";
import CaseStudyList from "../components/case-study/CaseStudyList";
import CaseStudyCallout from "../components/case-study/CaseStudyCallout";

export const metadata: Metadata = {
  title: "A knowledge portal for the Surface field team — Dinesh Revunuru",
  description:
    "Project Apollo 3.0: a redesign of Microsoft's Surface Knowledge Portal, with an assistant that answers before a request gets raised. Research across four countries, a new information hierarchy, and a measurement layer for the people running it.",
};

/* ------------------------------------------------------------------ *
 * DRAFT — built 2026-08-11 from the Microsoft APOLLO 3.0 Figma file
 * (qv8e9nxJLT3lKgYgmiOKyL). Everything in prose here is traceable to an
 * artefact in that file; nothing is inferred about outcomes.
 *
 * NDA (see AGENTS.md → Content rules): Neudesic work is names and scale
 * only. No metrics, and never a claim that it shipped to production. The
 * dollar figures visible in the admin mockups are envisioning content —
 * the deck says so itself — and are deliberately absent from this page.
 *
 * Empty CaseStudyImage / CaseStudyGallery slots render as labelled
 * placeholders. Each one names the Figma section it comes from so the
 * asset can be exported without hunting for it.
 * ------------------------------------------------------------------ */

/**
 * The teams the discovery interviews actually covered, verbatim from
 * the deck's USER INTERVIEWS slide. Roles are quoted rather than tidied —
 * "Certified Device Specialist" is Microsoft's own title, and flattening the
 * list to "sales and support" would lose the point, which is that six people
 * doing six different jobs all described the same portal.
 */
const regions = [
  { where: "Japan", who: "Presales and technical support" },
  { where: "China", who: "Presales and technical support" },
  {
    where: "United Kingdom",
    who: "Certified Device Specialists, responsible for Surface business development",
  },
  {
    where: "United Kingdom",
    who: "Responsible for the Surface education business across the EU and Africa",
  },
  {
    where: "Netherlands",
    who: "Service Specialist, responsible for Surface business in the public sector",
  },
];

/**
 * The two personas from the deck, kept in their own words. Both primary goals
 * are quoted exactly — including "in the go", which is how it is written on
 * the slide. Correcting it would be tidying a research artefact after the
 * fact.
 */
const personas = [
  {
    who: "The APEC sales specialist",
    region: "Tokyo, Japan",
    tenure: "Three months on the portal",
    goal: "I want to raise IRT requests with ease and be able to track my requests",
    pain: "Opens the portal a few times a week looking for sales collateral, an IRT request or a report. Can raise a ticket without much trouble, then cannot follow what happens to it.",
  },
  {
    who: "The EU Surface specialist",
    region: "United Kingdom",
    tenure: "Six months on the portal",
    goal: "I want to find the surface sales collateral in the go",
    pain: "Lives in the marketing SharePoint because that is where the collateral actually is, which means the portal is one more place to look rather than the place to look.",
  },
];

/**
 * Pain points as written on the persona slides. These are the spine of the
 * whole redesign: four of the six are search and content problems, and the
 * last one is the reason the escalation tracker exists at all.
 */
const painPoints = [
  "Content is not localised for the region the person is selling into.",
  "Indexing and fields do not match how people describe a product or a process, so search misses.",
  "Knowledge articles cannot be taken away — there is no download.",
  "The work spans several applications, and the portal keeps sending people out of it.",
  "There is no historical view across the devices a customer already has.",
  "A ticket is easy to create and impossible to follow.",
];

export default function MicrosoftCaseStudy() {
  return (
    <main className="w-full cs-theme-microsoft" data-seq-group>
      <SiteNav active="case-study" />

      {/* 1 · Hero — plain statement of the design move, matching the house
          pattern. Title only, no subtitle. */}
      <CaseStudyHero
        title={
          <>
            {/* {" "} is load-bearing — JSX drops whitespace around <br />. */}
            An assistant that answers{" "}
            <br />
            before the ticket gets raised
          </>
        }
      />

      {/* 2 · Overview block — house pattern. Role, duration and team are the
          three things this draft cannot source from the Figma file; they are
          marked rather than guessed. */}
      <section className="cs-container-wide pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 xl:gap-24">
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Client overview</h3>
            <p className="mt-4 cs-overview-body">
              <strong>Microsoft Surface</strong>
            </p>
            <p className="mt-3 cs-overview-body">
              The internal portal used by Surface field teams &mdash; sales,
              presales, technical support and service specialists &mdash; to
              find product knowledge and to raise and track escalations.
              Delivered by Neudesic.
            </p>
          </div>
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">My role</h3>
            <p className="mt-4 cs-overview-body">
              <strong>Product Designer</strong>
            </p>
            <p className="mt-3 cs-overview-body">
              User research, information architecture, interaction design for
              the assistant, and the portal&rsquo;s component library.
            </p>
          </div>
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Tools</h3>
            <p className="mt-4 cs-overview-body">
              <strong>Figma</strong>
            </p>
            <p className="mt-3 cs-overview-body">
              Remote interviews, a survey instrument, journey mapping, and a
              local component library built inside the file.
            </p>
          </div>
          {/* Placed inside my Neudesic tenure (May 2022 – Jul 2024, verified)
              rather than taken from the mockups, which carry 2020–21 dates and
              a "© Microsoft 2021" footer. Those are placeholder content — the
              deck says so on its own "Please note" slide — so they date the
              chrome that was copied, not the work. The exact months are the one
              thing here I could not source from the file. */}
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Duration</h3>
            <p className="mt-4 cs-overview-body">2022 &ndash; 2023</p>
          </div>
          {/* Deliberately unnamed. The file carries at least one colleague's
              name on a section header, and crediting a former teammate on a
              public page without asking them is not mine to do. */}
          <div className="max-w-[30rem] lg:max-w-none">
            <h3 className="cs-overview-head">Team</h3>
            <p className="mt-4 cs-overview-body">
              A Neudesic design team, working with Microsoft Surface
              stakeholders across regions.
            </p>
          </div>
        </div>
      </section>

      {/* 3 · Intro band. */}
      <section className="cs-intro-band">
        <div className="cs-container">
          <h2 className="cs-intro-label">Intro</h2>

          <h3 className="cs-section-head mt-8">Project overview</h3>
          <div className="mt-5 cs-prose">
            <p>
              A Surface specialist in Tokyo and a device specialist in the UK do
              different jobs, but their day has the same shape. A customer asks
              something specific &mdash; will repeated draining and charging
              damage a Surface Pro 7, what is the certification standard in this
              market, which accessory fits this model &mdash; and the answer
              exists somewhere. It is in a knowledge article, or a marketing
              SharePoint, or a ticket somebody else already raised. Finding out
              which meant leaving the portal, and once a request was raised
              there was no reliable way to see what had happened to it.
            </p>
            <p>
              Project Apollo 3.0 was the third version of that portal, and the
              first one to start from the people using it. Six interviews across
              four countries and a satisfaction survey said the same thing in
              different accents: make search find things, stop sending us to
              other applications, and let us follow a request after we raise it.
              This case study covers what came out of that &mdash; a new
              information hierarchy, an assistant that surfaces the existing
              answer before a duplicate ticket gets created, and a measurement
              layer so the team running the portal could see where people were
              getting stuck.
            </p>
          </div>

          <h3 className="cs-section-head mt-10">What the redesign had to do</h3>
          <div className="mt-5 cs-prose">
            <CaseStudyList
              items={[
                "Make one portal enough. Knowledge, news, requests and dashboards had been spread across separate destinations, and every hop out was a chance to not come back.",
                "Make search answer the question, not match the string. The complaint was not that search was slow — it was that indexing did not match the words people actually use.",
                "Close the loop on a request. Raising one was never the problem; knowing what happened next was.",
                "Cut duplicate escalations by showing the existing ticket at the moment someone starts writing a new one.",
                "Give the portal team a way to see usage — which is where the admin analytics work came from.",
              ]}
            />
          </div>
        </div>
      </section>

      <CaseStudySection heading="Design process">
        <p>
          Discovery first, and deliberately in that order: version 3 of a portal
          arrives with a long list of requested features, and the fastest way to
          build the wrong one is to start from the list. Six interviews and a
          survey came before any screen. The pattern they produced &mdash; find,
          ask, escalate, track &mdash; became the information hierarchy, and the
          hierarchy is what the rest of the design hangs from.
        </p>
      </CaseStudySection>

      {/* ─── Discover ─── */}
      <CaseStudyPhase
        number="1"
        label="Discover"
        claim="Six people in four countries described the same portal, and none of them described a feature gap."
      />

      <CaseStudySection heading="Who we talked to">
        <p>
          The portal serves Surface field staff worldwide, so the study was built
          around region rather than role. Six interviews were completed across
          Japan, China, the United Kingdom and the Netherlands, covering
          presales, technical support, device specialists and public-sector
          service. The US round was still outstanding when this deck was
          assembled &mdash; a real gap, and the largest single market.
        </p>
      </CaseStudySection>

      <div className="cs-container mt-6 sm:mt-8">
        <ul className="cs-list cs-list--bulleted">
          {regions.map((r) => (
            <li key={`${r.where}-${r.who}`}>
              <strong>{r.where}</strong> &mdash; {r.who}
            </li>
          ))}
        </ul>
      </div>

      <CaseStudySection heading="What we observed" spacing="tight">
        <p>
          The tone of the interviews mattered as much as the content. People were
          not defending the old portal or bracing against a new one &mdash; they
          were volunteering. What they asked for was unglamorous and consistent:
          make the daily work easier, make help easy to get, and fix ticket
          tracking. The one feature request that came up repeatedly was search
          with ticket history in it, which is a search problem and a tracking
          problem stated as one wish.
        </p>
      </CaseStudySection>

      <CaseStudyGallery
        items={[
          {
            alt: "MS-01 · User interviews summary — six interviews, regions covered, and what we observed. Figma: Presentation section, USER INTERVIEWS slide.",
            aspectRatio: "16 / 9",
          },
          {
            alt: "MS-02 · Satisfaction survey results — 20 questions, response breakdown per question. Figma: Presentation section, SATISFACTION SURVEY slide.",
            aspectRatio: "16 / 9",
          },
        ]}
        cols={2}
      />

      <CaseStudySection heading="The survey" spacing="tight">
        <p>
          Alongside the interviews ran a twenty-question satisfaction survey on
          the current portal, which took people just under six minutes and came
          back from most of the group it was sent to. It did the job interviews
          are bad at: it told us which complaints were widely held rather than
          strongly held.
        </p>
      </CaseStudySection>

      {/* ─── Define ─── */}
      <CaseStudyPhase
        number="2"
        label="Define"
        claim="Four of the six recorded pain points were search and content problems. The fifth was that a ticket disappears once you raise it."
      />

      <CaseStudySection heading="Two personas, two regions">
        <p>
          The personas were split by region rather than seniority, because that
          is where the behaviour actually diverged. Both people are new to the
          portal &mdash; three months and six months &mdash; which is its own
          finding: the portal was being judged by people still forming habits on
          it, and it was losing them to SharePoint before those habits set.
        </p>
      </CaseStudySection>

      <div className="cs-container mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
        {personas.map((p) => (
          <div key={p.who}>
            <h4 className="cs-meta-value">{p.who}</h4>
            <p className="mt-1 cs-meta-label">
              {p.region} &middot; {p.tenure}
            </p>
            <blockquote className="cs-insight-quote mt-4">
              &ldquo;{p.goal}&rdquo;
            </blockquote>
            <div className="cs-prose mt-4">
              <p>{p.pain}</p>
            </div>
          </div>
        ))}
      </div>

      <CaseStudySection heading="The pain points, as recorded">
        <p>
          Written down together, these stop looking like six complaints and start
          looking like two. Everything above the last line is one problem &mdash;
          the portal cannot find the thing you need, in your language, in a form
          you can take away. The last line is the other one.
        </p>
      </CaseStudySection>

      <div className="cs-container mt-6 sm:mt-8">
        <CaseStudyList items={painPoints} />
      </div>

      <CaseStudyGallery
        items={[
          {
            alt: "MS-03 · Persona — APEC region sales specialist. Figma: Presentation section, PERSONA slide.",
            aspectRatio: "4 / 3",
          },
          {
            alt: "MS-04 · Persona — European Union region Surface specialist. Figma: Presentation section, PERSONA slide.",
            aspectRatio: "4 / 3",
          },
        ]}
        cols={2}
      />

      <CaseStudySection heading="The journey, end to end">
        <p>
          Mapping it across six stages &mdash; awareness, landing, search and
          knowledge article, escalation, tracking progress, and the dashboard
          people fall back on for self-help &mdash; put the drop where nobody
          had been looking. Not at the start. Satisfaction held up while people
          were searching and reading, and fell off after the escalation was
          raised, in the stage where the portal stopped talking back.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        alt="MS-05 · User journey map across six stages, with satisfaction, goals, tasks and opportunities per stage. Figma: Presentation section, USER JOURNEY MAP slide."
        aspectRatio="16 / 9"
        wide
      />

      <CaseStudySection heading="The information hierarchy">
        <p>
          The hierarchy is where the research turned into structure, and it is
          the artefact the rest of the project was built against. Two audiences
          enter it &mdash; Microsoft staff and external users &mdash; and from
          the landing page it splits three ways rather than into a feature menu:
          the knowledge portal, a personal dashboard, and escalation.
        </p>
        <p>
          Escalation is the half that had been missing. Every request is filed
          against a real category &mdash; warranty and repair, proposals, IRT,
          CSS, knowledge-portal content, customer questions, and everything else
          &mdash; and every one of them carries the same four verbs at the end:
          track it, get its status, take an action on it, assign it to someone.
          That symmetry is deliberate. The old portal let you create in one shape
          and follow up in another, which is how a ticket goes quiet.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        alt="MS-06 · Information hierarchy — portal users through login, landing, primary and secondary navigation, categories, and escalation tracking. Figma: page 'Information hierarchy', frame 1:2."
        aspectRatio="1920 / 1280"
        wide
      />

      {/* ─── Ideate ─── */}
      <CaseStudyPhase
        number="3"
        label="Ideate"
        claim="The assistant’s most useful move is not answering. It is showing you the ticket that already exists."
      />

      <CaseStudySection heading="Mirage">
        <p>
          The portal got an assistant. It appears in the file under two names
          &mdash; Genie in the research deck, Mirage in the design work &mdash;
          and it is not a chatbot bolted to the corner of the page. It is a layer
          over search and request creation that watches what someone is doing and
          offers the thing they were about to go looking for.
        </p>
        <p>
          Four visual directions were explored for it: an illustrated character,
          a plain animated dot, a lamp, and an abstract waveform orb. The
          character reads friendliest and is the riskiest &mdash; this is a tool
          people use under time pressure in front of customers, and a mascot that
          is charming on the first day is an obstruction on the thirtieth.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        alt="MS-07 · Four assistant concepts — illustrated character, animated dot, lamp, and waveform orb. Figma: Brainstorming section."
        aspectRatio="16 / 9"
      />

      <CaseStudySection heading="Two ways in, one behaviour">
        <p>
          Someone with a question does one of two things: they start typing in
          the search bar, or they hit &ldquo;Request help&rdquo;. Both were
          mapped against the same scenario &mdash; a customer asking whether
          repeatedly draining and charging a Surface Pro 7 will damage it &mdash;
          and both were designed to end in the same place.
        </p>
        <p>
          Down the search path, trigger words in the query bring up the answer
          alongside the results, with the sources it came from. Down the request
          path, the assistant reads the title and description as they are being
          written and surfaces the tickets and articles that already match. Then
          it makes the offer that matters: rather than filing another request,
          add your customer to the one that already exists &mdash; and here is
          how many other people have done exactly that.
        </p>
        <p>
          That is the whole idea. A support queue does not get shorter because
          tickets are answered faster. It gets shorter because the fifth person
          to hit a known issue joins the existing thread instead of starting a
          sixth.
        </p>
      </CaseStudySection>

      <CaseStudyGallery
        items={[
          {
            alt: "MS-08 · Scenario walkthrough — one question, two paths through the portal, and where the assistant intervenes on each. Figma: Presentation section, 'Example 1 — Request Help & Search'.",
            aspectRatio: "4 / 3",
          },
          {
            alt: "MS-09 · Request-creation flow with assistant interventions at description, device, resolution date and customer. Figma: Brainstorming section.",
            aspectRatio: "4 / 3",
          },
        ]}
        cols={2}
      />

      <CaseStudySection heading="Where the assistant speaks, and where it stops">
        <p>
          Its interventions are placed at the four points in request creation
          where people stall, and each one has a different job. At the
          description it offers tips for writing one that can actually be
          actioned. At the device picker it narrows to the product families that
          match the trouble described. At the resolution date it explains why the
          date is being asked for, which is the field people leave blank because
          it looks like paperwork. At the customer step it matches against MSX
          opportunity, account ID or name, and offers to add another customer
          once the request is filed.
        </p>
        <p>
          The flows also name the exit: machine-to-man transition. The assistant
          is designed to hand over, not to hold on. In a tool where the person on
          the other end has a customer waiting, an assistant that cannot get out
          of the way is worse than none.
        </p>
      </CaseStudySection>

      {/* ─── Design ─── */}
      <CaseStudyPhase
        number="4"
        label="Design"
        claim="Two result sets, kept visibly apart: what the assistant recommends, and everything that matched."
      />

      <CaseStudySection heading="Search results">
        <p>
          The search page had to carry two different kinds of answer without
          letting either pretend to be the other. Recommendations sit in their
          own accordion, each with a confidence meter and a thumbs up or down on
          &ldquo;was this information helpful?&rdquo;. All results sit in a
          second one, filtered by date and split across articles, news feeds and
          help requests. Both expand into the same tabbed view, so switching
          between the machine&rsquo;s pick and the full list does not mean
          learning a second layout.
        </p>
        <p>
          The confidence meter is the honest part. A recommendation that is
          rendered exactly like a search result claims a certainty it does not
          have, and the first time it is confidently wrong the whole feature
          loses the room. Showing the strength of the match, and taking a rating
          on it, is what lets someone use it and disbelieve it at the same time.
        </p>
        <p>
          The page also keeps the two rails the research asked for: open requests
          and resolved requests, always visible, so the answer to &ldquo;what
          happened to my ticket&rdquo; is on the screen rather than at the end of
          a navigation path. And when nothing matches, the page says so and
          offers to raise the request from there.
        </p>
      </CaseStudySection>

      <CaseStudyGallery
        items={[
          {
            alt: "MS-10 · Search results — recommendations with confidence meters above the full result set, with open and resolved requests in the right rail. Figma: 'Final search request' section.",
            aspectRatio: "16 / 10",
          },
          {
            alt: "MS-11 · Search results with filters expanded — date filters, and results split across articles, news feeds and help requests. Figma: 'Giridhar search request help' section.",
            aspectRatio: "16 / 10",
          },
        ]}
        cols={2}
      />

      <CaseStudySection heading="The portal around it">
        <p>
          The rest of the portal exists to keep people inside it. The landing
          page leads with the search field and the two things people arrive to do
          &mdash; request help, or learn the portal &mdash; then runs a news
          carousel of product launches and events tagged by team. The footer is
          doing quiet, deliberate work: popular articles, the resources people
          were leaving to find, and direct links to the marketing and commercial
          SharePoints. The links out are still there. They are just no longer the
          only way through.
        </p>
        <p>
          Quick links sit above the footer for the four things that were being
          raised most often anyway &mdash; a sales question, a warranty need, a
          feature request, a messaging request &mdash; which turns the four most
          common escalations into one click instead of a form.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        alt="MS-12 · Landing page with the assistant offering a battery-related article before the query is finished. Figma: 'Mirage design ideation' section, NEW FLOW."
        aspectRatio="16 / 10"
        wide
      />

      <CaseStudySection heading="The component library">
        <p>
          A local library sits in the file behind all of it &mdash; an icon set,
          the header, primary and secondary navigation, the footer, and the
          colour ramp. It is not a design system in the governed sense and does
          not pretend to be. It is the amount of structure a portal of this size
          needs so that three people drawing different screens produce one
          product.
        </p>
      </CaseStudySection>

      <CaseStudyImage
        alt="MS-13 · Local component library — icons, header, navigation, footer and colour. Figma: page 'Local components'."
        aspectRatio="16 / 9"
      />

      {/* ─── Measure ─── */}
      <CaseStudyPhase
        number="5"
        label="Measure"
        claim="The portal team could not see where people were getting stuck, so the admin side got designed too."
      />

      <CaseStudySection heading="Super admin analytics">
        <p>
          A portal this size is run by someone, and that someone had no view of
          it. The admin side was specified as its own piece of design work: what
          to measure, and what each measure is for.
        </p>
        <p>
          The segmentation is behavioural rather than demographic &mdash; power,
          normal and casual users by frequency; new, regular, dormant and
          resurrected by recency &mdash; because the question worth answering is
          not who someone is but whether they are coming back. Alongside it sit
          the two operational numbers the research demanded: how long it takes to
          create a ticket, and how many steps it takes to reach a search result.
        </p>
        <p>
          The frustration metrics are the ones I would defend hardest. Rage
          clicks, dead clicks, bounces and exits are how a portal tells you it is
          failing without anyone filing a complaint about it &mdash; and the
          people using this one are busy, in front of customers, and far more
          likely to leave than to report. A behavioural flow diagram sits beside
          them to show the path taken to reach a goal, so a spike in frustration
          can be traced to the screen that caused it.
        </p>
        <p>
          A user interest score was specified on top of these, computed from
          those signals rather than self-reported. That one is a proposal, not a
          finding: a model that labels people positive, neutral or negative
          carries real risk of being wrong about someone in a way that affects
          how they get supported, and it would need a lot more thought before it
          ran on real staff.
        </p>
      </CaseStudySection>

      <CaseStudyGallery
        items={[
          {
            alt: "MS-14 · Admin utilisation insights — request creation, usage frequency, recency cohorts, steps to reach a search result, and user activities. Figma: 'Super admin portal usage analytics' section.",
            aspectRatio: "16 / 10",
          },
          {
            alt: "MS-15 · Admin metrics specification — segmentation, behavioural flow, activity histograms and event metrics. Figma: 'Super admin portal usage analytics' section.",
            aspectRatio: "16 / 10",
          },
        ]}
        cols={2}
      />

      {/* ─── Honest close ─── */}
      <CaseStudySection heading="What is still open">
        <p>
          The US interviews were never completed, and the US is the largest
          market the portal serves. Everything on this page about how Surface
          field staff work is grounded in Japan, China, the UK and the
          Netherlands, and a fifth region could have moved it.
        </p>
        <p>
          Localisation was the first pain point recorded and the one the design
          answers least. Nothing in this work makes content appear in a
          specialist&rsquo;s own language; it makes the English easier to find.
          That was the right sequence, but it means the top complaint from the
          research is still the top complaint.
        </p>
        <p>
          And the assistant was designed against a scenario, not against logs.
          The battery question is a good scenario &mdash; it is a real question,
          asked often, with a real answer &mdash; but designing recommendation
          behaviour without query data means the confidence meter is an interface
          for a system whose accuracy nobody had measured yet.
        </p>
      </CaseStudySection>

      <CaseStudySection heading="Disclaimer">
        <p>
          This work was done for Microsoft through Neudesic and is covered by a
          non-disclosure agreement. What is described here is the design process
          and the reasoning behind it. Performance figures are deliberately
          absent, and the content visible in any mockup is placeholder &mdash;
          the deck states this itself, and the numbers in the admin screens were
          written to size a chart, not to report a result.
        </p>
      </CaseStudySection>

      {/* Draft marker. Delete this block and the placeholder slots resolve into
          a finished page — nothing else on it is provisional. It sits last so
          it does not interrupt a read-through. */}
      <CaseStudyCallout label="Draft — three things this page still needs">
        <p>
          {/* {" "} again: JSX drops the space between </strong> and a text node
              that wraps to the next line, so the lead-in fuses to the sentence. */}
          <strong>The business case.</strong>{" "}
          Everything under &ldquo;what the
          redesign had to do&rdquo; is reconstructed from the research
          artefacts, not from a brief. If Apollo 3.0 had a stated business
          case &mdash; deal cycle, support deflection, a sponsor&rsquo;s
          framing &mdash; it belongs there and beats anything reconstructed.
        </p>
        <p>
          <strong>The dates.</strong>{" "}
          Set to 2022&ndash;2023 on the reasoning
          that the work sits inside the Neudesic tenure, since the 2020&ndash;21
          dates in the mockups are placeholder content. Exact months needed.
        </p>
        <p>
          <strong>The visuals.</strong>{" "}
          Fifteen slots, each labelled with the
          Figma section it comes from. They are empty on purpose: this
          repository is public, so exporting Microsoft work into it publishes
          it permanently. That decision is yours, not this page&rsquo;s.
        </p>
      </CaseStudyCallout>

      <div className="pb-16 sm:pb-24" />
      <SiteFooter />
    </main>
  );
}
