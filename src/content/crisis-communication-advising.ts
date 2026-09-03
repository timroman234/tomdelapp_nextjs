// src/content/crisis-communication-advising.ts
import type { InteriorPageContent } from "./types";

export const crisisCommunicationAdvisingContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Crisis Communication Advising",
    subheading: "When the Stakes Are Highest",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "The Chinese symbol for crisis is a combination of the symbols for \"danger\" and \"crucial point.\" In a critical incident or a controversial situation, your schools have a chance to fail or succeed in the public eye. In a crisis, how you communicate may be just as critical as how you manage the crisis.",
  sections: [
    {
      paragraphs: [
        "Tom DeLapp is a seasoned veteran who's handled communication on the front line of virtually every type of school emergency, controversy, and critical situation facing public schools. He was on the team handling the communication response in the Columbine High School shooting tragedy. He's faced the cameras during dozens of teacher strikes. He led the Butte County Office of Education incident command post during the devastating CAMP wildfire that destroyed the town of Paradise in Northern California. He's kept dozens of controversial personnel situations from hitting the six o'clock news.",
      ],
    },
    {
      checklistCard: {
        heading: "As your communications advisor in a critical incident, Tom DeLapp can help your schools —",
        items: [
          "Develop emergency plans with specific job descriptions for each team member and action steps each must take during the first few hours of an emergency or incident",
          "Manage internal and external communications during critical incidents such as personnel actions, campus safety situations, natural disasters and accidents, and controversial district actions/decisions",
          "Prepare FAQ sheets, news releases, bulletins and talking points to orient staff and leaders on what they can and can't say",
          "Serve as spokesperson/handle media relations in high profile situations",
          "Train staff in response techniques",
        ],
      },
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
