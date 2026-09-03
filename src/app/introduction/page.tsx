// src/app/introduction/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { OffsetPhoto } from "@/components/offset-photo";
import { SubscribeBand } from "@/components/subscribe-band";
import { introductionContent } from "@/content/introduction";

export const metadata: Metadata = {
  title: "Speaker's Introduction | Communication Resources",
  description:
    "Proven techniques to level the news playing field — how Tom DeLapp helps school leaders navigate media relations, from crisis communication to interview prep.",
};

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
            {banner.eyebrow}
          </div>
          <h1 className="mb-3 max-w-[22ch] font-heading text-[33px] nav:text-[52px] font-bold leading-[1.05] tracking-[-0.025em]">
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
