"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AgentsTerminal from "../agents/AgentsTerminal";
import "../agents/agents.css";

/**
 * The agent dossier as a pop-up over whatever page the reader is on.
 *
 * Any plain click on a link to /agents (the footer's "For Agents?") opens it
 * here instead of navigating, so closing it leaves the reader exactly where
 * they were: same page, same scroll, nothing to reload or replay. /agents stays
 * a real page for direct visits, crawlers and new-tab clicks (modifier keys and
 * middle-click are left alone).
 *
 * Accessibility: a labelled modal dialog; focus moves into it and returns to
 * the link on close; Escape and a click outside the window close it; the page
 * behind stops scrolling while it is open.
 */
export default function AgentsModal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  // Intercept plain clicks on /agents links anywhere on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.getAttribute("href") !== "/agents" || location.pathname === "/agents") return;
      e.preventDefault();
      opener.current = a;
      setClosing(false);
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const done = () => {
      setOpen(false);
      setClosing(false);
      opener.current?.focus();
    };
    if (reduce) return done();
    setClosing(true);
    window.setTimeout(done, 300);
  }, []);

  // While open: lock page scroll, focus the dialog, Escape closes, Tab stays inside.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    // preventScroll: focusing the (taller-than-screen) window otherwise scrolls
    // its top edge flush to the viewport, eating the top spacing.
    dialog.current?.focus({ preventScroll: true });
    dialog.current?.parentElement?.scrollTo(0, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !dialog.current) return;
      const f = dialog.current.querySelectorAll<HTMLElement>("a[href], button");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div
      className={`agents-modal${closing ? " is-closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Agent dossier"
        tabIndex={-1}
        className="agents-modal-window"
      >
        <AgentsTerminal
          closeControl={
            <button type="button" className="close" aria-label="Close" onClick={close}>
              <span aria-hidden="true">×</span>
            </button>
          }
        />
      </div>
    </div>,
    document.body,
  );
}
