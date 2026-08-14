/**
 * Knowing when a conversation is over.
 *
 * This lives beside the guardrail rather than in the route because it is
 * conversation behaviour, not HTTP plumbing, and because the route cannot be
 * imported by a test without dragging next/server in. The guardrail earned its
 * own module by being the piece where a silent regression is expensive. So is
 * this one: a false positive here swallows a real question and leaves a visitor
 * talking to a wall.
 *
 * Both failures it exists to prevent are the same architectural fact wearing
 * different clothes. Every visitor turn produces a model call, so a model handed
 * "bye" a fourth time has nothing left but to say bye again, and a model handed
 * a closing statement rather than a question returns the statement. The fix is
 * not better wording. It is giving the conversation somewhere to stop.
 */

/**
 * Farewell words, anchored to the WHOLE message. The anchor is what separates
 * "thanks" from "thanks, what did that cost?" — the second is a question that
 * happens to open politely, and swallowing it would be far worse than answering
 * one redundant goodbye.
 */
const FAREWELL =
  /^\W*(bye+|bye bye|goodbye|later|laters|see ya|see you|cya|ciao|peace|cheers|thanks|thank you|thx|ty|take care|good ?night|gn|night|i'?m out|im out|gotta go|g2g|done|that'?s it|all good|ok bye|okay bye)\b[\s\W]*$/i;

/**
 * "Is this message nothing but a goodbye?"
 *
 * Conservative on purpose, and asymmetric for a reason: a missed farewell costs
 * one redundant turn, a false positive silently eats a real question. The
 * five-word cap is the second guard behind the anchor, so a farewell word
 * carrying real freight still reaches the model.
 */
export function isFarewell(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  return t.split(/\s+/).length <= 5 && FAREWELL.test(t);
}

/** Comparison form: case, punctuation and spacing removed. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Did the model hand the visitor their own sentence back?
 *
 * Normalised so that requoting with different punctuation or casing still
 * counts, since the failure is the repetition rather than the characters.
 * Empty input is never an echo: that case belongs to the numeral scrub.
 */
export function isEcho(say: string, message: string): boolean {
  const a = norm(say);
  return a.length > 0 && a === norm(message);
}

/**
 * The chip gate: work chips only after the visitor has steered toward the
 * work.
 *
 * This went into code after losing to the model three times as a prompt rule.
 * The instruction "a visitor who has not asked about Dinesh's work gets NO
 * work chips" was added, the model's spoken words obeyed it, and across three
 * separate evaluated runs the chips kept pitching anyway — "show me the work
 * anyway" at a visitor who had just declined, "what's dinesh's take on food"
 * in the middle of a food riff that was working on its own. Six of seven
 * mechanical defects in the mechanics-rules run were exactly this. The same
 * codebase evidence as ever: its instructed em-dash rule was violated 228
 * times, its enforced numeral rule zero.
 *
 * Direction is decided from what the VISITOR has said, current message
 * included. The word list mirrors the eval's workChipUninvited check, so the
 * gate and the metric agree about what "work" means.
 */
const WORK_TALK =
  /\b(dinesh|work|portfolio|project|built|build|shipped|ship|case stud(?:y|ies)|design|hci|neudesic|resume|hire|hiring)\b/i;

export function visitorSteeredToWork(visitorMessages: string[]): boolean {
  return visitorMessages.some((m) => WORK_TALK.test(m));
}

export function gateChips(chips: string[], steered: boolean): string[] {
  if (steered) return chips;
  return chips.filter((c) => !WORK_TALK.test(c));
}
