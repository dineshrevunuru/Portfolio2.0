import { Geist_Mono, Inter_Tight, Maven_Pro } from "next/font/google";
import { NOINDEX, pageMetadata } from "../../seo";
import { StillToggle } from "../_shared/Play";
import Seen from "../_shared/Seen";
import { HOME as HOME2, hasVault, isOpen } from "./lock";
import { Arrow, I } from "../_shared/adani-v2/parts";
import { DemoTabs, LiveWeekly } from "../_shared/adani-v3/Live";
import { Alarms, LEAD, LEAD_MEASURES, LTile, Rail } from "../_shared/adani-v3/summary";
import { Ico } from "../_shared/adani-v3/icons";
import { Library5 } from "./Library";
import { AdaniTiles } from "./AdaniTiles";
import "../_shared/figma.css";
import "../_shared/live.css";
import "../_shared/story.css";
import "../_shared/tiles.css";
import "../_shared/adani.css";
import "../_shared/adani2.css";
import "../_shared/adani3.css";
import "../_shared/adani4.css";
import "../_shared/adani5.css";

/* SCALED DOWN (same day). His words, with the unlocked hero and the library selected: "Everything real big like are
   hard to follow. got to scale these down making them comfortable to follow". Both now sit inside the page's own
   figure width (1000px) and no longer run edge to edge: the hero is the whole screen at about half size, and the
   library is a compact grid whose charts open large (./Library.tsx).

   UNLOCKED, THE HERO IS THE WHOLE SCREEN (same day). His words: "when unlocked I want the full screen as in V4".
   So an unlocked browser gets the fourth version's cover (the whole Leadership Summary with its chart and the real
   map); a locked one still sees only the tiles through the blur.

   THE HERO IS LOCKED TOO (same day). Asked "tiles only, or behind the lock too?", his answer: "Lock the hero too".
   Locked, the page is the opening and then the hero seen through a blur that fades out, with the password over it.
   Nothing after the hero is sent to a locked browser. The hero under the blur is made-up figures, hidden from
   keyboard and screen readers.

   THE HERO IS THE TILES ALONE (same day). His words, seeing it in a narrow window with its two blurred blocks:
   "Will also hide this section we need much better visually looking good UI". The locked trend chart and map are
   out of the hero: the page's own lock comes right after it, so they only added blur. The frame is now 1149 wide
   and shows at true size on a desktop; a narrow window gets a two-column grid of tiles, not a cut-off row.

   THE WHOLE CASE STUDY IS LOCKED AFTER THE HERO (same day). His words, with the hero selected: "Whole case study
   locked from this section. Like a faded paywall asking for password. Like faded blur."
   Locked, the page is the opening, the hero, and then the next stretch seen through a blur that fades to nothing,
   with the password form over it. NOTHING after that stretch is sent to a browser that has not unlocked. The
   blurred stretch itself IS in the page's HTML (it is made-up figures and DRAFT words, hidden from keyboard and
   screen readers); flagged to him. Unlocked, the page is the fourth version's, with every full screen.

   Adani Cement, FIFTH version (2026-11-17). His words on the fourth (../adani-v4), with the third version's
   figure of six tiles at full size selected: "let's make a V5 with something like this section improved and added
   in the hero and lock out everything else. On top of V4."
   WHAT CHANGED FROM THE FOURTH (the fourth is untouched):
   - The hero is no longer the whole summary zoomed down. It is the summary's own block of tiles at close to full
     size: all nine measures and the alarms in the design's rows (three, four, two beside the alarms), inside the
     screen's top bar, side menu, title and filters.
   - Everything else on that screen is locked: the trend chart under the tiles and the plant map beside them show
     blurred stand-ins with a lock (the real crops for a browser that has unlocked). To keep the tiles large, the
     locked parts are smaller than on the design: the chart is a strip and the map a narrower column.
   - Read as "everything else IN THE HERO". If he meant the rest of the PAGE, that is asked of him.
   Everything below this note is the fourth version's own record.

   Adani Cement, FOURTH version (2026-11-17). His words on the third (../adani-v3), after a visual audit
   (research/adani-case-2026-11-17/AUDIT-v3-visual.md): "Currently, it feels big overwhelming to follow along the
   case study. Will work on V4", and on its library: "a library system like to look all the charts at once with
   dark theme toggle for entire."
   WHAT CHANGED FROM THE THIRD, all of it reversible (the third is untouched):
   - Each chart shows ONCE, in the library (./Gallery.tsx): twelve charts at once, one theme switch for all.
     The chapters that showed them one by one are folded into "Pick the chart by the question": the gap chart,
     the chart-choice table, the breakdown charts, the tables, and the developers' chapter. Their trade-offs are
     kept as sentences there.
   - The six-tile figure is gone (the cover shows all nine); its key to the terms is in the cover's caption.
   - The five locked strips through the page are gathered in "The full screens are locked" at the end; unlocked,
     that section shows every screen. The cover keeps its locked map. (He had asked for locked screens through
     the page: this is a proposal, put to him.)
   - Twelve headings became eight; 23 figures became 9; no sentence is new in meaning.
   Everything below this note is the third version's own record.

   Adani Cement, third version (2026-11-17). His words on the second (../adani-v2): "We got to improve
   this a lot", his four notes again (NDA and a password; more about data and UX in data visualization;
   his two certificates; Power BI), and then:
   "Adani is not fun or general user product. This is used by people at the level of C suite or rush
   people. We got to use and build charts as is. We will also balance the UI screen but locked mode.
   The whole case study needs to be positioned carefully especially data charts."

   WHAT CHANGED FROM THE SECOND
   - The charts are the product's own, redrawn as designed and at reading size (./charts.tsx), where
     the second had ten thumbnails of chart kinds. Every figure and name in them is changed.
   - Each chart is placed by the question it answers for a reader with a minute, and each chapter ends
     on the full screen that chart lives on, LOCKED: a blurred stand-in with a lock, or the real screen
     once the password is given. So charts (open) and screens (locked) alternate down the page.
   - The tone is an executive tool's: no cover of playful tiles, no moving parts except the entrance.
   - The map is not redrawn at all. Where each plant sits is part of what is confidential.

   THE LOCK is the second version's (../adani-v2/lock.ts, its unlock and screen routes): real screens
   live outside this repository and are handed over only with the cookie. Stand-ins in
   /public/sketches/work/adani-locked are each screen shrunk to 48px wide (the map to 9px) and blurred.

   SOURCES. His account: the goal, the sample data that is almost real, Power BI, who reads it ("C suite
   or rush people"), "a minor misread can lead to a serious loss". Public record: the acquisition closed
   on 16 September 2022 and made Adani India's second-largest cement maker (Outlook Business, Deccan
   Herald). The design file: 7 clusters and 34 plants, the tile's parts, the arrow meaning better or
   worse than target, nine measures in six units, each chart's kind and parts, the tabs, the plant's
   table, 17 areas and 124 full screens. Microsoft Learn, "Optimization guide for Power BI".
   Certificates: his resume library.

   LATER THE SAME DAY: "We also got to talk about the color choices, adani's font and about UX in chart choice I
   made. Designing for the key components and their choice." Added: the table of chart choices (his, so said
   as "I chose"), a chapter on color and type, and one on the shared parts. From the design file: labels are
   "Adani Regular" (the client's own typeface, drawn here with Maven Pro as a stand-in), every figure is Arial
   (Arial Bold 30 on a tile; 16, 12, 10 on charts); a paint style named Primary #58308c; actual #5710a0, budget
   #53acff, target #ffbf16, variance #f3701f, surplus #64bc48, better #00a92f, worse #dc0606; the dark
   theme's actual is #923fe8. WHY each was chosen is his to give; the page says what each does.

   AFTER THE RESEARCH (t-portfolio-redo/research/dataviz-ux-2026-11-17/SYNTHESIS.md), his "Yes lets see it in action":
   the summary's three versions open the first chapter (blocks only: no figure, no map); costs are named (the arrow on a
   falling figure, the floating gap); the color chapter says which pairs survive color blindness and that Arial's digits
   are one width (both measured); "Load fast" became "Built for Power BI"; and "What I would change now" shows three
   corrections with their measured contrast. That last chapter is self-critique of client work, written for him: HIS
   CALL to keep or cut. Whose decision each version was is still his to say; the text states only what the file shows.

   THEN: "I think, have to discuss on colors we chose on the charts to easily distinguish, for low res screens, user
   behavior our colors, recognition, cognitive load, interaction with charts, easy readability of small numbers.
   Information architecture, dashboard layout best optimized for the best usability." / "I worked closely with developers
   to bring this to life and taught engineers design" / "I want to build a chart library we used in this project and if
   users can interact with charts, that would be a big plus." / of the summary-as-blocks picture: "this illustration makes
   this case study off". So: that picture is gone, and so are the block drawings of the three versions (now the real
   table, card and tile); the charts are live (./Live.tsx: values on hover, tabs that change the measure, a legend that
   switches a plant off, a tree that opens); a chart library with a theme switch closes the build chapter, which now
   says he worked with the developers; a chapter on layout and information architecture; the color chapter carries his
   points. "On low-resolution screens too" and "taught the engineers the reasoning" are his account, in my words: DRAFT.

   AFTER THE CRITIQUE (research/dataviz-ux-2026-11-17/REVIEW.md) and his "Along with them, Will also work on this chart" (a
   two-ring chart of clusters and plants): the cover is one whole summary screen at a readable size, with the alarms
   tile; the weekly chart was corrected and then put back as designed at his word ("this isn't our design"); headings claim only what
   every picture bears out; every strip of tabs works or is gone; figures reconcile; charts are drawn for the width they
   show at; each chart has a table for screen readers; the terms on the tiles are defined; the sunburst is added with
   clusters and plants numbered (his picture of it carries real names: never copied).
   STILL AS DESIGNED, and said so on the page: a color on every tile, the arrows, the donuts' palettes, the dark theme.

   NOT HERE, his to give: which parts were his; what was wrong before; whether it was released; a
   decision of his with the option he turned down; whether the charts were built in Power BI as drawn;
   whether load time was measured; whether the NDA allows sharing behind a password. Every sentence is
   DRAFT. */
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const maven = Maven_Pro({ subsets: ["latin"], variable: "--font-maven" });
const HOME = HOME2;

