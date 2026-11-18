import { Geist_Mono, Inter_Tight } from "next/font/google";
import { NOINDEX, pageMetadata } from "../../seo";
import { Structure } from "../_shared/stripes-v3/diagrams";
import { ANSWER, Ic, Jira, Panel, REQUEST, type Screen } from "../_shared/stripes-v3/jira";
import "../_shared/figma.css";
import "../_shared/live.css";
import "../_shared/story.css";
import "../_shared/stripes2.css";
import "../_shared/stripes4.css";

/* 3 Stripes, fourth version (2026-11-17). His words on the third: "this is going like crazy and visuals,
   gradients, and animation doesn't sound like me. Surprise me on V4 just keeping what ever is needed in a
   case study. Revisit the guidelines we set and what recruiters are looking for."

   WHAT THE GUIDELINES AND THE RESEARCH ASK FOR, and where each is on this page:
   - Open the reference's way: a rail of facts, a quiet title, two short paragraphs, then the product
     (memory: taste-case-study-presentation). Rail = Client, Year, Role, Status; no result is claimed.
   - The decision is the unit, with the option turned down shown beside the one chosen
     (research/B-hiring-signals.md, synthesis 1: Wen, Bogdan, Humble, Nielsen; research/
     case-study-format-2026-11-16/NOTES.md). Three headings, each a decision. The one turned-down option
     the Figma file itself shows is the shared answer box; it is pictured beside the prototype's.
   - No process artifacts, no "reams of text" (Scott, F1). One diagram only, because he asked for it
     ("We like the information architecture or flow diagram").
   - What he did on team work, and the status of the work, are stated (checklist 10): "one of three",
     "not released". Which parts were his own is still his to give.
   - His taste: minimal, larger and clearer text, breathing room (memory: taste-minimal-interfaces). So:
     no motion at all, no gradient, one flat light ground, real interface shown at reading size (the
     panels and the dialog are at the design's own size, not shrunk), and four pictures.
   - His last notes on v3: "Cut it short", "Don't add any impact". About 150 words; no results section.

   SECOND PASS, same day. His words: "whole Jira extension is created by me. Solo. Will add couple of
   interaction screen we have. Like features like highlight and ask etc.. Other gen AI UX of human in the
   loop and needs approval everytime. Again focus on the HCI principles like error correction like undo,
   feedback etc..."
   SO: the role is his alone (the file's cover names three designers on the whole product; the Jira
   extension is his, on his word). Each chapter is one decision under the HCI principle it serves, named
   in a small line above its paragraph: Consistency, Error prevention, User control, Human in the loop,
   Error correction, Feedback (the last three are his words). Added screens: select text and ask
   ("Enrich selected text"); one generated feature with Accept and Reject; the Undo, Reset, Cancel and
   Discard changes controls; the conversation that reports each step. Still no motion, no gradient, no
   results section. He confirmed the six principle names ("Yes, keep them"). Where Undo, Reset and Save changes lead is from the prototype's own links.

   SOURCES: the Figma file (pages "Jira Extension UI Screens" and "Jira flow
   ideation"); his record (Neudesic's product; designed and prototyped, not released; he studied
   Microsoft's HAX toolkit in 2023). Screens are ../stripes-v3/jira.tsx: the file's own Jira screenshots
   with the extension drawn over them. Every sentence is DRAFT. */
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const HOME = "/3-stripes-case-study";

export const metadata = {
  ...pageMetadata({ path: HOME, title: "3 Stripes, an AI extension for Jira", description: "An AI inside Jira that asks before it writes, and changes nothing until it is accepted." }),
  ...NOINDEX,
};
const B = ({ children }: { children: React.ReactNode }) => <b className="jx-b">{children}</b>;
const EARLY = ["What specific actions should the user be able to perform?", "Are there any alternative paths or exceptional scenarios?", "What specific actions should the user be able to perform?"];
const ASKED = ["Who is the primary user persona for the SSO authentication feature?", "Are there any compliance or security standards that need to be adhered to in the SSO implementation?", "How will the user experience (UX) be enhanced to ensure a seamless SSO authentication process for employees?"];
const ACTS = <><B><Ic d="reset" />Regenerate all</B><B><Ic d="x" className="is-red" />Skip all</B></>;
/* A part of a screen at the design's own size: x, y, w, h are in the design's pixels. */
const Crop = ({ screen, box: [x, y, w, h], label }: { screen: Screen; box: [number, number, number, number]; label: string }) => (
  <figure className="st-fig"><div className="j4-sheet j4-scroll"><div className="j4-crop" style={{ width: w, height: h }} role="img" aria-label={label}><div aria-hidden="true" style={{ left: -x, top: -y }}><Jira screen={screen} /></div></div></div></figure>
);
const Q1 = "Who is the primary user persona for the SSO authentication feature?";

