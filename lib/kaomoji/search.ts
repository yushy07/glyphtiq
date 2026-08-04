import { kaomojis } from "./generated";
import type { KaomojiEntry } from "./types";

export function searchKaomojis(query: string, source: KaomojiEntry[] = kaomojis, limit = 100): KaomojiEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{ entry: KaomojiEntry; score: number }> = [];

  for (const entry of source) {
    let score = 0;
    const nameLower = entry.name.toLowerCase();
    const emotionLower = entry.emotion.toLowerCase();

    if (nameLower === q || entry.expression === q) score += 100;
    else if (nameLower.startsWith(q)) score += 80;
    else if (nameLower.includes(q)) score += 60;
    else if (emotionLower.includes(q)) score += 50;

    for (const tag of entry.tags) {
      if (tag.toLowerCase().includes(q)) score += 30;
    }

    for (const kw of entry.keywords) {
      if (kw.toLowerCase().includes(q)) score += 20;
    }

    if (score > 0) {
      results.push({ entry, score: score + entry.popularity * 0.1 });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
