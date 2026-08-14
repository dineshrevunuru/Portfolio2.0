"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Aurora } from "./Aurora";
import { Caption } from "./Caption";
import { MicOrb, type MicOrbState } from "./MicOrb";
import { Surface, type FactLookup, type QuoteLookup } from "./Surface";
import type { Block } from "./protocol";
import { useSpeech } from "./useSpeech";
import { beginVisit, daysSince, forgetVisitor, rememberName, type Visitor } from "./memory";
import { icebreakerHint, pickIcebreakers } from "./icebreakers";

/* ── Types ────────────────────────────────────────────────────────────────── */

type Phase = "greet" | "capturing" | "thinking" | "answering";

type Turn = {
  asked: string;
  say: string;
  show: Block[];
  facts: FactLookup;
  quotes: QuoteLookup;
  chips: string[];
};

/** Back-stack entries carry the model memory as it stood while that turn was
 *  on screen, so Back rewinds the conversation, not just the pixels — without
 *  this, "and the other one?" after Back resolves against an answer that is no
 *  longer visible. */
type StackEntry = {
  turn: Turn;
  history: { role: "user" | "assistant"; content: string }[];
};

export interface LoremHomeProps {
  /** Speak answers aloud. On by default — this is a voice-first surface. */
  speak?: boolean;
  /** Skip the tap-to-start gate. Dev only: it also disables TTS, which needs the gesture. */
  skipGate?: boolean;
  /** Timing multiplier for the entrance beats (0.5–2). */
  pace?: number;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

/* ── Component ────────────────────────────────────────────────────────────── */

/**
 * LoremHome — a conversation that draws.
 *
 * The interaction problem: speech is serial and it evaporates. Ask a voice
 * assistant about a project and by the third sentence you are holding a number,
 * a comparison and a timeline in your head at once, and you drop two of them.
 * Adding a screen doesn't fix that on its own — a screen that just prints the
 * transcript is the same load with extra steps.
 *
 * So Lorem answers on two tracks. It *says* the narrative and it *shows* the parts
 * the ear can't keep, and the model chooses the split per turn from the actual
 * question. No prewritten screens: `/api/lorem` returns a small list of design-system
 * blocks that `Surface` assembles. The deeper the conversation goes, the more of
 * the answer moves onto the glass — which is exactly when the visitor has the
 * least room left to hold it.
 *
 * The one thing the model does not get to improvise is a number. See `facts.ts`.
 */
export default function LoremHome({ speak = true, skipGate = false, pace = 1 }: LoremHomeProps) {
  const [gate, setGate] = useState(true);
  const [gone, setGone] = useState(false);
  const [phase, setPhase] = useState<Phase>("greet");
  const [turn, setTurn] = useState<Turn | null>(null);
  const [status, setStatus] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [kOpen, setKOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [log, setLog] = useState<Turn[]>([]);
  const [touch, setTouch] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorSay, setErrorSay] = useState<string | null>(null);
  const [pending, setPending] = useState("");
  const [offline, setOffline] = useState(false);
  /** Who we met last time. Read once on mount — null until then so SSR and the
   *  first client render agree and nothing flickers. */
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [greetedName, setGreetedName] = useState<string | undefined>(undefined);
  /**
   * True when this browser is not Chrome — drives the one line of expectation-
   * setting on the gate. Detected in an effect, never during render: the server
   * has no user agent to agree with, and a hydration mismatch on the first
   * screen is the worst place to have one. Defaults false, so Chrome (the
   * majority) and the server render identical gates and everyone else gains a
   * line after mount.
   *
   * iOS is deliberately treated as Chrome-equivalent and excluded: every iOS
   * browser is WebKit underneath, so "best in Chrome" would be a claim with
   * nothing behind it there.
   */
  const [notChrome, setNotChrome] = useState(false);

  /** The gate-orb flight: measured start rect plus the translation to the dock
   *  seat. `go` flips one frame after mount so the transition has a from-state. */
  const [fly, setFly] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    dx: number;
    dy: number;
    scale: number;
  } | null>(null);

  const kinRef = useRef<HTMLInputElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const transcriptBtnRef = useRef<HTMLButtonElement | null>(null);
  const stack = useRef<StackEntry[]>([]);
  /** Normalised questions already asked — stops the `rec` chip re-recommending
   *  something the visitor has already heard. */
  const askedBefore = useRef<Set<string>>(new Set());
  /** Lorem's memory. Sent whole each turn; the server is stateless by design. */
  const history = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const inflight = useRef<AbortController | null>(null);
  const gateDone = useRef(false);
  const touchRef = useRef(false);
  /** Flight endpoints: the decorative orb on the gate and the dock seat it
   *  settles into. Wrappers, because MicOrb owns its own ref internally. */
  const gateOrbRef = useRef<HTMLSpanElement | null>(null);
  const dockOrbRef = useRef<HTMLDivElement | null>(null);
  const flyElRef = useRef<HTMLDivElement | null>(null);

