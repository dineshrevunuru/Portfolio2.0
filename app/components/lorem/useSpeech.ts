"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MicState = "ok" | "denied" | "unsupported";
export type ListenMode = "hold" | "tap";

export type SpeechStatus =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";

export type SpeechFailure =
  | "no-speech"
  | "not-allowed"
  | "audio-capture"
  | "network"
  | "language-not-supported"
  | "unknown";

export interface UseSpeechOptions {
  lang?: string;
  /** Fires once per completed utterance (release Space / tap-to-send). */
  onFinal: (transcript: string) => void;
  /** Nothing usable was captured — drives "Didn't catch that". */
  onEmpty?: (reason: SpeechFailure) => void;
  /** Copy for the BrowserHint pill. */
  onHint?: (hint: string | null) => void;
  /** Master switch for TTS (the DC's `speak` prop). */
  speak?: boolean;
}

export interface UseSpeechApi {
  micState: MicState;
  /**
   * The browser's own permission prompt is open and waiting on the visitor.
   *
   * Not derivable from micState, whose three values all describe a settled
   * outcome. This is the unsettled middle: getUserMedia has been called and
   * nothing has come back. It exists so the UI can point at a dialog it cannot
   * see or style — the prompt is chrome, drawn outside the page, and a visitor
   * looking at a full-screen voice interface routinely misses it.
   */
  micPrompting: boolean;
  listening: boolean;
  /** Which mode the current/last capture used — drives truthful status copy. */
  listenMode: ListenMode;
  /** Scribe is transcribing the recording — brief, after release. */
  transcribing: boolean;
  /** Confirmed words — Caption `confirmed`. */
  confirmed: string;
  /** Uncertain tail — Caption `interim`. */
  interim: string;
  /** 0..1 — drives Aurora `energy` + MicOrb bars while listening. */
  level: number;
  /** 0..1 — live amplitude of Lorem's own voice while speaking. */
  outLevel: number;
  ttsSpeaking: boolean;
  /** Call from the StartGate click. Unlocks TTS + warms the mic. */
  unlock: () => Promise<void>;
  listenStart: (mode: ListenMode) => void;
  listenEnd: () => void;
  cancel: () => void;
  say: (text: string, onDone?: () => void) => void;
  hush: () => void;
}

const IS_IOS =
  typeof navigator !== "undefined" &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

function getCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

