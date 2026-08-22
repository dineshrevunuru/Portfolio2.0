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
    | /** About the visitor. A friend's first question. */ "invite"
    | /** Answers with a hard, checkable fact. */ "proof"
    | /** Answers with something unflattering and true. */ "candor"
    | /** Permission to not be an interviewer. */ "social"
    | /** About this interface rather than the work. */ "meta";
};

const POOL: Icebreaker[] = [
  // invite — about the visitor. The default row, since 2026-08-20: Lorem is
  // a friend first, and a friend's first question is about you. This reverses
  // the proof-first finding above on purpose — the product changed from "a
  // portfolio you talk to" to "Dinesh's best friend, on the door" — and the
  // gym re-tests the reversal rather than assuming it.
  { text: "What are you into lately?", register: "invite" },
  { text: "How's your week going?", register: "invite" },
  { text: "Working on anything fun?", register: "invite" },
  { text: "Where are you talking from?", register: "invite" },
  { text: "What brought you here?", register: "invite" },

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
 * Order is load-bearing, and it flipped once the evidence came in. The first
 * visit used to open proof-candor-social — three portfolio queries — on the
 * theory that proof is what people came for. The simulation transcripts said
 * otherwise: ten of eleven personas arrived to poke at the thing itself, and
 * the register built for them (`meta`) was unreachable until a return visit
 * most people never make. So a first visit now leads with meta, and proof
 * sits directly beside it — the recruiter's next move is still exactly one
 * tap. Candor holds the third slot on visit 0 because it's the register that
 * changes what they think this is; returns rotate through the rest.
 */
export function pickIcebreakers(visit = 0): string[] {
  // Invite leads every row now (2026-08-20): two questions about the visitor,
  // then one about the thing itself. Proof and candor are still in the pool
  // for the model's own follow-up chips once someone steers to the work — they
  // are no longer what a stranger sees first. The earlier proof-first finding
  // was real; the product it was measured on is not the product any more.
  const order: Icebreaker["register"][] =
    visit === 0
      ? ["invite", "invite", "meta"]
      : visit % 2 === 0
        ? ["invite", "social", "meta"]
        : ["invite", "invite", "social"];

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
    : "Say hi. Tell me what you're into. The work can wait.";
}
