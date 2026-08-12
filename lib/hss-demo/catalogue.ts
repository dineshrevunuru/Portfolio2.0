/* ---------------------------------------------------------------------------
 * Shared demo catalogue + diary generator.
 *
 * Imported by BOTH the client sandbox (lib/widget/api.ts) and the demo chat
 * route, so the assistant can only ever offer times the booking form actually
 * has. Two separate generators would drift within one conversation and the demo
 * would contradict itself in front of the visitor.
 *
 * No client data: names, prices and hours here are indicative stand-ins. The
 * case study anonymises the client, and a public demo carrying their real
 * contact details would undo that.
 * ------------------------------------------------------------------------- */

export type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  category: string | null;
};

export type Staff = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
};

export type Slot = {
  staff_id: string;
  staff_name: string;
  slot_start: string;
  slot_end: string;
};

export const SERVICES: Service[] = [
  {
    id: "svc-consult",
    name: "Free consultation",
    description: "A private, no-obligation look at the options. About half an hour.",
    duration_minutes: 30,
    price_cents: 0,
    category: "Consultation",
  },
  {
    id: "svc-fitting",
    name: "New system fitting",
    description: "Fitting and first cut-in for a new hair system.",
    duration_minutes: 120,
    price_cents: 45000,
    category: "Hair systems",
  },
  {
    id: "svc-maintenance",
    name: "Maintenance and refit",
    description: "Clean, re-bond and re-style an existing system.",
    duration_minutes: 90,
    price_cents: 18000,
    category: "Hair systems",
  },
  {
    id: "svc-cut",
    name: "Cut and restyle",
    description: "A cut around an existing system.",
    duration_minutes: 45,
    price_cents: 8000,
    category: "Hair systems",
  },
];

export const STAFF: Staff[] = [
  { id: "staff-1", name: "Alex", title: "Stylist and managing partner", bio: null, photo_url: null },
  { id: "staff-2", name: "Sam", title: "Stylist", bio: null, photo_url: null },
];

/** Deterministic PRNG seeded off the date, so a given day's diary looks the
 *  same for the whole session instead of reshuffling on every request. */
function seeded(str: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The studio's timezone. The widget renders every time in Pacific and says so
 *  on screen, so slots must be BUILT in Pacific too. Building them in the
 *  viewer's local zone made a 9am slot render as "7:00 AM" for anyone outside
 *  California — appointments outside the opening hours the widget states. */
const TZ = "America/Los_Angeles";

/** The UTC instant whose wall-clock time in `TZ` is exactly y-m-d hh:mm.
 *  Converges in one correction; a second pass covers a DST boundary landing
 *  between the guess and the answer. */
function zonedInstant(y: number, m: number, d: number, hh: number, mm: number): Date {
  let ts = Date.UTC(y, m - 1, d, hh, mm);
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const want = Date.UTC(y, m - 1, d, hh, mm);
  for (let i = 0; i < 2; i++) {
    const parts = fmt.formatToParts(new Date(ts));
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
    const rendered = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"));
    const diff = want - rendered;
    if (diff === 0) break;
    ts += diff;
  }
  return new Date(ts);
}

/**
 * A day's open slots. Open 9–5 every day, matching the hours the widget itself
 * quotes; roughly 40% of the diary already taken; nothing inside the next hour.
 * That last rule is what stops the grid looking generated — and it is why an
 * evening visitor correctly sees today as full and has to pick another day.
 */
export function slotsFor(dateIso: string, durationMinutes: number, staffId?: string): Slot[] {
  const [y, m, d] = dateIso.split("-").map(Number);
  if (!y || !m || !d) return [];

  const rand = seeded(dateIso + (staffId ?? "any"));
  const pool = staffId ? STAFF.filter((s) => s.id === staffId) : STAFF;
  const out: Slot[] = [];
  const cutoff = Date.now() + 60 * 60 * 1000;

  for (let minutes = 9 * 60; minutes + durationMinutes <= 17 * 60; minutes += 30) {
    // One slot per time — "first available", which is what the real endpoint
    // returns when no stylist is chosen. Emitting one per stylist gave the
    // picker two children with the same key and React dropped one of them.
    const free = pool.find((member) => rand() >= (member.id === "staff-1" ? 0.5 : 0.32));
    if (!free) continue;
    const start = zonedInstant(y, m, d, Math.floor(minutes / 60), minutes % 60);
    if (start.getTime() < cutoff) continue;
    out.push({
      staff_id: free.id,
      staff_name: free.name,
      slot_start: start.toISOString(),
      slot_end: new Date(start.getTime() + durationMinutes * 60000).toISOString(),
    });
  }
  return out.sort((a, b) => a.slot_start.localeCompare(b.slot_start));
}

export function serviceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
