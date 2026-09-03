# Interior pages: shared components + first 13 pages

## Context

Phase 1 (`docs/superpowers/specs/2026-09-02-nextjs-foundation-design.md`) built the
Next.js foundation, home page, and `/introduction` — the latter explicitly
built as "the template every future interior page will follow." This phase
builds the remaining 13 pages named in `src/config/nav.ts`'s submenus
(everything except `/` and `/introduction`, which already exist, and
Blogspot, which is an external link).

The live WordPress site (https://sf415.info/) was fetched and its text
content extracted page-by-page (via `curl` with a browser user-agent —
Cloudflare blocks Node's default fetch fingerprint — piped through a small
HTML-to-text script; both scripts are throwaway, in the session scratchpad,
not part of this repo). That extraction found the 13 pages split into two
groups:

- **7 pages have real, usable content**: Principles & Beliefs, Experience &
  Expertise, Professional Resume (all under "About us"); Coaching and Team
  Building, Contract Public Relations Advising, Crisis Communication
  Advising, Training Programs & Workshops (all under "Professional
  Services").
- **6 pages are still unbuilt WordPress theme placeholder content** (Lorem
  ipsum, generic "Megaphone theme" demo copy): Our Team, How to Subscribe,
  Podcast Library (under "Straight Talk"/"About us"), Consulting Retainers
  (Professional Services), Publications, Substack Articles (Communication
  Resources). The client hasn't provided real copy for these yet.

Decisions made in brainstorming with the user:

- Build the 7 real pages now. Stub the other 6 with a simple "coming soon"
  message in the site's design language, so every nav link resolves to a
  real, on-brand page instead of a 404 — content gets swapped in later.
- Content is verbatim from the live site, **except** silently-fixed
  unambiguous typos (e.g. a transposed year in an award date). The wording
  itself is not rewritten or paraphrased, consistent with phase 1's policy.
- Extract the introduction page's markup into shared components first —
  the final review of phase 1 flagged `/introduction` as copy-paste-ready
  markup rather than a real template, which would have multiplied every
  bug in it (including the border-collision bug that review caught) across
  13 more pages. Refactoring first means the 13 new pages, and the
  refactored `/introduction`, share one implementation.
- Add a second interior-page layout: a **right-sidebar** variant (a
  `ContactCard` — headline, phone number, call/text CTA — instead of the
  left `SidebarRail`), demonstrated on one stub page (How to Subscribe) as
  the template for future pages that don't have a headshot/bio anchor.
- The sticky rail's sibling-link list must generalize: phase 1 hardcoded it
  to the About-us section for `/introduction`. With real pages now spanning
  About-us and Professional Services (and stub pages spanning all four nav
  sections), it needs to look up the current page's section from `nav.ts`
  and list that section's other entries, for any page.

## Content shape

Two content shapes for the 7 real pages, modeled as one flexible type so
one page template renders either:

```ts
type InteriorPageContent = {
  banner: { eyebrow: string; heading: string; subheading: string };
  rail: { headshotSrc: string; headshotAlt: string; name: string; role: string };
  lede: string;
  sections: Array<{ heading?: string; paragraphs?: string[]; list?: string[] }>;
  checklistCard?: { heading: string; items: string[] };
  closingParagraph?: string;
  ctas: { primary: { label: string; href: string }; secondary: { label: string; href: string } };
  signOff: string;
  subscribeBand: { heading: string; body: string; showEmailForm: boolean };
};
```

- **Bio-style** pages (Principles & Beliefs, Experience & Expertise,
  Professional Resume) use `sections` (plain paragraphs, sometimes with a
  subheading) and skip `checklistCard`.
- **Service-style** pages (Coaching and Team Building, Contract PR
  Advising, Crisis Communication Advising, Training Programs & Workshops)
  use `checklistCard` for their bullet lists, plus `sections`/
  `closingParagraph` for surrounding prose. Training Programs has two
  lists — the second (three keynote-speech titles) is modeled as a
  `sections` entry with `list` rather than a second `checklistCard`, since
  it's a lighter-weight inline list, not the boxed/teal-bordered treatment.

The sibling-link list is **not** page-authored data — it's computed from
`nav.ts` at render time (current pathname → which top-level item contains
it → that item's other children), so it can't drift from the nav a second
time the way phase 1's footer/rail duplication did.

Stub pages use a much smaller shape — banner + a fixed "coming soon"
message + the standard subscribe band — no lede/sections/checklist/CTAs/
sign-off.

## Shared components (new)

All under `src/components/`, extracted from `/introduction`'s existing
markup (phase 1, Task 14) with no visual/behavioral change to that page:

- **`PageBanner`** — the gradient + radial highlight + masked waveform-tick
  strip + `border-t-red` rule + eyebrow row + H1 + subheading. Takes
  `eyebrow`, `heading`, `subheading`.
- **`SidebarRail`** — the left-column offset headshot (via the existing
  `OffsetPhoto`), name/role block, and sibling-links list (now computed
  from `nav.ts` + the current pathname via `usePathname()`, not passed in
  as page data — this makes `SidebarRail` a client component, matching
  `Header`, which already does the same pathname-based lookup).
- **`ChecklistCard`** — the white card with the `border-t-teal` rule,
  heading, and check-marked item list.
- **`ContactCard`** — new, for the right-sidebar layout: headline, phone
  number, and a `tel:` CTA link. Static content (no page-level data needed
  beyond an optional headline override) since there's one phone number.
- A small `ctaLinkClass(variant)` helper (or two literal class strings) for
  the primary/secondary button pair, since every page repeats the same two
  Tailwind class strings today.

`/introduction`'s `page.tsx` is refactored to consume `PageBanner`,
`SidebarRail`, and `ChecklistCard` (Task 1 of the plan) — this is a
pure refactor, verified against the existing (already-shipped, already
final-reviewed) page for zero visual/behavioral change before any new
page is built on top of it.

## Two layout patterns

1. **Left-rail** (existing, from `/introduction`): `SidebarRail` on the
   left (sticky, offset headshot), body content on the right. Used by all
   7 real pages and 5 of the 6 stub pages.
2. **Right-sidebar** (new): body content on the left, `ContactCard` on the
   right (not sticky — it's a short card, not a tall offset photo). Used
   by the How to Subscribe stub page as the template example for future
   pages without a headshot/bio anchor.

Both share `PageBanner` at the top and the subscribe band + footer at the
bottom (footer/subscribe band are already global chrome from phase 1,
unchanged here).

## Stub page content

All 6 stub pages get the same structure: `PageBanner` (page-specific
eyebrow/heading/subheading, matching what the live WordPress nav already
promises for that page) + a centered message + `SidebarRail` (5 of 6) or
`ContactCard` (How to Subscribe) + the standard subscribe band. Message
copy: "Content for this page is coming soon. In the meantime, reach out
directly — call or text (916) 765-1759 — or check back soon."

## File structure

```
src/
  components/
    page-banner.tsx        (new)
    sidebar-rail.tsx        (new — client, reads usePathname)
    checklist-card.tsx      (new)
    contact-card.tsx        (new)
  content/
    principles-beliefs.ts, experience-expertise.ts, resume.ts,
    coaching-and-team-building.ts, contract-public-relations-advising.ts,
    crisis-communication-advising.ts, training-program-and-workshops.ts
                             (7 new, InteriorPageContent shape)
    stub-pages.ts            (new — one file, one entry per stub page:
                              banner fields + which layout variant)
  app/
    introduction/page.tsx    (refactored to use the new shared components)
    principles-beliefs/page.tsx, experience-expertise/page.tsx,
    resume/page.tsx, coaching-and-team-building/page.tsx,
    contract-public-relations-advising/page.tsx,
    crisis-communication-advising/page.tsx,
    training-program-and-workshops/page.tsx
                             (7 new page routes, real content)
    our-team/page.tsx, how-to-subscribe/page.tsx, podcast-library/page.tsx,
    consulting-retainers/page.tsx, publications/page.tsx,
    substack-articles/page.tsx
                             (6 new page routes, stub content)
```

## Testing / verification plan

Same as phase 1: no automated test suite (project-wide decision, unchanged)
— verification is `npm run build` (type-check + lint) plus manual browser
review. The introduction-page refactor (Task 1) specifically needs a
before/after visual diff since it must not change what's already shipped
and final-reviewed; every other task is new page content, verified against
this spec's content shape and the extracted WordPress text.
