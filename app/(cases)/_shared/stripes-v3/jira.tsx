import type { CSSProperties, ReactNode } from "react";

/* The Jira extension's screens, third version (./page.tsx). His words: "keeping the real Jira UI, logos".
   In the Figma file (page "Jira Extension UI Screens") Jira itself is a pasted
   screenshot of the team's own Jira, and the extension is drawn over it. This file does the same: the two
   screenshots are the file's own (public/sketches/work/stripes/jira-issue.webp, jira-backlog.webp), and the
   extension is drawn over them in code at the positions measured in the file (`at(x, y, w, h)` is in the
   design's pixels; a screen is 1366 x 816 and is shown smaller with `zoom`). Under a dialog the screenshot
   sits at 0,0 with the file's shade over it (#2a3d66 at 49%).
   Changed from the file: a colleague's name on the screenshots (Assignee, Reporter, avatars) is painted
   out and reads "Jane Doe" / "JD"; the untouched files are in research/stripes-case-2026-11-17/renders/
   jira-raw (private). The design's stock illustration (licence unknown) is still plain shapes. "No features
   has been created yet" is set right. Kept: the project's name, "ThreeStripes Internal", and his own
   initials. The Three Stripes mark is the file's own (three-stripes.png). */
export const I = (i: number) => ({ "--i": i }) as CSSProperties;
const at = (x: number, y: number, w?: number, h?: number) => ({ left: x, top: y, width: w, height: h }) as CSSProperties;
const P = {
  undo: "M6 4L3 7l3 3M3.500 7H10a3 3 0 0 1 0 6H8", reset: "M3.500 8a4.500 4.500 0 1 0 1.400-3.300M3.500 3v2.500H6", check: "M3.500 8.500l3 3 6-7", x: "M4 4l8 8M12 4l-8 8",
  send: "M2.500 3l11 5-11 5 2.500-5zM5 8h8", right: "M3 8h10M9 4l4 4-4 4", left: "M13 8H3M7 4L3 8l4 4", down: "M4 6l4 4 4-4", dots: "M3.500 8h.1M8 8h.1M12.500 8h.1",
  bolt: "M9 1.500L3.500 9H8l-1 5.500L12.500 7H8z", mark: "M4.500 2.500h7v11L8 11l-3.500 2.500z", up: "M4 10l4-4 4 4", clip: "M10.500 4.500L6 9a1.500 1.500 0 0 0 2 2l4.500-4.500a3 3 0 0 0-4.200-4.200L3.800 6.800", link: "M6.500 9.500l3-3M5 7L3.500 8.500a2.500 2.500 0 0 0 3.500 3.500L8.500 10.500M11 9l1.500-1.500A2.500 2.500 0 0 0 9 4L7.500 5.500",
};
export const Ic = ({ d, className = "" }: { d: keyof typeof P; className?: string }) => <svg className={`jx-ic ${className}`} viewBox="0 0 16 16" aria-hidden="true"><path d={P[d]} /></svg>;
const REAL = "/sketches/work/stripes/";
/* eslint-disable-next-line @next/next/no-img-element */
const Brand = () => <span className="jx-brand"><img src={`${REAL}three-stripes.png`} alt="" width={18} height={17} />Three Stripes</span>;
const B = ({ children, tap, on, primary, style }: { children: ReactNode; tap?: string; on?: boolean; primary?: boolean; style?: CSSProperties }) => <b className={`jx-b${on ? " is-on" : ""}${primary ? " is-primary" : ""}`} data-tap={tap} style={style}>{children}</b>;

/* ---------- the text of the designs ---------- */
export const ANSWER = "password should be at least 8 characters long and include a combination of uppercase and lowercase letters, numbers, and special symbols.";
export const REQUEST = "Please change Software Validation to include only python as backend";
const Q0 = ["What specific applications or systems should be integrated with the SSO authentication process?", "How will the system handle multi-factor authentication (MFA) in conjunction with SSO for added security?", "What are the expected benefits or improvements for employees with the implementation of SSO authentication?"];
const Q1 = "Who is the primary user persona for the SSO authentication feature?";
const Q2 = ["Are there any compliance or security standards that need to be adhered to in the SSO implementation?", "How will the user experience (UX) be enhanced to ensure a seamless SSO authentication process for employees?"];
const T0 = "Employee authentication with SSO", T1 = "User Authentication & Registration: Handling Incomplete Form Submissions' to use Python-only backend validation.";
const D0 = "This EPIC encompasses all the tasks and user stories related to implementing a robust and secure user authentication and registration system for our e-commerce platform. The primary goal of this ERIC is to provide a seamless and user-friendly experience for customers, ensuring that their personal data is protected and their accounts are easily accessible.";
const KEYS = ["1. User Login: Develop a secure login mechanism using OAuth 2.0 to allow registered users to access their accounts with ease and confidence,", "2. User Registration: Create a user-friendly registration process that captures essential information while safeguarding sensitive data, making it convenient for new users to sign up and become customers.", "3. Password Reset and Recovery: Implement a reliable password reset and recovery mechanism that enables users to regain access to their accounts if they forget their passwords or encounter login issues."];
const FEATS = ["Authentication method:", "Registration process", "Two-Factor Authentication (2FA)", "Multi-Channel Authentication", "Email Verification"];
const F1 = "This feature refers to the primary method used to verify and confirm the identity of users accessing a system or platform. It serves as the gateway to grant or deny access based on the provided credentials or authentication factors. Common authentication methods include username and password, biometric recognition, multi-factor authentication, and social media integration, each offering varying levels of security and user convenience.";
const F2 = "Some systems necessitate unique or specialized authentication methods tailored to their specific requirements. These methods can encompass challenge-response protocols, one-time password (OTP) systems, smart card authentication, or any innovative approach devised to address the distinct authentication needs of.";

