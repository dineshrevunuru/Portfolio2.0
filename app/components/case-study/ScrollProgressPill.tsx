"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

/**
 * Turns the case-study header into a floating pill as the reader scrolls, and
 * draws the page's scroll progress as that pill's outline.
 *
 * The important structural choice: this does NOT render a second nav. It takes
 * the page's real `nav.top`, makes it sticky, toggles a class on it, and
 * portals only the progress ring inside it. An earlier version floated a
 * separate pill pinned to the header's coordinates — which meant permanently
 * re-deriving those coordinates, kept two copies of the same two links in the
 * DOM, and still landed 30px out. One element that changes shape has none of
 * those failure modes: the links are the same nodes throughout, so there is
 * nothing to keep in sync and nothing to hide from assistive tech.
 *
 * Two details worth keeping:
 *
 * 1. The ring is a <rect rx=h/2> with pathLength="1". Normalising the path to 1
 *    makes progress `stroke-dashoffset: 1 - p` at ANY size — which matters here
 *    because the pill's width is literally animating.
 *
 * 2. Scroll writes go straight to the DOM inside rAF, never through state. A
 *    setState per scroll event on a 43,000px page drops frames. Only the
 *    collapsed/expanded flip is state, and only when it actually changes.
 *
 * Renders nothing outside a case study: it keys on the `cs-theme-*` wrapper the
 * case-study CSS already uses, so all four case studies pick it up without any
 * page mounting it.
 */
