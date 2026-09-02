# Next.js foundation + home page + introduction page

## Context

The Communication Resources site (Tom DeLapp's school-communications
consultancy, built around his podcast *Straight Talk by Tom DeLapp*)
currently exists as a temporary WordPress/Elementor build at
https://sf415.info/. It is being rebuilt in Next.js.

A high-fidelity design handoff already exists at
`Podcast Communication Resources Site/design_handoff/README.md`, with
two designed pages (home, `/introduction`) as bespoke `.dc.html`
prototypes plus three usable image assets. That README is the visual
and behavioral spec of record — colors, type scale, spacing, component
behavior, and known issues to fix. **This document does not repeat
that content.** It specifies the *engineering* architecture needed to
turn that handoff into a real Next.js codebase, scoped to a single
sub-project.

This project is large enough to need decomposition. This spec covers
**only**:

1. The Next.js project scaffold and tooling
2. The design-token/Tailwind setup, global chrome (utility bar, header
   w/ nav, footer, subscribe band), and shared components
   (offset-photo treatment, episode player stand-in, newsletter stub)
3. The home page (`/`)
4. The interior page template, built as `/introduction`

**Explicitly out of scope**, each a future spec:

- The remaining ~14 interior pages' content migration from
  `sf415.info`
- Podcast platform integration (Buzzsprout/RSS, real episode data)
- Real newsletter provider wiring (stays a `preventDefault` stub,
  matching the design)
- The admin area

## Decisions made in brainstorming

- **Hosting:** Vercel.
- **Content architecture:** page copy lives in typed `.ts` objects
  under `src/content/`, separate from JSX, so a future admin-driven
  data source can be swapped in without rewriting page layouts. Nav
  and podcast-platform lists live in `src/config/*.ts`, each consumed
  from exactly one place per the design README's instruction not to
  duplicate them.
- **Images:** use the existing placeholder assets from
  `design_handoff/design/uploads/` as-is (logo JPEG, AI-generated hero
  photo, headshot). Swapping in final assets is a later, independent
  task.
- **Repo:** existing empty GitHub repo
  `https://github.com/timroman234/TomDeLapp_Nextjs`, used as the
  origin remote for a repo rooted at `F:\TomDeLapp_Nextjs`.
- **Body copy source:** confirmed the verbatim WordPress copy for the
  home and introduction pages is already embedded as literal text in
  the `.dc.html` design files (verified by grep) — no live scrape of
  `sf415.info` needed for this sub-project.

## Stack & tooling

- **Next.js 16.3.4**, App Router, React Server Components by default.
  Only the header (dropdown/drawer state), episode player, and
  newsletter form are `"use client"`.
- **React 19.2.8**, **TypeScript** (strict mode).
- **Tailwind CSS 4.3**, using its CSS-first `@theme` configuration in
  `src/app/globals.css` rather than a `tailwind.config.ts`. This is
  the current idiomatic way to define design tokens in Tailwind v4 and
  achieves exactly what the README's token table specifies (colors,
  font families, the 2px button-only radius) without adopting a
  deprecated config style.
- **ESLint** (`eslint-config-next`) + **Prettier**.
- **npm** as package manager.
- No test framework for this sub-project — these are static marketing
  pages. Verification is `next build` (type-check + lint clean) plus
  manual browser review of both pages against the design screenshots
  and against opening the `.dc.html` files directly.

## Project structure

