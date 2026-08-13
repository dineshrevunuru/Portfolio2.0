# Portfolio Design System — how to build with it

A UX-portfolio design system: an editorial serif/sans pairing (Playfair Display
display type, Poppins for everything else), a pink/blue brand accent, and a
per-project pastel card palette. Components are plain React (no provider, no
Next.js runtime) and style themselves through the DS's CSS classes.

## Setup — one stylesheet, no provider

Import the stylesheet once at the app root; there is **no** context provider to
wrap:

```tsx
import "@portfolio/ds/styles.css";
```

That sheet ships the brand fonts (via a remote @import), the design tokens, the
DS class layers, **and** the Tailwind utilities the components use — so both the
semantic DS classes and ordinary Tailwind utilities (`flex`, `grid`, `mt-6`,
`max-w-[1440px]`, `text-white`) resolve with no Tailwind at your end.

**Case-study theming is inherited, not a prop.** `CaseStudyCallout`,
`CaseStudyPhase`, `CaseStudyHero` (eyebrow), and the `cs-intro-band` /
`cs-phase-band` strips read their accent color from the nearest
`cs-theme-<slug>` ancestor. Wrap a case-study page in one to theme it; omit it
and they fall back to a neutral blue. Slugs: `adani`, `microsoft`, `jira`,
`lcg`, `uniquefit`, `reporters`, `b2b`, `hss`.

`cs-theme-hss` carries more than an accent: it also repaints the act-break
strip olive (`--cs-brand-dark`) and supplies a second accent
(`--cs-brand-green`, `#002526`) used for section labels and the highlight
marker. It is the reference implementation of a fully themed case study.

```tsx
<main className="cs-theme-jira">
  <SiteNav active="home" />
  <CaseStudyHero eyebrow="Case study" title="Rebuilding the booking flow" />
  <CaseStudyCallout label="Problem">Users dropped off before payment.</CaseStudyCallout>
</main>
```

## Styling idiom — utility classes with a real vocabulary

Style with these DS classes (not invented names). New Tailwind utility classes
are also fine since they're compiled in.

- **Type** — `t-serif-hero`, `t-sans-hero`, `t-serif-title`, `t-section-head`,
  `t-body-lg`, `t-body`, `t-body-fun`, `t-cta`, `t-fun-title`, and the footer
  set `t-footer-brand` / `t-footer-role` / `t-footer-meta` / `t-footer-contact`
  / `t-footer-social`. All responsive at 1024px / 640px.
- **Section padding** — `pad-nav`, `pad-hero`, `pad-section`, `pad-cards`,
  `pad-footer-inner`.
- **Cards** — `project-card` + a color variant `card-<slug>` (same 7 slugs);
  thumbnail bleeds `thumb` / `thumb-wide` / `thumb-composite` / `thumb-tall`;
  plus `fun-card` and the `hero-card` / `hero-copy` / `hero-portrait` set.
- **Case study** — `cs-container` / `cs-container-wide` / `cs-container-full`,
  `cs-hero-title`, `cs-eyebrow`, `cs-meta-label` / `cs-meta-value`,
  `cs-section-head` / `cs-section-head-prototype`, `cs-prose`, `cs-list` (+
  `cs-list--bulleted` / `cs-list--ordered`), `cs-figure`, `cs-placeholder`,
  `cs-caption`, `cs-callout` (+ `cs-callout-label` / `cs-callout-body`),
  `cs-intro-band` / `cs-intro-label`, `cs-phase-band`, `cs-insight-quote`,
  `cs-overview-head` / `cs-overview-body`.
- **Case-study page furniture** — a full-page case study is assembled from
  full-bleed bands alternating with the prose rail. Act breaks:
  `cs-phase-wrapper` wrapping `cs-phase-number` + `cs-phase-claim` (the claim
  is the act's argument in one sentence, and is what `CaseStudyPhase`'s
  `claim` prop renders). Artifact stages: `cs-figure-band` (a tinted
  full-bleed band behind a figure) and `cs-hero-band`. Transitions:
  `cs-handoff` / `cs-handoff-line`, `cs-depth-band`.
- **Summary and outcomes** — `cs-summary-block` (one of problem / solution /
  outcome), `cs-summary-statement` (the 28px statement), `cs-summary-mark`
  (the highlighter, painted as a gradient so wrapped lines don't collide), and
  the metric board `cs-stage` with `cs-stage-from` / `cs-stage-value`
  (+ `cs-stage-value--lead` for the single accent figure) / `cs-stage-label` /
  `cs-stage-note`.
- **Embedded prototype** — `cs-demo` (the two-column rail), `cs-demo-copy`,
  `cs-demo-note`, `cs-demo-stage`, `cs-demo-frame`, and the click-to-load
  poster: `cs-demo-poster` + `-eyebrow` / `-title` / `-body` / `-cta`, with
  `cs-demo-cursor` supplying the animated click prompt.

## Tokens (`var(--*)`)

Brand: `--color-accent` (pink), `--color-brand-blue`, `--color-footer-blue`,
`--color-ink` / `--color-head-ink` / `--color-body-ink`. Surfaces:
`--color-hero-bg`, `--color-fun-bg`. Per-project cards:
`--color-card-<slug>-bg` / `--color-card-<slug>-ink`. Type families:
`--font-sans`, `--font-serif`. Case-study scope (set by `cs-theme-<slug>`):
`--cs-brand-dark`, `--cs-brand-green`, `--cs-accent-bg`, `--cs-accent-ink`.

**Motion is a locked set — reference these, never write a raw curve or
duration.** Curves: `--ease-enter` (the settle, for entrance transforms),
`--ease-enter-soft` (entrance opacity), `--ease-exit`, `--ease-morph`
(in-place state change). Durations: `--dur-quick` (press, hover, toggle),
`--dur-standard` (entrances), `--dur-slow` (set-pieces). An inline
`cubic-bezier()` or a hard-coded `ms` value anywhere in a design is a defect.

## Where the truth lives

Read `_ds/<folder>/styles.css` (the compiled DS stylesheet — every class and
token above is defined there) before styling, and each component's
`<Name>.prompt.md` + `<Name>.d.ts` for its API.
