/**
 * The verified fact store — Lorem's numbers guardrail.
 *
 * Lorem is a real conversational model: it decides what to say and what to show.
 * It does not decide what is *true*. Every number that reaches the screen comes
 * from this file, by id. The model may reference `id`s; it may never author a
 * numeral. `/api/lorem` substitutes the canonical `value`/`label` server-side and
 * discards whatever the model typed, so a hallucinated figure cannot render.
 *
 * This is the same rule as the assistant Dinesh built for the client: the model
 * has tools, and none of them write the record.
 *
 * Sources are load-bearing. Do not add a fact without one.
 */

export type FactStatus =
  /** Fact-checked against the case study or the codebase. Safe to display. */
  | "verified"
  /** Real but unresolved (denominator, date, or scope still open). Lorem may
   *  discuss it in prose with the caveat, but it must never render as a metric. */
  | "open";

export type Fact = {
  id: string;
  /** Canonical display string. Rendered verbatim — never re-typed by the model. */
  value: string;
  /** The unit line under the value. */
  label: string;
  /** Longer form for prose. Lorem speaks this rather than reading the tile aloud. */
  spoken: string;
  /** Caveat Lorem must volunteer if the fact is pressed on. */
  caveat?: string;
  source: string;
  status: FactStatus;
};

export const FACTS = {
  /* ── Client outcome: the numbers the engagement moved ─────────────── */

  cac: {
    id: "cac",
    value: "$105 → $40",
    label: "cost per new customer",
    spoken: "Cost per new customer came down from a hundred and five dollars to forty.",
    caveat:
      "Forty is where it landed, not a permanent floor — whether it holds is still being watched.",
    source: "hss-case-study — results",
    status: "verified",
  },

  cacWorst: {
    id: "cacWorst",
    value: "$98–110",
    label: "worst month, per conversion",
    spoken:
      "In the worst month the ads were paying between ninety-eight and a hundred and ten dollars per conversion.",
    source: "hss-case-study — the problem",
    status: "verified",
  },

  retention: {
    id: "retention",
    value: "40% → 72%",
    label: "customers who came back",
    spoken:
      "Customers coming back went from forty percent to seventy-two. The owners wanted eighty, so it is not finished.",
    caveat: "The target was 80%. 72% is progress, not arrival.",
    source: "hss-case-study — results",
    status: "verified",
  },

  retentionTarget: {
    id: "retentionTarget",
    value: "80%",
    label: "the target, still unmet",
    spoken: "The target the owners set was eighty percent.",
    source: "hss-case-study — results",
    status: "verified",
  },

  bookings: {
    id: "bookings",
    value: "86",
    label: "bookings in two months",
    spoken: "Eighty-six bookings came through it in two months.",
    source: "hss-case-study — results",
    status: "verified",
  },

  /* ── Migration: the unglamorous work that made the rest possible ──── */

  notes: {
    id: "notes",
    value: "210",
    label: "stylist notes recovered",
    spoken:
      "Two hundred and ten stylist notes were recovered from a system that had no export for them.",
    caveat:
      "The loader deliberately skipped ambiguous name matches for a human to resolve — 212 were extracted, 210 landed.",
    source: "hss-code-verified-facts",
    status: "verified",
  },

  photos: {
    id: "photos",
    value: "483",
    label: "client photos recovered",
    spoken: "Four hundred and eighty-three client photos came across with them.",
    caveat: "491 were extracted; 483 landed. The gap is unmatched records, left for a human.",
    source: "hss-code-verified-facts",
    status: "verified",
  },

  /* ── Build: what shipping actually looked like ────────────────────── */

  briefToFlow: {
    id: "briefToFlow",
    value: "3 days",
    label: "brief to working booking flow",
    spoken: "Three days from the brief to a working booking flow.",
    caveat:
      "Git shows brief on June 1st, first commit June 2nd, dual-source availability June 3rd. The deploy date is not in version control, so this is 'working flow', not 'live'.",
    source: "hss-code-verified-facts — git history",
    status: "verified",
  },

  engagement: {
    id: "engagement",
    value: "11 weeks",
    label: "April to late June 2026",
    spoken: "The whole engagement ran about eleven weeks, April into late June of 2026.",
    source: "hss-code-verified-facts",
    status: "verified",
  },

  /* ── Enterprise scale (names and scale only — never metrics, never
        "shipped to production"; that honesty rule lives in the prompt) ── */

  adaniScale: {
    id: "adaniScale",
    value: "7 clusters · 34 plants",
    label: "Adani manufacturing footprint",
    spoken: "The Adani work spanned seven clusters and thirty-four plants.",
    source: "p1-resume-ground-truth — names and scale only",
    status: "verified",
  },

  surfaceScale: {
    id: "surfaceScale",
    value: "10,000+",
    label: "users, MS Surface knowledge portal",
    spoken: "The Microsoft Surface knowledge portal served over ten thousand users.",
    source: "p1-resume-ground-truth — names and scale only",
    status: "verified",
  },

  /* ── Open: real, but not display-safe ─────────────────────────────── */

  conversionRate: {
    id: "conversionRate",
    value: "32%",
    label: "of conversations convert",
    spoken:
      "Conversations with the assistant convert at about thirty-two percent — though what that percentage is *of* is still an open question.",
    caveat:
      "The denominator is unresolved. The case study flags this itself. Do not render it as a metric tile.",
    source: "hss-case-study — flagged open",
    status: "open",
  },

  yearsExperience: {
    id: "yearsExperience",
    value: "7+ years",
    label: "product design",
    spoken: "Around seven years of product design work.",
    caveat:
      "Unresolved: the summary says over seven years, roughly six point six are visible on the timeline. Say 'about seven' or avoid the number.",
    source: "p1-resume-ground-truth — flagged open",
    status: "open",
  },
} as const satisfies Record<string, Fact>;