/* ---------- the panel on the right: questions, then a conversation ---------- */
type Msg = [who: "ai" | "me", text: string];
const Question = ({ q, typed, tap }: { q: string; typed?: ReactNode; tap?: boolean }) => <span className="jx-q">{q}<i className={typed ? "is-typed" : undefined}><span>{typed || "Submit answer"}</span><u data-tap={tap ? "send-q" : undefined}><Ic d="send" /></u></i></span>;
export function Panel({ qs, typed, msgs = [], acts, input = "Please click a prompt to answer", typing }: { qs?: string[]; typed?: ReactNode; msgs?: Msg[]; acts: ReactNode; input?: string; typing?: ReactNode }) {
  return (
    <div className="jx-panel">
      <div className={qs && !msgs.length ? "jx-talk is-top" : "jx-talk"}>
        {msgs.map(([who, t], k) => <span key={k} className={who === "me" ? "jx-m is-me" : "jx-m"}>{t}</span>)}
        {qs?.map((q, k) => <Question key={q} q={q} typed={k === 0 ? typed : undefined} tap={k === 0} />)}
      </div>
      <div className="jx-send"><p>{acts}</p><span className={typing ? "jx-field is-on" : "jx-field"}><span>{typing || input}</span><b data-tap="send">Send</b></span></div>
    </div>
  );
}
const ACT_ASK = <><B><Ic d="reset" />Regenerate all</B><B><Ic d="x" className="is-red" />Skip all</B></>;
const ACT_REST = <><B>generate all</B><B tap="skip-rest"><Ic d="x" className="is-red" />Skip rest and generate</B></>;
const actEnrich = (on: 0 | 1 | 2) => <><B on={on === 1}>Enrich title</B><B on={on === 2}>Enrich description</B></>;

/* ---------- the dialog ---------- */
const Under = () => <div className="jx-under jx-under--real" aria-hidden="true" />;
function Dialog({ name, tab, children, panel, leftActs, actsY = 652 }: { name: ReactNode; tab?: 0 | 1 | 2; children: ReactNode; panel: ReactNode; leftActs?: ReactNode; actsY?: number }) {
  return (
    <div className="jx"><Under /><div className="jx-shade" />
      <div className="jx-dialog" style={at(75, 36, 1225, 744)} />
      <span className="jx-head" style={at(99, 64, 1177)}><i><Ic d="bolt" /></i>{name}<Brand /><Ic d="dots" /><Ic d="x" /></span>
      {tab !== undefined && <p className="jx-tabs" style={at(99, 118)}>{["Details", "Enrich title", "Enrich description"].map((t, k) => <B key={t} on={k === tab} tap={k === 1 ? "tab-title" : undefined}>{t}</B>)}</p>}
      {children}
      {leftActs && <p className="jx-acts" style={{ right: 1366 - 902, top: actsY }}>{leftActs}</p>}
      <div style={at(926, 118)} className="jx-abs">{panel}</div>
      <p className="jx-acts" style={{ right: 1366 - 1276, top: 724 }}><B>Cancel</B><B>Discard changes</B><B primary>Save changes</B></p>
    </div>
  );
}
const Rows = ({ x, y, title }: { x: number; y: number; title: string }) => <>{([["Title", title], ["Story points", "5"], ["Issues", "5"]] as const).map(([l, v], k) => <span key={l} className="jx-row" style={at(x, y + k * 44)}><b>{l}</b>{v}</span>)}</>;
const Pair = ({ a, b, la, lb, none }: { a: string; b?: string; la: string; lb: string; none: string }) => <><b className="jx-l" style={at(107, 174)}>{la}</b><span className="jx-t" style={at(107, 209, 787)}>{a}</span><b className="jx-l" style={at(107, 321)}>{lb}</b><span className={b ? "jx-t" : "jx-t is-none"} style={at(107, 356, 787)}>{b || none}</span></>;

