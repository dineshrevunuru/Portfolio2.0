import { Geist_Mono, Inter_Tight, Open_Sans } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { NOINDEX, pageMetadata } from "../../seo";
import Seen from "../_shared/Seen";
import { PIC, CREDS, Field, Home, I, Ic, type IcName, Job, Logo, Phone, SIGN_IN, SIGN_UP, type StepT, Tick, Wise } from "./parts";
import "../_shared/figma.css";
import "../_shared/live.css";
import "../_shared/story.css";
import "../_shared/amn.css";
import "../_shared/amn2.css";
import "../_shared/amn3.css";
import "../_shared/amn5.css";

/* AMN Healthcare, fifth version (2026-11-17). His words on the fourth: "I like the writing from V4 but
   then like visual from V3 and some from V2 too", with pictures of what he meant: the fourth's opening
   (the rail and the two paragraphs), and from the second (../amn-v2) the Type cell ("Aa", Open Sans and
   four sample lines) and the "One lock-up" cell.

   So: every word is the fourth's (../amn-v4: headings that state the decision, fewer captions, the two
   trade-offs, AMN's stated aim with its source, the closing panel labelled as scale, the ShiftWise
   chapter told before-search then results). Every picture is the third's (../amn-v3): the three people
   cards in their products' full colour, and each flow as one strip read left to right. The board takes
   the second's Type cell and lock-up cell as he saw them, in the places they had there.

   Then (same day, edited in place):
   - "Let's figure out how we can add these to V5 in addition", with the third's table of type styles
     and its three logo tiles selected. Both are here beside his picks from the second.
   - "We don't need these extra writing for all the screens": a phone screen has its number and title,
     no sentence under it.
   - "This section got so messed up. Let's refine it in V5 itself": the board is two groups with a
     label each. Foundations pairs color on the left with type on the right (Color | Type, then the
     colors with an assigned meaning | Type styles), then Icons | Logos. Components is Buttons, Form
     parts and the error card, a new "Tags and status" strip, then Cards in four labelled columns.
     Cells in a row are the same height, with nothing left hanging.
   - "The between text and UI is very close": the board sat 0px under its text (story.css's reset of
     figure margins beat the board's own); it now has the 56px every other picture has.
   - He sent pictures of the app as a reference. From them, and marked in the caption: the tags
     "Rapid Response/Crisis" and "Travel", "PAST DUE", the on-assignment flag, the count badge, and
     the assignment row. Real people, hospitals and photographs in those pictures are NOT used.

   Photographs (same day): "Let's try finding similar images on open source image platforms", then
   "will go with recommendations". Eight free stock pictures from Unsplash and Pexels fill the places the
   designs have photographs: under the purple, the job and assignment pictures, the uploaded record, and
   the people. Credits: /public/sketches/work/amn/CREDITS.md. Search and picks:
   t-portfolio-redo/research/amn-case-2026-11-17/images/.

   Kept from the fourth because it is a fix and not a look: a strip that runs past the screen fades at
   its right edge.

   Still missing and NOT inventable (his to give): a decision that was his own with the option he
   turned down; one thing that did not work; what was wrong before; whether his work was built and
   released; personas. Sources, what is replaced, no teammate named, no code claimed: as in the third
   version's note. Every sentence is DRAFT. */
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const open = Open_Sans({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-open-sans" });

export const metadata = {
  ...pageMetadata({ path: "/amn-healthcare-case-study", title: "AMN Healthcare, three products as one", description: "Three products from three places, rebuilt to belong together." }),
  ...NOINDEX,
};

// A strip of whole phone screens, the page's full width, read left to right.
const Flow = ({ steps, name, caption }: { steps: StepT[]; name: string; caption: string }) => (
  <figure className="a3-bandfig">
    <Seen at={0.15} className="a2-in a3-band a3-band--p">
      <ol className="a3-strip" data-n={steps.length} aria-label={name}>
        {steps.map((s, k) => <li key={s.n} style={I(k)}><Phone label={s.label}>{s.screen}</Phone><div className="a2-step"><small>{s.n}</small><b>{s.title}</b></div></li>)}
      </ol>
    </Seen>
    <figcaption>{caption}</figcaption>
  </figure>
);

const PALETTE: [string, string][] = [["Midnight Blue", "#003C69"], ["Sky Blue", "#0098DB"], ["Purple", "#6639B7"], ["Lavender", "#AC98DB"], ["Teal", "#008B95"], ["Light Cyan", "#5EB6E4"], ["Marine Blue", "#005BBB"], ["Moss Green", "#7AB800"], ["Grass Green", "#34B233"], ["Cool Gray", "#75787B"], ["Background Gray", "#F5F5F5"], ["Gray Text", "#333333"]];
const ALERTS: [string, string][] = [["Success", "#34b233"], ["Failure", "#c8553d"], ["No Value", "#75787b"]];
// The sheet's eleven "credentialing categories", in its order and its words.
const KINDS: [string, string][] = [["Certifications", "#ac98db"], ["Background", "#003c69"], ["Drug Screen", "#8a9fb5"], ["Immunizations", "#008b95"], ["Medical Exams", "#8fc3c9"], ["Online Exams", "#005bbb"], ["Training / Continued Education Unit", "#8aaede"], ["Identity & Employment Authorization", "#34b233"], ["Forms / Documents / Written Material", "#a8d7a0"], ["Client Specific Contract Enclosures", "#75787b"], ["Licensure", "#6639b7"]];
const TYPE: [string, string, string, CSSProperties][] = [
  ["Headline 1", "30px", "Main Header", { fontSize: 30, lineHeight: "36px", color: "#003c69" }],
  ["Headline 2", "20px", "Large Header", { fontSize: 20, lineHeight: "26px" }],
  ["Headline 3", "18px", "Headline", { fontSize: 18, lineHeight: "24px", color: "#003c69" }],
  ["Sub Title", "16px", "Title, and a Text Link", { fontSize: 16, lineHeight: "22px" }],
  ["Body 1", "14px", "Body, list titles, inline links", { fontSize: 14, lineHeight: "20px" }],
  ["Body 2", "13px", "Subheader description", { fontSize: 13, lineHeight: "18px", color: "#75787b" }],
  ["Body 3", "12px", "Small body, tabs", { fontSize: 12, lineHeight: "16px", color: "#75787b" }],
  ["Body 4", "11px", "Micro body", { fontSize: 11, lineHeight: "14px", color: "#75787b" }],
];
const NOTES: [string, IcName, string][] = [["Time and Pay", "dollar", "#34b233"], ["Alert", "alert", "#c8553d"], ["On Assignment", "kit", "#008b95"], ["Booked Assignment", "kit", "#6639b7"], ["HR", "pen", "#005bbb"], ["Profile", "user", "#0098db"], ["Credentials", "idcard", "#333333"]];
const GENERAL: IcName[] = ["idcard", "home", "mail", "okc", "list", "folder", "bell", "clock", "people", "heart", "cal", "search", "user", "gear", "phone", "pin", "star", "eye", "trash", "pen", "dollar", "map", "flag", "bookmark", "download", "send", "refresh", "moon", "thumb", "finger", "syringe", "bed"];
const Cell = ({ name, span, i, children, className = "" }: { name: string; span: number; i: number; children: ReactNode; className?: string }) => <div className={`a2-cell a2-cell--${span} ${className}`} style={I(i)}><h3>{name}</h3>{children}</div>;
const Contact = ({ photo, name, role, preferred = false }: { photo: string; name: string; role: string; preferred?: boolean }) => (
  <span className={preferred ? "a3-contact is-pref" : "a3-contact"}>
    {preferred && <em><Ic d="heart" />My Preferred Recruiter</em>}
    <img className="a3-av" src={PIC(photo)} alt="" width="240" height="240" />
    <span><b>{name}</b><small>{role}</small><i>{preferred ? <><Ic d="star" />Rate Contact</> : <><Ic d="heart" />Mark as Preferred Recruiter</>}</i><span className="a3-reach"><u><Ic d="mail" /></u><u><Ic d="chat" /></u><u><Ic d="phone" /></u></span></span>
  </span>
);

const DEV = {
  phone: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>,
  tablet: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="3" width="15" height="18" rx="2.5" /><path d="M11 18h2" /></svg>,
  desktop: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="12.5" rx="2" /><path d="M8.5 20.5h7M12 16.5v4" /></svg>,
};
const WHO: { key: string; product: string; who: string; where: string; devices: (keyof typeof DEV)[]; needs: string[] }[] = [
  { key: "p", product: "Passport", who: "The travel nurse", where: "On a phone", devices: ["phone"], needs: ["Find and book assignments", "Keep credentials up to date", "Track time and pay"] },
  { key: "w", product: "ShiftWise", who: "Hospitals and their staffing vendors", where: "On a desktop, a tablet or a phone", devices: ["desktop", "tablet", "phone"], needs: ["Order and schedule agency staff", "Find a staff member and check their status", "Review timeslips"] },
  { key: "s", product: "Silversheet", who: "The credentialing team", where: "On a desktop", devices: ["desktop"], needs: ["Track every clinician’s credentials", "Get a reminder before one expires", "Run verifications"] },
];
const LINES: { name: string; how: string; year: number; c: string }[] = [
  { name: "ShiftWise", how: "Bought by AMN in 2013", year: 2013, c: "var(--wise)" },
  { name: "Silversheet", how: "Bought by AMN in 2019", year: 2019, c: "#00727a" },
  { name: "Passport", how: "Built by AMN, released in 2020", year: 2020, c: "var(--purple)" },
];

export default function SketchCaseAmn5() {
  return (
    <div className={`${sans.variable} ${mono.variable} ${open.variable}`}>
      <div className="lv st st--amn2 st--amn3 st--amn5">
        <header className="st-top">
          <a href="/work"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" /></svg>Work</a>
          <a href="/">Dinesh Revunuru</a>
        </header>
        <main>
          <section className="st-open">
            <dl className="st-rail">
              <div><dt>Client</dt><dd>AMN Healthcare</dd></div>
              <div><dt>Year</dt><dd>2022 to 2023</dd></div>
              <div><dt>Role</dt><dd>Product Designer, with Neudesic</dd></div>
              <div><dt>Scale</dt><dd>3 products, 200+ people</dd></div>
            </dl>
            <div className="st-col">
              <h1>Three products from three places, rebuilt to belong together.</h1>
              <p>AMN Healthcare places travel nurses and allied clinicians in hospitals across the United States. Three of its products carry that work, and each is for a different person: the nurse, the people who staff a hospital, and the team that checks credentials.</p>
              <p>I was a designer on the program that rebuilt them, a team of more than 200. Work came as user stories from product owners, with a UX architect over the flows. Mine was on <b>Passport, the nurse&rsquo;s app; the staff list in ShiftWise; and the design system under the screens.</b></p>
            </div>
          </section>

          <figure className="st-hero">
            <div className="a2-cover a3-cover">
              <div className="a3-z a3-z--cover"><Wise view="grid" n={8} label="The ShiftWise staff list: a search bar, filters and a grid of staff." /></div>
              <Phone label="Passport's home screen for a new user."><Home /></Phone>
            </div>
            <figcaption><span className="a2-wideonly">Two of the three: the ShiftWise staff list and Passport&rsquo;s home, redrawn from the designs.</span><span className="a2-narrowonly">Passport&rsquo;s home for a new nurse, redrawn from the designs.</span></figcaption>
          </figure>

          <section className="st-sec">
            <h2>Three products, three origins</h2>
            <div className="st-col">
              <p>AMN bought ShiftWise in 2013 and Silversheet in 2019, and built Passport itself, releasing it in 2020. Each was designed by a different team, years apart.</p>
              <p>AMN&rsquo;s 2023 proxy statement describes its digital strategy as running through Passport: more self-service, more automated steps. <b>The program rebuilt all three on new technology,</b> for a desktop, a tablet and a phone, across thousands of screens.</p>
            </div>
          </section>
          <figure className="st-fig">
            <Seen at={0.3} className="st-desk a2-in a2-time">
              <ol>
                {LINES.map((l, k) => <li key={l.name} style={{ "--y": l.year - 2013, "--c": l.c, "--i": k } as CSSProperties}><span><b>{l.name}</b>{l.how}</span><i /></li>)}
              </ol>
              <div className="a2-one" style={I(3)}><b>One program</b><span>Rebuilt on one design system</span></div>
              <div className="a2-axis" aria-hidden="true">{Array.from({ length: 11 }, (_, k) => <i key={k}>{k % 2 === 0 ? 2013 + k : ""}</i>)}</div>
              <div className="a2-me" style={I(4)}>My time on it</div>
            </Seen>
            <figcaption>Dates and strategy from AMN Healthcare&rsquo;s own announcements and filings.</figcaption>
          </figure>

          <section className="st-sec">
            <h2>Three people, three screens</h2>
            <div className="st-col">
              <p>Each product has its own user, with a different job to do and a different screen in front of them.</p>
              <p><b>All three work with the same things:</b> a person, a credential, and the date it runs out.</p>
            </div>
          </section>
          <figure className="st-fig">
            <Seen at={0.25} className="a2-in a2-who">
              {WHO.map((w, k) => (
                <div key={w.key} className={`a2-p a2-p--${w.key}`} style={I(k)}>
                  <span className="a2-dev">{w.devices.map((d) => <i key={d}>{DEV[d]}</i>)}</span>
                  <small>{w.product}</small>
                  <h3>{w.who}</h3>
                  <p>{w.where}</p>
                  <ul>{w.needs.map((n) => <li key={n}>{n}</li>)}</ul>
                </div>
              ))}
            </Seen>
            <figcaption>Who each product is for, in AMN&rsquo;s own public descriptions.</figcaption>
          </figure>

          <section className="st-sec">
            <h2>Passport: start with one field</h2>
            <div className="st-col">
              <p>Many nurses already have a record with AMN from an earlier assignment. So signing up starts with the one thing that can find it, an email, and asks for the rest only after the address is proved.</p>
            </div>
          </section>
          <Flow steps={SIGN_UP} name="Signing up, five screens" caption="Signing up, read left to right. Screens redrawn from the team’s designs; the photograph is a stock stand-in." />

          <section className="st-sec st-sec--near">
            <h2>Passport: say what went wrong, then what is left</h2>
            <div className="st-col">
              <p>A failed sign-in names the cause and how many tries remain. <b>Home then opens on what is left to do,</b> because a recruiter is assigned only once the profile is complete.</p>
            </div>
          </section>
          <Flow steps={SIGN_IN} name="Signing in, four screens" caption="Signing in, read left to right." />

          <section className="st-sec st-sec--near">
            <h2>Passport: show what is missing first</h2>
            <div className="st-col">
              <p>Licenses, certifications and vaccination records all carry a date. <b>The app shows what is missing before what is done,</b> and lets a nurse fix it from the phone.</p>
            </div>
          </section>
          <Flow steps={CREDS} name="Credentials, seven screens" caption="Credentials, in order." />

          <section className="st-sec">
            <h2>ShiftWise: open empty, then answer the search</h2>
            <div className="st-col">
              <p>The flow here is a staffing vendor looking for one of their own staff. <b>The list opens empty and says what to do first: choose a search.</b> That costs one step before any name shows.</p>
            </div>
          </section>
          <figure className="st-fig">
            <Seen at={0.2} className="st-desk a2-in a2-wide a3-before"><div className="a3-z a3-z--before" style={I(0)}><Wise view="empty" label="The staff list before a search: the search bar and filters, an empty table, and the line: select the appropriate search to narrow your list results and click Search." /></div></Seen>
            <figcaption>Before a search: the list says what to do first.</figcaption>
          </figure>
          <section className="st-sec st-sec--text">
            <span aria-hidden="true" />
            <div className="st-col">
              <p><b>Results come back as a dense grid</b> with eleven columns: who, from which vendor, in which discipline and specialty, on which shift, and whether their unit and order checks are done.</p>
            </div>
          </section>
          <figure className="a3-bandfig">
            <Seen at={0.15} className="a2-in a3-band a3-band--w">
              <div className="a3-scroll"><div className="a3-z a3-z--grid" style={I(0)}><Wise view="grid" label="Search results in the ShiftWise staff list: tabs, a search field, five filters, and a grid of ten staff with eleven columns and page controls." /></div></div>
            </Seen>
            <figcaption>Search results as a grid, on a desktop.</figcaption>
          </figure>

          <section className="st-sec st-sec--near">
            <h2>ShiftWise: when a grid cannot fit, each row becomes a card</h2>
            <div className="st-col">
              <p>A grid with eleven columns cannot shrink onto a tablet. <b>So each row becomes a card,</b> with the same fields in the same order and the same actions on its top edge: three to a row on a desktop, two on a tablet, one on a phone. The cost is density: six people to a screen where the grid shows ten.</p>
            </div>
          </section>
          <figure className="a3-bandfig">
            <Seen at={0.15} className="a2-in a3-band a3-band--w">
              <div className="a3-sizes">
                <div style={I(0)}><div className="a3-z a3-z--cards"><Wise view="cards" n={6} label="The staff list as cards on a desktop, three to a row." /></div><small>Desktop</small></div>
                <div style={I(1)}><div className="a3-z a3-z--cards"><Wise view="cards" size="t" n={4} label="The staff list as cards on a tablet, two to a row." /></div><small>Tablet</small></div>
                <div style={I(2)}><div className="a3-z a3-z--cards"><Wise view="cards" size="m" n={3} label="The staff list as cards on a phone, one to a row." /></div><small>Phone</small></div>
              </div>
            </Seen>
            <figcaption>The same results as cards, at three sizes.</figcaption>
          </figure>

          <section className="st-sec">
            <h2>One system: draw every part once</h2>
            <div className="st-col">
              <p>AMN&rsquo;s web and mobile products draw on one shared framework. Passport has its own layer of it: colors, type, buttons, form parts, cards and icons, each drawn once with all its states.</p>
              <p><b>Color is assigned, not chosen each time.</b> Each of the eleven kinds of credential has its own. Cards are drawn once for a recruiter, a job and an assignment.</p>
            </div>
          </section>
          <figure className="a2-boardfig">
            <Seen at={0.08} className="a2-in a2-board">
              <div className="a2-board-in a5-board">
                <p className="a5-group">Foundations</p>
                <Cell name="Color" span={7} i={0}>
                  <ul className="a2-sw">{PALETTE.map(([n, h]) => <li key={n}><i style={{ background: h }} className={h === "#F5F5F5" ? "is-pale" : undefined} /><b>{n}</b><small>{h}</small></li>)}</ul>
                </Cell>
                <Cell name="Type" span={5} i={1} className="pp a2-type">
                  <span className="a2-aa">Aa</span>
                  <span className="a2-face">Open Sans</span>
                  <span className="a2-lines"><b>Sign in to your account.</b><span>Tell us a little more about yourself to create your account.</span><strong>Complete My Profile</strong><small>LEGAL FIRST NAME</small></span>
                </Cell>
                <Cell name="Colors with an assigned meaning" span={7} i={2} className="pp a5-mean">
                  <small className="a5-sub">Alerts</small>
                  <ul className="a2-kinds">{ALERTS.map(([t, c]) => <li key={t}><u style={{ background: c }} />{t}</li>)}</ul>
                  <small className="a5-sub">Credentialing categories</small>
                  <ul className="a2-kinds">{KINDS.map(([t, c]) => <li key={t}><u style={{ background: c }} />{t}</li>)}</ul>
                </Cell>
                <Cell name="Type styles" span={5} i={3} className="pp a3-type">
                  <span className="a3-faces"><span>Open Sans Regular</span><b>Open Sans Semibold</b><em>Open Sans Italic</em></span>
                  <ul>{TYPE.map(([n, px, sample, st]) => <li key={n}><small>{n}<i>{px}</i></small><span style={st}>{sample}</span></li>)}</ul>
                </Cell>
                <Cell name="Icons" span={7} i={4} className="pp a5-icons">
                  <ul className="a3-notes">{NOTES.map(([t, d, c]) => <li key={t} style={{ color: c }}><Ic d={d} /><small>{t}</small></li>)}</ul>
                  <span className="a3-gen">{GENERAL.map((d) => <Ic key={d} d={d} />)}</span>
                </Cell>
                <Cell name="Logos" span={5} i={5} className="pp a5-lock">
                  <span><img src="/sketches/logos/amn.png" alt="AMN Healthcare" width="200" height="68" /></span>
                  <span><Logo /></span>
                  <span className="is-purple"><Logo white /></span>
                </Cell>

                <p className="a5-group">Components</p>
                <Cell name="Buttons" span={4} i={6} className="pp">
                  <span className="pp-btn">Button</span>
                  <span className="pp-btn is-off">Disabled</span>
                  <span className="pp-pair"><span className="pp-btn pp-btn--line">Secondary</span><span className="pp-btn">Button</span></span>
                  <span className="a3-smalls"><span className="pp-btn">Button</span><span className="pp-btn is-off">Disabled</span><span className="pp-btn pp-btn--line">Button</span></span>
                  <span className="a3-floats"><span className="pp-float"><Ic d="plus" /></span><span className="a3-arrow is-off"><Ic d="back" /></span><span className="a3-arrow"><Ic d="right" /></span><span className="a3-text"><Ic d="plus" />Add Document</span></span>
                  <span className="pp-time"><span><b>1</b> Days<i>Total</i><b>11h 34m</b></span><span className="pp-btn">Submit Timesheet</span></span>
                </Cell>
                <Cell name="Form parts" span={4} i={7} className="pp">
                  <Field label="Preferred Name" />
                  <Field label="Preferred Name" value="Jannie" state="is-live" />
                  <Field label="Preferred Name" state="is-bad" note="Required" />
                  <Field label="Zip Code" value="9210111" state="is-bad" note="Invalid Format" />
                  <span className="a3-find"><Ic d="search" />Search Credentials</span>
                  <Field label="Sort" value={<>Category<Ic d="down" /></>} />
                  <span className="a3-picks"><Tick label="Influenza" /><Tick on label="Hep B" /></span>
                </Cell>
                <Cell name="An error that says what is left" span={4} i={8} className="pp a5-err">
                  <span className="pp-card pp-card--purple a2-fail">
                    <span className="pp-fail"><Ic d="alert" /><span><b>Sign In Failed</b><small><strong>Incorrect Email/Password Combination.</strong> Two (2) attempts remaining before account is locked</small></span></span>
                    <Field label="Email" value="abc@gmail.com" state="is-white is-bad" />
                    <Field label="Password" value={<>••••••••••••<Ic d="eye" /></>} state="is-white is-bad" />
                    <span className="pp-btn">Sign In</span>
                  </span>
                </Cell>
                <Cell name="Tags and status" span={12} i={9} className="pp a5-tags">
                  <div><small className="a5-sub">Job</small><span className="a5-chips"><u style={{ background: "#34b233" }}><Ic d="bookmark" />Exclusive</u><u style={{ background: "#c8553d" }}>Rapid Response/Crisis</u><u style={{ background: "#008b95" }}>Mat. Child Health</u><u className="is-line">Travel</u></span></div>
                  <div><small className="a5-sub">Task</small><span className="a5-chips"><u className="is-pill">EXPIRED</u><u className="is-pill">PAST DUE</u><u className="is-count">8</u></span></div>
                  <div><small className="a5-sub">Assignment</small><span className="a5-chips"><u className="is-flag" style={{ background: "#6639b7" }}><small>BOOKED</small>STARTS SEP 1</u><u className="is-flag" style={{ background: "#008b95" }}><small>ON ASSIGNMENT</small>ENDS AUG 24</u></span></div>
                </Cell>
                <Cell name="Cards" span={12} i={10} className="pp a3-cards a5-cards">
                  <div>
                    <small className="a5-sub">Contact</small>
                    <Contact photo="rita.webp" name="Rita R." role="Recruiter" />
                    <Contact photo="anne.webp" name="Anne L." role="Recruiter" preferred />
                  </div>
                  <div>
                    <small className="a5-sub">Job</small>
                    <Job tag="Mat. Child Health" tone="#008b95" pic="job-1.webp" />
                    <Job tag="Crisis" tone="#c8553d" wide pic="job-2.webp" />
                    <span className="a3-row"><span className="a3-avs"><i><img src={PIC("rita.webp")} alt="" width="240" height="240" /></i><i><img src={PIC("anne.webp")} alt="" width="240" height="240" /></i><i className="is-n">+2</i></span><span className="pp-btn">I&rsquo;m Interested</span></span>
                  </div>
                  <div>
                    <small className="a5-sub">Assignment</small>
                    <span className="a3-booked">
                      <span className="a3-booked-pic"><u><small>BOOKED</small>STARTS SEP 1</u></span>
                      <b>Community Hospital</b><small>Orange, California</small>
                      <i><Ic d="cert" /><span>Credentials 35% Complete<s /></span></i>
                      <i><Ic d="doc" /><span>View Contract</span></i>
                    </span>
                    <span className="a5-arow"><i /><b>City Hospital</b><u className="is-count">8</u><Ic d="right" /></span>
                  </div>
                  <div>
                    <small className="a5-sub">Profile</small>
                    <span className="a3-prof"><img className="a3-av a3-av--l" src={PIC("jane.webp")} alt="" width="240" height="240" /><b>Jane Doe</b><small>RN &middot; [Specialty 1], [Specialty 2]</small><small>Traveler ID: 00000000</small><i>View Contact Information<Ic d="right" /></i></span>
                    <span className="a3-well"><Ic d="heart" /><span><b>Support Your Well-Being</b><u>BUTTON</u></span><Ic d="x" /></span>
                  </div>
                </Cell>
              </div>
            </Seen>
            <figcaption>Passport&rsquo;s framework, redrawn from its own sheets and from screens of the app. Photographs and people are free stock pictures standing in for the designs&rsquo; own; names are placeholders.</figcaption>
          </figure>

          <section className="st-sec">
            <h2>Where it stands</h2>
            <div className="st-col">
              <p>I have no figures of my own for this work, so none are claimed. <b>What can be shown is scale:</b> the size of the program, and AMN&rsquo;s own public figures for Passport.</p>
            </div>
          </section>
          <figure className="st-fig">
            <Seen at={0.3} className="a2-in a2-out">
              <dl>
                <div style={I(0)}><dd>3</dd><dt>products rebuilt on one shared framework</dt><small>The program team</small></div>
                <div style={I(1)}><dd>100,000+</dd><dt>clinicians on Passport by late 2021</dt><small>AMN Healthcare results, 2021</small></div>
                <div style={I(2)}><dd>200,000+</dd><dt>registered on Passport by 2023</dt><small>AMN Healthcare announcement, 2023</small></div>
              </dl>
              <p className="a4-src">The Passport figures are AMN Healthcare&rsquo;s own, for the product. They show scale, not a result of mine.</p>
            </Seen>
          </figure>

          <nav className="st-next" aria-label="More">
            <a className="st-btn" href="/hss-case-study">Next: Hair System Salons</a>
            <a className="st-btn st-btn--soft" href="/work">All work<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></a>
          </nav>
        </main>
      </div>
    </div>
  );
}