export default function SketchCaseStripes4() {
  return (
    <div className={`${sans.variable} ${mono.variable}`}>
      <div className="lv st st--jx st--jx4">
        <header className="st-top">
          <a href="/work"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" /></svg>Work</a>
          <a href="/">Dinesh Revunuru</a>
        </header>
        <main>
          <section className="st-open">
            <dl className="st-rail">
              <div><dt>Client</dt><dd>3 Stripes, a Neudesic product</dd></div>
              <div><dt>Year</dt><dd>2023</dd></div>
              <div><dt>Role</dt><dd>Product Designer, solo on the Jira extension</dd></div>
              <div><dt>Status</dt><dd>Clickable prototype, not released</dd></div>
            </dl>
            <div className="st-col">
              <h1>An AI inside Jira that asks before it writes, and changes nothing until it is accepted.</h1>
              <p>Three Stripes is Neudesic&rsquo;s generative-AI product for the product-development lifecycle. This extension brings it into Jira, where teams already keep their epics.</p>
              <p>I designed the whole Jira extension myself. <b>It turns a rough epic into a clear one, then into features, and the person approves every change.</b> Each decision below serves one HCI principle.</p>
            </div>
          </section>

          <figure className="jx-wide st-hero">
            <div className="jx-stage"><div className="jx-shot"><div className="jx-z" role="img" aria-label="A Jira page with the extension open over it as a dialog. On the left is the epic: title, story points, issues and description. On the right the extension asks three questions, each with its own answer box, above Regenerate all and Skip all."><Jira screen="ask" /></div></div></div>
          </figure>

          <section className="st-sec">
            <h2>Start where the epic already lives</h2>
            <div className="st-col">
              <small className="j4-tag">Consistency</small>
              <p><b>An epic already has a page in Jira, so the extension opens from that page</b> and is built from Jira&rsquo;s own buttons, tabs and fields. It holds one way in, two dialogs, and three views in each.</p>
            </div>
          </section>
          <figure className="st-fig">
            <div className="j4-sheet j4-scroll"><Structure /></div>
          </figure>

          <section className="st-sec">
            <h2>Ask before writing</h2>
            <div className="st-col">
              <small className="j4-tag">Error prevention</small>
              <p><b>The extension asks clarifying questions before it writes, and any of them can be skipped.</b> An earlier version shared one answer box across the three questions. The prototype gives each question its own.</p>
            </div>
          </section>
          <figure className="st-fig">
            <div className="j4-sheet j4-pair">
              <div><p>Earlier: one shared box</p><div className="jx-part" role="img" aria-label="An earlier version of the panel: three questions as plain cards, and one answer box under them all."><div className="jx-panel"><div className="jx-talk"><span className="j4-lead">Answer the following questions to ensure accurate enrichment.</span>{EARLY.map((q, k) => <span key={k} className="jx-q">{q}</span>)}</div><div className="jx-send"><p>{ACTS}</p><span className="jx-field"><span>Please click a prompt to answer</span><b>Send</b></span></div></div></div></div>
              <div><p>Prototype: a box on each question</p><div className="jx-part" role="img" aria-label="The prototype's panel: three questions, each with its own answer box."><Panel qs={ASKED} acts={ACTS} /></div></div>
            </div>
          </figure>

          <section className="st-sec">
            <h2>Highlight and ask</h2>
            <div className="st-col">
              <small className="j4-tag">User control</small>
              <p><b>Selecting text in the description offers Enrich selected text.</b> The request applies to the selection, and the rest stays as written.</p>
            </div>
          </section>
          <Crop screen="select" box={[75, 36, 843, 540]} label="The Enrich description tab. The description is in an editor with its text selected, and a small button over the selection reads: Enrich selected text. Under the editor are Submit and Cancel, then the enriched description, which says: Not yet enriched." />

          <section className="st-sec">
            <h2>Nothing changes without a yes</h2>
            <div className="st-col">
              <small className="j4-tag">Human in the loop</small>
              <p><b>What the AI writes appears under the original and waits for Accept.</b> Generated features are reviewed one at a time, each with its own Accept and Reject.</p>
            </div>
          </section>
          <Crop screen="title-enriched" box={[75, 36, 843, 664]} label="The Enrich title tab. The current title is at the top, the enriched title is beneath it, and under both are Accept, Undo and Reset." />
          <Crop screen="f-one" box={[233, 36, 900, 677]} label="One generated feature, number one of five: title, story points, issues and description, with Go back to list and Next on the left, Accept and Reject on the right, and Cancel, Discard changes and Save changes at the foot." />

          <section className="st-sec">
            <h2>Every step can be taken back</h2>
            <div className="st-col">
              <small className="j4-tag">Error correction</small>
              <p><b>Undo steps back once, and Reset returns to the start.</b> Cancel and Discard changes sit beside Save changes, so the dialog can always be left without saving.</p>
            </div>
          </section>
          <Crop screen="enriched" box={[520, 596, 780, 184]} label="The foot of the dialog after the epic is enriched: Undo and Reset under the enriched description; the next actions, Enrich title and Enrich description, above a request box; and Cancel, Discard changes and Save changes." />

          <section className="st-sec">
            <h2>It says what it did, every time</h2>
            <div className="st-col">
              <small className="j4-tag">Feedback</small>
              <p><b>Each action gets its own line in the conversation: Epic enriched, Title enriched, Title accepted.</b> A field with nothing written yet says so: Not yet enriched.</p>
            </div>
          </section>
          <figure className="st-fig">
            <div className="j4-sheet j4-pair">
              <div><p>Enriching an epic</p><div className="jx-part" role="img" aria-label="The conversation while enriching: a question, the person's answer, Epic enriched, the person's request, Title enriched, Accept title, Title accepted."><Panel msgs={[["me", ANSWER], ["ai", "Epic enriched"], ["me", REQUEST], ["ai", "Title enriched"], ["me", "Accept title"], ["ai", "Title accepted"]]} acts={<><B>Enrich title</B><B>Enrich description</B></>} input="Type details you want to enrich" /></div></div>
              <div><p>Generating features</p><div className="jx-part" role="img" aria-label="The conversation while generating features: a question, the person's answer, Features generated."><Panel msgs={[["ai", Q1], ["me", ANSWER], ["ai", "Features generated"]]} acts={<><B>generate all</B><B><Ic d="x" className="is-red" />Skip rest and generate</B></>} /></div></div>
            </div>
          </figure>

          <nav className="st-next" aria-label="More">
            <a className="st-btn" href="/adani-case-study">Next: Adani Cement</a>
            <a className="st-btn st-btn--soft" href="/work">All work<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></a>
          </nav>
        </main>
      </div>
    </div>
  );
}
