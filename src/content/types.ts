// src/content/types.ts
export type PageSection = {
  heading?: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  checklistCard?: { heading: string; items: readonly string[] };
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    heading: string;
    tagline: string;
    body: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    listenLabel: string;
    onAirLabel: string;
    captionTitle: string;
    captionSubtitle: string;
    imageSrc: string;
    imageAlt: string;
  };
  latestEpisode: {
    eyebrow: string;
    allEpisodesHref: string;
    allEpisodesLabel: string;
    meta: string;
    title: string;
    subtitle?: string;
    summary: string;
    playerDisclaimer: string;
    audioSrc: string;
    episodeArt: { src: string; alt: string };
  };
  aboutHost: {
    eyebrow: string;
    pullQuote: string;
    paragraphs: string[];
    checklistLabel: string;
    checklist: string[];
    readMoreHref: string;
    readMoreLabel: string;
    headshotSrc: string;
    headshotAlt: string;
    name: string;
    role: string;
  };
  subscribeBand: { heading: string; body: string; showEmailForm: boolean };
};

export type InteriorPageContent = {
  banner: { eyebrow: string; heading: string; subheading: string };
  rail: { headshotSrc: string; headshotAlt: string; name: string; role: string };
  lede: string;
  sections: readonly PageSection[];
  closingParagraph?: string;
  ctas: { primary: { label: string; href: string }; secondary: { label: string; href: string } };
  signOff: string;
  subscribeBand: { heading: string; body: string; showEmailForm: boolean };
};
