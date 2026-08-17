"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import LoremBanner from "../lorem/LoremBanner";
import LoremHome from "../lorem/LoremHome";
import { MicOrb } from "../lorem/MicOrb";
import Starfield from "./Starfield";

/**
 * BlackHole — the orb-click entrance to Lorem.
 *
 * Click the banner's orb and it becomes a black hole: the page's sections
 * spiral into it one by one, the white ground gives way to deep space, and
 * when the last card is gone the orb glides to Lorem's gate seat — where
 * Lorem's own gate→dock flight and greeting take over, in the space theme.
 *
 * Four phases, all WAAPI + timers (no motion library, per AGENTS.md):
 *
 *   anticipate (350ms)  orb inhales, page dims, space fades in behind
 *   consume    (~1.6s)  viewport sections fly into the orb farthest-first;
 *                       offscreen sections just wink out — flying invisible
 *                       elements is wasted jank
 *   singularity (400ms) overshoot pulse, history.pushState("/lorem"),
 *                       orb flies to the (hidden, measured) gate seat
 *   arrive              LoremHome revealed with begin=true → its existing
 *                       gate flight carries the orb to the dock and greets
 *
 * Why LoremHome mounts HIDDEN at click time rather than at arrival: its
 * audio unlock() must run inside the click gesture — three seconds later is
 * outside Safari's activation window and Lorem would arrive mute. Same
 * reason the URL changes via history.pushState and never router.push: a
 * real navigation would remount LoremHome and destroy the unlocked
 * instance. (Next's docs: native pushState integrates with the router.)
 *
 * Esc or a click while it runs jumps straight to the end. Browser Back
 * unwinds everything — cancel() on a WAAPI fill snaps each section back to
 * its resting state, so the home page returns intact. Reduced motion skips
 * the whole theater: plain navigation to /lorem, whose gate provides its
 * own gesture.
 */

type Rect = { x: number; y: number; w: number; h: number };

const ANTICIPATE_MS = 350;
const CONSUME_MS = 600; // per element
const FLIGHT_MS = 420; // orb → gate seat
const CONSUME_EASE = "cubic-bezier(.55,0,.85,.4)"; // exits accelerate
const SETTLE_EASE = "cubic-bezier(.22,.85,.25,1)"; // arrivals decelerate

