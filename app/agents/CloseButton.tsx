"use client";

/**
 * The red button, with the motion a red button implies: the window CLOSES —
 * a quick scale-down and fade anchored at the button — and then you are back
 * at /lorem. Dinesh's note on the plain version: "when clicked transition
 * motion can be improved here."
 *
 * Progressive enhancement over a real anchor: the href survives, so with JS
 * off, a crawler, or prefers-reduced-motion, this is an ordinary instant
 * navigation. The animation lives in agents.css (.agents-term.closing); this
 * component only attaches the class and follows the link when the close has
 * played. The 400ms fallback covers an animationend that never fires (a
 * throttled tab) — navigation is the job, the theater is optional.
 */
import { useRef } from "react";

export default function CloseButton() {
  const closing = useRef(false);

  return (
    <a
      className="close"
      href="/lorem"
      aria-label="Close — back to Lorem"
      onClick={(e) => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        const term = (e.currentTarget as HTMLElement).closest(".agents-term");
        if (!term || closing.current) {
          if (closing.current) e.preventDefault();
          return;
        }
        e.preventDefault();
        closing.current = true;
        let gone = false;
        const go = () => {
          if (gone) return;
          gone = true;
          window.location.href = "/lorem";
        };
        term.addEventListener("animationend", go, { once: true });
        window.setTimeout(go, 400);
        term.classList.add("closing");
      }}
    >
      <span aria-hidden>×</span>
    </a>
  );
}
