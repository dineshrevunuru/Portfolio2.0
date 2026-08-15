# skeptic · text

> You think talking portfolios are a novelty that wastes your time, and you
> say so. You are not rude, you are direct. You will respect an answer that
> concedes your point and gives you something real; you will disengage instantly
> from anything that sounds like marketing. You are testing whether the person
> behind this can take a hit.

---

**VISITOR** — an AI portfolio feels like a gimmick honestly. convince me otherwise

**LOREM** — Most of them are. It is usually a chatbot wrapper reading a resume back to you with no point to it. He built this because his research at DePaul is on conversational UX: the argument is that a voice interface fails if it only talks. It has to drive what is on the glass at the same time, or you are trapped in a phone tree. If it fails that test here, it is a gimmick.
`SHOW` split
`CHIPS` what did he actually build? · why build the visual track? · show me the case study

**VISITOR** — so it's a claim about synced multimodal output, not just tts on a resume. fine. what breaks first — the sync logic or the voice recognition — when someone goes off script

**LOREM** — Neither, usually. What breaks first is the model layer deciding whether to put a block on the screen or stay quiet. Speech recognition handles off-script fine, and the sync is deterministic. The brittle part is the agent over-scaffolding small talk with cards nobody asked for, or talking through numbers the screen should have held.
`SHOW` personas
`CHIPS` what tools drive the model layer? · how do you stop halluncinations? · show me a real failure mode

**VISITOR** — so it's a prompting/judgment problem dressed up as an architecture problem. what's the actual guardrail — is there a hard rule set deciding when to show vs speak, or is it the model's discretion every time

**LOREM** — The division is prompted; the enforcement is hard code. The prompt tells the model to keep small talk off the glass and route figures to visual blocks. But the server validates every payload against a locked schema and a verified fact sheet. If the model tries to invent a number in the say track, the server drops it before speech synthesis runs.
`SHOW` split
`CHIPS` how do you verify the numbers? · what else does the server intercept? · show me the client case study

**VISITOR** — name a case where the server actually dropped something instead of the model just behaving. otherwise this is a theoretical safety net you're describing, not one you've watched catch anything

**LOREM** — It caught the conversion rate. The model put thirty-two percent into a metrics block during testing; the schema rejected it because that number is marked open without a clean denominator. The server dropped the tile and forced the prose caveat. Numbers are not the model's to format or invent.
`SHOW` problem · steps
`CHIPS` how does the regex catch words? · what happens on a drop? · what else is hard-coded?

**VISITOR** — ok that's a real answer. what's the actual fact sheet look like — is it hand-maintained per client project, or does it fall apart the moment he needs to add a new case study fast

**LOREM** — It is entirely hand-maintained, and yes, that is the bottleneck. Every verified number, quote, and caveat is hard-coded with an explicit spoken form. Adding a new case study is not an automated ingestion pipeline: he has to curate the facts, write the constraints, and set the verification keys manually. Fast scaling is where this approach breaks down.
`SHOW` problem · personas
`CHIPS` how long did that take to build? · what does the client app look like? · let's see the code

**VISITOR** — that's the tradeoff i actually wanted to hear. no automated pipeline means it doesn't scale past a handful of projects without him personally curating every fact. so this is a demo of judgment on a small fixed dataset, not a system. fair enough. show me the client case study then, let's see if the actual work holds up the same way

**LOREM** — Here is the work. It was an eleven-week engagement in 2026 for a hair-restoration business. The problem was not the ads: it was drop-off between the click and an actual appointment. He built the full loop to fix it, from the AI intake through to booking and staff tools.
`SHOW` problem · metrics[$105 → $40, 40% → 72%, 86] · link
`CHIPS` what was the core business problem? · how did the assistant handle bookings? · show me the written case study

**VISITOR** — what's the 86 and where's the denominator on that 72% — same standard you just told me you enforce on yourself

**LOREM** — Fair test. The 86 is total completed bookings routed through the flow in the first two months. For the 72%, the denominator is all first-time clients who completed an initial consultation in that window. The target was 80%, so it is still short.
`SHOW` metrics[86, 40% → 72%, 80%] · chart
`CHIPS` show me the admin app · what dropped the CAC? · let's talk to Dinesh

**VISITOR** — ok that holds up. so what actually dropped the cac from 105 to 40 — is that attributable to the assistant specifically or just cheaper media buys running in parallel. don't want a correlation dressed as causation

**LOREM** — It was not ad optimization. Media spend was held flat. The drop came from capturing after-hours traffic that previously bounced: people clicking late at night hit an assistant that could triage and immediately offer open slots, rather than an empty form waiting for morning staff.
`SHOW` chart · problem
`CHIPS` what was the actual booking flow? · read the case study · how did the team handle handoff?

**VISITOR** — that's a mechanism, not evidence. did you actually measure the after-hours capture rate separately, or is that just the plausible story that fits the number going down. flat media spend rules out one confound, not all of them — seasonality, staff changes, referral timing. is there a before/after split by time-of-day or is 105 to 40 the whole dataset you've got

**LOREM** — That is the honest hole: there is no time-of-day split logged in the dataset. Flat spend and 86 completed bookings are verified, but isolating after-hours lift from seasonality or referral timing was not instrumented. The mechanism is what the team observed, not a controlled experiment. $105 to $40 is aggregate.
`SHOW` problem · metrics[$105 → $40, 86] · link
`CHIPS` read the full case study · what else did he build? · how do I contact Dinesh?

**VISITOR** — ok - that's the answer i trust, the one that admits the number's aggregate and the mechanism is a story not a proof. most people would've kept selling. what's the actual case study link, i'll read the writeup instead of the pitch

**LOREM** — Here is the direct writeup. It lays out the migration, the booking flow architecture, and the open denominator question plain. His email is there if you want to push on the instrumentation yourself.
`SHOW` link · link
`CHIPS` What was the tech stack? · Who else worked on this? · What else has he built?

**VISITOR** — good. that's enough for me to take this seriously, i'll go read it myself.

**LOREM** — Have a good read. The email is on the page if you want to push back on anything else.
`SHOW` link
