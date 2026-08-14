/**
 * The guardrail — everything the model proposes passes through here before it
 * reaches a browser.
 *
 * It lives in its own module for one reason: a safety mechanism you cannot test
 * in isolation is a safety mechanism you are trusting on faith. `guardrail.test`
 * runs this against a deliberately dishonest model response.
 *
 * The rule it enforces is the same one Dinesh built into the client's assistant:
 * the model gets tools, and none of them write the record. Here that means the
 * model may *reference* a number by id, and may never author one.
 */

import { FACTS, NUMERAL_RE, QUOTES, allowedNumerals, isDisplayable, isFactId, isQuoteId } from "./facts";
import { isDatasetId, type Block } from "./protocol";

export type Rejection = { block: string; reason: string };

/**
 * The only link destinations Lorem may render. A scheme prefix check is not a
 * same-origin check — `//evil.example.com` and an arbitrary `mailto:` both
 * begin with the "safe" characters. On a page anyone can talk to, a
 * model-composed URL rendered as a confident chip is a phishing vector, so the
 * rule is an allowlist, not a filter.
 */
const ALLOWED_LINKS = new Set(["mailto:dineshrevunuru@gmail.com", "/hss-case-study", "/resume"]);

export function sanitizeBlocks(raw: unknown, rejected: Rejection[]): Block[] {
  if (!Array.isArray(raw)) return [];
  const out: Block[] = [];

  // Numeral-scrub EVERY text field the model authors, not just `say`. A
  // hallucinated figure in a heading or a persona card is worse than one in
  // prose — blocks read as evidence.
  const scrub = (s: string) => scrubProse(s, rejected);

  for (const b of raw) {
    if (!b || typeof b !== "object") continue;
    const block = b as Record<string, unknown>;
    const type = block.type;

    switch (type) {
      case "heading":
      case "text":
      case "proof": {
        if (typeof block.text !== "string" || !block.text.trim()) break;
        out.push({ type, text: scrub(block.text.trim()) } as Block);
        break;
      }

      case "metrics": {
        // The load-bearing case. Values are looked up at render time from
        // `facts.ts`; whatever the model typed is never read.
        const items = Array.isArray(block.items) ? block.items : [];
        const kept: { factId: keyof typeof FACTS }[] = [];
        for (const it of items) {
          const id = (it as Record<string, unknown>)?.factId;
          if (typeof id !== "string" || !isFactId(id)) {
            rejected.push({ block: "metrics", reason: `unknown factId "${String(id)}"` });
            continue;
          }
          if (!isDisplayable(id)) {
            rejected.push({
              block: "metrics",
              reason: `factId "${id}" is [open] — not display-safe`,
            });
            continue;
          }
          kept.push({ factId: id });
        }
        if (kept.length) out.push({ type: "metrics", items: kept });
        break;
      }

      case "quote": {
        const id = block.quoteId;
        if (typeof id !== "string" || !isQuoteId(id)) {
          rejected.push({ block: "quote", reason: `unknown quoteId "${String(id)}"` });
          break;
        }
        out.push({ type: "quote", quoteId: id });
        break;
      }

      case "chart": {
        const ds = block.dataset;
        if (typeof ds !== "string" || !isDatasetId(ds)) {
          rejected.push({ block: "chart", reason: `unknown dataset "${String(ds)}"` });
          break;
        }
        out.push({
          type: "chart",
          dataset: ds,
          ...(typeof block.caption === "string" ? { caption: block.caption } : {}),
        });
        break;
      }

      case "problem": {
        if (typeof block.statement !== "string" || !block.statement.trim()) break;
        out.push({
          type: "problem",
          statement: scrub(block.statement.trim()),
          ...(typeof block.cost === "string" ? { cost: scrub(block.cost) } : {}),
        });
        break;
      }

      case "split": {
        const side = (v: unknown) => {
          const s = v as Record<string, unknown> | null;
          return s && typeof s.title === "string" && typeof s.body === "string"
            ? { title: scrub(s.title), body: scrub(s.body) }
            : null;
        };
        const before = side(block.before);
        const after = side(block.after);
        if (before && after) out.push({ type: "split", before, after });
        break;
      }

      case "personas": {
        const items = (Array.isArray(block.items) ? block.items : [])
          .map((p) => p as Record<string, unknown>)
          .filter((p) => typeof p?.name === "string" && typeof p?.detail === "string")
          .map((p) => ({
            name: scrub(p.name as string),
            detail: scrub(p.detail as string),
            ...(typeof p.need === "string" ? { need: scrub(p.need) } : {}),
          }));
        if (items.length) out.push({ type: "personas", items });
        break;
      }

      case "steps": {
        const items = (Array.isArray(block.items) ? block.items : [])
          .filter((s): s is string => typeof s === "string" && !!s.trim())
          .map(scrub);
        if (items.length) out.push({ type: "steps", items });
        break;
      }

      case "arc": {
        const items = (Array.isArray(block.items) ? block.items : [])
          .map((p) => p as Record<string, unknown>)
          .filter((p) => typeof p?.label === "string")
          .map((p) => ({ label: scrub(p.label as string), active: p.active === true }));
        if (items.length) out.push({ type: "arc", items });
        break;
      }

      case "chat": {
        const turns = (Array.isArray(block.turns) ? block.turns : [])
          .map((t) => t as Record<string, unknown>)
          .filter((t) => (t?.from === "them" || t?.from === "u") && typeof t?.text === "string")
          .map((t) => ({ from: t.from as "them" | "u", text: scrub(t.text as string) }));
        if (turns.length >= 2) {
          out.push({
            type: "chat",
            turns,
            ...(typeof block.title === "string" ? { title: scrub(block.title) } : {}),
            ...(typeof block.note === "string" ? { note: scrub(block.note) } : {}),
          });
        }
        break;
      }

      case "link": {
        if (typeof block.label !== "string" || typeof block.href !== "string") break;
        const href = block.href.trim();
        if (!ALLOWED_LINKS.has(href)) {
          rejected.push({ block: "link", reason: `href not allowed "${href}"` });
          break;
        }
        out.push({ type: "link", label: scrub(block.label), href });
        break;
      }

      default:
        rejected.push({ block: String(type), reason: "unknown block type" });
    }
  }

  // Every authored string above is scrubbed AFTER its non-empty check, so the
  // scrub can hollow a block out: drop the one sentence it contained and a
  // heading becomes "", a split lane loses its body. Empty renders as a blank
  // slot in the layout, which reads as broken rather than as redacted, so the
  // block goes. Unlisted shapes are kept — a new block type should not silently
  // vanish because this filter has not heard of it.
  const filled = out.filter((b) => {
    const ok = (...xs: (string | undefined)[]) => xs.every((x) => x === undefined || x.trim() !== "");
    switch (b.type) {
      case "heading":
      case "text":
      case "proof":
        return ok(b.text);
      case "problem":
        return ok(b.statement, b.cost);
      case "split":
        return ok(b.before.title, b.before.body, b.after.title, b.after.body);
      case "personas":
        return b.items.every((p) => ok(p.name, p.detail, p.need));
      case "steps":
        return b.items.every((s) => ok(s));
      case "arc":
        return b.items.every((i) => ok(i.label));
      case "chat":
        return b.turns.every((t) => ok(t.text)) && ok(b.title, b.note);
      case "link":
        return ok(b.label);
      default:
        return true;
    }
  });
  if (filled.length < out.length) {
    rejected.push({
      block: "show",
      reason: `emptied by the numeral scrub — dropped ${out.length - filled.length} block(s)`,
    });
  }

  // The 4-block budget is enforced silently nowhere — an over-budget response
  // must show up in the logs the prompt is tuned against.
  if (filled.length > 4) {
    rejected.push({ block: "show", reason: `over budget — dropped ${filled.length - 4} block(s)` });
  }
  return filled.slice(0, 4);
}

