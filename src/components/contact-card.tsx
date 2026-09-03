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
