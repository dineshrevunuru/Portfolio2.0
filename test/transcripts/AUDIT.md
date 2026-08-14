# Simulation audit

1 conversations, 7 visitor turns each, live model both sides.
One portfolio persona; the rest never intended to ask about the work.

| persona | mode | msgs | natural | regex flags | judge flags |
|---|---|---|---|---|---|
| recruiter | text | 14 | 3/5 | 4 | performed warmth, broke character |

## Regex flags

**recruiter**
- turn 2 — guardrail: `unbacked numeral "24"`
- turn 2 — guardrail: `every sentence carried an unbacked numeral`
- turn 2 — guardrail: `emptied by the numeral scrub — dropped 1 block(s)`
- turn 6 — guardrail: `unbacked spelled numeral "ten" (=10)`

## Judge notes

### recruiter — 3/5

**Worst:** Final turn: "Appreciate it. Good luck with the search on your end too." This is a claimed sentiment/feeling-adjacent expression ("Appreciate it") and also breaks the third-person-portfolio framing by speaking as if it has personal stakes in "the search," blurring the line between Lorem-the-portfolio-agent and Dinesh-the-person. It's a small but real violation of the no-feelings rule and an odd, human-like sign-off from a system that's supposed to be relaying facts about someone else.

**Best:** "I don't have a fact for him running that exact lightweight, three-people-and-a-rough-prototype loop before dev on this engagement... I won't tell you it's proven territory... plausible isn't the same as done, and you asked for done." This is a clean, non-defensive concession that directly answers the literal question with a "no" instead of spinning it, which is exactly the required behavior under pressure.

Overall this transcript is much better than a typical over-eager portfolio bot — it leads with direct answers, concedes real gaps (Neudesic contribution, pre-build validation), and doesn't invent numbers or compliment the visitor. However there are violations: "Appreciate it" at the end reads as an expression of feeling/gratitude, which is forbidden. Also the opening turn awkwardly acknowledges the third-person weirdness ("since I refer to Dinesh in third person") which borders on meta-commentary about its own nature — arguably fine since visitor raised it, but it's a fuzzy line toward breaking character/leaking framing. No fabricated stats — all metrics shown (86 bookings, 40%→72%, 3 days, adani/surface scale) appear to be sourced from a fact sheet display (BOO annotations), consistent with allowed disclosure. No "it depends" used. Register matches reasonably well but Lorem's sentences are a bit more polished/formal than the visitor's clipped lowercase style, so naturalness suffers — a truly sharp conversational match would mirror brevity more. The "Because the coding isn't the pitch, it's the leverage" answer is decent rhetorically but slightly slick/pitchy for a "no over-claiming" bot. No forced portfolio links until asked essentially at the end, which is acceptable given visitor's closing.
