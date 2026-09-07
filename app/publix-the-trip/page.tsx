import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import CaseStudyHero from "../components/case-study/CaseStudyHero";
import styles from "./publix-case-study.module.css";
import RecoveryVideo from "./RecoveryVideo";
import {V1Journey,V1Exploration,V1Comparison,V1Videos,V1States,V1Prototype} from "./V1Sections";
import MapDemo from "./MapDemo";
import reviewStyles from "./review-styles.module.css";
import Source from "./Source";

// The Trip — the canonical Publix case: V2 reading rhythm + V1 decision artifacts,
// with captured prototype states and an interactive store map.
export const metadata: Metadata = {
  title: "The Trip — a flexible Publix shopping trip | Dinesh Revunuru",
  description:
    "An independent Publix design study: public customer evidence, one interaction idea, and a working shopping-trip prototype.",
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

const IMG = "/images/publix-the-trip";
const SCREENS = "/images/publix-the-trip-v3";
// Same-origin static bundle at public/publix-prototype.
const PROTOTYPE_URL = "/publix-prototype/index.html";

const sources = [
  { name: "Publix · Shopping List FAQ", href: "https://www.publix.com/publix-app/faqs/shopping-list", note: "Existing aisle and area locations. Product documentation." },
  { name: "Publix · App Store", href: "https://apps.apple.com/us/app/publix/id562794249", note: "Current product reference; August 2021 department-order review; positive deal and list feedback." },
  { name: "Publix · Google Play", href: "https://play.google.com/store/apps/details?id=com.publix.main&hl=en_US", note: "April 19, 2025 · 2/5 review; praises aisle grouping within a critical review." },
  { name: "Out of · App Store review", href: "https://apps.apple.com/us/app/out-of-grocery-shopping-list/id1439222302", note: "April 16, 2025. A shopper describes arranging items in walking order." },
  { name: "Shopping List · App Store reviews", href: "https://apps.apple.com/us/app/shopping-list-grocery-to-do/id1099665034?see-all=reviews&platform=ipad", note: "May 2024 and June 2025. Backtracking and a workaround to preserve aisle order." },
  { name: "Walmart · Store Mode", href: "https://www.walmart.com/cp/store-mode/8459006", note: "First-party in-store companion features." },
  { name: "Kroger · Store Mode", href: "https://www.kroger.com/i/ways-to-shop/store-mode_02-25", note: "First-party selected-store and item-location features." },
];

function ReviewHeader({app,platform,reviewer,date,rating,source}:{app:string;platform:string;reviewer:string;date:string;rating:number;source:number}) {
  return <><a className={reviewStyles.reviewSource} href={sources[source-1].href} target="_blank" rel="noreferrer"><span aria-hidden="true" style={{display:"grid",placeItems:"center",width:40,height:40,flexShrink:0,borderRadius:9,background:"var(--cs-accent-bg,#eaf3e7)",color:"var(--cs-accent-ink,#1f6a08)",fontSize:16,fontWeight:700,border:"1px solid #e5e9e6"}}>{app.slice(0,1)}</span><span><strong>{app}</strong><span>{platform} ↗</span></span></a><div className={reviewStyles.reviewRating}><span role="img" aria-label={`${rating} out of 5 stars`}><span aria-hidden="true" className={reviewStyles.filledStars}>{"★".repeat(rating)}</span><span aria-hidden="true" className={reviewStyles.emptyStars}>{"★".repeat(5-rating)}</span></span><span>{rating}/5</span></div><p className={reviewStyles.reviewByline}>{reviewer} · {date}</p></>;
}

function StorySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/** A prototype screen on the stage: flat export, no device chrome. */
function Screen({ file, alt, label, caption }: { file: string; alt: string; label?: string; caption?: string }) {
  return (
    <figure>
      {label && <span className={styles.screenLabel}>{label}</span>}
      <Image src={`${IMG}/${file}`} alt={alt} width={552} height={1200} sizes="(max-width: 640px) 240px, 250px" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default function PublixTheTrip() {
  return (
    <main className={`${styles.page} cs-theme-publix ${openSans.variable}`} data-seq-group>
      <SiteNav active="case-study" />

      <CaseStudyHero
        title={
          <>
            {/* {" "} is load-bearing: globals hides this <br /> below 1025px and
                JSX drops whitespace around it. Same pattern as Mate and Indeed. */}
            A familiar shopping list.{" "}
            <br />
            A clearer next stop.
          </>
        }
      />

      {/* Overview — the house pattern: three fields on the wide rail. */}
      <section className="cs-container-wide">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16 lg:gap-24">
          <div>
            <h3 className="cs-overview-head">What I did</h3>
            <p className="mt-4 cs-overview-body">Public research, product framing, interaction design, coded prototype</p>
          </div>
          <div>
            <h3 className="cs-overview-head">Built with</h3>
            <p className="mt-4 cs-overview-body">HTML, CSS, JavaScript · AI-assisted exploration and build, directed by me</p>
          </div>
          <div>
            <h3 className="cs-overview-head">Quick link</h3>
            <p className="mt-4 cs-overview-body">
              <Link href="#prototype">Interactive prototype</Link>
            </p>
          </div>
        </div>
      </section>

      <figure className={styles.heroScreens}>
        <div tabIndex={0} role="group" aria-label="Prototype screens, scrollable">{[["entrance","Start with your list"],["trip","Focus on a stop"],["sheet-map","Choose another stop"]].map(([file,label])=><figure key={file}><Image src={`${SCREENS}/screens/state-${file}.png`} alt={label+" in The Trip prototype"} width={780} height={1688} sizes="(max-width:640px) 230px, 280px" priority /><figcaption>{label}</figcaption></figure>)}</div>
        <figcaption>Working prototype · sample store and list data</figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="How did it start?">
          <p>
            I found Publix through the Senior Product Designer role. The public app already sorts a
            shopping list by aisle, so the obvious concept was off the table on day one.
          </p>
          <p className={styles.lead}>
            The question became: what does a shopper still have to work out once the list is sorted?
          </p>
        </StorySection>

        <StorySection title="The problem">
          <p className={styles.statement}>
            A location-grouped list helps you find products. It may still leave you to decide{" "}
            <mark>what comes next</mark> and to remember what you skipped.
          </p>
          <p>
            Publix groups items by aisle and area, with photos and check-off. <Source n={1} />
            <Source n={2} /> I kept those existing controls and focused the concept on the
            trip itself: the order you walk, the item you could not find, the one you passed.
          </p>
        </StorySection>

        <StorySection title="Who is shopping?">
          <p>
            Someone who built a list at home and is now standing in the store with it. Not a
            validated segment: a design target, chosen so the prototype has one job.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="Design target and scope">
        <div className={`${styles.personaCard} ${styles.personaCard4}`}>
          <div>
            <p className={styles.cardLabel}>Design target</p>
            <h2>In-store shopper with a prepared list</h2>
            <p>Several aisles or departments, free to change route. Not a validated segment.</p>
          </div>
          <div>
            <p className={styles.cardLabel}>Job to be done</p>
            <h2>Finish the list without losing the thread</h2>
            <p>Keep track of the next useful stop and of anything unresolved.</p>
          </div>
          <div>
            <p className={styles.cardLabel}>Variation to investigate</p>
            <h2>Familiarity, list length, company, access needs</h2>
            <p>Recruitment considerations, not established subgroup findings.</p>
          </div>
          <div>
            <p className={styles.cardLabel}>Outside this concept</p>
            <h2>Picking, inventory, live navigation</h2>
            <p>No position tracking, no shortest route, no stock claims. The map inspects; it does not guide.</p>
          </div>
        </div>
      </section>

      <article className={styles.story}>
        <StorySection title="What Publix already does">
          <p>
            Publix&rsquo;s public App Store captures show how shoppers build a list: open the empty list, search and add
            items, then return to location groups. I wanted to extend that workflow, not replace it.
          </p>
        </StorySection>
      </article>

      <figure className={`${styles.mediaBlock} ${styles.screenStage} ${styles.screenStage3}`}>
        {[
          ["official-empty-list.png", "01 · Open the list", "Public Publix iOS empty shopping list with Add an item action"],
          ["official-search-add.png", "02 · Search and add", "Public Publix iOS search results with add-to-list controls and Added To List confirmation"],
          ["official-shopping-list.png", "03 · Shop by location", "Public Publix iOS shopping list with items in Aisle 8 and green checkboxes"],
        ].map(([file, label, alt]) => (
          <figure key={file}>
            <a href={`${SCREENS}/${file}`} {...externalLinkProps} aria-label={`Enlarge: ${alt}`}><Image src={`${SCREENS}/${file}`} alt={alt} width={1206} height={2622} sizes="(max-width: 640px) 240px, 300px" /></a>
            <figcaption>{label}</figcaption>
          </figure>
        ))}
        <figcaption style={{ gridColumn: "1 / -1", textAlign: "center" }}>
          Captures from Publix&rsquo;s public App Store listing · select a screen to enlarge. Not The Trip prototype.
        </figcaption>
      </figure>

      <article className={styles.story}>
        <StorySection title="What shoppers said">
          <p>
            Selected public reviews shaped the brief. They raise questions about sequence and recovery;
            they do not establish how common these problems are among Publix customers.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="Customer evidence">
        <figure className={styles.pullQuote} style={{ marginBottom: 40 }}>
          <blockquote>&ldquo;order of how we walk through <em>the grocery store</em>&rdquo;</blockquote>
          <figcaption>A shopper on an adjacent list app, describing how they arrange items · <a href={sources[3].href} {...externalLinkProps}>Out of · App Store</a> · April 2025 <Source n={4} /></figcaption>
        </figure>
        <div className={styles.evidence}>
          <figure>
            <ReviewHeader app="Publix" platform="Google Play" reviewer="Rajesh Ramsaroop" date="Apr 19, 2025" rating={2} source={3} />
            <blockquote>&ldquo;separates everything by aisle&rdquo;</blockquote>
            <figcaption>
              Publix · <a href={sources[2].href} {...externalLinkProps}>Google Play</a> · Apr 2025 · 2/5. Praise for the grouping inside a critical review.
            </figcaption>
            <p className={styles.takeaway}><strong>Preserve</strong>The existing aisle groups.</p>
          </figure>
          <figure>
            <ReviewHeader app="Publix" platform="App Store" reviewer="Principal Agent" date="Aug 18, 2021" rating={5} source={2} />
            <blockquote>&ldquo;produce, deli and bakery are always at the bottom&rdquo;</blockquote>
            <figcaption>
              Publix · <a href={sources[1].href} {...externalLinkProps}>App Store</a> · Aug 2021 · 5/5. Departments appear later than they are met in-store. Historical; current behavior may differ.
            </figcaption>
            <p className={styles.takeaway}><strong>Allow</strong>Control over the suggested order.</p>
          </figure>
          <figure>
            <ReviewHeader app="Shopping List" platform="App Store · adjacent app" reviewer="FaisyAnn" date="May 4, 2024" rating={1} source={5} />
            <blockquote>Reached the far side, noticed a missed item, and had to walk back.</blockquote>
            <figcaption>
              Shopping List, an adjacent app · <a href={sources[4].href} {...externalLinkProps}>App Store</a> · May 2024 · 1/5. Category evidence, outside Publix.
            </figcaption>
            <p className={styles.takeaway}><strong>Observe</strong>Missed items and direction reversals.</p>
          </figure>
        </div>
        <p className={styles.mediaCaption}>Selected reviews · supporting detail in the research notes below</p>
      </section>

      <article className={styles.story}>
        <StorySection title="How the evidence shaped the concept">
          <p>I separated what the sources described from what I inferred, then used three priorities to choose the interaction.</p>
        </StorySection>
      </article>
      <section className={styles.mediaBlock} aria-label="Evidence to design decisions">
        <div className={styles.synthesis}>
          <div><span>01 · Preserve</span><h3>Keep the useful list.</h3><p>Publix already groups by location; a reviewer values it. <Source n={1} /><Source n={3} /></p><p><strong>Decision:</strong> retain product rows, aisle groups, and check-off.</p></div>
          <div><span>02 · Allow</span><h3>Keep the order adjustable.</h3><p>A historical Publix review and an adjacent-app review discuss encounter order. <Source n={2} /><Source n={4} /></p><p><strong>Decision:</strong> suggest a sequence while keeping every stop accessible.</p></div>
          <div><span>03 · Recover</span><h3>Keep unfinished items visible.</h3><p>An adjacent-app reviewer describes returning for a missed item. <Source n={5} /></p><p><strong>Hypothesis:</strong> To revisit and Undo may make recovery clearer.</p></div>
        </div>
      </section>

      <article className={styles.story}>
        <StorySection title="Where the trip gets fuzzy">
          <p>
            A location-grouped list may still require the shopper to translate display order into walking
            order and keep track of skipped items. The journey map makes those assumptions visible for testing.
          </p>
        </StorySection>
      </article>

      <V1Journey />

      <article className={styles.story}>
        <StorySection title="My hypothesis">
          <p className={styles.lead}>
            If the list can focus on one stop, suggest the next, and keep unresolved items visible,
            we expect shoppers to rescan less and recover more reliably than with the grouped list alone.
          </p>
        </StorySection>

      </article>
      <article className={styles.story} id="exploration">
        <StorySection title="Four ways to turn a list into a trip">
          <p>
            Same aisle groups, four presentations. Now, Next, Later gave focus without hiding the
            rest of the trip.
          </p>
        </StorySection>
      </article>

      <section className={styles.flowStage} aria-label="Concept exploration">
        <p className={styles.flowEyebrow}>Exploration · schematics from working notes, not user-tested</p>
        <div className={styles.concepts}>
          <div className={styles.concept}>
            <p className={styles.cardLabel}>Explored</p>
            <div className={styles.wire} aria-hidden="true"><span>Produce</span><span>Deli</span><span>Aisle 1</span><span>Aisle 3</span></div>
            <h3>Quiet Reorder</h3>
            <p>The familiar list rearranges into a suggested sequence.</p>
            <p>Low learning cost, but still a long scan.</p>
          </div>
          <div className={styles.concept}>
            <p className={styles.cardLabel}>Explored</p>
            <div className={`${styles.wire} ${styles.wireChapters}`} aria-hidden="true"><span>Produce · 2 items</span><span>Deli</span><span>Aisles</span></div>
            <h3>Store Chapters</h3>
            <p>Departments become expandable chapters.</p>
            <p>Keeps context, but adds opening and closing work.</p>
          </div>
          <div className={`${styles.concept} ${styles.conceptChosen}`}>
            <p className={styles.cardLabel}>Chosen</p>
            <div className={`${styles.wire} ${styles.wireFocus}`} aria-hidden="true"><span>Now · Produce</span><span>Next · Deli</span><span>Later · remaining stops</span></div>
            <h3>Now, Next, Later</h3>
            <p>One active stop, a preview, and the remainder within reach.</p>
            <p>A clear next action; must keep whole-list access.</p>
          </div>
          <div className={styles.concept}>
            <p className={styles.cardLabel}>Explored</p>
            <div className={`${styles.wire} ${styles.wireSteps}`} aria-hidden="true"><span>Stop 1 of 9</span><span>Produce</span><span>Continue →</span></div>
            <h3>Pleasant Stops</h3>
            <p>A guided itinerary with explicit progress.</p>
            <p>Strong progression, at the risk of feeling rigid.</p>
          </div>
        </div>
      </section>

      <article className={styles.story}>
        <StorySection title="Two revisions that clarified it">
          <ul className={styles.quiet}>
            <li><strong>From a fixed start to an explicit origin.</strong> <span>The prototype asks which entrance you used. That exposes an assumption for testing instead of hiding it.</span></li>
            <li><strong>From a drawn route to selectable stops.</strong> <span>An early dashed path implied spatial precision the sample layout could not support. The map became a way to inspect and choose a stop.</span></li>
          </ul>
        </StorySection>
      </article>



      <section className={`${styles.flowStage} ${styles.flowStageBlue}`} aria-label="Proposed trip flow">
        <p className={styles.flowEyebrow}>Proposed · the shopper controls progression</p>
        <ol className={styles.flow}>
          <li>Open the list</li>
          <li className={styles.flowAccent}>Choose an entrance</li>
          <li className={styles.flowAccent}>Start the trip</li>
          <li>Collect, or mark &ldquo;couldn&rsquo;t find it&rdquo;</li>
          <li className={styles.flowAccent}>Change stop any time</li>
          <li>Finish, or look again</li>
        </ol>
        <p className={styles.flowNote}>Whole-trip list and map stay one tap away throughout. The entrance choice is a stated assumption, there to be tested.</p>
      </section>

      <article className={styles.story}>
        <StorySection title="From the existing list to The Trip">
          <p>
            The Trip starts inside the existing list. Same rows, same aisle groups, same check-off,
            with <strong>Start my trip</strong> alongside an operable add-item control.
          </p>
        </StorySection>
      </article>

      <V1Comparison />
      <MapDemo />
      <V1Videos />
      <V1States />

      <article className={styles.story}>
        <StorySection title="I designed the uncomfortable states too">
          <ul className={styles.quiet}>
            <li><strong>Seen it early?</strong> <span>Collect outside the suggested focus. Progress follows the shopper.</span></li>
            <li><strong>A stop with nothing on the list</strong> <span>shows an honest empty panel, never unrelated products.</span></li>
            <li><strong>An item with no aisle</strong> <span>stays on the list. No invented map location.</span></li>
            <li><strong>Entrance or focus changes</strong> <span>keep collected items and allow Undo.</span></li>
            <li><strong>One item unresolved</strong> <span>means an incomplete trip and a way to revisit. No false completion.</span></li>
          </ul>
        </StorySection>

      </article>

      <article className={styles.story}>
        <StorySection title="Every state, from the prototype">
          <p>Captured from the current prototype. Explore progress, changes of plan, recovery, and completion.</p>
        </StorySection>
      </article>

      <section className={styles.gallery} aria-label="Prototype states">
        <div className={styles.galleryTrack} tabIndex={0} role="group" aria-label="Prototype state screens, scrollable">
          {[
            ["add-item", "List", "Add an item", "Custom items stay unassigned until a location is known."],
            ["progress", "Progress", "3 of 10 collected", "Focus moves to Bakery; the bar fills."],
            ["sheet-list", "Whole trip", "List view", "Every stop and item, one sheet away."],
            ["sheet-map", "Whole trip", "Map view", "Aisle 7 selected; Shop this stop next."],
            ["miss", "Recovery", "Couldn't find it?", "Saved to revisit, with Undo."],
            ["switch", "Control", "Entrance switched", "Sequence recomposed from the side door."],
            ["done-look", "Open trip", "One item to revisit", "Honest: not collected, not out of stock."],
            ["done", "Complete", "10 of 10", "Only the last collected item closes the list."],
          ].map(([file, label, state, note]) => (
            <figure key={file}>
              <Image src={`${SCREENS}/screens/state-${file}.png`} alt={`Prototype screen: ${label}, ${state}. ${note}`} width={804} height={1748} sizes="(max-width: 1200px) 210px, 220px" />
              <figcaption><b>{label}</b>{state}<span>{note}</span></figcaption>
            </figure>
          ))}
        </div>
        <p className={styles.galleryNote}>Sample store and list data · captured September 6, 2026</p>
      </section>

      <article className={styles.story}>
        <StorySection title="In Publix's visual language">
          <p>
            Product rows, location labels, green actions, and segmented controls follow Publix&rsquo;s public
            iOS screenshots. Figtree stands in for the proprietary typeface; native pixel parity is
            unverified.
          </p>
        </StorySection>
      </article>

      <section className={styles.mediaBlock} aria-label="Visual language reference">
        <div className={styles.craft}>
          <div>
            <div className={styles.sample} aria-label="Reference colours"><span className={styles.swatch} style={{ background: "#2d810e" }} /><span className={styles.swatch} style={{ background: "#1d2f28" }} /><span className={styles.swatch} style={{ background: "#f3f3f3" }} /></div>
            <h3>Colour and hierarchy</h3>
            <p>Action green, dark product text, quiet grouped surfaces.</p>
          </div>
          <div>
            <div className={`${styles.sample} ${styles.typeSample}`}>Aa<span>Now · Next · Later</span></div>
            <h3>Type and density</h3>
            <p>Readable product names, clear location labels. Figtree stands in for the app face.</p>
          </div>
          <div>
            <div className={styles.sample}><div className={styles.segment} aria-hidden="true"><span>List</span><span>Map</span></div></div>
            <h3>Familiar controls</h3>
            <p>Existing control patterns carry the new behavior.</p>
          </div>
        </div>
      </section>

      <V1Prototype />

      <article className={styles.story}>
        <StorySection title="What a clearer trip could change">
          <ul className={styles.quiet}>
            <li><strong>Less repeated scanning</strong> <span>of the whole list.</span></li>
            <li><strong>More control</strong> <span>over the next useful stop.</span></li>
            <li><strong>Fewer unresolved items</strong> <span>lost from view.</span></li>
          </ul>
          <p className={styles.smallPrint}>Hypotheses, not measured outcomes.</p>
        </StorySection>

        <StorySection title="What I would test first">
          <p>
            Current list versus The Trip, with 5&ndash;7 Publix shoppers in one real store. Count
            rescans, time to name the next stop, and whether they get back to a deferred item.
          </p>
          <p className={styles.smallPrint}>
            No improvement, added navigation effort, or confusion about &ldquo;to revisit&rdquo;
            would challenge the hypothesis. A study this size finds usability problems; it does not
            establish time savings or business impact. Full plan in the notes below.
          </p>
        </StorySection>

        <StorySection title="What changed my mind">
          <p>
            The biggest change was not visual. It was learning to stop calling a mature feature a
            gap. Once it was undeniable that Publix already sorts by location, the concept had to
            earn its place somewhere smaller and more defensible.
          </p>
        </StorySection>

        <StorySection title="Research notes and sources">
          <p className={styles.smallPrint}>
            Independent work by Dinesh Revunuru; not commissioned, approved, or endorsed by Publix.
            No Publix customer interviews, internal analytics, inventory feeds, or floor plans were
            used. Sources revisited September 5, 2026.
          </p>
          <div className={styles.notes}>
            <details>
              <summary>What other products informed the concept</summary>
              <div className={styles.tableWrap} role="region" aria-label="Product comparison" tabIndex={0}>
                <table>
                  <caption>Public product comparison · reviewed September 2026</caption>
                  <thead><tr><th scope="col">Product</th><th scope="col">Evidence reviewed</th><th scope="col">Lesson for The Trip</th><th scope="col">Boundary</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">Publix <Source n={1} /><Source n={2} /></th><td>Location groups, item photos, check-off; review praise for deals and clear lists.</td><td>Extend the current list and familiar product language.</td><td>Public references do not reveal every authenticated feature.</td></tr>
                    <tr><th scope="row">Walmart <Source n={6} /></th><td>Store Mode connects a list with item finding, maps, and price checking.</td><td>Digital support can continue inside the store.</td><td>Exact walking-order mechanics were not established.</td></tr>
                    <tr><th scope="row">Kroger <Source n={7} /></th><td>Store Mode documents a selected-store experience and finding items.</td><td>Store context belongs close to the shopping task.</td><td>Feature documentation does not prove customer preference.</td></tr>
                    <tr><th scope="row">Grocery-list apps <Source n={4} /><Source n={5} /></th><td>Users describe encounter order, missed items, and ordering workarounds.</td><td>Give shoppers control over sequence and a clear remainder.</td><td>These reviewers are outside the Publix-specific sample.</td></tr>
                  </tbody>
                </table>
              </div>
            </details>
            <details>
              <summary>From evidence to design decisions</summary>
              <div className={styles.tableWrap} role="region" aria-label="Research synthesis and design implications" tabIndex={0}>
                <table>
                  <caption>Source observation → interpretation → design use</caption>
                  <thead><tr><th scope="col">Source observation</th><th scope="col">Interpretation</th><th scope="col">How it informed the concept</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">Publix already groups list items by location; one reviewer values this. <Source n={1} /><Source n={2} /><Source n={3} /></th><td>Preserve useful structure. The list is a starting point, not a blank slate.</td><td>Keep product rows, aisle groups, and check-off. Add trip focus without replacing the list.</td></tr>
                    <tr><th scope="row">A 2021 Publix review requests aisle reordering; an adjacent-app reviewer describes walking order. <Source n={2} /><Source n={4} /></th><td>Support shopper control. Display order may not fit an individual trip.</td><td>Suggest a sequence, retain whole-trip access, let the shopper select another stop. Entrance choice is an assumption to test.</td></tr>
                    <tr><th scope="row">An adjacent-app reviewer describes returning for an overlooked item. <Source n={5} /></th><td>Keep unfinished work visible. This raises a recovery question; it does not prove a Publix not-found problem.</td><td>Explore To revisit and Undo as a recovery hypothesis. Never equate unresolved with collected or unavailable.</td></tr>
                  </tbody>
                </table>
              </div>
            </details>
            <details>
              <summary>Evaluation plan · proposed, not conducted</summary>
              <p>Formative study. Comparable 12&ndash;18 item tasks, order counterbalanced to reduce learning effects.</p>
              <div className={styles.tableWrap} role="region" aria-label="Validation plan" tabIndex={0}>
                <table>
                  <caption>Evaluation questions and decision criteria</caption>
                  <thead><tr><th scope="col">Question</th><th scope="col">Observe</th><th scope="col">Design response</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">Is the next stop clearer?</th><td>Time to identify a stop, list rescans, participant explanation.</td><td>Simplify the hierarchy if focus adds work.</td></tr>
                    <tr><th scope="row">Does the order help?</th><td>Direction reversals, missed items, trip time, manual overrides.</td><td>Reconsider sequence if shoppers consistently work around it.</td></tr>
                    <tr><th scope="row">Is the origin understandable?</th><td>Entrance recognition and confidence before seeing the map.</td><td>Revise or remove entrance choice if it confuses.</td></tr>
                    <tr><th scope="row">Is recovery honest and usable?</th><td>First action after a not-found item; revisit and completion comprehension.</td><td>Revise labels if unresolved reads as collected or unavailable.</td></tr>
                    <tr><th scope="row">Can people use it comfortably?</th><td>Task ease, one-handed use, screen-reader navigation, enlarged text.</td><td>Adjust interaction and density around observed barriers.</td></tr>
                  </tbody>
                </table>
              </div>
            </details>
            <details>
              <summary>Sources</summary>
              <ol>
                {sources.map((s, i) => (
                  <li id={`source-${i + 1}`} key={s.href}>
                    <a href={s.href} {...externalLinkProps}>{s.name} &#8599;</a> — {s.note}
                  </li>
                ))}
              </ol>
              <p>
                Historical reviews are shown with their original dates; they do not establish the
                current prevalence of a problem. The store layout, entrances, item assignments, and
                suggested order are illustrative. Product imagery and app references explain the
                concept; publication rights require review before external release.
              </p>
            </details>
          </div>
        </StorySection>
      </article>

      <SiteFooter tagline="Independent concept · not affiliated with Publix" />
    </main>
  );
}
