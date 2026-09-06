// Schema check run before any content write, independent of what the AI intended —
// a malformed edit is rejected here even if the model was fully compromised.
import type { HomeContent } from "@/content/types";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(isString);
}

function isCta(v: unknown): v is { label: string; href: string } {
  return (
    typeof v === "object" &&
    v !== null &&
    isString((v as Record<string, unknown>).label) &&
    isString((v as Record<string, unknown>).href)
  );
}

export function validateHomeContent(data: unknown): data is HomeContent {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  const hero = d.hero as Record<string, unknown> | undefined;
  if (
    !hero ||
    !isString(hero.eyebrow) ||
    !isString(hero.heading) ||
    !isString(hero.tagline) ||
    !isString(hero.body) ||
    !isCta(hero.primaryCta) ||
    !isCta(hero.secondaryCta) ||
    !isString(hero.listenLabel) ||
    !isString(hero.onAirLabel) ||
    !isString(hero.captionTitle) ||
    !isString(hero.captionSubtitle) ||
    !isString(hero.imageSrc) ||
    !isString(hero.imageAlt)
  ) {
    return false;
  }

  const latestEpisode = d.latestEpisode as Record<string, unknown> | undefined;
  const episodeArt = latestEpisode?.episodeArt as Record<string, unknown> | undefined;
  if (
    !latestEpisode ||
    !isString(latestEpisode.eyebrow) ||
    !isString(latestEpisode.allEpisodesHref) ||
    !isString(latestEpisode.allEpisodesLabel) ||
    !isString(latestEpisode.meta) ||
    !isString(latestEpisode.title) ||
    !isString(latestEpisode.summary) ||
    !isString(latestEpisode.playerDisclaimer) ||
    !isString(latestEpisode.audioSrc) ||
    !episodeArt ||
    !isString(episodeArt.src) ||
    !isString(episodeArt.alt)
  ) {
    return false;
  }

  const aboutHost = d.aboutHost as Record<string, unknown> | undefined;
  if (
    !aboutHost ||
    !isString(aboutHost.eyebrow) ||
    !isString(aboutHost.pullQuote) ||
    !isStringArray(aboutHost.paragraphs) ||
    !isString(aboutHost.checklistLabel) ||
    !isStringArray(aboutHost.checklist) ||
    !isString(aboutHost.readMoreHref) ||
    !isString(aboutHost.readMoreLabel) ||
    !isString(aboutHost.headshotSrc) ||
    !isString(aboutHost.headshotAlt) ||
    !isString(aboutHost.name) ||
    !isString(aboutHost.role)
  ) {
    return false;
  }

  const subscribeBand = d.subscribeBand as Record<string, unknown> | undefined;
  if (
    !subscribeBand ||
    !isString(subscribeBand.heading) ||
    !isString(subscribeBand.body) ||
    typeof subscribeBand.showEmailForm !== "boolean"
  ) {
    return false;
  }

  return true;
}
