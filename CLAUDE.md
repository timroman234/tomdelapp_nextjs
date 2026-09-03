# Communication Resources site

Next.js marketing site for Communication Resources (Tom DeLapp's school-communications
consultancy), built around his podcast *Straight Talk by Tom DeLapp*. Full history and
rationale live in `docs/superpowers/specs/` and `docs/superpowers/plans/` — this file is
just the durable conventions, not a substitute for reading those when you need the "why."

## Stack

Next.js 16 (App Router, RSC by default), React 19, TypeScript strict, Tailwind CSS 4
(CSS-first `@theme` tokens, not a JS config). No automated test suite — verification is
`npm run build` + `npm run lint` (two separate gates on Next 16/Turbopack — build no
longer lints) plus manual browser review.

## Where things live

- `src/config/` — site-wide structural data with exactly one source of truth each:
  `nav.ts` (the nav tree), `platforms.ts` (podcast platforms), `footer-links.ts` (footer
  columns). Never duplicate a route or label that already exists in `nav.ts` — read it
  instead (see `SidebarRail` in `src/components/sidebar-rail.tsx` for the pattern: it
  computes sibling links from `nav.ts` + the current route rather than taking them as
  page-authored props).
- `src/content/` — page copy, one typed object (or a few) per file. Copy is **verbatim**
  from the source (originally the design handoff, now the live WordPress site at
  https://sf415.info/) except silently-fixed unambiguous typos — never paraphrased.
- `src/components/` — presentation. Shared interior-page pieces: `PageBanner`,
  `SidebarRail` (left layout), `ContactCard` (right-sidebar layout), `ChecklistCard`,
  `PageSections` (the flexible prose/list/checklist renderer used by every non-home
  page's body).
- `src/app/` — routes. Only `header.tsx`, `episode-player.tsx`, `newsletter-form.tsx`,
  and `sidebar-rail.tsx` are `"use client"` — everything else is a server component by
  default; keep it that way unless a new piece genuinely needs interactivity or
  `usePathname()`.

## Design system rules (don't improvise around these)

- **Border radius is 2px on buttons only.** Everything else is square. (Circular
  elements — the episode player's play button, decorative dots — are the sole
  exception, and are already accounted for.)
- **One responsive breakpoint**: `nav:` (900px, defined as `--breakpoint-nav` in
  `src/app/globals.css`). Never use Tailwind's default `sm:`/`md:`/`lg:`/`xl:` — grep
  for `nav:` usage before adding a new breakpoint-gated style.
- **Content container**: `.container-cr` (max-width 1180px, 32px horizontal padding),
  defined once in `globals.css`. Use it, don't redeclare max-width/padding inline.
- Watch **Tailwind class-shorthand collisions**: `border-red` and `border-line-3` both
  set all four border sides, so `border-t-[6px] border-b border-red border-line-3`
  silently drops one color depending on compiled stylesheet order. Use the longhand
  (`border-t-red`) when top and bottom need different colors on the same element — this
  bit us once already (see the phase-1 final review).

## Interior-page layout patterns

Two established patterns — pick the one that fits, don't invent a third without a real
need:

1. **Left-rail** (`/introduction` and most real-content pages): `SidebarRail` (sticky
   offset headshot + name + nav-computed sibling links) on the left,
   `nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]`, content on the right.
2. **Right-sidebar** (`/how-to-subscribe`): body content on the left at
   `nav:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)]` (same ratio, mirrored),
   `ContactCard` (phone/CTA card, no headshot) on the right. Use this for pages without
   a headshot/bio anchor.

Both sit between a `PageBanner` (gradient + waveform-tick strip + eyebrow + H1 +
subheading — identical on every interior page) and the standard `SubscribeBand` +
global footer.

## Content architecture

Real-content interior pages share one flexible shape (`InteriorPageContent` in
`src/content/types.ts`): `lede` + an ordered `sections` array where each section is
*some combination* of a heading, plain paragraphs, a lightweight inline checkmarked
list, and/or a boxed `ChecklistCard` — so page-specific ordering (e.g. "topics list,
then a keynote-speeches subsection with its own list") stays under each page's control
instead of being forced into a fixed template slot. Stub pages (pending real client
copy) use a much smaller `StubPageContent` shape — banner + one "coming soon" message.

Phone number is `(916) 765-1759` / `tel:+19167651759` everywhere — treat it as
canonical, it appears on multiple pages and in `ContactCard`'s defaults.

## Known state as of the last session

- Phase 1 (foundation + home + `/introduction`) and phase 2 (13 more interior pages)
  are both built. 6 of those 13 pages are **stubs** — the client hasn't provided real
  copy yet (Our Team, How to Subscribe, Podcast Library, Consulting Retainers,
  Publications, Substack Articles). Swap in real content via their files in
  `src/content/stub-pages.ts` and the matching `src/app/*/page.tsx` when it arrives —
  no structural changes needed, just replace the stub content import.
- Podcast platform is undecided (Buzzsprout is the front-runner) — `src/config/platforms.ts`
  is built to make turning one on/off a one-line `enabled` flag change.
- Newsletter form (`NewsletterForm`) is an intentional stub (`preventDefault` + label
  swap) — not wired to a real provider yet.
- No admin area yet — that's a future, separate sub-project.
- Deployed via Vercel (auto-deploys from `main` on GitHub push) at
  https://tomdelapp-nextjs.vercel.app/.
