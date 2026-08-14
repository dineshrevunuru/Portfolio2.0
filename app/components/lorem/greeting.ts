/**
 * The fixed lines: everything Lorem says whose words are known before a visitor
 * arrives.
 *
 * They live here rather than inline in LoremHome so that one source of truth
 * feeds two consumers. The component speaks them at runtime, and
 * `scripts/prerender-voice.mjs` renders every variant to audio at build time.
 * Inline strings could not be enumerated by a build script without being
 * copied, and a copy would drift.
 *
 * Fixed text is why v3 is affordable here. Eleven v3 is the expressive model
 * and the only one that takes audio tags, but it is too slow for a live turn
 * where a visitor is standing in silence. Rendered once and served as a file,
 * its latency is paid by a build and never by a person, so the single line
 * every visitor hears gets the best voice available while live answers stay on
 * Flash.
 *
 * ⚠ Changing any string here invalidates its audio. Re-run the prerender script
 * or the line silently falls back to Flash at runtime, which still works and
 * still sounds fine, just without the tags.
 */

export interface GreetingVars {
  /** We have met before, in this browser. */
  returning: boolean;
  /** Coarse pointer: there is no Space bar to hold. */
  touch: boolean;
}

/**
 * How to talk, matched to the device. Phones have no Space bar, so the desktop
 * instruction would be a lie on one.
 */
const how = (touch: boolean) =>
  touch ? "Tap the orb when you want to talk." : "Hold Space when you want to talk.";

/**
 * The opening line. Dinesh's call, and it opens like a person rather than a
 * directory: a greeting, a question about them, then how to answer it.
 *
 * The question comes first on purpose. An earlier round of drafts was reviewed
 * against a recruiter lens that objected to exactly this, on the grounds that a
 * visitor with four minutes wants the work before the pleasantries. That
 * objection was overruled, and the reasoning is sound: splitting visitors into
 * "recruiter" and "everyone else" means guessing from a referrer that is often
 * stripped, and a mis-guessed register is worse than one conversation that
 * treats everybody the same. Anyone in a hurry can say so in their first breath
 * and get answered.
 *
 * ⚠ WHAT IS NOT HERE, AND WHY. The line Dinesh drafted ended "I'm very much
 * excited to have you here today." That claims an inner state, which is the
 * one prohibition this agent cannot trade away: it is disclosed software, so a
 * declared feeling is not warmth, it is the fastest way to lose the trust the
 * rest of the design spends its effort earning. The simulation harness already
 * scores claimed feelings as a defect and caught them in three of eleven
 * conversations; a greeting that claims one would open every future run with
 * the thing the eval counts as a bug.
 *
 * The warmth is not lost, it moved. PRERENDER_TAG puts [warm] on the v3 render,
 * so the line is DELIVERED warmly instead of asserting that it is. That is
 * where a person keeps warmth too: in how the sentence sounds, not in a
 * sentence about their feelings.
 *
 * "Welcome back" replaces the introduction rather than preceding it. A returning
 * visitor being told the name again reads as an agent that did not remember,
 * which is the opposite of what remembering them is for.
 */
export function buildGreeting({ returning, touch }: GreetingVars): string {
  const open = returning ? "Welcome back." : "Hi, I'm Lorem.";
  return `${open} How are you doing today? ${how(touch)}`;
}

/**
 * Every greeting the app can produce. The prerender script walks this list, so
 * a variant missing from it is a variant that never gets v3 audio.
 */
export const GREETING_VARIANTS: { id: string; vars: GreetingVars }[] = [
  { id: "greet-new-desktop", vars: { returning: false, touch: false } },
  { id: "greet-new-touch", vars: { returning: false, touch: true } },
  { id: "greet-back-desktop", vars: { returning: true, touch: false } },
  { id: "greet-back-touch", vars: { returning: true, touch: true } },
];

/**
 * Audio tags, applied only in the prerender. They are v3-only syntax, so they
 * must never reach the Flash endpoint, which would read them aloud as words.
 *
 * This is the one mechanism that lets Lorem carry warmth without breaking the
 * rule against claiming an inner state. "I'm glad you're here" is a claimed
 * feeling and is banned. A line delivered warmly is not a claim at all, it is
 * how the sentence is said, which is exactly where a person puts warmth.
 */
export const PRERENDER_TAG = "[warm]";
