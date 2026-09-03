// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { OffsetPhoto } from "@/components/offset-photo";
import { EpisodePlayer } from "@/components/episode-player";
import { SubscribeBand } from "@/components/subscribe-band";
import { enabledPlatforms } from "@/config/platforms";
import { homeContent } from "@/content/home";

export default function HomePage() {
  const { hero, latestEpisode, aboutHost, subscribeBand } = homeContent;

  return (
    <>
      <section className="relative overflow-hidden border-t-[6px] border-b border-red border-line-3 bg-[linear-gradient(172deg,#C9B69A_0%,#DBCAB2_30%,#EFE5D6_68%,#FBF6EE_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_84%_6%,rgba(255,250,242,0.55)_0%,rgba(255,250,242,0)_65%)]" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[46px] [mask-image:linear-gradient(to_top,#000_0%,transparent_100%)]"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(31,26,24,0.18) 0 2px, rgba(31,26,24,0) 2px 11px)",
          }}
        />
        <div className="container-cr relative grid grid-cols-1 items-center gap-[60px] py-[54px] pb-[50px] nav:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <div>
            <div className="mb-[18px] flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-red-dark">
              <span className="block h-px w-[26px] bg-red" />
              {hero.eyebrow}
            </div>
            <h1 className="mb-[14px] font-heading text-[54px] font-bold leading-[1.05] tracking-[-0.025em]">
              {hero.heading}
            </h1>
            <p className="mb-[18px] font-heading text-[25px] leading-[1.2] text-red">
              {hero.tagline}
            </p>
            <p className="mb-[26px] max-w-[46ch] text-base leading-[1.55] text-ink-muted text-pretty">
              {hero.body}
            </p>
            <div className="flex flex-wrap items-center gap-[14px]">
              <Link
                href={hero.primaryCta.href}
                className="rounded-[2px] bg-red px-7 py-[15px] text-[15px] font-semibold text-white no-underline hover:bg-red-dark"
              >
                {hero.primaryCta.label}
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="rounded-[2px] border border-[rgba(31,26,24,0.28)] px-6 py-[15px] text-[15px] font-medium text-ink no-underline hover:border-ink hover:bg-[rgba(255,252,247,0.55)]"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-[26px] gap-y-3 border-t border-[rgba(31,26,24,0.16)] pt-5">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6A5E]">
                {hero.listenLabel}
              </span>
              {enabledPlatforms.map((platform) => (
                <Link
                  key={platform.key}
                  href={platform.url}
                  className="flex items-center gap-2 text-sm font-medium text-ink-soft no-underline hover:text-red"
                >
                  <span className="block h-[6px] w-[6px] rounded-full bg-red" />
                  {platform.name}
                </Link>
              ))}
            </div>
          </div>

          <OffsetPhoto
            src={hero.imageSrc}
            alt={hero.imageAlt}
            aspectRatio="1 / 1"
            offset={16}
            priority
            sizes="(min-width: 900px) 44vw, 90vw"
          >
            <span className="absolute bottom-[84px] left-[-26px] origin-bottom-left whitespace-nowrap font-mono text-[10px] tracking-[0.22em] text-teal [transform:rotate(-90deg)]">
              {hero.onAirLabel}
            </span>
            <div className="absolute bottom-[-18px] left-[-18px] max-w-[210px] bg-ink px-[18px] py-[14px] text-cream">
              <div className="font-heading text-[15px] font-semibold leading-[1.25]">
                {hero.captionTitle}
              </div>
              <div className="mt-[3px] text-xs text-[rgba(251,248,245,0.7)]">
                {hero.captionSubtitle}
              </div>
            </div>
          </OffsetPhoto>
        </div>
      </section>

      <section id="latest" className="border-b border-line bg-cream">
        <div className="container-cr py-[72px]">
          <div className="mb-7 flex items-baseline justify-between gap-6">
            <h2 className="font-heading text-[13px] font-semibold uppercase tracking-[0.16em] text-red-dark">
              {latestEpisode.eyebrow}
            </h2>
            <Link href={latestEpisode.allEpisodesHref} className="text-sm font-medium no-underline">
              {latestEpisode.allEpisodesLabel}
            </Link>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 border border-line bg-white p-9 nav:grid-cols-[132px_minmax(0,1fr)]">
            <div className="flex aspect-square items-center justify-center border border-line-2 p-[10px] text-center [background:repeating-linear-gradient(135deg,#F1E9E2_0_10px,#E8DED5_10px_20px)]">
              <span className="font-mono text-[9px] leading-[1.6] tracking-[0.08em] text-muted-3">
                EPISODE
                <br />
                ART
              </span>
            </div>
            <div>
              <div className="mb-[10px] text-xs uppercase tracking-[0.08em] text-muted-3">
                {latestEpisode.meta}
              </div>
              <h3 className="mb-3 max-w-[30ch] font-heading text-[30px] leading-[1.15] tracking-[-0.015em]">
                {latestEpisode.title}
              </h3>
              <p className="mb-[26px] max-w-[62ch] text-base leading-[1.6] text-body text-pretty">
                {latestEpisode.summary}
              </p>
              <EpisodePlayer timecode={latestEpisode.timecode} />
              <div className="mt-[10px] font-mono text-[11px] text-muted-3">
                {latestEpisode.playerDisclaimer}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-cr grid grid-cols-1 items-start gap-16 py-[78px] nav:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <div className="relative aspect-[4/5] w-full border border-line-2">
              <Image
                src={aboutHost.headshotSrc}
                alt={aboutHost.headshotAlt}
                fill
                sizes="(min-width: 900px) 22vw, 90vw"
                className="object-cover"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>
            <div className="mt-[22px] border-l-2 border-red pl-4">
              <div className="font-heading text-[17px] font-semibold">{aboutHost.name}</div>
              <div className="mt-[3px] text-sm text-muted">{aboutHost.role}</div>
            </div>
          </div>

          <div>
            <h2 className="mb-5 font-heading text-[13px] font-semibold uppercase tracking-[0.16em] text-red-dark">
              {aboutHost.eyebrow}
            </h2>
            <p className="mb-6 max-w-[34ch] font-heading text-[26px] leading-[1.35] tracking-[-0.01em] text-pretty">
              {aboutHost.pullQuote}
            </p>
            {aboutHost.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph}
                className={`max-w-[62ch] text-base leading-[1.65] text-body text-pretty ${
                  i === aboutHost.paragraphs.length - 1 ? "mb-[30px]" : "mb-[18px]"
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="border-t border-line pt-[26px]">
              <div className="mb-4 text-xs uppercase tracking-[0.14em] text-muted-3">
                {aboutHost.checklistLabel}
              </div>
              <div className="grid grid-cols-1 gap-x-7 gap-y-3 nav:grid-cols-2">
                {aboutHost.checklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-[10px] text-[15px] leading-[1.5] text-ink-soft"
                  >
                    <span className="flex-none font-semibold text-teal">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={aboutHost.readMoreHref}
              className="mt-[30px] inline-block text-[15px] font-semibold no-underline"
            >
              {aboutHost.readMoreLabel}
            </Link>
          </div>
        </div>
      </section>

      <SubscribeBand
        heading={subscribeBand.heading}
        body={subscribeBand.body}
        headingSize="lg"
        showEmailForm={subscribeBand.showEmailForm}
      />
    </>
  );
}
