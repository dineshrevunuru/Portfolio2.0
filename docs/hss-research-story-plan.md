# HSS case study — the research story, and the visuals that carry it

**Goal:** turn the middle of the case from narrative into *evidence of work*. A reader should be
able to scroll it with the prose switched off and still see a designer who did the analysis.

**Method:** most of this is visual. Prose becomes captions. Each artifact below is one idea, and
every caption is a causal edge — "this produced that" — not a description of the picture.

**Supersedes** `VISUAL-ASSET-PLAN.md` in the workpack, which is keyed to the retired Tier 1/Tier 2
structure and the retired metric set.

---

## Where it goes

The page has four acts. The research story expands **Act One**, which is currently three short
sections, into the densest part of the case. Acts two through four stay roughly as they are.

```
Act 1 · DIAGNOSE      ← all of the new work lands here
  1 the business, in numbers        (unit economics + CAC bleed)
  2 how I found out                 (method, artifacts)
  3 who was losing out              (personas, journeys)
  4 what I considered               (solution variations, the pick)
Act 2 · ASSISTANT     ← + conversation design, flows
Act 3 · PLATFORM      ← + architecture, migration, dev challenges
Act 4 · RESULTS       ← + GA4/Ads integration proof
```

---

## 1 · Business math and CAC

The strongest section in the case, because almost no design portfolio has one.

| # | Artifact | What it shows | Format | Status |
|---|---|---|---|---|
| B1 | **CAC bleed chart** | $105 → worst month $98–110 → $50 → $40, target line at $40 | line/area | **I can build** — data verified |
| B2 | **Retention gap** | 40% → 72% against an 80% target, gap left visible | bar | **I can build** |
| B3 | **Unit economics** | First visit ≈ breakeven; profit begins at visit two | diagram | **NEEDS YOU** — I have the shape, not the numbers |
| B4 | **The invisible-conversion loop** | Ads can't see bookings → optimiser bids blind → CAC climbs → fewer bookings | cycle diagram | **I can build** |
| B5 | **What the fix was worth** | CAC delta × new customers = recovered spend | diagram | **NEEDS YOU** — needs B3 |

**B4 is the thesis of the whole case** and doesn't exist yet in any form. It's the diagram that
proves the booking problem *was* the marketing problem.

**Blocked on you for B3/B5:** average first-visit revenue, average maintenance-visit revenue,
rough cost of service. Round numbers are fine — the point is the shape, not the audit.

---

## 2 · Problem statements

| # | Artifact | What it shows | Format | Status |
|---|---|---|---|---|
| P1 | **Three problems → one problem** | The owners' three complaints converging on one broken handover | diagram | **I can build** |
| P2 | **Problem statement + hypothesis** | Pulled out as a full-bleed statement, not a paragraph | typographic | **I can build** |
| P3 | **The leak map** | Ad → site → two dead ends (silent form, sign-in-walled widget) | diagram | **I can build** |

---

## 3 · Users and artifacts

| # | Artifact | What it shows | Format | Status |
|---|---|---|---|---|
| U1 | **Interview evidence** | 8 interviews, redacted — the actual artifact | screenshot | **NEEDS YOU** |
| U2 | **Persona set** | Who was losing out, and what each lost | diagram | **DECISION NEEDED — see below** |
| U3 | **Pain-point affinity board** | Raw quotes clustered into the three failures | diagram | **NEEDS YOU** — raw notes |
| U4 | **Journey map, before** | The decided booker hitting the sign-in wall | swimlane | **I can build** |
| U5 | **Journey map, after** | Same person, four taps | swimlane | **I can build** |
| U6 | **Quote cards** | The CEO and stylist lines, set as evidence | typographic | **I can build** |

> **Decision — the persona sets conflict.** The live page has **five** (first-timer, returning
> client, Spanish speaker, stylist, owner) drawn from interviews. The old draft has **three**
> (new prospect, returning client, decided booker) drawn from chat logs. They answer different
> questions — the five are *who was losing out*, the three are *who the assistant serves*.
> **Recommendation: keep both, in different places.** Five in Act One as research findings, three
> in Act Two as the design target. That is honest and it shows the research actually narrowed.

---

## 4 · Solution variations, and why the chatbot

You asked for this specifically and it is **the biggest content gap in the case.**

| # | Artifact | What it shows | Format | Status |
|---|---|---|---|---|
| S1 | **Impact/effort matrix** | Every candidate fix, with the chosen quadrant marked | matrix | **NEEDS YOU** — the page references this matrix but the actual items were never written down |
| S2 | **Option comparison** | Fix the form · buy an off-shelf bot · use Vagaro's own · build custom | table/diagram | **NEEDS YOU** |
| S3 | **Why not off-the-shelf** | JotForm's actual failure modes, evidenced from the old chats | diagram | Partly — some evidence exists |
| S4 | **Why not Vagaro's booking** | ~10s load, forced Google/Vagaro sign-in, new users bounce | diagram | **I can build** |
| S5 | **Concept sketches** | The variations explored before the hybrid won | sketches | **NEEDS YOU** |

