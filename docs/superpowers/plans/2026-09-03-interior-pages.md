# Interior Pages Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the introduction page's markup into reusable components, add a right-sidebar layout variant, and build the 13 remaining pages named in `src/config/nav.ts` — 7 with real content migrated from the live WordPress site, 6 stubbed pending client copy.

**Architecture:** Four new shared server/client components (`PageBanner`, `SidebarRail`, `ChecklistCard`, `PageSections`) plus one new component (`ContactCard`) extend the pattern phase 1 established. `/introduction` is refactored to consume the first three with zero visual change (verified against its existing, already-shipped output). All 7 real-content pages share one flexible content shape (`InteriorPageContent`) so one rendering pattern serves both bio-style and service-style pages. Stub pages share a much smaller shape. The sidebar's sibling-link list is computed from `nav.ts` + the current route at render time, not authored per page.

**Tech Stack:** Same as phase 1 — Next.js 16.3.4, React 19.2.8, TypeScript strict, Tailwind CSS 4.3. No test framework; verification is `npm run build` plus manual review.

**Spec:** `docs/superpowers/specs/2026-09-03-interior-pages-design.md`

## Global Constraints

- Content is verbatim from the live WordPress site (https://sf415.info/) except silently-fixed unambiguous typos (e.g. a transposed year) — the wording itself is not rewritten or paraphrased.
- Border radius is 2px on buttons only — everything else square (matches phase 1's rule).
- Content container `.container-cr`, single shared `nav:` (900px) breakpoint — no `md:`/`lg:` anywhere.
- The sticky rail's sibling-link list must be computed from `nav.ts` + the current pathname, never authored per page — this is what phase 1 got wrong (hardcoded to About-us) and what this phase fixes.
- `/introduction`'s refactor (Task 1) must produce **zero visual or behavioral change** — it is already shipped and already passed a final whole-branch review. Task 1's review is a regression check first, a spec-compliance check second.
- No automated test suite — verification is `npm run build` (type-check + lint) plus manual browser review, same as phase 1.
- Phone number is `(916) 765-1759` everywhere it appears (`tel:+19167651759` for `href`s) — verbatim from the two pages that already had it on the live site.

---

### Task 1: Extract shared components from `/introduction` (zero-change refactor)

**Files:**
- Create: `src/components/page-banner.tsx`
- Create: `src/components/sidebar-rail.tsx`
- Create: `src/components/checklist-card.tsx`
- Modify: `src/app/introduction/page.tsx`
- Modify: `src/content/introduction.ts`

**Interfaces:**
- Produces: `PageBanner({ eyebrow, heading, subheading })` — server component. `SidebarRail({ headshotSrc, headshotAlt, name, role })` — client component (reads `usePathname()` + `nav` from `@/config/nav` to compute sibling links itself; no longer takes `siblingLabel`/`siblingLinks` as props). `ChecklistCard({ heading, items }: { heading: string; items: readonly string[] })` — server component. All three consumed by every task from here on.
- Consumes: `OffsetPhoto` (phase 1, `@/components/offset-photo`), `nav`/`NavItem`/`NavChild` (phase 1, `@/config/nav`).

This is a **regression-sensitive** task: `/introduction` is already shipped and already passed a final whole-branch review. The extracted components must render byte-identical markup to what's there now — this task moves code, it does not change it (except removing `rail.siblingLabel`/`rail.siblingLinks` from the content file, since `SidebarRail` now computes that itself).

- [ ] **Step 1: Create `src/components/page-banner.tsx`**

Extracted verbatim from `src/app/introduction/page.tsx`'s current banner section (the `<section>` through its closing tag, lines 29–50).

```tsx
// src/components/page-banner.tsx
type PageBannerProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
};

export function PageBanner({ eyebrow, heading, subheading }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden border-t-[6px] border-t-red border-b border-line-3 bg-[linear-gradient(172deg,#C9B69A_0%,#DBCAB2_30%,#EFE5D6_68%,#FBF6EE_100%)]">
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
          {eyebrow}
        </div>
        <h1 className="mb-3 max-w-[22ch] font-heading text-[33px] nav:text-[52px] font-bold leading-[1.05] tracking-[-0.025em]">
          {heading}
        </h1>
        <p className="whitespace-nowrap font-heading text-[23px] leading-[1.25] text-red max-[700px]:whitespace-normal">
          {subheading}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/sidebar-rail.tsx`**

The offset-headshot/name/role block is extracted verbatim from `introduction/page.tsx` lines 54–66. The sibling-links block (lines 67–80) is **generalized**: instead of taking `siblingLabel`/`siblingLinks` as props, it computes them from the current pathname and `nav.ts`. This makes it a client component (it needs `usePathname()`, same as `Header` already does).

```tsx
// src/components/sidebar-rail.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OffsetPhoto } from "@/components/offset-photo";
import { nav } from "@/config/nav";

const siblingLabels: Record<string, string> = {
  "About us": "More about us",
  "Straight Talk by Tom DeLapp": "More from the podcast",
  "Professional Services": "More services",
  "Communication Resources": "More resources",
};

type SidebarRailProps = {
  headshotSrc: string;
  headshotAlt: string;
  name: string;
  role: string;
};

export function SidebarRail({ headshotSrc, headshotAlt, name, role }: SidebarRailProps) {
  const pathname = usePathname();
  const section = nav.find((item) => item.children?.some((c) => c.href === pathname));
  const siblingLabel = section ? (siblingLabels[section.label] ?? `More ${section.label}`) : "";
  const siblingLinks = section?.children?.filter((c) => c.href !== pathname) ?? [];

  return (
    <div className="nav:sticky nav:top-[92px]">
      <OffsetPhoto
        src={headshotSrc}
        alt={headshotAlt}
        aspectRatio="4 / 5"
        offset={14}
        objectPosition="50% 35%"
        sizes="(min-width: 900px) 26vw, 90vw"
      />
      <div className="mt-[26px] border-l-2 border-red pl-4">
        <div className="font-heading text-[18px] font-semibold">{name}</div>
        <div className="mt-[3px] text-sm text-muted">{role}</div>
      </div>
      {siblingLinks.length > 0 && (
        <div className="mt-[26px] grid gap-[9px] border-t border-line pt-[22px] text-sm">
          <div className="mb-[3px] text-xs uppercase tracking-[0.14em] text-muted-3">
            {siblingLabel}
          </div>
          {siblingLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-ink-soft no-underline hover:text-red"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

Note: the `target`/`rel` handling on sibling links is a deliberate small addition beyond what `/introduction` currently has (its About-us siblings are all internal, so it never needed this) — it's needed because the Communication Resources section's siblings include the external Blogspot link, which future pages under that section will render through this same component. This mirrors the identical pattern already used in `Header` and `Footer`.

- [ ] **Step 3: Create `src/components/checklist-card.tsx`**

Extracted verbatim from `introduction/page.tsx` lines 91–106.

```tsx
// src/components/checklist-card.tsx
type ChecklistCardProps = {
  heading: string;
  items: readonly string[];
};

export function ChecklistCard({ heading, items }: ChecklistCardProps) {
  return (
    <div className="border border-t-4 border-line border-t-teal bg-white p-9 pb-[30px]">
      <h2 className="mb-6 font-heading text-[26px] leading-[1.2] tracking-[-0.015em]">
        {heading}
      </h2>
      <div className="grid gap-[13px]">
        {items.map((item) => (
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
  );
}
```

- [ ] **Step 4: Remove `siblingLabel`/`siblingLinks` from `src/content/introduction.ts`**

The `rail` object currently has:
```ts
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
```
Change it to just:
```ts
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
```
(`SidebarRail` computes the sibling list itself now — this data would otherwise drift out of sync with `nav.ts`, which is exactly the duplication phase 1's final review flagged.)

- [ ] **Step 5: Rewrite `src/app/introduction/page.tsx` to use the three new components**

Full replacement:

```tsx
// src/app/introduction/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { ChecklistCard } from "@/components/checklist-card";
import { SubscribeBand } from "@/components/subscribe-band";
import { introductionContent } from "@/content/introduction";

export const metadata: Metadata = {
  title: "Speaker's Introduction | Communication Resources",
  description:
    "Proven techniques to level the news playing field — how Tom DeLapp helps school leaders navigate media relations, from crisis communication to interview prep.",
};

export default function IntroductionPage() {
  const { banner, rail, lede, secondParagraph, checklistCard, closingParagraph, ctas, signOff, subscribeBand } =
    introductionContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>
            <p className="mb-11 max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
              {secondParagraph}
            </p>

            <ChecklistCard heading={checklistCard.heading} items={checklistCard.items} />

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

- [ ] **Step 6: Verify zero visual regression**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000/introduction` and compare against the version currently live at https://tomdelapp-nextjs.vercel.app/introduction (or a `git stash` of the pre-refactor build if easier): banner, sticky rail with offset headshot, sibling links (still just the About-us list — behavior must be identical even though the data source changed), checklist card, CTAs, sign-off, subscribe band. Nothing should look or behave differently. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/components/page-banner.tsx src/components/sidebar-rail.tsx src/components/checklist-card.tsx src/app/introduction/page.tsx src/content/introduction.ts
git commit -m "$(cat <<'EOF'
Extract PageBanner, SidebarRail, and ChecklistCard from the introduction page

Zero-change refactor: /introduction renders identically. SidebarRail's
sibling-link list is now computed from nav.ts + the current route
instead of being authored per page, fixing the duplication phase 1's
final review flagged.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 2: New shared components — `ContactCard`, `PageSections`, and the content type

**Files:**
- Create: `src/content/types.ts`
- Create: `src/components/contact-card.tsx`
- Create: `src/components/page-sections.tsx`

**Interfaces:**
- Consumes: `ChecklistCard` (Task 1, `@/components/checklist-card`)
- Produces: `InteriorPageContent` and `PageSection` types (`@/content/types`), consumed by every real-page content file (Tasks 3–4) and every real-page route (Tasks 6–7). `ContactCard({ headline?, body? })` — server component with sensible defaults, consumed by the right-sidebar template page (Task 9). `PageSections({ sections: readonly PageSection[] })` — server component, consumed by every real-page route (Tasks 6–7).

- [ ] **Step 1: Create `src/content/types.ts`**

```ts
// src/content/types.ts
export type PageSection = {
  heading?: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  checklistCard?: { heading: string; items: readonly string[] };
};

export type InteriorPageContent = {
  banner: { eyebrow: string; heading: string; subheading: string };
  rail: { headshotSrc: string; headshotAlt: string; name: string; role: string };
  lede: string;
  sections: readonly PageSection[];
  closingParagraph?: string;
  ctas: { primary: { label: string; href: string }; secondary: { label: string; href: string } };
  signOff: string;
  subscribeBand: { heading: string; body: string; showEmailForm: boolean };
};
```

A `PageSection` is a flexible unit: plain prose (`heading`/`paragraphs`), a lightweight inline checkmarked list (`list`), or a boxed teal-topped `ChecklistCard` (`checklistCard`) — all optional so one type serves bio-style pages (paragraphs only) and service-style pages (a `checklistCard`, sometimes plus a plain list) without needing two different content shapes. Order in the `sections` array is render order, so each page controls exactly where its checklist falls relative to its prose.

- [ ] **Step 2: Create `src/components/contact-card.tsx`**

New component (not extracted from existing code) for the right-sidebar layout — same visual weight as `ChecklistCard` but with a `border-t-red` accent (an action/contact card) instead of `border-t-teal` (an informational card), and a call/text CTA instead of a checklist.

```tsx
// src/components/contact-card.tsx
const PHONE_DISPLAY = "(916) 765-1759";
const PHONE_HREF = "tel:+19167651759";

type ContactCardProps = {
  headline?: string;
  body?: string;
};

export function ContactCard({
  headline = "Questions? Get in touch.",
  body = "Call or text Tom DeLapp directly to talk through your district's needs.",
}: ContactCardProps) {
  return (
    <div className="border border-line border-t-4 border-t-red bg-white p-9 pb-[30px]">
      <h2 className="mb-3 font-heading text-[22px] leading-[1.2] tracking-[-0.015em]">
        {headline}
      </h2>
      <p className="mb-6 text-[15px] leading-[1.6] text-body">{body}</p>
      <a
        href={PHONE_HREF}
        className="inline-block rounded-[2px] bg-red px-6 py-[15px] text-[15px] font-semibold text-white no-underline hover:bg-red-dark"
      >
        Call or text {PHONE_DISPLAY}
      </a>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/page-sections.tsx`**

```tsx
// src/components/page-sections.tsx
import { ChecklistCard } from "@/components/checklist-card";
import type { PageSection } from "@/content/types";

type PageSectionsProps = {
  sections: readonly PageSection[];
};

export function PageSections({ sections }: PageSectionsProps) {
  return (
    <>
      {sections.map((section, i) => (
        <div key={i} className="mt-11">
          {section.heading && (
            <h2 className="mb-4 font-heading text-[22px] font-semibold tracking-[-0.01em]">
              {section.heading}
            </h2>
          )}
          {section.paragraphs?.map((paragraph, j) => (
            <p
              key={j}
              className="mb-[18px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty last:mb-0"
            >
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="mt-4 grid gap-[10px]">
              {section.list.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[16px] leading-[1.5] text-ink-soft">
                  <span className="flex-none font-semibold text-teal">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {section.checklistCard && (
            <div className={section.paragraphs?.length ? "mt-6" : undefined}>
              <ChecklistCard
                heading={section.checklistCard.heading}
                items={section.checklistCard.items}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npm run build
```

Expected: passes. (Nothing imports these yet except each other — `page-sections.tsx` imports `checklist-card.tsx` from Task 1 and `types.ts` from this task. Visual verification happens in Tasks 6–9.)

- [ ] **Step 5: Commit**

```bash
git add src/content/types.ts src/components/contact-card.tsx src/components/page-sections.tsx
git commit -m "$(cat <<'EOF'
Add ContactCard and PageSections components, and the interior-page content type

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 3: Content data — 3 bio-style pages (Principles & Beliefs, Experience & Expertise, Professional Resume)

**Files:**
- Create: `src/content/principles-beliefs.ts`
- Create: `src/content/experience-expertise.ts`
- Create: `src/content/resume.ts`

**Interfaces:**
- Consumes: `InteriorPageContent` (Task 2, `@/content/types`)
- Produces: `principlesBeliefsContent`, `experienceExpertiseContent`, `resumeContent`, each typed `InteriorPageContent`, consumed by the matching route in Task 6.

All three are bio-style: a `lede`, zero or more `sections` of plain paragraphs, no `checklistCard`. Content is verbatim from the live WordPress site with one silently-fixed typo (Experience & Expertise's award year, "2106" → "2016" — the surrounding sentence and every other award date on that page reads 2004/2006/2013/2017, so 2106 is unambiguously a typo).

- [ ] **Step 1: Write `src/content/principles-beliefs.ts`**

```ts
// src/content/principles-beliefs.ts
import type { InteriorPageContent } from "./types";

export const principlesBeliefsContent: InteriorPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Principles & Beliefs",
    subheading: "Our Vision",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "The principal objectives of the firm are to cultivate a communicating culture in schools, enhance the communications capacity of school leaders, build stronger community ties to education, and develop sustainable public relations/communications programs for school districts.",
  sections: [],
  closingParagraph: "When effective communication really counts, you can count on us!",
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
};
```

- [ ] **Step 2: Write `src/content/experience-expertise.ts`**

```ts
// src/content/experience-expertise.ts
import type { InteriorPageContent } from "./types";

export const experienceExpertiseContent: InteriorPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Experience & Expertise",
    subheading: "Professional Experience, Expertise, & Excellence",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "Executive Director for Membership/Communications, Association of California School Administrators.",
  sections: [
    {
      paragraphs: [
        "During his tenure with ACSA, Tom worked in all of California's 58 counties and met with every one of ACSA's 200+ local charters and regions. He traveled over 500,000 miles within California meeting with school district leaders, local association chapters, and educational organizations.",
        "Founding partner of Pacific Communications Group, a public affairs communication and publishing firm in Sacramento.",
        "His company served clients in the public and private sectors, including state agencies, trade and professional associations, lobbyists, businesses, and the California Legislature.",
        "Mr. DeLapp is a product of the public schools in Los Angeles, graduating from Westchester High School in 1969. He received his undergraduate degree in 1973 in American History from the University of California, Irvine, where he served as student body president and chairman of the statewide UC Student Body Presidents Council. Mr. DeLapp received the \"Lauds & Laurels\" Outstanding Senior Award from UC Irvine Alumni Association in 1973.",
        "He is a former director of the University of California Student Lobby (1973-75). Tom later served as General Manager of California Research (a capital-based consulting firm).",
      ],
    },
    {
      heading: "A Family of Educators",
      paragraphs: [
        "Tom married his high school sweetheart Jan, who was a professor of early childhood education and Dean of Health and Education at American River College in Sacramento. As a state-level consultant, Jan has been an instrumental leader in integrating standardized competencies into a fully aligned ECE curriculum for the California Community Colleges and CSU systems. Tom and Jan have been married for 54 years.",
        "Their daughter Kathryn is a graduate of the Hartt School of Performing Arts at the University of Hartford in Connecticut and received her master's degree in Theater Education from CCNY in 2013. She is a high school drama teacher at West Park High School in the Roseville Joint Union High School District.",
        "Their son Kevin earned his undergraduate degree from the University of California, Santa Cruz and was awarded his PhD from Duke University in 2006. He is now a tenured Professor of Philosophy at Converse University in Spartanburg, South Carolina.",
      ],
    },
    {
      heading: "Awards, Honors and Recognitions",
      paragraphs: [
        "In 2004, Tom DeLapp was recognized as Outstanding Communicator of the Year by CalSPRA. In 2006, he was awarded NSPRA's Barry Gaskins Legacy Mentor Award recognizing his many contributions to and support for his school public relations colleagues. In 2013, he was the recipient of the President's Award, NSPRA's most prestigious recognition for lifetime contributions to the school public relations profession.",
        "Tom served as President of NSPRA from 2017 to 2018.",
        "Tom is the 2016 recipient of the Ferd. Kiesel Distinguished Service Award, the highest honor bestowed by the Association of California School Administrators, for exceptional contributions to public education in California.",
      ],
    },
  ],
  ctas: {
    primary: { label: "Read the full speaker's introduction", href: "/introduction" },
    secondary: { label: "Listen to the podcast", href: "/podcast-library" },
  },
  signOff: "– When Communication Counts –",
  subscribeBand: {
    heading: "Don't miss our weekly podcast",
    body: "Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face.",
    showEmailForm: false,
  },
};
```

- [ ] **Step 3: Write `src/content/resume.ts`**

```ts
// src/content/resume.ts
import type { InteriorPageContent } from "./types";

export const resumeContent: InteriorPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Professional Resume",
    subheading: "Thomas K. DeLapp, APR — Chairman & Founder",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "In California, if a situation in a school district is controversial, complex, or critical the one person most superintendents call is Tom DeLapp. Since 1996 when he founded his firm, Tom has served as communications counsel for over 500 school districts in California. He has conducted over 1,000 workshops across the country, training nearly 250,000 educators on effective communications, community engagement, and media relations.",
  sections: [
    {
      paragraphs: [
        "A veteran of the communications industry with over 50 years of experience in both the public and private sectors, Tom DeLapp draws on a wealth of expertise and a national reputation as one of the premier school public relations professionals in the country. Mr. DeLapp is a highly sought after keynote speaker and workshop presenter on communication and education trends.",
        "Tom has helped school districts successfully communicate through sex scandals, budget cuts, teacher strikes, collective bargaining impasse situations, numerous campus shootings, bond campaigns, school closures, employee misconduct, health scares, marketing/branding concerns, student deaths, and curriculum battles. He has conducted communication audits and developed communication plans for over 50 school districts. Tom successfully dealt with controversial situations involving transgender students and teachers, including national media attention over the election of a transgender homecoming queen.",
      ],
    },
  ],
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
};
```

- [ ] **Step 4: Verify**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/content/principles-beliefs.ts src/content/experience-expertise.ts src/content/resume.ts
git commit -m "$(cat <<'EOF'
Add content for the 3 bio-style About-us pages

Verbatim from the live site, one typo silently fixed (Experience &
Expertise award year, 2106 -> 2016).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 4: Content data — 4 service-style pages (Coaching & Team Building, Contract PR Advising, Crisis Communication Advising, Training Programs & Workshops)

**Files:**
- Create: `src/content/coaching-and-team-building.ts`
- Create: `src/content/contract-public-relations-advising.ts`
- Create: `src/content/crisis-communication-advising.ts`
- Create: `src/content/training-program-and-workshops.ts`

**Interfaces:**
- Consumes: `InteriorPageContent` (Task 2, `@/content/types`)
- Produces: `coachingAndTeamBuildingContent`, `contractPublicRelationsAdvisingContent`, `crisisCommunicationAdvisingContent`, `trainingProgramAndWorkshopsContent`, each typed `InteriorPageContent`, consumed by the matching route in Task 7.

All four use at least one `checklistCard` inside their `sections` array. Content verbatim from the live site.

- [ ] **Step 1: Write `src/content/coaching-and-team-building.ts`**

```ts
// src/content/coaching-and-team-building.ts
import type { InteriorPageContent } from "./types";

export const coachingAndTeamBuildingContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Coaching and Team Building",
    subheading: "Sharpening School Communication Skills",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "The key to leadership is communication. Most leaders fail or encounter problems in their jobs because of poor communication within their organizations. Whether you are a veteran or new to your position as a school trustee, superintendent, principal, administrator or organization leader, Communication Resources for Schools can help you cultivate your own communication skills. Tom DeLapp has worked with dozens of management teams, school boards and individuals to help them.",
  sections: [
    {
      checklistCard: {
        heading: "Tom DeLapp can help your team —",
        items: [
          "Set protocols and standards for interacting as a team",
          "Facilitate strategic planning and goal setting sessions",
          "Handle agenda management for meetings",
          "Analyze group dynamics",
          "Improve personal written communications",
          "Improve personal verbal and non-verbal communication skills",
          "Resolve conflict within groups",
          "Define communication/decision-making systems for new superintendents or principals",
          "Team building within school, department and district office staff",
        ],
      },
    },
  ],
  closingParagraph:
    "We can also help districts elevate the work of their school public relations function by examining job descriptions, assignments, training needs, and recruiting.",
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
};
```

- [ ] **Step 2: Write `src/content/contract-public-relations-advising.ts`**

```ts
// src/content/contract-public-relations-advising.ts
import type { InteriorPageContent } from "./types";

export const contractPublicRelationsAdvisingContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Contract Public Relations Advising",
    subheading: "On-Call Communications Counsel",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "In tough fiscal times, your district may not be staffed to provide communications, community relations, or public relations services to top management. As your on-call communications counsel, we can tailor a package of services that precisely fits your needs. Through e-mail, Zoom, and phone, we can deliver timely written materials, strategy pieces, and other services as if we were in your office! Retainer and hourly fee arrangements are available to clients.",
  sections: [
    {
      checklistCard: {
        heading: "We can help you —",
        items: [
          "Write print and electronic materials on issues or programs",
          "Write opinion columns and news releases for district leaders",
          "Draft parent letters on key topics or during critical incidents",
          "Prepare internal communications, staff newsletters articles, and bulletins",
          "Coordinate key communicator networks and prepare electronic and print public awareness materials",
          "Prepare fact sheets, talking points, and FAQ sheets (Frequently Asked Questions) on key programs, policies and issues",
          "Script, shoot and produce informational and employee recruiting videos",
        ],
      },
    },
  ],
  closingParagraph: "To discuss your communication needs call or text Tom DeLapp at (916) 765-1759.",
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
};
```

- [ ] **Step 3: Write `src/content/crisis-communication-advising.ts`**

```ts
// src/content/crisis-communication-advising.ts
import type { InteriorPageContent } from "./types";

export const crisisCommunicationAdvisingContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Crisis Communication Advising",
    subheading: "When the Stakes Are Highest",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "The Chinese symbol for crisis is a combination of the symbols for \"danger\" and \"crucial point.\" In a critical incident or a controversial situation, your schools have a chance to fail or succeed in the public eye. In a crisis, how you communicate may be just as critical as how you manage the crisis.",
  sections: [
    {
      paragraphs: [
        "Tom DeLapp is a seasoned veteran who's handled communication on the front line of virtually every type of school emergency, controversy, and critical situation facing public schools. He was on the team handling the communication response in the Columbine High School shooting tragedy. He's faced the cameras during dozens of teacher strikes. He led the Butte County Office of Education incident command post during the devastating CAMP wildfire that destroyed the town of Paradise in Northern California. He's kept dozens of controversial personnel situations from hitting the six o'clock news.",
      ],
    },
    {
      checklistCard: {
        heading: "As your communications advisor in a critical incident, Tom DeLapp can help your schools —",
        items: [
          "Develop emergency plans with specific job descriptions for each team member and action steps each must take during the first few hours of an emergency or incident",
          "Manage internal and external communications during critical incidents such as personnel actions, campus safety situations, natural disasters and accidents, and controversial district actions/decisions",
          "Prepare FAQ sheets, news releases, bulletins and talking points to orient staff and leaders on what they can and can't say",
          "Serve as spokesperson/handle media relations in high profile situations",
          "Train staff in response techniques",
        ],
      },
    },
  ],
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
};
```

- [ ] **Step 4: Write `src/content/training-program-and-workshops.ts`**

```ts
// src/content/training-program-and-workshops.ts
import type { InteriorPageContent } from "./types";

export const trainingProgramAndWorkshopsContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Training Programs & Workshops",
    subheading: "Tom DeLapp Programs & Workshops",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "Tom DeLapp is recognized across the country as an exceptional presenter who combines first-rate content with a humorous, engaging style to make staff development programs for educators truly memorable. Since 1989, he has delivered over 1,000 workshops, speeches, seminars and training programs for over 250,000 educators in the United States and Canada. His command of public relations theory, combined with practical proven techniques, give workshop attendees tools they can use to improve communication or deal with challenging situations.",
  sections: [
    {
      checklistCard: {
        heading: "Topics he can cover for your organization include —",
        items: [
          "Crisis Communication & Emergency Response Planning",
          "Media Relations",
          "Time Management",
          "Communication Planning",
          "Reputation Management",
          "Marketing Your Schools",
          "Dealing with Controversies & Difficult People",
          "Customer Service",
          "Internal Employee Communication",
          "Targeting Your Message about Budgets, Performance & Accountability",
          "Speaking Up for Public Schools",
        ],
      },
    },
    {
      heading: "Keynote Speeches",
      paragraphs: [
        "Tom DeLapp is available to keynote your next convention, conference, symposium or seminar. He is a frequent presenter for education and business organizations. Doctoral and administrator credential programs at universities and colleges often call on Tom DeLapp to present the communication portion of their academic coursework. Themed keynote speeches include:",
      ],
      list: [
        "Split Second Leadership: Being Decisive When the Clock is Ticking",
        "Take a Hike! Lessons Learned Above 10,000' About Life, Leadership, and Legacy",
        "Resisting the Loudest Voice in the Room: Coping with the Tyranny of Minority Interests",
      ],
    },
  ],
  closingParagraph: "To arrange for Tom DeLapp to speak at your next event call (916) 765-1759.",
  ctas: {
    primary: { label: "Call or text (916) 765-1759", href: "tel:+19167651759" },
    secondary: { label: "Listen to the podcast", href: "/podcast-library" },
  },
  signOff: "– When Communication Counts –",
  subscribeBand: {
    heading: "Don't miss our weekly podcast",
    body: "Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face.",
    showEmailForm: false,
  },
};
```

Note: this page's primary CTA is a direct phone link rather than "Request a training session" (which the other 6 real pages use, linking to this page) — linking this page to itself would be circular.

- [ ] **Step 5: Verify**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add src/content/coaching-and-team-building.ts src/content/contract-public-relations-advising.ts src/content/crisis-communication-advising.ts src/content/training-program-and-workshops.ts
git commit -m "$(cat <<'EOF'
Add content for the 4 service-style Professional Services pages

Verbatim from the live site.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 5: Content data — 6 stub pages

**Files:**
- Create: `src/content/stub-pages.ts`

**Interfaces:**
- Produces: `StubPageContent` type, and `ourTeamContent`, `howToSubscribeContent`, `podcastLibraryContent`, `consultingRetainersContent`, `publicationsContent`, `substackArticlesContent`, each typed `StubPageContent`, consumed by Tasks 8–9.

These 6 pages are still WordPress theme placeholder content on the live site (Lorem ipsum, generic theme demo copy) — not real content to migrate. Each gets a banner (matching what the nav already promises for that page) and a short "coming soon" message, per the spec.

- [ ] **Step 1: Write `src/content/stub-pages.ts`**

```ts
// src/content/stub-pages.ts
export type StubPageContent = {
  banner: { eyebrow: string; heading: string; subheading: string };
  message: string;
};

export const ourTeamContent: StubPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Our Team",
    subheading: "Meet the People Behind Communication Resources",
  },
  message:
    "We're putting together full team profiles. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const howToSubscribeContent: StubPageContent = {
  banner: {
    eyebrow: "Straight Talk by Tom DeLapp",
    heading: "How to Subscribe",
    subheading: "Never Miss a New Episode",
  },
  message:
    "We're finalizing which platform will host the show. In the meantime, get in touch and we'll notify you the moment it's live.",
};

export const podcastLibraryContent: StubPageContent = {
  banner: {
    eyebrow: "Straight Talk by Tom DeLapp",
    heading: "Podcast Library",
    subheading: "Every Episode, One Place",
  },
  message:
    "The library is being built out as new episodes are recorded. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const consultingRetainersContent: StubPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Consulting Retainers",
    subheading: "Ongoing Communications Counsel",
  },
  message:
    "Details on retainer arrangements are coming soon. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const publicationsContent: StubPageContent = {
  banner: {
    eyebrow: "Communication Resources",
    heading: "Publications",
    subheading: "Tom DeLapp's Writing & Research",
  },
  message:
    "This page is being updated with Tom's published work. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const substackArticlesContent: StubPageContent = {
  banner: {
    eyebrow: "Communication Resources",
    heading: "Substack Articles",
    subheading: "Weekly Notes on School Communication",
  },
  message:
    "Substack articles are coming soon. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};
```

- [ ] **Step 2: Verify**

```bash
npm run build
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/content/stub-pages.ts
git commit -m "$(cat <<'EOF'
Add stub content for the 6 pages still pending real copy from the client

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 6: Page assembly — 3 bio-style pages

**Files:**
- Create: `src/app/principles-beliefs/page.tsx`
- Create: `src/app/experience-expertise/page.tsx`
- Create: `src/app/resume/page.tsx`

**Interfaces:**
- Consumes: `PageBanner`, `SidebarRail` (Task 1), `PageSections` (Task 2), `SubscribeBand` (phase 1), `principlesBeliefsContent`/`experienceExpertiseContent`/`resumeContent` (Task 3)
- Produces: three routes — `/principles-beliefs`, `/experience-expertise`, `/resume`.

All three follow the identical assembly pattern established by the refactored `/introduction` (Task 1), swapped to the generic `sections`/`closingParagraph` shape instead of `secondParagraph`/fixed `checklistCard`.

- [ ] **Step 1: Write `src/app/principles-beliefs/page.tsx`**

```tsx
// src/app/principles-beliefs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { PageSections } from "@/components/page-sections";
import { SubscribeBand } from "@/components/subscribe-band";
import { principlesBeliefsContent } from "@/content/principles-beliefs";

export const metadata: Metadata = {
  title: "Principles & Beliefs | Communication Resources",
  description:
    "Communication Resources' vision — cultivating a communicating culture in schools and equipping leaders to serve their communities.",
};

export default function PrinciplesBeliefsPage() {
  const { banner, rail, lede, sections, closingParagraph, ctas, signOff, subscribeBand } =
    principlesBeliefsContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>

            <PageSections sections={sections} />

            {closingParagraph && (
              <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
                {closingParagraph}
              </p>
            )}

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

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">{signOff}</p>
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

- [ ] **Step 2: Write `src/app/experience-expertise/page.tsx`**

Identical structure to Step 1, with these substitutions: import `experienceExpertiseContent` from `@/content/experience-expertise`; function name `ExperienceExpertisePage`; metadata:
```ts
export const metadata: Metadata = {
  title: "Experience & Expertise | Communication Resources",
  description:
    "Tom DeLapp's professional background — decades leading communications for ACSA and California school districts, honors, and family.",
};
```

Full file:

```tsx
// src/app/experience-expertise/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { PageSections } from "@/components/page-sections";
import { SubscribeBand } from "@/components/subscribe-band";
import { experienceExpertiseContent } from "@/content/experience-expertise";

export const metadata: Metadata = {
  title: "Experience & Expertise | Communication Resources",
  description:
    "Tom DeLapp's professional background — decades leading communications for ACSA and California school districts, honors, and family.",
};

export default function ExperienceExpertisePage() {
  const { banner, rail, lede, sections, closingParagraph, ctas, signOff, subscribeBand } =
    experienceExpertiseContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>

            <PageSections sections={sections} />

            {closingParagraph && (
              <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
                {closingParagraph}
              </p>
            )}

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

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">{signOff}</p>
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

- [ ] **Step 3: Write `src/app/resume/page.tsx`**

Same structure again. Full file:

```tsx
// src/app/resume/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { PageSections } from "@/components/page-sections";
import { SubscribeBand } from "@/components/subscribe-band";
import { resumeContent } from "@/content/resume";

export const metadata: Metadata = {
  title: "Professional Resume | Communication Resources",
  description:
    "Tom DeLapp, APR — communications counsel for over 500 California school districts since 1996, with 50+ years in the industry.",
};

export default function ResumePage() {
  const { banner, rail, lede, sections, closingParagraph, ctas, signOff, subscribeBand } = resumeContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>

            <PageSections sections={sections} />

            {closingParagraph && (
              <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
                {closingParagraph}
              </p>
            )}

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

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">{signOff}</p>
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

- [ ] **Step 4: Verify**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000/principles-beliefs`, `/experience-expertise`, and `/resume`. Confirm each renders its banner, sidebar rail with the correct About-us siblings (should now list the other 4 About-us pages, not include itself), lede, body content, CTAs, sign-off, and subscribe band. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/app/principles-beliefs src/app/experience-expertise src/app/resume
git commit -m "$(cat <<'EOF'
Build the 3 bio-style About-us pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 7: Page assembly — 4 service-style pages

**Files:**
- Create: `src/app/coaching-and-team-building/page.tsx`
- Create: `src/app/contract-public-relations-advising/page.tsx`
- Create: `src/app/crisis-communication-advising/page.tsx`
- Create: `src/app/training-program-and-workshops/page.tsx`

**Interfaces:**
- Consumes: same as Task 6, plus the four content objects from Task 4.
- Produces: four routes matching the file paths above.

Same assembly pattern as Task 6 (identical JSX structure — the `PageSections` component is what makes the checklist cards "just work" without any per-page branching).

- [ ] **Step 1: Write `src/app/coaching-and-team-building/page.tsx`**

```tsx
// src/app/coaching-and-team-building/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { PageSections } from "@/components/page-sections";
import { SubscribeBand } from "@/components/subscribe-band";
import { coachingAndTeamBuildingContent } from "@/content/coaching-and-team-building";

export const metadata: Metadata = {
  title: "Coaching and Team Building | Communication Resources",
  description:
    "Coaching and team building for school leaders — sharpening communication skills for trustees, superintendents, and administrators.",
};

export default function CoachingAndTeamBuildingPage() {
  const { banner, rail, lede, sections, closingParagraph, ctas, signOff, subscribeBand } =
    coachingAndTeamBuildingContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>

            <PageSections sections={sections} />

            {closingParagraph && (
              <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
                {closingParagraph}
              </p>
            )}

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

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">{signOff}</p>
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

- [ ] **Step 2: Write `src/app/contract-public-relations-advising/page.tsx`**

Same structure. Full file:

```tsx
// src/app/contract-public-relations-advising/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { PageSections } from "@/components/page-sections";
import { SubscribeBand } from "@/components/subscribe-band";
import { contractPublicRelationsAdvisingContent } from "@/content/contract-public-relations-advising";

export const metadata: Metadata = {
  title: "Contract Public Relations Advising | Communication Resources",
  description:
    "On-call communications counsel for school districts — tailored PR services via email, Zoom, and phone.",
};

export default function ContractPublicRelationsAdvisingPage() {
  const { banner, rail, lede, sections, closingParagraph, ctas, signOff, subscribeBand } =
    contractPublicRelationsAdvisingContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>

            <PageSections sections={sections} />

            {closingParagraph && (
              <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
                {closingParagraph}
              </p>
            )}

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

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">{signOff}</p>
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

- [ ] **Step 3: Write `src/app/crisis-communication-advising/page.tsx`**

Same structure. Full file:

```tsx
// src/app/crisis-communication-advising/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { PageSections } from "@/components/page-sections";
import { SubscribeBand } from "@/components/subscribe-band";
import { crisisCommunicationAdvisingContent } from "@/content/crisis-communication-advising";

export const metadata: Metadata = {
  title: "Crisis Communication Advising | Communication Resources",
  description:
    "Crisis communication advising for schools — from emergency planning to media relations in high-profile incidents.",
};

export default function CrisisCommunicationAdvisingPage() {
  const { banner, rail, lede, sections, closingParagraph, ctas, signOff, subscribeBand } =
    crisisCommunicationAdvisingContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>

            <PageSections sections={sections} />

            {closingParagraph && (
              <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
                {closingParagraph}
              </p>
            )}

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

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">{signOff}</p>
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

- [ ] **Step 4: Write `src/app/training-program-and-workshops/page.tsx`**

Same structure. Full file:

```tsx
// src/app/training-program-and-workshops/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { PageSections } from "@/components/page-sections";
import { SubscribeBand } from "@/components/subscribe-band";
import { trainingProgramAndWorkshopsContent } from "@/content/training-program-and-workshops";

export const metadata: Metadata = {
  title: "Training Programs & Workshops | Communication Resources",
  description:
    "Training programs, workshops, and keynote speeches on school communication, crisis response, and media relations.",
};

export default function TrainingProgramAndWorkshopsPage() {
  const { banner, rail, lede, sections, closingParagraph, ctas, signOff, subscribeBand } =
    trainingProgramAndWorkshopsContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc={rail.headshotSrc}
            headshotAlt={rail.headshotAlt}
            name={rail.name}
            role={rail.role}
          />

          <div>
            <p className="mb-[22px] font-heading text-[21px] leading-[1.5] text-ink-soft text-pretty">
              {lede}
            </p>

            <PageSections sections={sections} />

            {closingParagraph && (
              <p className="mt-[34px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty">
                {closingParagraph}
              </p>
            )}

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

            <p className="mt-11 text-center font-heading text-[19px] italic text-red-dark">{signOff}</p>
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

- [ ] **Step 5: Verify**

```bash
npm run build
npm run dev
```

Open all four routes. Confirm each renders its checklist card(s) correctly — training-programs-and-workshops specifically has two lists (a boxed `ChecklistCard` for the topics, then a "Keynote Speeches" section with a plain checkmarked list below its paragraph) in that order. Confirm the sidebar rail on each shows the other 4 Professional Services pages as siblings (not itself). Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/app/coaching-and-team-building src/app/contract-public-relations-advising src/app/crisis-communication-advising src/app/training-program-and-workshops
git commit -m "$(cat <<'EOF'
Build the 4 service-style Professional Services pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 8: Page assembly — 5 stub pages (left-rail layout)

**Files:**
- Create: `src/app/our-team/page.tsx`
- Create: `src/app/podcast-library/page.tsx`
- Create: `src/app/consulting-retainers/page.tsx`
- Create: `src/app/publications/page.tsx`
- Create: `src/app/substack-articles/page.tsx`

**Interfaces:**
- Consumes: `PageBanner`, `SidebarRail` (Task 1), `SubscribeBand` (phase 1), the five matching `StubPageContent` objects (Task 5).
- Produces: five routes matching the file paths above.

All five use the standard left-rail layout (same as every real page) but with the minimal stub body instead of full content.

- [ ] **Step 1: Write `src/app/our-team/page.tsx`**

```tsx
// src/app/our-team/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { SubscribeBand } from "@/components/subscribe-band";
import { ourTeamContent } from "@/content/stub-pages";

export const metadata: Metadata = {
  title: "Our Team | Communication Resources",
  description: "Meet the team behind Communication Resources — profiles coming soon.",
};

export default function OurTeamPage() {
  const { banner, message } = ourTeamContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc="/images/tom-delapp.jpg"
            headshotAlt="Tom DeLapp"
            name="Tom DeLapp"
            role="Communication Resources"
          />

          <div className="flex min-h-[220px] items-center">
            <p className="max-w-[52ch] text-[17px] leading-[1.65] text-body text-pretty">{message}</p>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading="Don't miss our weekly podcast"
        body="Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face."
        headingSize="md"
        showEmailForm={false}
      />
    </>
  );
}
```

- [ ] **Step 2: Write `src/app/podcast-library/page.tsx`**

Same structure. Full file:

```tsx
// src/app/podcast-library/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { SubscribeBand } from "@/components/subscribe-band";
import { podcastLibraryContent } from "@/content/stub-pages";

export const metadata: Metadata = {
  title: "Podcast Library | Communication Resources",
  description: "Browse every episode of Straight Talk by Tom DeLapp — library coming soon.",
};

export default function PodcastLibraryPage() {
  const { banner, message } = podcastLibraryContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc="/images/tom-delapp.jpg"
            headshotAlt="Tom DeLapp"
            name="Tom DeLapp"
            role="Communication Resources"
          />

          <div className="flex min-h-[220px] items-center">
            <p className="max-w-[52ch] text-[17px] leading-[1.65] text-body text-pretty">{message}</p>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading="Don't miss our weekly podcast"
        body="Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face."
        headingSize="md"
        showEmailForm={false}
      />
    </>
  );
}
```

- [ ] **Step 3: Write `src/app/consulting-retainers/page.tsx`**

Same structure. Full file:

```tsx
// src/app/consulting-retainers/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { SubscribeBand } from "@/components/subscribe-band";
import { consultingRetainersContent } from "@/content/stub-pages";

export const metadata: Metadata = {
  title: "Consulting Retainers | Communication Resources",
  description:
    "Ongoing consulting retainer arrangements with Communication Resources — details coming soon.",
};

export default function ConsultingRetainersPage() {
  const { banner, message } = consultingRetainersContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc="/images/tom-delapp.jpg"
            headshotAlt="Tom DeLapp"
            name="Tom DeLapp"
            role="Communication Resources"
          />

          <div className="flex min-h-[220px] items-center">
            <p className="max-w-[52ch] text-[17px] leading-[1.65] text-body text-pretty">{message}</p>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading="Don't miss our weekly podcast"
        body="Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face."
        headingSize="md"
        showEmailForm={false}
      />
    </>
  );
}
```

- [ ] **Step 4: Write `src/app/publications/page.tsx`**

Same structure. Full file:

```tsx
// src/app/publications/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { SubscribeBand } from "@/components/subscribe-band";
import { publicationsContent } from "@/content/stub-pages";

export const metadata: Metadata = {
  title: "Publications | Communication Resources",
  description: "Tom DeLapp's published writing and research — coming soon.",
};

export default function PublicationsPage() {
  const { banner, message } = publicationsContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc="/images/tom-delapp.jpg"
            headshotAlt="Tom DeLapp"
            name="Tom DeLapp"
            role="Communication Resources"
          />

          <div className="flex min-h-[220px] items-center">
            <p className="max-w-[52ch] text-[17px] leading-[1.65] text-body text-pretty">{message}</p>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading="Don't miss our weekly podcast"
        body="Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face."
        headingSize="md"
        showEmailForm={false}
      />
    </>
  );
}
```

- [ ] **Step 5: Write `src/app/substack-articles/page.tsx`**

Same structure. Full file:

```tsx
// src/app/substack-articles/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SidebarRail } from "@/components/sidebar-rail";
import { SubscribeBand } from "@/components/subscribe-band";
import { substackArticlesContent } from "@/content/stub-pages";

export const metadata: Metadata = {
  title: "Substack Articles | Communication Resources",
  description: "Weekly Substack articles on school communication from Tom DeLapp — coming soon.",
};

export default function SubstackArticlesPage() {
  const { banner, message } = substackArticlesContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <SidebarRail
            headshotSrc="/images/tom-delapp.jpg"
            headshotAlt="Tom DeLapp"
            name="Tom DeLapp"
            role="Communication Resources"
          />

          <div className="flex min-h-[220px] items-center">
            <p className="max-w-[52ch] text-[17px] leading-[1.65] text-body text-pretty">{message}</p>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading="Don't miss our weekly podcast"
        body="Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face."
        headingSize="md"
        showEmailForm={false}
      />
    </>
  );
}
```

- [ ] **Step 6: Verify**

```bash
npm run build
npm run dev
```

Open all five routes. Confirm each shows the banner, the standard sidebar (with the correct section's siblings — Our Team's siblings are the other About-us pages including the now-real ones; Podcast Library's siblings are just "How to Subscribe"; Consulting Retainers' siblings are the other 4 Professional Services pages; Publications/Substack Articles' siblings include each other plus the external Blogspot link, which should open in a new tab), the coming-soon message, and the subscribe band. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/app/our-team src/app/podcast-library src/app/consulting-retainers src/app/publications src/app/substack-articles
git commit -m "$(cat <<'EOF'
Build 5 stub pages pending real content, left-rail layout

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 9: Page assembly — How to Subscribe (right-sidebar template)

**Files:**
- Create: `src/app/how-to-subscribe/page.tsx`

**Interfaces:**
- Consumes: `PageBanner` (Task 1), `ContactCard` (Task 2), `SubscribeBand` (phase 1), `howToSubscribeContent` (Task 5).
- Produces: `/how-to-subscribe` route.

This is the template example for the new right-sidebar layout: body content on the **left** (wider column), `ContactCard` on the **right** (narrower column) — the mirror image of every other interior page's left-rail/right-content arrangement. Future pages that don't have a headshot/bio anchor can copy this file's structure instead of the left-rail one.

- [ ] **Step 1: Write `src/app/how-to-subscribe/page.tsx`**

```tsx
// src/app/how-to-subscribe/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { ContactCard } from "@/components/contact-card";
import { SubscribeBand } from "@/components/subscribe-band";
import { howToSubscribeContent } from "@/content/stub-pages";

export const metadata: Metadata = {
  title: "How to Subscribe | Communication Resources",
  description: "How to subscribe to Straight Talk by Tom DeLapp — details coming soon.",
};

export default function HowToSubscribePage() {
  const { banner, message } = howToSubscribeContent;

  return (
    <>
      <PageBanner eyebrow={banner.eyebrow} heading={banner.heading} subheading={banner.subheading} />

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-[60px] py-[66px] pb-10 nav:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)]">
          <div className="flex min-h-[220px] items-center">
            <p className="max-w-[52ch] text-[17px] leading-[1.65] text-body text-pretty">{message}</p>
          </div>

          <ContactCard />
        </div>
      </section>

      <SubscribeBand
        heading="Don't miss our weekly podcast"
        body="Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face."
        headingSize="md"
        showEmailForm={false}
      />
    </>
  );
}
```

Note the grid column order is flipped relative to every left-rail page (`1.28fr` first/left, `0.72fr` second/right) — same column-width ratio as the left-rail layout, just mirrored, so both layouts read as the same design system rather than two unrelated grids.

- [ ] **Step 2: Verify**

```bash
npm run build
npm run dev
```

Open `http://localhost:3000/how-to-subscribe`. Confirm the body message sits on the left, `ContactCard` (red-topped, phone CTA) sits on the right, and at widths below 900px the grid collapses to a single column with the message above the contact card (same `grid-cols-1` behavior every other interior-page grid already has). Click the "Call or text" link and confirm it's a `tel:` link (won't actually dial in a desktop browser, but confirm the `href` is `tel:+19167651759` via the browser's link preview or page source). Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/how-to-subscribe
git commit -m "$(cat <<'EOF'
Build How to Subscribe as the right-sidebar layout template

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011bXU7X9kcSmbw9JpA91LCY
EOF
)"
```

---

### Task 10: Final verification pass

**Files:**
- Modify: none (verification only, plus incidental fixes if verification turns up issues)

- [ ] **Step 1: Full build**

```bash
npm run build
npm run lint
```

Expected: both pass with no errors. `npm run build`'s route list should now show 17 routes: `/`, `/introduction`, and the 13 new pages, plus `/_not-found`.

- [ ] **Step 2: Nav link sweep**

```bash
npm run dev
```

Click through every item in the header's four dropdown menus (desktop) — all 15 internal links plus the external Blogspot link — confirming none 404s. Do the same in the mobile drawer. This is the concrete check that every route `nav.ts` promises now resolves to a real page.

- [ ] **Step 3: Spot-check sidebar sibling lists across all four sections**

On one page from each nav section, confirm the sidebar (or, for How to Subscribe, skip this — it uses the right-sidebar layout) lists the correct siblings and excludes the current page:
- An About-us page (e.g. `/resume`): should list Principles & Beliefs, Experience & Expertise, Speaker's Introduction, Our Team.
- A Professional Services page (e.g. `/coaching-and-team-building`): should list Contract Public Relations Advising, Consulting Retainers, Crisis Communication Advising, Training Programs & Workshops.
- `/publications` (Communication Resources): should list Substack Articles and Blogspot (external, opens in a new tab).
- `/podcast-library` (Straight Talk): should list only "How to Subscribe" (the section has just two pages).

Stop the dev server when done.

- [ ] **Step 4: Fix any issues found, then final commit**

If Steps 1–3 turn up issues, fix them in the relevant file and commit the fix separately with a message describing what was wrong. If everything passes cleanly, no additional commit is needed here.

- [ ] **Step 5: Report status to the user**

Summarize what's runnable (`npm run dev` → all 17 routes) and that pushing/deploying is a separate step, same as phase 1.

---

## Explicitly out of scope (future work)

- Real content for the 6 stub pages — waiting on the client.
- Podcast platform integration, real episode data, real newsletter provider wiring (unchanged from phase 1's scope notes).
- The admin area.
- Any further layout variants beyond the two established here (left-rail, right-sidebar) — build a third only when a real page needs one.
