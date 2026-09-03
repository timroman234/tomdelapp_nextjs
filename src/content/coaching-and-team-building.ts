// src/content/coaching-and-team-building.ts
import type { InteriorPageContent } from "./types";

export const coachingAndTeamBuildingContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Coaching and Team Building",
    subheading: "Sharpening School Communication Skills",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "The key to leadership is communication. Most leaders fail or encounter problems in their jobs because of poor communication within their organizations. Whether you are a veteran or new to your position as a school trustee, superintendent, principal, administrator or organization leader, Communication Resources for Schools can help you cultivate your own communication skills. Tom DeLapp has worked with dozens of management teams, school boards and individuals to help them.",
  sections: [
    {
      checklistCard: {
        heading: "Tom DeLapp can help your team —",
        items: [
          "Set protocols and standards for interacting as a team",
          "Facilitate strategic planning and goal setting sessions",
          "Handle agenda management for meetings",
          "Analyze group dynamics",
          "Improve personal written communications",
          "Improve personal verbal and non-verbal communication skills",
          "Resolve conflict within groups",
          "Define communication/decision-making systems for new superintendents or principals",
          "Team building within school, department and district office staff",
        ],
      },
    },
  ],
  closingParagraph:
    "We can also help districts elevate the work of their school public relations function by examining job descriptions, assignments, training needs, and recruiting.",
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
