// src/app/publications/page.tsx
import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
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
