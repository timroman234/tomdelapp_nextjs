// src/config/nav.ts
export type NavChild = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "#",
    children: [
      { label: "Principles & Beliefs", href: "/principles-beliefs" },
      { label: "Experience & Expertise", href: "/experience-expertise" },
      { label: "Professional Resume", href: "/resume" },
      { label: "Speaker's Introduction", href: "/introduction" },
      { label: "Our Team", href: "/our-team" },
    ],
  },
  {
    label: "Straight Talk by Tom DeLapp",
    href: "#",
    children: [
      { label: "How to Subscribe", href: "/how-to-subscribe" },
      { label: "Podcast Library", href: "/podcast-library" },
    ],
  },
  {
    label: "Professional Services",
    href: "#",
    children: [
      { label: "Coaching and Team Building", href: "/coaching-and-team-building" },
      { label: "Contract Public Relations Advising", href: "/contract-public-relations-advising" },
      { label: "Consulting Retainers", href: "/consulting-retainers" },
      { label: "Crisis Communication Advising", href: "/crisis-communication-advising" },
      { label: "Training Programs & Workshops", href: "/training-program-and-workshops" },
    ],
  },
  {
    label: "Communication Resources",
    href: "#",
    children: [
      { label: "Publications", href: "/publications" },
      { label: "Substack Articles", href: "/substack-articles" },
      { label: "Blogspot", href: "https://tomdelapp.blogspot.com/", external: true },
    ],
  },
];
