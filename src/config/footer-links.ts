// src/config/footer-links.ts
export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { label: string; links: FooterLink[] };

export const footerColumns: FooterColumn[] = [
  {
    label: "Podcast",
    links: [
      { label: "Podcast Library", href: "/podcast-library" },
      { label: "How to Subscribe", href: "/how-to-subscribe" },
    ],
  },
  {
    label: "Services",
    links: [
      { label: "Crisis Communication Advising", href: "/crisis-communication-advising" },
      { label: "Training Programs & Workshops", href: "/training-program-and-workshops" },
      { label: "Coaching and Team Building", href: "/coaching-and-team-building" },
      { label: "Consulting Retainers", href: "/consulting-retainers" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Publications", href: "/publications" },
      { label: "Substack Articles", href: "/substack-articles" },
      { label: "Blogspot", href: "https://tomdelapp.blogspot.com/", external: true },
    ],
  },
];

export const footerTagline =
  "Communication counsel for school districts and the leaders who run them.";
export const footerCopyright = "Copyright 2026 Communication Resources · All rights reserved";
export const footerSignOff = "— When communication counts —";