export const metadata = {
  ...pageMetadata({ path: HOME, title: "Adani Cement, 34 plants on one screen", description: "A leadership dashboard for 34 cement plants, designed to be read in a minute and read right." }),
  ...NOINDEX,
};

const S = `${HOME2}/screen`, BLUR = "/sketches/work/adani-locked";
// The summary's nine measures, in six units. Figures changed.
// The summary's nine tiles and its chart's nine measures live in ./summary.tsx (the Leadership Summary as designed).

const REST = [["logistics", "Logistics"], ["benchmark", "Benchmarking"], ["quality", "Quality and emission"], ["sales", "Sales tree"], ["hr", "HR"], ["micro-market", "Micro market"], ["finance", "Finance"], ["procurement", "Procurement"], ["safety", "Process safety"], ["inventory", "Daily inventory"], ["fpc", "FPC"], ["alerts", "Alerts"]];
// The colors and their jobs, read from the design file (hex values are the file's).
const JOBS: [job: string, where: string, hex: string][] = [["Actual", "Every chart", "#5710a0"], ["Budget", "Beside actual", "#53acff"], ["Target", "A line on the column", "#ffbf16"], ["Variance", "Short of target", "#f3701f"], ["Surplus", "Over target", "#64bc48"]];
/* A figure recomposed for the fourth version at his word ("We got to fix and adjust these two sections"),
   both measured from the design file (read-only, 2026-11-17):
   - the summary's three versions: 324:4 (a table, each row 1008 x 82, an icon before each name), 388:456 (a card
     485 x 215 with a darker title band and an icon), and the tile. All three are drawn at the design's own pixel
     size and zoomed by the same amount, so their sizes compare; they carry the SAME three made-up figures, so what
     changes from one to the next is only which figure leads. The design's second card labels its first two figures
     "Estimated" twice; the middle one reads "Actual" here (flagged to him).
   - the menu and the areas: rebuilt from 10393:6359, then taken out at his word ("I think this section is not
     required"). Its chapter's point about layout now sits under the cover, which shows that layout; the counts of
     areas and screens stay in "Where it stands". The earlier menu figure is still in ../adani-v3. */