export type FactId = keyof typeof FACTS;

/**
 * What Dinesh and Lorem are into — the material a friend brings to a
 * conversation. Lorem shares these in first person ("I'd take the dosa place
 * every time") because, per Dinesh's call on 2026-08-20, the two are best
 * friends and work buddies with most interests in common.
 *
 * `take` matters more than `topic`: an opinion is something to talk about, a
 * category is a menu. Every line is DINESH'S ACTUAL taste, supplied by him —
 * nothing here is invented to fill a gap, and an empty list simply removes the
 * section from the prompt rather than letting the model improvise one. The
 * no-physical-life rule is untouched: Lorem can hold the opinion, not have
 * eaten the meal.
 */
export type Interest = {
  /** The thing, as a friend would name it: "biryani", "late-night Chicago walks". */
  topic: string;
  /** Dinesh's real opinion or relationship to it, in plain speech. */
  take: string;
};

export const INTERESTS: Interest[] = [
  // Filled from Dinesh's list. Until then, Lorem leans on curiosity about the
  // visitor and on the work the two of them actually do together.
];

/** Quotes are the other thing the model must never author. */
export type Quote = { id: string; text: string; by: string; source: string };

export const QUOTES = {
  secondStore: {
    id: "secondStore",
    text: "We planned a second store last year and didn't have the confidence to open it.",
    by: "CEO",
    source: "hss-case-study — stakeholder interviews",
  },
  adSpend: {
    id: "adSpend",
    text: "We're spending more on ads for less than our competitors.",
    by: "CEO",
    source: "hss-case-study — stakeholder interviews",
  },
  target: {
    id: "target",
    text: "80%. We're at 40%.",
    by: "CEO, on returning customers",
    source: "hss-case-study — stakeholder interviews",
  },
} as const satisfies Record<string, Quote>;

export type QuoteId = keyof typeof QUOTES;

/* ── Guardrail helpers, used by /api/lorem ──────────────────────────────── */

export const isFactId = (v: string): v is FactId =>
  Object.prototype.hasOwnProperty.call(FACTS, v);

export const isQuoteId = (v: string): v is QuoteId =>
  Object.prototype.hasOwnProperty.call(QUOTES, v);

/** Only `verified` facts may render as a metric tile or chart point. */
export const isDisplayable = (id: FactId) => FACTS[id].status === "verified";

/**
 * Every numeral string the model is permitted to have in prose. Anything else
 * with a digit in it gets flagged by the validator.
 */
/**
 * One regex, shared with the guardrail.
 *
 * Two greedy-punctuation bugs lived here, both with the same symptom: a real,
 * whitelisted year came out as an em-dash mid-sentence.
 *   `[\d,.]*` swallowed a trailing period  → "2024." missed the allowlist.
 *   `[\d,]*`  swallowed a trailing comma   → "2023," missed it too, which is
 *                                             what produced "designing with AI
 *                                             since —" in a live transcript.
 * A comma is now only matched as a thousands separator: it must be followed by
 * exactly three digits, so "10,000" still parses and "2023, and" does not.
 */
export const NUMERAL_RE = /\d+(?:,\d{3})*(?:\.\d+)?%?/g;

export function allowedNumerals(): Set<string> {
  const out = new Set<string>();
  for (const f of Object.values(FACTS) as Fact[]) {
    for (const m of `${f.value} ${f.spoken} ${f.caveat ?? ""}`.matchAll(NUMERAL_RE)) {
      out.add(m[0]);
    }
  }
  for (const q of Object.values(QUOTES) as Quote[]) {
    for (const m of q.text.matchAll(NUMERAL_RE)) out.add(m[0]);
  }
  // Dates and ordinals Lorem may legitimately say without a fact behind them.
  // Back to 2019 — the prompt cites the studio years and freelance era.
  ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2017", "1", "2", "3", "4", "5"].forEach(
    (n) => out.add(n),
  );
  return out;
}

/** The fact sheet injected into the system prompt. Ids are the contract. */
export function factSheet(): string {
  const line = (f: Fact) =>
    `- ${f.id} — ${f.value} (${f.label}) [${f.status}]` +
    `\n    spoken: ${f.spoken}` +
    (f.caveat ? `\n    caveat: ${f.caveat}` : "");
  const q = (x: Quote) => `- ${x.id} — "${x.text}" — ${x.by}`;
  return [
    "FACTS (display-safe unless marked [open]):",
    ...(Object.values(FACTS) as Fact[]).map(line),
    "",
    "QUOTES (verbatim only, by id):",
    ...(Object.values(QUOTES) as Quote[]).map(q),
  ].join("\n");
}
