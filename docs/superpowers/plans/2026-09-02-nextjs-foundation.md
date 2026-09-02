# Next.js Foundation + Home Page + Introduction Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js codebase — tooling, design tokens, global chrome, and shared components — and build the two pages designed in the handoff (`/` and `/introduction`) to spec, so the site can be reviewed on localhost and later deployed to Vercel.

**Architecture:** Next.js 16 App Router with React Server Components by default; only the header (dropdown/drawer state), episode player, and newsletter form are client components. Tailwind CSS v4 CSS-first `@theme` tokens implement the design system. Page copy lives in typed `src/content/*.ts` objects, nav/podcast-platform/footer-link data lives in typed `src/config/*.ts` arrays — both consumed, never duplicated — so a future admin-driven data source can replace them without touching page layouts.

**Tech Stack:** Next.js 16.3.4, React 19.2.8, TypeScript (strict), Tailwind CSS 4.3, ESLint (`eslint-config-next`), npm. No test framework — verification is `npm run build` (type-check + lint) plus manual browser review against the design screenshots.

**Spec:** `docs/superpowers/specs/2026-09-02-nextjs-foundation-design.md` (and the design handoff it implements: `Podcast Communication Resources Site/design_handoff/README.md`, `design/Communication Resources Home.dc.html`, `design/Speakers Introduction.dc.html`)

## Global Constraints

- Next.js 16.3.4, React 19.2.8, Tailwind CSS 4.3+, TypeScript strict mode — do not downgrade.
- No icon library (Lucide/FontAwesome/Heroicons, etc.) — every glyph is a text character (`▼ ✓ ▶ ⏸`) or CSS shape.
- No illustration assets — the waveform strip, offset red block, hatch placeholder, and player waveform are all CSS.
- Exactly two font families: Bitter and IBM Plex Sans, self-hosted via `next/font/google`, `display: swap`. System monospace stack for timecodes/labels needs no font loading.
- Border radius is **2px on buttons only** — everything else is square (no `rounded` utilities elsewhere).
- Content container: `max-width: 1180px`, horizontal padding `32px`, centered — implemented once as a shared `.container-cr` utility class, reused everywhere.
- `nav.ts` and `platforms.ts` each have exactly one consumer path (imported, never re-declared) — the header, mobile drawer, hero listen-row, and both subscribe bands all read the same arrays.
- All body copy is verbatim from the design files (already verified to contain the real copy from `sf415.info`) — do not rewrite or paraphrase it.
- Nav dropdowns must be keyboard- and touch-accessible: `aria-expanded`, `aria-haspopup`, Escape-to-close, click-to-toggle — not hover-only.
- A real hamburger/drawer must appear below a single shared breakpoint of **900px** (used consistently for the nav and for every grid collapse called out in the spec) — not the wrap-to-second-row stopgap in the prototype.
- Hero photo gets `priority` on `next/image`; all images get explicit dimensions/aspect-ratio to avoid CLS.
- Every submenu `href` is an internal Next.js route (per the table below), never an `sf415.info` URL, except the one genuinely external link (Blogspot), which opens in a new tab.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: entire Next.js project tree (via `create-next-app`) at the repo root `F:\TomDeLapp_Nextjs`
- Modify: none

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` Next.js 16 App Router project with TypeScript, Tailwind v4, ESLint, `src/` directory, and `@/*` import alias, without disturbing the existing `Podcast Communication Resources Site/`, `docs/`, or `.git/` at the repo root.

- [ ] **Step 1: Scaffold into a throwaway subdirectory**

The repo root already contains `Podcast Communication Resources Site/`, `docs/`, and `.git/`, which `create-next-app` may refuse to scaffold into directly. Scaffold into a temp subfolder instead, so the repo root's existing contents are never at risk:

```bash
cd "F:/TomDeLapp_Nextjs"
npx create-next-app@16.3.4 tmp-scaffold \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --empty --disable-git --agents-md
```

`--empty` skips the demo starter page (we replace it entirely anyway). `--disable-git` is required — this repo already has its own git history and remote; do not let the scaffolder re-init git.

- [ ] **Step 2: Move the generated project up to the repo root**

```bash
cd "F:/TomDeLapp_Nextjs"
mv tmp-scaffold/* tmp-scaffold/.* . 2>/dev/null || true
rmdir tmp-scaffold
```

(`mv ... 2>/dev/null || true` tolerates the "no dotfiles matched" case on some shells — verify afterward with `ls -la` that `package.json`, `src/`, `next.config.ts`, `.gitignore`, etc. landed at the repo root and `Podcast Communication Resources Site/` and `docs/` are untouched.)

- [ ] **Step 3: Install dependencies and verify the dev server boots**

```bash
npm install
npm run build
```

Expected: `npm run build` completes with no type or lint errors (it will build the default `--empty` page).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Scaffold Next.js 16 app with TypeScript, Tailwind v4, and ESLint

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 2: Tailwind v4 design tokens

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: Tailwind utility classes generated from the `--color-*` tokens below (e.g. `bg-ink`, `text-red`, `border-line`), a `--breakpoint-nav: 900px` custom breakpoint generating the `nav:` variant, a reusable `.container-cr` class, and the `cr-bar` keyframe used by the episode player (Task 12).

- [ ] **Step 1: Replace `globals.css` with the design token theme**

```css
@import "tailwindcss";

@theme {
  --color-ink: #1F1A18;
  --color-ink-soft: #3A322E;
  --color-ink-muted: #4A403A;
  --color-body: #5C4F49;
  --color-muted: #6B5F58;
  --color-muted-2: #7A6A5E;
  --color-muted-3: #9A8B81;
  --color-muted-4: #B3A398;
  --color-red: #B01F24;
  --color-red-dark: #8E1418;
  --color-red-bright: #C8272D;
  --color-teal: #14675F;
  --color-cream: #FBF8F5;
  --color-cream-2: #FBF6EE;
  --color-line: #E7DED6;
  --color-line-2: #E0D5CB;
  --color-line-3: #D8C9B6;
  --color-line-4: #D6C8BA;
  --color-line-5: #F1EAE3;

  --font-heading: var(--font-bitter), Georgia, serif;
  --font-body: var(--font-plex-sans), Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, monospace;

  /*
    Single shared breakpoint used for the nav hamburger AND every grid
    collapse called out in the design spec (hero, latest-episode card,
    about section, interior two-column body, subscribe band, footer).
  */
  --breakpoint-nav: 900px;
}

@layer components {
  .container-cr {
    max-width: 1180px;
    margin-inline: auto;
    padding-inline: 32px;
  }
}

@keyframes cr-bar {
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
}
```

- [ ] **Step 2: Verify the build picks up the theme**

```bash
npm run build
```

Expected: succeeds. (There's no visible output to check yet — the default `--empty` page doesn't use these tokens. This is a type/lint/build-clean check only; the tokens are visually verified starting in Task 10.)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
Add Tailwind v4 design tokens from the design handoff

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 3: Fonts and root layout metadata

**Files:**
- Create: `src/app/fonts.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `--color-cream`, `font-body` from Task 2's theme
- Produces: `bitter` and `plexSans` exports from `src/app/fonts.ts` (each a `next/font/google` result with a `.variable` property), consumed by Task 10's layout wiring and any component needing `font-heading`/`font-body` utility classes.

