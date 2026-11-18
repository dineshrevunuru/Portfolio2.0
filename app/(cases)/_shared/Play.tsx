"use client";

import { Children, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";

/* The moving objects of a case study built in the landing page's tile grammar (tiles.css; the
   pattern is the reference's "One library" section, t-portfolio-redo/research/mobbin-one-library).
   Each object moves the way its subject does, slowly, in place, for ever: a conversation is typed and
   answered, a component changes to another, a list passes. Everything stops off screen, in a hidden
   tab, with reduced motion, and when the page's one "Pause motion" switch is on. */

// One switch for all motion on the page.
let still = false;
const subs = new Set<() => void>();
function setStill(v: boolean) {
  still = v;
  document.documentElement.toggleAttribute("data-still", v);
  document.querySelectorAll("video").forEach((el) => { if (v) el.pause(); else if (el.dataset.held !== "1") el.play().catch(() => {}); });
  subs.forEach((f) => f());
}
const useStill = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => still, () => false);
const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function StillToggle() {
  const s = useStill(), [show, setShow] = useState(false);
  useEffect(() => { setShow(!calm()); return () => setStill(false); }, []);
  if (!show) return null;
  return (
    <button type="button" className="tl-still" onClick={() => setStill(!s)} aria-pressed={s}>
      <svg viewBox="0 0 16 16" aria-hidden="true">{s ? <path d="M5 3.5v9l7.5-4.5z" /> : <path d="M5 3.5v9M11 3.5v9" />}</svg>
      {s ? "Play motion" : "Pause motion"}
    </button>
  );
}

// A clock that runs only while the element is on screen and motion is on: `tick` every 100ms.
function useClock(ref: RefObject<HTMLElement | null>, tick: () => void) {
  const fn = useRef(tick);
  fn.current = tick;
  useEffect(() => {
    if (calm()) return;
    let on = false;
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; }, { threshold: 0.2 });
    io.observe(ref.current!);
    const id = window.setInterval(() => { if (on && !still && !document.hidden) fn.current(); }, 100);
    return () => { io.disconnect(); window.clearInterval(id); };
  }, [ref]);
}

// Which of `count` things is showing: it moves on every `every` ms, `late` ms after the others.
function useTurn(ref: RefObject<HTMLElement | null>, count: number, every: number, late: number) {
  const [at, setAt] = useState(0), clock = useRef(-late);
  useClock(ref, () => { clock.current += 100; if (clock.current >= every) { clock.current = 0; setAt((n) => (n + 1) % count); } });
  return at;
}

/* Things that take one place in turn: all are there, one shows. */
export function Swap({ every = 3200, late = 0, className = "", children }: { every?: number; late?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null), items = Children.toArray(children), at = useTurn(ref, items.length, every, late);
  return <div ref={ref} className={`sw ${className}`}>{items.map((c, k) => <div key={k} className={k === at ? "sw-i is-on" : "sw-i"} aria-hidden={k === at ? undefined : true}>{c}</div>)}</div>;
}

/* A conversation that is typed, answered, held, and begun again. The assistant's three dots show
   before each of its turns, for longer before a longer answer. New turns push the older ones up and
   off the top, as a chat does. With reduced motion the whole conversation is simply there. */
export type Step = { who: "them" | "tara" | "blank" | "chips" | "node"; text?: string; chips?: string[]; node?: ReactNode };
export function Chat({ script, size = "s", hold = 4200, late = 0, held = false, label }: { script: Step[]; size?: "s" | "l" | "xl"; hold?: number; late?: number; held?: boolean; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0), [typing, setTyping] = useState(false), [out, setOut] = useState(false);
  const a = useRef({ shown: 0, typing: false, clock: 0, next: late + 500, phase: "play" as "play" | "hold" | "out" });
  useEffect(() => { if (calm()) setN(script.length); }, [script.length]);
  useClock(ref, () => {
    if (held) return; // paused by its own card's button (the work page)
    const s = a.current;
    s.clock += 100;
    if (s.clock < s.next) return;
    if (s.phase === "out") { s.shown = 0; s.phase = "play"; setN(0); setOut(false); s.next = s.clock + 600; return; }
    if (s.phase === "hold") { s.phase = "out"; setOut(true); s.next = s.clock + 400; return; }
    const step = script[s.shown], theirs = step.who === "them" || step.who === "blank";
    if (!theirs && step.who !== "chips" && !s.typing) { s.typing = true; setTyping(true); s.next = s.clock + 600 + Math.min(1100, (step.text?.length ?? 60) * 8); return; }
    s.typing = false; setTyping(false);
    s.shown += 1; setN(s.shown);
    if (s.shown === script.length) { s.phase = "hold"; s.next = s.clock + hold; return; }
    const nx = script[s.shown];
    s.next = s.clock + (nx.who === "them" || nx.who === "blank" ? 1200 : nx.who === "chips" ? 380 : 260);
  });
  return (
    <div ref={ref} className={`cx cx--${size}`} role="img" aria-label={label}>
      <div className="cx-top"><img src="/sketches/work/hss-tara.jpg" alt="" width="104" height="104" /><span><b>Tara</b><small>AI booking assistant</small></span></div>
      <div className={out ? "cx-body is-out" : "cx-body"} aria-hidden="true">
        {script.slice(0, n).map((s, k) => (
          <div key={k} className={`cx-i cx-i--${s.who === "them" || s.who === "blank" ? "them" : "tara"}`}>
            <div>
              {s.who === "chips" ? <span className="cx-chips">{s.chips!.map((c) => <i key={c}>{c}</i>)}</span>
                : s.who === "node" ? s.node
                : <p className={s.who === "them" ? "cx-b cx-b--them" : s.who === "blank" ? "cx-b cx-b--blank" : "cx-b"}>{s.text}</p>}
            </div>
          </div>
        ))}
        {typing && <div className="cx-i cx-i--tara"><div><span className="cx-typing"><i /><i /><i /></span></div></div>}
      </div>
    </div>
  );
}

