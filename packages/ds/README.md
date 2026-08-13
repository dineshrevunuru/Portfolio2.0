# @portfolio/ds

The design system extracted from the Dinesh Revunuru portfolio: brand tokens, a
typographic scale, spacing utilities, layout/card/case-study patterns, and the
React components built on top of them. Components are framework-agnostic (plain
`<img>`/`<a>`, no Next.js runtime) so they render standalone.

## Install

Within this workspace it resolves automatically as `@portfolio/ds`.

## Styling — load the tokens + classes

Every component styles itself through the design system's CSS classes and custom
properties. Import the stylesheet once at your app root:

```ts
import "@portfolio/ds/styles.css";
```

That single import pulls in, in order: the web fonts (Poppins + Playfair
Display), the tokens, the typography/spacing utilities, and the card/hero/
case-study patterns. If you already load the fonts yourself (e.g. `next/font`),
import the finer-grained files instead and skip `fonts.css`.

**Using Tailwind v4?** After `@import "tailwindcss";`, add
`@import "@portfolio/ds/tailwind-theme.css";` to expose the brand tokens as
Tailwind theme values (`bg-accent`, `text-brand-blue`, …).

## Tokens

- **Brand:** `--color-accent`, `--color-brand-blue`, `--color-footer-blue`,
  `--color-ink`, `--color-head-ink`, `--color-body-ink`
- **Surfaces:** `--color-hero-bg`, `--color-fun-bg`, `--color-fun-ink`
- **Per-project card palette:** `--color-card-<slug>-bg` / `-ink` for `adani`,
  `microsoft`, `jira`, `lcg`, `uniquefit`, `reporters`, `b2b`
- **Type families:** `--font-sans` (Poppins), `--font-serif` (Playfair Display)

## Utility classes

- **Type:** `t-serif-hero`, `t-sans-hero`, `t-serif-title`, `t-section-head`,
  `t-body-lg`, `t-body`, `t-body-fun`, `t-cta`, `t-fun-title`, and the
  `t-footer-*` family — all responsive at 1024px / 640px.
- **Spacing:** `pad-nav`, `pad-hero`, `pad-section`, `pad-cards`,
  `pad-footer-inner`.
- **Patterns:** `project-card` + `card-<slug>` variants, `thumb` variants,
  `fun-card`, `hero-card` / `hero-copy` / `hero-portrait`, the `resume-*` set,
  and the full `cs-*` case-study kit (`cs-theme-<slug>`, `cs-container*`,
  `cs-callout`, `cs-intro-band`, `cs-phase-band`, …).

## Components

Layout: `SiteNav`, `SiteFooter`.

Case study: `CaseStudyHero`, `CaseStudySection`, `CaseStudyCallout`,
`CaseStudyList`, `CaseStudyMeta`, `CaseStudyPhase`, `CaseStudyImage`,
`CaseStudyGallery`, `CaseStudyVideo`.

```tsx
import { SiteNav, CaseStudyHero, CaseStudyCallout } from "@portfolio/ds";
import "@portfolio/ds/styles.css";

export default function Page() {
  return (
    <div className="cs-theme-jira">
      <SiteNav active="home" />
      <CaseStudyHero
        eyebrow="Case study"
        title="Rebuilding the booking flow"
        subtitle="Cutting a 6-step form down to 2."
      />
      <CaseStudyCallout label="Problem">
        Users dropped off before ever reaching payment.
      </CaseStudyCallout>
    </div>
  );
}
```

Case-study components read accent colors from the nearest `cs-theme-<slug>`
ancestor, so wrap a page in one of those classes to theme it.

## Build

```bash
npm run build --workspace @portfolio/ds
```

Emits `dist/` — an ESM bundle, type declarations, and the `styles/` CSS.
