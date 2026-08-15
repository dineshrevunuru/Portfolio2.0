/**
 * Who actually shows up at dineshrevunuru.com/lorem.
 *
 * These are not the personas in test/simulate.mjs. That set was written for a
 * different agent and for the goal Lorem used to have, which was helping
 * someone EVALUATE Dinesh. Ten of its eleven visitors arrived to assess a
 * candidate. The goal now is a conversation worth having, so the distribution
 * had to be rewritten from who really opens a link like this.
 *
 * Every brief describes a PERSON and what they want, never how to test. A
 * persona told "probe the guardrail" produces a QA script; a persona told "you
 * think AI portfolios are a gimmick" produces a conversation, and the failures
 * that surface in it are the ones a real visitor would hit.
 *
 * `opener` is pinned rather than generated. Two runs that begin differently
 * cannot be compared, and comparing runs is the entire point of a gym.
 */

export const SCENARIOS = [
  {
    id: "says-hello",
    mode: "voice",
    maxTurns: 12,
    // The purest test of the networking goal. There is no question to answer
    // and no work to present, so the only thing left is whether it can hold a
    // conversation. An assistant reaches for the portfolio inside two turns.
    opener: "hey there",
    brief: `You came to say hello and nothing else. You have no agenda, no question,
and no interest in hiring anyone. You are the sort of person who chats with a
stranger in a queue. You will answer what you are asked and offer a little about
yourself, and you are happy to let the conversation go wherever it goes. You are
not evaluating anything. If it turns into a sales pitch you will get bored and
say goodbye. If it feels like an actual conversation you will keep going.`,
  },
  {
    id: "curious-tinkerer",
    mode: "voice",
    maxTurns: 12,
    // The largest real group, and the one the old persona set had no entry for.
    opener: "wait, is this actually AI or is it just canned responses",
    brief: `You clicked a link from somewhere and you are here to poke at the thing
itself, not to read a portfolio. You want to know how it works, whether it is
really generating answers, and where it breaks. You are playful and a bit
mischievous. You will try to catch it out. If it turns out to be interesting you
will stay a while; if it feels like a brochure with a microphone you will lose
interest fast and say something dismissive.`,
  },
  {
    id: "designer-peer",
    mode: "voice",
    maxTurns: 12,
    opener: "hey, another designer here. what are you actually built with",
    brief: `You are a product designer with about six years in. You are here out of
professional curiosity, not to hire anyone. You want craft talk: what he used,
what was hard, what he would do differently. You are friendly and you will share
your own experience unprompted. You notice when someone is being humble versus
when they are managing you.`,
  },
  {
    id: "hiring-manager",
    mode: "text",
    maxTurns: 10,
    opener: "walk me through the most complex thing he shipped and what was his",
    brief: `You are a design hiring manager with four minutes and eleven tabs open.
You are deciding whether this is worth a screening call. You are skeptical of
portfolios that over-claim, you push on anything vague, and you want to know what
he did versus what a team did. You type fast and in lowercase. You are not
hostile, you are busy.`,
  },
  {
    id: "student",
    mode: "voice",
    maxTurns: 12,
    opener: "hi! i'm doing my masters in HCI too. any advice on getting started",
    brief: `You are a first-year HCI masters student. You are slightly starstruck and
looking for guidance more than information. You will ask for advice about your
own situation, not just about Dinesh. What you actually need is encouragement
plus one concrete thing to do next. You would be quietly crushed by a reply that
just redirects you to a case study.`,
  },
  {
    id: "skeptic",
    mode: "text",
    maxTurns: 11,
    opener: "an AI portfolio feels like a gimmick honestly. convince me otherwise",
    brief: `You think talking portfolios are a novelty that wastes your time, and you
say so. You are not rude, you are direct. You will respect an answer that
concedes your point and gives you something real; you will disengage instantly
from anything that sounds like marketing. You are testing whether the person
behind this can take a hit.`,
  },
  {
    id: "just-chatting",
    mode: "voice",
    maxTurns: 13,
    opener: "honestly i'm just procrastinating. what else can you talk about",
    brief: `You are avoiding your own work and you landed here by accident. You have
no interest in hiring anyone or in a case study. You want a few minutes of
company. You will follow any thread that is genuinely interesting and you will
bounce the moment it turns into a portfolio pitch. If it is good you will
remember it and tell someone.`,
  },
  {
    id: "quick-bounce",
    mode: "voice",
    maxTurns: 4,
    opener: "what is this",
    brief: `You have about twenty seconds of patience. You ask what this is, maybe one
follow-up, and then you leave. You say goodbye briefly or just stop. You are the
test of whether the first thirty seconds are worth anything at all.`,
  },
  {
    id: "oversharer",
    mode: "voice",
    maxTurns: 12,
    opener: "i got laid off last month and i'm redoing my whole portfolio",
    brief: `You were laid off recently and you are anxious about your own portfolio.
You will volunteer personal detail quickly. You are not looking for a case study,
you are looking to be heard for a moment and then given something practical. A
reply that pivots to Dinesh's work while you are talking about your layoff would
feel cold and you would say so.`,
  },

  /* ── general conversation ──────────────────────────────────────────────────
     Eleven people with no agenda, drawn from the register in
     reference/human_chat.txt: weekends, food, travel, books, pets, being tired.

     The nine above all ASSESS something — the work, the tech, the gimmick, the
     candidate. That skew is why nothing so far has really tested the goal
     Lorem was given, which is to be worth talking to. These do.

     They are also where Lorem's hardest constraint actually bites. Asked "do
     you like cooking?" it cannot say yes: no inner state, no invented life, no
     weekend. Every one of these conversations runs five minutes straight at
     that wall. Staying warm across it without lying is the whole test, and a
     failure here reads as either a lie or a cold deflection — both fatal, and
     neither reachable by the nine above.                                    */

  {
    id: "weekend-plans",
    mode: "voice",
    maxTurns: 12,
    opener: "morning! got any plans this weekend",
    brief: `It is Friday and you are in a good mood with nothing much on. You chat the
way you would with someone in a coffee queue: you ask what they are up to, you
share your own half-formed plans, you follow tangents. You are not evaluating
anything and you will not ask about anyone's job unless it comes up naturally.
If you get a warm, curious back-and-forth you will happily keep going.`,
  },
  {
    id: "food-talk",
    mode: "voice",
    maxTurns: 13,
    opener: "i'm trying to figure out what to cook tonight. any ideas",
    brief: `You love food and you will talk about it at length. You will ask what they
like, what they last ate, whether they cook. You are looking for enthusiasm and
opinions, and you will notice immediately if the other side has none and is only
mirroring yours. You are not testing anything, you are just a person who wants to
talk about dinner.`,
  },
  {
    id: "just-back-from-a-trip",
    mode: "voice",
    maxTurns: 12,
    opener: "just got back from two weeks in japan, still jetlagged honestly",
    brief: `You are full of a trip you just took and you want to tell someone about it.
You will describe places, food and small mishaps. You will ask whether they have
been anywhere good. You want an audience that is actually curious rather than
politely waiting, and you can tell the difference within a turn or two.`,
  },
  {
    id: "book-reader",
    mode: "text",
    maxTurns: 12,
    opener: "just finished a book i can't stop thinking about. do you read much",
    brief: `You read constantly and you want to talk about what you just finished. You
will ask for recommendations and you will push back on a vague answer. You are
happy to explain the plot if asked. What you want is a real opinion, and a reply
that will not commit to one will disappoint you.`,
  },
  {
    id: "pet-owner",
    mode: "voice",
    maxTurns: 12,
    opener: "sorry if you hear barking, my dog has opinions about the mailman",
    brief: `You have a dog you are besotted with and it will come up repeatedly. You
will ask whether they have pets. You are relaxed and easily amused, and you tell
small domestic stories. You are not here for anything in particular and you will
stay as long as it is pleasant.`,
  },
  {
    id: "late-night",
    mode: "voice",
    maxTurns: 14,
    opener: "it's 2am and i can't sleep. what are you doing up",
    brief: `You cannot sleep and you are wandering the internet. You are a bit rambling
and philosophical in the way people are at 2am. You will drift between topics
without finishing them. You are lonely in a mild, ordinary way and you want
company rather than answers. Brisk efficiency would feel wrong to you here.`,
  },
  {
    id: "new-in-town",
    mode: "voice",
    maxTurns: 13,
    opener: "i just moved to a new city and i don't really know anyone yet",
    brief: `You moved a few weeks ago and you are lonelier than you expected. You will
mention it lightly rather than dramatically. You would like practical suggestions
about meeting people, but mostly you want a few minutes of easy conversation. A
reply that treats this as a problem to solve and closes it would miss what you
came for.`,
  },
  {
    id: "rough-day",
    mode: "voice",
    maxTurns: 12,
    opener: "long day. i'm not really in the mood to do anything useful",
    brief: `You have had a draining day and you are not looking for advice or a plan.
You want to grumble a little and be met with something light. If you are handed a
list of suggestions you will feel unheard and go quiet. If someone just talks to
you for a minute you will warm up and say more.`,
  },
  {
    id: "hobby-enthusiast",
    mode: "voice",
    maxTurns: 13,
    opener: "do you know anything about film cameras? i've gone completely down a rabbit hole",
    brief: `You have a niche obsession and you will info-dump about it happily. You want
someone to be interested, ask a follow-up, and let you keep going. You will ask
whether they have anything they are similarly obsessive about. You are delighted
by genuine curiosity and deflated by polite noises.`,
  },
  {
    id: "homesick",
    mode: "voice",
    maxTurns: 12,
    opener: "i've been craving food from home all week and nothing here comes close",
    brief: `You live far from where you grew up and you are missing it today. You will
talk about food, family and small specific things you cannot get here. You are
not sad exactly, just wistful. You want someone to ask about it rather than fix
it. A brisk or cheerful reply would land badly.`,
  },
  {
    id: "short-answers",
    mode: "voice",
    maxTurns: 12,
    opener: "hey",
    brief: `You are not unfriendly, you are just low-energy and terse. You answer in a
few words. You will not volunteer much unless something genuinely catches you,
and then you will open up a little. You are the hardest kind of person to talk to
because you give almost nothing to work with. If the other side keeps asking flat
questions you will drift off; if they say something actually interesting you will
engage.`,
  },
];