/** Can this browser capture audio for Scribe, even without SpeechRecognition? */
function canRecord() {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

/** First container both MediaRecorder and Scribe accept. Safari only does mp4. */
function pickMime(): string | undefined {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((t) => window.MediaRecorder?.isTypeSupported?.(t));
}

export function useSpeech(opts: UseSpeechOptions): UseSpeechApi {
  const { lang = "en-US", speak = true } = opts;

  // --- stale-closure guard: callbacks live in a ref, read at fire time -----
  const cb = useRef(opts);
  cb.current = opts;

  const [micState, setMicStateRaw] = useState<MicState>("ok");
  const [micPrompting, setMicPrompting] = useState(false);
  // The page registers its keydown handler once and captures `listenStart`
  // forever. Reading `micState` as state there would freeze whatever it was on
  // mount, so the live value lives in a ref and the setter keeps both in step.
  const micRef = useRef<MicState>("ok");
  const setMicState = useCallback((m: MicState) => {
    micRef.current = m;
    setMicStateRaw(m);
  }, []);

  const [listening, setListening] = useState(false);
  // Exposed so the page can label the two modes truthfully — "release to send"
  // is a lie when the visitor tapped the orb.
  const [listenMode, setListenModeState] = useState<ListenMode>("tap");
  const [confirmed, setConfirmed] = useState("");
  const [interim, setInterim] = useState("");
  const [level, setLevel] = useState(0.06);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);

  // --- imperative singletons; never state ---------------------------------
  const rec = useRef<SpeechRecognition | null>(null);
  const mode = useRef<ListenMode>("tap");
  const active = useRef(false);       // we *intend* to be listening
  const finalText = useRef("");       // accumulated isFinal transcript
  const sentFor = useRef(false);      // one onFinal per utterance
  const keepAlive = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlocked = useRef(false);

  // --- hosted TTS ----------------------------------------------------------
  // When a provider is configured server-side, Lorem speaks with a real voice
  // model instead of the browser synthesiser. The element is created during the
  // start-gate gesture so autoplay policy lets it play later without one.
  const hosted = useRef(false);
  /** In-flight capability probe. `say()` waits on it so the first utterance
   *  isn't decided before we know whether hosted voice exists. */
  const hostedProbe = useRef<Promise<unknown> | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  // --- hosted STT (ElevenLabs Scribe) --------------------------------------
  // The browser recognizer stays running when it exists, but only to drive the
  // live caption. Scribe transcribes the recorded audio and that transcript is
  // the one that reaches Claude — the browser's guess is a fallback, not truth.
  const sttHosted = useRef(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [transcribing, setTranscribing] = useState(false);
  /** Real output amplitude of Lorem's voice, 0..1 — drives the Aurora while
   *  speaking. A flat constant here is what made the wave field read as
   *  arbitrary: it has to move with the actual audio to mean anything. */
  const [outLevel, setOutLevel] = useState(0);
  const outNode = useRef<MediaElementAudioSourceNode | null>(null);
  const outRaf = useRef(0);
  const ttsFetch = useRef<AbortController | null>(null);
  const objectUrl = useRef<string | null>(null);

  // audio metering
  const ac = useRef<AudioContext | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const raf = useRef(0);

  // ------------------------------------------------------ voice capability
  // One probe on mount. The server reports only *whether* voice is hosted —
  // never which vendor, never whether a key merely exists — so a selected
  // provider with a missing key correctly reads as "browser".
  useEffect(() => {
    let cancelled = false;
    hostedProbe.current = Promise.all([
      fetch("/api/voice")
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (!cancelled && j && typeof j.hosted === "boolean") hosted.current = j.hosted;
        }),
      fetch("/api/stt")
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (!cancelled && j && typeof j.hosted === "boolean") {
            sttHosted.current = j.hosted;
            // Scribe only needs getUserMedia + MediaRecorder, so it makes voice
            // input work in browsers that have no SpeechRecognition at all.
            if (j.hosted && micRef.current === "unsupported" && canRecord()) setMicState("ok");
          }
        }),
    ]).catch(() => {
      /* stay on the browser stack */
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------- support
  useEffect(() => {
    if (!getCtor()) {
      setMicState("unsupported");
      // Without this, Firefox never proactively learns why voice is dead —
      // the status line changes but the hint pill (finding 11) stays unused.
      cb.current.onHint?.("Voice input isn't available in this browser. Type your question instead.");
      return;
    }
    if (!window.isSecureContext) {
      setMicState("unsupported");
      cb.current.onHint?.("Voice needs a secure (https) connection.");
      return;
    }
    let cancelled = false;
    let status: PermissionStatus | null = null;
    const onChange = () => {
      if (cancelled || !status) return;
      setMicState(status.state === "denied" ? "denied" : "ok");
    };
    // Chrome 64+/Firefox 132+/Safari 16+. Throws TypeError elsewhere.
    // Never prompts — 'prompt' means "unknown", not "denied".
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((s) => {
        if (cancelled) return;
        status = s;
        onChange();
        s.addEventListener("change", onChange);
      })
      .catch(() => {
        /* unsupported descriptor — stay optimistic, let start() decide */
      });
    return () => {
      cancelled = true;
      status?.removeEventListener("change", onChange);
    };
  }, []);

  // -------------------------------------------------------------- metering
  const stopMeter = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setLevel(0.06);
  }, []);

  /** Record from the meter's existing stream — never open the mic twice. */
  const startRecorder = useCallback((ms: MediaStream) => {
    if (!sttHosted.current || !canRecord()) return;
    try {
      const mimeType = pickMime();
      const mr = new MediaRecorder(ms, mimeType ? { mimeType } : undefined);
      chunks.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.current.push(e.data);
      };
      mr.start();
      recorder.current = mr;
    } catch {
      recorder.current = null; // fall back to the browser transcript
    }
  }, []);

  /** Stop and flush. Must run BEFORE stopMeter(), which kills the tracks. */
  const stopRecorder = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mr = recorder.current;
      recorder.current = null;
      if (!mr || mr.state === "inactive") return resolve(null);
      const done = () =>
        resolve(chunks.current.length ? new Blob(chunks.current, { type: mr.mimeType }) : null);
      mr.onstop = done;
      mr.onerror = () => resolve(null);
      try {
        mr.stop();
      } catch {
        resolve(null);
      }
      setTimeout(done, 1500); // some engines never fire onstop
    });
  }, []);

  const transcribe = useCallback(async (blob: Blob): Promise<string | null> => {
    try {
      const fd = new FormData();
      const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
      fd.append("audio", blob, `speech.${ext}`);
      const res = await fetch("/api/stt", { method: "POST", body: fd });
      if (!res.ok) return null;
      const j = (await res.json()) as { text?: string };
      return j.text?.trim() || null;
    } catch {
      return null;
    }
  }, []);

  const startMeter = useCallback(async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = ms;
      startRecorder(ms);
      ac.current ??= new AudioContext();
      if (ac.current.state === "suspended") await ac.current.resume();
      const src = ac.current.createMediaStreamSource(ms);
      const an = ac.current.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = Math.abs(buf[i] - 128) / 128;
          if (v > peak) peak = v;
        }
        setLevel((p) => p + (Math.min(1, peak * 2.6) - p) * 0.25);
        raf.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      /* metering is cosmetic — recognition still runs */
    }
  }, []);

  // ------------------------------------------------------------------- TTS
  /**
   * Bumped on every barge-in. `speechSynthesis.cancel()` fires the pending
   * utterance's `onend`, which would otherwise run the *previous* answer's
   * completion callback a beat after the caller has already moved on — blanking
   * the "Listening…" status the interruption just set. An utterance only gets to
   * report completion if it is still the current one.
   */
  const utterGen = useRef(0);

  /** Tap the TTS element through an analyser so the Aurora tracks Lorem's voice.
   *  createMediaElementSource can only run once per element, and once it does
   *  the element's audio is routed through the graph — so it MUST reach
   *  destination or playback goes silent. */
  const meterOutput = useCallback((el: HTMLAudioElement) => {
    if (outNode.current) return;
    try {
      ac.current ??= new AudioContext();
      const src = ac.current.createMediaElementSource(el);
      const an = ac.current.createAnalyser();
      an.fftSize = 256;
      src.connect(an);
      an.connect(ac.current.destination); // without this, Lorem is muted
      outNode.current = src;
      const buf = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = Math.abs(buf[i] - 128) / 128;
          if (v > peak) peak = v;
        }
        setOutLevel((p) => p + (Math.min(1, peak * 2.0) - p) * 0.14);
        outRaf.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      /* no analyser — the caller falls back to a static level */
    }
  }, []);

  const releaseUrl = useCallback(() => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  }, []);

  const hush = useCallback(() => {
    utterGen.current += 1;
    if (keepAlive.current) {
      clearInterval(keepAlive.current);
      keepAlive.current = null;
    }
    // Abort an in-flight synthesis request too — otherwise an interrupted turn
    // still gets billed and can arrive to play over the next one.
    ttsFetch.current?.abort();
    ttsFetch.current = null;
    const a = audio.current;
    if (a) {
      try {
        a.pause();
        a.removeAttribute("src");
        a.load();
      } catch {
        /* noop */
      }
    }
    releaseUrl();
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* noop */
    }
    setTtsSpeaking(false);
  }, [releaseUrl]);

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    const all = window.speechSynthesis?.getVoices?.() ?? [];
    if (!all.length) return null;
    const en = all.filter((v) => v.lang.replace("_", "-").startsWith(lang.slice(0, 2)));
    const pool = en.length ? en : all;
    // Prefer local: network voices are what hit Chrome's ~15s cutoff.
    return (
      pool.find((v) => v.localService && /Samantha|Natural|Neural/i.test(v.name)) ??
      pool.find((v) => v.localService) ??
      pool.find((v) => v.default) ??
      pool[0]
    );
  }, [lang]);

  /** The browser synthesiser — fallback, and the default when no provider is set. */
  const sayLocal = useCallback(
    (text: string, gen: number, onDone?: () => void) => {
      const synth = window.speechSynthesis;
      if (!synth) {
        onDone?.();
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 1.03;
      const v = pickVoice();
      if (v) u.voice = v;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        if (keepAlive.current) {
          clearInterval(keepAlive.current);
          keepAlive.current = null;
        }
        // Superseded by a barge-in — stay silent and let the new state stand.
        if (gen !== utterGen.current) return;
        setTtsSpeaking(false);
        onDone?.();
      };
      u.onend = finish;
      u.onerror = finish;
      setTtsSpeaking(true);
      synth.speak(u);
      // Chrome desktop silently stops network voices at ~15s. Nudge it.
      if (!IS_IOS) {
        keepAlive.current = setInterval(() => {
          if (!synth.speaking) return;
          synth.pause();
          synth.resume();
        }, 12000);
      }
    },
    [lang, pickVoice],
  );

  /**
   * Hosted voice. Synthesise server-side, play the audio, and fall back to the
   * browser on any failure — a portfolio that has gone silent because a vendor
   * is down is a worse outcome than one that sounds robotic for a turn.
   */
  const sayHosted = useCallback(
    async (text: string, gen: number, onDone?: () => void) => {
      const el = audio.current;
      if (!el) {
        sayLocal(text, gen, onDone);
        return;
      }
      const ctl = new AbortController();
      ttsFetch.current = ctl;
      setTtsSpeaking(true);
      try {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text }),
          signal: ctl.signal,
        });
        if (gen !== utterGen.current) return; // superseded while synthesising
        if (!res.ok) throw new Error(`voice ${res.status}`);
        const blob = await res.blob();
        if (gen !== utterGen.current) return;

        releaseUrl();
        const url = URL.createObjectURL(blob);
        objectUrl.current = url;

        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          if (gen !== utterGen.current) return;
          releaseUrl();
          setTtsSpeaking(false);
          onDone?.();
        };
        el.onended = finish;
        el.onerror = finish;
        el.src = url;
        await el.play();
      } catch (e) {
        if (ctl.signal.aborted || gen !== utterGen.current) return;
        console.warn("[voice] hosted synthesis failed, using browser speech", e);
        // Don't leave the flag set — sayLocal owns it from here.
        setTtsSpeaking(false);
        sayLocal(text, gen, onDone);
      }
    },
    [releaseUrl, sayLocal],
  );

  const say = useCallback(
    (text: string, onDone?: () => void) => {
      if (!speak || !unlocked.current) {
        onDone?.();
        return;
      }
      hush(); // barge-in: new input always wins
      const gen = utterGen.current;
      void (async () => {
        // The greeting is spoken the instant the gate is clicked, which can beat
        // the capability probe. Wait for it — but never stall speech on a hung
        // request; a late robotic greeting is better than a silent one.
        if (hostedProbe.current) {
          await Promise.race([
            hostedProbe.current,
            new Promise((r) => setTimeout(r, 1500)),
          ]).catch(() => {});
        }
        if (gen !== utterGen.current) return; // superseded while we waited
        if (hosted.current) await sayHosted(text, gen, onDone);
        else sayLocal(text, gen, onDone);
      })();
    },
    [speak, hush, sayHosted, sayLocal],
  );

  // -------------------------------------------------------------- unlock
  const unlock = useCallback(async () => {
    if (unlocked.current) return;
    unlocked.current = true;
    try {
      // Bank the gesture for hosted audio as well. Autoplay policy binds to the
      // element, so it has to be created AND played inside the gate click — a
      // zero-length silent WAV is enough to mark it as user-initiated.
      const el = audio.current ?? new Audio();
      // Assign BEFORE the await. start() fires unlock() without awaiting it and
      // speaks the greeting on the next line — anything set after an await here
      // lands too late, and the greeting silently falls back to the browser
      // synthesiser every single time.
      audio.current = el;
      meterOutput(el);
      el.preload = "auto";
      el.src =
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=";
      await el.play().catch(() => {
        /* some engines reject a zero-length clip; the activation still counts */
      });
      el.pause();
    } catch {
      /* hosted playback will fall back to the browser synthesiser */
    }
    try {
      // Consume the gesture for TTS: a silent utterance banks user activation.
      const u = new SpeechSynthesisUtterance("");
      u.volume = 0;
      window.speechSynthesis?.speak(u);
      window.speechSynthesis?.getVoices(); // Firefox lazy-loads on first call
    } catch {
      /* noop */
    }
    try {
      // Warm the mic so the first real start() isn't the one that prompts.
      //
      // Only flag "prompting" when the answer is genuinely unknown. A visitor
      // who already granted the mic gets no dialog, and pointing at a dialog
      // that is not there is worse than saying nothing. permissions.query is
      // itself optional (it throws outside Chrome 64+/FF 132+/Safari 16+), so
      // an unknown result falls through to showing the arrow, which is the
      // safe way round: a redundant arrow costs a glance, a missing one costs
      // the whole voice interaction.
      let willPrompt = true;
      try {
        const st = await navigator.permissions?.query({
          name: "microphone" as PermissionName,
        });
        if (st && st.state === "granted") willPrompt = false;
      } catch {
        /* query unsupported — assume a prompt is coming */
      }
      if (willPrompt) setMicPrompting(true);
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      ms.getTracks().forEach((t) => t.stop());
      setMicState("ok");
    } catch {
      setMicState("denied");
      // Browser-neutral: Safari and iOS don't put this in the address bar.
      cb.current.onHint?.("Mic is blocked. Allow it for this site, or press ⌘K to type.");
    } finally {
      // The prompt is gone either way — granted, denied, or dismissed.
      setMicPrompting(false);
    }
  }, [setMicState]);

  // ------------------------------------------------------------ recognizer
  // settle() reads the live interim via a ref, so the recognizer built on
  // mount stays correct forever — every value it touches is a ref or a
  // stable setter. This is what makes the singleton safe.
  const interimRef = useRef("");
  interimRef.current = interim;

  const settle = useCallback(() => {
    if (sentFor.current) return;
    sentFor.current = true;
    active.current = false;
    setListening(false);

    // Whatever the browser recognizer managed to hear. With Scribe on this is
    // only a fallback for when the upload fails — it is never preferred.
    const heard = finalText.current.trim() || interimRef.current.trim();

    if (!sttHosted.current || !recorder.current) {
      stopMeter();
      setInterim("");
      if (heard) cb.current.onFinal(heard);
      else cb.current.onEmpty?.("no-speech");
      return;
    }

    setTranscribing(true);
    void (async () => {
      const blob = await stopRecorder(); // must precede stopMeter — it ends the tracks
      stopMeter();
      setInterim("");
      const text = blob ? await transcribe(blob) : null;
      setTranscribing(false);
      const final = text ?? heard;
      if (final) cb.current.onFinal(final);
      else cb.current.onEmpty?.("no-speech");
    })();
  }, [stopMeter, stopRecorder, transcribe]);

  const build = useCallback((): SpeechRecognition | null => {
    const Ctor = getCtor();
    if (!Ctor) return null;
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = true;
    r.maxAlternatives = 1;
    // iOS/Chrome-Android ignore or choke on continuous. Push-to-talk is
    // short, so single-shot + our own stop() is both safer and equivalent.
    r.continuous = !IS_IOS;

    r.onresult = (e) => {
      let tail = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = res[0].transcript;
        if (res.isFinal) finalText.current += txt;
        else tail += txt;
      }
      setConfirmed(finalText.current.trim());
      setInterim(tail.trim());
    };

    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        active.current = false;
        setMicState("denied");
        cb.current.onHint?.("Mic is blocked. Allow it for this site, then try again.");
        return;
      }
      if (e.error === "aborted") return; // our own abort(); not a failure
      if (e.error === "no-speech") return; // handled in onend
      active.current = false;
      cb.current.onEmpty?.(e.error as SpeechFailure);
    };

    r.onend = () => {
      // Chrome ends the session on ~7s of silence even with continuous=true.
      // While the user still holds Space, that's a dropout — restart it.
      if (active.current && mode.current === "hold") {
        try {
          r.start();
          return;
        } catch {
          /* fall through to settle */
        }
      }
      settle();
    };
    return r;
  }, [lang, settle]);

  const listenStart = useCallback(
    (m: ListenMode) => {
      // Barge-in FIRST, above every guard. The orb is the only shut-up
      // affordance on the page; with the mic blocked, an early return before
      // hush() left Lorem talking through the visitor's interruption.
      hush();
      if (active.current) return;
      if (micRef.current !== "ok") {
        cb.current.onHint?.(
          micRef.current === "denied"
            ? "Mic is blocked. Allow it for this site, then try again."
            : "Voice input isn't available in this browser. Type your question instead.",
        );
        return;
      }
      rec.current ??= build(); // singleton: rebuilding causes the iOS chime
      // With Scribe on we only need the mic and a recorder, so a browser with
      // no SpeechRecognition (Firefox) still gets full voice input — it just
      // loses the live caption.
      if (!rec.current && !(sttHosted.current && canRecord())) {
        setMicState("unsupported");
        return;
      }
      mode.current = m;
      setListenModeState(m);
      active.current = true;
      sentFor.current = false;
      finalText.current = "";
      setConfirmed("");
      setInterim("");
      setListening(true);
      void startMeter();
      if (!rec.current) return; // Scribe-only path: the recorder is the capture
      try {
        rec.current.start();
      } catch {
        // InvalidStateError: already started. Recycle and retry once.
        try {
          rec.current.abort();
          rec.current.start();
        } catch {
          // The recognizer is optional when Scribe is on — losing it costs the
          // live caption, not the question.
          if (!sttHosted.current) {
            active.current = false;
            setListening(false);
            stopMeter();
          }
        }
      }
    },
    [micState, build, hush, startMeter, stopMeter],
  );

  const listenEnd = useCallback(() => {
    if (!active.current) return;
    active.current = false; // stops onend from auto-restarting
    try {
      rec.current?.stop(); // stop() flushes results; abort() discards them
    } catch {
      /* noop */
    }
    // With Scribe the recognizer may not exist at all, so settle() can't wait
    // on its onend — drive it directly. Guarded by sentFor, so a later onend
    // is a no-op.
    if (sttHosted.current && !rec.current) settle();
    else setTimeout(settle, 900); // Safari sometimes never fires onend
  }, [settle]);

  const cancel = useCallback(() => {
    active.current = false;
    sentFor.current = true; // suppress onFinal
    try {
      rec.current?.abort();
    } catch {
      /* noop */
    }
    setListening(false);
    setConfirmed("");
    setInterim("");
    try {
      recorder.current?.stop(); // discard: sentFor already suppressed onFinal
    } catch {
      /* noop */
    }
    recorder.current = null;
    chunks.current = [];
    setTranscribing(false);
    stopMeter();
    hush();
  }, [stopMeter, hush]);

  // ------------------------------------------------------------- teardown
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") cancel();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      // StrictMode remounts this in dev: abort + null the singleton so the
      // second mount builds a clean recognizer instead of inheriting a live one.
      try {
        rec.current?.abort();
      } catch {
        /* noop */
      }
      rec.current = null;
      active.current = false;
      stopMeter();
      hush(); // also aborts in-flight synthesis and revokes the audio blob URL
      audio.current = null;
      cancelAnimationFrame(outRaf.current);
      outNode.current = null;
      ac.current?.close().catch(() => {});
      ac.current = null;
    };
  }, [cancel, stopMeter, hush]);

  return {
    micState,
    micPrompting,
    listening,
    listenMode,
    transcribing,
    outLevel,
    confirmed,
    interim,
    level,
    ttsSpeaking,
    unlock,
    listenStart,
    listenEnd,
    cancel,
    say,
    hush,
  };
}
