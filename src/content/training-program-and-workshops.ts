// src/content/training-program-and-workshops.ts
import type { InteriorPageContent } from "./types";

export const trainingProgramAndWorkshopsContent: InteriorPageContent = {
  banner: {
    eyebrow: "Professional Services",
    heading: "Training Programs & Workshops",
    subheading: "Tom DeLapp Programs & Workshops",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "Tom DeLapp is recognized across the country as an exceptional presenter who combines first-rate content with a humorous, engaging style to make staff development programs for educators truly memorable. Since 1989, he has delivered over 1,000 workshops, speeches, seminars and training programs for over 250,000 educators in the United States and Canada. His command of public relations theory, combined with practical proven techniques, give workshop attendees tools they can use to improve communication or deal with challenging situations.",
  sections: [
    {
      checklistCard: {
        heading: "Topics he can cover for your organization include —",
        items: [
          "Crisis Communication & Emergency Response Planning",
          "Media Relations",
          "Time Management",
          "Communication Planning",
          "Reputation Management",
          "Marketing Your Schools",
          "Dealing with Controversies & Difficult People",
          "Customer Service",
          "Internal Employee Communication",
          "Targeting Your Message about Budgets, Performance & Accountability",
          "Speaking Up for Public Schools",
        ],
      },
    },
    {
      heading: "Keynote Speeches",
      paragraphs: [
        "Tom DeLapp is available to keynote your next convention, conference, symposium or seminar. He is a frequent presenter for education and business organizations. Doctoral and administrator credential programs at universities and colleges often call on Tom DeLapp to present the communication portion of their academic coursework. Themed keynote speeches include:",
      ],
      list: [
        "Split Second Leadership: Being Decisive When the Clock is Ticking",
        "Take a Hike! Lessons Learned Above 10,000' About Life, Leadership, and Legacy",
        "Resisting the Loudest Voice in the Room: Coping with the Tyranny of Minority Interests",
      ],
    },
  ],
  closingParagraph: "To arrange for Tom DeLapp to speak at your next event call (916) 765-1759.",
  ctas: {
    primary: { label: "Call or text (916) 765-1759", href: "tel:+19167651759" },
    secondary: { label: "Listen to the podcast", href: "/podcast-library" },
  },
  signOff: "– When Communication Counts –",
  subscribeBand: {
    heading: "Don't miss our weekly podcast",
    body: "Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face.",
    showEmailForm: false,
  },
};
