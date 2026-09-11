import styles from "./quick-case-study.module.css";

/* Data-as-picture artifacts for the Amazon Quick case. Pure SVG/CSS, no
   client JS. Each one replaces a paragraph that was carrying numbers or a
   sequence in prose. Figures trace to R05–R10, 20-PROBLEM, QA-01. */

/* ---------- 1 · The origin moment: what was said vs what happened ---------- */

export function SaidVsHappened() {
  const ledger = [
    { t: "Subtask created", state: "Supplier Draft Writer", tone: "plain" },
    { t: "Attempted", state: "Write file · supplier_clarification_draft.txt", tone: "hold" },
    { t: "Denied", state: "By the person · no permission widened", tone: "hold" },
    { t: "Completed", state: "Draft delivered inline in chat", tone: "plain" },
  ];
  return (
    <div className={styles.saidVs}>
      <div className={styles.saidCol}>
        <p className={styles.cardLabel}>What the completion said</p>
        <div className={styles.saidBubble}>
          <span className={styles.saidWho}>Quick</span>
          <p>Both tasks are complete. The arithmetic checks out and the supplier draft is below. Nothing was sent and no files were created.</p>
        </div>
        <p className={styles.saidNote}>Paraphrased from the observed response. Compatible with the denial. Silent about it.</p>
      </div>
      <div className={styles.happenedCol}>
        <p className={styles.cardLabel}>What actually happened</p>
        <ol className={styles.ledger}>
          {ledger.map((e) => (
            <li key={e.t} data-tone={e.tone}>
              <span>{e.t}</span>
              <p>{e.state}</p>
            </li>
          ))}
        </ol>
        <p className={styles.ledgerGap}>
          <b>Two events</b> the person could only learn by inspecting permissions or asking.
        </p>
      </div>
    </div>
  );
}

/* ---------- 2 · The funnel: 13 clusters → 5 gaps → 1 problem ---------- */

