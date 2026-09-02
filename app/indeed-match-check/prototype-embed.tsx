"use client";

import { useState } from "react";
import styles from "./indeed-case-study.module.css";

const PROTOTYPE_URL = "/indeed-match-check-prototype/index.html";

/**
 * The operable prototype, embedded after the argument.
 *
 * Click-to-load rather than auto-load: the frame is a whole second Next app,
 * and a visitor who is here for the writing should not pay for it on scroll.
 *
 * An iframe on purpose. The prototype speaks Indeed's design language, and this
 * page speaks mine — the frame is the boundary that keeps those two from
 * blurring into each other.
 */
export function PrototypeEmbed() {
  const [live, setLive] = useState(false);

  return (
    <div className={styles.protoStage}>
      {live ? (
        <iframe
          src={PROTOTYPE_URL}
          title="Match Check — interactive concept prototype"
          className={styles.protoFrame}
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      ) : (
        <button type="button" className={styles.protoPoster} onClick={() => setLive(true)}>
          <span className={styles.posterEyebrow}>Interactive</span>
          <span className={styles.posterTitle}>Raise the bar and watch who disappears</span>
          <span className={styles.posterBody}>
            The working prototype, in Indeed&rsquo;s employer design language. Change the
            experience requirement from two years to five and see what the recruiter sees.
            Fictional employer, fictional applicants.
          </span>
          <span className={styles.posterCta}>Open the prototype</span>
        </button>
      )}
      <p className={styles.protoBar}>
        <span>
          Concept by Dinesh Revunuru · not affiliated with Indeed · all data fictional
        </span>
        <a href={PROTOTYPE_URL} target="_blank" rel="noreferrer">
          Open in a new tab
        </a>
      </p>
    </div>
  );
}
