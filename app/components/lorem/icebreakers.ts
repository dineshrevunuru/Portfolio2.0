/**
 * Openers for someone who has just realised they can talk to this thing and
 * has gone blank.
 *
 * The failure isn't that they lack questions — it's that they don't know what
 * *kind* of thing this is, so they don't know which register is allowed. Every
 * chip being a portfolio query answered that badly: it implied a search box
 * with a microphone.
 *
 * So the pool spans registers on purpose. But the chips themselves changed
 * character once the evidence came in: a visitor who knows they're talking to
 * software discounts warmth and does *not* discount demonstrated accuracy. So
 * an opener has to be a demonstration, not an invitation. "What are you into
 * outside work?" invites; "What's he actually bad at?" proves — one click and
 * you know this thing will say the unflattering part. That is the trust buy,
 * and it is why `candor` replaced the old opinion register in the default row.
 */

export type Icebreaker = {
  text: string;
  register:
    | /** Answers with a hard, checkable fact. */ "proof"
    | /** Answers with something unflattering and true. */ "candor"
    | /** Permission to not be an interviewer. */ "social"
    | /** About this interface rather than the work. */ "meta";
};

const POOL: Icebreaker[] = [
  // proof — the answer is a number or a named artefact, immediately
  { text: "What did he actually ship?", register: "proof" },
  { text: "Show me the numbers", register: "proof" },
  { text: "What did that cost before?", register: "proof" },
  { text: "What broke first?", register: "proof" },

  // candor — the trust buy. One click and you know it won't only sell.
  { text: "What's he actually bad at?", register: "candor" },
  { text: "What's still unfinished?", register: "candor" },
  { text: "Where's the weakest part?", register: "candor" },
  { text: "What wouldn't he claim?", register: "candor" },

  // social — for the visitor who isn't here to evaluate anyone
  { text: "I'm hiring. What should I ask?", register: "social" },
  { text: "What's he building right now?", register: "social" },
  { text: "Something other than work", register: "social" },

  // meta — for the visitor whose first question is about the thing itself
  { text: "What is this, exactly?", register: "meta" },
  { text: "How does this actually work?", register: "meta" },
];

/**
 * Three openers spanning three registers, rotated by visit so a return visit
 * doesn't open on the identical row. Deterministic — no Math.random, so server
 * and client agree and nothing flickers on hydration.
 *
 * Order is load-bearing: proof, then candor. Proof first because it's what
 * most people came for; candor second because it's the one that changes what
 * they think this is, and it needs to be read, not buried in slot three.
 */
export function pickIcebreakers(visit = 0): string[] {
  const order: Icebreaker["register"][] =
    visit % 2 === 0 ? ["proof", "candor", "social"] : ["proof", "candor", "meta"];

  return order.map((register, slot) => {
    const options = POOL.filter((o) => o.register === register);
    return options[(visit + slot) % options.length].text;
  });
}

/**
 * Shown under the greeting. Not a warm welcome — a statement of what this is
 * good for, which is the thing that actually earns a first question.
 */
export function icebreakerHint(returning: boolean): string {
  return returning
    ? "Pick up where we left off, or start somewhere new."
    : "Ask about the work, or don't. This isn't only a portfolio.";
}
