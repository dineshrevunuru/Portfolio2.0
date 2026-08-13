'use client';

import { useEffect, useRef, useState } from 'react';
import { getServices, getDefaults, sendOtp, verifyOtp, book, chat, getSession, logout, getBookings, cancelBooking, type Service, type Slot, type CustomerBooking } from '@/lib/widget/api';
import { DateTimePicker } from './date-time-picker';
import { T } from './theme';
import { fmtDayLabel, fmtTime } from './dates';

/* ── ANONYMISED FOR THE PUBLIC SANDBOX ─────────────────────────────────────
 * The shipped widget carries the client's real name, street address and phone
 * number. This copy must not: the case study anonymises the client, and a
 * public demo that both publishes their phone number AND takes "bookings" is a
 * route to someone calling a real business about an appointment that does not
 * exist. These are the ONLY edits to this file — everything below is the
 * shipped component, unchanged.
 * ------------------------------------------------------------------------- */
const SALON_NAME = 'The studio';
const SALON_CITY = 'California';
const SALON_ADDRESS = 'the studio (address hidden in this demo)';
const PHONE = 'the studio directly';

const KEYFRAMES = `
@keyframes hssIn { from { transform: translate3d(0,6px,0); } to { transform: none; } }
@keyframes hssInFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes hssBlink { 0%, 60%, 100% { opacity: .25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
@keyframes hssCaret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
* { box-sizing: border-box; }
button { transition: transform var(--dur-quick, 200ms) var(--ease-morph, cubic-bezier(.4,0,.2,1)), opacity var(--dur-quick, 200ms) var(--ease-morph, cubic-bezier(.4,0,.2,1)), background var(--dur-quick, 200ms) var(--ease-morph, cubic-bezier(.4,0,.2,1)), box-shadow var(--dur-quick, 200ms) var(--ease-morph, cubic-bezier(.4,0,.2,1)), border-color var(--dur-quick, 200ms) var(--ease-morph, cubic-bezier(.4,0,.2,1)); }
/* The press itself must land within 100ms of the pointer; only the release eases. */
button:active:not(:disabled) { transition-duration: 60ms; }
button:active:not(:disabled) { transform: scale(0.97); }
button:disabled { opacity: .45; cursor: default; }
button:not(:disabled):hover { filter: brightness(0.98); }
/* Visible gold focus ring for keyboard users (accessibility). */
button:focus-visible, input:focus-visible, [tabindex]:focus-visible { outline: 3px solid #E7BF6D; outline-offset: 2px; border-radius: 10px; }
input:focus { border-color: #E7BF6D !important; }
input::placeholder { color: #9b9893; }
@media (prefers-reduced-motion: reduce) {
  /* Gentler, not zero: entrances still fade so a new message is still
     announced visually — they simply stop travelling. Loops stop dead. */
  @keyframes hssIn { from { transform: none; } to { transform: none; } }
  @keyframes hssBlink { 0%, 100% { opacity: .6; transform: none; } }
  *, *::before, *::after { animation-duration: 200ms !important; transition-duration: 200ms !important; }
}
`;

// ── Transcript + active-card model ─────────────────────────────────────
type ChipAction = 'book' | 'bookings' | 'services' | 'hours' | 'human' | { ask: string };
type Chip = { label: string; action: ChipAction };

type LogItem =
  | { id: number; kind: 'text'; who: 'user' | 'bot'; text: string }
  | { id: number; kind: 'chips'; chips: Chip[] }
  | { id: number; kind: 'done'; service: string; when: string; stylist?: string };

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
type LogItemInput = DistributiveOmit<LogItem, 'id'>;

type ActiveCard =
  | { kind: 'services'; services: Service[] }
  | { kind: 'overview'; services: Service[] }
  | { kind: 'detail'; service: Service }
  | { kind: 'consultCta'; service: Service }
  | { kind: 'choose'; services: Service[] }
  | { kind: 'datetime'; service: Service }
  | { kind: 'email' }
  | { kind: 'otp'; email: string }
  | { kind: 'name' }
  | { kind: 'phone' }
  | { kind: 'bookings'; data: { upcoming: CustomerBooking[]; past: CustomerBooking[] } }
  | { kind: 'cancelConfirm'; booking: CustomerBooking }
  | { kind: 'confirm' }
  | null;

type Booking = {
  service?: Service;
  slot?: Slot;
  dateLabel?: string;
  email?: string;
  token?: string;
  sessionToken?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  stylistName?: string; // auto-selected default (single stylist)
};

const QUICK_CHIPS: Chip[] = [
  { label: 'Book appointment', action: 'book' },
  { label: 'Our services', action: 'services' },
  { label: 'Hours & location', action: 'hours' },
  { label: 'Contact us', action: 'human' },
];

// Entry chips (greeting + after logout) — include account access ("My bookings").
const GREETING_CHIPS: Chip[] = [
  { label: 'Book appointment', action: 'book' },
  { label: 'My bookings', action: 'bookings' },
  { label: 'Our services', action: 'services' },
  { label: 'Hours & location', action: 'hours' },
  { label: 'Contact us', action: 'human' },
];

// Rotating example questions, typed out in the input placeholder.
const SUGGESTIONS_Q = [
  'Do hair systems work for swimming?',
  'How long does a first visit take?',
  'Where are you located?',
  'Do you work with women too?',
];

// Light phone validation — the salon is US-based; accept an optional country code
// (10–15 digits once non-digit characters are stripped).
function phoneDigits(v: string): string {
  return v.replace(/\D/g, '');
}
function isValidPhone(v: string): boolean {
  const d = phoneDigits(v);
  return d.length >= 10 && d.length <= 15;
}

// localStorage key for the persisted ~30-day session token (widget iframe origin).
const SESSION_KEY = 'hss:session';

