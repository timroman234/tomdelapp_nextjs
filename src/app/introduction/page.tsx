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