**Honest flag:** the only record of the alternatives is one sentence in the old draft — *"a
free-text bot, a smarter form, or a guided hybrid."* If you explored more than that, it's in your
head or in Figma, and it needs to come out. If you *didn't* explore more than that, we should say
so plainly rather than reconstruct a design process that didn't happen. A thin, true exploration
section beats a rich, retrofitted one — and this is exactly the kind of thing an interviewer
probes.

---

## 5 · Conversation design and flows

| # | Artifact | What it shows | Format | Status |
|---|---|---|---|---|
| C1 | **Conversation vs booking split** | LLM + knowledge base on one side, deterministic wizard on the other | diagram | **I can build** |
| C2 | **Booking step machine** | service → date → time → email → code → name → confirm → done | flow | **I can build** |
| C3 | **Returning-customer shortcut** | The same machine collapsing to four taps | flow | **I can build** |
| C4 | **Tool boundary** | The four tools, and the absence of a fifth that writes | diagram | **I can build** |
| C5 | **Knowledge hub map** | Facts baked in · prices pulled live, never baked | diagram | **I can build** |
| C6 | **Conversation samples** | Three real transcripts: prospect, returner, off-topic refusal | transcript cards | **NEEDS YOU** — anonymised logs |
| C7 | **Live flow recording** | Real booking, mobile and desktop | video | **NEEDS YOU** |

---

## 6 · Analytics and ads integration

| # | Artifact | What it shows | Format | Status |
|---|---|---|---|---|
| A1 | **Conversion path, before/after** | Where the signal died, and where it now fires | diagram | **I can build** |
| A2 | **GA4 + Ads evidence** | Real conversions landing, anonymised | screenshot | **NEEDS YOU — highest credibility value in the case** |
| A3 | **Server-side event flow** | Booking write → GA4 → Ads, off the browser | sequence | **I can build** |

---

## 7 · Technology and development challenges

| # | Artifact | What it shows | Format | Status |
|---|---|---|---|---|
| T1 | **Architecture** | Supabase as single source of truth; chatbot, admin, customer app, Vagaro | diagram | **I can build** |
| T2 | **Dual-source availability** | A slot offered only if free in both systems, GiST constraint as backstop | diagram | **I can build** |
| T3 | **The Vagaro write-limit finding** | 7 probe scripts, 50+ calls, and the three costed paths given to the owner | diagram | **I can build** — procurement-grade work, currently one paragraph |
| T4 | **The migration ladder** | 212 extracted → 210 written; 491 → 483; ambiguous matches deliberately parked for a human | diagram | **I can build** — nobody else's portfolio has this |
| T5 | **Security layers** | Deny-all by default · hashed rate-limited OTP · signed state blob · double-book backstop | diagram | **I can build** |
| T6 | **The cancel bug** | Status map with no "Deleted" branch → cancelled slots came back as booked | before/after | **I can build** |
| T7 | **Prompt Contract Framework** | Define → Constrain → Write → Iterate | interactive | Exists as `prompt_contract_framework_v3.html` — **needs locating** |

---

## What I can start on immediately

Fifteen artifacts need no input from you: **B1, B2, B4, P1, P2, P3, U4, U5, U6, C1–C5, A1, A3,
T1–T6.** All are built from facts already verified against the codebase or the client's data.

## What is blocked on you

**High value, low effort:**
1. GA4 / Ads screenshot (A2) — the single most credibility-carrying asset in the case
2. Live booking recording, mobile + desktop (C7)
3. JotForm screenshot from the archive (S3)
4. Three anonymised transcripts (C6)

**Needs thinking, not just files:**
5. Unit economics — three rough numbers (B3, unblocks B5)
6. The solution variations you actually explored (S1, S2, S5)
7. Persona decision — the five/three split above

## Sequencing

1. **Diagram sprint** — the fifteen unblocked artifacts, as a consistent set in one visual language
2. **Your capture pass** — screenshots and recordings from the list above
3. **The exploration section** — needs a conversation, not a task
4. **Assembly** — sections and captions, then a visual-density pass across the whole page

---

## Two open items carried over

- **Which metric set is canonical** — $105→$40 / 86 bookings / 11 weeks (live page) versus
  $10–15 / 7 bookings / 5 days (old draft). Every chart in section 1 depends on the answer.
- **Client naming permission** — the page currently names nobody; the old draft names the
  business, the city, and both stakeholders.
