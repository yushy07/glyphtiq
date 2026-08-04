import { kaomojis } from "./generated";
import type { KaomojiCategoryKey, KaomojiEntry } from "./types";

export { kaomojis };

export function getKaomojiCount(): number {
  return kaomojis.length;
}

export function getKaomojiBySlug(slug: string): KaomojiEntry | undefined {
  return kaomojis.find((k) => k.slug === slug);
}

export function getKaomojisByCategory(category: KaomojiCategoryKey): KaomojiEntry[] {
  return kaomojis.filter((k) => k.category === category);
}

export function getTopKaomojis(limit = 24): KaomojiEntry[] {
  return kaomojis
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}