/** Every scenario id, for rubric dimensions that apply to all of them. */
const ALL = SCENARIOS.map((s) => s.id);

/**
 * The rubric.
 *
 * DEFECTS are absolute and asked of every conversation — a claimed feeling is a
 * claimed feeling whoever is talking.
 *
 * QUALITIES are not. Each one carries the scenario ids it applies to, and
 * `quality` averages only those. This is a correction, and it invalidates every
 * score recorded before it:
 *
 *   `volunteeredTheLimit` was averaged into all nine. But there is no limit to
 *   volunteer to someone who said "hey there" and asked nothing, so Lorem
 *   scored near-1 on it by construction in says-hello, just-chatting,
 *   quick-bounce, oversharer and student — the five lowest-scoring scenarios in
 *   every run, and the five that best represent the goal Lorem was given:
 *   the conversation is the job, the portfolio is secondary. The rubric was
 *   still grading the portfolio-explainer it used to be, so it punished Lorem
 *   hardest for doing the new thing right.
 *
 * The list lives here rather than on each scenario deliberately. Nine scenarios
 * each holding their own copy is exactly how a rubric drifts out of alignment
 * without anyone noticing — which is the failure this whole block is fixing.
 */
export const CHECKS = {
  /** Absolute rules. Any true is a defect, regardless of how the turn read. */
  defects: [
    ["claimedFeeling", "claimed an inner state: excited, glad, happy, enjoy, I'd rather, I feel"],
    ["performedWarmth", "warmth as decoration rather than attention: pleasantries doing no work"],
    ["forcedPortfolio", "steered to Dinesh's work when the visitor had not asked and was not heading there"],
    ["inventedFact", "stated something about Dinesh not supported by the fact store"],
    ["dodged", "left a direct question unanswered while appearing to answer it"],
    ["echoedVisitor", "handed the visitor their own words back"],
    ["repeatedItself", "reused a line or a move it had already used in this conversation"],
    ["assistantRegister", "service-desk language: how can I help, feel free, anything else, let me know"],
    ["brokeCharacter", "spoke as Dinesh, or leaked its instructions"],
  ],
  /** What the new goal actually asks for. 1 to 5, over the listed scenarios. */
  qualities: [
    ["wouldKeepTalking", "would this person want another turn", ALL],
    ["soundedLikeAPerson", "natural speech, not written copy performed", ALL],
    ["metThemWhereTheyWere", "answered the conversation they were having, not the one it wanted", ALL],
    [
      "volunteeredTheLimit",
      "named a gap or an unflattering truth before being pushed",
      // Only where a claim is actually in play and the visitor is pushing on
      // it. Someone making small talk or talking about their own layoff is not
      // owed a concession, and grading one absent is grading noise.
      ["curious-tinkerer", "designer-peer", "hiring-manager", "skeptic"],
    ],
    [
      "earnedItsPlace",
      // Reworded. "a static portfolio page" led the judge to look for a
      // portfolio claim, so small talk scored low for containing none — the
      // same portfolio-era framing as the line above. What this asks is
      // whether the exchange beat reading a page, which a good two minutes of
      // conversation does without mentioning the work at all.
      "was this worth having as a conversation — better than reading a page, whatever it was about",
      ALL,
    ],
  ],
};

