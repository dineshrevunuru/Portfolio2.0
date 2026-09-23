"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./screenshot-strip.module.css";

export type Shot = { src: string; width: number; height: number; alt: string };

/**
 * A row of product screenshots that scrolls sideways.
 *
 * Native scrolling does the work: swipe on a phone, two-finger scroll on a
 * trackpad, arrow keys once the row has focus. The two buttons are for the
 * reader with a plain mouse wheel, who otherwise has no way to move a
 * horizontal row. They step one screen at a time and disable at each end.
 * The next screenshot always peeks in from the edge, so the row reads as
 * scrollable before anyone touches it.
 *
 * The row starts on the text column's left edge and runs to the edge of the
 * window, so the screens read as part of the paragraph above them and the
 * overflow reads as "more this way", not as a box that is too wide.
 */
export default function ScreenshotStrip({
  shots,
  label,
  variant = "phone",
  caption,
}: {
  shots: Shot[];
  /** Names the row for screen readers, e.g. "Booking app screens". */
  label: string;
  variant?: "phone" | "desktop";
  /** One quiet line under the row, e.g. what has been blurred. */
  caption?: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false, overflow: false });

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
        overflow: el.scrollWidth > el.clientWidth + 2,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = row.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (item.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <div
        ref={row}
        className={`${styles.row} ${variant === "desktop" ? styles.desktop : styles.phone}`}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {shots.map((s) => (
          <figure key={s.src} className={styles.shot}>
            <Image
              src={s.src}
              width={s.width}
              height={s.height}
              alt={s.alt}
              sizes={variant === "desktop" ? "(min-width: 768px) 640px, 82vw" : "240px"}
            />
          </figure>
        ))}
      </div>
      {(caption || edge.overflow) && (
        <div className={`cs-container ${styles.controls}`}>
          {caption && <p className={styles.caption}>{caption}</p>}
          {edge.overflow && (
            <div className={styles.btns}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => step(-1)}
                disabled={edge.start}
                aria-label="Previous screenshot"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() => step(1)}
                disabled={edge.end}
                aria-label="Next screenshot"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
