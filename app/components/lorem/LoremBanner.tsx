"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Aurora } from "./Aurora";
import { MicOrb } from "./MicOrb";

// Cycling typewriter prompts — verbatim from the design's Landing Card script.
const LINES = [
  "Lorem helps you to learn more about me in more advanced way!",
  "Ask about my Gen A.I work at Neudesic…",
  "What’s my design process?",
  "Why should you hire Dinesh?",
];

/**
 * LoremBanner — the "Meet my best friend LOREM!" pill. A single link (the whole card)
 * with a decorative Aurora wave field behind it, a decorative MicOrb, and a
 * subtitle that types through the prompt lines. Lorem Home is a coming-soon
 * prototype, so the link is an inert placeholder for now.
 */
export default function LoremBanner() {
  const typeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = typeRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let li = 0;
    let cancelled = false;
    let typeTimer: ReturnType<typeof setInterval> | undefined;
    let cycleTimer: ReturnType<typeof setTimeout> | undefined;

    const cycle = () => {
      li = (li + 1) % LINES.length;
      const s = LINES[li];
      let i = 0;
      el.textContent = "";
      typeTimer = setInterval(() => {
        if (cancelled) return;
        el.textContent = s.slice(0, ++i);
        if (i >= s.length) {
          clearInterval(typeTimer);
          cycleTimer = setTimeout(cycle, 3800);
        }
      }, 28);
    };
    cycleTimer = setTimeout(cycle, 3800);

    return () => {
      cancelled = true;
      clearInterval(typeTimer);
      clearTimeout(cycleTimer);
    };
  }, []);

  return (
    <Link
      className="loremv"
      href="/lorem"
      aria-label="Ask Lorem — a voice-first way to explore Dinesh's work"
    >
      <span className="loremv-wave">
        <Aurora energy={0.45} grain={false} />
      </span>
      <span className="loremv-mic">
        <MicOrb state="listening" decorative />
      </span>
      <span className="loremv-txt">
        <h3>
          Meet my best friend <em>LOREM!</em>
        </h3>
        <p>
          <span ref={typeRef}>{LINES[0]}</span>
        </p>
      </span>
      <span className="loremv-go">
        Ask Lorem <span aria-hidden="true">&rarr;</span>
      </span>
    </Link>
  );
}
