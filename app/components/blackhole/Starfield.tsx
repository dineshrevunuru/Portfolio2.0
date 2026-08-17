"use client";

import { useEffect, useRef } from "react";

/**
 * Starfield — the night behind the black hole. A single canvas of ~140
 * sine-twinkling points, density-scaled to the viewport, DPR-aware. Sits
 * inside .bh-space (fixed, z -1) and serves the whole session: the consume
 * animation flies the page over it, then Lorem's space theme keeps it as
 * the backdrop — one field, no crossfade seam.
 *
 * Same primitives as Aurora: one rAF loop, no state, torn down on unmount.
 * Reduced motion draws one static frame (moot today — the black-hole path
 * bails to a plain navigation under reduced motion — but the component
 * shouldn't rely on its caller for that). Pauses while the tab is hidden.
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let stars: { x: number; y: number; r: number; tw: number; ph: number; a: number }[] = [];

    const size = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      // ~140 stars at a 1280×800 viewport, scaling with area so phones
      // aren't crowded and ultrawides aren't sparse.
      const n = Math.round((canvas.clientWidth * canvas.clientHeight) / 7300);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (0.4 + Math.random() * 1.1) * dpr,
        tw: 0.5 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
        a: 0.25 + Math.random() * 0.55,
      }));
    };
    size();

    let raf = 0;
    const draw = () => {
      const t = performance.now() / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      for (const s of stars) {
        ctx.globalAlpha = reduce ? s.a : s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      size();
      if (reduce) draw();
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
