# HSS case study — three-phase build plan

**Status:** draft for approval. Nothing runs until Phase 1's contract and lane map are signed off.

---

## Phase 1 — Figma assets

### The problem this phase solves

Fourteen boards need building or rebuilding. Doing them one at a time in conversation costs a
full session per board and I have been wrong twice on direction. Agents can parallelise the
build; the value is in the **gate**, not the speed.

### The pattern contract (hard, not advisory)

Every board obeys the structure proven across B4-alt, T5-alt and T2-alt. Builders receive this
as a specification they may not deviate from without stating why:

1. **Stage panel carrying the finding** — a number where one exists, the rule stated as language
   where it doesn't. Teal `#002526`, 16px radius, gold `#E7BF6D` eyebrow, white numerals.
2. **An aside at panel level** — why this is a *design* finding, not just a fact. Never left in
   the caption, where it goes unread.
3. **A labelled band** — the mechanism **shown operating**, never described. No unlabelled
   columns; the reader always knows what they are looking at.
4. **Peers styled as peers** — semantic markers carry difference (dash = blocked, dot = allowed).
   **Opacity is only ever for genuine level-3 content.** This rule exists because it was violated
   three times: fading real content to express a metaphor made the most important text the least
   legible each time.
5. **A closing line in accent, then a short caption.**

**Hard floors:** Poppins only · display 36px+ · body 13px minimum at ≥64% opacity (AA at this
size) · 1200px board width · 80px margins · no pure `#000` ink · one accent doing real work.

