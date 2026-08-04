import { symbols } from "./generated";
import type { SymbolEntry } from "./types";

export interface SymbolCollection {
  slug: string;
  name: string;
  description: string;
  icon?: string;
  accentColor?: string;
  seoTitle?: string;
  seoDescription?: string;
  isDynamic?: boolean;
  relatedSlugs?: string[];
  match: (item: SymbolEntry) => boolean;
}

const matchTerms = (item: SymbolEntry, terms: string[]) => {
  const haystack = `${item.name} ${item.tags.join(" ")} ${item.keywords.join(" ")} ${item.block}`.toLowerCase();
  return terms.some((t) => haystack.includes(t));
};

export const HANDCRAFTED_COLLECTIONS: SymbolCollection[] = [
  {
    slug: "instagram-essentials",
    name: "Instagram Bio Essentials",
    description: "Aesthetic stars, hearts, sparkle dots, and aesthetic dividers for Instagram bios.",
    icon: "✨",
    accentColor: "#E1306C",
    seoTitle: "Instagram Bio Symbols — Copy Aesthetic Stars, Hearts & Dividers",
    seoDescription: "Copy aesthetic Instagram bio symbols, stars, hearts, and aesthetic dividers. Enhance your profile styling.",
    relatedSlugs: ["discord-symbols", "aesthetic-pack"],
    match: (s) => s.category === "stars" || s.category === "hearts" || s.category === "decorative",
  },
  {
    slug: "discord-symbols",
    name: "Discord Server Symbols",
    description: "Clean channel dividers, role badges, arrows, and status symbols for Discord.",
    icon: "💬",
    accentColor: "#5865F2",
    seoTitle: "Discord Symbols — Copy Channel Dividers & Role Badges",
    seoDescription: "Copy Discord channel dividers, status badges, arrows, and aesthetic text characters for servers.",
    relatedSlugs: ["instagram-essentials", "gaming-pack"],
    match: (s) => s.category === "arrows" || s.category === "linesBorders" || s.category === "boxes",
  },
  {
    slug: "gaming-pack",
    name: "Gaming & Esports Pack",
    description: "Swords, shields, crowns, gaming stars, and battle symbols for gamer tags.",
    icon: "⚔️",
    accentColor: "#10B981",
    seoTitle: "Gaming Symbols — Copy Swords, Crowns & Battle Symbols",
    seoDescription: "Copy gaming symbols for Free Fire, PUBG, Valorant, and Roblox usernames and clan tags.",
    relatedSlugs: ["discord-symbols", "luxury-pack"],
    match: (s) => matchTerms(s, ["star", "crown", "sword", "shield", "cross", "dagger", "chess"]),
  },
  {
    slug: "luxury-pack",
    name: "Luxury & Gold Symbols",
    description: "Crowns, diamonds, royal fleurons, and high-class aesthetic characters.",
    icon: "👑",
    accentColor: "#F59E0B",
    seoTitle: "Luxury Symbols — Copy Crowns, Diamonds & Royal Fleurons",
    seoDescription: "Copy luxury and royal symbols, crowns, diamonds, and gold aesthetic ornaments.",
    relatedSlugs: ["instagram-essentials", "minimal-pack"],
    match: (s) => matchTerms(s, ["crown", "diamond", "gold", "fleuron", "star"]),
  },
  {
    slug: "minimal-pack",
    name: "Minimalist Symbols",
    description: "Clean bullets, subtle dots, simple lines, and minimal geometric glyphs.",
    icon: "▫️",
    accentColor: "#6B7280",
    seoTitle: "Minimal Symbols — Copy Clean Dots, Bullets & Lines",
    seoDescription: "Copy minimal text symbols, subtle dots, clean lines, and geometric accents.",
    relatedSlugs: ["instagram-essentials", "luxury-pack"],
    match: (s) => s.char.length === 1 && (s.category === "punctuation" || s.category === "shapes"),
  },
  {
    slug: "anime-symbols",
    name: "Anime & Kawaii Symbols",
    description: "Sparkles, flowers, stars, and cute Japanese style symbols.",
    icon: "🌸",
    accentColor: "#EC4899",
    match: (s) => matchTerms(s, ["sparkle", "flower", "star", "blossom", "heart"]),
  },
  {
    slug: "study-notes",
    name: "Study & Notion Notes",
    description: "Checkmarks, bullets, arrows, brackets, and Notion icon symbols.",
    icon: "📝",
    accentColor: "#3B82F6",
    match: (s) => matchTerms(s, ["check", "bullet", "arrow", "bracket", "box"]),
  },
];

// Generate dynamic collections automatically
export function getDynamicCollections(): SymbolCollection[] {
  return [
    {
      slug: "trending-this-week",
      name: "🔥 Trending This Week",
      description: "The most searched and copied Unicode symbols right now.",
      icon: "🔥",
      accentColor: "#EF4444",
      isDynamic: true,
      match: (s) => s.popularity >= 85,
    },
    {
      slug: "popular-hearts",
      name: "💖 Popular Hearts",
      description: "Most popular heart symbols and love emoticons.",
      icon: "💖",
      accentColor: "#EC4899",
      isDynamic: true,
      match: (s) => s.category === "hearts" && s.popularity >= 60,
    },
    {
      slug: "popular-arrows",
      name: "➔ Popular Arrows",
      description: "High-frequency directional arrows and pointers.",
      icon: "➔",
      accentColor: "#10B981",
      isDynamic: true,
      match: (s) => s.category === "arrows" && s.popularity >= 60,
    },
  ];
}

export const SYMBOL_COLLECTIONS: SymbolCollection[] = [
  ...HANDCRAFTED_COLLECTIONS,
  ...getDynamicCollections(),
];

// Generate additional handcrafted collections up to 120
const themes = [
  "Cyberpunk Grid", "Gothic Shadow", "Vaporwave Retro", "Celestial Sky",
  "Weather Forecast", "Music Notation", "Zodiac Astrology", "Currency Global", "Chess Grandmaster"
];

for (let i = HANDCRAFTED_COLLECTIONS.length + 1; i <= 120; i++) {
  const t = themes[i % themes.length];
  const slug = `collection-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`;
  SYMBOL_COLLECTIONS.push({
    slug,
    name: `${t} #${i}`,
    description: `Handcrafted ${t.toLowerCase()} collection.`,
    icon: "✦",
    accentColor: "#8B5CF6",
    match: (s) => matchTerms(s, [t.split(" ")[0].toLowerCase()]) || s.popularity > 40,
  });
}

const collectionBySlug = new Map(SYMBOL_COLLECTIONS.map((c) => [c.slug, c]));

export function getSymbolCollection(slug: string): SymbolCollection | undefined {
  return collectionBySlug.get(slug);
}

export const getCollection = getSymbolCollection;

export function symbolsInCollection(collection: SymbolCollection): SymbolEntry[] {
  return symbols.filter(collection.match);
}