```
F:\TomDeLapp_Nextjs\                         (git repo root)
  Podcast Communication Resources Site\
    design_handoff\                          (untouched, kept as reference)
  docs\superpowers\specs\                    (this file and future specs)
  src\
    app\
      layout.tsx            (next/font setup, renders UtilityBar/Header/Footer)
      page.tsx               (home page)
      introduction\page.tsx  (interior page)
      globals.css            (Tailwind v4 @theme tokens)
    components\
      header.tsx             (client: dropdowns + mobile drawer)
      utility-bar.tsx
      footer.tsx
      subscribe-band.tsx
      newsletter-form.tsx     (client: stub, preventDefault + label swap)
      episode-player.tsx      (client: visual stand-in per README spec)
      offset-photo.tsx        (shared offset-red-block image treatment)
    config\
      nav.ts                  (single source: header nav + mobile menu)
      platforms.ts            (Platform[] — buzzsprout/spotify/apple on, patreon off)
    content\
      home.ts                 (typed content: hero, latest-episode copy, about-the-host)
      introduction.ts         (typed content: lede, checklist card, CTAs, sign-off)
    lib\
      waveform.ts             (deterministic bar-height calc, if extracted)
  public\
    images\                   (logo, hero photo, headshot copied from design_handoff)
```

## Component & page behavior

Built to the exact spec in `design_handoff/README.md` — this section
only calls out engineering decisions the README leaves implicit.

- **Nav** (`src/config/nav.ts`): a single typed array driving both the
  desktop dropdown header and the mobile drawer, matching the
  structure documented in the README (5 top-level items, submenu
  routes as internal Next.js paths even where the target page doesn't
  exist yet in this sub-project — e.g. `/principles-beliefs` is a
  valid `href` today even though that route isn't built until the
  content-migration sub-project).
- **Dropdown accessibility**: fixes the README's "known issue" —
  keyboard focus handling, `aria-expanded`, `aria-haspopup`,
  Escape-to-close, and click-to-toggle for touch, in addition to the
  hover behavior in the prototype.
- **Mobile**: a real hamburger/drawer below ~900px (not the
  wrap-to-second-row stopgap in the prototype). All grids called out
  in the README's "Known issues" (hero, latest-episode card, about
  section, interior two-column body, subscribe band, 4-column footer)
  collapse to single column below their breakpoints.
- **Platforms** (`src/config/platforms.ts`): typed exactly as the
  README's example, feeding the hero listen-row, home subscribe band,
  and interior subscribe band from one array.
- **Episode player**: client component visual stand-in per the
  README's exact spec (play/pause circle, 56-bar deterministic
  waveform, timecode), with a disclaimer that it's a placeholder for
  the eventual host embed. No real playback wiring in this
  sub-project.
- **Newsletter form**: client component stub (`preventDefault`, label
  swap to "Thanks") on the home page only, per the design.

## Assets & performance

- **Fonts**: Bitter (400/600/700, italic 400) and IBM Plex Sans
  (400/500/600) via `next/font/google`, `display: swap`. System
  monospace stack for timecodes/labels needs no font loading.
- **Images**: the three existing files
  (`assets-1788192221209-hg4y.jpeg`, the Gemini hero photo,
  `Tom-DeLapp.jpg`) copied into `public/images` and served through
  `next/image` with explicit dimensions; hero photo gets `priority`.
- No icon library, no illustration assets — every glyph/decorative
  element is text or CSS, per the README's performance requirements.

## Repo & deploy

- Git repo rooted at `F:\TomDeLapp_Nextjs`, remote `origin` set to
  `https://github.com/timroman234/TomDeLapp_Nextjs.git` (already done
  during brainstorming, before this spec was committed).
- Deploy target is Vercel; no Vercel-specific config is needed beyond
  a working `next build` (Next.js App Router deploys to Vercel
  zero-config).
- Pushing to the remote requires separate, explicit confirmation once
  there's a working build to push — not assumed by this spec.

## Testing / verification plan

1. `npm run build` succeeds (type-check + lint clean).
2. `npm run dev`, visually compare `/` and `/introduction` against the
   screenshots in `design_handoff/screenshots/` and against the
   `.dc.html` files opened directly in a browser, at both desktop
   (1180px+) and a mobile width (<900px, drawer nav).
3. Keyboard-only pass: Tab to each nav item, Enter/Space to open a
   dropdown, Escape to close, confirm `aria-expanded`/`aria-haspopup`
   are present.
4. Confirm no layout shift from font loading and that the hero image
   has `priority` with explicit dimensions.
