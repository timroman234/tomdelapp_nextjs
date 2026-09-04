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
        <h1 className="mb-3 max-w-[36ch] font-heading text-[28px] nav:text-[40px] font-bold leading-[1.05] tracking-[-0.025em]">
          {heading}
        </h1>
        <p className="whitespace-nowrap font-heading text-[23px] leading-[1.25] text-red max-[700px]:whitespace-normal">
          {subheading}
        </p>
      </div>
    </section>
  );
}
