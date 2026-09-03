// src/content/types.ts
export type PageSection = {
  heading?: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  checklistCard?: { heading: string; items: readonly string[] };
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