export default function BlackHole() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [begin, setBegin] = useState(false);
  const [orbGone, setOrbGone] = useState(false);
  const [orbRect, setOrbRect] = useState<Rect | null>(null);

  const phaseRef = useRef<"idle" | "running" | "arrived">("idle");
  const orbRectRef = useRef<Rect | null>(null);
  const orbElRef = useRef<HTMLDivElement | null>(null);
  const pulseElRef = useRef<HTMLDivElement | null>(null);
  const spaceRef = useRef<HTMLDivElement | null>(null);
  const dimRef = useRef<HTMLDivElement | null>(null);
  const loremWrapRef = useRef<HTMLDivElement | null>(null);

  const animsRef = useRef<Animation[]>([]);
  const timersRef = useRef<number[]>([]);
  const hiddenElsRef = useRef<HTMLElement[]>([]);
  /** Elements given an inline transform-origin for the flight, with what was
   *  there before — restored on unwind. */
  const flownRef = useRef<{ el: HTMLElement; origin: string }[]>([]);
  const bannerOrbRef = useRef<HTMLElement | null>(null);
  const flightDoneRef = useRef(false);
  const prevTitleRef = useRef<string>("");
  const removeSkipRef = useRef<(() => void) | null>(null);
  const triggerAtRef = useRef(0);
  /** Debug slow-motion: ?bhpace=0.2 stretches the whole run 5x (same
   *  convention as LoremHome's pace prop — durations divide by it). */
  const paceRef = useRef(1);

  const timer = (ms: number, fn: () => void) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  };

  /* ── Entry: the orb click ─────────────────────────────────────────────── */

  const trigger = () => {
    if (phaseRef.current !== "idle") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // No theater — /lorem's own gate supplies the tap gesture it needs.
      router.push("/lorem");
      return;
    }
    const bannerOrb = document.querySelector<HTMLElement>(
      "[data-bh-banner-orb] .lorem-micorb",
    );
    if (!bannerOrb) {
      router.push("/lorem");
      return;
    }
    phaseRef.current = "running";
    triggerAtRef.current = performance.now();
    paceRef.current =
      Number(new URLSearchParams(window.location.search).get("bhpace")) || 1;

    // Lock first, measure second: removing the scrollbar reflows the page,
    // and every rect below must be post-reflow or the flights land wide.
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    if (sw > 0) document.documentElement.style.paddingRight = `${sw}px`;

    const r = bannerOrb.getBoundingClientRect();
    bannerOrb.style.visibility = "hidden"; // the fixed clone takes over
    bannerOrbRef.current = bannerOrb;
    const rect = { x: r.left, y: r.top, w: r.width, h: r.height };
    orbRectRef.current = rect;
    setOrbRect(rect);
    setOrbGone(false); // a stray removal timer from a prior run must not eat this clone
    setActive(true); // mounts the portals; the effect below choreographs
  };

  /* ── The choreography ─────────────────────────────────────────────────── */

  useEffect(() => {
    if (!active) return;
    const orbEl = orbElRef.current;
    const pulse = pulseElRef.current;
    const rect = orbRectRef.current;
    if (!orbEl || !pulse || !rect) return;

    const ocx = rect.x + rect.w / 2;
    const ocy = rect.y + rect.h / 2;
    const anims = animsRef.current;
    const pace = paceRef.current;

    // Space fades in behind the page (z -1); the dim veil settles over it.
    // rAF so the layer paints its from-state first — but rAF starves in a
    // throttled/background tab, so a timer backstops it (add is idempotent).
    requestAnimationFrame(() => spaceRef.current?.classList.add("on"));
    timer(80, () => spaceRef.current?.classList.add("on"));
    if (dimRef.current) {
      dimRef.current.style.opacity = "0.3";
      // The veil catches clicks while the show runs: links are still flying
      // beneath it, and a click that lands on one would start a real
      // navigation mid-consume. The click bubbles on to the skip listener.
      dimRef.current.style.pointerEvents = "auto";
    }

    // Anticipation: the inhale. A breath in before the feast.
    anims.push(
      pulse.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.92)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
        { duration: ANTICIPATE_MS / pace, easing: "cubic-bezier(.4,0,.2,1)" },
      ),
    );

    // Targets: main's section children, card grids expanded so each card
    // flies alone. Structure-derived — no fragile class list to maintain.
    const main = document.querySelector("main");
    const tops = main ? (Array.from(main.children) as HTMLElement[]) : [];
    const targets = tops.flatMap((el) => {
      const grid = el.querySelector("[data-seq-group]");
      return grid ? (Array.from(grid.children) as HTMLElement[]) : [el];
    });

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const measured = targets.map((el) => ({ el, r: el.getBoundingClientRect() }));
    const onscreen = measured.filter(
      ({ r }) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw,
    );
    const offscreen = measured.filter((m) => !onscreen.includes(m));

    // Below/above the fold: gone before anyone could see them fly.
    for (const { el } of offscreen) {
      el.style.opacity = "0";
      hiddenElsRef.current.push(el);
    }

    // Farthest-first: the hole eats from the edges inward, and the banner
    // card hosting the orb goes last — the world ends where it began.
    onscreen.sort((a, b) => {
      const da = Math.hypot(a.r.left + a.r.width / 2 - ocx, a.r.top + a.r.height / 2 - ocy);
      const db = Math.hypot(b.r.left + b.r.width / 2 - ocx, b.r.top + b.r.height / 2 - ocy);
      return db - da;
    });

    const stagger = Math.min(130, 1400 / Math.max(1, onscreen.length));
    onscreen.forEach(({ el, r }, i) => {
      // The whole trick: scale about the ORB'S point in this element's local
      // coordinates (transform-origin may sit outside the element — that's
      // valid). Contraction toward an external origin IS motion toward it:
      // every corner converges along its own ray into the hole, the element
      // is small from its first airborne frames instead of sweeping the
      // screen full-size, and one shared rotation reads as a coherent swirl
      // around the drain rather than tilting sheets. The first version
      // translated whole sections and only collapsed them at the end —
      // several 600–1400px slabs mid-flight at once, pure chaos.
      flownRef.current.push({ el, origin: el.style.transformOrigin });
      el.style.transformOrigin = `${ocx - r.left}px ${ocy - r.top}px`;
      const delay = (ANTICIPATE_MS + i * stagger) / pace;
      anims.push(
        el.animate(
          [
            { transform: "rotate(0deg) scale(1)", opacity: 1 },
            // Half its size by mid-flight — the grip is immediate.
            { transform: "rotate(-14deg) scale(.5)", opacity: 0.95, offset: 0.45 },
            // scale(.001), never 0 — a non-invertible matrix glitches the
            // interpolation in more than one engine. Opacity holds until the
            // very end: things ENTER the hole, they don't evaporate.
            { transform: "rotate(-40deg) scale(.001)", opacity: 0 },
          ],
          { duration: CONSUME_MS / pace, delay, easing: CONSUME_EASE, fill: "forwards" },
        ),
      );
      // The swallow: a satisfied little pulse as each one goes down.
      timer(delay + (CONSUME_MS - 40) / pace, () => {
        animsRef.current.push(
          pulse.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }],
            { duration: 180 / pace, easing: "cubic-bezier(.4,0,.2,1)" },
          ),
        );
      });
    });

    timer(ANTICIPATE_MS / pace, () => {
      if (dimRef.current) dimRef.current.style.opacity = "0.55";
    });

    const consumeEnd =
      (ANTICIPATE_MS + Math.max(0, onscreen.length - 1) * stagger + CONSUME_MS) / pace;

    // Singularity: everything is in. One overshooting gulp, then glide to
    // the seat Lorem's gate holds for the orb (measured from the hidden
    // mount — the gate sits above true center, so never assume).
    timer(consumeEnd, () => {
      const p = pulseElRef.current;
      if (p)
        animsRef.current.push(
          p.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(1.22)" },
              { transform: "scale(0.94)" },
              { transform: "scale(1)" },
            ],
            { duration: 340 / pace, easing: "cubic-bezier(.4,0,.2,1)" },
          ),
        );
      flyToGate();
      timer(FLIGHT_MS / pace, arrive);
    });

    // Escape hatches: Esc or a click jumps to the end. The 500ms grace
    // covers two real cases at once: the triggering click can still be
    // mid-propagation to window when React attaches this listener, and a
    // double-clicked orb must not skip its own show on the second click.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    const onClick = () => {
      if (performance.now() - triggerAtRef.current < 500) return;
      skip();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    const removeSkip = () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
    removeSkipRef.current = removeSkip;

    return () => {
      removeSkip();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per activation
  }, [active]);

  /** The orb's flight from the banner to the gate seat. Top-left origin,
   *  same transform-function list in both keyframes — the technique (and the
   *  reasons) are LoremHome's gate→dock flight, applied one leg earlier. */
  const flyToGate = () => {
    if (flightDoneRef.current) return;
    flightDoneRef.current = true;
    const orbEl = orbElRef.current;
    const rect = orbRectRef.current;
    const gate = loremWrapRef.current?.querySelector<HTMLElement>(".lorem-gateorb");
    if (!orbEl || !rect || !gate) return;
    const to = gate.getBoundingClientRect();
    if (to.width === 0) return;
    // Ease the feeding glow down to Lorem's quiet space rim while airborne,
    // so removing the clone at touchdown swaps identical pixels.
    orbEl.classList.add("landing");
    animsRef.current.push(
      orbEl.animate(
        [
          { transform: "translate(0,0) scale(1)" },
          {
            transform: `translate(${to.left - rect.x}px,${to.top - rect.y}px) scale(${to.width / rect.w})`,
          },
        ],
        { duration: FLIGHT_MS / paceRef.current, easing: SETTLE_EASE, fill: "forwards" },
      ),
    );
  };

  /** Idempotent landing. Reached by the timeline or by skip(). */
  const arrive = () => {
    if (phaseRef.current !== "running") return;
    phaseRef.current = "arrived";
    removeSkipRef.current?.();

    // The address changes without a navigation — a router.push would
    // remount LoremHome and throw away the in-gesture audio unlock.
    try {
      prevTitleRef.current = document.title;
      window.history.pushState({ bh: 1 }, "", "/lorem");
      document.title = "Lorem — Dinesh's voice portfolio";
    } catch {
      /* URL nicety only; the experience continues regardless */
    }

    if (dimRef.current) {
      dimRef.current.style.opacity = "0";
      dimRef.current.style.pointerEvents = "none"; // Lorem owns the screen now
    }
    // Reveal + begin → LoremHome's own start(): gate→dock flight, greeting.
    setBegin(true);
    // Our clone and the gate orb are pixel-identical at the same seat; two
    // frames of overlap later, Lorem's orb owns the screen and ours goes.
    // Timer backstop for throttled tabs, where rAF may never come.
    requestAnimationFrame(() => requestAnimationFrame(() => setOrbGone(true)));
    window.setTimeout(() => setOrbGone(true), 180);
  };

  /** Jump to the end state: finish every animation, run what hasn't run. */
  const skip = () => {
    if (phaseRef.current !== "running") return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    for (const a of animsRef.current) {
      try {
        a.finish();
      } catch {
        /* infinite or detached animations can't finish(); harmless */
      }
    }
    flyToGate();
    const flight = animsRef.current[animsRef.current.length - 1];
    try {
      flight?.finish();
    } catch {
      /* noop */
    }
    spaceRef.current?.classList.add("on");
    arrive();
  };

  /* ── Back button: put the world back ──────────────────────────────────── */

  useEffect(() => {
    if (!active) return;
    const unwind = () => {
      if (phaseRef.current === "idle") return;
      phaseRef.current = "idle";
      removeSkipRef.current?.();
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      // cancel() on a filled WAAPI animation snaps the element back to its
      // stylesheet state — .seq.in resting transforms, untouched classes.
      for (const a of animsRef.current) a.cancel();
      animsRef.current = [];
      for (const el of hiddenElsRef.current) el.style.opacity = "";
      hiddenElsRef.current = [];
      for (const { el, origin } of flownRef.current) el.style.transformOrigin = origin;
      flownRef.current = [];
      if (bannerOrbRef.current) bannerOrbRef.current.style.visibility = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
      if (prevTitleRef.current) document.title = prevTitleRef.current;
      flightDoneRef.current = false;
      // Unmounting LoremHome runs useSpeech's teardown: mic, TTS, the
      // AudioContext — the whole voice stack releases here.
      setActive(false);
      setBegin(false);
      setOrbGone(false);
      setOrbRect(null);
    };
    window.addEventListener("popstate", unwind);
    return () => window.removeEventListener("popstate", unwind);
  }, [active]);

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <>
      <LoremBanner onOrbClick={trigger} />
      {active &&
        createPortal(
          <div ref={spaceRef} className="bh-space">
            <Starfield />
          </div>,
          document.body,
        )}
      {active && createPortal(<div ref={dimRef} className="bh-dim" />, document.body)}
      {active &&
        createPortal(
          <div ref={loremWrapRef} className={`bh-lorem${begin ? " on" : ""}`}>
            <LoremHome theme="space" entrance="blackhole" begin={begin} />
          </div>,
          document.body,
        )}
      {active &&
        !orbGone &&
        orbRect &&
        createPortal(
          <div
            ref={orbElRef}
            className="bh-orb"
            style={{ left: orbRect.x, top: orbRect.y, width: orbRect.w, height: orbRect.h }}
          >
            <div ref={pulseElRef} className="bh-orb-pulse">
              <MicOrb state="speaking" decorative />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