const VERS = { le: "640", tar: "620", act: "590" };
const VTILE = { name: "Cement Production", unit: "Tons", act: VERS.act, le: VERS.le, tar: VERS.tar, good: false, tone: "l-blue", icon: "cementProd" };
const MENU = ["Leadership Summary", "Plant Summary", "Energy", "Stocks in Silos", "Quality & Emission", "Equipment Performance", "Cost"];
const Lock = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10.5V8a5 5 0 0 1 10 0v2.5M6 10.5h12a1.500 1.500 0 0 1 1.500 1.500v7A1.500 1.500 0 0 1 18 20.500H6A1.500 1.500 0 0 1 4.500 19v-7A1.500 1.500 0 0 1 6 10.500z" /></svg>;

type Shot = { src: string; w: number; h: number; name: string; alt: string };
/* A full screen of the product in its place on the page: the real one for a browser that has unlocked,
   a blurred stand-in with a lock for everyone else. */
function Screens({ open, shots, caption }: { open: boolean; shots: Shot[]; caption: string }) {
  return (
    <figure className="st-fig a3d-screens">
      <div className={`st-desk ad-desk a3d-slot a3d-slot--${shots.length}${open ? " is-open" : ""}`}>
        {shots.map((s) => (
          <div key={s.src}>
            {open ? <img className="ad-shot" src={`${S}/${s.src}`} width={s.w} height={s.h} loading="lazy" alt={s.alt} />
              : <span className="a3d-veil"><img src={`${BLUR}/${s.src}.webp`} width={480} height={Math.round((480 * s.h) / s.w)} loading="lazy" alt="" /><a href="#screens"><Lock />Locked<small>{s.name}</small></a></span>}
            {shots.length > 1 && <p>{s.name}</p>}
          </div>
        ))}
      </div>
      <figcaption>{caption} {open ? "The signed-in name is removed." : "Full screen, locked: the figures on it are confidential."}</figcaption>
    </figure>
  );
}

