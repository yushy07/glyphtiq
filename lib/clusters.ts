import { APP_CONFIGS } from "@/lib/text-engine/apps";
import { SYMBOL_COLLECTIONS } from "@/lib/symbols/collections";
import { KAOMOJI_CATEGORY_LIST } from "@/lib/kaomoji/categories";
import { THEME_LIST } from "@/lib/usernames/themes";

export interface ClusterLink {
  title: string;
  description: string;
  href: string;
  category: "Gaming" | "Social" | "Unicode" | "Kaomoji" | "Usernames";
  badge?: string;
}

export const TOPIC_CLUSTERS: Record<string, ClusterLink[]> = {
  gaming: [
    {
      title: "Free Fire Name Generator",
      description: "Stylish FF nicknames with Japanese symbols (ツ, 乂, 〆).",
      href: "/free-fire-name-generator",
      category: "Gaming",
      badge: "Popular",
    },
    {
      title: "Valorant Name Generator",
      description: "Tactical & pro Riot IGN player handles.",
      href: "/valorant-name-generator",
      category: "Gaming",
    },
    {
      title: "Discord Name Generator",
      description: "Aesthetic, cool, and funny Discord usernames.",
      href: "/discord-name-generator",
      category: "Gaming",
    },
    {
      title: "PUBG Name Generator",
      description: "Bold & military squad tags with symbols.",
      href: "/pubg-fonts",
      category: "Gaming",
    },
    {
      title: "Roblox Fonts Generator",
      description: "Clean & bypass-safe fonts for Roblox bios.",
      href: "/roblox-fonts",
      category: "Gaming",
    },
    {
      title: "Gaming Symbol Pack",
      description: "Crosshairs, weapons, crowns, and shields.",
      href: "/collections/gaming-pack",
      category: "Unicode",
    },
  ],
  social: [
    {
      title: "Instagram Fonts Generator",
      description: "Fancy text fonts for bio, captions, and comments.",
      href: "/instagram-fonts",
      category: "Social",
      badge: "Trending",
    },
    {
      title: "TikTok Fonts Generator",
      description: "Cool fonts for username and video captions.",
      href: "/tiktok-fonts",
      category: "Social",
    },
    {
      title: "X / Twitter Fonts",
      description: "Bold, italic & cursive unicode text for posts.",
      href: "/x-fonts",
      category: "Social",
    },
    {
      title: "Instagram Essentials Symbols",
      description: "Sparkles, stars, hearts, and aesthetic dividers.",
      href: "/collections/instagram-essentials",
      category: "Unicode",
    },
    {
      title: "Aesthetic Usernames",
      description: "Minimalist & cute username templates.",
      href: "/usernames/aesthetic",
      category: "Usernames",
    },
  ],
  unicode: [
    {
      title: "Fancy Text Generator",
      description: "Full unicode text changer with 100+ styles.",
      href: "/",
      category: "Unicode",
    },
    {
      title: "Copy & Paste Symbols",
      description: "2,000+ unicode symbols, hearts, arrows & stars.",
      href: "/symbols",
      category: "Unicode",
    },
    {
      title: "Heart Symbols Collection",
      description: "Black hearts, white hearts, sparkling hearts.",
      href: "/collections/hearts",
      category: "Unicode",
    },
    {
      title: "Star Symbols Collection",
      description: "Aesthetic stars, shooting stars, and sparkles.",
      href: "/collections/stars",
      category: "Unicode",
    },
    {
      title: "All Fonts Hub",
      description: "Explore 20+ dedicated platform generators.",
      href: "/fonts",
      category: "Unicode",
    },
  ],
  kaomoji: [
    {
      title: "Japanese Kaomoji Hub",
      description: "2,000+ cute text faces and emoticons.",
      href: "/kaomoji",
      category: "Kaomoji",
    },
    {
      title: "Happy Kaomoji",
      description: "Joyful, smiling & excited text faces.",
      href: "/kaomojis/happy",
      category: "Kaomoji",
    },
    {
      title: "Shrug Kaomoji",
      description: "Classic shrug ¯\\_(ツ)_/¯ and neutral faces.",
      href: "/kaomoji/classic-shrug",
      category: "Kaomoji",
    },
    {
      title: "Cute & Neko Kaomoji",
      description: "Anime cat faces, bears, and adorable emoticons.",
      href: "/kaomojis/cute",
      category: "Kaomoji",
    },
  ],
};

export function getRelatedLinksForPath(currentPath: string, limit = 6): ClusterLink[] {
  const normalized = currentPath.toLowerCase();

  if (
    normalized.includes("gaming") ||
    normalized.includes("free-fire") ||
    normalized.includes("valorant") ||
    normalized.includes("pubg") ||
    normalized.includes("roblox") ||
    normalized.includes("discord")
  ) {
    return [...TOPIC_CLUSTERS.gaming, ...TOPIC_CLUSTERS.unicode]
      .filter((item) => item.href !== currentPath)
      .slice(0, limit);
  }

  if (
    normalized.includes("instagram") ||
    normalized.includes("tiktok") ||
    normalized.includes("social") ||
    normalized.includes("x-fonts") ||
    normalized.includes("usernames")
  ) {
    return [...TOPIC_CLUSTERS.social, ...TOPIC_CLUSTERS.kaomoji]
      .filter((item) => item.href !== currentPath)
      .slice(0, limit);
  }

  if (normalized.includes("kaomoji")) {
    return [...TOPIC_CLUSTERS.kaomoji, ...TOPIC_CLUSTERS.social]
      .filter((item) => item.href !== currentPath)
      .slice(0, limit);
  }

  return [...TOPIC_CLUSTERS.unicode, ...TOPIC_CLUSTERS.social, ...TOPIC_CLUSTERS.gaming]
    .filter((item) => item.href !== currentPath)
    .slice(0, limit);
}
