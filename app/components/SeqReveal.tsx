"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * SeqReveal — the staggered entrance-reveal engine, ported from the design
 * project's motion.js. Elements marked `.seq` (optionally with a `--sd` delay)
 * fade up as they enter the viewport; wrapping a group in `[data-seq-group]`
 * auto-staggers its direct children. Reduced-motion reveals everything instantly.
 * Mounted once in the root layout; re-runs on client navigation via `usePathname`.
 */
/* Client-side history steps (Next's back/forward between routes) land here as
   popstate; full-page back/forward loads are flagged in layout.tsx instead. */
let viaHistory = false;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    viaHistory = true;
  });
}

export default function SeqReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // auto-stagger [data-seq-group] direct children
    const grouped = new WeakSet<HTMLElement>();
    document.querySelectorAll<HTMLElement>("[data-seq-group]").forEach((g) => {
      const base = parseInt(g.getAttribute("data-seq-delay") || "0", 10);
      Array.from(g.children).forEach((child, i) => {
        const el = child as HTMLElement;
        el.classList.add("seq");
        if (!el.style.getPropertyValue("--sd")) {
          el.style.setProperty("--sd", base + i * 90 + "ms");
          grouped.add(el);
        }
      });
    });

    const seqEls = Array.from(document.querySelectorAll<HTMLElement>(".seq"));

    // Returning, not arriving: show everything as it was, with no entrance.
    const root = document.documentElement;
    if (viaHistory || root.classList.contains("seq-restore")) {
      viaHistory = false;
      root.classList.add("seq-restore");
      seqEls.forEach((el) => el.classList.add("in"));
      // Keep transitions off until the revealed state has painted, so dropping
      // the flag cannot replay anything.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => root.classList.remove("seq-restore")),
      );
      return;
    }

    if (reduce) {
      seqEls.forEach((el) => el.classList.add("in"));
      return;
    }

    // reveal everything already near the viewport on first paint
    const above = seqEls.filter(
      (el) => el.getBoundingClientRect().top < window.innerHeight * 0.9,
    );
    // The first screen cascades in reading order, the way the home hero is
    // hand-timed (180 / 360 / 540ms). A page-set delay is kept exactly and
    // moves the cursor; anything untimed (or only group-timed) follows 120ms
    // behind the previous block, so a page never lands as one flat block.
    let cursor = -120;
    above.forEach((el) => {
      const own = parseInt(el.style.getPropertyValue("--sd") || "", 10);
      const authored = !Number.isNaN(own) && !grouped.has(el);
      cursor = authored ? own : cursor + 120;
      el.style.setProperty("--sd", cursor + "ms");
    });
    const up = () => above.forEach((el) => el.classList.add("in"));
    requestAnimationFrame(() => requestAnimationFrame(up));
    const t0 = setTimeout(up, 60);

    const pend = new Set(
      document.querySelectorAll<HTMLElement>(".seq:not(.in)"),
    );
    above.forEach((el) => pend.delete(el));

    // Elements that come into view together (the two cards in a grid row) can
    // arrive in separate observer callbacks, each starting its count at zero,
    // so they revealed at once. Collect them for one frame instead, then
    // stagger in document order.
    let io: IntersectionObserver | null = null;
    let batch: HTMLElement[] = [];
    let flushQueued = false;
    const flush = () => {
      flushQueued = false;
      batch
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        )
        .forEach((el, i) => {
          el.style.setProperty("--sd", i * 140 + "ms");
          el.classList.add("in");
        });
      batch = [];
    };
    const reveal = (el: HTMLElement) => {
      if (!pend.has(el)) return;
      pend.delete(el);
      batch.push(el);
      // Side-by-side siblings (text beside an image, two cards in a row) cross
      // into view at slightly different moments. Pull in any group sibling that
      // shares this element's row, so the row reveals together in reading order.
      if (el.parentElement?.hasAttribute("data-seq-group")) {
        const rowBottom = el.getBoundingClientRect().bottom;
        Array.from(el.parentElement.children).forEach((sib) => {
          const s = sib as HTMLElement;
          if (!pend.has(s) || s.getBoundingClientRect().top >= rowBottom) return;
          pend.delete(s);
          io?.unobserve(s);
          batch.push(s);
        });
      }
      if (!flushQueued) {
        flushQueued = true;
        requestAnimationFrame(flush);
      }
    };

    // The observer calls back once per element as soon as it starts watching,
    // so a single callback proves it works here.
    let ioAlive = false;
    io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              ioAlive = true;
              entries
                .filter((e) => e.isIntersecting)
                .forEach((e) => {
                  reveal(e.target as HTMLElement);
                  io?.unobserve(e.target);
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
          )
        : null;
    if (io) pend.forEach((el) => io.observe(el));

    let tick = false;
    const sweep = () => {
      tick = false;
      if (!pend.size) return;
      Array.from(pend).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          if (io) io.unobserve(el);
          reveal(el);
        }
      });
    };
    const onScroll = () => {
      if (!tick) {
        tick = true;
        setTimeout(sweep, 100);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const t1 = setTimeout(sweep, 300);
    // Failsafe for a webview where the observer never fires: reveal all after
    // 3s. Only then. Running it unconditionally revealed everything below the
    // fold before the reader scrolled to it, so nothing ever animated in.
    const t2 = setTimeout(() => {
      if (ioAlive && io) return;
      pend.forEach((el) => el.classList.add("in"));
      pend.clear();
    }, 3000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
