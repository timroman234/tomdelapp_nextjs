// src/content/resume.ts
import type { InteriorPageContent } from "./types";

export const resumeContent: InteriorPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Professional Resume",
    subheading: "Thomas K. DeLapp, APR — Chairman & Founder",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "In California, if a situation in a school district is controversial, complex, or critical the one person most superintendents call is Tom DeLapp. Since 1996 when he founded his firm, Tom has served as communications counsel for over 500 school districts in California. He has conducted over 1,000 workshops across the country, training nearly 250,000 educators on effective communications, community engagement, and media relations.",
  sections: [
    {
      paragraphs: [
        "A veteran of the communications industry with over 50 years of experience in both the public and private sectors, Tom DeLapp draws on a wealth of expertise and a national reputation as one of the premier school public relations professionals in the country. Mr. DeLapp is a highly sought after keynote speaker and workshop presenter on communication and education trends.",
        "Tom has helped school districts successfully communicate through sex scandals, budget cuts, teacher strikes, collective bargaining impasse situations, numerous campus shootings, bond campaigns, school closures, employee misconduct, health scares, marketing/branding concerns, student deaths, and curriculum battles. He has conducted communication audits and developed communication plans for over 50 school districts. Tom successfully dealt with controversial situations involving transgender students and teachers, including national media attention over the election of a transgender homecoming queen.",
      ],
    },
  ],
  ctas: {
    primary: { label: "Request a training session", href: "/training-program-and-workshops" },
    secondary: { label: "Listen to the podcast", href: "/podcast-library" },
  },
  signOff: "– When Communication Counts –",
  subscribeBand: {
    heading: "Don't miss our weekly podcast",
    body: "Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face.",
    showEmailForm: false,
  },
};
