import { kaomojis } from "./generated";
import type { KaomojiEntry } from "./types";

export function getRelatedKaomojis(item: KaomojiEntry, limit = 12): KaomojiEntry[] {
  const result: KaomojiEntry[] = [];
  const seen = new Set<string>([item.id]);

  // 1. Same category
  const sameCat = kaomojis.filter((k) => k.category === item.category && !seen.has(k.id));
  for (const match of sameCat) {
    seen.add(match.id);
    result.push(match);
    if (result.length >= limit) return result;
  }

  // 2. Keyword/tag overlap
  const tags = new Set(item.tags);
  for (const k of kaomojis) {
    if (!seen.has(k.id) && k.tags.some((t) => tags.has(t))) {
      seen.add(k.id);
      result.push(k);
      if (result.length >= limit) return result;
    }
  }

  return result;
}
