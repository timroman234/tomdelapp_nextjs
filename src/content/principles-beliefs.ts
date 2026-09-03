// src/content/principles-beliefs.ts
import type { InteriorPageContent } from "./types";

export const principlesBeliefsContent: InteriorPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Principles & Beliefs",
    subheading: "Our Vision",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "The principal objectives of the firm are to cultivate a communicating culture in schools, enhance the communications capacity of school leaders, build stronger community ties to education, and develop sustainable public relations/communications programs for school districts.",
  sections: [],
  closingParagraph: "When effective communication really counts, you can count on us!",
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
