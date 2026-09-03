// src/content/home.ts
export const homeContent = {
  hero: {
    eyebrow: "A podcast for school leaders",
    heading: "When communication really counts",
    tagline: "Count on us.",
    body: "Straight Talk is a weekly conversation with Tom DeLapp on the communication decisions superintendents and district cabinets actually face — media, crisis, community trust, and the culture inside your own organization.",
    primaryCta: { label: "Subscribe free", href: "/#subscribe" },
    secondaryCta: { label: "Play the latest episode", href: "#latest" },
    listenLabel: "Listen on",
    onAirLabel: "ON AIR · WEEKLY",
    captionTitle: "Straight Talk",
    captionSubtitle: "Hosted by Tom DeLapp",
    imageSrc: "/images/hero-studio.jpg",
    imageAlt: "Tom DeLapp recording Straight Talk in the studio",
  },
  latestEpisode: {
    eyebrow: "Latest episode",
    allEpisodesHref: "/podcast-library",
    allEpisodesLabel: "All episodes →",
    meta: "Episode 01 · Placeholder date · 32 min",
    title: "Episode title goes here",
    summary:
      "One or two sentences of episode summary — the question this episode answers and why it matters to a cabinet. Replace with real copy once the first episodes are recorded.",
    playerDisclaimer:
      "player placeholder — swap for the host's embed once the platform is chosen",
    timecode: "00:00 / 32:10",
  },
  aboutHost: {
    eyebrow: "About the host",
    pullQuote: "A culture of communication, built one decision at a time.",
    paragraphs: [
      "The principal objectives of the firm are to cultivate a communicating culture in schools, enhance the communications capacity of school leaders, build stronger community ties to education, and develop sustainable public relations/communications programs for school districts. When effective communication really counts, you can count on us!",
      "Educators tend to view the news media as either a bothersome intrusion or an outright obstacle in their work. Most people in your community make up their minds about public schools by what they read in newspapers, scroll on Internet newsfeeds, or hear on TV or radio. Since only about 20% of the adults in your community are parents of school-aged children, they often make decisions about education based on stereotypes or misinformation perpetuated in the press or by critics on social media.",
    ],
    checklistLabel: "What the show helps your leaders do",
    checklist: [
      "Understand today's polarized news media environment",
      "Decide what makes news and how to be proactive",
      "Diagnose the interview process",
      "Shape quotes that are memorable and newsworthy",
      "Handle media relations in a crisis or emergency",
      "Create a media relations strategy and plan",
    ],
    readMoreHref: "/introduction",
    readMoreLabel: "Read the full speaker's introduction →",
    headshotSrc: "/images/tom-delapp.jpg",
    headshotAlt: "Tom DeLapp",
    name: "Tom DeLapp",
    role: "Host, Straight Talk",
  },
  subscribeBand: {
    heading: "Don't miss the weekly episode",
    body: "Follow on your app of choice, or get each new episode in your inbox with a short note on what's in it.",
    showEmailForm: true,
  },
} as const;
