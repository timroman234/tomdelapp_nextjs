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
