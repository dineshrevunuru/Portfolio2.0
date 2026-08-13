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
export default function SeqReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // auto-stagger [data-seq-group] direct children
    document.querySelectorAll<HTMLElement>("[data-seq-group]").forEach((g) => {
      const base = parseInt(g.getAttribute("data-seq-delay") || "0", 10);
      Array.from(g.children).forEach((child, i) => {
        const el = child as HTMLElement;
        el.classList.add("seq");
        if (!el.style.getPropertyValue("--sd")) {
          el.style.setProperty("--sd", base + i * 90 + "ms");
        }
      });
    });

    const seqEls = Array.from(document.querySelectorAll<HTMLElement>(".seq"));

    if (reduce) {
      seqEls.forEach((el) => el.classList.add("in"));
      return;
    }

    // reveal everything already near the viewport on first paint
    const above = seqEls.filter(
      (el) => el.getBoundingClientRect().top < window.innerHeight * 0.9,
    );
    const up = () => above.forEach((el) => el.classList.add("in"));
    requestAnimationFrame(() => requestAnimationFrame(up));
    const t0 = setTimeout(up, 60);

    const pend = new Set(
      document.querySelectorAll<HTMLElement>(".seq:not(.in)"),
    );
    above.forEach((el) => pend.delete(el));

    const reveal = (el: HTMLElement, d: number) => {
      el.style.setProperty("--sd", d + "ms");
      el.classList.add("in");
      pend.delete(el);
    };

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries
                .filter((e) => e.isIntersecting)
                .forEach((e, i) => {
                  reveal(e.target as HTMLElement, i * 140);
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
      let i = 0;
      Array.from(pend).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          if (io) io.unobserve(el);
          reveal(el, i++ * 140);
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
    // failsafe: if a dead rAF/IO webview never fires, reveal all after 3s
    const t2 = setTimeout(() => {
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
