<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Portfolio 2.0

Dinesh Revunuru's portfolio site, plus the design system behind it. Next.js 16
(Turbopack), React 19, TypeScript, Tailwind v4, npm workspaces.

Read this before changing anything. Most of what follows was learned by getting
it wrong first.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # also typechecks — `next dev` does NOT
npm test             # guardrail + conversation tests, no network needed
npm run check:keys   # verifies .env.local keys actually authenticate
```

`.env.local` is required for the AI routes (`/lorem`, `/hss-demo`) and is
gitignored. Everything else runs without it.

## Layout

| Path | What it is |
|---|---|
| `app/` | The site. App Router. |
| `app/components/lorem/` | Lorem, the voice agent at `/lorem` |
| `app/components/case-study/` | Case-study building blocks |
| `app/hss-demo/` | The operable booking demo embedded in the HSS case study |
| `app/globals.css` | All site CSS, including the `cs-*` case-study system |
| `packages/ds/` | Design system, published to a Claude Design project |
| `test/` | Guardrail and conversation tests for the AI layer |

## Conventions that are easy to get wrong

**1. Case-study CSS lives in two files and nothing keeps them in sync.**
The `cs-*` classes exist in both `app/globals.css` and
`packages/ds/src/styles/patterns.css`. Change both, every time. Editing only the
app copy means the next design-system sync silently pushes the stale value.

**2. Turbopack caches CSS across dev-server restarts.**
If a style edit does not appear, `rm -rf .next` is the fix. Restarting the
server twice will serve the same stale sheet with an unchanged content hash.

**3. `next dev` does not typecheck. `next build` does.**
Run the build before believing a change is clean. Type errors can hide for weeks
otherwise.

**4. There is no motion library, deliberately.**
Motion is CSS plus `requestAnimationFrame`. Scroll-linked motion derives every
visual from one CSS custom property through `calc()` — see
`app/components/case-study/ScrollProgressPill.tsx`, where a single `--m` drives
width, padding, type size, and opacity. Do not add framer-motion or GSAP without
discussing it first.

**5. Measure in the browser; do not reason about layout from source.**
Margin collapsing, rendered line counts, and scroll offsets have each produced a
confident wrong answer here. Two specific traps: `grep -c` on minified CSS counts
*lines*, not occurrences; and `img.decode()` never resolves for an image that
has not started loading, so always race it against a timeout.

**6. `next/image` hydrates a `srcset`** pointing at the optimizer route, and it
beats `src`. Anything that rewrites image sources has to handle it.

**7. Fonts load through `next/font` via hashed classes on `<html>`.**
Remove them and the whole page silently falls back to a different stack and
re-wraps every paragraph.

## Content rules

The case studies describe real client work under NDA. These are not style
preferences.

- **Never name the hair-replacement client**, and keep their real name, street
  address, and phone out of the demo. The sandbox already neutralises these.
- **Never use the word "salon."**
- **Say "per conversion," never "per booking."** Conversion is what the data
  supports; booking is a stronger claim than the evidence carries.
- **Never claim Spanish or multilingual support.**
- **Never say "all" records were migrated.** It is 210 notes of 212, and 483
  photos of 491.
- **Neudesic work is NDA-bound**: names and scale only, never metrics, and never
  say it shipped to production.

`npm test` enforces some of this at the AI layer — the guardrail rejects any
number the fact store cannot back. Do not weaken it to make a test pass.

## Code style

- Match the surrounding code. Comment density, naming, and idiom included.
- Comments explain *why*, never *what*. Several files carry notes about a
  specific failure that a change would reintroduce; keep those.
- Minimal diffs. Change what needs changing.
- Readability over cleverness.

## Before opening a PR

1. `npm run build` passes, TypeScript clean
2. `npm test` passes
3. If you touched `cs-*` CSS, both copies are updated
4. Verified in a browser, not just compiled