export default function ScrollProgressPill() {
  const [nav, setNav] = useState<HTMLElement | null>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const trackRef = useRef<SVGRectElement>(null);
  /** Live morph progress, shared with the drag effect (0 = header, 1 = pill). */
  const mRef = useRef(0);
  /** Which dock the pill rests in: 0 left, 1 centre, 2 right. */
  const dockRef = useRef(1);

  // Re-detect on every route, not just on mount: this component lives in the
  // root layout, which survives client-side navigation. Keyed only to mount,
  // the effect ran against the HOME page's DOM when a visitor arrived at a
  // case study through a link, found no cs-theme-* wrapper, and slept until a
  // hard reload. usePathname makes each navigation a fresh detection pass —
  // and each page renders its own nav.top, so the adopted element must be
  // re-queried anyway.
  const pathname = usePathname();

  // Case study? Then adopt its nav and inherit its accent for the ring.
  useEffect(() => {
    const main = document.querySelector('[class*="cs-theme-"]');
    if (!main) {
      setNav(null);
      return;
    }
    const el = document.querySelector<HTMLElement>("nav.top");
    if (!el) return;
    const accent =
      getComputedStyle(main).getPropertyValue("--cs-brand-green").trim() ||
      getComputedStyle(main).getPropertyValue("--cs-brand-dark").trim();
    if (accent) el.style.setProperty("--pill-accent", accent);
    el.classList.add("cs-nav-morph");
    setNav(el);
    return () => {
      el.classList.remove("cs-nav-morph");
      el.style.removeProperty("--pill-accent");
      el.style.removeProperty("--m");
    };
  }, [pathname]);

  useEffect(() => {
    if (!nav) return;
    let frame = 0;

    /**
     * The morph is scroll-DRIVEN, not scroll-triggered. A single progress
     * number `--m` (0 = full header, 1 = pill) is written to the nav, and the
     * CSS derives every visual — width, padding, wordmark size, background,
     * shadow, ring opacity — from that one value with calc(). An earlier
     * version toggled a class and let `transition` tween it; that reads as the
     * pill "appearing" because the browser animates between two states on its
     * own clock, disconnected from the reader's hand. Deriving from scroll
     * means the logo and links visibly travel inward AS you scroll, reverse
     * mid-gesture if you do, and never play a canned animation.
     *
     * MORPH_SPAN is the scroll distance over which the whole morph completes.
     * Wheel ticks jump ~100px at a time, so raw mapping would stutter; the
     * lerp below (`m` chasing `target`) turns each jump into a short glide.
     */
    const MORPH_SPAN = 320;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let m = -1; // force the first write
    let target = 0;

    const tick = () => {
      frame = 0;

      // Ring progress tracks the page exactly — never lerped, it is a readout.
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (rectRef.current) rectRef.current.style.strokeDashoffset = String(1 - p);

      target = Math.min(1, Math.max(0, window.scrollY / MORPH_SPAN));
      const next = reduced ? target : m < 0 ? target : m + (target - m) * 0.16;
      m = Math.abs(target - next) < 0.001 ? target : next;
      nav.style.setProperty("--m", m.toFixed(4));
      mRef.current = m;
      // Dragging only makes sense once it is actually a pill.
      nav.classList.toggle("is-draggable", m > 0.9);

      // Keep gliding until the lerp settles, even with no further scroll events.
      if (m !== target) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // The ring tracks the nav's live box — which changes on every frame of the
    // scroll-driven morph, so this observer is doing real work, not just
    // handling window resizes.
    const sizeRing = () => {
      const { width, height } = nav.getBoundingClientRect();
      const sw = 2;
      for (const r of [rectRef.current, trackRef.current]) {
        if (!r) continue;
        r.setAttribute("x", String(sw / 2));
        r.setAttribute("y", String(sw / 2));
        r.setAttribute("width", String(Math.max(0, width - sw)));
        r.setAttribute("height", String(Math.max(0, height - sw)));
        r.setAttribute("rx", String(Math.max(0, (height - sw) / 2)));
      }
    };

    const ro = new ResizeObserver(sizeRing);
    ro.observe(nav);
    sizeRing();
    tick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [nav]);

  /**
   * Drag the pill to a dock.
   *
   * The pill floats over the page, so it will sometimes land on a heading.
   * Rather than guess where it should live, the reader moves it: grab it and
   * throw it to the left rail, the centre, or the right rail.
   *
   * Two details that make it feel like an object rather than a slider:
   *
   * 1. Release is decided by PROJECTION, not position. Where the pill would
   *    coast to in the next ~140ms (offset + velocity) picks the dock, so a
   *    small flick commits just as well as a long drag. Dragging halfway and
   *    stopping dead still returns to the nearest dock.
   *
   * 2. The dock offset is multiplied by `--m` in CSS, so as the reader scrolls
   *    back up and the pill expands into the full header, the dock unwinds to
   *    centre on its own. No state to reconcile between the two behaviours.
   */
  useEffect(() => {
    if (!nav) return;

    const GUTTER = 24; // rail inset at either edge
    const PROJECT_MS = 0.14; // how far ahead velocity is extrapolated
    const DRAG_SLOP = 4; // px before a press becomes a drag (so clicks survive)

    /** Resting x-offsets from the centred position, in dock order. */
    const docks = () => {
      const vw = document.documentElement.clientWidth;
      const w = nav.getBoundingClientRect().width;
      const centredLeft = (vw - w) / 2;
      return [
        GUTTER - centredLeft, // left rail
        0, // centre
        vw - w - GUTTER - centredLeft, // right rail
      ];
    };

    const settle = (dock: number) => {
      dockRef.current = dock;
      nav.classList.add("is-snapping");
      nav.style.setProperty("--dock-dx", `${docks()[dock]}px`);
      nav.style.setProperty("--drag-dx", "0px");
    };

    let dragging = false;
    let moved = false;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px per ms

    const onDown = (e: PointerEvent) => {
      if (mRef.current <= 0.9) return;
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = lastX = e.clientX;
      lastT = e.timeStamp;
      velocity = 0;
      // Closed hand on press, not on movement: the grab should register the
      // moment the pill is held. is-dragging stays separate because it gates
      // click suppression, which must not fire on a plain click.
      nav.classList.add("is-pressed");
      nav.classList.remove("is-snapping");
      // Pointer capture waits for the slop threshold (see onMove). Capturing
      // here retargets the whole event stream — including the synthesized
      // click — to the nav, so a plain click never reached the Work/Resume
      // links underneath.
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > DRAG_SLOP) {
        moved = true;
        nav.classList.add("is-dragging");
        // Capture only now that this is definitely a drag, so the pointer can
        // leave the pill without dropping it. A plain click never gets here
        // and reaches the links untouched.
        nav.setPointerCapture(e.pointerId);
      }
      if (!moved) return;
      const dt = e.timeStamp - lastT;
      if (dt > 0) velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = e.timeStamp;
      nav.style.setProperty("--drag-dx", `${dx}px`);
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      nav.classList.remove("is-dragging", "is-pressed");
      if (nav.hasPointerCapture(e.pointerId)) nav.releasePointerCapture(e.pointerId);
      if (!moved) return;

      const offsets = docks();
      const current = offsets[dockRef.current] + (e.clientX - startX);
      const projected = current + velocity * PROJECT_MS * 1000;
      let best = 0;
      for (let i = 1; i < offsets.length; i++) {
        if (Math.abs(offsets[i] - projected) < Math.abs(offsets[best] - projected)) best = i;
      }
      settle(best);
      // The drag's own synthesized click (fired synchronously after pointerup)
      // consumes `moved` in onClick. If the browser skips that click — pointer
      // left the document, touch cancel — the flag would linger and swallow
      // the NEXT genuine click on a link. Clear it once the microtask queue
      // drains, after any same-gesture click has already been suppressed.
      setTimeout(() => {
        moved = false;
      }, 0);
    };

    // A drag that ends on a link must not navigate.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    const onResize = () => settle(dockRef.current);

    settle(1);
    nav.addEventListener("pointerdown", onDown);
    nav.addEventListener("pointermove", onMove);
    nav.addEventListener("pointerup", onUp);
    nav.addEventListener("pointercancel", onUp);
    nav.addEventListener("click", onClick, true);
    window.addEventListener("resize", onResize);
    return () => {
      nav.removeEventListener("pointerdown", onDown);
      nav.removeEventListener("pointermove", onMove);
      nav.removeEventListener("pointerup", onUp);
      nav.removeEventListener("pointercancel", onUp);
      nav.removeEventListener("click", onClick, true);
      window.removeEventListener("resize", onResize);
      nav.classList.remove(
        "is-dragging",
        "is-pressed",
        "is-snapping",
        "is-draggable"
      );
      nav.style.removeProperty("--dock-dx");
      nav.style.removeProperty("--drag-dx");
    };
  }, [nav]);

  if (!nav) return null;

  return createPortal(
    <svg className="cs-progress-ring" aria-hidden="true" focusable="false">
      <rect ref={trackRef} className="cs-progress-track" pathLength={1} />
      <rect ref={rectRef} className="cs-progress-fill" pathLength={1} />
    </svg>,
    nav
  );
}
