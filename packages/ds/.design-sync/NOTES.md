# design-sync notes — @portfolio/ds

Repo-specific gotchas for future syncs. Read before re-running.

## Build / setup

- **Run design-sync from `packages/ds/`** (the config home), not the repo root.
  The package is a workspace member; React resolves at the repo-root
  `node_modules`, so the converter needs `--node-modules ../../node_modules`
  and `--entry ./dist/index.js`.
- `cfg.buildCmd` is `npm run build`. That runs tsup → then compiles Tailwind
  (`tailwindcss -i src/styles/tailwind-build.css -o dist/.ds-tw.css`) → then
  `scripts/bundle-css.mjs` writes the shipped `dist/ds.css` (fonts @import +
  compiled Tailwind + tokens/utilities/patterns) and mirrors `dist/styles/`.
- `cfg.cssEntry` points at **`./dist/ds.css`** — the flattened, self-contained
  stylesheet. Do NOT point it at `dist/styles/index.css`: that barrel uses
  relative `@import`s that don't resolve once inlined, and it lacks the
  Tailwind utilities.

## Why the Tailwind compile step exists (important)

The components mix hand-written DS classes (`t-*`, `cs-*`, `pad-*`, `card-*`)
with **Tailwind utility classes** (`flex`, `grid`, `mt-*`, `text-white`,
`bg-[color:var(--…)]`). Those utilities are generated at app level in the
portfolio, not shipped by the raw source. `src/styles/tailwind-build.css`
`@source`-scans `src/components` **and** `.design-sync/previews` so exactly the
utilities in use get baked into `dist/ds.css`. **If you add a component or
preview that uses a new utility class, it only ships after a rebuild** (the
scan must see it). A preview that renders unstyled boxes almost always means a
utility class wasn't scanned — rebuild before debugging further.

## Known render warns (triaged, not new)

- `[FONT_REMOTE] "Playfair Display", "Poppins"` — expected. Fonts load via a
  Google Fonts `@import` in `fonts.css`; they are not bundled as `@font-face`.
- `tokens: 1 missing (below threshold)` — non-blocking; a `var(--*)` referenced
  by a hand-written class with no matching definition, under the warn floor.

## Overrides

- `overrides.SiteNav.cardMode = "column"` — SiteNav is a full-width bar; column
  mode stops it overflowing its grid cell. SiteFooter is tall but renders
  inside its cell, so it needs no override.

## Previews

- Image-bearing previews (`CaseStudyImage`, `CaseStudyGallery`,
  `CaseStudyVideo`) use inline SVG **data-URI** mock art so they need no shipped
  assets. `CaseStudyVideo` renders via a data-URI **poster** (autoplay has no
  loadable source in the sandbox, so the poster frame is what's captured).
- Case-study previews wrap in a `cs-theme-<slug>` div to exercise accent
  theming (Callout → reporters/jira, Phase → uniquefit).

## Re-sync risks (watch-list)

- **Preview mock content is inlined in the `.tsx` files**, decoupled from the
  real portfolio pages. It won't drift with app copy — intentional — but if the
  component APIs change, update the previews to match `<Name>.d.ts`.
- **Tailwind version is pinned** (`@tailwindcss/cli@4.2.4`, matching
  `tailwindcss@4.2.x`). A major Tailwind bump could change generated utility
  output — rebuild and eyeball `.review.html` if it moves.
- **Fonts are network-fetched at render time.** An offline environment renders
  the fallback stack; not a real regression.
- SiteFooter preview uses the portfolio owner's real public contact details as
  realistic content — fine for this DS.

## 2026-08-03 — the HSS case study migration (read this first)

**The design system and the app had silently diverged.** The portfolio's
`app/globals.css` held 27 `cs-*` classes that the DS did not, plus 9 tokens.
The DS shipped the case-study *components* but not the styling that makes the
HSS page look like itself: no `cs-theme-hss` scope, no `cs-figure-band`
artifact stages, no `cs-stage*` outcomes board, no `cs-summary-*` statements or
highlight marker, no `cs-demo*` prototype block, and `cs-phase-claim` was
missing even though `CaseStudyPhase` ships a `claim` prop that needs it.
`dist/ds.css` was built 17 Jul; the app had moved on to 2 Aug.

All 27 classes + 3 `csCursor*` keyframes + the `[class*="cs-theme-"] nav.top`
rule were migrated into `src/styles/patterns.css`, and these tokens into
`src/styles/tokens.css`:
`--color-card-hss-bg` / `-ink`, `--ease-enter` / `-enter-soft` / `-exit` /
`-morph`, `--dur-quick` / `-standard` / `-slow`.

Four real drifts were also reconciled (not just additions): the three
`cs-container*` rules moved to `width: min(100% - 32px, N)` (the old
`max-width` + `@media (max-width: 840px)` padding left 841–1100px with zero
gutter), and `cs-callout-label` opacity 0.75 → 0.85 (contrast: 12px bold is
normal text under WCAG, so the floor is 4.5:1).

### The standing risk this creates

`app/globals.css` and `packages/ds/src/styles/patterns.css` are two copies of
the same vocabulary with **no mechanism keeping them in sync**. They diverged
once over ~2.5 weeks and will again. Before any future sync, run a parity
check rather than assuming — this is the exact command that found it:

```sh
python3 - <<'PY'
import re
app = set(re.findall(r'\.(cs-[a-z0-9-]+)', open('../../app/globals.css').read()))
ds  = set(re.findall(r'\.(cs-[a-z0-9-]+)', open('dist/ds.css').read()))
print('missing from DS:', sorted(app - ds))
PY
```

A non-empty result means the DS would ship a case study it cannot render.

## Environment gotchas

- **Playwright browsers live at `~/Library/Caches/ms-playwright` on macOS**,
  not `~/.cache/ms-playwright`. Checking the Linux path reports "nothing
  cached" and triggers a needless ~200MB download. Chromium builds 1217/1228/
  1234 were already present; only the `playwright` npm package was missing
  (installed into `.ds-sync/`, which is gitignored — expect to reinstall it
  on a fresh clone).

## The target project is NOT design-sync-only

`aa230818-…` ("Portfolio Design System") also holds ~60 hand-made design
boards (`boards/`), `templates/`, `uploads/`, `scraps/`, and a nested Lorem DS
under `_ds/portfolio-voice-design-system-…/`. **Never pass broad delete globs
here.** On an anchored re-sync, `deletes` must come verbatim from
`.sync-diff.json`'s `upload.deletePaths` (empty on this run) — a
`components/**`-style delete glob would be scoped correctly by the tool, but
any hand-derived list risks the boards.

## Re-sync risks

- **Vocabulary drift** (above) is the big one. Check parity before building.
- **The conventions header now enumerates 41+ `cs-*` classes.** It is
  5.3k chars, over the 2–4k guidance but far under the ~32k truncation point.
  If the DS grows, the header is the first thing to trim, not the class list —
  the design agent cannot use vocabulary that is not named.
- **`SiteNav`'s preview renders its links run-together** in the contact sheet.
  Its `renderHash` is unchanged from the last verified upload, so this is
  pre-existing and was accepted before — not a regression from this run. Worth
  a look if anyone ever authors a real preview for it.
- **No `tokens/` or `fonts/` directories ship.** Tokens are inlined into
  `styles.css` / `_ds_bundle.css`, and fonts load via a remote `@import`
  (`[FONT_REMOTE]` is expected, not a finding).
