import { kaomojis } from "./generated";
import type { KaomojiEntry } from "./types";

export function getRelatedKaomojis(item: KaomojiEntry, limit = 12): KaomojiEntry[] {
  const result: KaomojiEntry[] = [];
  const seen = new Set<string>([item.id]);

  // Prioritize curated indexable kaomojis first
  const curatedKaomojis = kaomojis.filter((k) => !k.slug.startsWith("kaomoji-"));

  // 1. Same category among curated
  for (const match of curatedKaomojis) {
    if (match.category === item.category && !seen.has(match.id)) {
      seen.add(match.id);
      result.push(match);
      if (result.length >= limit) return result;
    }
  }

  // 2. Keyword/tag overlap among curated
  const tags = new Set(item.tags);
  for (const match of curatedKaomojis) {
    if (!seen.has(match.id) && match.tags.some((t) => tags.has(t))) {
      seen.add(match.id);
      result.push(match);
      if (result.length >= limit) return result;
    }
  }

  // 3. Fallback to other curated items
  for (const match of curatedKaomojis) {
    if (!seen.has(match.id)) {
      seen.add(match.id);
      result.push(match);
      if (result.length >= limit) return result;
    }
  }

  return result;
}
