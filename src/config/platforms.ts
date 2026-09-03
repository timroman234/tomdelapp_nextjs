// src/config/platforms.ts
export type Platform = {
  key: string;
  name: string;
  note: string;
  url: string;
  enabled: boolean;
};

export const platforms: Platform[] = [
  { key: "buzzsprout", name: "Buzzsprout", note: "Show home", url: "#", enabled: true },
  { key: "spotify", name: "Spotify", note: "Follow", url: "#", enabled: true },
  { key: "apple", name: "Apple Podcasts", note: "Subscribe", url: "#", enabled: true },
  { key: "patreon", name: "Patreon", note: "Members", url: "#", enabled: false },
];

export const enabledPlatforms: Platform[] = platforms.filter((p) => p.enabled);