export default async function SketchCaseAdani5({ searchParams }: { searchParams: Promise<{ wrong?: string }> }) {
  const open = await isOpen(), wrong = Boolean((await searchParams).wrong);
  // The full screens show only where they can be read (./lock.ts hasVault); elsewhere they stay veiled even when unlocked.
  const seen = open && (await hasVault());
  // The first stretch after the hero. Unlocked it is the page; locked it is only what shows through the blur.
  // Locked: the tiles alone, seen through the blur. Unlocked: the whole Leadership Summary, as in the fourth version.
  const tilesHero = (
    <figure className="a3d-herofig">
      <Seen at={0.1} className="ad-in a3d-band">
        <div style={I(0)}><AdaniTiles /></div>
      </Seen>
      <figcaption>The leadership summary&rsquo;s nine measures and its alarms, as designed and at full size; every figure is changed. LE is the latest estimate and Tar. the target. STEC is heat used per kilogram of clinker, TSR the share of heat from alternative fuels, SEEC electricity used per ton.</figcaption>
    </figure>
  );
  const cover = (
    <figure className="a3d-herofig">
      <Seen at={0.1} className="ad-in a3d-band">
        <div className="a3s" style={I(0)}>
          <div className="a3s-bar"><b>AAA Visualization</b><span>Theme:<i>Light<u /></i><Ico n="avatar" className="a3s-av" /><svg className="a3s-caret" viewBox="0 0 11 6" aria-hidden="true"><path d="M0 0h11L5.5 6z" /></svg></span></div>
          <Rail />
          <div className="a3s-main">
            <div className="a3s-head">
              <h3>Leadership Summary <small>(7 Cluster - 34 Plants) &nbsp;LE as on 23/01/2023</small></h3>
              <div className="a3p-filters"><div>{[["Cluster:", "All Clusters"], ["Plant:", "All Plants"], ["Date Range:", "WTD"]].map(([l, v]) => <span key={l}>{l}<b>{v}<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0h10L5 6z" /></svg></b></span>)}</div></div>
            </div>
            <div className="a3s-body">
              <div className="a3s-l">
                <div className="a3s-tiles">
                  {LEAD.map((t) => <LTile key={t.name} t={t} />)}
                  <Alarms />
                </div>
                <LiveWeekly tips={false} measures={LEAD_MEASURES} h={246} />
              </div>
              {seen ? <img className="ad-shot a3s-map" src={`${S}/map`} width={758} height={902} alt="A map with a dot for each plant." />
                : <span className="a3d-veil a3s-map"><img src={`${BLUR}/map.webp`} width={480} height={571} alt="" /><a href="#screens"><Lock />Locked<small>Plant map</small></a></span>}
            </div>
          </div>
        </div>
      </Seen>
      <figcaption>The leadership summary, redrawn whole as designed; every figure is changed{seen ? "" : " and the map stays locked"}. LE is the latest estimate and Tar. the target. STEC is heat used per kilogram of clinker, TSR the share of heat from alternative fuels, SEEC electricity used per ton.</figcaption>
    </figure>
  );
  const after = (
    <>
      <section className="st-sec st-sec--after">
        <span aria-hidden="true" />
        <div className="st-col">
          <p>Filters sit across the top, because they change everything beneath them. <b>The figures a leader checks first are top left, the trend that explains them is under them, and the map of plants is on the right.</b> Detail is never on the page: it opens from a tile, a column or a dot.</p>
          <p>The same frame holds all seventeen areas, so a reader who knows one screen knows where to look on the next.</p>
        </div>
      </section>

      <section className="st-sec">
        <h2>Start with the answer: one figure per measure</h2>
        <div className="st-col">
          <p>The summary went through three versions. The first was a table: estimated, planned and actual, side by side, with two charts beneath. The second gave each measure a card with three figures at one size, and moved the charts into one, behind tabs.</p>
          <p><b>The version that stayed puts the actual figure first on each tile, with the latest estimate and the target small beneath,</b> and adds an alarms tile for what needs a response.</p>
        </div>
      </section>
      <figure className="st-fig">
        <Seen at={0.2} className="st-desk ad-desk ad-in a4v">
          <div className="a4v-in">
            <div className="a4v-1" style={I(0)}>
              <p className="a4v-lab"><i>01</i>A table</p>
              <div className="a4v-table" role="img" aria-label={`Version one: a table with a row for each measure and columns for estimated, planned and actual, all at one size. Cement Production: estimated ${VERS.le}, planned ${VERS.tar}, actual ${VERS.act} tons, in red with a down arrow. Figures are changed.`}>
                <span className="a4v-th"><b>Type</b><b>Estimated</b><b>Planned</b><b>Actual</b></span>
                {["Cement Production", "Clinker Production", "Dispatch"].map((n) => (
                  <span key={n} className="a4v-tr"><em><Ico n="cementProd" />{n}</em><em>{VERS.le} <small>tons</small></em><em>{VERS.tar} <small>tons</small></em><em className="is-low">{VERS.act} <small>tons</small><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.500v11M3.500 9l4.500 4.500L12.500 9" /></svg></em></span>
                ))}
              </div>
            </div>
            <div className="a4v-2" style={I(1)}>
              <p className="a4v-lab"><i>02</i>Three figures, one size</p>
              <div className="a4v-card" role="img" aria-label={`Version two: a card for Cement Production with three figures at the same size: estimated ${VERS.le}, actual ${VERS.act}, target ${VERS.tar}. Figures are changed.`}>
                <b><Ico n="cementProd" />Cement Production (in Tons)</b>
                <span><em>{VERS.le}<small>Estimated</small></em><em>{VERS.act}<small>Actual</small></em><em>{VERS.tar}<small>Target</small></em></span>
              </div>
            </div>
            <div className="a4v-3" style={I(2)}>
              <p className="a4v-lab"><i>03</i>One figure first</p>
              <LTile t={VTILE} />
            </div>
          </div>
        </Seen>
        <figcaption>One measure in the summary&rsquo;s three versions, at the same scale and with the same three sample figures.</figcaption>
      </figure>
    </>
  );
  return (
    <div className={`${sans.variable} ${mono.variable} ${maven.variable}`}>
      <div className="lv st st--adani st--adani2 st--adani3 st--adani4 st--adani5">
        <header className="st-top">
          <a href="/work"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" /></svg>Work</a>
          <a href="/">Dinesh Revunuru</a>
        </header>
        <main>
          <section className="st-open">
            <dl className="st-rail">
              <div><dt>Client</dt><dd>Adani Cement</dd></div>
              <div><dt>Year</dt><dd>2023</dd></div>
              <div><dt>Role</dt><dd>Product Designer, with Neudesic</dd></div>
              <div><dt>Scale</dt><dd>7 clusters, 34 plants</dd></div>
            </dl>
            <div className="st-col">
              <h1>34 cement plants on one screen, for readers who have a minute.</h1>
              <p>In 2022 Adani completed its acquisition of Ambuja Cements and ACC and became India&rsquo;s second-largest cement maker. The plants now came from three companies, and leadership needed to track all of them in one place.</p>
              <p>I designed that dashboard on Neudesic&rsquo;s team, for Power BI. <b>Its readers are senior leaders and people in a hurry, so every chart had to answer one question at a glance, and answer it correctly.</b></p>
              <p>{open ? "The client\u2019s data is confidential. The summary below is redrawn as designed with its figures and names changed, and the full screens follow." : "The client\u2019s data is confidential, so the case study is locked."}</p>
            </div>
          </section>

          {open ? (
            <>
              {cover}
              {after}
              <section className="st-sec st-sec--after">
                <span aria-hidden="true" />
                <div className="st-col">
                  <p>One arrow on the tile says better or worse than target, not up or down, so lower energy use reads green. The cost: an up arrow beside a figure that fell can be read as &ldquo;went up&rdquo;.</p>
                  <p>The nine measures come in six units, and a misread at this level can lead to a serious loss. Every tile names its unit beside the measure.</p>
                </div>
              </section>
              <section className="st-sec">
                <h2>Pick the chart by the question</h2>
                <div className="st-col">
                  <p>I chose each chart by the question it has to answer, not by what the data could fill. <b>One question, one chart, one comparison in it.</b></p>
                  <p>I worked closely with the developers who built this in Power BI, and taught the engineers the reasoning behind each chart, so the rules held as the screens were built. <b>The charts became a library: each kind with the question it answers.</b></p>
                  <p>Each choice has a cost. All the measures share one gap chart, a tab each, so only one shows at a time, and a week that fell short stands as tall as its target. Rings show who is large at a glance and are poor for close comparison. The donuts change palette from ring to ring; one color per department would compare better.</p>
                </div>
              </section>
              <figure className="st-fig">
                <Library5 />
                <figcaption>The chart library: twelve of the dashboard&rsquo;s charts, each with the question it answers. Choose one to open it large and live; the theme switch changes all of them. Figures changed; the dark theme is as designed.</figcaption>
              </figure>

              <section className="st-sec">
                <h2>Purple is always the actual figure, and figures read small</h2>
                <div className="st-col">
                  <p>The chart colors had to be told apart quickly, on low-resolution screens too. <b>Purple is the actual figure on every chart,</b> and green and red mean only better or worse than target. The rest change with the chart: orange is a shortfall on one and a best-ever line on another, which is a cost.</p>
                  <p>Purple and blue stay apart for a color-blind reader. The red and green of better and worse do not, so the mark&rsquo;s shape has to say it a second time.</p>
                  <p>Titles and labels are set in Adani&rsquo;s own typeface. <b>Every figure is set in Arial,</b> from the 30px figure on a tile to the values on a chart. Arial&rsquo;s digits are all one width, so figures line up in a column. Few figures have to be read off an axis: columns carry their own, and the exact value is one hover away.</p>
                </div>
              </section>
              <figure className="st-fig">
                <Seen at={0.2} className="st-desk ad-desk ad-in a3d-pair a3d-system">
                  <div style={I(0)}>
                    <div className="a3c a3k">
                      <p className="a3c-t">Color</p>
                      <span className="a3k-head"><i /><small>The header</small></span>
                      <ul className="a3k-jobs">{JOBS.map(([job, where, hex]) => <li key={job}><i style={{ background: hex }} /><b>{job}</b><span>{where}</span><small>{hex}</small></li>)}</ul>
                      <ul className="a3k-status">
                        <li><i className="is-good"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12.500v-9M4 7.500l4-4 4 4" /></svg></i><b>Better than target</b><small>#00a92f</small></li>
                        <li><i><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.500v9M4 8.500l4 4 4-4" /></svg></i><b>Worse than target</b><small>#dc0606</small></li>
                      </ul>
                      <span className="a3k-dark"><i style={{ background: "#5710a0" }} /><em>Light theme</em><i className="is-night" style={{ background: "#923fe8" }} /><em>Dark theme</em></span>
                    </div>
                    <p><i>Color</i>One job each, the same on every screen.</p>
                  </div>
                  <div style={I(1)}>
                    <div className="a3c a3y">
                      <p className="a3c-t">Type</p>
                      <div>
                        <small>Words: Adani&rsquo;s typeface</small>
                        <span style={{ fontSize: 26 }}>AAA Visualization<u>26</u></span>
                        <span style={{ fontSize: 24 }}>Leadership Summary<u>24</u></span>
                        <span style={{ fontSize: 18 }}>Clinker Production<u>18</u></span>
                        <span style={{ fontSize: 16 }}>Date Range:<u>16</u></span>
                        <span style={{ fontSize: 14 }}>Cem. Prod.<u>14</u></span>
                      </div>
                      <div className="is-fig">
                        <small>Figures: Arial</small>
                        <span style={{ fontSize: 30, fontWeight: 700 }}>1540<u>Bold 30</u></span>
                        <span style={{ fontSize: 16 }}>63.4<u>16</u></span>
                        <span style={{ fontSize: 12 }}>Week 1<u>12</u></span>
                        <span style={{ fontSize: 10 }}>300<u>10</u></span>
                      </div>
                    </div>
                    <p><i>Type</i>The sizes are the design file&rsquo;s. Adani&rsquo;s typeface is drawn here with a stand-in.</p>
                  </div>
                </Seen>
              </figure>

              <section className="st-sec">
                <h2>Design the few parts that every screen repeats</h2>
                <div className="st-col">
                  <p>Seventeen areas are built from the same handful of parts. <b>Filters sit across the top, the tile holds a measure, a strip of tabs shares one chart, a menu on the tile goes deeper, and a tooltip gives the exact value.</b> Date ranges open on week, month and year to date before the calendar.</p>
                </div>
              </section>
              <figure className="st-fig">
                <Seen at={0.2} className="st-desk ad-desk ad-in a3d-parts">
                  <div className="a3p-nav" style={I(0)}>
                    <small>Navigation</small>
                    <div className="a3p-menu"><span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.500h5v5H2zM9 2.500h5v3H9zM9 7.500h5v6H9zM2 9.500h5v4H2z" /></svg>Global Dashboard</span><span className="is-open"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 13.500h12M3 13.500v-5l3-2v2l3-2v2l3-2v7" /></svg>Manufacturing</span>{MENU.map((m, k) => <span key={m} className={k === 0 ? "is-sub is-on" : "is-sub"}>{m}</span>)}<span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13.500V6M6.500 13.500v-10M10 13.500V8M13.500 13.500V5" /></svg>Sales</span></div>
                  </div>
                  <div className="a3p-filters" style={I(1)}>
                    <small>Filters, across the top of every screen</small>
                    <div>{[["Cluster:", "All Clusters"], ["Plant:", "All Plants"], ["Date Range:", "WTD"]].map(([l, v]) => <span key={l}>{l}<b>{v}<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0h10L5 6z" /></svg></b></span>)}</div>
                  </div>
                  <div className="a3p-tabs" style={I(2)}>
                    <small>Tabs: one chart, many measures</small>
                    <DemoTabs />
                  </div>
                  <div className="a3p-drill" style={I(3)}>
                    <small>On a tile: go deeper</small>
                    <div><span><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.300" /><path d="M8 5v6M5.500 8.500L8 11l2.500-2.500" /></svg>Drill down</span><span><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.300" /><path d="M5 8h6M8.500 5.500L11 8l-2.500 2.500" /></svg>Drill through<svg viewBox="0 0 8 14" aria-hidden="true"><path d="M1 1l6 6-6 6" /></svg></span></div>
                  </div>
                  <div className="a3p-tip" style={I(4)}>
                    <small>On hover: the exact value</small>
                    <div><span>STEC: 742</span><span>TSR: 21%</span></div>
                  </div>
                  <div className="a3p-date" style={I(5)}>
                    <small>Date range</small>
                    <div><span className="is-on">WTD</span><span>MTD</span><span>YTD</span><span className="is-cal"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.500 4h11v9.500h-11zM2.500 6.800h11M5.500 2.500v3M10.500 2.500v3" /></svg>Calendar</span></div>
                  </div>
                  <div className="a3p-theme" style={I(6)}>
                    <small>Theme</small>
                    <div><span>Theme:<b>Light<i /></b></span><span className="is-night">Theme:<b><i />Dark</b></span></div>
                  </div>
                </Seen>
                <figcaption>The parts shared by every area, redrawn from the designs.</figcaption>
              </figure>

              <section className="st-sec">
                <h2>What I would change now</h2>
                <div className="st-col">
                  <p>Checked today against the accessibility standard&rsquo;s contrast formula, the design falls short in places. <b>White text on the lighter tiles is too faint, the orange and green of the gap look alike to a color-blind reader, and an arrow reads as &ldquo;went up&rdquo; when it means &ldquo;better&rdquo;.</b> A color on every tile also competes with that mark; I would keep color for status alone.</p>
                </div>
              </section>
              <figure className="st-fig">
                <Seen at={0.2} className="st-desk ad-desk ad-in a3d-fix">
                  <div style={I(0)}>
                    <span className="a3f-pair">
                      <span className="a3f-tile a3f-tile--was"><b>STEC <small>(Kcal/Kg Clink)</small></b><strong>742</strong><em>LE : 760</em></span>
                      <span className="a3f-tile a3f-tile--now"><b>STEC <small>(Kcal/Kg Clink)</small></b><strong>742</strong><em>LE : 760</em></span>
                    </span>
                    <p><i>Tile text</i>White on the light green is 2.2 to 1. On a darker green it is 5.1 to 1; small text needs 4.5.</p>
                  </div>
                  <div style={I(1)}>
                    <span className="a3f-pair a3f-gap">
                      <span><i style={{ background: "#f3701f" }} /><i style={{ background: "#64bc48" }} /></span>
                      <span><i style={{ background: "#b4430f" }} /><i className="is-line" style={{ background: "#8fdc7f" }} /></span>
                    </span>
                    <p><i>Short and over</i>As designed, the two are the same lightness. A dark and a light one stay apart without color.</p>
                  </div>
                  <div style={I(2)}>
                    <span className="a3f-pair a3f-mark">
                      <span><Arrow good /><Arrow good={false} /></span>
                      <span><i className="is-good"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8.500l2.700 2.700L12 5.500" /></svg></i><i><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4v5M8 11.800v.2" /></svg></i></span>
                    </span>
                    <p><i>Status</i>A tick and a warning mark say better or worse without pointing up or down, and nothing shows at zero.</p>
                  </div>
                </Seen>
                <figcaption>Left of each pair: as designed. Right: what I would change.</figcaption>
              </figure>

              <section className="st-sec">
                <h2>The full screens are locked</h2>
                <div className="st-col">
                  <p>The data was a sample close to the real thing, and it, the plants&rsquo; details and where they sit could be used by competitors. So the full screens are not public. <b>They are here for hiring teams, with a password I share on request.</b></p>
                </div>
              </section>
              {open ? (
                <>
                  <Screens open={seen} caption="The leadership summary in its light and dark themes." shots={[
                    { src: "summary-light", w: 1920, h: 1080, name: "Light theme", alt: "The leadership summary: nine measures as colored tiles, alarms, a production chart, and a map with a dot for every plant." },
                    { src: "summary-dark", w: 1920, h: 1080, name: "Dark theme", alt: "The leadership summary in the dark theme, laid out the same way." },
                  ]} />
                  <Screens open={seen} caption="One plant&rsquo;s summary and its stock." shots={[
                    { src: "plant-summary", w: 1920, h: 1080, name: "Plant summary", alt: "One plant's summary: eighteen measures as tiles and the weekly chart beneath them." },
                    { src: "silo", w: 1920, h: 1080, name: "A plant's stock", alt: "A plant's stock, silo by silo." },
                  ]} />
                  <Screens open={seen} caption="The plant map and one plant&rsquo;s figures." shots={[
                    { src: "map", w: 758, h: 902, name: "Plant map", alt: "A map with a dot for each plant." },
                    { src: "plant", w: 1512, h: 1156, name: "One plant", alt: "One plant's figures: latest estimate, target, actual and variance for each of eight measures." },
                  ]} />
                  <figure className="st-fig">
                    {seen && <div className="st-desk ad-desk ad-wall a3d-rest">
                      {REST.map(([src, name]) => <div key={src}><img className="ad-shot" src={`${S}/wall-${src}`} width={960} height={540} loading="lazy" alt={`${name}: a screen in the same frame.`} /><p>{name}</p></div>)}
                    </div>}
                    {seen && <figcaption>Twelve more screens in the same frame.</figcaption>}
                    <form className="a2d-again" method="post" action={`${HOME2}/unlock`}><input type="hidden" name="to" value="v5" /><button type="submit" name="again" value="1">Lock the screens again</button></form>
                  </figure>
                </>
              ) : (
                <figure className="st-fig">
                  <div className="st-desk ad-desk a2d-lock">
                    <div className="a2d-blur" aria-hidden="true">{["summary-light", "plant-summary", "summary-dark", "wall-logistics"].map((n) => <img key={n} src={`${BLUR}/${n}.webp`} width={480} height={270} alt="" loading="lazy" />)}</div>
                    <form method="post" action={`${HOME2}/unlock`}>
                      <input type="hidden" name="to" value="v5" />
                      <Lock />
                      <label htmlFor="a3d-pw">Password</label>
                      <span><input id="a3d-pw" name="password" type="password" autoComplete="off" required aria-describedby={wrong ? "a3d-wrong" : undefined} aria-invalid={wrong || undefined} /><button type="submit">Unlock</button></span>
                      {wrong && <p id="a3d-wrong" role="alert">That password is not right. Try again.</p>}
                    </form>
                  </div>
                  <figcaption>One password opens them all: the leadership summary in both themes, a plant&rsquo;s summary and stock, the plant map, one plant&rsquo;s figures, and twelve more screens.</figcaption>
                </figure>
              )}

              <section className="st-sec">
                <h2>Where it stands</h2>
                <div className="st-col">
                  <p>I have no figures of my own for this work, so none are claimed. <b>What can be shown is its size, and what I trained in to do it:</b> two Interaction Design Foundation certificates, in data visualization and in dashboards.</p>
                </div>
              </section>
              <figure className="st-fig">
                <Seen at={0.3} className="ad-in ad-scale">
                  <dl>
                    <div style={I(0)}><dd>7</dd><dt>clusters</dt></div>
                    <div style={I(1)}><dd>34</dd><dt>plants in one view</dt></div>
                    <div style={I(2)}><dd>17</dd><dt>business areas in one frame</dt></div>
                    <div style={I(3)}><dd>124</dd><dt>full screens designed</dt></div>
                  </dl>
                  <p>Clusters and plants are from the dashboard&rsquo;s own header. Areas and screens are counted in the design file. They show scale, not a result of mine.</p>
                </Seen>
                <ul className="a2d-certs">
                  <li><b>User Experience in Data Visualization</b>Interaction Design Foundation</li>
                  <li><b>UX Specialization for Dashboards</b>Interaction Design Foundation</li>
                </ul>
              </figure>
            </>
          ) : (
            <div className="a5w a2d-lock" id="screens">
              {/* What comes next, seen through a blur that fades out: it cannot be read, clicked or reached by keyboard or a screen reader. */}
              <div className="a5w-peek" aria-hidden="true" inert>{tilesHero}{after}</div>
              {/* The password card, in the portfolio's own language (story.css, live.css): the near-white surface with a
                  hairline, the small uppercase label, the page's heading and text sizes, and one pill that holds the field
                  and the black pill button. The client's purple is not used here: this card is the portfolio speaking. */}
              <form className="a5k" method="post" action={`${HOME2}/unlock`}>
                <input type="hidden" name="to" value="v5" />
                <p className="a5k-tag"><Lock />Locked</p>
                <h2>This case study is locked</h2>
                <p className="a5k-why">The client&rsquo;s data is confidential. It is here for hiring teams, with a password I share on request.</p>
                <label htmlFor="a3d-pw">Password</label>
                <span className="a5k-field"><input id="a3d-pw" name="password" type="password" autoComplete="off" required aria-describedby={wrong ? "a3d-wrong" : undefined} aria-invalid={wrong || undefined} /><button type="submit">Unlock<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></button></span>
                {wrong && <p id="a3d-wrong" className="a5k-wrong" role="alert">That password is not right. Try again.</p>}
              </form>
            </div>
          )}

          <nav className="st-next" aria-label="More">
            <a className="st-btn" href="/amn-healthcare-case-study">Next: AMN Healthcare</a>
            <a className="st-btn st-btn--soft" href="/work">All work<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></a>
          </nav>
        </main>
        <StillToggle />
      </div>
    </div>
  );
}