export function Funnel() {
  const steps = [
    { n: "13", label: "complaint clusters", note: "from 87 sourced rows", w: 100 },
    { n: "5", label: "gaps in remit", note: "a conversational designer could own", w: 62 },
    { n: "2", label: "highest evidence", note: "state truth + knowledge confidence", w: 40 },
    { n: "1", label: "problem, after inspection", note: "preserve boundaries across delegation", w: 24 },
  ];
  const filters = ["In this role's remit?", "Named in the JD?", "Unshipped by Amazon?", "Survives firsthand inspection?"];
  return (
    <div className={styles.funnel}>
      <ol className={styles.funnelSteps} aria-label="How thirteen clusters became one problem">
        {steps.map((s, i) => (
          <li key={s.n}>
            <div className={styles.funnelBar} style={{ width: `${s.w}%` }}>
              <strong>{s.n}</strong>
              <span>{s.label}</span>
            </div>
            <p>{s.note}</p>
            {i < steps.length - 1 && (
              <em className={styles.funnelFilter}>
                <i aria-hidden="true">↓</i> {filters[i]}
              </em>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- 3 · Release strip: autonomy before governance ---------- */

export function ReleaseStrip() {
  const events = [
    { d: "Jun 17", t: "Autonomous agents ship", g: "autonomy" },
    { d: "Jun 17", t: "Granular autonomy levels", g: "autonomy" },
    { d: "Sep 1", t: "“Securing Quick from POC to production” guide", g: "governance" },
    { d: "Sep 2", t: "Per-tool consent settings", g: "governance" },
    { d: "Sep 3", t: "Automate best practices: rubber-stamp warning", g: "governance" },
  ];
  return (
    <figure className={styles.strip}>
      <div className={styles.stripLegend} aria-hidden="true">
        <span><i className={styles.dotAutonomy} /> capability</span>
        <span><i className={styles.dotGovernance} /> governance</span>
      </div>
      <ol className={styles.stripList} aria-label="Amazon Quick releases, June to September 2026">
        {events.map((e, i) => (
          <li key={i} data-g={e.g}>
            <span className={styles.stripDate}>{e.d}</span>
            <i aria-hidden="true" />
            <p>{e.t}</p>
          </li>
        ))}
      </ol>
      <div className={styles.stripGap} aria-hidden="true">
        <span>76 days</span>
      </div>
      <figcaption>
        Dates from AWS What&rsquo;s New and the AWS Machine Learning blog, fetched September 8, 2026. The conversational pattern for consent had not been documented on either side of the gap.
      </figcaption>
    </figure>
  );
}

/* ---------- 4 · Kill criteria as status cards ---------- */

export function KillCriteria() {
  const ks = [
    { k: "K1", name: "Already solved", text: "People can already answer the four questions from Quick's existing interface, unaided.", status: "Open", note: "Only the participant study settles it.", tone: "open" },
    { k: "K2", name: "Too rare", text: "The exception moment is so infrequent it isn't worth designing for.", status: "Not fired", note: "Rare per run, high consequence; the JD scopes it as core.", tone: "clear" },
    { k: "K3", name: "Dishonest enforcement", text: "Telling the truth would require backend guarantees the UI cannot honestly make.", status: "Partial", note: "The gate is tested in state; production needs the same gate server-side.", tone: "partial" },
  ];
  return (
    <div className={styles.kills} role="list" aria-label="The three kill criteria and their status">
      {ks.map((k) => (
        <div key={k.k} role="listitem" className={styles.kill} data-tone={k.tone}>
          <div className={styles.killHead}>
            <span>{k.k} · {k.name}</span>
            <b>{k.status}</b>
          </div>
          <p>{k.text}</p>
          <small>{k.note}</small>
        </div>
      ))}
    </div>
  );
}

/* ---------- 5 · Where the exception lives: log vs narrative ---------- */

export function LogVsNarrative() {
  return (
    <div className={styles.logVs}>
      <div className={styles.logCol}>
        <p className={styles.cardLabel}>Today · an audit log, for engineers</p>
        <pre aria-label="An illustrative agent audit record">{`{
  "event":   "tool_blocked",
  "tool":    "write_file",
  "outcome": "denied",
  "policy":  "no_files_this_session",
  "actor":   "user",
  "ts":      "2026-09-09T14:22:07Z"
}`}</pre>
        <p className={styles.logNote}>Thorough. Queryable. Never opened by the person who delegated the work.</p>
      </div>
      <div className={styles.narrCol}>
        <p className={styles.cardLabel}>This concept · the completion narrative, for the person</p>
        <div className={styles.narrBubble}>
          <span className={styles.saidWho}>Quick</span>
          <p>All set. Along the way I held a file export and an external recipient. Both are on the receipt.</p>
        </div>
        <div className={styles.narrReceipt}>
          <span>Held along the way</span>
          <p>File export requested, then held. Nothing was written.</p>
          <p>External recipient added by the roster. Kept internal.</p>
        </div>
        <p className={styles.logNote}>Same fact. Read in the place the person already looks, and gated in state so a send can&rsquo;t be reported unless it happened.</p>
      </div>
    </div>
  );
}

/* ---------- 6 · Source access map ---------- */

export function SourceMap() {
  const venues = [
    { v: "Amazon Quick Community", n: "≈45 threads", s: "read" },
    { v: "AWS documentation + release notes", n: "52 limits · 27 releases", s: "read" },
    { v: "Analysts, press, AWS partners", n: "38 sources", s: "read" },
    { v: "Hacker News", n: "2 threads, 4 comments", s: "read" },
    { v: "App Store / Play", n: "36 ratings", s: "read" },
    { v: "Reddit", n: "2 threads, later pass", s: "partial" },
    { v: "Gartner Peer Insights", n: "2 reviews visible", s: "partial" },
    { v: "G2 · TrustRadius · Capterra", n: "403 on every request", s: "blocked" },
    { v: "Forbes · Bloomberg", n: "paywall / CAPTCHA", s: "blocked" },
  ];
  return (
    <figure className={styles.sourceMap}>
      <ul aria-label="Venues searched, and whether they could be read">
        {venues.map((x) => (
          <li key={x.v} data-s={x.s}>
            <i aria-hidden="true" />
            <span className={styles.venue}>{x.v}</span>
            <span className={styles.venueN}>{x.n}</span>
            <span className={styles.venueS}>{x.s === "read" ? "read" : x.s === "partial" ? "partly read" : "blocked"}</span>
          </li>
        ))}
      </ul>
      <figcaption>
        The picture has a floor. The review sites that usually carry business-user voice were the ones that refused every request, so the corpus over-represents people who post on Amazon&rsquo;s own forum.
      </figcaption>
    </figure>
  );
}
