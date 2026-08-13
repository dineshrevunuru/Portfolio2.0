"use client";

import { useEffect, useRef } from "react";

/**
 * BubbleStrip — the post-footer bubble-wrap easter egg, ported from the design
 * project's bubble-strip.js. Liquid-glass orbs pop on pointer drag (with a
 * WebAudio pop + haptic buzz) and the sheet refills once cleared. Pop detection
 * is pointer-driven at the sheet level (via elementFromPoint), so the orbs are
 * non-focusable decoration and the strip is hidden from assistive tech.
 */
export default function BubbleStrip() {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    type WinAudio = typeof window & { webkitAudioContext?: typeof AudioContext };
    let AC: AudioContext | null = null;
    const actx = () => {
      if (!AC) {
        try {
          const Ctor = window.AudioContext || (window as WinAudio).webkitAudioContext;
          if (Ctor) AC = new Ctor();
        } catch {
          /* no audio available */
        }
      }
      if (AC && AC.state === "suspended") AC.resume();
      return AC;
    };

    const VOICES: [number, number][] = [
      [2600, 0.9],
      [2100, 1],
      [3100, 0.8],
      [1800, 1.1],
      [2400, 0.95],
      [2850, 0.85],
      [1950, 1.05],
    ];
    const popSfx = (vi: number) => {
      const a = actx();
      if (!a) return;
      const t = a.currentTime;
      const v = VOICES[vi % 7];
      const n = a.createBufferSource();
      const len = a.sampleRate * 0.05;
      const buf = a.createBuffer(1, len, a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      n.buffer = buf;
      const bp = a.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = v[0];
      bp.Q.value = 0.9;
      const ng = a.createGain();
      ng.gain.setValueAtTime(0.5 * v[1], t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      n.connect(bp).connect(ng).connect(a.destination);
      n.start(t);
      const o = a.createOscillator();
      const og = a.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(300 * v[1], t);
      o.frequency.exponentialRampToValueAtTime(110, t + 0.045);
      og.gain.setValueAtTime(0.14, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
      o.connect(og).connect(a.destination);
      o.start(t);
      o.stop(t + 0.06);
    };

    let popped = 0;
    let total = 0;
    let refillTimer: ReturnType<typeof setTimeout> | undefined;

    const build = () => {
      sheet.innerHTML = "";
      popped = 0;
      const W = sheet.clientWidth;
      const rows = 6;
      let cols = Math.max(8, Math.round(W / 78));
      const s = Math.floor(W / (cols + (cols - 1) * 0.24));
      const g = Math.round(s * 0.24);
      cols = Math.max(1, Math.floor((W + g) / (s + g)));
      sheet.style.setProperty("--s", s + "px");
      sheet.style.setProperty("--g", g + "px");
      total = 0;
      for (let r = 0; r < rows; r++) {
        const off = r % 2 === 1;
        const row = document.createElement("div");
        row.className = "rw" + (off ? " off" : "");
        const n = off ? cols - 1 : cols;
        for (let i = 0; i < n; i++) {
          const b = document.createElement("span");
          b.className = "ow";
          b.style.setProperty("--r", (Math.random() * 10 - 5).toFixed(1) + "deg");
          b.style.setProperty("--w1", ((Math.random() * 360) | 0) + "deg");
          b.style.setProperty("--w2", (Math.random() * 70 - 35).toFixed(0) + "deg");
          b.style.setProperty("--gr", (Math.random() * 44 - 22).toFixed(0) + "deg");
          b.innerHTML =
            '<span class="orb"><span class="inner-rim"></span><span class="glints"><span class="glint glint-a"></span><span class="glint glint-b"></span><span class="glint glint-c"></span></span></span>';
          row.appendChild(b);
          total++;
        }
        sheet.appendChild(row);
      }
    };

    const burst = (el: Element | null) => {
      const b = el?.closest?.(".ow");
      if (!b || !sheet.contains(b) || b.classList.contains("popped")) return;
      b.classList.add("popped");
      popped++;
      popSfx((Math.random() * 7) | 0);
      navigator.vibrate?.(8);
      if (popped === total) refillTimer = setTimeout(build, 1400);
    };

    let dragging = false;
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      actx();
      burst(document.elementFromPoint(e.clientX, e.clientY));
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) burst(document.elementFromPoint(e.clientX, e.clientY));
    };
    const stop = () => {
      dragging = false;
    };
    const onCtx = (e: Event) => e.preventDefault();
    const stopEvents = ["pointerup", "pointercancel", "pointerleave"];

    sheet.addEventListener("pointerdown", onDown);
    sheet.addEventListener("pointermove", onMove);
    stopEvents.forEach((ev) => sheet.addEventListener(ev, stop));
    sheet.addEventListener("contextmenu", onCtx);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (popped === 0) build();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    build();

    return () => {
      sheet.removeEventListener("pointerdown", onDown);
      sheet.removeEventListener("pointermove", onMove);
      stopEvents.forEach((ev) => sheet.removeEventListener(ev, stop));
      sheet.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      clearTimeout(refillTimer);
      AC?.close().catch(() => {});
    };
  }, []);

  return (
    <section className="bstrip bstrip--blue" aria-hidden="true">
      <div className="bs-sheet" ref={sheetRef} />
    </section>
  );
}
