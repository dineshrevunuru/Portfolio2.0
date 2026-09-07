"use client";

import { useEffect, useRef } from "react";
import styles from "./publix-case-study.module.css";

type Kind = "attention" | "control" | "recovery";

const labels: Record<Kind, string> = {
  attention: "Collect items and advance to the next stop",
  control: "Select a map stop and change the plan",
  recovery: "Defer an item, then undo to restore it",
};
const posters: Record<Kind, string> = {
  attention: "trip",
  control: "sheet-map",
  recovery: "miss",
};

/** Prototype recording that plays only while on screen and never under
 *  prefers-reduced-motion — the poster is the still for those readers. */
export default function RecoveryVideo({ kind, caption, bare = false }: { kind: Kind; caption?: string; bare?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && !preference.matches) element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; sync(); },
      { threshold: 0.5 },
    );
    observer.observe(element);
    preference.addEventListener("change", sync);
    return () => { observer.disconnect(); preference.removeEventListener("change", sync); };
  }, []);
  return (
    <figure className={bare ? undefined : styles.screenStage} style={bare ? undefined : { display: "block" }}>
      <video
        ref={video}
        width={390}
        height={844}
        muted
        loop
        playsInline
        controls
        preload="none"
        poster={`/images/publix-the-trip-v3/screens/state-${posters[kind]}.png`}
        aria-label={`Prototype recording: ${labels[kind]}`}
      >
        <source src={`/images/publix-the-trip-v3/${kind}-loop.mp4`} type="video/mp4" />
      </video>
      {caption && <figcaption style={{ textAlign: "center" }}>{caption}</figcaption>}
    </figure>
  );
}
