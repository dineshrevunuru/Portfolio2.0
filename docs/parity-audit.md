# Parity Audit — dineshrevunuru.com → Portfolio 2.0 (v3)

Source of truth: `docs/live-source.html` + `docs/live-spec.json` + live DOM computed styles via Chrome-MCP on 2026-04-24.
Plan: `~/.claude/plans/let-s-plan-things-to-linked-finch.md` (approved).

## Scope completed this pass

- ✅ All inline `style={{}}` removed from `app/page.tsx` (0 occurrences).
- ✅ Full token system in `app/globals.css` (`@theme inline` + CSS custom properties + `@layer components`).
- ✅ Typography utilities (`.t-serif-hero`, `.t-sans-hero`, `.t-serif-title`, `.t-body-lg`, `.t-body`, `.t-body-fun`, `.t-cta`, `.t-section-head`, `.t-fun-title`, `.t-footer-*`).
- ✅ Section padding utilities (`.pad-nav`, `.pad-hero`, `.pad-section`, `.pad-cards`, `.pad-footer-inner`) with tablet + mobile overrides.
- ✅ Project-card variants per slug (`.card-adani`, `.card-microsoft`, etc.) driven by CSS custom properties.
- ✅ Thumbnail variant system (`.thumb-wide`, `.thumb-tall`, `.thumb-composite`) — all contained in card padding, no bleeding out.
- ✅ Per-card aspect-ratio utilities (`.thumb-ar-adani` etc.) — no inline `aspectRatio` style.
- ✅ Responsive rules for nav, hero, project cards, fun-projects (hidden on tablet/mobile matching live), footer.
- ✅ `next build` succeeds clean — zero TS / ESLint / build warnings.

## Token map (authoritative)

All colors from live site computed styles. Defined in `:root` and re-exported via `@theme inline`.

| Token | Hex | Use |
|---|---|---|
| `--color-accent` | `#E45684` | hero "UX UI designer" |
| `--color-brand-blue` | `#2E71F1` | "View my resume" link |
| `--color-footer-blue` | `#1C7CF5` | footer bg, nav "Home" active |
| `--color-ink` | `#202020` | hero copy |
| `--color-head-ink` | `#101010` | section headings |
| `--color-body-ink` | `#000000` | description body |
| `--color-hero-bg` | `#FCF9F8` | hero card |
| `--color-fun-bg` | `#E0EEFD` | fun project cards |
| `--color-fun-ink` | `#303030` | fun card text |
| `--color-card-adani-bg/ink` | `#E4DAF2` / `#50228C` | Adani |
| `--color-card-microsoft-bg/ink` | `#F4D6DC` / `#932535` | Microsoft |
| `--color-card-jira-bg/ink` | `#E0EEFD` / `#0A619A` | Jira |
| `--color-card-lcg-bg/ink` | `#F1EFED` / `#85603B` | LCG |
| `--color-card-uniquefit-bg/ink` | `#DEF4F0` / `#1C601C` | Uniquefit |
| `--color-card-reporters-bg/ink` | `#FBEAE4` / `#C40D12` | 101 Reporters |
| `--color-card-b2b-bg/ink` | `#E8EDFD` / `#2A34C6` | B2B Dock |

## Responsive behavior

| Section | Mobile <640 | Tablet 640–1024 | Desktop ≥1024 |
|---|---|---|---|
| Nav | 16px side pad | 40px side pad | 100px side pad |
| Hero | photo top, text bottom, fluid | photo top, text bottom | side-by-side, card 440h |
| Projects heading | 16px pad, 20px type | 40px pad | 130px pad, 24px type |
| Project cards | 1-col, 16px pad | 1-col, 40px pad | 2-col, 40px gap |
| Fun projects | hidden (matches live) | hidden (matches live) | 3-col |
| Footer | 24px pad, 60px y-pad | 60px pad, 80px y-pad | 155px pad, 120px y-pad |

## Acceptance checklist

Verify manually by comparing `http://localhost:3000` vs `https://dineshrevunuru.com` at each viewport.

| Section | Desktop 1440 | Tablet 1024 | Mobile 390 |
|---|:-:|:-:|:-:|
| Nav (logo + Home/Resume) | ⬜ | ⬜ | ⬜ |
| Hero — typography + colors | ⬜ | ⬜ | ⬜ |
| Hero — photo position | ⬜ | ⬜ | ⬜ |
| Projects heading | ⬜ | ⬜ | ⬜ |
| Card row 1 (Adani + MS) | ⬜ | ⬜ | ⬜ |
| Card row 2 (Jira + LCG) | ⬜ | ⬜ | ⬜ |
| Card row 3 (Uniquefit + 101R) | ⬜ | ⬜ | ⬜ |
| Card row 4 (B2B) | ⬜ | ⬜ | ⬜ |
| Thumbnails contained in card | ⬜ | ⬜ | ⬜ |
| Fun projects heading | ⬜ | hidden ✅ | hidden ✅ |
| Fun project cards | ⬜ | hidden ✅ | hidden ✅ |
| Footer | ⬜ | ⬜ | ⬜ |

Fill `⬜` with ✅ after visual inspection. If anything is ❌, note it here and iterate.

## Commands to verify

```bash
# 0 inline styles in page.tsx
grep -c 'style={{' app/page.tsx   # should print 0

# Clean build
npm run build

# Dev server for manual inspection
npm run dev
# then open http://localhost:3000 at widths 1440, 1024, 390
```

## Remaining known gaps (documented, not blocking landing-page parity)

- `/resume` sub-page not built
- Case-study sub-pages (`/uniquefit-case-study`, `/101-reporters-case-study`, `/b2b-dock-case-study`) not ported
- Animations beyond existing hover lift — intentionally deferred per plan scope
