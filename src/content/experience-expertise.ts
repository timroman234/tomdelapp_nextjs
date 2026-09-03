// src/content/experience-expertise.ts
import type { InteriorPageContent } from "./types";

export const experienceExpertiseContent: InteriorPageContent = {
  banner: {
    eyebrow: "About us",
    heading: "Experience & Expertise",
    subheading: "Professional Experience, Expertise, & Excellence",
  },
  rail: {
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Communication Resources",
  },
  lede: "Executive Director for Membership/Communications, Association of California School Administrators.",
  sections: [
    {
      paragraphs: [
        "During his tenure with ACSA, Tom worked in all of California's 58 counties and met with every one of ACSA's 200+ local charters and regions. He traveled over 500,000 miles within California meeting with school district leaders, local association chapters, and educational organizations.",
        "Founding partner of Pacific Communications Group, a public affairs communication and publishing firm in Sacramento.",
        "His company served clients in the public and private sectors, including state agencies, trade and professional associations, lobbyists, businesses, and the California Legislature.",
        "Mr. DeLapp is a product of the public schools in Los Angeles, graduating from Westchester High School in 1969. He received his undergraduate degree in 1973 in American History from the University of California, Irvine, where he served as student body president and chairman of the statewide UC Student Body Presidents Council. Mr. DeLapp received the \"Lauds & Laurels\" Outstanding Senior Award from UC Irvine Alumni Association in 1973.",
        "He is a former director of the University of California Student Lobby (1973-75). Tom later served as General Manager of California Research (a capital-based consulting firm).",
      ],
    },
    {
      heading: "A Family of Educators",
      paragraphs: [
        "Tom married his high school sweetheart Jan, who was a professor of early childhood education and Dean of Health and Education at American River College in Sacramento. As a state-level consultant, Jan has been an instrumental leader in integrating standardized competencies into a fully aligned ECE curriculum for the California Community Colleges and CSU systems. Tom and Jan have been married for 54 years.",
        "Their daughter Kathryn is a graduate of the Hartt School of Performing Arts at the University of Hartford in Connecticut and received her master's degree in Theater Education from CCNY in 2013. She is a high school drama teacher at West Park High School in the Roseville Joint Union High School District.",
        "Their son Kevin earned his undergraduate degree from the University of California, Santa Cruz and was awarded his PhD from Duke University in 2006. He is now a tenured Professor of Philosophy at Converse University in Spartanburg, South Carolina.",
      ],
    },
    {
      heading: "Awards, Honors and Recognitions",
      paragraphs: [
        "In 2004, Tom DeLapp was recognized as Outstanding Communicator of the Year by CalSPRA. In 2006, he was awarded NSPRA's Barry Gaskins Legacy Mentor Award recognizing his many contributions to and support for his school public relations colleagues. In 2013, he was the recipient of the President's Award, NSPRA's most prestigious recognition for lifetime contributions to the school public relations profession.",
        "Tom served as President of NSPRA from 2017 to 2018.",
        "Tom is the 2016 recipient of the Ferd. Kiesel Distinguished Service Award, the highest honor bestowed by the Association of California School Administrators, for exceptional contributions to public education in California.",
      ],
    },
  ],
  ctas: {
    primary: { label: "Read the full speaker's introduction", href: "/introduction" },
    secondary: { label: "Listen to the podcast", href: "/podcast-library" },
  },
  signOff: "– When Communication Counts –",
  subscribeBand: {
    heading: "Don't miss our weekly podcast",
    body: "Straight Talk by Tom DeLapp — a weekly conversation on the communication decisions school leaders actually face.",
    showEmailForm: false,
  },
};
