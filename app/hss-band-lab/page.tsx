import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Band lab — HSS back-half attention options",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ *
 * JIG, not a shipped page. Compares the attention options for the
 * case study's back half using the real board art and the real copy.
 *
 * Styles live in the <style> tag below on purpose: the running dev
 * server's CSS watcher is stale, and a self-contained page is also
 * the honest way to compare — nothing here depends on globals.css
 * changing, so what you see is exactly what each option costs.
 * ------------------------------------------------------------------ */

const CREAM = "#FFFBF4";
const GREY = "#f6f6f6";
const OLIVE = "#5c4304";
const TEAL = "#002526";
const INK = "#1d1b1b";

function Tag({ children }: { children: string }) {
  return <p className="lab-tag">{children}</p>;
}

function Prose() {
  return (
    <div className="lab-prose">
      <p>
        The three complaints arrived in the same week. The managing partner talked about
        return rates, the CEO talked about ad spend, and both of them talked about the
        phone. Every diagnosis pointed somewhere different until the audit put them side
        by side.
      </p>
    </div>
  );
}

export default function BandLab() {
  return (
    <main className="lab">
      <style>{`
        .lab { background: #fff; color: ${INK}; font-family: var(--font-sans), Poppins, system-ui, sans-serif; padding-bottom: 160px; }
        .lab-head { max-width: 800px; margin: 0 auto; padding: 64px 20px 24px; }
        .lab-head h1 { font-size: 28px; line-height: 40px; font-weight: 600; }
        .lab-head p { margin-top: 8px; font-size: 15px; line-height: 24px; color: rgb(29 27 27 / 0.7); }

        .lab-tag { max-width: 800px; margin: 96px auto 0; padding: 0 20px 14px; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${TEAL}; }

        .lab-prose { max-width: 800px; margin: 28px auto; padding: 0 20px; }
        .lab-prose p { font-size: 16px; line-height: 28px; color: rgb(29 27 27 / 0.85); }

        /* The phase block, both unpainted and painted */
        .lab-phase { width: 100%; }
        .lab-phase-inner { max-width: 800px; margin: 0 auto; padding: 56px 20px; }
        .lab-phase-number { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; }
        .lab-phase-claim { margin-top: 16px; font-family: var(--font-serif), Georgia, serif; font-size: 36px; line-height: 46px; font-weight: 600; letter-spacing: 0.2px; }

        /* The artifact stage band */
        .lab-stage { width: 100%; padding: 56px 0; }
        .lab-stage figure { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .lab-stage img { width: 100%; height: auto; display: block; }
        .lab-caption { max-width: 1200px; margin: 12px auto 0; padding: 0 20px; font-size: 13.5px; line-height: 20px; color: rgb(29 27 27 / 0.6); }

        /* Bare figure for the baseline */
        .lab-bare { max-width: 1200px; margin: 24px auto; padding: 0 20px; }
        .lab-bare img { width: 100%; height: auto; display: block; }

        /* Stat interlude */
        .lab-stat { max-width: 800px; margin: 0 auto; padding: 72px 20px; text-align: left; }
        .lab-stat-figure { font-size: 64px; line-height: 72px; font-weight: 500; letter-spacing: -1.6px; font-variant-numeric: tabular-nums; }
        .lab-stat-mark { background: ${TEAL}; color: #fff; padding: 0 0.18em; }
        .lab-stat-label { margin-top: 10px; font-size: 14px; line-height: 22px; color: rgb(29 27 27 / 0.7); }

        .lab-note { max-width: 800px; margin: 20px auto 0; padding: 12px 16px; border-radius: 12px; background: #f7f6f3; border: 1px solid rgb(0 0 0 / 0.08); font-size: 13.5px; line-height: 20px; color: rgb(29 27 27 / 0.85); }
        .lab-note strong { font-weight: 600; }
      `}</style>

      <header className="lab-head">
        <h1>Band lab</h1>
        <p>
          Every option for breaking the back-half text wall, built with the real P1 board
          and the real Phase One copy. Scroll it like a recruiter would. Not linked from
          anywhere; noindex.
        </p>
      </header>

      {/* ------------------------------------------------------------ */}
      <Tag>0 · Baseline — what ships today</Tag>
      <div className="lab-phase">
        <div className="lab-phase-inner">
          <p className="lab-phase-number">Phase one · Diagnose</p>
          <h2 className="lab-phase-claim">
            Three complaints, from two owners, turned out to be one broken handover.
          </h2>
        </div>
      </div>
      <Prose />
      <div className="lab-bare">
        <img src="/case-studies/hss/p1-three-complaints-v2.png" alt="P1 board, bare on white" width={2400} height={2074} />
      </div>

      {/* ------------------------------------------------------------ */}
      <Tag>B1 · Act-break band — cream</Tag>
      <div className="lab-phase" style={{ background: CREAM }}>
        <div className="lab-phase-inner">
          <p className="lab-phase-number" style={{ color: OLIVE }}>Phase one · Diagnose</p>
          <h2 className="lab-phase-claim">
            Three complaints, from two owners, turned out to be one broken handover.
          </h2>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      <Tag>B2 · Act-break band — olive, the loud chapter</Tag>
      <div className="lab-phase" style={{ background: OLIVE, color: "#fff" }}>
        <div className="lab-phase-inner">
          <p className="lab-phase-number" style={{ color: "rgb(255 255 255 / 0.75)" }}>Phase one · Diagnose</p>
          <h2 className="lab-phase-claim" style={{ color: "#fff" }}>
            Three complaints, from two owners, turned out to be one broken handover.
          </h2>
        </div>
      </div>
      <p className="lab-note">
        <strong>Cost to weigh.</strong> Olive at act scale spends the intro band&rsquo;s
        uniqueness five more times. Shown so the choice is made with eyes open, not by
        default.
      </p>

      {/* ------------------------------------------------------------ */}
      <Tag>A1 · Artifact stage — board on cream</Tag>
      <div className="lab-stage" style={{ background: CREAM }}>
        <figure>
          <img src="/case-studies/hss/p1-three-complaints-v2.png" alt="P1 board on a cream stage" width={2400} height={2074} />
        </figure>
        <p className="lab-caption">
          The board&rsquo;s own white edge shows against the cream, so it reads as paper
          on a desk rather than more page.
        </p>
      </div>

      {/* ------------------------------------------------------------ */}
      <Tag>A2 · Artifact stage — board on grey, the hero-band neutral</Tag>
      <div className="lab-stage" style={{ background: GREY }}>
        <figure>
          <img src="/case-studies/hss/p1-three-complaints-v2.png" alt="P1 board on a grey stage" width={2400} height={2074} />
        </figure>
      </div>
      <p className="lab-note">
        <strong>The neutrals question.</strong> The hero band is currently this grey only
        because the export came out grey. Picking cream here means re-exporting the hero
        on cream so the page has one artifact-stage colour, not two.
      </p>

      {/* ------------------------------------------------------------ */}
      <Tag>D · Stat interlude — the summary grammar at act scale</Tag>
      <div className="lab-stat">
        <p className="lab-stat-figure">
          $105 <span aria-hidden="true">&rarr;</span> <span className="lab-stat-mark">$40</span>
        </p>
        <p className="lab-stat-label">
          cost per new customer, measured in the client&rsquo;s own ad account
        </p>
      </div>

      {/* ------------------------------------------------------------ */}
      <Tag>B+A · The recommended rhythm, one full act</Tag>
      <div className="lab-phase" style={{ background: CREAM }}>
        <div className="lab-phase-inner">
          <p className="lab-phase-number" style={{ color: OLIVE }}>Phase one · Diagnose</p>
          <h2 className="lab-phase-claim">
            Three complaints, from two owners, turned out to be one broken handover.
          </h2>
        </div>
      </div>
      <Prose />
      <div className="lab-stage" style={{ background: CREAM }}>
        <figure>
          <img src="/case-studies/hss/p1-three-complaints-v2.png" alt="P1 board inside the combined rhythm" width={2400} height={2074} />
        </figure>
      </div>
      <Prose />
      <p className="lab-note">
        <strong>The rhythm.</strong> Cream chapter marker, white prose, cream artifact
        stage, white prose. Difference with a reason: cream always means either
        &ldquo;a new act begins&rdquo; or &ldquo;an artifact is on stage.&rdquo;
      </p>
    </main>
  );
}