/**
 * Catch a numeral the model typed into prose that no fact backs. We neutralise
 * rather than delete: a sentence with a visible hole reads as a gap, which is
 * honest, where a silently edited sentence reads as fact.
 */
/* ── Spelled-out numbers ───────────────────────────────────────────────────
   A digit-only scrub is trivially bypassed by writing "seventy-two percent"
   instead of "72%" — and for a spoken assistant that is the NATURAL phrasing,
   so it happens by default rather than by malice. The prompt now asks for
   digits, but a prompt buys a tendency; this buys the guarantee.            */

const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const SCALES: Record<string, number> = { hundred: 100, thousand: 1000, million: 1_000_000 };
const GLUE = new Set(["and", "a"]);

const isNumWord = (w: string) => w in ONES || w in TENS || w in SCALES;

/** Parse a run of number words to a value. Returns null if it doesn't resolve. */
function wordsToNumber(words: string[]): number | null {
  let total = 0;
  let current = 0;
  let seen = false;
  for (const w of words) {
    if (GLUE.has(w)) continue;
    if (w in ONES) {
      current += ONES[w];
      seen = true;
    } else if (w in TENS) {
      current += TENS[w];
      seen = true;
    } else if (w in SCALES) {
      const s = SCALES[w];
      if (s === 100) current = (current || 1) * 100;
      else {
        total += (current || 1) * s;
        current = 0;
      }
      seen = true;
    } else return null;
  }
  return seen ? total + current : null;
}

/**
 * Scrub spelled-out quantities that no fact backs. Deliberately conservative:
 * a run only counts as a quantity if it carries a tens/scale word ("seventy-two",
 * "a hundred") or is immediately followed by a unit ("percent", "dollars"). That
 * leaves ordinary prose — "one of the things", "three apps" — untouched.
 */
