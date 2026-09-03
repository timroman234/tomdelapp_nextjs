// src/content/stub-pages.ts
export type StubPageContent = {
  banner: { eyebrow: string; heading: string; subheading: string };
  message: string;
};

export const ourTeamContent: StubPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Our Team",
    subheading: "Meet the People Behind Communication Resources",
  },
  message:
    "We're putting together full team profiles. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const howToSubscribeContent: StubPageContent = {
  banner: {
    eyebrow: "Straight Talk by Tom DeLapp",
    heading: "How to Subscribe",
    subheading: "Never Miss a New Episode",
  },
  message:
    "We're finalizing which platform will host the show. In the meantime, get in touch and we'll notify you the moment it's live.",
};

export const podcastLibraryContent: StubPageContent = {
  banner: {
    eyebrow: "Straight Talk by Tom DeLapp",
    heading: "Podcast Library",
    subheading: "Every Episode, One Place",
  },
  message:
    "The library is being built out as new episodes are recorded. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const consultingRetainersContent: StubPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Consulting Retainers",
    subheading: "Ongoing Communications Counsel",
  },
  message:
    "Details on retainer arrangements are coming soon. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const publicationsContent: StubPageContent = {
  banner: {
    eyebrow: "Communication Resources",
    heading: "Publications",
    subheading: "Tom DeLapp's Writing & Research",
  },
  message:
    "This page is being updated with Tom's published work. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};

export const substackArticlesContent: StubPageContent = {
  banner: {
    eyebrow: "Communication Resources",
    heading: "Substack Articles",
    subheading: "Weekly Notes on School Communication",
  },
  message:
    "Substack articles are coming soon. In the meantime, reach out directly — call or text (916) 765-1759 — or check back soon.",
};