  // modK is only meaningful where a keyboard exists; on coarse pointers every
  // "press ⌘K" string becomes "tap" (navigator.platform reports iPhone/iPad as
  // Mac-family, so the old check happily told phones to press ⌘K).
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || "");
  const modK = isMac ? "⌘K" : "Ctrl+K";
  const typeHint = touch ? "tap to type" : `press ${modK} to type`;

  /**
   * The landing sequence. Nothing else appears until the orb has settled into
   * the dock; then the screen assembles line by line — h1, invitation,
   * mechanics, chips, status, command bar — each on its own beat.
   *
   * entryBeat: for content that MOUNTS at landing (the greet block, which is
   * gated on `!gate`). `both` keeps a delayed line invisible until its turn.
   *
   * dockBeat: for the dock's children, which must stay MOUNTED through the
   * gate — the flight measures its landing seat off this layout, so hiding
   * them with display:none would move the target between measurement and
   * touchdown. visibility keeps the geometry and hides the pixels; when the
   * gate clears, the style gains an animation, which is what starts one.
   *
   * Inline styles on purpose: the reduced-motion guard in globals.css matches
   * [style*="lorem-beatin"], so every beat here is silenced by the same rule
   * that silences the answer blocks.
   */
  const entryBeat = (delay: number): CSSProperties => ({
    animation: `lorem-beatin ${(0.55 / (pace || 1)).toFixed(2)}s ${(delay / (pace || 1)).toFixed(2)}s both`,
  });
  const dockBeat = (delay: number): CSSProperties =>
    gate ? { visibility: "hidden" } : entryBeat(delay);

  /* ── Asking ───────────────────────────────────────────────────────────── */

  const ask = useCallback(
    // `mode` is how the question arrived, not how the answer is delivered — a
    // spoken question wants a shorter answer with more on the glass, because a
    // listener can't scroll back. Chips count as typed: they were read.
    async (question: string, mode: "voice" | "text" = "text") => {
      const q = question.trim();
      if (!q) return;

      // Lorem is useless offline — recognition, TTS voices and the model all need
      // the network. Say so before spending a request on a guaranteed failure,
      // and restore the phase: a voice turn has already flipped to "capturing",
      // which would otherwise freeze the stage on the dead caption.
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        setOffline(true);
        setHint("You're offline. Lorem needs a connection to answer.");
        setStatus("");
        setPhase(turnRef.current ? "answering" : "greet");
        return;
      }

      inflight.current?.abort();
      const ctl = new AbortController();
      inflight.current = ctl;

      setFailed(false);
      setPending(q);
      askedBefore.current.add(norm(q));
      setPhase("thinking");
      setStatus("Thinking…");

      let res: Response;
      try {
        res = await fetch("/api/lorem", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: q, history: history.current, mode }),
          signal: ctl.signal,
        });
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        const msg = "I lost my connection there. Try me again?";
        setFailed(true);
        setErrorSay(msg);
        setPhase("answering");
        setStatus("");
        speechRef.current?.say(msg);
        return;
      }

      const data = (await res.json().catch(() => null)) as
        | (Turn & { error?: string; facts?: FactLookup; quotes?: QuoteLookup })
        | null;
      if (ctl.signal.aborted) return;

      // An error response still carries a friendly `say`, so speak it — but it
      // is not an answer. It must never enter history, the transcript, or the
      // back stack, or the next turn's context would contain Lorem apologising
      // for its own outage. `data.error` also catches the route's no_tool path.
      if (!res.ok || data?.error || !data?.say) {
        const msg = data?.say ?? "Something went wrong on my end. Try me again?";
        setFailed(true);
        setErrorSay(msg);
        setPhase("answering");
        setStatus("");
        speechRef.current?.say(msg, () => setStatus(""));
        return;
      }
      setErrorSay(null);

      // A name only ever arrives because the visitor said it. memory.ts trims
      // anything that doesn't look like one, and returns null if unsure.
      const memo = data as { rememberName?: string; forgetName?: boolean };
      if (memo.forgetName) {
        // Retraction beats capture. Someone saying "that's not me" in the same
        // breath they were misidentified must end up forgotten, not re-stored.
        forgetVisitor();
        setGreetedName(undefined);
      } else if (memo.rememberName) {
        const stored = rememberName(memo.rememberName);
        if (stored) setGreetedName(stored);
      }

      const next: Turn = {
        asked: q,
        say: data.say,
        show: Array.isArray(data.show) ? data.show : [],
        facts: data.facts ?? {},
        quotes: data.quotes ?? {},
        chips: Array.isArray(data.chips) ? data.chips : [],
      };

      // Back-stack push happens HERE, outside any state updater — an updater
      // must stay pure (Strict Mode double-invokes it, pushing every turn
      // twice) — and BEFORE the new q/a enters memory, so the snapshot is the
      // conversation exactly as it stood while the previous turn was up.
      const prev = turnRef.current;
      if (prev) stack.current.push({ turn: prev, history: [...history.current] });

      // Memory: what was asked and what Lorem actually said, so follow-ups like
      // "and the other one?" resolve.
      history.current = [
        ...history.current,
        { role: "user" as const, content: q },
        { role: "assistant" as const, content: next.say },
      ].slice(-16);

      setTurn(next);
      setLog((l) => [...l, next]);
      setPhase("answering");
      setStatus("Speaking");
      speechRef.current?.say(next.say, () => setStatus(""));
    },
    [],
  );

  const askRef = useRef(ask);
  askRef.current = ask;

  /* ── Voice ────────────────────────────────────────────────────────────── */

  const voice = useSpeech({
    speak: speak && !skipGate,
    onFinal: (text) => {
      void askRef.current(text, "voice");
    },
    onEmpty: (reason) => {
      setPhase(turnRef.current ? "answering" : "greet");
      // "Didn't catch that" blames the visitor — only say it when that is
      // actually what happened.
      setStatus(
        reason === "network"
          ? "Speech service hiccup. Try again in a moment"
          : reason === "audio-capture"
            ? "No microphone found. Type instead"
            : "Didn't catch that. Try again?",
      );
      window.setTimeout(() => setStatus(""), 2600 / (pace || 1));
    },
    onHint: (h) => setHint(h),
  });

  const speechRef = useRef(voice);
  speechRef.current = voice;
  const turnRef = useRef(turn);
  turnRef.current = turn;

  // Scribe transcribes after release, so there is a beat with no words on the
  // stage. Name it rather than letting the caption sit frozen.
  useEffect(() => {
    if (voice.transcribing) setStatus("Getting that down…");
  }, [voice.transcribing]);

  useEffect(() => {
    if (voice.listening) {
      setPhase("capturing");
      // Truthful per mode: "release to send" is a lie when they tapped the orb.
      setStatus(
        voice.listenMode === "hold"
          ? "Listening… release to send"
          : "Listening… tap the orb to send",
      );
    }
  }, [voice.listening, voice.listenMode]);

  /* ── Start ────────────────────────────────────────────────────────────── */

  const start = useCallback(() => {
    if (gateDone.current) return; // Space fires both the gate handler and the window one
    gateDone.current = true;
    // unlock() must stay inside the tap gesture — TTS needs it — even though
    // the first spoken word now waits for the orb to land.
    void speechRef.current.unlock();

    // Open with something usable, not with a self-description. A visitor who
    // knows they're talking to software discounts warmth and doesn't discount
    // accuracy, so the first turn spends its credit on a fact.
    //
    // The stored name deliberately does NOT appear here. It stays on screen
    // beside its own Forget control — disclosure the visitor can see and undo.
    // Spoken aloud unprompted it's recall they can't trace, which is the one
    // form of personalisation that reliably backfires.
    const speakNow = () => {
      setStatus("Speaking");
      const back = greetedName ? "Welcome back. " : "";
      // The spoken instructions must match the device — phones have no Space bar.
      const how = touchRef.current
        ? "Tap the orb when you want to talk."
        : "Hold Space when you want to talk.";
      // A conversational agent's opener, not an assistant's orientation. The
      // old line led with the client project and then disclaimed it ("but I'm
      // not only here for the portfolio") — an index read aloud, and backwards
      // for the visitor who came to poke at the thing itself, which the gym
      // transcripts say is nearly everyone. This one is identity, permission,
      // mechanics, then a question — because an agent ends its turn with a
      // move, and an open question is the move that fits a first meeting.
      // The work stays one breath away ("down to the numbers"), not up front.
      const greeting =
        `${back}This is a conversation, not a search box. Dinesh's work, down ` +
        `to the numbers, the unflattering parts included. Or something else ` +
        `entirely. ${how} So, what brought you here?`;
      speechRef.current.say(greeting, () => setStatus(""));
    };

    setGone(true);

    // The settle: measure the gate orb and its dock seat, fly a clone between
    // them, and hold the greeting until touchdown — the voice starting while
    // its avatar is mid-air reads as two different things talking. Reduced
    // motion (or a missing rect on some unexpected layout) falls back to the
    // plain fade with the greeting up front, exactly the old behavior.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = gateOrbRef.current?.getBoundingClientRect();
    const to = dockOrbRef.current?.getBoundingClientRect();
    if (reduce || !from || !to || from.width === 0 || to.width === 0) {
      speakNow();
      window.setTimeout(() => setGate(false), 520 / (pace || 1));
      return;
    }

    // Laid out at the destination's size and scaled up to the gate's, with a
    // top-left origin so both the position and the scale resolve against the
    // same corner — measure, then let one transform carry both.
    setFly({
      x: from.left,
      y: from.top,
      w: to.width,
      h: to.height,
      dx: to.left - from.left,
      dy: to.top - from.top,
      scale: from.width / to.width,
    });
    // The flight itself is started by the effect that watches `fly`.
    window.setTimeout(() => {
      setFly(null);
      setGate(false);
      speakNow();
    }, 680 / (pace || 1));
  }, [pace, greetedName]);

  const startRef = useRef(start);
  startRef.current = start;

  /**
   * Run the gate orb's flight exactly once per `fly`.
   *
   * An effect rather than an inline ref callback, which is where this landed
   * first and broke in a way worth recording: an inline arrow is a new function
   * every render, so React detaches and reattaches the ref each time and calls
   * it again. LoremHome re-renders freely while the orb is in the air (status,
   * voice state), so `animate()` fired three times on one element, each restart
   * yanking the transform back to the first keyframe. The clone sat at the gate
   * looking exactly as broken as the CSS-transition version it replaced.
   *
   * `fly` is set once and never mutated, so this runs once; the cleanup cancels
   * if the flight is torn down early.
   */
  useEffect(() => {
    const el = flyElRef.current;
    if (!fly || !el) return;
    const anim = el.animate(
      [
        { transform: `translate(0px, 0px) scale(${fly.scale})` },
        { transform: `translate(${fly.dx}px, ${fly.dy}px) scale(1)` },
      ],
      { duration: 680 / (pace || 1), easing: "cubic-bezier(.22,.85,.25,1)", fill: "forwards" },
    );
    return () => anim.cancel();
  }, [fly, pace]);

  /* ── Keyboard ─────────────────────────────────────────────────────────── */

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!gateDone.current) {
        if (e.key === "Enter" || e.code === "Space") {
          e.preventDefault();
          startRef.current();
        }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setKOpen((v) => {
          if (!v) requestAnimationFrame(() => kinRef.current?.focus());
          return !v;
        });
        return;
      }
      if (e.key === "Escape") {
        setLogOpen(false);
        setKOpen(false);
        kinRef.current?.blur();
        return;
      }
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return;
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        speechRef.current.listenStart("hold");
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && gateDone.current) {
        e.preventDefault();
        speechRef.current.listenEnd();
      }
    };
    // Alt-tab while holding Space means keyup never fires; without this the
    // recognizer auto-restarts forever with the window in the background.
    const onBlur = () => speechRef.current.listenEnd();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  /* ── Environment ──────────────────────────────────────────────────────── */

  useEffect(() => {
    // Which browser is this, really. userAgentData's brand list is the honest
    // source where it exists (Chromium ships "Google Chrome" only in actual
    // Chrome, so Edge/Opera/Brave classify correctly); the UA-string fallback
    // has to exclude the Chromium cosplayers by hand. CriOS is Chrome on iOS,
    // which is WebKit in a coat — it goes with iOS below, not with Chrome.
    const ua = navigator.userAgent;
    const brands = (
      navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }
    ).userAgentData?.brands;
    const isChrome = brands
      ? brands.some((b) => b.brand === "Google Chrome")
      : /Chrome\//.test(ua) && !/Edg\/|OPR\/|SamsungBrowser|CriOS\//.test(ua);
    const isIOS =
      /iPhone|iPad|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!isChrome && !isIOS) setNotChrome(true);

    const compact = window.matchMedia("(max-height:700px)");
    const coarse = window.matchMedia("(pointer:coarse)");
    const sync = () => {
      setTouch(coarse.matches);
      touchRef.current = coarse.matches;
      const n = screenRef.current;
      if (!n) return;
      n.style.setProperty("--ai", compact.matches ? "14px" : "40px");
      n.style.setProperty(
        "--ptt",
        coarse.matches || speechRef.current.micState !== "ok" ? "none" : "inline",
      );
    };
    // localStorage is only safe to touch after mount — see memory.ts for why
    // this is storage and not a cookie.
    const prev = beginVisit();
    setVisitor(prev);
    setGreetedName(prev.name);

    sync();
    compact.addEventListener("change", sync);
    coarse.addEventListener("change", sync);

    const goOffline = () => {
      setOffline(true);
      setHint("You're offline. Lorem needs a connection to answer.");
    };
    const goOnline = () => {
      setOffline(false);
      // Only clear our own message — a mic-permission hint must survive a
      // connectivity flap.
      setHint((h) => (h?.startsWith("You're offline") ? null : h));
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    if (typeof navigator !== "undefined" && navigator.onLine === false) goOffline();
    if (skipGate) {
      gateDone.current = true;
      setGate(false);
      setGone(true);
    }
    return () => {
      compact.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      inflight.current?.abort();
    };
  }, [skipGate]);

  useEffect(() => {
    const n = screenRef.current;
    if (!n) return;
    n.style.setProperty("--ptt", touch || voice.micState !== "ok" ? "none" : "inline");
  }, [touch, voice.micState]);

  // The transcript claims aria-modal; move focus in and put it back after, or
  // the claim is a lie for keyboard and screen-reader visitors.
  const logWasOpen = useRef(false);
  useEffect(() => {
    if (logOpen) {
      logWasOpen.current = true;
      closeBtnRef.current?.focus();
    } else if (logWasOpen.current) {
      logWasOpen.current = false;
      transcriptBtnRef.current?.focus();
    }
  }, [logOpen]);

  /* ── Controls ─────────────────────────────────────────────────────────── */

  const back = () => {
    speechRef.current.hush();
    setFailed(false);
    const entry = stack.current.pop();
    if (entry) {
      history.current = entry.history; // rewind memory with the pixels
      setTurn(entry.turn);
      setPhase("answering");
    } else {
      history.current = [];
      setTurn(null);
      setPhase("greet");
    }
    setStatus("");
  };

  const replay = () => {
    if (!turn) return;
    setStatus("Speaking");
    speechRef.current.say(turn.say, () => setStatus(""));
  };

  const jumpTo = (t: Turn) => {
    // Jumping is a navigation like any other: push where we are so Back
    // returns here instead of somewhere the visitor never was.
    const prev = turnRef.current;
    if (prev && prev !== t) stack.current.push({ turn: prev, history: [...history.current] });
    setLogOpen(false);
    setFailed(false);
    setTurn(t);
    setPhase("answering");
  };

  /* ── Derived ──────────────────────────────────────────────────────────── */

  // `thinking` sits above `blocked` on purpose: while a request is in flight the
  // orb should report what Lorem is doing, not re-report a mic permission the
  // status line and hint pill already cover. Transcribing counts as thinking —
  // from the visitor's side it is the same wait.
  // Activity outranks permission. `blocked` is a *resting* state — it says "you
  // have no mic", which is only worth saying when nothing else is happening.
  // Ranked above speaking (as it was) it meant a visitor who denied the mic
  // watched a dead grey orb through every answer Lorem gave. Transcribing counts
  // as thinking: from the visitor's side it is the same wait.
  const orb: MicOrbState = voice.listening
    ? "listening"
    : phase === "thinking" || voice.transcribing
      ? "thinking"
      : voice.ttsSpeaking
        ? "speaking"
        : voice.micState === "denied"
          ? "blocked"
          : "muted";

  // The wave field is Lorem's voice made visible, so it has to track a real
  // signal in both directions: the visitor's mic while listening, and Lorem's
  // own audio while speaking. A flat constant while speaking is what made it
  // read as decoration — it moved for six seconds regardless of what was said.
  // (The browser-synth fallback exposes no audio node; it holds a mid level.)
  const energy = voice.listening
    // Half the swing the MicOrb bars get. The bars are a meter — twitch is
    // information there. A 52px-amplitude wave field twitching per syllable
    // just reads as broken.
    ? 0.3 + voice.level * 0.3
    : voice.ttsSpeaking
      ? 0.42 + (voice.outLevel || 0.3) * 0.42
      : phase === "thinking"
        ? 0.35
        : 0.08;

  // Chip fallbacks, in order of preference: the model's own follow-ups; the
  // openers when nothing is on screen; the not-yet-asked openers when the model
  // omitted chips mid-conversation. An empty suggestion row next to a blocked
  // mic is a dead end.
  // Rotated by visit count, so a return visit doesn't open on the same row.
  const openers = pickIcebreakers(visitor?.visits ?? 0);
  const openerPool = openers.filter((o) => !askedBefore.current.has(norm(o)));
  const chips = turn?.chips.length ? turn.chips : !turn ? openers : openerPool;

  // The spinning `rec` border is a strong attention magnet, so it has to earn
  // its place: it points at the first suggestion the visitor has NOT already
  // asked, and it retires once they've had a few turns and clearly don't need
  // steering. A permanently-spinning chip is just noise with no payoff.
  const recIndex =
    log.length < 3 ? chips.findIndex((c) => !askedBefore.current.has(norm(c))) : -1;

  const restingStatus = offline
    ? "Offline. Lorem needs a connection"
    : voice.micState === "denied"
      ? `Mic blocked, ${typeHint}`
      : voice.micState === "unsupported"
        ? `No voice in this browser, ${typeHint}`
        : "Ask me anything";

  return (
    <div className="lorem-home" style={{ height: "100dvh" }} data-screen-label="Lorem">
      <div className="lorem-home-aurora">
        {/* grain={false}: smooth gradient waves. The DS default stays grainy —
            this surface is the exception, not a change to the component. */}
        <Aurora energy={energy} grain={false} />
      </div>
      {/* The way out. It read as a caption before ("dinesh · voice portfolio"),
          so the only exit from a full-screen voice takeover looked like a label.
          It names its destination rather than saying "Back", because the dock
          already renders a "← Back" chip meaning the previous answer, and two
          bare arrows on one screen meaning different things is the ambiguity.
          Naming it also makes it safe for a cold arrival: /lorem is in the
          sitemap and shareable, so history.back() could leave the site entirely,
          while this always lands somewhere known.

          Deliberately a plain <a>, not next/link: the hard navigation tears
          down the speech synthesis and the mic stream on the way out, which a
          client-side route change does not guarantee. */}
      <a className="lorem-via" href="/" aria-label="Back to the homepage">
        <span className="varrow" aria-hidden="true">
          &larr;
        </span>
        Homepage
      </a>

      {/* The permission pointer. The browser draws its mic prompt in its own
          chrome, at the top-left under the address bar, where a visitor staring
          at a full-screen voice interface reliably misses it — and a missed
          prompt reads as "the voice thing is broken", not "I have a dialog
          open". So while the prompt is up, this points at it.

          Sits below the Homepage link rather than beside it: same corner, no
          collision, and the arrow still lands under the browser UI it means.
          aria-live announces it for anyone who cannot see the pointing. */}
      {voice.micPrompting && (
        <div className="lorem-permarrow" role="status" aria-live="polite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20V5M12 5l-6 6M12 5l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Allow the mic up here to talk
        </div>
      )}
      {/* Mirrors .lorem-via across the top. Points at the plain-text portfolio —
          the convention agents look for. One href to change if you meant
          something else by "agents". */}
      <a className="lorem-agents" href="/llms.txt">
        For agents?
      </a>

      <div className="lorem-screen" ref={screenRef}>
        <div className="lorem-stage">
          {/* Gated on `!gate` as well: the greet must not pre-exist behind the
              blur. It mounts at the moment the orb lands, and each line takes
              its own beat — the h1 first, then the invitation, then mechanics.
              The dock's children below join the same timeline. */}
          {phase === "greet" && !turn && !gate && (
            <div className="lorem-stage-center">
              {/* pace scales the JS timers, so it has to scale the CSS beats
                  too or they desync at 0.5x / 2x. */}
              <div>
                {/* Masked from Clarity replays when it greets by name \u2014 see
                    app/components/Clarity.tsx. */}
                <h1
                  className="lorem-h"
                  style={{ fontSize: 44, ...entryBeat(0) }}
                  data-clarity-mask="True"
                >
                  {greetedName ? `Hey ${greetedName}.` : "Hi. I\u2019m Lorem."}
                </h1>
                <p className="lorem-p" style={{ margin: "14px auto 0", ...entryBeat(0.16) }}>
                  {icebreakerHint(Boolean(visitor?.visits))}
                </p>
                {/* Mechanics move to their own quiet line. Mixed into the
                    permission line they buried it — someone who has gone blank
                    needs to know what they're allowed to say, not which key to
                    hold. */}
                {greetedName && (
                  // The control belongs next to the data it governs. In the
                  // transcript alone it was unreachable until after a turn —
                  // so someone greeted by name couldn't opt out until they'd
                  // already talked, which is exactly backwards.
                  <p className="lorem-forget lorem-forget--greet" style={entryBeat(0.28)}>
                    Not you, or rather not remembered?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        forgetVisitor();
                        setGreetedName(undefined);
                      }}
                    >
                      Forget me
                    </button>
                  </p>
                )}
                <p className="lorem-howto" style={entryBeat(0.34)}>
                  {touch ? (
                    "Tap the orb and talk"
                  ) : voice.micState !== "ok" ? (
                    <>
                      <b style={{ fontWeight: 600 }}>{modK}</b> to type
                    </>
                  ) : (
                    <>
                      Hold <b style={{ fontWeight: 600 }}>Space</b> to talk
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {phase === "capturing" && (
            <div className="lorem-stage-center">
              <Caption confirmed={voice.confirmed} interim={voice.interim} />
            </div>
          )}

          {/* Hold the question on screen while Lorem thinks — the visitor should
              never wonder whether it heard them. */}
          {phase === "thinking" && (
            <div className="lorem-stage-center">
              <Caption confirmed={pending} interim="" caret />
            </div>
          )}

          {phase === "answering" && !failed && turn && (
            <Surface
              blocks={turn.show}
              facts={turn.facts}
              quotes={turn.quotes}
              asked={turn.asked}
              say={turn.say}
              pace={pace || 1}
            />
          )}

          {/* Failure replaces the stage even when an old answer exists —
              leaving the previous answer up while the spoken error refers to
              the new question is worse than showing nothing. */}
          {phase === "answering" && failed && (
            <div className="lorem-stage-center">
              <div>
                {pending && <div className="lorem-asked">you asked &middot; {pending}</div>}
                <p className="lorem-p">
                  {errorSay ?? "I couldn't reach my model just then."} In the meantime the
                  written version is at <a href="/hss-case-study">the case study</a>.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lorem-dock">
          {(turn || log.length > 0) && (
            <div className="lorem-controls" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {turn && (
                <button className="lorem-chip go" style={ctlStyle} onClick={back}>
                  &larr; Back
                </button>
              )}
              {turn && (
                <button className="lorem-chip go" style={ctlStyle} onClick={replay}>
                  Say it again
                </button>
              )}
              {/* Gated on log, not turn — Back to the greet must not make the
                  accumulated conversation unreachable. */}
              {log.length > 0 && (
                <button
                  ref={transcriptBtnRef}
                  className="lorem-chip go"
                  style={ctlStyle}
                  onClick={() => setLogOpen(true)}
                >
                  Transcript ({log.length})
                </button>
              )}
            </div>
          )}

          <div className="lorem-chips" style={dockBeat(0.46)}>
            {chips.map((c, i) => (
              <button
                key={`${c}-${i}`}
                className={`lorem-chip ${i === recIndex ? "rec" : "go"}`}
                style={{ fontFamily: "inherit" }}
                onClick={() => void ask(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="lorem-vstatus" aria-live="polite" style={dockBeat(0.58)}>
            {status || restingStatus}
          </div>

          {/* The wrapper is the flight's landing pad: measured for the clone's
              destination, and hidden while the clone is airborne so the orb
              never appears twice. */}
          <div ref={dockOrbRef} style={{ opacity: fly ? 0 : 1 }}>
            <MicOrb
              state={orb}
              level={voice.listening ? voice.level : undefined}
              onClick={() =>
                voice.listening
                  ? voice.listenEnd()
                  : voice.ttsSpeaking
                    ? (voice.hush(), setStatus(""))
                    : voice.listenStart("tap")
              }
            />
          </div>

          <div className="lorem-cmdbar" style={dockBeat(0.66)}>
            <input
              className={`kin${kOpen ? "" : " closed"}`}
              placeholder="type a question, press Enter"
              aria-label="Type a question"
              ref={kinRef}
              onKeyDown={(e) => {
                // Blur on both exits: the collapsed input is width:0, not
                // display:none, so it keeps DOM focus — and the window handler
                // ignores Space while an INPUT has focus, silently killing
                // push-to-talk after the first typed question.
                if (e.key === "Escape") {
                  setKOpen(false);
                  (e.target as HTMLInputElement).blur();
                  return;
                }
                if (e.key === "Enter") {
                  const el = e.target as HTMLInputElement;
                  const v = el.value.trim();
                  if (!v) return;
                  el.value = "";
                  el.blur();
                  setKOpen(false);
                  void ask(v);
                }
              }}
            />
            <button
              type="button"
              className="khint"
              onClick={() => {
                setKOpen((v) => {
                  if (!v) requestAnimationFrame(() => kinRef.current?.focus());
                  return !v;
                });
              }}
            >
              {touch ? "tap to type" : (
                <>
                  <kbd>{modK}</kbd> to type
                </>
              )}
            </button>
            <span className="ptthint" style={{ display: "var(--ptt, none)" }}>
              <kbd>Space</kbd> hold to talk
            </span>
          </div>
        </div>
      </div>

      {hint && (
        <div className="lorem-hintwrap" data-hint-pill>
          <div className="lorem-browserhint">
            <span>{hint}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setHint(null)}>
              &times;
            </button>
          </div>
        </div>
      )}

      {logOpen && (
        <div
          className="lorem-logov"
          role="dialog"
          aria-modal="true"
          aria-label="This conversation"
        >
          <div className="lorem-logov-head">
            <div className="lorem-logov-title">This conversation</div>
            <button
              ref={closeBtnRef}
              className="lorem-chip go"
              style={ctlStyle}
              onClick={() => setLogOpen(false)}
            >
              Close
            </button>
          </div>
          {/* Masked from Clarity replays: every visitor question lands here
              verbatim, plus the remembered name — see app/components/Clarity.tsx.
              The questions themselves are still readable server-side via
              /api/lorem, which is the right place to learn what people ask. */}
          <div className="lorem-logov-body" data-clarity-mask="True">
            {log.map((t, i) => (
              <button key={i} className="lorem-logrow" onClick={() => jumpTo(t)}>
                <span className="lorem-bubble u">{t.asked}</span>
                <span className="lorem-bubble them">{t.say}</span>
              </button>
            ))}
            {!log.length && (
              <div className="lorem-p" style={{ textAlign: "center", fontSize: 15 }}>
                Nothing yet &mdash; ask something first.
              </div>
            )}
            {greetedName && (
              // Storing someone's name without an obvious way to undo it is the
              // part that turns a nice touch into a creepy one.
              <div className="lorem-forget">
                I remember you as <b>{greetedName}</b>, in this browser only.{" "}
                <button
                  type="button"
                  onClick={() => {
                    forgetVisitor();
                    setGreetedName(undefined);
                  }}
                >
                  Forget me
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {gate && (
        // A real <button>: the div needed role, tabIndex and a hand-rolled
        // Enter/Space handler and still read as "generic, not keyboard-
        // focusable" in accessibility tooling. The element gives all of it
        // for free; the window-level handler still covers unfocused Enter/Space.
        <button
          type="button"
          className={`lorem-startgate${gone ? " gone" : ""}`}
          aria-label="Start the voice portfolio"
          // The fade must track the same pace as the 520ms unmount timer.
          style={{ transition: `opacity ${(0.5 / (pace || 1)).toFixed(2)}s` }}
          onClick={start}
        >
          {/* The same orb the visitor talks to for the rest of the session.
              `speaking` idle, deliberately NOT `listening`: the expanding ring
              is the "your mic is live" signal, and at the gate that would be a
              lie — nothing is captured until after the tap. Dark orb with
              gently breathing bars says alive-and-waiting without claiming a
              hot mic. (The gate used to show a glossy 3D blue ball: the only
              skeuomorphic object on a flat page, and a different object from
              the one the tap hands you.) */}
          <span
            ref={gateOrbRef}
            className="lorem-gateorb"
            style={{ visibility: fly ? "hidden" : undefined }}
          >
            <MicOrb state="speaking" decorative />
          </span>
          <div className="t">Tap to start</div>
          {/* Expectation-setting for everyone off Chrome. Names the actual
              difference rather than waving at "best experience": the live
              caption is driven solely by the Web Speech recognizer's onresult,
              which is Chrome's. Voice itself still works anywhere, because
              Scribe transcribes server-side. So both halves are literally true
              and the visitor can weigh them.

              It arrives on a beat of its own, ~0.9s after the gate settles,
              because motion on an otherwise still screen is what earns a look.
              A quiet grey line here got read as decoration. No dismiss control:
              tapping the gate is the dismissal, so it cannot nag.

              Absent on Chrome and on iOS — every iOS browser is WebKit, Chrome
              included, so the claim would have nothing behind it there. */}
          {notChrome && (
            <div className="gnote" style={entryBeat(0.9)} role="note">
              Voice works here. Chrome adds live captions.
            </div>
          )}
        </button>
      )}

      {/* The settle: on tap the gate orb doesn't vanish — it flies to the seat
          it occupies for the rest of the session, and only when it lands does
          Lorem start talking. A fixed-position clone does the travelling (the
          gate itself is fading), the dock's real orb stays hidden until
          touchdown, and the whole flight is skipped under reduced motion.

          The clone is laid out at the DESTINATION size and scaled up to the
          gate's, so the flight shrinks it into its seat as it goes. Both
          keyframes keep the same transform function list — translate then
          scale — so the browser interpolates component-wise instead of falling
          back to matrix decomposition, which visibly wobbles on a scale delta.

          Driven by the Web Animations API in an effect below rather than by a
          CSS transition armed from a second state flip. Both work in a real
          browser; WAAPI wins on having one animation object with an explicit
          cancel, and on not needing a second render or a requestAnimationFrame
          pair to get moving. The rAF version also stalls wherever rAF is
          throttled, which is a real condition (background tab, some embedded
          webviews) even though a visitor tapping the gate is by definition
          looking at the page. */}
      {fly && (
        <div
          ref={flyElRef}
          className="lorem-orbfly"
          style={{
            left: fly.x,
            top: fly.y,
            width: fly.w,
            height: fly.h,
            transform: `translate(0px, 0px) scale(${fly.scale})`,
          }}
        >
          <MicOrb state="speaking" decorative />
        </div>
      )}
    </div>
  );
}

const ctlStyle: CSSProperties = { fontFamily: "inherit", fontSize: 13, padding: "7px 14px" };