/* ---------- the screens of the prototype, by name ---------- */
export type Screen = "issue" | "issue-b" | "issue-panel" | "issue-open" | "f-enrich" | "ask" | "answered" | "enriched" | "title" | "title-enriched" | "title-accepted" | "select" | "f-empty" | "f-list" | "f-one";
export function Jira({ screen, typed }: { screen: Screen; typed?: ReactNode }) {
  const said: Msg[] = [["ai", Q1], ["me", ANSWER], ["ai", "Epic enriched"]];
  switch (screen) {
    case "issue": case "issue-b": return <Issue entry="menu" />;
    case "issue-panel": return <Issue entry="panel" />;
    case "issue-open": return <Issue entry="open" />;
    case "f-enrich": return <Dialog name="TSI-2 &nbsp;Enrich" tab={0} leftActs={<><B><Ic d="check" />Accept</B><B><Ic d="undo" />Undo</B><B><Ic d="reset" />Reset</B></>} panel={<Panel qs={Q0} acts={ACT_ASK} />}><Rows x={107} y={181} title="Authentication method" /><b className="jx-l" style={at(107, 318)}>Description</b><span className="jx-t" style={at(107, 353, 787)}>{F1}<br /><br />{F2}</span><p className="jx-acts" style={at(99, 652)}><B><Ic d="undo" />Go back to list</B><B>Next<Ic d="right" /></B></p></Dialog>;
    case "ask": return <Dialog name="EPIC 3749 - Enrich" tab={0} panel={<Panel qs={[Q1, ...Q2]} typed={typed} acts={ACT_ASK} />}><Rows x={107} y={181} title={T0} /><b className="jx-l" style={at(107, 318)}>Description</b><span className="jx-t" style={at(107, 353, 787)}>{D0}</span></Dialog>;
    case "answered": return <Dialog name="EPIC 3749 - Enrich" tab={0} panel={<Panel qs={Q2} msgs={[["me", ANSWER]]} acts={ACT_REST} />}><Rows x={107} y={181} title={T0} /><b className="jx-l" style={at(107, 318)}>Description</b><span className="jx-t" style={at(107, 353, 787)}>{D0}</span></Dialog>;
    case "enriched": return <Dialog name="EPIC 3749 - Enrich" tab={0} actsY={671} leftActs={<><B><Ic d="undo" />Undo</B><B><Ic d="reset" />Reset</B></>} panel={<Panel msgs={said} acts={actEnrich(0)} />}><Rows x={107} y={181} title={T0} /><b className="jx-l" style={at(107, 318)}>Description</b><span className="jx-t" style={at(107, 353, 787)}>{D0}<br /><br />Key Objectives:{KEYS.map((k) => <span key={k}>{k}</span>)}</span></Dialog>;
    case "title": return <Dialog name="EPIC 3749 - Enrich" tab={1} panel={<Panel msgs={said} acts={actEnrich(1)} input="Type details you want to enrich" typing={typed} />}><Pair la="Current title" lb="Enriched title" a={T0} none="Not yet enriched" /></Dialog>;
    case "title-enriched": return <Dialog name="EPIC 3749 - Enrich" tab={1} leftActs={<><B tap="accept"><Ic d="check" />Accept</B><B><Ic d="undo" />Undo</B><B><Ic d="reset" />Reset</B></>} panel={<Panel msgs={[...said, ["me", REQUEST], ["ai", "Title enriched"]]} acts={actEnrich(0)} input="Type details you want to enrich" />}><Pair la="Current title" lb="Enriched title" a={T0} b={T1} none="" /></Dialog>;
    case "title-accepted": return <Dialog name="EPIC 3749 - Enrich" tab={1} panel={<Panel msgs={[...said, ["me", REQUEST], ["ai", "Title enriched"], ["me", "Accept title"], ["ai", "Title accepted"]]} acts={actEnrich(0)} input="Type details you want to enrich" />}><Pair la="Current title" lb="Enriched title" a={T1} none="Not yet enriched" /></Dialog>;
    case "select": return (
      <Dialog name="EPIC 3749 - Enrich" tab={2} panel={<Panel msgs={[["me", ANSWER], ["ai", "Epic enriched"], ["me", REQUEST], ["ai", "Title enriched"], ["me", "Accept title"], ["ai", "Title accepted"]]} acts={actEnrich(2)} input="Type details you want to enrich" />}>
        <b className="jx-l" style={at(107, 174)}>Current description</b>
        <span className="jx-tools" style={at(107, 210, 795)}>Normal text<Ic d="down" /><s />{["B", "I", "…"].map((t) => <u key={t}>{t}</u>)}<s /><u>A</u><s /><u>≡</u><u>⋮≡</u><s /><Ic d="link" /><u>@</u><u>☺</u><u>‹›</u><u>＋</u></span>
        <span className="jx-edit" style={at(99, 254, 803, 134)}><mark>{D0}</mark></span>
        <span className="jx-tip" style={at(405, 304)}><Ic d="reset" />Enrich selected text</span>
        <p className="jx-acts" style={at(99, 404)}><B primary>Submit</B><b className="jx-bare">Cancel</b></p>
        <b className="jx-l" style={at(107, 468)}>Enriched description</b><span className="jx-t is-none" style={at(107, 503, 787)}>Not yet enriched</span>
      </Dialog>
    );
    case "f-empty": return (
      <Dialog name="EPIC 3749 - Features generation" panel={<Panel qs={Q2} msgs={[["me", ANSWER]]} acts={ACT_REST} />}>
        <span className="jx-art" style={at(396, 150, 210, 150)}><i /><i /><i /></span>
        <b className="jx-none" style={at(99, 336, 803)}>No features have been created yet</b>
        <span className="jx-none2" style={at(300, 378, 400)}>For precise feature generation, respond to the questions on the right.</span>
      </Dialog>
    );
    case "f-list": return (
      <Dialog name="EPIC 3749 - Features generation" panel={<Panel msgs={[["ai", Q1], ["me", ANSWER], ["ai", "Features generated"]]} acts={<><B>generate all</B><B><Ic d="x" className="is-red" />Skip rest and generate</B></>} />}>
        <div className="jx-table" style={at(99, 118, 803)}><p><span>Feature</span><span>Summary</span><span>Action</span></p>{FEATS.map((f, k) => <p key={f} data-tap={k === 0 ? "row" : undefined}><span><i><Ic d="mark" /></i>TSI-{k + 2}</span><span>{f}</span><span><Ic d="dots" /></span></p>)}</div>
      </Dialog>
    );
    case "f-one": return (
      <div className="jx"><Under /><div className="jx-shade" />
        <div className="jx-dialog" style={at(233, 36, 900, 677)} />
        <span className="jx-head" style={at(257, 64, 852)}><i><Ic d="bolt" /></i>TSI-2 &nbsp;Enrich<Brand /><Ic d="dots" /><Ic d="x" /></span>
        <span className="jx-t" style={at(265, 128)}>Viewing features generated (1/5)</span><b className="jx-go" style={at(1014, 122)}>Enrich<Ic d="right" /></b>
        <Rows x={265} y={189} title="Authentication method" />
        <b className="jx-l" style={at(265, 326)}>Description</b><span className="jx-t" style={at(265, 361, 836)}>{F1}<br /><br />{F2}</span>
        <p className="jx-acts" style={at(257, 585)}><B><Ic d="undo" />Go back to list</B><B>Next<Ic d="right" /></B></p>
        <p className="jx-acts" style={{ right: 1366 - 1109, top: 585 }}><B tap="accept"><Ic d="check" />Accept</B><B><Ic d="x" />Reject</B></p>
        <p className="jx-acts" style={{ right: 1366 - 1109, top: 657 }}><B>Cancel</B><B>Discard changes</B><B primary>Save changes</B></p>
      </div>
    );
  }
}

