"use client";

import { useEffect, useRef } from "react";

export interface AuroraProps {
  /**
   * Wave intensity, 0–1. In the live portfolio this is driven by Lorem's real
   * voice waveform; here it is a static level. Resting ≈ 0.06, thinking ≈ 0.3,
   * speaking ≈ 0.6–1. Default 0.42.
   */
  energy?: number;
  /** Overlay the fractal-noise grain (matches the portfolio's #agrain). Default true. */
  grain?: boolean;
  /**
   * Per-layer wave colors as "r,g,b" strings, front to back. Omitted, the
   * field keeps its accent blues; the space theme passes near-whites. Read at
   * draw time through a ref — same reason as `energy` — so a theme flip never
   * rebuilds the canvas pipeline.
   */
  palette?: [string, string, string];
  className?: string;
  style?: React.CSSProperties;
}

// The three stacked wave layers — verbatim from the portfolio's WAVES config.
/**
 * How much faster the field travels at full voice. The original had NO speed
 * coupling — amplitude alone carried "Lorem is talking", and that read well. A
 * first pass at 3.2 turned speaking into a 5x scroll, which read as frantic.
 * 0.35 keeps the calm cadence and lets speech lift it just perceptibly.
 * Amplitude still does most of the work, as it always did.
 */
const SPEAK_LIFT = 0.35;

// `drift` is the slow vertical wander of each layer's baseline — the one thing
// genuinely missing before, when the baselines were pinned and the field only
// swelled and shrank in place. Kept subtle: it should stop the waves looking
// welded to a line, not become motion in its own right.
const WAVES = [
  { amp: 38, k: 1.35, sp: 0.055, y: 0.52, rgb: "168,205,255", a: 0.42, drift: 0.11, dy: 0.022 },
  { amp: 52, k: 0.95, sp: -0.038, y: 0.66, rgb: "94,168,255", a: 0.38, drift: 0.08, dy: 0.028 },
  { amp: 30, k: 1.9, sp: 0.026, y: 0.82, rgb: "28,124,245", a: 0.34, drift: 0.15, dy: 0.016 },
];

/**
 * Aurora — Lorem's voice made visible: three stacked, blurred sine-wave layers in
 * the accent blues, pinned to the bottom of its container. Decorative background;
 * fills its nearest positioned ancestor.
 */
