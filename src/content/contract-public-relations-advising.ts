// src/content/contract-public-relations-advising.ts
import type { InteriorPageContent } from "./types";

export const contractPublicRelationsAdvisingContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Contract Public Relations Advising",
    subheading: "On-Call Communications Counsel",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "In tough fiscal times, your district may not be staffed to provide communications, community relations, or public relations services to top management. As your on-call communications counsel, we can tailor a package of services that precisely fits your needs. Through e-mail, Zoom, and phone, we can deliver timely written materials, strategy pieces, and other services as if we were in your office! Retainer and hourly fee arrangements are available to clients.",
  sections: [
    {
      checklistCard: {
        heading: "We can help you —",
        items: [
          "Write print and electronic materials on issues or programs",
          "Write opinion columns and news releases for district leaders",
          "Draft parent letters on key topics or during critical incidents",
          "Prepare internal communications, staff newsletters articles, and bulletins",
          "Coordinate key communicator networks and prepare electronic and print public awareness materials",
          "Prepare fact sheets, talking points, and FAQ sheets (Frequently Asked Questions) on key programs, policies and issues",
          "Script, shoot and produce informational and employee recruiting videos",
        ],
      },
    },
  ],
  closingParagraph: "To discuss your communication needs call or text Tom DeLapp at (916) 765-1759.",
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