- [ ] **Step 1: Create the font config**

```ts
// src/app/fonts.ts
import { Bitter, IBM_Plex_Sans } from "next/font/google";

export const bitter = Bitter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bitter",
  display: "swap",
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});
```

- [ ] **Step 2: Wire fonts and metadata into the root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { bitter, plexSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Communication Resources | Straight Talk by Tom DeLapp",
  description:
    "Communication counsel for school districts and the leaders who run them. Home of the Straight Talk podcast, hosted by Tom DeLapp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bitter.variable} ${plexSans.variable}`}>
      <body className="bg-cream font-body text-ink antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000` — the default empty page should render in IBM Plex Sans (open devtools, confirm `body` computed `font-family` includes the Plex Sans variable font). Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/fonts.ts src/app/layout.tsx
git commit -m "$(cat <<'EOF'
Wire up Bitter and IBM Plex Sans via next/font

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 4: Config layer — nav, podcast platforms, footer links

**Files:**
- Create: `src/config/nav.ts`
- Create: `src/config/platforms.ts`
- Create: `src/config/footer-links.ts`

**Interfaces:**
- Produces:
  - `nav: NavItem[]` where `NavItem = { label: string; href: string; children?: NavChild[] }` and `NavChild = { label: string; href: string; external?: boolean }` — consumed by Header (Tasks 8–9).
  - `platforms: Platform[]` and `enabledPlatforms: Platform[]` where `Platform = { key: string; name: string; note: string; url: string; enabled: boolean }` — consumed by the home hero listen-row (Task 13) and `SubscribeBand` (Task 11).
  - `footerColumns: FooterColumn[]`, `footerTagline: string`, `footerCopyright: string`, `footerSignOff: string` where `FooterColumn = { label: string; links: FooterLink[] }` and `FooterLink = { label: string; href: string; external?: boolean }` — consumed by `Footer` (Task 7).

**Note on route mapping:** the design's `.dc.html` files still point submenu links at live `sf415.info` URLs. The internal routes below come from the authoritative nav table in `design_handoff/README.md` (lines 147–167), not the prototype's hrefs.

**Note on footer content:** the two `.dc.html` files have slightly inconsistent footer link labels between the home and interior page prototypes (e.g. "Podcast library" vs "Podcast Library", and the home footer swaps in a "Speaker's Introduction" link where the interior footer has "Blogspot"). Since the footer is shared global chrome (one component, all pages), this plan uses a single canonical version — the fuller interior-page set, whose labels match the nav submenu labels exactly and which includes the external Blogspot link.

- [ ] **Step 1: Write `src/config/nav.ts`**

```ts
// src/config/nav.ts
export type NavChild = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "#",
    children: [
      { label: "Principles & Beliefs", href: "/principles-beliefs" },
      { label: "Experience & Expertise", href: "/experience-expertise" },
      { label: "Professional Resume", href: "/resume" },
      { label: "Speaker's Introduction", href: "/introduction" },
      { label: "Our Team", href: "/our-team" },
    ],
  },
  {
    label: "Straight Talk by Tom DeLapp",
    href: "#",
    children: [
      { label: "How to Subscribe", href: "/how-to-subscribe" },
      { label: "Podcast Library", href: "/podcast-library" },
    ],
  },
  {
    label: "Professional Services",
    href: "#",
    children: [
      { label: "Coaching and Team Building", href: "/coaching-and-team-building" },
      { label: "Contract Public Relations Advising", href: "/contract-public-relations-advising" },
      { label: "Consulting Retainers", href: "/consulting-retainers" },
      { label: "Crisis Communication Advising", href: "/crisis-communication-advising" },
      { label: "Training Programs & Workshops", href: "/training-program-and-workshops" },
    ],
  },
  {
    label: "Communication Resources",
    href: "#",
    children: [
      { label: "Publications", href: "/publications" },
      { label: "Substack Articles", href: "/substack-articles" },
      { label: "Blogspot", href: "https://tomdelapp.blogspot.com/", external: true },
    ],
  },
];
```

- [ ] **Step 2: Write `src/config/platforms.ts`**

```ts
// src/config/platforms.ts
export type Platform = {
  key: string;
  name: string;
  note: string;
  url: string;
  enabled: boolean;
};

export const platforms: Platform[] = [
  { key: "buzzsprout", name: "Buzzsprout", note: "Show home", url: "#", enabled: true },
  { key: "spotify", name: "Spotify", note: "Follow", url: "#", enabled: true },
  { key: "apple", name: "Apple Podcasts", note: "Subscribe", url: "#", enabled: true },
  { key: "patreon", name: "Patreon", note: "Members", url: "#", enabled: false },
];

export const enabledPlatforms: Platform[] = platforms.filter((p) => p.enabled);
```

- [ ] **Step 3: Write `src/config/footer-links.ts`**

```ts
// src/config/footer-links.ts
export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { label: string; links: FooterLink[] };

export const footerColumns: FooterColumn[] = [
  {
    label: "Podcast",
    links: [
      { label: "Podcast Library", href: "/podcast-library" },
      { label: "How to Subscribe", href: "/how-to-subscribe" },
    ],
  },
  {
    label: "Services",
    links: [
      { label: "Crisis Communication Advising", href: "/crisis-communication-advising" },
      { label: "Training Programs & Workshops", href: "/training-program-and-workshops" },
      { label: "Coaching and Team Building", href: "/coaching-and-team-building" },
      { label: "Consulting Retainers", href: "/consulting-retainers" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Publications", href: "/publications" },
      { label: "Substack Articles", href: "/substack-articles" },
      { label: "Blogspot", href: "https://tomdelapp.blogspot.com/", external: true },
    ],
  },
];

export const footerTagline =
  "Communication counsel for school districts and the leaders who run them.";
export const footerCopyright = "Copyright 2026 Communication Resources · All rights reserved";
export const footerSignOff = "— When communication counts —";
```

- [ ] **Step 4: Verify**

```bash
npm run build
```

Expected: passes (type-check confirms the exported types are well-formed; nothing imports these yet).

- [ ] **Step 5: Commit**

```bash
git add src/config
git commit -m "$(cat <<'EOF'
Add nav, podcast platform, and footer link config

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 5: Content layer — home and introduction copy

**Files:**
- Create: `src/content/home.ts`
- Create: `src/content/introduction.ts`

**Interfaces:**
- Produces: `homeContent` (typed, `as const`) consumed by the home page (Task 13); `introductionContent` (typed, `as const`) consumed by the introduction page (Task 14). Both are plain data — no functions, no JSX.

All copy below is transcribed verbatim from the `.dc.html` design files (already verified to be the real copy from `sf415.info`, not placeholder text — do not rewrite it).

- [ ] **Step 1: Write `src/content/home.ts`**

```ts
// src/content/home.ts
export const homeContent = {
  hero: {
    eyebrow: "A podcast for school leaders",
    heading: "When communication really counts",
    tagline: "Count on us.",
    body: "Straight Talk is a weekly conversation with Tom DeLapp on the communication decisions superintendents and district cabinets actually face — media, crisis, community trust, and the culture inside your own organization.",
    primaryCta: { label: "Subscribe free", href: "/#subscribe" },
    secondaryCta: { label: "Play the latest episode", href: "#latest" },
    listenLabel: "Listen on",
    onAirLabel: "ON AIR · WEEKLY",
    captionTitle: "Straight Talk",
    captionSubtitle: "Hosted by Tom DeLapp",
    imageSrc: "/images/hero-studio.jpg",
    imageAlt: "Tom DeLapp recording Straight Talk in the studio",
  },
  latestEpisode: {
    eyebrow: "Latest episode",
    allEpisodesHref: "/podcast-library",
    allEpisodesLabel: "All episodes →",
    meta: "Episode 01 · Placeholder date · 32 min",
    title: "Episode title goes here",
    summary:
      "One or two sentences of episode summary — the question this episode answers and why it matters to a cabinet. Replace with real copy once the first episodes are recorded.",
    playerDisclaimer:
      "player placeholder — swap for the host's embed once the platform is chosen",
    timecode: "00:00 / 32:10",
  },
  aboutHost: {
    eyebrow: "About the host",
    pullQuote: "A culture of communication, built one decision at a time.",
    paragraphs: [
      "The principal objectives of the firm are to cultivate a communicating culture in schools, enhance the communications capacity of school leaders, build stronger community ties to education, and develop sustainable public relations/communications programs for school districts. When effective communication really counts, you can count on us!",
      "Educators tend to view the news media as either a bothersome intrusion or an outright obstacle in their work. Most people in your community make up their minds about public schools by what they read in newspapers, scroll on Internet newsfeeds, or hear on TV or radio. Since only about 20% of the adults in your community are parents of school-aged children, they often make decisions about education based on stereotypes or misinformation perpetuated in the press or by critics on social media.",
    ],
    checklistLabel: "What the show helps your leaders do",
    checklist: [
      "Understand today's polarized news media environment",
      "Decide what makes news and how to be proactive",
      "Diagnose the interview process",
      "Shape quotes that are memorable and newsworthy",
      "Handle media relations in a crisis or emergency",
      "Create a media relations strategy and plan",
    ],
    readMoreHref: "/introduction",
    readMoreLabel: "Read the full speaker's introduction →",
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Host, Straight Talk",
  },
  subscribeBand: {
    heading: "Don't miss the weekly episode",
    body: "Follow on your app of choice, or get each new episode in your inbox with a short note on what's in it.",
    showEmailForm: true,
  },
} as const;
```

- [ ] **Step 2: Write `src/content/introduction.ts`**

```ts
// src/content/introduction.ts
export const introductionContent = {
  banner: {
    eyebrow: "About us",
    heading: "Speaker's Introduction",
    subheading: "Proven Techniques to Level the News Playing Field",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
    siblingLabel: "More about us",
    siblingLinks: [
      { label: "Principles & Beliefs", href: "/principles-beliefs" },
      { label: "Experience & Expertise", href: "/experience-expertise" },
      { label: "Professional Resume", href: "/resume" },
      { label: "Our Team", href: "/our-team" },
    ],
  },
  lede: "Educators tend to view the news media as either a bothersome intrusion or an outright obstacle in their work. Most people in your community make up their minds about public schools by what they read in newspapers, scroll on Internet newsfeeds, or hear on TV or radio.",
  secondParagraph:
    "Since only about 20% of the adults in your community are parents of school-aged children, they often make decisions about education based on stereotypes or misinformation perpetuated in the press or by critics on social media.",
  checklistCard: {
    heading: "Tom DeLapp can help your leaders —",
    items: [
      "Understand today's polarized news media environment",
      "Profile the average education reporter and know how stories go together",
      "Decide what makes news and how to be proactive and reactive with success",
      "Diagnose the interview process",
      "Understand how podcasts and social media have changed reporting",
      "Watch out for \u201Cquestion quicksand\u201D",
      "Shape quotes that are memorable and newsworthy",
      "Handle media access/interview requests, and know your rights & theirs",
      "Employ strategies for handling common situations in schools that attract the media",
      "Handle media relations in a crisis or emergency",
      "Create a media relations strategy and plan",
    ],
  },
  closingParagraph:
    "Tom can arrange hands-on sessions that involve spokesperson training for on-camera interviews where staff can respond to actual scenarios based on real situations in public schools.",
  ctas: {
    primary: { label: "Request a training session", href: "/training-program-and-workshops" },
    secondary: { label: "Listen to the podcast", href: "/podcast-library" },
  },
  signOff: "– When Communication Counts –",
  subscribeBand: {
    heading: "Don't miss our weekly podcast",
    body: "Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face.",
    showEmailForm: false,
  },
} as const;
```

- [ ] **Step 3: Verify**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/content
git commit -m "$(cat <<'EOF'
Add typed content data for home and introduction pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 6: Copy image assets into the app

**Files:**
- Create: `public/images/logo.jpeg` (copied from `design_handoff/design/uploads/assets-1788192221209-hg4y.jpeg`)
- Create: `public/images/hero-studio.jpg` (copied from `design_handoff/design/uploads/Gemini_Generated_Image_aljmykaljmykaljm.jpg`)
- Create: `public/images/tom-delapp.jpg` (copied from `design_handoff/design/uploads/Tom-DeLapp.jpg`)

**Interfaces:**
- Produces: the three image files at the paths already referenced by `src/content/home.ts` and `src/content/introduction.ts` (`headshotSrc`, `imageSrc`) and by `Header`/`Footer` (`/images/logo.jpeg`, hardcoded in those components in Tasks 7–9).

- [ ] **Step 1: Copy the files**

```bash
mkdir -p "F:/TomDeLapp_Nextjs/public/images"
cp "F:/TomDeLapp_Nextjs/Podcast Communication Resources Site/design_handoff/design/uploads/assets-1788192221209-hg4y.jpeg" "F:/TomDeLapp_Nextjs/public/images/logo.jpeg"
cp "F:/TomDeLapp_Nextjs/Podcast Communication Resources Site/design_handoff/design/uploads/Gemini_Generated_Image_aljmykaljmykaljm.jpg" "F:/TomDeLapp_Nextjs/public/images/hero-studio.jpg"
cp "F:/TomDeLapp_Nextjs/Podcast Communication Resources Site/design_handoff/design/uploads/Tom-DeLapp.jpg" "F:/TomDeLapp_Nextjs/public/images/tom-delapp.jpg"
```

- [ ] **Step 2: Verify**

```bash
ls -la "F:/TomDeLapp_Nextjs/public/images"
```

Expected: all three files present with non-zero size.

- [ ] **Step 3: Commit**

```bash
git add public/images
git commit -m "$(cat <<'EOF'
Copy placeholder image assets from the design handoff

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 7: UtilityBar and Footer components

**Files:**
- Create: `src/components/utility-bar.tsx`
- Create: `src/components/footer.tsx`

**Interfaces:**
- Consumes: `footerColumns`, `footerTagline`, `footerCopyright`, `footerSignOff` from `@/config/footer-links` (Task 4); `/images/logo.jpeg` from `public/images` (Task 6)
- Produces: `UtilityBar()` and `Footer()`, both server components with no props — consumed by the root layout in Task 10.

- [ ] **Step 1: Write `src/components/utility-bar.tsx`**

```tsx
// src/components/utility-bar.tsx
import Link from "next/link";

export function UtilityBar() {
  return (
    <div className="bg-ink text-[#F0E9E4] text-[13px] tracking-[0.04em]">
      <div className="container-cr flex items-center justify-between gap-6 py-[10px]">
        <span className="opacity-[0.85]">
          Straight Talk by Tom DeLapp · new episode every week
        </span>
        <Link
          href="/#subscribe"
          className="-my-[3px] flex-none whitespace-nowrap rounded-[2px] bg-red px-4 py-[7px] text-[13px] font-semibold tracking-[0.02em] text-white no-underline hover:bg-red-bright"
        >
          Subscribe
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/footer.tsx`**

```tsx
// src/components/footer.tsx
import Image from "next/image";
import Link from "next/link";
import {
  footerColumns,
  footerTagline,
  footerCopyright,
  footerSignOff,
} from "@/config/footer-links";

export function Footer() {
  return (
    <footer className="bg-ink text-[rgba(251,248,245,0.72)]">
      <div className="container-cr grid grid-cols-1 gap-10 py-14 pb-[30px] nav:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <span className="mb-[14px] inline-flex items-center justify-center bg-cream p-2">
            <Image
              src="/images/logo.jpeg"
              alt="Communication Resources"
              width={40}
              height={40}
              className="block h-10 w-10 object-contain mix-blend-multiply"
            />
          </span>
          <div className="font-heading text-base font-semibold leading-[1.3] text-cream">
            Communication Resources
          </div>
          <p className="mt-[10px] max-w-[34ch] text-sm leading-[1.6]">{footerTagline}</p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.label}>
            <div className="mb-[14px] text-xs uppercase tracking-[0.14em] text-[rgba(251,248,245,0.45)]">
              {column.label}
            </div>
            <div className="grid gap-[9px] text-sm">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-[rgba(251,248,245,0.82)] no-underline hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="container-cr flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[rgba(251,248,245,0.12)] py-5 pb-10 text-[13px]">
        <span>{footerCopyright}</span>
        <span className="font-heading italic text-[rgba(251,248,245,0.6)]">{footerSignOff}</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run build
```

Expected: passes. (Visual verification happens in Task 10 once these are wired into the root layout.)

- [ ] **Step 4: Commit**

```bash
git add src/components/utility-bar.tsx src/components/footer.tsx
git commit -m "$(cat <<'EOF'
Add UtilityBar and Footer components

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 8: Header component — desktop dropdown nav

**Files:**
- Create: `src/components/header.tsx`

**Interfaces:**
- Consumes: `nav: NavItem[]` from `@/config/nav` (Task 4); `/images/logo.jpeg` from `public/images` (Task 6)
- Produces: `Header()`, a `"use client"` component with no props, exporting a default nav-open state machine (`openMenu: string | null`) — extended by Task 9 to add the mobile drawer, consumed by the root layout in Task 10.

- [ ] **Step 1: Write `src/components/header.tsx`**

```tsx
// src/components/header.tsx
"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, type NavItem } from "@/config/nav";

function isItemCurrent(item: NavItem, pathname: string) {
  return item.href === pathname || (item.children?.some((c) => c.href === pathname) ?? false);
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const closeMenu = useCallback(() => setOpenMenu(null), []);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream">
      <div className="container-cr flex flex-wrap items-center gap-6 py-[14px]">
        <Link href="/" className="flex flex-none items-center gap-3 text-ink no-underline">
          <Image
            src="/images/logo.jpeg"
            alt="Communication Resources"
            width={40}
            height={40}
            className="block h-10 w-10 object-contain mix-blend-multiply"
          />
          <span className="font-heading text-[15px] font-semibold leading-[1.15] tracking-[-0.01em]">
            Communication
            <br />
            Resources
          </span>
        </Link>

        <nav className="ml-auto hidden min-w-0 flex-wrap items-center gap-x-[18px] gap-y-[10px] text-[13.5px] font-medium nav:flex">
          {nav.map((item, i) => {
            const isCurrent = isItemCurrent(item, pathname);

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`no-underline hover:text-red ${isCurrent ? "text-red" : "text-ink"}`}
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = openMenu === item.label;
            const isLastTwo = i >= nav.length - 2;

            return (
              <div
                key={item.label}
                className="relative -my-[14px] py-[14px]"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={closeMenu}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  onKeyDown={(e) => e.key === "Escape" && closeMenu()}
                  className={`flex items-center gap-[6px] border-0 bg-transparent p-0 font-body text-[13.5px] font-medium cursor-pointer hover:text-red ${
                    isCurrent ? "text-red" : "text-ink"
                  }`}
                >
                  {item.label}
                  <span className="flex-none text-[9px] text-muted-3">▼</span>
                </button>

                <div
                  role="menu"
                  className={`absolute top-full w-[268px] flex-col border border-line border-t-[3px] border-t-red bg-white py-2 shadow-[0_14px_34px_rgba(31,26,24,0.14)] ${
                    isLastTwo ? "right-[-18px] left-auto" : "left-[-18px] right-auto"
                  } ${isOpen ? "flex" : "hidden"}`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      target={child.external ? "_blank" : undefined}
                      rel={child.external ? "noopener noreferrer" : undefined}
                      role="menuitem"
                      onKeyDown={(e) => e.key === "Escape" && closeMenu()}
                      className="block px-5 py-[9px] text-sm leading-[1.35] text-ink-soft no-underline hover:bg-cream-2 hover:text-red"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
```

Notes on what this fixes relative to the prototype (per the spec's "known issues"): the panel opens on hover **and** on click (touch-friendly), has `aria-haspopup`/`aria-expanded`, and closes on Escape. Panel width is unified at `268px` site-wide (the prototype used `244px` on the home page and `268px` on the interior page — the wider value is used everywhere since it's sized for the longest label, "Contract Public Relations Advising").

- [ ] **Step 2: Verify**

```bash
npm run build
```

Expected: passes. (Visual/keyboard verification happens in Task 10.)

- [ ] **Step 3: Commit**

```bash
git add src/components/header.tsx
git commit -m "$(cat <<'EOF'
Add Header with accessible desktop dropdown nav

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 9: Header component — mobile hamburger drawer

**Files:**
- Modify: `src/components/header.tsx`

**Interfaces:**
- Consumes: same as Task 8, plus a new local `drawerOpen: boolean` state
- Produces: `Header()` now renders a hamburger button and slide-down drawer below the `nav:` (900px) breakpoint, using native `<details>`/`<summary>` for the per-section accordion (no extra per-item state needed).

- [ ] **Step 1: Add the hamburger button and drawer**

Modify `src/components/header.tsx`: add `drawerOpen` state, add the hamburger button after the desktop `<nav>` (visible only below 900px via `nav:hidden`), and add the drawer panel as a sibling of the header's inner container. Full updated file:

```tsx
// src/components/header.tsx
"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, type NavItem } from "@/config/nav";

function isItemCurrent(item: NavItem, pathname: string) {
  return item.href === pathname || (item.children?.some((c) => c.href === pathname) ?? false);
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = useCallback(() => setOpenMenu(null), []);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream">
      <div className="container-cr flex flex-wrap items-center gap-6 py-[14px]">
        <Link href="/" className="flex flex-none items-center gap-3 text-ink no-underline">
          <Image
            src="/images/logo.jpeg"
            alt="Communication Resources"
            width={40}
            height={40}
            className="block h-10 w-10 object-contain mix-blend-multiply"
          />
          <span className="font-heading text-[15px] font-semibold leading-[1.15] tracking-[-0.01em]">
            Communication
            <br />
            Resources
          </span>
        </Link>

        <nav className="ml-auto hidden min-w-0 flex-wrap items-center gap-x-[18px] gap-y-[10px] text-[13.5px] font-medium nav:flex">
          {nav.map((item, i) => {
            const isCurrent = isItemCurrent(item, pathname);

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`no-underline hover:text-red ${isCurrent ? "text-red" : "text-ink"}`}
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = openMenu === item.label;
            const isLastTwo = i >= nav.length - 2;

            return (
              <div
                key={item.label}
                className="relative -my-[14px] py-[14px]"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={closeMenu}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  onKeyDown={(e) => e.key === "Escape" && closeMenu()}
                  className={`flex items-center gap-[6px] border-0 bg-transparent p-0 font-body text-[13.5px] font-medium cursor-pointer hover:text-red ${
                    isCurrent ? "text-red" : "text-ink"
                  }`}
                >
                  {item.label}
                  <span className="flex-none text-[9px] text-muted-3">▼</span>
                </button>

                <div
                  role="menu"
                  className={`absolute top-full w-[268px] flex-col border border-line border-t-[3px] border-t-red bg-white py-2 shadow-[0_14px_34px_rgba(31,26,24,0.14)] ${
                    isLastTwo ? "right-[-18px] left-auto" : "left-[-18px] right-auto"
                  } ${isOpen ? "flex" : "hidden"}`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      target={child.external ? "_blank" : undefined}
                      rel={child.external ? "noopener noreferrer" : undefined}
                      role="menuitem"
                      onKeyDown={(e) => e.key === "Escape" && closeMenu()}
                      className="block px-5 py-[9px] text-sm leading-[1.35] text-ink-soft no-underline hover:bg-cream-2 hover:text-red"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((v) => !v)}
          className="ml-auto flex h-10 w-10 flex-none flex-col items-center justify-center gap-[5px] border-0 bg-transparent nav:hidden"
        >
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform ${drawerOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-opacity ${drawerOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform ${drawerOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {drawerOpen && (
        <div className="border-t border-line bg-cream nav:hidden">
          <nav className="container-cr flex flex-col gap-1 py-4">
            {nav.map((item) =>
              item.children ? (
                <details key={item.label} className="group">
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between py-3 text-[15px] font-medium ${
                      isItemCurrent(item, pathname) ? "text-red" : "text-ink"
                    }`}
                  >
                    {item.label}
                    <span className="text-[9px] text-muted-3 group-open:rotate-180">▼</span>
                  </summary>
                  <div className="flex flex-col gap-1 pb-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noopener noreferrer" : undefined}
                        onClick={() => setDrawerOpen(false)}
                        className="py-2 text-sm text-ink-soft no-underline hover:text-red"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`block py-3 text-[15px] font-medium no-underline hover:text-red ${
                    isItemCurrent(item, pathname) ? "text-red" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/header.tsx
git commit -m "$(cat <<'EOF'
Add mobile hamburger drawer to Header below 900px

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 10: Wire global chrome into the root layout

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `UtilityBar` (Task 7), `Header` (Tasks 8–9), `Footer` (Task 7)
- Produces: every route now renders the full site chrome around `{children}` — this is the first point where Tasks 2–9 become visible together in a browser.

- [ ] **Step 1: Update the root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { bitter, plexSans } from "./fonts";
import { UtilityBar } from "@/components/utility-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Communication Resources | Straight Talk by Tom DeLapp",
  description:
    "Communication counsel for school districts and the leaders who run them. Home of the Straight Talk podcast, hosted by Tom DeLapp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bitter.variable} ${plexSans.variable}`}>
      <body className="bg-cream font-body text-ink antialiased">
        <UtilityBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000` at a desktop width (≥900px):
- Utility bar shows the announcement + red Subscribe button.
- Header shows the two-line logo lockup, five nav items right-aligned, no hamburger icon.
- Hover each of the four dropdown items — panel opens with a 3px red top border, closes on mouseleave.
- Click a dropdown item's top-level button, then press Escape — panel closes.
- Footer shows the 4-column grid, logo chip, and bottom copyright bar.

Resize below 900px (or use devtools device mode):
- Desktop nav disappears, hamburger icon appears.
- Click hamburger — drawer opens with all 5 items; items with children expand as an accordion on click.
- Footer collapses to a single column.

Stop the dev server when done.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "$(cat <<'EOF'
Wire UtilityBar, Header, and Footer into the root layout

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 11: SubscribeBand and NewsletterForm

**Files:**
- Create: `src/components/newsletter-form.tsx`
- Create: `src/components/subscribe-band.tsx`

**Interfaces:**
- Consumes: `enabledPlatforms` from `@/config/platforms` (Task 4)
- Produces: `SubscribeBand({ heading, body, headingSize?: "lg" | "md", showEmailForm?: boolean })` — a server component; `headingSize` defaults to `"lg"` (40px, home page), pass `"md"` for the interior page's 36px heading. `showEmailForm` defaults to `false`. Consumed by the home page (Task 13, `headingSize="lg"`, `showEmailForm=true`) and the introduction page (Task 14, `headingSize="md"`, `showEmailForm=false`).
- `NewsletterForm()` — a `"use client"` stub form with local `submitted` state, consumed only by `SubscribeBand` when `showEmailForm` is true.

- [ ] **Step 1: Write `src/components/newsletter-form.tsx`**

```tsx
// src/components/newsletter-form.tsx
"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mt-[6px] flex gap-[10px]"
    >
      <input
        type="email"
        required
        placeholder="you@district.org"
        className="min-w-0 flex-1 border border-[rgba(251,248,245,0.3)] bg-[rgba(31,22,20,0.28)] px-4 py-[15px] font-body text-[15px] text-cream placeholder:text-[rgba(251,248,245,0.5)]"
      />
      <button
        type="submit"
        className="bg-cream px-6 py-[15px] font-body text-[15px] font-semibold text-red-dark hover:bg-white"
      >
        {submitted ? "Thanks" : "Notify me"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Write `src/components/subscribe-band.tsx`**

```tsx
// src/components/subscribe-band.tsx
import Link from "next/link";
import { enabledPlatforms } from "@/config/platforms";
import { NewsletterForm } from "./newsletter-form";

type SubscribeBandProps = {
  heading: string;
  body: string;
  headingSize?: "lg" | "md";
  showEmailForm?: boolean;
};

export function SubscribeBand({
  heading,
  body,
  headingSize = "lg",
  showEmailForm = false,
}: SubscribeBandProps) {
  return (
    <section id="subscribe" className="bg-red-dark text-cream">
      <div className="container-cr grid grid-cols-1 items-center gap-16 py-[62px] nav:grid-cols-2 nav:gap-[64px] nav:py-[76px]">
        <div>
          <h2
            className={`mb-4 font-heading font-bold leading-[1.1] tracking-[-0.02em] ${
              headingSize === "lg" ? "text-[40px]" : "text-[36px]"
            }`}
          >
            {heading}
          </h2>
          <p className="max-w-[44ch] text-base leading-[1.6] text-[rgba(251,248,245,0.8)]">
            {body}
          </p>
        </div>
        <div className="grid gap-3">
          {enabledPlatforms.map((platform) => (
            <Link
              key={platform.key}
              href={platform.url}
              className="flex items-center justify-between gap-4 border border-[rgba(251,248,245,0.22)] bg-[rgba(251,248,245,0.07)] px-5 py-4 text-cream no-underline hover:border-cream hover:bg-[rgba(251,248,245,0.14)]"
            >
              <span className="font-heading text-[17px] font-semibold">{platform.name}</span>
              <span className="text-[13px] text-[rgba(251,248,245,0.72)]">{platform.note}</span>
            </Link>
          ))}
          {showEmailForm && <NewsletterForm />}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run build
```

Expected: passes. (Visual verification happens in Tasks 13–14.)

- [ ] **Step 4: Commit**

```bash
git add src/components/newsletter-form.tsx src/components/subscribe-band.tsx
git commit -m "$(cat <<'EOF'
Add SubscribeBand and NewsletterForm components

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 12: EpisodePlayer

**Files:**
- Create: `src/components/episode-player.tsx`

**Interfaces:**
- Consumes: `cr-bar` keyframe from `globals.css` (Task 2)
- Produces: `EpisodePlayer({ timecode: string })` — a `"use client"` component, consumed by the home page (Task 13).

- [ ] **Step 1: Write `src/components/episode-player.tsx`**

```tsx
// src/components/episode-player.tsx
"use client";

import { useState } from "react";

const BAR_COUNT = 56;
const PLAYED_COUNT = 14;

function barHeight(i: number) {
  return 20 + Math.round(70 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)));
}

export function EpisodePlayer({ timecode }: { timecode: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex items-center gap-[18px] border border-line bg-cream px-[18px] py-[14px]">
      <button
        type="button"
        aria-label={playing ? "Pause episode" : "Play episode"}
        onClick={() => setPlaying((p) => !p)}
        className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-0 bg-red text-[15px] text-white hover:bg-red-dark"
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="flex h-[34px] min-w-0 flex-1 items-end gap-[3px] overflow-hidden">
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <span
            key={i}
            className="block min-w-[2px] flex-1 origin-bottom rounded-[1px]"
            style={{
              height: `${barHeight(i)}%`,
              background: i < PLAYED_COUNT ? "#B01F24" : "#DCD1C8",
              animation: playing ? `cr-bar 1.1s ease-in-out ${(i % 9) * 0.09}s infinite` : "none",
            }}
          />
        ))}
      </div>
      <span className="flex-none font-mono text-xs text-muted">{timecode}</span>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npm run build
```

Expected: passes. (Visual/interaction verification happens in Task 13.)

- [ ] **Step 3: Commit**

```bash
git add src/components/episode-player.tsx
git commit -m "$(cat <<'EOF'
Add EpisodePlayer visual stand-in component

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 13: Home page

**Files:**
- Create: `src/components/offset-photo.tsx`
- Modify: `src/app/page.tsx` (replace the `--empty` scaffold output)

**Interfaces:**
- Consumes: `homeContent` (Task 5), `enabledPlatforms` (Task 4), `EpisodePlayer` (Task 12), `SubscribeBand` (Task 11)
- Produces: `OffsetPhoto({ src, alt, aspectRatio, offset, objectPosition?, priority?, sizes, children? })` — a shared server component for the "signature" offset-red-block photo treatment, reused by the introduction page (Task 14). `page.tsx` default-exports `HomePage()`, rendered at `/`.

- [ ] **Step 1: Write `src/components/offset-photo.tsx`**

```tsx
// src/components/offset-photo.tsx
import Image from "next/image";
import type { ReactNode } from "react";

type OffsetPhotoProps = {
  src: string;
  alt: string;
  aspectRatio: string;
  offset: number;
  objectPosition?: string;
  priority?: boolean;
  sizes: string;
  children?: ReactNode;
};

export function OffsetPhoto({
  src,
  alt,
  aspectRatio,
  offset,
  objectPosition = "50% 50%",
  priority,
  sizes,
  children,
}: OffsetPhotoProps) {
  return (
    <div className="relative w-full" style={{ aspectRatio }}>
      <span
        aria-hidden
        className="absolute inset-0 block bg-red"
        style={{ transform: `translate(${offset}px, ${offset}px)` }}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="relative object-cover"
        style={{ objectPosition }}
      />
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/app/page.tsx`**

```tsx
// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { OffsetPhoto } from "@/components/offset-photo";
import { EpisodePlayer } from "@/components/episode-player";
import { SubscribeBand } from "@/components/subscribe-band";
import { enabledPlatforms } from "@/config/platforms";
import { homeContent } from "@/content/home";

export default function HomePage() {
  const { hero, latestEpisode, aboutHost, subscribeBand } = homeContent;

  return (
    <>
      <section className="relative overflow-hidden border-t-[6px] border-b border-red border-line-3 bg-[linear-gradient(172deg,#C9B69A_0%,#DBCAB2_30%,#EFE5D6_68%,#FBF6EE_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_84%_6%,rgba(255,250,242,0.55)_0%,rgba(255,250,242,0)_65%)]" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46px] [mask-image:linear-gradient(to_top,#000_0%,transparent_100%)]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(31,26,24,0.18) 0 2px, rgba(31,26,24,0) 2px 11px)",
          }}
        />
        <div className="container-cr relative grid grid-cols-1 items-center gap-[60px] py-[54px] pb-[50px] nav:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <div>
            <div className="mb-[18px] flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-red-dark">
              <span className="block h-px w-[26px] bg-red" />
              {hero.eyebrow}
            </div>
            <h1 className="mb-[14px] font-heading text-[54px] font-bold leading-[1.05] tracking-[-0.025em]">
              {hero.heading}
            </h1>
            <p className="mb-[18px] font-heading text-[25px] leading-[1.2] text-red">
              {hero.tagline}
            </p>
            <p className="mb-[26px] max-w-[46ch] text-base leading-[1.55] text-ink-muted text-pretty">
              {hero.body}
            </p>
            <div className="flex flex-wrap items-center gap-[14px]">
              <Link
                href={hero.primaryCta.href}
                className="rounded-[2px] bg-red px-7 py-[15px] text-[15px] font-semibold text-white no-underline hover:bg-red-dark"
              >
                {hero.primaryCta.label}
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="rounded-[2px] border border-[rgba(31,26,24,0.28)] px-6 py-[15px] text-[15px] font-medium text-ink no-underline hover:border-ink hover:bg-[rgba(255,252,247,0.55)]"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-[26px] gap-y-3 border-t border-[rgba(31,26,24,0.16)] pt-5">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6A5E]">
                {hero.listenLabel}
              </span>
              {enabledPlatforms.map((platform) => (
                <Link
                  key={platform.key}
                  href={platform.url}
                  className="flex items-center gap-2 text-sm font-medium text-ink-soft no-underline hover:text-red"
                >
                  <span className="block h-[6px] w-[6px] rounded-full bg-red" />
                  {platform.name}
                </Link>
              ))}
            </div>
          </div>

          <OffsetPhoto
            src={hero.imageSrc}
            alt={hero.imageAlt}
            aspectRatio="1 / 1"
            offset={16}
            priority
            sizes="(min-width: 900px) 44vw, 90vw"
          >
            <span className="absolute bottom-[84px] left-[-26px] origin-bottom-left whitespace-nowrap font-mono text-[10px] tracking-[0.22em] text-teal [transform:rotate(-90deg)]">
              {hero.onAirLabel}
            </span>
            <div className="absolute bottom-[-18px] left-[-18px] max-w-[210px] bg-ink px-[18px] py-[14px] text-cream">
              <div className="font-heading text-[15px] font-semibold leading-[1.25]">
                {hero.captionTitle}
              </div>
              <div className="mt-[3px] text-xs text-[rgba(251,248,245,0.7)]">
                {hero.captionSubtitle}
              </div>
            </div>
          </OffsetPhoto>
        </div>
      </section>

      <section id="latest" className="border-b border-line bg-cream">
        <div className="container-cr py-[72px]">
          <div className="mb-7 flex items-baseline justify-between gap-6">
            <h2 className="font-heading text-[13px] font-semibold uppercase tracking-[0.16em] text-red-dark">
              {latestEpisode.eyebrow}
            </h2>
            <Link href={latestEpisode.allEpisodesHref} className="text-sm font-medium no-underline">
              {latestEpisode.allEpisodesLabel}
            </Link>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 border border-line bg-white p-9 nav:grid-cols-[132px_minmax(0,1fr)]">
            <div className="flex aspect-square items-center justify-center border border-line-2 p-[10px] text-center [background:repeating-linear-gradient(135deg,#F1E9E2_0_10px,#E8DED5_10px_20px)]">
              <span className="font-mono text-[9px] leading-[1.6] tracking-[0.08em] text-muted-3">
                EPISODE
                <br />
                ART
              </span>
            </div>
            <div>
              <div className="mb-[10px] text-xs uppercase tracking-[0.08em] text-muted-3">
                {latestEpisode.meta}
              </div>
              <h3 className="mb-3 max-w-[30ch] font-heading text-[30px] leading-[1.15] tracking-[-0.015em]">
                {latestEpisode.title}
              </h3>
              <p className="mb-[26px] max-w-[62ch] text-base leading-[1.6] text-body text-pretty">
                {latestEpisode.summary}
              </p>
              <EpisodePlayer timecode={latestEpisode.timecode} />
              <div className="mt-[10px] font-mono text-[11px] text-muted-3">
                {latestEpisode.playerDisclaimer}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-16 py-[78px] nav:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <div className="relative aspect-[4/5] w-full border border-line-2">
              <Image
                src={aboutHost.headshotSrc}
                alt={aboutHost.headshotAlt}
                fill
                sizes="(min-width: 900px) 22vw, 90vw"
                className="object-cover"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>
            <div className="mt-[22px] border-l-2 border-red pl-4">
              <div className="font-heading text-[17px] font-semibold">{aboutHost.name}</div>
              <div className="mt-[3px] text-sm text-muted">{aboutHost.role}</div>
            </div>
          </div>

          <div>
            <h2 className="mb-5 font-heading text-[13px] font-semibold uppercase tracking-[0.16em] text-red-dark">
              {aboutHost.eyebrow}
            </h2>
            <p className="mb-6 max-w-[34ch] font-heading text-[26px] leading-[1.35] tracking-[-0.01em] text-pretty">
              {aboutHost.pullQuote}
            </p>
            {aboutHost.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph}
                className={`max-w-[62ch] text-base leading-[1.65] text-body text-pretty ${
                  i === aboutHost.paragraphs.length - 1 ? "mb-[30px]" : "mb-[18px]"
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="border-t border-line pt-[26px]">
              <div className="mb-4 text-xs uppercase tracking-[0.14em] text-muted-3">
                {aboutHost.checklistLabel}
              </div>
              <div className="grid grid-cols-1 gap-x-7 gap-y-3 nav:grid-cols-2">
                {aboutHost.checklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-[10px] text-[15px] leading-[1.5] text-ink-soft"
                  >
                    <span className="flex-none font-semibold text-teal">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={aboutHost.readMoreHref}
              className="mt-[30px] inline-block text-[15px] font-semibold no-underline"
            >
              {aboutHost.readMoreLabel}
            </Link>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading={subscribeBand.heading}
        body={subscribeBand.body}
        headingSize="lg"
        showEmailForm={subscribeBand.showEmailForm}
      />
    </>
  );
}
```

- [ ] **Step 3: Verify in the browser**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000` and compare against `design_handoff/screenshots/home-01-hero.png` through `home-06-subscribe-band-footer.png`, and against `design_handoff/design/Communication Resources Home.dc.html` opened directly in a browser:
- Hero: red offset block behind the photo, rotated "ON AIR · WEEKLY" label, dark caption card, waveform-tick strip along the hero's bottom edge.
- Click the play button in the latest-episode card — waveform bars animate, glyph toggles ▶/⏸.
- About-the-host: two-column checklist, teal checkmarks.
- Scroll to the subscribe band — platform cards, email form; submit the form (any email) — button label swaps to "Thanks".
- Resize below 900px — hero, episode card, about section all collapse to one column.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/offset-photo.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
Build the home page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 14: Introduction page

**Files:**
- Create: `src/app/introduction/page.tsx`

**Interfaces:**
- Consumes: `introductionContent` (Task 5), `OffsetPhoto` (Task 13), `SubscribeBand` (Task 11)
- Produces: `IntroductionPage()`, default-exported, rendered at `/introduction`. This is the template every future interior page (out of scope here) will follow.

- [ ] **Step 1: Write `src/app/introduction/page.tsx`**

```tsx
// src/app/introduction/page.tsx
import Link from "next/link";
import { OffsetPhoto } from "@/components/offset-photo";
import { SubscribeBand } from "@/components/subscribe-band";
import { introductionContent } from "@/content/introduction";

export default function IntroductionPage() {
  const {
    banner,
    rail,
    lede,
    secondParagraph,
    checklistCard,
    closingParagraph,
    ctas,
    signOff,
    subscribeBand,
  } = introductionContent;

  return (
    <>
      <section className="relative overflow-hidden border-t-[6px] border-b border-red border-line-3 bg-[linear-gradient(172deg,#C9B69A_0%,#DBCAB2_30%,#EFE5D6_68%,#FBF6EE_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_84%_6%,rgba(255,250,242,0.55)_0%,rgba(255,250,242,0)_65%)]" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46px] [mask-image:linear-gradient(to_top,#000_0%,transparent_100%)]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(31,26,24,0.18) 0 2px, rgba(31,26,24,0) 2px 11px)",
          }}
        />
        <div className="container-cr relative py-10 pb-[46px]">
          <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-red-dark">
            <span className="block h-px w-[26px] bg-red" />
            {banner.eyebrow}
          </div>
          <h1 className="mb-3 max-w-[22ch] font-heading text-[52px] font-bold leading-[1.05] tracking-[-0.025em]">
            {banner.heading}
          </h1>
          <p className="whitespace-nowrap font-heading text-[23px] leading-[1.25] text-red max-[700px]:whitespace-normal">
            {banner.subheading}
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="nav:sticky nav:top-[92px]">
            <OffsetPhoto
              src={rail.headshotSrc}
              alt={rail.headshotAlt}
              aspectRatio="4 / 5"
              offset={14}
              objectPosition="50% 35%"
              sizes="(min-width: 900px) 26vw, 90vw"
            />
            <div className="mt-[26px] border-l-2 border-red pl-4">
              <div className="font-heading text-[18px] font-semibold">{rail.name}</div>
              <div className="mt-[3px] text-sm text-muted">{rail.role}</div>
            </div>
            <div className="mt-[26px] grid gap-[9px] border-t border-line pt-[22px] text-sm">
              <div className="mb-[3px] text-xs uppercase tracking-[0.14em] text-muted-3">
                {rail.siblingLabel}
              </div>
              {rail.siblingLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-ink-soft no-underline hover:text-red"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>
            <p className="mb-11 max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
              {secondParagraph}
            </p>

            <div className="border border-t-4 border-line border-t-teal bg-white p-9 pb-[30px]">
              <h2 className="mb-6 font-heading text-[26px] leading-[1.2] tracking-[-0.015em]">
                {checklistCard.heading}
              </h2>
              <div className="grid gap-[13px]">
                {checklistCard.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 border-b border-line-5 pb-[13px] text-base leading-[1.5] text-ink-soft"
                  >
                    <span className="flex-none font-semibold text-teal">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
              {closingParagraph}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-[14px] border-t border-line pt-7">
              <Link
                href={ctas.primary.href}
                className="rounded-[2px] bg-red px-[26px] py-[15px] text-[15px] font-semibold text-white no-underline hover:bg-red-dark"
              >
                {ctas.primary.label}
              </Link>
              <Link
                href={ctas.secondary.href}
                className="rounded-[2px] border border-line-4 px-6 py-[15px] text-[15px] font-medium text-ink no-underline hover:border-ink hover:bg-white"
              >
                {ctas.secondary.label}
              </Link>
            </div>

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">
              {signOff}
            </p>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading={subscribeBand.heading}
        body={subscribeBand.body}
        headingSize="md"
        showEmailForm={subscribeBand.showEmailForm}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify in the browser**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000/introduction` and compare against `design_handoff/screenshots/intro-01-banner.png` through `intro-05-subscribe-band-footer.png`, and against `design_handoff/design/Speakers Introduction.dc.html`:
- Banner is visibly shorter than the home hero, no image, same waveform-tick strip.
- Header's "About us" nav item renders in red (current-section highlighting) — confirms `isItemCurrent` works via `usePathname`.
- Left rail: offset red block behind the headshot (14px offset, slightly less than the hero's 16px), sticky on scroll at desktop widths.
- Checklist card has a 4px teal top border and 11 items, each divided by a hairline.
- Sign-off line uses en-dashes: "– When Communication Counts –".
- Subscribe band has no email form (only platform cards) and a 36px heading (visibly smaller than the home page's 40px).
- Resize below 700px — subheading wraps instead of staying on one line. Resize below 900px — two-column body collapses to one column and the rail stops being sticky.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/introduction
git commit -m "$(cat <<'EOF'
Build the introduction page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 15: Final verification pass

**Files:**
- Modify: none (verification only, plus incidental fixes if verification turns up issues)

**Interfaces:**
- Consumes: everything built in Tasks 1–14

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: no type errors, no lint errors.

- [ ] **Step 2: Cross-page keyboard pass**

```bash
npm run dev
```

On both `/` and `/introduction`, at a desktop width:
- Tab through the header — each nav item receives visible focus.
- On an item with children, press Enter/Space — dropdown opens (`aria-expanded="true"`); press Escape — it closes.
- Tab into the mobile drawer's `<summary>` elements (resize below 900px first) — Enter/Space toggles the accordion.

- [ ] **Step 3: Confirm no layout shift / correct image priority**

In devtools, confirm:
- The hero photo on `/` has `fetchpriority="high"` (from `next/image`'s `priority` prop).
- No cumulative layout shift warnings in the Performance panel on either page's initial load.

- [ ] **Step 4: Fix any issues found, then final commit**

If Steps 1–3 turn up issues, fix them in the relevant component/page file and commit the fix separately with a message describing what was wrong. If everything passes cleanly, no additional commit is needed here.

- [ ] **Step 5: Report status to the user**

Summarize what's runnable (`npm run dev` → `/` and `/introduction`) and remind them that pushing to `origin` and creating the Vercel project are separate steps they can do once they're happy with the local review — this plan does not push automatically.

---

## Explicitly out of scope (future plans)

- The remaining ~14 interior pages' content migration from `sf415.info`.
- Podcast platform integration (Buzzsprout/RSS, real episode data replacing the placeholder episode card).
- Real newsletter provider wiring (stays the `preventDefault` stub built in Task 11).
- The admin area.
- Pushing to GitHub / creating the Vercel project (user-driven, once they've reviewed on localhost).
