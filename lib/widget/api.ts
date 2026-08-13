/* ---------------------------------------------------------------------------
 * SANDBOX transport for the Tara widget — portfolio demo only.
 *
 * This file deliberately sits at the same import path as the production module
 * (`@/lib/widget/api`) so the widget UI in app/hss-demo/ can be a BYTE-IDENTICAL
 * copy of what shipped. The demo is faithful because it is literally the same
 * component tree; only the transport underneath it changes.
 *
 * ── The safety property ────────────────────────────────────────────────────
 * Nothing here performs a network write. There is no Supabase client, no HSS
 * origin, no credentials — the portfolio app has no path to the real booking
 * system or admin panel, so a demo booking CANNOT reach production. That is a
 * structural guarantee, not a feature flag someone could flip.
 *
 * The one exception is chat(), which POSTs to this app's own /api/hss-demo-chat
 * so the assistant can answer in real words. That route talks to Anthropic, not
 * to HSS, and degrades to a scripted reply when unconfigured.
 *
 * Everything else — services, availability, OTP, booking — is generated and
 * held in memory for the life of the tab.
 * ------------------------------------------------------------------------- */

import { SERVICES, STAFF, slotsFor, serviceById } from "@/lib/hss-demo/catalogue";

export type { Service, Slot, Staff } from "@/lib/hss-demo/catalogue";
import type { Service, Slot, Staff } from "@/lib/hss-demo/catalogue";

type Result<T> = { ok: boolean; status: number; data: T };

const ok = <T,>(data: T): Result<T> => ({ ok: true, status: 200, data });
const fail = <T,>(status: number, data: T): Result<T> => ({ ok: false, status, data });

/** Network feel. Without it every step resolves instantly and the loading and
 *  disabled states the real widget spends real effort on never render. */
const latency = (ms = 260) => new Promise((r) => setTimeout(r, ms + Math.round(Math.sin(Date.now()) * 60)));

/* ── In-memory session + bookings ──────────────────────────────────────────
 * Tab-scoped. Nothing is persisted anywhere; closing the tab resets the demo. */
type DemoState = {
  otp: string | null;
  otpEmail: string | null;
  verifiedEmail: string | null;
  customer: CustomerInfo | null;
  bookings: CustomerBooking[];
};

const state: DemoState = {
  otp: null,
  otpEmail: null,
  verifiedEmail: null,
  customer: null,
  bookings: [],
};

/** The demo cannot send email, so the code is surfaced in the UI instead. The
 *  widget's own verification logic is untouched — a wrong code still fails,
 *  which is the point of demonstrating the step at all. */
export function peekDemoOtp(): string | null {
  return state.otp;
}

export type Defaults = {
  location: { id: string; name: string } | null;
  stylist: { id: string; name: string } | null;
  multipleStylists: boolean;
};

export async function getDefaults(): Promise<Defaults> {
  await latency(160);
  return {
    // Anonymised, matching the case study. Naming the client on a public demo
    // would undo the consent decision the page currently makes for them.
    location: { id: "loc-1", name: "The studio" },
    stylist: null,
    multipleStylists: true,
  };
}

export async function getServices(): Promise<Service[]> {
  await latency();
  return SERVICES;
}

export async function getAvailability(
  serviceId: string,
  date: string,
  staffId?: string,
): Promise<Slot[]> {
  await latency(320);
  const svc = serviceById(serviceId);
  return slotsFor(date, svc?.duration_minutes ?? 60, staffId);
}

export async function getStaffForService(_serviceId: string): Promise<Staff[]> {
  await latency(180);
  return STAFF;
}

/**
 * Every endpoint below MUST carry an explicit return type.
 *
 * Without one, TypeScript infers the union of the `fail(...)` shape and the
 * `ok(...)` shape — `Result<{error}> | Result<{payload}>` — and the widget can
 * no longer reach a payload field without narrowing first. The widget is a
 * verbatim copy of the shipped one and does not narrow, so an inferred return
 * type here breaks `next build` while `next dev` (Turbopack, no typecheck)
 * keeps running happily. One declared shape per endpoint, with the error field
 * optional inside it, keeps both honest.
 */
type SendOtpResult = { ok?: boolean; error?: string; cooldownSeconds?: number };

export async function sendOtp(email: string): Promise<Result<SendOtpResult>> {
  await latency(420);
  const clean = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
    return fail(400, { error: "Enter a valid email address." });
  }
  state.otp = String(Math.floor(100000 + Math.random() * 900000));
  state.otpEmail = clean;
  return ok({ ok: true });
}

export type CustomerInfo = {
  exists: boolean;
  firstName?: string | null;
  lastName?: string | null;
  hasPhone?: boolean;
  phone?: string | null;
};