export function ChatClient() {
  const [log, setLog] = useState<LogItem[]>([]);
  const [card, setCard] = useState<ActiveCard>(null);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [ph, setPh] = useState('Ask a question…');
  const [inputFocused, setInputFocused] = useState(false);
  const [streaming, setStreaming] = useState<string | null>(null);
  // The complete message being typed. A hidden copy of it sizes the bubble
  // BEFORE the first character lands, so the box never grows mid-stream.
  const [streamFull, setStreamFull] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  // Reveal a bot message character-by-character so the chat feels live.
  function typeOut(text: string): Promise<void> {
    return new Promise((resolve) => {
      const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { resolve(); return; }
      let i = 0;
      const total = text.length;
      const speed = total > 280 ? 5 : 2; // chars per tick (faster for long messages)
      setStreamFull(text);
      setStreaming('');
      const step = () => {
        i = Math.min(total, i + speed);
        setStreaming(text.slice(0, i));
        if (i >= total) { resolve(); return; }
        window.setTimeout(step, 16);
      };
      window.setTimeout(step, 120);
    });
  }

  const booking = useRef<Booking>({});
  const chatMsgs = useRef<unknown[]>([]);
  const chatState = useRef<string | undefined>(undefined);
  const idc = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gaClientId = useRef<string | undefined>(undefined);
  const convId = useRef<string>('');
  const servicesRef = useRef<Service[]>([]);
  // Persisted "remember me" session (restored from localStorage on load, or set after OTP).
  const sessionRef = useRef<{ token: string; email: string; firstName?: string; hasPhone: boolean } | null>(null);
  // Where to go after a standalone login (vs a login that's part of a booking).
  const afterAuthRef = useRef<null | 'bookings'>(null);

  // Where "Back" goes from the current step (null = no back available).
  function backTarget(c: ActiveCard): ActiveCard {
    if (!c) return null;
    switch (c.kind) {
      case 'choose':
      case 'detail':
      case 'consultCta':
      case 'datetime':
        return servicesRef.current.length ? { kind: 'overview', services: servicesRef.current } : null;
      case 'email':
        return booking.current.service ? { kind: 'datetime', service: booking.current.service } : null;
      case 'otp':
        return { kind: 'email' };
      default:
        return null;
    }
  }

  // Fire a GA4 usage event on the parent page (via embed.js).
  function track(name: string, params?: Record<string, unknown>) {
    try { window.parent?.postMessage({ type: 'hss:event', name, params: params ?? {} }, '*'); } catch { /* no parent */ }
  }

  // Ask the parent page (embed.js) to close the chat panel.
  function closeWidget() {
    track('tara_close');
    try { window.parent?.postMessage({ type: 'hss:close' }, '*'); } catch { /* no parent */ }
  }

  const nid = () => ++idc.current;
  const pushLog = (item: LogItemInput) => setLog((p) => [...p, { ...item, id: nid() } as LogItem]);
  const botSay = (text: string) => pushLog({ kind: 'text', who: 'bot', text });
  const userSay = (text: string) => pushLog({ kind: 'text', who: 'user', text });

  // Greeting on mount — restore any saved session FIRST (the widget is same-site, so
  // localStorage survives across visits), so we can greet a returning customer by name
  // and skip the email/code step for them.
  useEffect(() => {
    if (!convId.current) {
      convId.current = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    }
    track('tara_opened');
    (async () => {
      let name: string | undefined;
      let stored: string | null = null;
      try { stored = localStorage.getItem(SESSION_KEY); } catch { /* private mode */ }
      if (stored) {
        try {
          const res = await getSession(stored);
          if (res.data.authenticated && res.data.email) {
            sessionRef.current = {
              token: stored,
              email: res.data.email,
              firstName: res.data.customer?.firstName ?? undefined,
              hasPhone: Boolean(res.data.customer?.hasPhone),
            };
            setSignedIn(true);
            name = res.data.customer?.firstName ?? undefined;
          } else {
            try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
          }
        } catch { /* offline — treat as signed out */ }
      }
      const greeting = name
        ? `Welcome back, ${name}! I can help you book a new appointment, check an existing one, or answer any questions.`
        : "Hi, I'm Tara. I can help you book an appointment, or answer questions about the studio. What would you like to do?";
      await typeOut(greeting);
      pushLog({ kind: 'text', who: 'bot', text: greeting });
      setStreaming(null);
      pushLog({ kind: 'chips', chips: GREETING_CHIPS });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [log, card, aiThinking, streaming]);

  // Receive the GA client_id from the parent page (via embed.js) for accurate
  // Google Ads attribution on the server-side conversion.
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const d = e.data as { type?: string; clientId?: unknown };
      if (d && d.type === 'hss:ga' && typeof d.clientId === 'string') gaClientId.current = d.clientId;
    }
    window.addEventListener('message', onMsg);
    try { window.parent?.postMessage({ type: 'hss:ready' }, '*'); } catch { /* no parent */ }
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Typewriter example questions in the input placeholder (paused while typing/focused
  // and disabled for reduced-motion users).
  useEffect(() => {
    if (input || inputFocused) { setPh('Ask a question…'); return; }
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPh('Ask a question…'); return; }
    let pi = 0, ci = 0, dir = 1, cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (cancelled) return;
      const phrase = SUGGESTIONS_Q[pi];
      ci += dir;
      setPh('Try: ' + phrase.slice(0, ci));
      if (ci >= phrase.length) { dir = -1; t = setTimeout(tick, 1900); return; }
      if (ci <= 0) { dir = 1; pi = (pi + 1) % SUGGESTIONS_Q.length; }
      t = setTimeout(tick, dir > 0 ? 55 : 28);
    };
    t = setTimeout(tick, 900);
    return () => { cancelled = true; clearTimeout(t); };
  }, [input, inputFocused]);

  // ── Booking flow ─────────────────────────────────────────────────────
  async function startBooking() {
    if (busy) return;
    setBusy(true);
    try {
      // Resolve services + the default stylist/location (auto-selected — no picker
      // while there's a single stylist and a single branch).
      const [services, defaults] = await Promise.all([getServices(), getDefaults()]);
      servicesRef.current = services;
      booking.current.stylistName = defaults.stylist?.name;
      botSay('Which service would you like to book?');
      setCard({ kind: 'services', services });
    } catch {
      botSay(`Sorry, I couldn't load our services just now. Please contact ${PHONE}.`);
    } finally {
      setBusy(false);
    }
  }

  function pickService(s: Service) {
    booking.current.service = s;
    userSay(s.name);
    const who = booking.current.stylistName;
    botSay(
      who
        ? `Great choice. You'll be with ${who} at our ${SALON_CITY} studio. Pick a day and time that works for you.`
        : 'Great choice. Pick a day and time that works for you.',
    );
    setCard({ kind: 'datetime', service: s });
  }

  function openChoose(services: Service[]) {
    track('tara_choose_open');
    setCard({ kind: 'choose', services });
  }
  function openServices(services: Service[]) {
    setCard({ kind: 'services', services });
  }
  function openDetail(s: Service) {
    track('tara_service_detail', { service: s.name });
    setCard({ kind: 'detail', service: s });
  }

  // Tara (AI) hands off to the tap booking form. Pre-selects the service if known.
  async function launchBooking(serviceId?: string) {
    try {
      const list = servicesRef.current.length ? servicesRef.current : await getServices();
      servicesRef.current = list;
      if (!booking.current.stylistName) {
        const defaults = await getDefaults();
        booking.current.stylistName = defaults.stylist?.name;
      }
      const svc = serviceId ? list.find((s) => s.id === serviceId) : undefined;
      if (svc) {
        pickService(svc);
      } else {
        setCard({ kind: 'services', services: list });
      }
    } catch {
      botSay(`Sorry, I couldn't open the booking form. Please contact ${PHONE}.`);
    }
  }

  function pickSlot(slot: Slot, dateLabel: string) {
    booking.current.slot = slot;
    booking.current.dateLabel = dateLabel;
    booking.current.stylistName = slot.staff_name || booking.current.stylistName;
    userSay(dateLabel);
    const s = sessionRef.current;
    if (s) {
      // Already signed in (~30-day session) — no email/code needed; carry identity over.
      booking.current.email = s.email;
      booking.current.sessionToken = s.token;
      booking.current.firstName = s.firstName;
      if (s.hasPhone) {
        botSay("Perfect — let's confirm your booking.");
        setCard({ kind: 'confirm' });
      } else {
        botSay("Perfect. I just need a mobile number for reminders — what's the best one to reach you?");
        setCard({ kind: 'phone' });
      }
    } else {
      botSay("Perfect. What's your email? I'll send a quick 6-digit code to confirm it's really you.");
      setCard({ kind: 'email' });
    }
  }

  async function submitEmail(email: string) {
    setBusy(true);
    const res = await sendOtp(email);
    setBusy(false);
    if (!res.ok) {
      botSay(res.data.cooldownSeconds ? `Please wait a moment before requesting another code.` : (res.data.error || 'That email looks invalid, please try again.'));
      return;
    }
    booking.current.email = email;
    userSay(email);
    botSay(`I've emailed a 6-digit code to ${email}. Enter it below, it expires in 10 minutes.`);
    setCard({ kind: 'otp', email });
  }

  async function submitOtp(code: string) {
    const email = booking.current.email!;
    setBusy(true);
    const res = await verifyOtp(email, code);
    setBusy(false);
    if (!res.ok || !res.data.verificationToken) {
      botSay(res.data.error || 'That code is incorrect, please try again.');
      return;
    }
    booking.current.token = res.data.verificationToken;
    // Persist the session so they stay signed in (~30 days) and skip OTP next time.
    if (res.data.sessionToken) {
      booking.current.sessionToken = res.data.sessionToken;
      try { localStorage.setItem(SESSION_KEY, res.data.sessionToken); } catch { /* private mode */ }
      sessionRef.current = {
        token: res.data.sessionToken,
        email,
        firstName: res.data.customer?.firstName ?? undefined,
        hasPhone: Boolean(res.data.customer?.hasPhone),
      };
      setSignedIn(true);
    }
    // If this code was for a standalone login (My bookings / header Log in), go there.
    if (afterAuthRef.current === 'bookings') {
      afterAuthRef.current = null;
      userSay('••••••');
      botSay(`You're verified${res.data.customer?.firstName ? ', ' + res.data.customer.firstName : ''}!`);
      await showBookings();
      return;
    }
    userSay('••••••');
    if (res.data.customer?.exists) {
      booking.current.firstName = res.data.customer.firstName ?? undefined;
      const hi = `Welcome back${res.data.customer.firstName ? ', **' + res.data.customer.firstName + '**' : ''}`;
      if (res.data.customer.hasPhone) {
        botSay(`${hi}. Let's confirm your booking.`);
        setCard({ kind: 'confirm' });
      } else {
        // On file, but no mobile number — collect one before confirming so we can
        // send reminders and reach them if anything about the appointment changes.
        botSay(`${hi}! I don't have a mobile number on file for you. What's the best number to reach you? We use it for reminders and any updates about your appointment.`);
        setCard({ kind: 'phone' });
      }
    } else {
      botSay("You're verified! What's your name, and the best mobile number to reach you? We'll only use it for reminders and updates about your appointment.");
      setCard({ kind: 'name' });
    }
  }

  function submitName(firstName: string, lastName: string, phone: string) {
    booking.current.firstName = firstName;
    booking.current.lastName = lastName || undefined;
    booking.current.phone = phone || undefined;
    userSay([firstName, lastName].filter(Boolean).join(' '));
    setCard({ kind: 'confirm' });
  }

  // Returning customer who had no mobile number on file — captured just now.
  function submitPhone(phone: string) {
    booking.current.phone = phone;
    userSay(phone);
    botSay("Got it — your mobile number is saved. Let's confirm your booking.");
    setCard({ kind: 'confirm' });
  }

  async function confirmBooking() {
    const b = booking.current;
    if (!b.service || !b.slot || !b.email || (!b.token && !b.sessionToken)) return;
    setBusy(true);
    const res = await book({
      verificationToken: b.token,
      sessionToken: b.sessionToken,
      email: b.email,
      serviceId: b.service.id,
      slotStart: b.slot.slot_start,
      staffId: b.slot.staff_id,
      firstName: b.firstName,
      lastName: b.lastName,
      phone: b.phone,
      gaClientId: gaClientId.current,
      conversationId: convId.current,
    });
    setBusy(false);
    setCard(null);
    if (!res.ok) {
      botSay(res.data.error || `Something went wrong booking that. Please contact ${PHONE}.`);
      pushLog({ kind: 'chips', chips: QUICK_CHIPS });
      return;
    }
    // Tell the parent page so embed.js can fire the GA4 + Google Ads conversion
    // in the site's own context (best attribution).
    try {
      window.parent?.postMessage(
        {
          type: 'hss:conversion',
          transaction_id: res.data.appointmentId,
          value: b.service.price_cents / 100,
          currency: 'USD',
          service: b.service.name,
        },
        '*',
      );
    } catch { /* no parent */ }
    if (sessionRef.current && b.phone) sessionRef.current.hasPhone = true; // don't re-ask next time
    pushLog({ kind: 'done', service: b.service.name, when: `${b.dateLabel}`, stylist: b.stylistName });
    booking.current = {};
    pushLog({ kind: 'chips', chips: [{ label: 'Book another', action: 'book' }, { label: 'Ask a question', action: { ask: '' } }] });
  }

  // ── My Account ─────────────────────────────────────────────────────────
  // Begin a standalone login (not part of a booking); after the code, go to `after`.
  function startLogin(after: 'bookings') {
    afterAuthRef.current = after;
    botSay("First, let's make sure it's you. What's your email? I'll send a quick 6-digit code.");
    setCard({ kind: 'email' });
  }

  // Header "Log in" tap.
  function headerLogin() {
    if (busy || aiThinking) return;
    setCard(null);
    userSay('Log in');
    startLogin('bookings');
  }

  // Fetch + show the signed-in customer's bookings (logs in first if there's no session).
  async function showBookings(announce = true) {
    const s = sessionRef.current;
    if (!s) { startLogin('bookings'); return; }
    setBusy(true);
    const res = await getBookings(s.token);
    setBusy(false);
    if (res.status === 401) {
      // Session expired/revoked — clear and re-authenticate.
      sessionRef.current = null;
      setSignedIn(false);
      try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      startLogin('bookings');
      return;
    }
    if (!res.ok) {
      botSay(res.data.error || `Sorry, I couldn't load your bookings just now. Please contact ${PHONE}.`);
      pushLog({ kind: 'chips', chips: QUICK_CHIPS });
      return;
    }
    const upcoming = res.data.upcoming ?? [];
    const past = res.data.past ?? [];
    if (upcoming.length === 0 && past.length === 0) {
      botSay("You don't have any appointments yet. Want to book one?");
      pushLog({ kind: 'chips', chips: [{ label: 'Book appointment', action: 'book' }] });
      return;
    }
    if (announce) botSay(upcoming.length ? 'Here are your appointments.' : 'Here are your past appointments.');
    setCard({ kind: 'bookings', data: { upcoming, past } });
  }

  // "My bookings" chip / intent.
  function openBookings() {
    if (busy || aiThinking) return;
    setCard(null);
    userSay('My bookings');
    showBookings();
  }

  // Cancellation is destructive — always confirm first.
  function askCancel(b: CustomerBooking) {
    setCard({ kind: 'cancelConfirm', booking: b });
  }

  async function confirmCancel(b: CustomerBooking) {
    const s = sessionRef.current;
    if (!s) { startLogin('bookings'); return; }
    setBusy(true);
    const res = await cancelBooking(s.token, b.id);
    setBusy(false);
    setCard(null);
    if (!res.ok) {
      botSay(res.data.error || `Sorry, I couldn't cancel that. Please contact ${PHONE}.`);
      await showBookings(false); // silently re-show so they can try again
      return;
    }
    // Cancelled — offer the rebook path (we don't do a separate "reschedule";
    // cancel + book a new time is the flow).
    botSay(`Done — your ${b.serviceName ?? 'appointment'} on ${b.whenLabel} is cancelled. Want to book a new time?`);
    pushLog({ kind: 'chips', chips: [{ label: 'Book a new appointment', action: 'book' }, { label: 'My bookings', action: 'bookings' }] });
  }

  // "Keep it" on the confirm — silently re-show the bookings list (no re-announce).
  function keepBooking() {
    showBookings(false);
  }

  // Sign out — revoke the session, forget it locally, and reset the chat to a clean,
  // unmistakably signed-out state (clears the transcript — no stale name or booking).
  async function doLogout() {
    const t = sessionRef.current?.token;
    sessionRef.current = null;
    booking.current = {};
    afterAuthRef.current = null;
    setSignedIn(false);
    setCard(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    if (t) { try { await logout(t); } catch { /* best-effort */ } }
    setLog([]);
    pushLog({ kind: 'text', who: 'bot', text: "You've been signed out. You can book anytime — I'll send a quick code when you need to verify it's you." });
    pushLog({ kind: 'chips', chips: GREETING_CHIPS });
  }

  // ── Quick info / AI ──────────────────────────────────────────────────
  async function doServices() {
    if (busy) return;
    setBusy(true);
    userSay('Our services');
    try {
      const [services, defaults] = await Promise.all([getServices(), getDefaults()]);
      servicesRef.current = services;
      booking.current.stylistName = defaults.stylist?.name;
      botSay("Here's what we offer. Tap a service to learn more, or ask me anything about them.");
      setCard({ kind: 'overview', services });
    } catch {
      botSay(`Sorry, I couldn't load our services just now. Please contact ${PHONE}.`);
    } finally {
      setBusy(false);
    }
  }

  function doHours() {
    userSay('Hours & location');
    botSay(`We're open every day, 9 AM to 5 PM, at ${SALON_ADDRESS}. Contact ${PHONE} anytime.`);
    pushLog({ kind: 'chips', chips: QUICK_CHIPS });
  }

  function doHuman() {
    userSay('Contact us');
    botSay(`Of course, our team is happy to help. Contact ${PHONE}. (Real contact details are withheld in this demo.)`);
    pushLog({ kind: 'chips', chips: QUICK_CHIPS });
  }

  async function askAI(text: string, opts?: { suppressChips?: boolean }): Promise<{ booked: boolean }> {
    if (!text.trim() || aiThinking) return { booked: false };
    setCard(null); // asking a question is a deliberate move — drop any pinned card so the answer is visible
    track('tara_question');
    userSay(text);
    setAiThinking(true);
    chatMsgs.current.push({ role: 'user', content: text });
    let booked = false;
    try {
      const res = await chat(chatMsgs.current, chatState.current, convId.current);
      setAiThinking(false);
      if (!res.ok || !res.data.reply) {
        botSay(res.data.error || `Sorry, I had trouble with that. Please contact ${PHONE}.`);
      } else {
        chatMsgs.current = (res.data.messages as unknown[]) ?? chatMsgs.current;
        chatState.current = res.data.state;
        await typeOut(res.data.reply); // live-typing reveal
        botSay(res.data.reply);
        setStreaming(null);
        if (res.data.action?.type === 'start_booking') {
          booked = true;
          await launchBooking(res.data.action.serviceId);
        } else if (!opts?.suppressChips) {
          const sugg = res.data.suggestions ?? [];
          const chips: Chip[] = sugg.length ? sugg.map((s) => ({ label: s, action: { ask: s } })) : QUICK_CHIPS;
          pushLog({ kind: 'chips', chips });
        }
      }
    } catch {
      botSay(`Connection problem, please try again or contact ${PHONE}.`);
    } finally {
      setAiThinking(false);
      setStreaming(null);
    }
    return { booked };
  }

  // "Tell me more" about a service: close the (now-stale) card, let Tara explain
  // live, then surface the free-consultation checkout card (likely a new customer).
  async function tellMeMore(service: Service) {
    setCard(null);
    const { booked } = await askAI(`Tell me about your "${service.name}" service, and whether it's right for me.`, { suppressChips: true });
    if (!booked) setCard({ kind: 'consultCta', service });
  }

  function runChip(action: ChipAction) {
    track('tara_intent', { intent: typeof action === 'string' ? action : 'ask' });
    setCard(null); // tapping a chip is a deliberate navigation — drop any pinned card
    if (action === 'book') startBooking();
    else if (action === 'bookings') openBookings();
    else if (action === 'services') doServices();
    else if (action === 'hours') doHours();
    else if (action === 'human') doHuman();
    else if (typeof action === 'object') {
      if (action.ask) askAI(action.ask);
      else { setInput(''); document.getElementById('hss-input')?.focus(); }
    }
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      <style>{KEYFRAMES}</style>
      <header style={S.header}>
        <Avatar />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.hTitle}>Tara</div>
          <div style={S.hSub}>AI booking assistant</div>
        </div>
        <button onClick={signedIn ? doLogout : headerLogin} style={S.logoutBtn} aria-label={signedIn ? 'Log out' : 'Log in'}>
          {signedIn ? 'Log out' : 'Log in'}
        </button>
        <button onClick={closeWidget} style={S.closeBtn} aria-label="Close chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* data-clarity-mask: Microsoft Clarity records session replays, and this
          transcript is ordinary DOM text, so it IS captured — unlike the input
          boxes below, which Clarity masks in every mode and cannot be
          configured to reveal. Clarity's default Balanced mode masks numbers and
          email addresses but not a plain first name, and the confirmation step
          echoes the visitor's name back into a bubble here. Masking the whole
          log is the honest call: the useful signal from this demo is where
          people drop out, which the heatmap and the funnel give us without
          reading anyone's booking back to them. The attribute overrides the
          dashboard setting, so this holds even if the project is later set to
          Relaxed. */}
      <div ref={scrollRef} data-clarity-mask="True" style={S.scroll} role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation with Tara">
        {log.map((it) => <LogRow key={it.id} item={it} onChip={runChip} />)}
        {aiThinking && <Bubble who="bot"><TypingDots /></Bubble>}
        {streaming !== null && (
          <Bubble who="bot">
              {/* The bubble is shrink-to-fit up to 82%, so streaming text used to
                  resize it on every tick and re-wrap the lines underneath — words
                  jumped between rows the moment the message passed one line. The
                  hidden full-text copy reserves the final width and height; the
                  live text is overlaid on it and wraps identically, so nothing
                  moves while it types. */}
              <span style={S.streamWrap}>
                <span style={S.streamGhost} aria-hidden="true">{renderRich(streamFull)}</span>
                <span style={S.streamLive}>
                  {renderRich(streaming, <span style={S.caret} aria-hidden="true" />)}
                </span>
              </span>
            </Bubble>
        )}
        {card && (() => {
          const back = backTarget(card);
          return (
            <div style={{ ...S.enter, marginTop: 6 }}>
              {back && (
                <button onClick={() => setCard(back)} style={S.backBtn} aria-label="Go back a step">
                  &larr; Back
                </button>
              )}
              <ActiveCardView card={card} busy={busy}
                onService={pickService} onSlot={pickSlot}
                onEmail={submitEmail} onOtp={submitOtp} onName={submitName} onPhone={submitPhone}
                booking={booking.current} onConfirm={confirmBooking}
                onCancel={askCancel} onConfirmCancel={confirmCancel} onKeepBooking={keepBooking}
                onChoose={openChoose} onSeeAll={openServices}
                onDetail={openDetail} onAsk={askAI} onLearnMore={tellMeMore}
                consultService={servicesRef.current.find((s) => /consultation/i.test(s.name))}
                onTrack={(key) => track('tara_choose', { path: key })} />
            </div>
          );
        })()}
      </div>

      <form style={S.inputBar} onSubmit={(e) => { e.preventDefault(); askAI(input); setInput(''); }}>
        <input id="hss-input" style={S.input} value={input} onChange={(e) => setInput(e.target.value)}
          onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
          placeholder={ph} disabled={aiThinking} aria-label="Ask Tara a question" enterKeyHint="send" />
        <button type="submit" style={S.send} disabled={aiThinking || !input.trim()} aria-label="Send message">
          <SendIcon />
        </button>
      </form>
    </div>
  );
}

