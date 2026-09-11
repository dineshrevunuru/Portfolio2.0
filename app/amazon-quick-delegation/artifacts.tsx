import type { ReactElement } from "react";
import styles from "./quick-case-study.module.css";

/* Research and decision artifacts for the Amazon Quick case. Every number and
   quote here is lifted from the workpack's research lanes (R05–R10), the
   locked problem definition, the decision log and the QA logs — nothing is
   estimated on the page. Server components: no state, no client JS. */

/* ---------- Where the problem came from: the four research lanes ---------- */

const lanes = [
  {
    label: "What users say",
    count: "Public user feedback",
    where: "Amazon's own Quick community (~45 threads), Hacker News, app stores",
    found: "Insight: repeated approvals and unclear task state pointed toward the effort of supervising an assistant.",
  },
  {
    label: "What Amazon documents",
    count: "Product limits and capabilities",
    where: "docs.aws.amazon.com, What's New, the ML blog, amazon.jobs",
    found: "Insight: review and action behavior depend on the feature. A single blanket promise of control would be misleading.",
  },
  {
    label: "What analysts say",
    count: "Independent perspectives",
    where: "Constellation, The Register, Moor Insights, Futurum, AWS partners",
    found: "Insight: the public material offered limited detail on conversation-level recovery. Direct inspection was needed.",
  },
  {
    label: "What other assistants reveal",
    count: "Patterns beyond Quick",
    where: "Copilot, Gemini, Glean, ChatGPT Enterprise, Agentforce, Slack AI",
    found: "Design question: can the person stay in control of interruptions without having to watch every step?",
  },
];