/* A message arrives and goes one of several ways: the message changes, and its route lights. */
export function Routes({ items }: { items: { said: string; real: boolean; goes: string }[] }) {
  const ref = useRef<HTMLDivElement>(null), at = useTurn(ref, items.length, 2600, 300);
  return (
    <div ref={ref} className="rt" role="img" aria-label={`Six ways a message can go: ${items.map((r) => r.goes).join(", ")}.`}>
      <div className="rt-said" aria-hidden="true">{items.map((r, k) => <p key={r.goes} className={`cx-b ${r.real ? "cx-b--them" : "cx-b--blank"}${k === at ? " is-on" : ""}`}>{r.said}</p>)}</div>
      <svg className="rt-arrow" viewBox="0 0 48 16" aria-hidden="true"><path d="M1 8h44M39 2l6 6-6 6" /></svg>
      <ol className="rt-goes" aria-hidden="true">{items.map((r, k) => <li key={r.goes} className={k === at ? "is-on" : undefined}>{r.goes}</li>)}</ol>
    </div>
  );
}

/* A phrase for a day, and the day it means: the phrase changes and the calendar's choice moves. */
const WEEK: [string, number][] = [["Su", 9], ["Mo", 10], ["Tu", 11], ["We", 12], ["Th", 13], ["Fr", 14], ["Sa", 15]];
export function DatePick({ picks }: { picks: [phrase: string, day: number, label: string][] }) {
  const ref = useRef<HTMLDivElement>(null), at = useTurn(ref, picks.length, 2800, 900);
  return (
    <div ref={ref} className="dp" role="img" aria-label={`A date tool: ${picks.map(([p, , l]) => `${p} means ${l}`).join("; ")}.`}>
      <div className="dp-said" aria-hidden="true">{picks.map(([p], k) => <p key={p} className={k === at ? "cx-b cx-b--them is-on" : "cx-b cx-b--them"}>{p}</p>)}</div>
      <b aria-hidden="true">August 2026</b>
      <div className="dp-week" aria-hidden="true" style={{ "--d": picks[at][1] } as CSSProperties}>
        <span className="dp-pick" />
        {WEEK.map(([w, d], k) => <span key={d} className={k === picks[at][1] ? "is-on" : k === 1 ? "is-today" : undefined}><small>{w}</small>{d}</span>)}
      </div>
      <div className="dp-label" aria-hidden="true">{picks.map(([p, , l], k) => <span key={p} className={k === at ? "is-on" : undefined}>{l}</span>)}</div>
    </div>
  );
}

/* A figure that counts to its value once, when it comes on screen (down as well as up: a cost that
   fell counts down). Never on a loop: a result has to sit still to be read. */
export function Count({ to, from = 0, prefix = "", ms = 1400 }: { to: number; from?: number; prefix?: string; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null), [n, setN] = useState(to);
  useEffect(() => {
    if (calm()) return;
    setN(from);
    let raf = 0, done = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done) return;
      done = true;
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / ms), eased = 1 - Math.pow(1 - k, 3);
        setN(Math.round(from + (to - from) * eased));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(ref.current!);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, from, ms]);
  return <span ref={ref} aria-label={`${prefix}${to}`}><span aria-hidden="true">{prefix}{n}</span></span>;
}