// ── Transcript rows ────────────────────────────────────────────────────
function LogRow({ item, onChip }: { item: LogItem; onChip: (a: ChipAction) => void }) {
  if (item.kind === 'text') return <Bubble who={item.who}>{renderRich(item.text)}</Bubble>;
  if (item.kind === 'chips')
    return (
      <div style={{ ...S.enter, display: 'flex', flexWrap: 'wrap', gap: 8, margin: '6px 0 8px' }}>
        {item.chips.map((c, i) => (
          <button key={i} onClick={() => onChip(c.action)} style={S.chip}>{c.label}</button>
        ))}
      </div>
    );
  // done
  return (
    <div style={{ ...S.enter, ...S.doneCard }}>
      <CheckIcon />
      <div style={{ fontWeight: 600, fontSize: 16, color: T.ink, margin: '10px 0 6px' }}>You&rsquo;re booked</div>
      <div style={{ fontSize: 14, color: T.ink }}>{item.service}{item.stylist ? ` with ${item.stylist}` : ''}</div>
      <div style={{ fontSize: 14, color: T.muted, marginTop: 2 }}>{item.when}</div>
      <div style={{ fontSize: 13, color: T.muted, marginTop: 12, lineHeight: 1.5 }}>See you at {SALON_ADDRESS}</div>
    </div>
  );
}