export function Aurora({ energy = 0.42, grain = true, palette, className, style }: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // `energy` is re-set every animation frame while the mic level drives it.
  // As an effect dependency that tore down and rebuilt the entire canvas
  // pipeline ~60×/s — cancel rAF, reallocate the bitmap (clearing it), re-probe
  // ctx.filter, new offscreen buffer, and reset the eased amplitude to 0. The
  // draw loop reads the live value through a ref instead; the effect runs once.
  const energyRef = useRef(energy);
  energyRef.current = energy;
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const size = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    size();

    // Chrome path: full-res + real ctx.filter blur (the look Dinesh approved).
    let hasFilter = false;
    try {
      ctx.filter = "blur(2px)";
      hasFilter = ctx.filter === "blur(2px)";
      ctx.filter = "none";
    } catch {
      hasFilter = false;
    }
    const off = document.createElement("canvas");
    const octx = off.getContext("2d")!;

    let raf = 0;
    let e = 0;
    // Phase is INTEGRATED, never computed as elapsed-time x current-speed.
    // That earlier form modulated the whole history: changing the speed also
    // retroactively changed where the wave "had been", so every flicker in the
    // mic level teleported the crest — and the jump grew with page age, since
    // it scaled with t. Accumulating dt x speed makes a speed change affect
    // only what happens next, which is what a wave actually does.
    const phase = WAVES.map(() => 0);
    let last = performance.now() / 1000;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const now = performance.now() / 1000;
      // Clamp dt so a backgrounded tab doesn't return and lurch forward.
      const dt = reduce ? 0 : Math.min(0.05, Math.max(0, now - last));
      last = now;
      const t = reduce ? 1.7 : now;
      // Ease toward the configured energy — asymmetrically, like the meter
      // that feeds it. Rise fast enough to land on a syllable (0.22), fall
      // slowly enough to stay a background field rather than a meter (0.07).
      // The old symmetric 0.06 was the third low-pass in a chain that already
      // had two, and the sum was a field that ignored the voice entirely.
      {
        const target = reduce ? 0.42 : 0.35 + energyRef.current * 1.1;
        e = reduce ? 0.42 : e + (target - e) * (target > e ? 0.22 : 0.07);
      }
      if (hasFilter) {
        ctx.clearRect(0, 0, w, h);
        ctx.filter = "blur(26px)";
        WAVES.forEach((L, i) => {
          // Travel speeds up with energy, so the field surges while Lorem talks
          // instead of pulsing at a fixed cadence; the baseline wanders so the
          // layers cross and separate rather than sitting on their own line.
          phase[i] += dt * L.sp * (1 + e * SPEAK_LIFT);
          const flow = phase[i];
          const yb = h * (L.y + Math.sin(t * L.drift + i * 1.7) * L.dy);
          const amp = L.amp * (0.55 + e);
          ctx.beginPath();
          ctx.moveTo(-40, h + 40);
          for (let x = -40; x <= w + 40; x += 22) {
            const y =
              yb +
              Math.sin((x / w) * 6.28 * L.k + flow * 6.28 + i * 2.1) * amp +
              Math.sin((x / w) * 6.28 * L.k * 2.7 - flow * 4.2 + i) * amp * 0.35;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w + 40, h + 40);
          ctx.closePath();
          const rgb = paletteRef.current?.[i] ?? L.rgb;
          const g = ctx.createLinearGradient(0, yb - amp, 0, h);
          g.addColorStop(0, `rgba(${rgb},0)`);
          g.addColorStop(0.45, `rgba(${rgb},${L.a * e})`);
          g.addColorStop(1, `rgba(${rgb},${L.a * 1.25 * e})`);
          ctx.fillStyle = g;
          ctx.fill();
        });
        ctx.filter = "none";
      } else if (w && h) {
        // Fallback for engines without canvas filters: offscreen bilinear upscale.
        const s = 6;
        const w2 = Math.max(4, Math.round(w / s));
        const h2 = Math.max(4, Math.round(h / s));
        if (off.width !== w2 || off.height !== h2) {
          off.width = w2;
          off.height = h2;
        }
        octx.clearRect(0, 0, w2, h2);
        WAVES.forEach((L, i) => {
          phase[i] += dt * L.sp * (1 + e * SPEAK_LIFT);
          const flow = phase[i];
          const yb = h2 * (L.y + Math.sin(t * L.drift + i * 1.7) * L.dy);
          const amp = (L.amp * (0.55 + e)) / s;
          octx.beginPath();
          octx.moveTo(-8, h2 + 8);
          for (let x = -8; x <= w2 + 8; x += 3) {
            const y =
              yb +
              Math.sin((x / w2) * 6.28 * L.k + flow * 6.28 + i * 2.1) * amp +
              Math.sin((x / w2) * 6.28 * L.k * 2.7 - flow * 4.2 + i) * amp * 0.35;
            octx.lineTo(x, y);
          }
          octx.lineTo(w2 + 8, h2 + 8);
          octx.closePath();
          const rgb = paletteRef.current?.[i] ?? L.rgb;
          const g = octx.createLinearGradient(0, yb - amp, 0, h2);
          g.addColorStop(0, `rgba(${rgb},0)`);
          g.addColorStop(0.45, `rgba(${rgb},${L.a * e})`);
          g.addColorStop(1, `rgba(${rgb},${L.a * 1.25 * e})`);
          octx.fillStyle = g;
          octx.fill();
        });
        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(off, 0, 0, w, h);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      size();
      if (reduce) draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- energy is read via energyRef
  }, []);

  return (
    <div className={className ? `lorem-aurora ${className}` : "lorem-aurora"} style={style} aria-hidden="true">
      <canvas ref={canvasRef} />
      {grain && <div className="lorem-grain" />}
    </div>
  );
}
