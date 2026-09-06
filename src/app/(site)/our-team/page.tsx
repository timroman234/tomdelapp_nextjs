// src/app/our-team/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
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
        <div className="container-cr flex min-h-[220px] items-center py-[66px] pb-10">
          <p className="max-w-[52ch] text-[17px] leading-[1.65] text-body text-pretty">{message}</p>
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
