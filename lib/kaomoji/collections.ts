import { kaomojis } from "./generated";
import type { KaomojiEntry } from "./types";

export interface KaomojiCollection {
  slug: string;
  name: string;
  description: string;
  match: (k: KaomojiEntry) => boolean;
}

const hasTerms = (k: KaomojiEntry, terms: string[]) => {
  const hay = `${k.name} ${k.tags.join(" ")} ${k.keywords.join(" ")}`.toLowerCase();
  return terms.some((t) => hay.includes(t));
};

export const KAOMOJI_COLLECTIONS: KaomojiCollection[] = [
  { slug: "cute-instagram", name: "Cute Instagram", description: "Soft, kawaii kaomojis for aesthetic Instagram bios and captions.", match: (k) => hasTerms(k, ["cute", "love", "flower", "sparkle"]) },
  { slug: "anime-lovers", name: "Anime Lovers", description: "Kawaii, neko, and otaku Japanese text expressions.", match: (k) => k.category === "kawaii" || k.category === "catGirls" || hasTerms(k, ["anime", "neko", "chibi"]) },
  { slug: "gaming-chat", name: "Gaming Chat", description: "Rage, GG, clutch, victory, and defeat reactions for Discord & game chat.", match: (k) => k.category === "victory" || k.category === "rage" || k.category === "gg" },
  { slug: "discord-essentials", name: "Discord Essentials", description: "Shrugs, table flips, facepalms, and high-frequency Discord reactions.", match: (k) => k.category === "shrug" || k.category === "tableFlip" || k.category === "facepalm" },
  { slug: "streamer-pack", name: "Streamer Pack", description: "Twitch and Kick chat reactions for live streams.", match: (k) => hasTerms(k, ["hype", "shocked", "laughing", "gg"]) },
  { slug: "daily-reactions", name: "Daily Reactions", description: "Happy, sad, confused, and thinking everyday kaomojis.", match: (k) => k.category === "happy" || k.category === "thinking" || k.category === "confused" },
  { slug: "romantic", name: "Romantic & Love", description: "Heart eyes, kisses, and love emoticons for couples and crushes.", match: (k) => k.category === "love" || k.category === "kiss" || k.category === "couples" },
  { slug: "dark-aesthetic", name: "Dark Aesthetic", description: "Gothic, deadpan, and dark mood kaomojis.", match: (k) => hasTerms(k, ["dark", "dead", "goth", "angry", "sad"]) },
  { slug: "minimal", name: "Minimal Kaomojis", description: "Clean, short, and simple 3-character text faces.", match: (k) => k.expression.length <= 7 },
  { slug: "funny-replies", name: "Funny Replies", description: "Giggling, hilarious, and meme text reactions.", match: (k) => k.category === "laughing" || hasTerms(k, ["lol", "funny", "meme"]) },
];

// Generate dynamic thematic kaomoji collections up to 200
const themes = [
  "Meme Pack", "Study Mood", "Late Night", "Morning Vibes", "Chill Out", "Coffee Time",
  "Cat Lover", "Doggo", "Bunny Pack", "Bear Hugs", "Shy Boy", "Senpai Notice Me",
  "Victory Royale", "Tilt & Salty", "AFK Life", "Noob Reaction", "Flex & Flexing",
  "Sad Hours", "Cry Me A River", "Dead Inside", "Tired AF", "Sleepless",
  "Angry Venting", "Rage Quit", "Sassy Reply", "Judging You", "Staring Eye",
  "Mind Blown", "Facepalm Moment", "Table Flip War", "Fixing Table", "Confused Math",
  "Secret Crush", "Holding Hands", "Double Hug", "Blow A Kiss", "Heartbroken",
  "Halloween Ghost", "Xmas Santa", "New Year Hype", "Summer Vibe", "Winter Chill"
];

for (let i = KAOMOJI_COLLECTIONS.length + 1; i <= 200; i++) {
  const theme = themes[i % themes.length];
  const slug = `theme-${theme.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`;
  KAOMOJI_COLLECTIONS.push({
    slug,
    name: `${theme} #${i}`,
    description: `Curated ${theme.toLowerCase()} kaomoji collection for messaging and social media.`,
    match: (k) => hasTerms(k, [theme.split(" ")[0].toLowerCase()]) || k.popularity > 40,
  });
}

const collectionBySlug = new Map(KAOMOJI_COLLECTIONS.map((c) => [c.slug, c]));

export function getKaomojiCollection(slug: string): KaomojiCollection | undefined {
  return collectionBySlug.get(slug);
}

export function kaomojisInCollection(collection: KaomojiCollection): KaomojiEntry[] {
  return kaomojis.filter(collection.match);
}
