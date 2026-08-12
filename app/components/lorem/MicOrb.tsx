"use client";

import { useEffect, useRef } from "react";

export type MicOrbState = "speaking" | "thinking" | "muted" | "listening" | "blocked";

export interface MicOrbProps {
  /**
   * Which channel state the orb shows:
   * - `speaking` — dark orb, the five bars pulse (Lorem has the floor)
   * - `thinking` — a single lit bar travels the row, left to right (working)
   * - `listening` — dark orb with the expanding accent ring (your mic is live)
   * - `muted` — grey orb, bars flattened (voice paused)
   * - `blocked` — grey orb, struck-through mic glyph (no mic permission)
   * Default `speaking`.
   */
  state?: MicOrbState;
  /** Accessible label for the button. Default derived from state. */
  "aria-label"?: string;
  onClick?: () => void;
  /**
   * Render as pure decoration: no button role, not focusable, aria-hidden.
   * Used when the orb sits inside another interactive element (e.g. the Lorem banner link).
   */
  decorative?: boolean;
  /**
   * Live mic amplitude, 0–1, from `useSpeech().level`. When supplied the bars
   * track the visitor's actual voice instead of the idle sine drive — the orb
   * stops being an animation and becomes a meter. Omit for decorative use.
   */
  level?: number;
}

const LABELS: Record<MicOrbState, string> = {
  // Labels must describe what a click DOES: speaking → stops Lorem talking,
  // listening → sends what was heard, muted → starts a capture.
  speaking: "Stop talking",
  thinking: "Thinking…",
  listening: "Listening — tap to send",
  muted: "Tap to talk",
  blocked: "Microphone blocked",
};
// per-bar amplitude multiplier, verbatim from the portfolio gain loop
const MUL = [0.45, 0.75, 1, 0.75, 0.45];

/**
 * MicOrb — the 62px voice control that lives in the dock. The five bars are the
 * user's mic channel; they animate while `speaking`/`listening` and flatten when
 * `muted`. `blocked` swaps to a struck-through mic glyph.
 */
export function MicOrb({
  state = "speaking",
  onClick,
  decorative = false,
  level,
  ...rest
}: MicOrbProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const label = rest["aria-label"] ?? LABELS[state];
  // The rAF loop is built once per `state`; the level arrives every frame. A ref
  // is the only way the loop sees the current value without being torn down.
  const levelRef = useRef<number | undefined>(level);
  levelRef.current = level;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bars = Array.from(el.querySelectorAll<HTMLElement>("i"));
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const active = state === "speaking" || state === "listening" || state === "thinking";

    if (reduce || !active) {
      // still bars; muted flattens them via CSS, active-but-reduced keeps a resting shape
      if (!reduce)
        bars.forEach((b) => {
          b.style.height = "";
          b.style.opacity = "";
        });
      else [9, 13, 16, 13, 9].forEach((h, i) => bars[i] && (bars[i].style.height = h + "px"));
      return;
    }

    let raf = 0;
    let barGain = 0;
    const loop = () => {
      const t = performance.now() / 1000;
      if (state === "thinking") {
        // A crest that travels the row rather than every bar pulsing together.
        // Speaking is "I'm talking"; this has to read as "I'm working" — same
        // five bars, unmistakably different motion.
        const head = (t * 2.4) % (bars.length + 1.4);
        bars.forEach((b, i) => {
          const d = Math.abs(i - head);
          const lit = Math.max(0, 1 - d * 0.75);
          b.style.height = Math.round(6 + lit * 20) + "px";
          b.style.opacity = String(0.35 + lit * 0.65);
        });
        raf = requestAnimationFrame(loop);
        return;
      }
      // Real mic amplitude when we have it; otherwise a gentle idle drive so the
      // bars still read as alive (Lorem speaking, or a decorative orb).
      const live = levelRef.current;
      const bt = live != null ? Math.min(1, live) : 0.28 + 0.12 * Math.sin(t * 1.6);
      barGain += (bt - barGain) * (bt > barGain ? 0.5 : 0.12);
      bars.forEach((b, i) => {
        b.style.opacity = "";
        const j = 0.85 + 0.3 * Math.sin(t * 13 + i * 2.1);
        b.style.height = Math.round(6 + barGain * 26 * MUL[i] * j) + "px";
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const semanticProps = decorative
    ? ({ "aria-hidden": true } as const)
    : {
        role: "button" as const,
        tabIndex: 0,
        "aria-label": label,
        // No aria-pressed: this is a four-state control, not a toggle — the
        // attribute only had meaning for one of the four and misled for the rest.
        onClick,
        // Enter must activate a role="button". Space is deliberately left to the
        // page's global push-to-talk handler so holding it anywhere behaves the same.
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onClick?.();
          }
        },
      };

  return (
    <div ref={ref} className={`lorem-micorb ${state}`} {...semanticProps}>
      <i />
      <i />
      <i />
      <i />
      <i />
      <svg className="micoff" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <rect x="9" y="3.5" width="6" height="10" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0" />
        <path d="M12 17v3M9.5 20h5" />
        <path d="M4.5 4.5l15 15" />
      </svg>
    </div>
  );
}
