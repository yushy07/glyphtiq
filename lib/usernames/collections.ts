import { THEME_LIST } from "./themes";
import type { UsernameThemeKey } from "./types";

export interface UsernameCollection {
  slug: string;
  name: string;
  description: string;
  theme: UsernameThemeKey;
  recommendedPlatforms: string[];
}

export const USERNAME_COLLECTIONS: UsernameCollection[] = [
  { slug: "best-discord", name: "Best Discord Usernames", description: "Top aesthetic, funny, and cool Discord tags and nicknames.", theme: "minimal", recommendedPlatforms: ["discord"] },
  { slug: "best-valorant", name: "Best Valorant Names", description: "Tactical, stealth, and pro Valorant player handles.", theme: "ninja", recommendedPlatforms: ["valorant"] },
  { slug: "anime-pack", name: "Anime Username Pack", description: "Kawaii, otaku, and Japanese anime character usernames.", theme: "anime", recommendedPlatforms: ["discord", "tiktok", "instagram"] },
  { slug: "luxury-pack", name: "Luxury Username Pack", description: "Prestige, royal, and high-class brandable handles.", theme: "luxury", recommendedPlatforms: ["instagram", "x", "threads"] },
  { slug: "minimal-pack", name: "Minimal Usernames", description: "Clean, short 4-letter and single-word usernames.", theme: "minimal", recommendedPlatforms: ["instagram", "tiktok", "github"] },
  { slug: "cute-pack", name: "Cute & Kawaii Usernames", description: "Sweet, soft, and aesthetic username ideas.", theme: "cute", recommendedPlatforms: ["tiktok", "instagram", "roblox"] },
  { slug: "clan-names", name: "Gaming Clan Names", description: "Competitive Free Fire, PUBG, and Valorant clan tags.", theme: "warrior", recommendedPlatforms: ["freeFire", "pubg", "bgmi"] },
  { slug: "streamer-pack", name: "Streamer & TTV Names", description: "Brandable handles for Twitch and YouTube creators.", theme: "streamer", recommendedPlatforms: ["twitch", "youtube", "kick"] },
  { slug: "cyberpunk-pack", name: "Cyberpunk & Hacker Handles", description: "Futuristic, glitchy, and tech usernames.", theme: "cyberpunk", recommendedPlatforms: ["discord", "steam", "github"] },
  { slug: "gothic-dark", name: "Dark & Gothic Pack", description: "Shadowy, mysterious, and gothic text handles.", theme: "dark", recommendedPlatforms: ["discord", "x", "instagram"] },
];

// Generate dynamic thematic collections up to 150
for (let i = USERNAME_COLLECTIONS.length + 1; i <= 150; i++) {
  const themeObj = THEME_LIST[i % THEME_LIST.length];
  USERNAME_COLLECTIONS.push({
    slug: `${themeObj.key}-usernames-${i}`,
    name: `${themeObj.name} Usernames #${i}`,
    description: `Curated ${themeObj.name.toLowerCase()} username ideas for gaming and social media.`,
    theme: themeObj.key,
    recommendedPlatforms: ["instagram", "discord", "freeFire"],
  });
}

const collectionMap = new Map(USERNAME_COLLECTIONS.map((c) => [c.slug, c]));

export function getUsernameCollection(slug: string): UsernameCollection | undefined {
  return collectionMap.get(slug);
}