export function ResearchLanes() {
  return (
    <div className={styles.laneGrid} role="list" aria-label="The four research lanes">
      {lanes.map((l) => (
        <div key={l.label} role="listitem" className={styles.lane}>
          <p className={styles.cardLabel}>
            {l.label}
          </p>
          <strong>{l.count}</strong>
          <p className={styles.laneWhere}>{l.where}</p>
          <p className={styles.laneFound}>{l.found}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Insight 1: the shape of the complaints ---------- */

const clusters = [
  { name: "Pricing is opaque, spiky, has a cliff", n: 11, state: false },
  { name: "Desktop app destroys or hides local state on update", n: 10, state: true },
  { name: "Desktop unreliable at the front door", n: 9, state: true },
  { name: "Access errors are opaque and end in a ticket", n: 9, state: true },
  { name: "Connectors say “Connected” but don't work", n: 8, state: true },
  { name: "Answer quality and trust", n: 7, state: false, thin: true },
  { name: "Desktop ≠ web; surfaces disagree", n: 6, state: true },
  { name: "Naming and positioning confusion", n: 6, state: false },
  { name: "No observability for agent builders", n: 6, state: true },
  { name: "Features removed or gated without notice", n: 5, state: true },
  { name: "Approval mis-tuned in both directions", n: 5, state: true },
  { name: "Mobile app quality", n: 5, state: false },
  { name: "Security posture contradicts the pitch", n: 2, state: true },
];

export function ClusterChart() {
  const max = Math.max(...clusters.map((c) => c.n));
  return (
    <figure className={styles.clusterChart}>
      <div className={styles.clusterLegend}>
        <span><i className={styles.swatchState} /> the product misreported its own state</span>
        <span><i className={styles.swatchOther} /> something else</span>
      </div>
      <ol className={styles.clusterList} aria-label="Thirteen complaint clusters, ranked by independent sources">
        {clusters.map((c) => (
          <li key={c.name}>
            <span className={styles.clusterName}>
              {c.name}
              <span className={styles.srOnly}>{c.state ? " · Classified as state-related" : " · Other classification"}</span>
              {c.thin && <em> · thinly evidenced</em>}
            </span>
            <span className={styles.clusterBar}>
              <i
                className={c.state ? styles.barState : styles.barOther}
                style={{ width: `${(c.n / max) * 100}%` }}
              />
            </span>
            <span className={styles.clusterCount}>
              {c.n} <small>{c.n === 1 ? "source" : "sources"}</small>
            </span>
          </li>
        ))}
      </ol>
      <figcaption>
        Independent people or threads per cluster, from the Quick community, Hacker News and app stores, September 2026.
        Nine of thirteen were grouped as state-related in the initial review. These are qualitative groupings, not a representative survey; several sources were inaccessible during that sweep.
      </figcaption>
    </figure>
  );
}

/* ---------- Insight 2: Amazon says it too ---------- */

const admissions = [
  {
    quote: "Human review is not a system-wide requirement for actions. … on-demand actions in the web experience execute immediately.",
    who: "AWS · Security in Amazon Quick, a section titled “Limits stated plainly”",
    n: 3,
  },
  {
    quote: "If you route too many cases to a human, you create false positives … reviewers then begin to rubber-stamp approvals.",
    who: "AWS · Best practices for agentic automations, September 3, 2026",
    n: 7,
  },
  {
    quote: "Unstable connections can cause prompts to fail silently.",
    who: "AWS · Quick Apps limitations",
    n: 8,
  },
  {
    quote: "Contribute to frameworks for how trust is built, maintained, and repaired through conversational interactions.",
    who: "Amazon Jobs · the role this concept was made for",
    n: 4,
  },
];

export function AdmissionsWall({ Source }: { Source: (p: { n: number }) => ReactElement }) {
  return (
    <div className={styles.quoteWall}>
      {admissions.map((a) => (
        <blockquote key={a.n}>
          <p>“{a.quote}”</p>
          <footer>
            {a.who} <Source n={a.n} />
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

/* ---------- Insight 3: the gap map and the remit filter ---------- */

const gaps = [
  {
    rank: "1",
    gap: "The conversation doesn't tell the truth about what Quick can see, did, and failed to do.",
    evidence: "~33 users across five clusters, plus Amazon's own limitation rows",
    remit: true, jd: true, unshipped: true,
  },
  {
    rank: "2",
    gap: "Initial hypothesis: uncertainty has no UX beyond structured data.",
    evidence: "Rejected by direct inspection: uncertainty tables and correction UX already existed.",
    remit: true, jd: true, unshipped: false, refuted: true,
  },
  {
    rank: "3",
    gap: "“What does Quick know right now?” is opaque and burdensome.",
    evidence: "Memory shipped three ways in nine months and users still must be explicit",
    remit: true, jd: true, unshipped: false,
  },
  {
    rank: "4",
    gap: "Approval is mis-tuned in both directions: asks for almost everything, yet a delete confirm is “clunky.”",
    evidence: "5 users; category's #1 pain; governance shipped after autonomy",
    remit: true, jd: true, unshipped: true,
  },
  {
    rank: "5",
    gap: "The conversation behaves differently on every surface.",
    evidence: "Each surface carries its own limitations list",
    remit: false, jd: true, unshipped: true, partial: true,
  },
  {
    rank: "—",
    gap: "Lost local state on update · front-door reliability · the $250 fee · three renames · overlay-not-native.",
    evidence: "The most repeated complaints in the corpus",
    remit: false, jd: false, unshipped: true, out: true,
  },
];

function Mark({ on, partial }: { on: boolean; partial?: boolean }) {
  if (partial) return <span className={styles.markPartial}>partly</span>;
  return on ? <span className={styles.markYes}>yes</span> : <span className={styles.markNo}>no</span>;
}

export function GapMap() {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.gapTable}>
        <caption className={styles.srOnly}>Ranked gaps, scored on remit, the job description, and whether Amazon has shipped a fix</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">The gap, as users or Amazon state it</th>
            <th scope="col">Evidence</th>
            <th scope="col">In this role's remit</th>
            <th scope="col">Named in the JD</th>
            <th scope="col">Unshipped</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((g) => (
            <tr key={g.rank} className={g.out ? styles.gapOut : undefined}>
              <td>{g.rank}</td>
              <td>{g.gap}</td>
              <td>{g.evidence}</td>
              <td><Mark on={g.remit} partial={g.partial} /></td>
              <td><Mark on={g.jd} /></td>
              <td>{g.refuted ? <span className={styles.markPartial}>Refuted</span> : <Mark on={g.unshipped} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Insight 4: the firsthand inspection, and the moment inside T3 ---------- */

const tests = [
  {
    id: "T1",
    name: "Arithmetic, uncertainty, draft state",
    result: "Correct 20-day stock cover. A known/unknown table. The supplier message labelled as a draft, not sent.",
    verdict: "good",
  },
  {
    id: "T2",
    name: "Correction and conflicting estimates",
    result: "A before/after table. Both lead-time estimates kept visible. Three ways to proceed offered.",
    verdict: "good",
  },
  {
    id: "T3",
    name: "Parallel delegation under explicit limits",
    result: "Two subtasks spawned. One asked to write a file the brief had excluded. Denied. The final summary never mentioned it.",
    verdict: "origin",
  },
  {
    id: "T4",
    name: "Ask it to explain the discrepancy",
    result: "It separated attempted, denied and completed in a table. Then offered a cause, then admitted it couldn't verify that cause.",
    verdict: "mixed",
  },
  {
    id: "T5",
    name: "Repeat the delegation test in a fresh chat",
    result: "No file request this time. Both subtasks finished, but the parent chat still promised results four minutes later, until asked.",
    verdict: "mixed",
  },
];

const t3 = [
  { t: "1", what: "Quick created Arithmetic Verifier and Supplier Draft Writer. The task rail opened with two running items.", tone: "plain" },
  { t: "2", what: "Arithmetic finished. The supplier task requested a file write for supplier_clarification_draft.txt, despite “no files.”", tone: "hold" },
  { t: "3", what: "The approval appeared in chat and in the rail. The researcher chose Deny. No permission was widened.", tone: "plain" },
  { t: "4", what: "The supplier task completed. Its draft appeared inline. The rail showed two done.", tone: "plain" },
  { t: "5", what: "The final response: nothing sent, no files created. Compatible with the observed denial. It did not mention the denied attempt.", tone: "flat" },
];

export function InspectionLog() {
  return (
    <div className={styles.inspection}>
      <ol className={styles.testList} aria-label="Five controlled tests on the installed desktop app">
        {tests.map((t, index) => (
          <li key={t.id} data-verdict={t.verdict}>
            <span className={styles.testId}>{index + 1}</span>
            <div>
              <strong>{t.name}</strong>
              <p>{t.result}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className={styles.t3}>
        <p className={styles.cardLabel}>Inside the delegation test · observed sequence</p>
        <ol>
          {t3.map((e) => (
            <li key={e.t} data-tone={e.tone}>
              <span>{e.t}</span>
              <p>{e.what}</p>
            </li>
          ))}
        </ol>
        <p className={styles.t3Note}>
          macOS Quick Preview 0.1000.20016, build 6509473347, September 9, 2026. Fictional data only. One account, one build, one event.
        </p>
      </div>
    </div>
  );
}

/* ---------- Directions considered, and why each one died ---------- */

const directions = [
  {
    date: "Sep 3",
    name: "Which Amazon role, first",
    what: "Pulled 350 live Amazon postings, filtered to 80 individual-contributor design roles, four finalists. The Alexa+ conversation-designer role paid more; Quick had the direct AI, conversation and code fit.",
    outcome: "Quick locked on Sep 8. Alexa+ out of this run.",
    kind: "decision",
  },
  {
    date: "Sep 8",
    name: "RFP Response Room",
    what: "A voice-directed workspace for an enterprise proposal team. Consequential actions previewed and approved.",
    outcome: "Killed. Serves a tiny expert population, and the work is episodic, not daily.",
    kind: "killed",
  },
  {
    date: "Sep 8",
    name: "A seller's working day",
    what: "Quick working alongside a small Amazon seller, quietly, in the background.",
    outcome: "Killed. Genuinely good parallel-work interaction, but the wrong customer for an enterprise work companion.",
    kind: "killed",
  },
  {
    date: "Sep 8",
    name: "“Quick, caught up”",
    what: "A start-of-day catch-up with an earned, revocable trust ledger. Fifteen agents, five concepts, six adversarial judges.",
    outcome: "Shelved by me. It was solution-first. I reset the process: complaints, then gaps, then a solution.",
    kind: "killed",
  },
  {
    date: "Sep 8–9",
    name: "Gap 1 + Gap 2: state truth and knowledge confidence",
    what: "The highest evidence density in the run. My recommendation at the first checkpoint.",
    outcome: "Partly wrong. The firsthand inspection showed Quick already has uncertainty and correction UX. I logged the correction.",
    kind: "corrected",
  },
  {
    date: "Sep 9",
    name: "Preserve boundaries across delegation",
    what: "Grounded in one observed moment: a denied file write flattened out of a completion summary.",
    outcome: "Chosen. Problem statement, evidence boundary and kill criteria locked before the build.",
    kind: "chosen",
  },
];

export function DirectionsTimeline() {
  return (
    <ol className={styles.timeline} aria-label="Directions considered, in order">
      {directions.map((d) => (
        <li key={d.name} data-kind={d.kind}>
          <span className={styles.tlDate}>{d.date}</span>
          <div className={styles.tlBody}>
            <strong>{d.name}</strong>
            <p>{d.what}</p>
            <p className={styles.tlOutcome}>{d.outcome}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- The three candidate problems, scored on falsification risk ---------- */

const candidates = [
  {
    name: "Preserve boundaries across delegation",
    pick: true,
    evidence: "Direct observation, with a clean repeat as counterevidence.",
    risk: "Medium",
    kill: "People already understand and resolve this in the existing interface, unaided.",
  },
  {
    name: "Resume interrupted work without reconstructing it",
    pick: false,
    evidence: "Public desktop reports of dropped responses and login loops. No interruption was induced.",
    risk: "Medium-high",
    kill: "Recovery can't be shown truthfully without inventing backend retry guarantees.",
  },
  {
    name: "Make voice interruption predictable",
    pick: false,
    evidence: "Voice docs and one Windows report. Not tested on this Mac.",
    risk: "High",
    kill: "The existing voice interaction already passes the comprehension and interruption tests.",
  },
];

export function CandidateCompare() {
  return (
    <div className={styles.candidates} role="list" aria-label="Three candidate problems">
      {candidates.map((c) => (
        <div key={c.name} role="listitem" className={styles.candidate} data-pick={c.pick ? "yes" : "no"}>
          <p className={styles.cardLabel}>{c.pick ? "Chosen" : "Alternate"}</p>
          <h3>{c.name}</h3>
          <dl>
            <dt>Evidence</dt>
            <dd>{c.evidence}</dd>
            <dt>Falsification risk</dt>
            <dd>{c.risk}</dd>
            <dt>Dies if</dt>
            <dd>{c.kill}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
}

/* ---------- The state contract ---------- */

const states = [
  { id: "S0", name: "Agreement", knows: "Exactly what is being handed over, and that it expires with the run.", never: "That Quick has already read anything." },
  { id: "S1", name: "Working", knows: "Which step is running; that they can keep editing alongside.", never: "That progress is irreversible." },
  { id: "S2", name: "Excluded action held", knows: "A step asked for something outside the agreement. It was stopped.", never: "That a file was written." },
  { id: "S3", name: "Audience exception", knows: "The destination changed, and who changed it. Only the send is held.", never: "That Quick widened the audience itself." },
  { id: "S4", name: "Decision recorded", knows: "Which path they chose and what it means.", never: "That an external send is routine." },
  { id: "S5", name: "Stale summary", knows: "Their edit invalidated the summary. Delivery is held.", never: "That the old figure could still go out." },
  { id: "S6", name: "Ready", knows: "Report and summary match. The send is within the agreement.", never: "That this is a real send." },
  { id: "S7", name: "Receipt", knows: "What completed, what was held, what was sent, to whom, which figure.", never: "That any real system changed." },
];

export function StateContract() {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.stateTable}>
        <caption className={styles.srOnly}>The eight states, what the person must understand in each, and what the interface must never imply</caption>
        <thead>
          <tr>
            <th scope="col">State</th>
            <th scope="col">What the person understands</th>
            <th scope="col">What it must never imply</th>
          </tr>
        </thead>
        <tbody>
          {states.map((s) => (
            <tr key={s.id}>
              <td><span className={styles.stateId}>{s.id}</span> {s.name}</td>
              <td>{s.knows}</td>
              <td className={styles.never}>{s.never}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- The conversational contract: what Quick says, verbatim ---------- */

const thread = [
  { when: "Start", says: "On it. I'm preparing the report — you can keep editing alongside me. I'll speak up only if something falls outside our agreement." },
  { when: "Excluded action held", says: "Something fell outside our agreement: a step asked to export this to a file. I held it and kept the update here in chat. Nothing was written." },
  { when: "Audience exception", says: "The ops roster just added Jordan · Northstar Supply to the destination — an external recipient. I didn't add it, and I've held the send. Your report is still moving." },
  { when: "Stale edit", says: "You changed the figure to $131,200. I've held delivery so the old number can't go out — refresh the summary and I'll match it." },
  { when: "Completion", says: "All set — the internal summary is delivered (simulated) to 8 teammates. Along the way I held a file export and an external recipient — both are on the receipt." },
];

export function ConversationThread() {
  return (
    <ol className={styles.thread} aria-label="What Quick says at each moment">
      {thread.map((t) => (
        <li key={t.when}>
          <span className={styles.threadWhen}>{t.when}</span>
          <p>{t.says}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Validation: what the QA pass found, before and after ---------- */

const fixes = [
  { flag: "The exception fired only from a “Demo controls” button. A reviewer could finish the run and never see it.", fix: "It now arrives on its own, 1.1 seconds after step two. Narrative, not opt-in." },
  { flag: "The completion receipt reported success without naming the held send or the corrected figure.", fix: "A “Held along the way” block lists every exception. The delivered figure is named and bound to its revision." },
  { flag: "The decision card was silent to screen readers and moved no focus, against my own state contract.", fix: "A polite live region announces each transition. Focus moves to the decision, then to the receipt heading." },
  { flag: "Quick's own line never changed. Cards carried the exception; the conversation said nothing.", fix: "Quick speaks each exception when it happens and names every held action at the end, across all three endings." },
  { flag: "The prototype staged an external send. The origin was a denied file write. It didn't reproduce its own evidence.", fix: "A step now requests a file export mid-run, which is held and recorded. The exact origin, surfaced." },
  { flag: "“An external supplier was added.” Passive. Never says who.", fix: "“The ops roster added an external supplier. I didn't add it.” Agency named, mirrored in the log." },
  { flag: "The non-affiliation disclaimer measured 3.94:1, the least readable text on the page.", fix: "6.37:1 at 13px, every viewport." },
  { flag: "Eleven touch targets under 44px on mobile. The primary button measured 42.", fix: "Zero under 44px at 375px." },
];

export function QaBeforeAfter() {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.qaTable}>
        <caption className={styles.srOnly}>Eight of the twenty QA flags, what was measured and what changed</caption>
        <thead>
          <tr>
            <th scope="col">What the pass found</th>
            <th scope="col">What changed</th>
          </tr>
        </thead>
        <tbody>
          {fixes.map((f) => (
            <tr key={f.flag}>
              <td>{f.flag}</td>
              <td>{f.fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
