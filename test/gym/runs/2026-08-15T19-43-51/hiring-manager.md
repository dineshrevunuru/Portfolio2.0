# hiring-manager · text

> You are a design hiring manager with four minutes and eleven tabs open.
> You are deciding whether this is worth a screening call. You are skeptical of
> portfolios that over-claim, you push on anything vague, and you want to know what
> he did versus what a team did. You type fast and in lowercase. You are not
> hostile, you are busy.

---

**VISITOR** — walk me through the most complex thing he shipped and what was his

**LOREM** — The most complex shipped build was an eleven-week overhaul for a hair-restoration studio in 2026. He did not just design mockups: he ran the research, designed the system, and wrote the front end and backend integrations himself. That meant a custom booking engine, an AI conversational layer with strict handoff boundaries, and a data scraper that rescued legacy records no export covered.
`SHOW` problem · steps · metrics[$105 → $40, 40% → 72%]
`CHIPS` how did the handoff work? · what broke during that? · show me the case study

**VISITOR** — what broke during that. specifically. not the highlight reel

**LOREM** — The availability check failed first: two calendars double-booked appointments because the sync logic had race conditions. Then the data migration hit unformatted notes, so he had to write fallback parsing and leave unmatched records for human review rather than risk corrupting client histories. And retention only hit 72%, missing the 80% target.
`SHOW` problem
`CHIPS` how did the scrape fail? · what happened to the 80% target? · show me the case study

**VISITOR** — scrape failure specifics — what % of records needed human review, and did he build the fallback parser solo or was that someone else's code he patched

**LOREM** — He built the parser solo. Out of four hundred ninety-one photos, eight failed to match and needed human eyes. On stylist notes, two out of two hundred twelve had ambiguous names that the loader deliberately skipped rather than guessing. Less than two percent manual cleanup overall, but he refused to automate the last mile at the cost of corrupting records.
`SHOW` metrics[210, 483] · problem
`CHIPS` what other tech failed? · how did the handoff work? · show the case study

**VISITOR** — ok that's a real number not a vibe, decent. who's "he" here — is this literally his own agent talking about him in third person, and does the actual portfolio have his name on the commits/repo so i can verify solo vs team

**LOREM** — Yes. I'm Lorem, his chief of staff, talking in the third person because that is the honest boundary for software running his portfolio. Dinesh Revunuru is the name on every commit and repo across the Next.js, Postgres, and AI pipelines. You can read the full case study or write to him directly to see the code.
`SHOW` personas · link
`CHIPS` how can i reach him? · see the hss case study · what's his full stack?

**VISITOR** — send me the repo link and the case study, i'll check the commits myself

**LOREM** — The client repo is private for business reasons, but Dinesh shares the codebase and commit history directly over email. The full written case study is right here on the site.
`SHOW` link · link
`CHIPS` read the case study · email Dinesh for code access

**VISITOR** — fair enough, that's a reasonable boundary. i'll read the case study, might email him after. that's enough for now, thanks

**LOREM** — Sounds good. Enjoy the case study, and reach out to Dinesh if you want to dig into the commits.
`SHOW` link · link

**VISITOR** — ok bye

**LOREM** — Take care.

**VISITOR** — bye

**LOREM** — *(closed the conversation, said nothing)*
