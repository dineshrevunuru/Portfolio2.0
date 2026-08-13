"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { CACChart } from "./CACChart";
import type { Block } from "./protocol";

/** Resolved server-side so the client never ships the whole fact store. */
export type FactLookup = Record<string, { value: string; label: string }>;
export type QuoteLookup = Record<string, { text: string; by: string }>;

export interface SurfaceProps {
  blocks: Block[];
  facts: FactLookup;
  quotes: QuoteLookup;
  /** Echo of what the visitor asked, shown above the answer. */
  asked?: string;
  /**
   * The spoken line — a FALLBACK only, rendered when the model returned no
   * blocks at all. Lorem is a presenter, not a teleprompter: printing the
   * sentence it is speaking is the "screen that prints the transcript" failure
   * this component exists to avoid. The voice narrates; the glass carries what
   * the ear can't hold.
   */
  say?: string;
  /** Timing multiplier, shared with the rest of the page. */
  pace?: number;
}

const beat = (i: number, pace: number): CSSProperties => ({
  animation: `lorem-beatin ${(0.6 / pace).toFixed(2)}s ${((0.18 / pace) * i).toFixed(2)}s both`,
});

/**
 * Surface — renders whatever Lorem composed for this turn.
 *
 * There is no page here, and that is the point. The model picks the blocks and
 * their order each turn, so the screen is assembled to fit the question that was
 * actually asked rather than retrieved from a set of prewritten answers. Every
 * branch below maps onto markup that already exists in `lorem.css`, which is what
 * keeps an improvised layout on-brand.
 */
export function Surface({ blocks, facts, quotes, asked, say, pace = 1 }: SurfaceProps) {
  if (!blocks.length && !asked && !say) return null;

  // Only surface the spoken line when there is nothing else on screen —
  // otherwise the visitor reads along with the voice instead of looking at
  // the evidence, and the two tracks collapse into one.
  const fallbackSay = blocks.length === 0 ? say : undefined;
  const offset = (asked ? 1 : 0) + (fallbackSay ? 1 : 0);

  return (
    // --ai is set on .lorem-screen from a (max-height:700px) query and inherits
    // here. Without this inline inset the property is set but never read, and a
    // short viewport squeezes a long answer into a ~300px scroll window.
    <div className="lorem-answer" style={{ inset: "var(--ai, 40px) 0" }}>
      {asked && (
        // Pinned: when a long answer scrolls, the question must not scroll away
        // with it — losing the question is the exact failure the echo exists for.
        <div className="lorem-asked-pin" style={beat(0, pace)}>
          {/* Masked from Clarity replays: this echoes the visitor's own words,
              which can carry a name or employer — see app/components/Clarity.tsx. */}
          <div className="lorem-asked" data-clarity-mask="True">
            you asked &middot; {asked}
          </div>
        </div>
      )}
      {fallbackSay && (
        <div style={beat(asked ? 1 : 0, pace)}>
          <p className="lorem-p">{fallbackSay}</p>
        </div>
      )}
      {blocks.map((b, i) => (
        <div key={i} style={beat(i + offset, pace)}>
          {renderBlock(b, facts, quotes)}
        </div>
      ))}
    </div>
  );
}

function renderBlock(b: Block, facts: FactLookup, quotes: QuoteLookup) {
  switch (b.type) {
    case "heading":
      return <h1 className="lorem-h">{b.text}</h1>;

    case "text":
      return <p className="lorem-p">{b.text}</p>;

    case "proof":
      return <span className="lorem-proof">{b.text}</span>;

    case "metrics":
      return (
        <div className="lorem-metrics">
          {b.items.map(({ factId }) => {
            const f = facts[factId];
            if (!f) return null; // guardrail already dropped it; belt and braces
            return (
              <div className="lorem-metric" key={factId}>
                <div className="v">{f.value}</div>
                <div className="k">{f.label}</div>
              </div>
            );
          })}
        </div>
      );

    case "problem":
      return (
        <div className="lorem-problem">
          <div className="st">{b.statement}</div>
          {b.cost && <div className="cost">{b.cost}</div>}
        </div>
      );

    case "split":
      return (
        <div className="lorem-split">
          <div className="lorem-lane a">
            <div className="lt">{b.before.title}</div>
            <div className="ld">{b.before.body}</div>
          </div>
          <div className="lorem-lane b">
            <div className="lt">{b.after.title}</div>
            <div className="ld">{b.after.body}</div>
          </div>
        </div>
      );

    case "quote": {
      const q = quotes[b.quoteId];
      if (!q) return null;
      return (
        <div className="lorem-quotes">
          <figure className="lorem-quote" style={{ margin: 0 }}>
            <blockquote className="qt" style={{ margin: 0 }}>
              {q.text}
            </blockquote>
            <figcaption className="qby">{q.by}</figcaption>
          </figure>
        </div>
      );
    }

    case "personas":
      return (
        <div className="lorem-personas">
          {b.items.map((p, i) => (
            <div className="lorem-persona" key={i}>
              <div className="pn">{p.name}</div>
              <div className="pd">{p.detail}</div>
              {p.need && <div className="ps">&rarr; {p.need}</div>}
            </div>
          ))}
        </div>
      );

    case "steps":
      return (
        <div className="lorem-steps">
          {b.items.map((s, i) => (
            <span key={i} style={{ display: "contents" }}>
              {i > 0 && (
                <span className="lorem-steparr" aria-hidden="true">
                  &rarr;
                </span>
              )}
              <span className="lorem-step">{s}</span>
            </span>
          ))}
        </div>
      );

    case "arc":
      return (
        <div className="lorem-arcrail">
          {b.items.map((p, i) => (
            <div className={p.active ? "lorem-phase on" : "lorem-phase"} key={i}>
              {p.label}
            </div>
          ))}
        </div>
      );

    case "chart":
      return <CACChart dataset={b.dataset} caption={b.caption} />;

    case "chat":
      return (
        <div className="lorem-live">
          <div className="lh">
            <span className="g" aria-hidden="true" />
            {b.title ?? "From the live assistant"}
          </div>
          {b.turns.map((t, i) => (
            <div className={t.from === "u" ? "lorem-bubble u" : "lorem-bubble them"} key={i}>
              {t.text}
            </div>
          ))}
          {b.note && <div className="livenote">{b.note}</div>}
        </div>
      );

    case "link":
      return b.href.startsWith("mailto:") ? (
        <a className="lorem-chip go" href={b.href} style={{ textDecoration: "none" }}>
          {b.label}
        </a>
      ) : (
        <Link className="lorem-chip go" href={b.href} style={{ textDecoration: "none" }}>
          {b.label}
        </Link>
      );
  }
}