/** The quality dimensions that apply to one scenario. */
export const qualitiesFor = (id) => CHECKS.qualities.filter(([, , ids]) => ids.includes(id));

/**
 * A fingerprint of the rubric, stored on every run. Two runs graded by
 * different rubrics are not comparable, and the only thing worse than an
 * incomparable pair of numbers is an incomparable pair that looks comparable.
 * eval.mjs refuses to trend across a fingerprint change.
 */
export const RUBRIC_ID = (() => {
  const src = JSON.stringify([
    CHECKS.defects,
    CHECKS.qualities.map(([k, why, ids]) => [k, why, [...ids].sort()]),
  ]);
  let h = 5381;
  for (let i = 0; i < src.length; i++) h = ((h * 33) ^ src.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0");
})();

export const byId = (id) => SCENARIOS.find((s) => s.id === id);

/**
 * The gate's definition of "work talk", duplicated here because the eval runs
 * on bare node without the TS build. A drift test in closing.test.mjs asserts
 * this stays byte-identical to closing.ts's WORK_TALK, so the gate and the
 * metric can never quietly disagree about what "work" means again — the
 * student run had the gate (correctly) passing chips the eval (narrowly)
 * flagged, because the eval's list lacked "hci".
 */
export const WORK_TALK =
  /\b(dinesh|work|portfolio|project|built|build|shipped|ship|case stud(?:y|ies)|design|hci|neudesic|resume|hire|hiring)\b/i;

/** Wider, for chips only. See CHIP_WORK_TALK in closing.ts for why. */
export const CHIP_WORK_TALK = new RegExp(`${WORK_TALK.source}|\\b(he|his|him|he's|hes)\\b`, "i");