**Fact discipline:** every numeral traces to `app/components/lorem/facts.ts`. "Per conversion"
never becomes "per booking." Any figure not in the store is flagged, not invented. Illustrative
data (e.g. T2-alt's eight-slot morning) must be labelled illustrative.

### Agent roles

| Role | Count | Job |
|---|---|---|
| **Builder** | 1 per board | Builds to the contract in its assigned lane. Returns node ids + a screenshot. |
| **Interrogator** | 1 per board | Adversarial. Loads `craft-critique`. Asks of every element: why is this here, what does it earn, is it overdone, what context is missing, what claim is unevidenced. Defaults to "cut it." |
| **Presenter** | 1 per wave | Loads `design-taste` + `craft-critique`. Holds Dinesh's taste and a **veto**. Judges the wave as a set, not board by board — consistency is its specific job. |

The Interrogator is the point of the phase. Its brief is hostile by design: a lenient pass is
worse than none, and it must produce a verdict per board, not a list of notes.

### How the reviewers are kept strict

An agent told to "be critical" produces three polite notes and approves. These are the mechanisms
that make leniency structurally difficult rather than merely discouraged.

**1 · The burden of proof sits on the board.** The default verdict is **REJECT**. A board is
approved only when the reviewer has tried and failed to construct a reasonable objection — and it
must say what it tried. "I found no issues" is not a permitted output; "I attacked X, Y and Z, and
here is why each held" is.

**2 · Every element is charged rent.** The Interrogator enumerates *every* element on the board —
each text, rule, panel, marker, gap — and assigns KEEP or CUT with a one-line reason. An element
whose reason is a restatement of what it is ("the caption gives context") is an automatic CUT.
Elements must earn their place against a specific reader need.

**3 · Findings must be measurable, not impressionistic.** Every finding names the exact element,
quotes the exact text or value, and cites the principle violated. Banned outputs: "feels cluttered",
"could be stronger", "consider adding". Required shape: *element + measured value + principle +
consequence + fix*. Contrast is computed, not eyeballed. Word counts are counted.

**4 · Four independent lenses, not one reviewer wearing four hats.** Each board is attacked by
reviewers who cannot see each other's findings:
   - **Evidence** — every numeral traced to `facts.ts`; every claim cite-it / get-it / flag-it
   - **Hierarchy** — `apply-visual-hierarchy`: is there exactly one level-1, does it survive a
     squint, does the hierarchy survive grayscale
   - **Taste** — `design-taste`, including the calibration cases below
   - **Copy** — consistency of pattern, register, and the no-jargon floor

   A single lens missing something is expected. All four missing the same thing is not.

**5 · No self-approval, ever.** A builder never reviews its own board. A reviewer never reviews a
board it previously passed — second-round review goes to a fresh reviewer, so nobody defends a
call they already made.

**6 · Two consecutive clean passes.** A board is not done when it is fixed. It is done when it
survives a *fresh* review after the fix, by a reviewer who did not see the first round. One clean
pass means the fix addressed the finding; two means it did not create a new one.

**7 · The Presenter answers one question in Dinesh's voice.** Not "is this good" but: **"would
Dinesh kill this on sight?"** — with the calibration cases as the bar. He spec'd, picked and then
killed *The Line You Draw* (a widget that tested perfectly) and *The Convergence* (a passive,
zero-overshoot set-piece he had approved). Both died on feel, not function. A Presenter that never
invokes that standard is not doing the job.

**8 · The Presenter judges the wave, not the board.** Its unique job is what per-board review
structurally cannot catch: does board 3 use a device board 1 established differently? Do all four
share one type ramp, one accent budget, one grouping ladder? Inconsistency across a set is
invisible to anyone reviewing one board at a time.

**9 · Escalation is recorded, not resolved quietly.** Where a reviewer and the Presenter disagree,
the disagreement comes to Dinesh with both arguments. Reviewers do not negotiate to consensus —
that is how strict reviews become average ones.

### Waves

Fourteen boards is too many for one run. Three waves, each ~4 boards, reviewed by you between
waves so a wrong direction costs one wave and not the phase.

**Wave A — rebuild the six on the old pattern**
P1 (three problems) · T4 (migration ladder) · C2 (step machine) · U4/U5 (journey) · P2 (problem
statement) · U2 (personas — needs a decision first, see Open questions)

**Wave B — the unbuilt mechanism boards**
T1 (architecture) · T3 (Vagaro write-limit finding) · C5 (knowledge hub) · T6 (the cancel bug)

**Wave C — the story and evidence boards**
U6 (insight cards) · P3 (leak map) · A1 (conversion path before/after) · DS (the design system in
TypeScript) · BRAND (identity system)

### Collision control

Parallel writes to one Figma file will overlap unless positions are assigned. **Each builder gets
a fixed lane** — an x/y origin it may not leave — allocated before the wave starts. No builder
repositions another board. A single reflow pass runs after each wave, by me, not by agents.

### What Phase 1 explicitly cannot do

These are blocked on information, not effort. No agent can build them:

- **CAC chart, unit economics** — blocked on the metric question ($105→$40 vs $10–15)
- **Impact/effort matrix** — the items were never written down
- **Interview guide, affinity board** — research instruments; fabricating them is out of bounds

### Exit criteria

- Every board passes the Interrogator with a recorded verdict
- The Presenter approves the wave as a consistent set
- Zero unverified numerals
- You have seen and signed off each wave

---

## Phase 2 — Assemble the case study

Runs after Phase 1, on the page rather than in Figma.

1. **Landmark pass** — each of the four acts opens with one dominant visual and a one-sentence
   claim, so a scanner has four stopping points and can leave after any of them with the argument
   intact. (Current problem: 58 sections at ~53 words each, no landmarks — which is why 3,085
   words *feels* longer than Uniquefit's 3,767.)
2. **Place the assets** — the fifteen image slots take real boards; the nine needing photography
   or screenshots stay marked.
3. **Band the depth** — how it's built, the Prompt Contract Framework, trust architecture and the
   design system become a marked optional band, so a recruiter skips without feeling they missed
   something and an engineer dives in.
4. **Cut ~400 words of overlap** — the loop is told twice (Act 1 and the "for the business"
   bullets); "the honest part" and "what's still open" are two candour sections doing one job;
   the accessibility list runs eight items where four carry it.
5. **Reconcile ecommerce** — the page says it was cut; `plans-hair-systems` contains a working
   order flow. One of those is wrong.

---

## Phase 3 — Verify and ship

1. **Evidence audit** — every claim on the page through `craft-critique`'s protocol: cite it, get
   it, or flag it. No exceptions for the flattering ones.
2. **Accessibility gate** — `audit-accessibility`. Contrast, focus, targets, reduced motion.
   Blocking, not advisory.
3. **Responsive + browser verification** — the real pages, measured, not assumed.
4. **Read as the audience** — once as a recruiter with four minutes, once as a design lead with
   twenty.
5. **Client permission** — the page currently names nobody; the source doc names the business,
   the city and both stakeholders. That is a consent decision, not a copy one.

---

## Open questions — needed before Phase 1 runs

1. **U2 personas.** Five peers with no natural level-1. Either one becomes the emblem and four
   demote, or we accept it is legitimately a grid and exempt it from the pattern. My read: exempt
   it — forcing a hero onto five equal findings would misrepresent the research.
2. **The metric question.** Still gates three boards and the hero line.
3. **Cost.** Wave A alone is ~13 agents. Three waves is ~40 agent-runs plus screenshots. Worth
   confirming you want that spend before the first wave.
