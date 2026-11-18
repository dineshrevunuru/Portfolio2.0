import { Jira, type Screen } from "./jira";

/* The diagrams of the third version. Each is drawn from the Figma prototype, not from memory:
   - Structure: what the extension holds, read off the prototype's screens (tabs, steps, shared parts).
   - Flow: the prototype's own links (77 between 58 screens; clicks, and timed steps where the AI answers),
     laid out in order, with the real screens as the stops. */

/* ---------- where it sits, and what it holds ---------- */
const VIEWS: [y: number, name: string, what: string][] = [
  [28, "Details", "the epic as it stands"],
  [80, "Enrich title", "current title, enriched title"],
  [132, "Enrich description", "all of it, or a selected part"],
  [248, "Questions", "before any feature exists"],
  [300, "Features list", "five, with issue keys"],
  [352, "One feature", "1 of 5: Accept, Reject, Next"],
];
export function Structure() {
  return (
    <svg className="jx-ia" viewBox="0 0 1000 456" role="img" aria-label="A map of the extension. Jira's issue types run Epic, then Story, Task and Bug, then Sub-task. On the epic's issue sits the Three stripes control, with two entries. Enrich Epic opens a dialog with three tabs: Details, Enrich title, Enrich description. Generate features opens a dialog with three steps: questions, a features list, and one feature. Enrich on one feature opens the same Enrich dialog. Every dialog has the conversation on the right and Save changes at the foot.">
      <defs><linearGradient id="jx-brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f07848" /><stop offset="0.45" stopColor="#d848a8" /><stop offset="0.75" stopColor="#a848d8" /><stop offset="1" stopColor="#6078d8" /></linearGradient></defs>
      <text className="s" x="0" y="160">Jira&rsquo;s issue types</text>
      <path d="M75 234v28M75 302v20" />
      <rect className="is-main" x="0" y="176" width="150" height="58" rx="10" /><text className="w" x="16" y="200">Epic</text><text className="ws" x="16" y="220">its issue page</text>
      <rect className="is-jira" x="0.750" y="262" width="150" height="40" rx="10" /><text className="s" x="16" y="287">Story, Task, Bug</text>
      <rect className="is-jira" x="0.750" y="322" width="150" height="40" rx="10" /><text className="s" x="16" y="347">Sub-task</text>

      <path d="M151 205h49M350 205h25M375 101v220M375 101h25M375 321h25" />
      <rect className="is-brand" x="200" y="176" width="150" height="58" rx="10" /><text className="w" x="216" y="200">Three stripes</text><text className="ws" x="216" y="220">the way in</text>
      <rect className="is-dialog" x="400" y="72" width="180" height="58" rx="10" /><text className="w" x="416" y="96">Enrich Epic</text><text className="ws" x="416" y="116">a dialog, three tabs</text>
      <rect className="is-dialog" x="400" y="292" width="180" height="58" rx="10" /><text className="w" x="416" y="316">Generate features</text><text className="ws" x="416" y="336">a dialog, three steps</text>

      <path d="M580 101h60M610 49v104M610 49h30M610 153h30M580 321h60M610 269v104M610 269h30M610 373h30" />
      {VIEWS.map(([y, name, what]) => <g key={name}><rect x="640" y={y} width="359" height="42" rx="10" /><rect className="is-tick" x="650" y={y + 11} width="4" height="20" rx="2" /><text x="666" y={y + 26}>{name}</text><text className="s" x="806" y={y + 26}>{what}</text></g>)}

      <path className="d" d="M640 386H596V176C596 150 548 162 548 138" /><path className="d a" d="M542.500 146l5.500-9 5.500 9" />
      <text className="k" x="416" y="204">Enrich, on one feature:</text><text className="k" x="416" y="222">the same dialog</text>

      <rect className="is-band" x="400" y="414" width="599" height="42" rx="10" /><text className="s" x="416" y="440">Every dialog: the conversation on the right, Save changes at the foot</text>
    </svg>
  );
}

/* ---------- the two flows, with the real screens as stops ---------- */
type Stop = { s: Screen; name: string; via?: string };
const ENRICH: Stop[] = [
  { s: "issue", name: "The issue in Jira" },
  { s: "ask", via: "Enrich Epic", name: "Three questions" },
  { s: "enriched", via: "Answer, or Skip rest and generate", name: "Epic enriched" },
  { s: "title-enriched", via: "Enrich title, then Send", name: "Enriched title under the current one" },
  { s: "title-accepted", via: "Accept", name: "Title accepted" },
  { s: "select", via: "Enrich description", name: "One part of the description" },
];
const FEATURES: Stop[] = [
  { s: "issue", name: "The issue in Jira" },
  { s: "f-empty", via: "Generate features", name: "Questions, no features yet" },
  { s: "f-list", via: "Answer, or Skip rest and generate", name: "Five features" },
  { s: "f-one", via: "Open one", name: "One feature, 1 of 5" },
  { s: "f-enrich", via: "Enrich", name: "That feature in the Enrich dialog" },
];
const Lane = ({ title, stops }: { title: string; stops: Stop[] }) => (
  <div className="jx-lane">
    <h3>{title}</h3>
    <ol>
      {stops.map((n, k) => (
        <li key={n.s + k} className="jx-node">
          <span className={n.via ? "jx-via" : "jx-via is-start"}>{n.via || "Start"}</span>
          <div className="jx-thumb" role="img" aria-label={n.name}><div aria-hidden="true"><Jira screen={n.s} /></div></div>
          <b>{n.name}</b>
        </li>
      ))}
    </ol>
  </div>
);
export const Flow = () => (
  <div className="jx-map"><div className="jx-map-in"><Lane title="Enrich an epic" stops={ENRICH} /><Lane title="Generate features" stops={FEATURES} /><p className="jx-key"><i className="is-you" />What the person presses<i className="is-ai" />What the extension shows</p></div></div>
);