function scrubWordNumbers(text: string, allowed: Set<string>, rejected: Rejection[]): string {
  const UNITS_AFTER = /^(percent|percentage|dollars?|cents?|k|thousand|million)\b/i;
  const tokens = text.split(/(\s+|[.,;:!?—–]+)/);

  let i = 0;
  while (i < tokens.length) {
    const bare = tokens[i].toLowerCase().replace(/[^a-z-]/g, "");
    const parts = bare.split("-").filter(Boolean);
    if (!parts.length || !parts.every(isNumWord)) {
      i++;
      continue;
    }
    // Extend the run across separators while the next word is still numeric glue.
    let end = i;
    const words: string[] = [...parts];
    for (let j = i + 1; j < tokens.length; j++) {
      if (/^\s+$/.test(tokens[j])) continue;
      const nb = tokens[j].toLowerCase().replace(/[^a-z-]/g, "");
      const np = nb.split("-").filter(Boolean);
      if (np.length && (np.every(isNumWord) || (GLUE.has(nb) && nb !== "a"))) {
        words.push(...np.length ? np : [nb]);
        end = j;
      } else break;
    }

    const tail = tokens.slice(end + 1).join("").trimStart();
    const hasUnit = UNITS_AFTER.test(tail);
    const hasBigWord = words.some((w) => w in TENS || w in SCALES);

    if (hasUnit || hasBigWord) {
      const value = wordsToNumber(words);
      const phrase = tokens.slice(i, end + 1).join("");
      if (value !== null) {
        const variants = [String(value), `${value}%`, value.toLocaleString("en-US")];
        if (!variants.some((v) => allowed.has(v))) {
          rejected.push({ block: "say", reason: `unbacked spelled numeral "${phrase.trim()}" (=${value})` });
          for (let k = i; k <= end; k++) tokens[k] = /^\s+$/.test(tokens[k]) ? tokens[k] : "";
          tokens[i] = HOLE;
        }
      }
      i = end + 1;
      continue;
    }
    i = end + 1;
  }
  return tokens.join("").replace(/\s{2,}/g, " ");
}

/**
 * Marks where an unbacked numeral was removed. NUL, because it cannot occur in
 * model prose and cannot be spoken, so a hole that survives to the output is a
 * bug that shows rather than one that mumbles.
 *
 * This replaced an em dash, which was wrong twice over. It left the sentence
 * standing with a gap in it, so a real conversation shipped "closing most of
 * that gap to — is what changed the business" and a TTS voice read it aloud as
 * a stumble. And an em dash is the one character the voice spec bans outright,
 * which made the guardrail enforcing one rule the largest single source of
 * violations of another.
 */
const HOLE = " ";

/**
 * Drop whole sentences that lost a numeral, rather than serving them holed.
 *
 * A missing sentence reads as an answer that chose not to go there. A sentence
 * with a hole in it reads as broken software, and this text is spoken aloud
 * where there is no visual cue to recover from.
 *
 * Returns "" when every sentence carried an unbacked numeral. That is a real
 * failure — the whole answer was fabricated figures — and the route turns it
 * into an error rather than speaking nothing.
 */
function dropHoledSentences(text: string, rejected: Rejection[]): string {
  if (!text.includes(HOLE)) return text;
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const kept = sentences.filter((s) => !s.includes(HOLE));
  const out = kept.join("").replace(/\s{2,}/g, " ").trim();
  if (!out) {
    rejected.push({ block: "say", reason: "every sentence carried an unbacked numeral" });
  }
  return out;
}

export function scrubProse(say: string, rejected: Rejection[]): string {
  const allowed = allowedNumerals();
  const digitsScrubbed = say.replace(NUMERAL_RE, (m) => {
    if (allowed.has(m)) return m;
    rejected.push({ block: "say", reason: `unbacked numeral "${m}"` });
    return HOLE;
  });
  return dropHoledSentences(scrubWordNumbers(digitsScrubbed, allowed, rejected), rejected);
}

/** Resolve the ids that survived into the display values the client renders. */
export function resolve(show: Block[]) {
  const facts = Object.fromEntries(
    show
      .filter((b): b is Extract<Block, { type: "metrics" }> => b.type === "metrics")
      .flatMap((b) => b.items)
      .map(({ factId }) => [factId, { value: FACTS[factId].value, label: FACTS[factId].label }]),
  );
  const quotes = Object.fromEntries(
    show
      .filter((b): b is Extract<Block, { type: "quote" }> => b.type === "quote")
      .map((b) => [b.quoteId, { text: QUOTES[b.quoteId].text, by: QUOTES[b.quoteId].by }]),
  );
  return { facts, quotes };
}
