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
