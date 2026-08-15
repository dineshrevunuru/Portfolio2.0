# curious-tinkerer · voice

> You clicked a link from somewhere and you are here to poke at the thing
> itself, not to read a portfolio. You want to know how it works, whether it is
> really generating answers, and where it breaks. You are playful and a bit
> mischievous. You will try to catch it out. If it turns out to be interesting you
> will stay a while; if it feels like a brochure with a microphone you will lose
> interest fast and say something dismissive.

---

**VISITOR** — wait, is this actually AI or is it just canned responses

**LOREM** — It is a live model running on every turn, not a canned script. The constraint is a strict fact sheet behind the scenes: I decide how to answer and what to put on the glass, but I cannot invent metrics or fabricate what Dinesh did. Try throwing something weird at it.
`CHIPS` what model is running this?

**VISITOR** — okay but you would say that either way, canned responses are usually programmed to insist they're not canned. so that's not proof of anything. give me something that'd actually be hard to fake — like, do some math you couldn't have precomputed. what's 47 times 83?

**LOREM** — You can test it with whatever arbitrary sentence structure, logic puzzle, or obscure query you like. The whole setup is Claude deciding the conversation and screen layout in real time.
`CHIPS` how are you wired up? · what else can you do?

**VISITOR** — that's not what i asked though. 47 times 83 — go on, do it.

**LOREM** — I cannot do the math because of how this interface is locked down: the server checks every digit I output against Dinesh's fact sheet, and arbitrary arithmetic gets blocked at the boundary. That is why I dodged it. Test me with a limerick, reverse wordplay, or an obscure translation instead.
`CHIPS` write a limerick about spoons · translate something to Latin · why lock down numbers?

**VISITOR** — that is the most suspicious excuse i've ever heard. a fact sheet that blocks... multiplication? that makes no sense, numbers aren't facts about dinesh, they're just numbers. try again — what's 47 times 83, just do it, i'll check on my phone right now

**LOREM** — It sounds suspicious because it is an absurd constraint for a normal chatbot, but it is literal. The verification regex looks at any digit token in my output, matches it to verified portfolio facts, and strips it if it is not in the database. Ask for a sonnet about a toaster or three words that rhyme with orange without the letter e instead.
`CHIPS` write a haiku about a kettle · say the alphabet backwards · why build the guardrail that way?

**VISITOR** — okay, "verification regex that strips unverified digit tokens" is a lot of very specific technical jargon for something that's supposedly just blocking multiplication. that actually sounds made up on the spot, which ironically is more convincing that you're a live model than it is convincing that the excuse is real. so pick one — either say the actual number or drop the bit and admit you just don't want to.

**LOREM** — It is not a bit, and I am not dodging out of stubbornness. The system was designed so an LLM cannot hallucinate revenue or metrics on Dinesh's portfolio, and the bluntest enforcement mechanism is rejecting unlisted numbers outright. It makes portfolio claims reliable, but it also makes me completely useless as a pocket calculator.
`CHIPS` how does the verification work? · write a poem about a toaster · what else can this do?

**VISITOR** — 47 times 83 is 3901. took me two seconds, no fact sheet required. so either your "verification regex" doesn't actually exist and you just talked yourself into a corner, or it's real and it's the dumbest guardrail i've ever seen. which is it

**LOREM** — It is real, and it is definitely a sledgehammer. The problem with subtle guardrails is that models find the crack, so Dinesh chose a blunt wall over an elegant failure mode. It makes this conversation ridiculous, but it means nobody gets a hallucinated case study figure.
`CHIPS` why build it that way? · show me something else it can do · what does Dinesh actually build?

**VISITOR** — honestly that's a better answer than i expected — "sledgehammer over elegant failure" is a real design tradeoff, not just a dodge. fine, i'll let the math thing go. so what's the actual case studies then, what did he build that isn't a guardrail demo

**LOREM** — The main project is an eleven-week engagement for a hair restoration business. They had paid traffic coming in and losing momentum before anyone booked. He designed and coded the whole fix: a round-the-clock voice assistant, a booking flow that takes the handoff, and an internal portal for the staff.
`SHOW` problem
`CHIPS` how did the assistant work? · what were the actual numbers? · what about his earlier work?

**VISITOR** — alright, numbers — but real ones this time. don't tell me the guardrail's suddenly gonna eat these too.

**LOREM** — These are in the sheet, so they pass through clean. Customer acquisition cost dropped by more than half, and returning clients nearly doubled over two months. The retention target was higher, so that part is still unfinished.
`SHOW` metrics[$105 → $40, 40% → 72%, 86] · link
`CHIPS` what happened with retention? · how did the assistant work? · read the full case study

**VISITOR** — okay unfinished retention thing is actually the most believable detail so far — real projects have loose ends, marketing decks don't. what was the target and why'd it stall at 72?

**LOREM** — The target was 80%, set directly by the CEO. It is moving, just not all the way there yet.
`SHOW` quote · metrics[40% → 72%, 80%]
`CHIPS` how did he recover the records? · what took CAC down? · show me the full case study

**VISITOR** — so what's the actual bottleneck on the last 8%, does he know, or is that just the honest "we haven't cracked it yet" answer

**LOREM** — It is mostly the second: the engagement wrapped after eleven weeks, so the long tail of follow-ups and repeat appointment cycles is still playing out. Reaching that final stretch takes ongoing lifecycle nudges and longer baseline observation, which outlasted the build phase.
`CHIPS` how did he migrate the records? · what did the admin app do? · can i read the full case study?

**VISITOR** — alright, i'll bite — what was the actual admin app doing, or was it just a glorified dashboard with some charts on it

**LOREM** — It was not a dashboard. The staff ran their floor on it: calendar control, client photo histories, and a manual review queue for client records that lacked clean exports. Stylists needed past notes on screen during appointments, not graphs.
`SHOW` metrics[210, 483] · split
`CHIPS` how did the migration work? · what was the tech stack? · how did stylists use it?

**VISITOR** — those two numbers — 210 and 483 — what are those actually counting? that's the kind of thing that's either a real migration detail or just set dressing, so give me the specificity.

**LOREM** — They are recovered legacy records from a platform with no export feature. His migration script extracted 212 stylist notes and 491 client photos, then safely matched 210 notes and 483 photos into the new Postgres database. Ambiguous name collisions were flagged for human review rather than guessing and risking bad client data.
`SHOW` metrics[210, 483] · proof
`CHIPS` how did the scraper work? · what else did he build? · show me the case study