/* The issue in Jira: the file's screenshot, with the extension's way in drawn over it. The file holds two
   placements: a menu beside the issue's own actions (where the prototype starts), and a panel under the
   issue's details ("Three stripes extension", closed and open). For the panel, the lines under the details
   move down by the panel's height, as they do in the file. */
function Issue({ entry }: { entry: "menu" | "panel" | "open" }) {
  const drop = entry === "open" ? 156 : 60;
  return (
    <div className="jx jx--real">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="jx-bg" src={`${REAL}jira-issue.webp`} alt="" width={1366} height={816} />
      {entry === "menu" ? (
        <>
          <b className="jx-b is-on jx-b--s" style={at(1190, 134, 107, 24)}>Three stripes<Ic d="down" /></b>
          <span className="jx-menu" style={at(1190, 164, 118, 70)}><i data-tap="enrich-epic">Enrich Epic</i><i data-tap="gen-features">Generate features</i></span>
        </>
      ) : (
        <>
          <i className="jx-patch" style={at(958, 506, 402, 96)} />
          <i className="jx-moved" style={{ ...at(960, 512 + drop, 400, 84), backgroundPosition: "-960px -512px" }} />
          <span className="jx-ext" style={at(965, 510, 377)}><b>Three stripes extension<Ic d={entry === "open" ? "up" : "down"} /></b>{entry === "open" && <><i>Enrich epic</i><i>Generate features</i></>}</span>
        </>
      )}
    </div>
  );
}
