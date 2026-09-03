// src/content/introduction.ts
export const introductionContent = {
  banner: {
    eyebrow: "About us",
    heading: "Speaker's Introduction",
    subheading: "Proven Techniques to Level the News Playing Field",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "Educators tend to view the news media as either a bothersome intrusion or an outright obstacle in their work. Most people in your community make up their minds about public schools by what they read in newspapers, scroll on Internet newsfeeds, or hear on TV or radio.",
  secondParagraph:
    "Since only about 20% of the adults in your community are parents of school-aged children, they often make decisions about education based on stereotypes or misinformation perpetuated in the press or by critics on social media.",
  checklistCard: {
    heading: "Tom DeLapp can help your leaders —",
    items: [
      "Understand today's polarized news media environment",
      "Profile the average education reporter and know how stories go together",
      "Decide what makes news and how to be proactive and reactive with success",
      "Diagnose the interview process",
      "Understand how podcasts and social media have changed reporting",
      "Watch out for “question quicksand”",
      "Shape quotes that are memorable and newsworthy",
      "Handle media access/interview requests, and know your rights & theirs",
      "Employ strategies for handling common situations in schools that attract the media",
      "Handle media relations in a crisis or emergency",
      "Create a media relations strategy and plan",
    ],
  },
  closingParagraph:
    "Tom can arrange hands-on sessions that involve spokesperson training for on-camera interviews where staff can respond to actual scenarios based on real situations in public schools.",
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
} as const;