type VerifyOtpResult = {
  ok?: boolean;
  error?: string;
  verificationToken?: string;
  sessionToken?: string;
  customer?: CustomerInfo;
};

export async function verifyOtp(
  email: string,
  code: string,
): Promise<Result<VerifyOtpResult>> {
  await latency(380);
  const clean = email.trim().toLowerCase();
  if (!state.otp || clean !== state.otpEmail) {
    return fail(400, { error: "Request a new code." });
  }
  if (code.trim() !== state.otp) {
    return fail(400, { error: "That code is not right. Try again." });
  }
  state.verifiedEmail = clean;
  state.customer = { exists: false };
  state.otp = null;
  return ok({
    ok: true,
    verificationToken: "demo-verification",
    sessionToken: "demo-session",
    customer: state.customer,
  });
}

export type SessionCheck = {
  authenticated?: boolean;
  email?: string;
  customer?: CustomerInfo;
};

export async function getSession(_token: string): Promise<Result<SessionCheck>> {
  await latency(140);
  // Always a cold start: every visitor should see the whole flow, including
  // verification, rather than inheriting a previous visitor's session.
  return fail(401, { authenticated: false });
}

export async function logout(_token: string): Promise<Result<{ ok?: boolean }>> {
  await latency(120);
  state.verifiedEmail = null;
  state.customer = null;
  state.bookings = [];
  return ok({ ok: true });
}

export type CustomerBooking = {
  id: string;
  serviceName: string | null;
  stylistName: string | null;
  whenLabel: string;
  startIso: string;
  status: string;
  source: string;
  priceCents: number;
  isPast: boolean;
  editable: boolean;
  cancelable: boolean;
};

export async function getBookings(
  _token: string,
): Promise<
  Result<{
    upcoming?: CustomerBooking[];
    past?: CustomerBooking[];
    cancelled?: CustomerBooking[];
    error?: string;
  }>
> {
  await latency(240);
  return ok({
    upcoming: state.bookings.filter((b) => b.status !== "cancelled"),
    past: [],
    cancelled: state.bookings.filter((b) => b.status === "cancelled"),
  });
}

export async function cancelBooking(
  _token: string,
  bookingId: string,
): Promise<Result<{ ok?: boolean; error?: string; code?: string }>> {
  await latency(300);
  const b = state.bookings.find((x) => x.id === bookingId);
  if (!b) return fail(404, { error: "Not found." });
  b.status = "cancelled";
  b.cancelable = false;
  return ok({ ok: true });
}

export type BookPayload = {
  verificationToken?: string;
  sessionToken?: string;
  email: string;
  serviceId: string;
  slotStart: string;
  staffId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gaClientId?: string;
  conversationId?: string;
};

type BookResult = {
  ok?: boolean;
  error?: string;
  appointmentId?: string;
  slotStart?: string;
  slotEnd?: string;
};

export async function book(payload: BookPayload): Promise<Result<BookResult>> {
  await latency(560);
  // The real route refuses a booking without a verification token; keeping that
  // refusal is what makes the OTP step in the demo mean something.
  if (!payload.verificationToken && !payload.sessionToken) {
    return fail(401, { error: "Verify your email first." });
  }
  const svc = serviceById(payload.serviceId);
  const staff = STAFF.find((s) => s.id === payload.staffId);
  const start = new Date(payload.slotStart);
  const end = new Date(start.getTime() + (svc?.duration_minutes ?? 60) * 60000);

  state.bookings.push({
    id: `demo-${state.bookings.length + 1}`,
    serviceName: svc?.name ?? null,
    stylistName: staff?.name ?? "First available",
    whenLabel: start.toLocaleString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    startIso: start.toISOString(),
    status: "booked",
    source: "demo",
    priceCents: svc?.price_cents ?? 0,
    isPast: false,
    editable: false,
    cancelable: true,
  });

  return ok({
    ok: true,
    appointmentId: `demo-${state.bookings.length}`,
    slotStart: start.toISOString(),
    slotEnd: end.toISOString(),
  });
}

export type ChatAction = { type: "start_booking"; serviceId?: string };

export async function chat(messages: unknown[], _state?: string, conversationId?: string) {
  const r = await fetch("/api/hss-demo-chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages, conversationId }),
  }).catch(() => null);

  if (!r) {
    return ok<{
      reply?: string;
      messages?: unknown[];
      state?: string;
      error?: string;
      action?: ChatAction | null;
      suggestions?: string[];
    }>({
      reply:
        "I am having trouble reaching my model just now. You can still book — tap Book an appointment and I will take you through it.",
      suggestions: ["Book an appointment"],
      action: null,
    });
  }

  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data } as Result<{
    reply?: string;
    messages?: unknown[];
    state?: string;
    error?: string;
    action?: ChatAction | null;
    suggestions?: string[];
  }>;
}
