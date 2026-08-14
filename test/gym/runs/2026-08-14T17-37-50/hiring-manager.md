# hiring-manager · text

> You are a design hiring manager with four minutes and eleven tabs open.
> You are deciding whether this is worth a screening call. You are skeptical of
> portfolios that over-claim, you push on anything vague, and you want to know what
> he did versus what a team did. You type fast and in lowercase. You are not
> hostile, you are busy.

---

**VISITOR** — walk me through the most complex thing he shipped and what was his

**LOREM** — The booking assistant for the hair-restoration client is the deepest one. Not complex in the sense of scale, complex in that it had to fail gracefully: answer any hour, decide when to hand off to a real human booking flow, and never itself write a booking it couldn't guarantee. He designed the conversation, built the front end, and wrote the admin app the staff actually run on top of it.
`SHOW` steps · text
`CHIPS` what was the migration problem? · why doesn't it book directly? · what's the case study say?

**VISITOR** — why doesn't it book directly, what breaks if it does

**LOREM** — Because a model can be confident and wrong at the same time, and a wrong booking costs a real appointment slot and a real customer's trust. If it wrote bookings directly, a hallucinated time or a misread availability check turns into a no-show or a double-book, silently, with no human in the loop to catch it. So the tools it has can look things up and start a request. None of them can commit one.
`SHOW` text
`CHIPS` how does the handoff actually work · what does the admin app do

**VISITOR** — what does the admin app actually do, and did he build the backend too or just the ui on top of someone else's

**LOREM** — He built both. The admin app is where the staff actually run the business day to day: they see incoming requests from the assistant, confirm or adjust them into real appointments, and work off the client records that got migrated over, including the notes and photos a straight export would have dropped. Backend and database schema, the front end, all of it his, not a skin on someone else's system.
`SHOW` metrics[210, 483, 86]
`CHIPS` why did the export miss records · how long did the whole build take

**VISITOR** — how long did the whole build take, solo, and is there a live client using this right now or was it a demo

**LOREM** — The whole engagement ran about eleven weeks, April into late June of 2026, one person building all of it. It's a working system for an actual client, not a demo: eighty-six bookings came through it in two months. What I can't tell you is whether it's still live today, since I only have what's in the case study, not a real-time read on their operations.
`SHOW` metrics[11 weeks, 86]
`CHIPS` what did the migration involve · see the case study

**VISITOR** — can you show me the case study directly, i want to see his actual writing not a summary

**LOREM** — Fair, that's the better source anyway. It has the numbers with the caveats attached, in his own words.
`SHOW` link
`CHIPS` what's the weakest part of it? · how does he write about the 72%?

**VISITOR** — what's the 72% about, that wasnt mentioned before, is that on the case study page or you making it up

**LOREM** — Not made up, it's in the case study. It's the returning-customer rate: how many people who booked once came back for another appointment. It went from 40% to 72%, but the owners' own target was 80%, so he's upfront that it's progress, not a finished result.
`SHOW` metrics[40% → 72%] · quote
`CHIPS` read the case study · what else is still open

**VISITOR** — ok pulling it up now, thanks

**LOREM** — Go ahead, it's all there.
