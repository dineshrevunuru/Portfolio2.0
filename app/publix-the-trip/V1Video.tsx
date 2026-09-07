"use client";

import { useEffect, useRef } from "react";
import styles from "./review-styles.module.css";

export default function RecoveryVideo({ kind = "recovery" }: { kind?: "attention" | "control" | "recovery" }) {
  const video = useRef<HTMLVideoElement>(null);
  const labels = { attention: "Collect items and advance to the next stop", control: "Select a map stop and change the plan", recovery: "Defer an item, then undo to restore it" };
  const posters = { attention: "trip", control: "sheet-map", recovery: "miss" };
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && !preference.matches) element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.5 });
    observer.observe(element);
    preference.addEventListener("change", sync);
    return () => { observer.disconnect(); preference.removeEventListener("change", sync); };
  }, []);
  return <figure className={styles.recoveryVideo}>
    <video ref={video} width={390} height={844} muted loop playsInline controls preload="none" poster={`/images/publix-the-trip-v3/screens/state-${posters[kind]}.png`} aria-label={`Prototype recording: ${labels[kind]}`}>
      <source src={`/images/publix-the-trip-v3/${kind}-loop.mp4`} type="video/mp4" />
    </video>
  </figure>;
}
