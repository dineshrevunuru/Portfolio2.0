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

export interface LoremBannerProps {
  /**
   * Makes the orb its own control. The card stays a link to /lorem (a
   * stretched cover, since a <button> inside an <a> is invalid HTML); the orb
   * lifts above the cover and fires this instead — the black-hole entrance.
   * Omitted, the orb is decorative and the whole card is one click target,
   * exactly the old behavior.
   */
  onOrbClick?: () => void;
}

/**
 * LoremBanner — the "Meet my best friend LOREM!" pill. A card-wide link to
 * /lorem (as a stretched .loremv-cover) with a decorative Aurora wave field
 * behind it, the MicOrb, and a subtitle that types through the prompt lines.
 */
export default function LoremBanner({ onOrbClick }: LoremBannerProps) {
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
    <div className="loremv">
      <Link
        className="loremv-cover"
        href="/lorem"
        aria-label="Ask Lorem, a voice-first way to explore Dinesh's work"
      />
      <span className="loremv-wave">
        <Aurora energy={0.45} grain={false} />
      </span>
      <span className="loremv-mic" data-bh-banner-orb>
        {onOrbClick ? (
          <MicOrb
            state="listening"
            onClick={onOrbClick}
            aria-label="Ask Lorem — the page folds into the orb"
          />
        ) : (
          <MicOrb state="listening" decorative />
        )}
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
    </div>
  );
}
