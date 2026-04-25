# Visual parity plan — side-by-side deltas vs dineshrevunuru.com

Taken from live Chrome tab at 1440×900 (localhost vs live) and PDF reference `/Users/dineshrevunuru/Downloads/68b04f9e-c1f7-4dbd-97ee-5d31210e347a.pdf`.

## How to read this file

Each row: **Section → Live/PDF reference behavior → Current localhost behavior → Delta → Fix.**
Fixes are ordered by severity. `P1` = blocks visual parity. `P2` = visible-but-minor. `P3` = polish.

---

## P1 — Hero typography wrap

| | |
|---|---|
| Reference | "A UX UI designer." renders on **one line** (live measurement: 522px wide, text fits) |
| Localhost | Wraps to **two lines**: "A UX UI" / "designer." because text column is only ~50% of hero width |
| Root cause | `lg:grid-cols-[1.2fr_1fr]` + `.hero-copy { padding: 0 72px }` gives text ~540px inside a 1140px hero. At `font-size: 64px` the word "designer" overflows. Live site uses 48px hero text, not 64px, and narrower photo column. |
| Fix | Two options: (a) reduce `.t-serif-hero` to **48/50** (matches live exactly), or (b) widen text column to `lg:grid-cols-[1.5fr_1fr]`. Recommend (a) since live uses 48 and the current 64 is bigger than the PDF. |
| Files | `app/globals.css` — `.t-serif-hero { font-size: 48px; line-height: 50px; font-weight: 600; }` |

## P1 — Hero photo size + position

| | |
|---|---|
| Reference | Photo container **413×476**, right side of card, head bleeds **22px above** card top, bottom **flush** with card bottom. Right offset ~60px. |
| Localhost | Photo container **460×520** (oversized), positioned `right: 60px; top: -80px; bottom: 0`. Photo dominates card right side. |
| Root cause | `.hero-portrait { width: 460px; top: -80px }` |
| Fix | `.hero-portrait { width: 413px; top: -22px; bottom: 0; right: 60px; height: auto; }`. Image inside stays `object-contain object-bottom`. |
| Files | `app/globals.css` — `.hero-portrait` block |

## P1 — Uniquefit card: laptop bleeds off LEFT edge (per reference)

| | |
|---|---|
| Reference (PDF page 2, live measurement) | Image width **580px** starting at `-4px` from card left (bleeds slightly left). Right side stops **48px short of card right**. Laptop mockup's left edge is visibly cut off by card boundary. |
| Localhost | Image **fully contained** inside card padding. Laptop + phone composition sits centered in the green card. |
| Decision point | Earlier direction: "images sticking in the card itself, exception to hero." New direction: "meet visual aesthetics as is from the design." These conflict for Uniquefit + 101 Reporters. **Default to reference PDF** (bleed) unless user explicitly overrides. |
| Fix | Add `thumb-bleed-left` variant: `.thumb-bleed-left { margin-left: -36px; }` (offsets card's 36px left padding, image goes to card edge). Max-width card-width (580). Keep card `overflow: hidden` so it clips at the rounded corner. |
| Files | `app/globals.css` + `app/page.tsx` |

## P1 — 101 Reporters card: phone bleeds BELOW card (per reference)

| | |
|---|---|
| Reference | Phone mockup **centered**, image height extends past card's bottom edge. Bottom of phone visible outside card. |
| Localhost | Phone fully contained; bottom of phone inside card. |
| Fix | Add `thumb-bleed-bottom` variant: combines centered horizontal with `margin-bottom: -60px` so the phone's bottom portion sits outside the card's bottom padding. |
| Files | `app/globals.css` + `app/page.tsx` |

## P2 — Fun projects cards: padding / look

| | |
|---|---|
| Reference | Card padding 24px, radius 12px, title Poppins 22/500, desc Poppins 14/300. Clean light-blue card. |
| Localhost | Matches — no delta detected. |
| Status | ✅ already correct |

## P2 — Section vertical rhythm

| | |
|---|---|
| Reference | Live measurements: hero starts 50px after nav; "Projects I have worked on" 80px after hero; first card row 40px after heading; between rows 40px; after last card row 100px; "Fun projects" heading 80px before fun grid; fun grid to footer 100px. |
| Localhost | Approximated values (pt-20 / pt-24 / pt-8 / pt-10 / pb-24). Close but not exact. |
| Fix | Replace Tailwind `pt-*` with explicit px values matching live: `pt-[50px]`, `pt-[80px]`, `pt-10` (40px), `pb-[100px]`. |
| Files | `app/page.tsx` — section `className` values |

## P2 — Projects grid card gap

| | |
|---|---|
| Reference | Live measurement: horizontal gap 40px between cards, vertical gap 40px between rows. |
| Localhost | `lg:gap-10` = 40px ✅ |
| Status | ✅ correct on desktop |

## P3 — Hero photo bleed on tablet/mobile

| | |
|---|---|
| Reference PDF B (mobile) | Photo renders above text, head visible at top, shoulders fade into card. |
| Localhost tablet/mobile | Needs visual test at 1024 and 390. Currently uses `position: relative` with fixed width 320/260. |
| Fix | Re-test at tablet/mobile viewport after hero size fix lands. |

## P3 — Scroll-to-top button

| | |
|---|---|
| Reference | Small blue circle bottom-right (OceanWP theme widget) |
| Localhost | None |
| Decision | Skip — not a core design element, adds surface area |

---

## Ordered execution

1. **`.t-serif-hero` → 48/50, weight 600** (globals.css). Fixes hero wrapping. Trivial, safe.
2. **`.hero-portrait` → width 413, top -22** (globals.css). Fixes hero photo.
3. **Add `.thumb-bleed-left` + update Uniquefit** (globals.css + page.tsx). Fixes Uniquefit composition.
4. **Add `.thumb-bleed-bottom` + update 101 Reporters** (globals.css + page.tsx). Fixes phone card.
5. **Section rhythm px values** (page.tsx). Minor pixel-level refinement.
6. **Re-verify at 1440, 1024, 390.**

Each step is ~1 file edit. Verify after each using the live Chrome tab at the matching viewport.

## How to verify each step

```bash
# Already running
preview_start next-dev

# After each edit, navigate localhost in Chrome
# Take screenshot, eyeball diff against PDF reference
# Key assertions:
#   1. Hero headline on ONE line at 1440
#   2. Hero photo max 413px wide, head peeks 22px above card
#   3. Uniquefit laptop cut off at left card edge
#   4. 101 Reporters phone bottom visible below card
#   5. All 7 card thumbnails load and size correctly
```

## Decision for user

Before executing steps 3 and 4, confirm:

> The reference site (dineshrevunuru.com + the PDF) shows Uniquefit laptop bleeding off the **left** card edge and 101 Reporters phone bleeding off the **bottom** card edge. Your earlier instruction was "images contained inside card, exception to hero." Should I:
>
> (a) Match reference exactly — bleeding card edges for these 2 cards; or
> (b) Keep contained — localhost stays fully inside card on every project.
>
> Default if no reply: (a) match reference.
