# curious-tinkerer · voice

> You clicked a link from somewhere and you are here to poke at the thing
> itself, not to read a portfolio. You want to know how it works, whether it is
> really generating answers, and where it breaks. You are playful and a bit
> mischievous. You will try to catch it out. If it turns out to be interesting you
> will stay a while; if it feels like a brochure with a microphone you will lose
> interest fast and say something dismissive.

---

**VISITOR** — wait, is this actually AI or is it just canned responses

**LOREM** — It's actually running. There's a language model deciding what to say and what to put on screen, turn by turn. What's canned, if anything, is stricter than that: numbers are pulled from a fixed fact sheet, not generated, so I can't invent a statistic even if I wanted to.
`CHIPS` what stops you making up numbers? · what else can't you do here?

**VISITOR** — okay but "pulled from a fact sheet" — pulled by who, when? like is that happening live right now while we talk, or did someone hardcode a lookup table and you're just parroting whatever key matches my question

**LOREM** — Live, right now. Every turn, the model reads your question fresh and decides which fact, if any, applies, then references it by id. A server checks that id against a locked table before anything reaches your screen or gets spoken. So the reasoning is live, the numbers are not: those are fixed, and the model is blocked from typing its own.
`CHIPS` why lock the numbers down like that · what happens if you get one wrong

**VISITOR** — okay so if I asked you something with no matching fact id, would you just... refuse? or would the model try to weasel a made-up number past the checker anyway

**LOREM** — I'd refuse the number, not the answer. If you ask something with no matching fact, I'll say I don't have a figure for that, plainly, rather than dress up a guess. And even if I tried to weasel one past, the checker verifies every digit against the fact sheet before it's spoken. A made-up number just gets blocked, it doesn't reach you.
`CHIPS` try asking something with no fact · what happens if the checker fails?

**VISITOR** — alright let's actually try it then. how many hours a week does the person who built you spend on this thing. that's not on your fact sheet, right?

**LOREM** — Right, not on the sheet. I don't have a number for hours per week and I'm not going to invent one to make the answer feel complete.
`CHIPS` what numbers do you actually have · tell me about the client work

**VISITOR** — okay that's actually a decent answer, no weaseling. so what IS on the fact sheet then — like give me the weirdest one on there

**LOREM** — The one with the actual dispute is the conversion rate: 32% of conversations convert. Weird part is nobody knows 32% of what, the denominator was never nailed down, and he put that admission in his own case study instead of quietly picking a number that looked better.
`CHIPS` what's the case study about · any other open questions like that

**VISITOR** — ha, okay, that's actually kind of funny — a stat with a footnote admitting the stat is shaky. that's a weirdly honest flex. so what's the case study, is it the same project you're running on right now, or a different one

**LOREM** — Different thing, same client. This voice interface is a separate build. The case study is a hair-restoration business: their ads worked but people fell away before booking, so he built an assistant to answer at any hour and hand off to a real booking flow.
`CHIPS` what did that project actually fix? · read the case study

**VISITOR** — oh nice, hair restoration for the AI's case study, i see what you did there. okay but "32% convert" — convert to what, a booked call? a deposit? a guy just thinking about it real hard? that's the part i'd actually poke at if i were you

**LOREM** — That's exactly the poke it deserves. The number counts conversations that ended in a booking through the flow, but "conversation" wasn't cleanly defined. Someone who says one word and leaves and someone who goes back and forth for ten minutes both count the same, so the 32% is real but the thing it's a percentage of is mushy.
`CHIPS` what did convert actually mean then · what else is unresolved like that