function Bubble({ who, children }: { who: 'user' | 'bot'; children: React.ReactNode }) {
  return (
    <div style={{ ...S.enter, display: 'flex', justifyContent: who === 'user' ? 'flex-end' : 'flex-start', margin: '6px 0' }}>
      <div style={{ ...S.bubble, ...(who === 'user' ? S.userB : S.botB) }}>{children}</div>
    </div>
  );
}

function Avatar() {
  // Monogram shows by default; Tara's photo fades in on top once it loads.
  // Drop a square photo at chatbot/public/tara.png to use it — no code change needed.
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const ring = '0 0 0 2px rgba(255,255,255,0.25)';
  // Catch images that were already complete before onLoad could attach (cache).
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);
  return (
    <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: T.gold, color: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 19, boxShadow: ring }}>
        T
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/tara.png"
        alt="Tara"
        onLoad={() => setLoaded(true)}
        style={{ position: 'absolute', inset: 0, width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', boxShadow: ring, opacity: loaded ? 1 : 0, transition: 'opacity .2s' }}
      />
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', height: 18 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: T.faint, animation: `hssBlink 1.2s ${i * 0.18}s infinite linear` }} />
      ))}
    </span>
  );
}

function CheckIcon() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: T.teal }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

function SendIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#002526" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  );
}

