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
