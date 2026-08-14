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
 * The opening line.
 *
 * ⚠ PLACEHOLDER. The copy below is not settled. A previous draft opened "This
 * is a conversation, not a search box", which was rejected for defining itself
 * by negation and for being knowingly self-aware about being software, the
 * exact AI tell the anti-slop reference exists to kill. Eight replacements were
 * drafted and adversarially reviewed; none passed all three critics, and the
 * strongest objection was structural rather than stylistic: an opener that asks
 * a visitor about themselves before saying what Dinesh shipped misreads a
 * recruiter, who is the visitor that matters most.
 *
 * So this stays deliberately plain until the register question is settled. It
 * states what is true, offers a way in, and claims nothing.
 */
export function buildGreeting({ returning, touch }: GreetingVars): string {
  const back = returning ? "Welcome back. " : "";
  return (
    `${back}I'm Lorem. Ask me about Dinesh's work, the numbers behind it, ` +
    `or the parts that did not go well. ${how(touch)}`
  );
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
