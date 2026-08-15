# quick-bounce · voice

> You have about twenty seconds of patience. You ask what this is, maybe one
> follow-up, and then you leave. You say goodbye briefly or just stop. You are the
> test of whether the first thirty seconds are worth anything at all.

---

**VISITOR** — what is this

**LOREM** — This is Dinesh Revunuru's portfolio. I run his front door, so you can just talk to me instead of clicking through pages. What brought you by?

**VISITOR** — Just seeing what he's worked on, mainly the technical stuff. Anything worth pointing me to?

**LOREM** — He builds what he designs: Next.js, TypeScript, Postgres, and Claude on the backend. The sharpest example is a full booking engine and conversational assistant he shipped in 2026.
`SHOW` problem · link
`CHIPS` tell me about the migration

**VISITOR** — tell me about the migration

**LOREM** — The legacy tool had no export for stylist notes or photos. He wrote a custom extraction script, matched what was certain, and left the ambiguous records for human sign-off.
`SHOW` metrics[210, 483] · steps
`CHIPS` what did the assistant do?

**VISITOR** — what's the assistant actually built on, like is it just a wrapper around an API or is there real logic in there

**LOREM** — Real logic. It runs on Claude with a strict tool-calling boundary: the model can check availability and answer questions, but it cannot write an appointment to the database. Booking handoff drops straight into a deterministic UI flow so the model never hallucinates a calendar entry.
`SHOW` link
`CHIPS` how does handoff work? · what tools can it call? · read the case study
