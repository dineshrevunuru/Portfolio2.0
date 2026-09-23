"use client";

/**
 * The red button, with the motion a red button implies: the window CLOSES —
 * a quick scale-down and fade anchored at the button — and then you are back
 * wherever you came from, at the same scroll position (Dinesh, 2026-09-23:
 * "back to where ever user came from to the exact location").
 *
 * "Back" is the browser's own history step, so the page you left comes back
 * with its scroll restored: the site footer, a case study, even a search result.
 * With no history to return to (the page was opened directly or in a new tab)
 * it goes to the home page instead.
 *
 * Progressive enhancement over a real anchor: the href survives, so with JS
 * off, a crawler, or prefers-reduced-motion, this is an ordinary instant
 * navigation. The animation lives in agents.css (.agents-term.closing); this
 * component only attaches the class and follows the link when the close has
 * played. The 400ms fallback covers an animationend that never fires (a
 * throttled tab) — navigation is the job, the theater is optional.
 */
import { useEffect, useRef } from "react";

/** Step back through history if there is somewhere to go; otherwise go home. */
function leave() {
  if (window.history.length > 1) window.history.back();
  else window.location.href = "/";
}

export default function CloseButton() {
  const closing = useRef(false);

  // Coming forward to this page from the back/forward cache would show the
  // window mid-close (still faded out). Reset it whenever the page is shown.
  useEffect(() => {
    const reset = () => {
      closing.current = false;
      document.querySelector(".agents-term")?.classList.remove("closing");
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  return (
    <a
      className="close"
      href="/"
      aria-label="Close and go back"
      onClick={(e) => {
        // Reduced motion: no close animation, but still go back rather than home.
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
          e.preventDefault();
          leave();
          return;
        }
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
          leave();
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