// minimal markdown: **bold** + newlines + "- " bullets
// `trailing` is appended INSIDE the final line rather than after the whole
// block. Every line here is a <div>, so a caret rendered as a sibling of the
// output landed on its own line under the text — the typing cursor appeared to
// have fallen off the end of the sentence.
function renderRich(text: string, trailing?: React.ReactNode): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, li) => {
    const l = line.replace(/^\s*[-*]\s+/, '• ');
    const parts = l.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
    );
    return (
      <div key={li}>
        {parts}
        {trailing && li === lines.length - 1 ? trailing : null}
      </div>
    );
  });
}

// ── Active card ────────────────────────────────────────────────────────
function ActiveCardView(props: {
  card: NonNullable<ActiveCard>; busy: boolean; booking: Booking;
  onService: (s: Service) => void; onSlot: (slot: Slot, label: string) => void;
  onEmail: (e: string) => void; onOtp: (c: string) => void; onName: (f: string, l: string, p: string) => void;
  onPhone: (p: string) => void;
  onConfirm: () => void;
  onCancel: (b: CustomerBooking) => void;
  onConfirmCancel: (b: CustomerBooking) => void;
  onKeepBooking: () => void;
  onChoose: (services: Service[]) => void; onSeeAll: (services: Service[]) => void; onTrack: (key: string) => void;
  onDetail: (s: Service) => void; onAsk: (q: string) => void; onLearnMore: (s: Service) => void;
  consultService?: Service;
}) {
  const { card } = props;
  if (card.kind === 'services')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => props.onChoose(card.services)} style={S.chooseTop}>
          Not sure which one? Help me choose
        </button>
        {card.services.map((s) => (
          <button key={s.id} onClick={() => props.onService(s)} style={S.serviceCard}>
            <div style={{ fontWeight: 600, fontSize: 15, color: T.ink }}>{s.name}</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>
              {s.duration_minutes} min &middot; {s.price_cents === 0 ? 'Free' : `$${(s.price_cents / 100).toFixed(0)}`}
            </div>
          </button>
        ))}
      </div>
    );
  if (card.kind === 'overview')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => props.onChoose(card.services)} style={S.chooseTop}>
          Not sure which one? Help me choose
        </button>
        {card.services.map((s) => (
          <button key={s.id} onClick={() => props.onDetail(s)} style={S.serviceCard} aria-label={`Learn more about ${s.name}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: T.ink }}>{s.name}</div>
              <div style={{ fontSize: 13, color: T.gold, fontWeight: 600, whiteSpace: 'nowrap' }}>Learn more &rsaquo;</div>
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>
              {s.duration_minutes} min &middot; {s.price_cents === 0 ? 'Free' : `$${(s.price_cents / 100).toFixed(0)}`}
            </div>
            {s.description ? (
              <div style={{ fontSize: 13, color: T.muted, marginTop: 6, lineHeight: 1.5 }}>{s.description}</div>
            ) : null}
          </button>
        ))}
      </div>
    );

  if (card.kind === 'detail') {
    const s = card.service;
    const price = s.price_cents === 0 ? 'Free' : `$${(s.price_cents / 100).toFixed(0)}`;
    return (
      <div style={S.detailCard}>
        <div style={{ fontWeight: 700, fontSize: 17, color: T.ink }}>{s.name}</div>
        <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>{s.duration_minutes} min &middot; {price}</div>
        {s.description ? (
          <div style={{ fontSize: 15, color: T.ink, marginTop: 12, lineHeight: 1.6 }}>{s.description}</div>
        ) : null}
        <button
          onClick={() => props.onLearnMore(s)}
          style={{ ...S.primary, width: '100%', marginTop: 16 }}
        >
          Tell me more
        </button>
        <button onClick={() => props.onService(s)} style={{ ...S.secondaryBtn, width: '100%', marginTop: 8 }}>
          Book this service
        </button>
      </div>
    );
  }

  if (card.kind === 'consultCta') {
    const orig = card.service;
    const consult = props.consultService;
    const isConsult = consult && consult.id === orig.id;
    return (
      <div style={{ ...S.detailCard, background: T.surface }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: T.ink }}>New to hair systems?</div>
        <div style={{ fontSize: 14, color: T.muted, marginTop: 6, lineHeight: 1.5 }}>
          A free Consultation is the best first step. Thuy will look at what you need and help you choose what&rsquo;s right for you, with no pressure.
        </div>
        {consult ? (
          <button onClick={() => props.onService(consult)} style={{ ...S.primary, width: '100%', marginTop: 14 }}>
            Book a free Consultation
          </button>
        ) : null}
        {!isConsult ? (
          <button onClick={() => props.onService(orig)} style={{ ...S.chooseLink, width: '100%', textAlign: 'center' }}>
            Or book {orig.name}
          </button>
        ) : null}
      </div>
    );
  }

  if (card.kind === 'choose')
    return (
      <ChooseHelper
        services={card.services}
        onPick={props.onService}
        onSeeAll={() => props.onSeeAll(card.services)}
        onTrack={props.onTrack}
      />
    );
  if (card.kind === 'datetime')
    return (
      <DateTimePicker
        serviceId={card.service.id}
        onPick={props.onSlot}
        context={[props.booking.stylistName, `${SALON_CITY} studio`].filter(Boolean).join('  ·  ')}
      />
    );
  if (card.kind === 'email') return <EmailForm busy={props.busy} onSubmit={props.onEmail} />;
  if (card.kind === 'otp') return <OtpForm busy={props.busy} onSubmit={props.onOtp} />;
  if (card.kind === 'name') return <NameForm busy={props.busy} onSubmit={props.onName} />;
  if (card.kind === 'phone') return <PhoneForm busy={props.busy} onSubmit={props.onPhone} />;
  if (card.kind === 'bookings') return <BookingsCard data={card.data} onCancel={props.onCancel} />;
  if (card.kind === 'cancelConfirm') {
    const cb = card.booking;
    return (
      <div style={S.confirmCard}>
        <div style={{ fontWeight: 600, fontSize: 15, color: T.ink, marginBottom: 6 }}>Cancel this appointment?</div>
        <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.5 }}>{cb.serviceName ?? 'Appointment'} · {cb.whenLabel}</div>
        <button onClick={() => props.onConfirmCancel(cb)} disabled={props.busy} style={{ ...S.primary, width: '100%', marginTop: 14, background: T.error, color: '#fff' }}>
          {props.busy ? 'Cancelling…' : 'Yes, cancel it'}
        </button>
        <button onClick={props.onKeepBooking} disabled={props.busy} style={{ ...S.secondaryBtn, width: '100%', marginTop: 8 }}>Keep it</button>
      </div>
    );
  }
  // confirm
  const b = props.booking;
  const priceLabel = b.service ? (b.service.price_cents === 0 ? 'Free' : `$${(b.service.price_cents / 100).toFixed(0)}`) : '';
  return (
    <div style={S.confirmCard}>
      <div style={{ fontWeight: 600, fontSize: 15, color: T.ink, marginBottom: 12 }}>Confirm your booking</div>
      <Row k="Service" v={b.service?.name ?? ''} />
      {b.stylistName ? <Row k="Stylist" v={b.stylistName} /> : null}
      <Row k="When" v={b.dateLabel ?? ''} />
      <Row k="Location" v={`${SALON_NAME}, ${SALON_CITY}`} />
      <Row k="Price" v={priceLabel} />
      <button onClick={props.onConfirm} disabled={props.busy} style={{ ...S.primary, width: '100%', marginTop: 14 }}>
        {props.busy ? 'Booking…' : 'Confirm booking'}
      </button>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, padding: '5px 0' }}>
      <span style={{ color: T.muted }}>{k}</span><span style={{ fontWeight: 600, color: T.ink, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function ChooseHelper({
  services, onPick, onSeeAll, onTrack,
}: { services: Service[]; onPick: (s: Service) => void; onSeeAll: () => void; onTrack: (key: string) => void }) {
  const [view, setView] = useState<'q1' | 'q2' | 'rec'>('q1');
  const [rec, setRec] = useState<{ msg: string; picks: Service[] } | null>(null);

  // Tolerant lookup: exact name first, else the first whose name contains the
  // keyword (so it survives catalog renames like "Consultation" -> "Free Consultation").
  const find = (q: string) =>
    services.find((s) => s.name.toLowerCase() === q.toLowerCase()) ??
    services.find((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  function recommend(key: string, msg: string, names: string[]) {
    const picks = names.map(find).filter(Boolean) as Service[];
    onTrack(key);
    setRec({ msg, picks });
    setView('rec');
  }

  if (view === 'q1') {
    return (
      <div style={S.chooseCard}>
        <div style={S.chooseQ}>Is this your first hair system, or do you already wear one?</div>
        <div style={S.chooseChips}>
          <button
            style={S.chooseChip}
            onClick={() => recommend('first_time', "Since it's your first time, I'd start with a free Consultation. Thuy will help you find the right system for you.", ['Free Consultation'])}
          >
            It&rsquo;s my first time
          </button>
          <button style={S.chooseChip} onClick={() => setView('q2')}>I already wear one</button>
        </div>
        <button style={S.chooseLink} onClick={onSeeAll}>See all services</button>
      </div>
    );
  }

  if (view === 'q2') {
    return (
      <div style={S.chooseCard}>
        <div style={S.chooseQ}>Great. What would you like today?</div>
        <div style={S.chooseChips}>
          <button style={S.chooseChip} onClick={() => recommend('maintenance', 'Here are the options to maintain your current system.', ['Hair System Service', 'Hair System Service + Color'])}>Maintenance or reapply</button>
          <button style={S.chooseChip} onClick={() => recommend('color', 'Here are the color options.', ['Color', 'Hair System Service + Color'])}>Color refresh</button>
          <button style={S.chooseChip} onClick={() => recommend('new_system', "Here are the options for a new system. A free Consultation is also a good idea if you'd like guidance first.", ['New Hair System Service (bring', 'Full Service'])}>A brand new system</button>
        </div>
        <button style={S.chooseLink} onClick={onSeeAll}>See all services</button>
      </div>
    );
  }

  // recommendation
  return (
    <div style={S.chooseCard}>
      {rec?.msg && <div style={S.chooseQ}>{rec.msg}</div>}
      {rec && rec.picks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rec.picks.map((s) => (
            <button key={s.id} onClick={() => onPick(s)} style={S.serviceCard}>
              <div style={{ fontWeight: 600, fontSize: 15, color: T.ink }}>{s.name}</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>
                {s.duration_minutes} min &middot; {s.price_cents === 0 ? 'Free' : `$${(s.price_cents / 100).toFixed(0)}`}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: T.muted }}>Let me show you all our services.</div>
      )}
      <button style={S.chooseLink} onClick={onSeeAll}>See all services</button>
    </div>
  );
}

function EmailForm({ busy, onSubmit }: { busy: boolean; onSubmit: (e: string) => void }) {
  const [v, setV] = useState('');
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  return (
    <form style={S.formCard} onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(v); }}>
      <input type="email" autoFocus value={v} onChange={(e) => setV(e.target.value)} placeholder="you@email.com" style={S.field} />
      <button type="submit" disabled={!valid || busy} style={S.primary}>{busy ? 'Sending…' : 'Send code'}</button>
    </form>
  );
}

function OtpForm({ busy, onSubmit }: { busy: boolean; onSubmit: (c: string) => void }) {
  const [v, setV] = useState('');
  useEffect(() => { if (v.length === 6) onSubmit(v); /* eslint-disable-next-line */ }, [v]);
  return (
    <form style={S.formCard} onSubmit={(e) => { e.preventDefault(); if (v.length === 6) onSubmit(v); }}>
      <input inputMode="numeric" autoFocus maxLength={6} value={v}
        onChange={(e) => setV(e.target.value.replace(/\D/g, ''))}
        placeholder="6-digit code" style={{ ...S.field, letterSpacing: 6, textAlign: 'center', fontSize: 18 }} />
      <button type="submit" disabled={v.length !== 6 || busy} style={S.primary}>{busy ? 'Verifying…' : 'Verify'}</button>
    </form>
  );
}

function NameForm({ busy, onSubmit }: { busy: boolean; onSubmit: (f: string, l: string, p: string) => void }) {
  const [f, setF] = useState(''); const [l, setL] = useState(''); const [p, setP] = useState('');
  const phoneOk = isValidPhone(p);
  const ready = Boolean(f.trim()) && phoneOk;
  return (
    <form style={{ ...S.formCard, flexDirection: 'column', alignItems: 'stretch', gap: 8 }}
      onSubmit={(e) => { e.preventDefault(); if (ready) onSubmit(f.trim(), l.trim(), p.trim()); }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input autoFocus value={f} onChange={(e) => setF(e.target.value)} placeholder="First name" style={{ ...S.field, flex: 1 }} />
        <input value={l} onChange={(e) => setL(e.target.value)} placeholder="Last name (optional)" style={{ ...S.field, flex: 1 }} />
      </div>
      <input inputMode="tel" value={p} onChange={(e) => setP(e.target.value)} placeholder="Mobile number" aria-label="Mobile number" style={S.field} />
      {p && !phoneOk ? <div style={S.fieldHint}>Please enter a valid mobile number.</div> : null}
      <button type="submit" disabled={!ready || busy} style={S.primary}>Continue</button>
    </form>
  );
}

function PhoneForm({ busy, onSubmit }: { busy: boolean; onSubmit: (p: string) => void }) {
  const [p, setP] = useState('');
  const phoneOk = isValidPhone(p);
  return (
    <form style={{ ...S.formCard, flexDirection: 'column', alignItems: 'stretch', gap: 8 }}
      onSubmit={(e) => { e.preventDefault(); if (phoneOk) onSubmit(p.trim()); }}>
      <input inputMode="tel" autoFocus value={p} onChange={(e) => setP(e.target.value)} placeholder="Mobile number" aria-label="Mobile number" style={S.field} />
      {p && !phoneOk ? <div style={S.fieldHint}>Please enter a valid mobile number.</div> : null}
      <button type="submit" disabled={!phoneOk || busy} style={S.primary}>Continue</button>
    </form>
  );
}

function BookingsCard({ data, onCancel }: { data: { upcoming: CustomerBooking[]; past: CustomerBooking[] }; onCancel: (b: CustomerBooking) => void }) {
  const statusLabel = (s: string) =>
    s === 'booked' ? 'Booked'
      : s === 'confirmed' ? 'Confirmed'
        : s === 'completed' ? 'Completed'
          : s === 'cancelled' ? 'Cancelled'
            : s === 'no_show' ? 'No-show'
              : s === 'in_progress' ? 'In progress'
                : s;
  const renderItem = (b: CustomerBooking) => (
    <div key={b.id} style={S.bookingItem}>
      <div style={{ fontWeight: 600, fontSize: 15, color: T.ink }}>{b.serviceName ?? 'Appointment'}</div>
      <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>
        {b.whenLabel}{b.stylistName ? ` · ${b.stylistName}` : ''}
      </div>
      <div style={{ fontSize: 12.5, color: T.muted, marginTop: 4 }}>
        {statusLabel(b.status)}{b.priceCents ? ` · $${(b.priceCents / 100).toFixed(0)}` : ''}
      </div>
      {b.cancelable ? (
        <button onClick={() => onCancel(b)} style={S.cancelLink}>Cancel</button>
      ) : b.editable ? (
        <div style={{ fontSize: 12, color: T.faint, marginTop: 8 }}>Within 24h — contact {PHONE} to change.</div>
      ) : null}
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.upcoming.length > 0 && (
        <>
          <div style={S.bookingSection}>Upcoming</div>
          {data.upcoming.map(renderItem)}
        </>
      )}
      {data.past.length > 0 && (
        <>
          <div style={{ ...S.bookingSection, marginTop: data.upcoming.length ? 8 : 0 }}>Past</div>
          {data.past.slice(0, 5).map(renderItem)}
        </>
      )}
      <div style={{ fontSize: 12.5, color: T.muted, marginTop: 6, lineHeight: 1.5 }}>
        Need to change an appointment? Contact {PHONE}.
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', height: '100dvh', background: T.white, color: T.ink, fontFamily: 'var(--font-poppins), system-ui, sans-serif' },
  header: { padding: '14px 16px', background: T.teal, color: T.white, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  hTitle: { fontSize: 17, fontWeight: 600, color: T.white },
  hSub: { fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 1 },
  closeBtn: { background: 'rgba(255,255,255,0.14)', color: T.white, border: 'none', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 },
  logoutBtn: { background: 'rgba(255,255,255,0.14)', color: T.white, border: 'none', borderRadius: 999, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', marginRight: 2 },
  scroll: { flex: 1, overflowY: 'auto', padding: '16px 16px 20px' },
  // Transform on the settle, opacity on the soft curve — design-taste's
  // locked pair. The 6px offset is deliberate restraint: chat bubbles are
  // high-frequency within a session, and the frequency law wants less
  // movement the more often something is seen.
  enter: {
    animation:
      'hssIn var(--dur-standard, 400ms) var(--ease-enter, cubic-bezier(.22,1,.36,1)) both,'
      + ' hssInFade var(--dur-standard, 400ms) var(--ease-enter-soft, cubic-bezier(0,0,.2,1)) both',
  },
  bubble: { maxWidth: '82%', padding: '11px 14px', borderRadius: 16, fontSize: 15, lineHeight: 1.55 },
  botB: { background: T.bone, color: T.ink, borderBottomLeftRadius: 5 },
  caret: { display: 'inline-block', width: 2, height: '1em', background: T.muted, marginLeft: 2, verticalAlign: '-2px', animation: 'hssCaret 0.9s step-end infinite' },
  streamWrap: { display: 'block' },
  // A measuring stick for WIDTH ONLY. Zero height means it reserves no vertical
  // space, so the bubble still grows line by line as the message arrives — but
  // its width is settled from the first character, which is what stops the text
  // re-wrapping and words jumping between rows. Reserving the height too made
  // the bubble open at full size around a single line, which looked worse than
  // the bug it fixed. Hidden from assistive tech: it is a duplicate of the text.
  streamGhost: { visibility: 'hidden', display: 'block', height: 0, overflow: 'hidden' },
  streamLive: { display: 'block' },
  userB: { background: T.teal, color: T.white, borderBottomRightRadius: 5 },
  chip: { border: `1px solid ${T.line}`, background: T.white, color: T.teal, borderRadius: 999, padding: '10px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 40, lineHeight: 1 },
  serviceCard: { textAlign: 'left', border: `1px solid ${T.line}`, background: T.white, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', minHeight: 44 },
  chooseTop: { textAlign: 'center', border: `1px solid ${T.gold}`, background: T.surface, color: T.ink, borderRadius: 10, padding: '11px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44 },
  chooseCard: { border: `1px solid ${T.line}`, borderRadius: 14, padding: 16, background: T.white },
  detailCard: { border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, background: T.white },
  chooseQ: { fontSize: 14, color: T.ink, marginBottom: 12, lineHeight: 1.5 },
  chooseChips: { display: 'flex', flexDirection: 'column', gap: 8 },
  chooseChip: { textAlign: 'left', border: `1px solid ${T.line}`, background: T.white, color: T.ink, borderRadius: 10, padding: '12px 14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 44 },
  chooseLink: { background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer', padding: '12px 2px 0', textAlign: 'left' },
  backBtn: { background: 'none', border: 'none', color: T.muted, fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '4px 4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 },
  formCard: { display: 'flex', gap: 8, alignItems: 'center', border: `1px solid ${T.line}`, borderRadius: 12, padding: 12, background: T.white },
  field: { border: `1px solid ${T.line}`, borderRadius: 10, padding: '13px 14px', fontSize: 16, outline: 'none', flex: 1, minWidth: 0, color: T.ink, minHeight: 46, boxSizing: 'border-box' },
  fieldHint: { fontSize: 12.5, color: '#b4554d', margin: '-2px 2px 0', lineHeight: 1.4 },
  confirmCard: { border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, background: T.surface },
  bookingItem: { textAlign: 'left', border: `1px solid ${T.line}`, background: T.white, borderRadius: 12, padding: '13px 15px' },
  bookingSection: { fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: T.muted, margin: '2px 0 1px' },
  cancelLink: { marginTop: 8, background: 'none', border: 'none', color: T.muted, padding: '4px 2px', fontSize: 13, fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 },
  doneCard: { border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 18px', background: T.surface, textAlign: 'center', margin: '8px 0' },
  // Primary CTA: gold fill, deep-teal text (high contrast for older eyes).
  primary: { background: T.gold, color: T.teal, border: 'none', borderRadius: 8, padding: '13px 18px', fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', minHeight: 46 },
  secondaryBtn: { background: T.white, color: T.teal, border: `1.5px solid ${T.teal}`, borderRadius: 8, padding: '12px 18px', fontSize: 15, fontWeight: 600, cursor: 'pointer', minHeight: 46 },
  inputBar: { display: 'flex', gap: 8, padding: 12, borderTop: `1px solid ${T.line}`, background: T.white },
  input: { flex: 1, border: `1px solid ${T.line}`, borderRadius: 10, padding: '12px 14px', fontSize: 16, outline: 'none', color: T.ink, minHeight: 46, boxSizing: 'border-box' },
  send: { background: T.gold, color: T.teal, border: 'none', borderRadius: 10, width: 46, minHeight: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
};
