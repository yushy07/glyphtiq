import { symbols } from "./generated";
import type { SymbolEntry } from "./types";

export function searchSymbols(
  query: string,
  source: SymbolEntry[] = symbols,
  limit = 100,
): SymbolEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{ entry: SymbolEntry; score: number }> = [];

  for (const entry of source) {
    let score = 0;
    const nameLower = entry.name.toLowerCase();
    const char = entry.char;

    // 1. Character exact match (100)
    if (char === q) {
      score = Math.max(score, 100);
    }

    // 2. Codepoint & Entity matches (75 - 90)
    if (entry.codePoint.toLowerCase() === q.replace(/^u\+/i, "").toLowerCase()) {
      score = Math.max(score, 90);
    }
    if (entry.htmlEntityHex?.toLowerCase() === q || entry.htmlEntityDec === q) {
      score = Math.max(score, 85);
    }

    // 3. Name match (90)
    if (nameLower === q) score = Math.max(score, 90);
    else if (nameLower.startsWith(q)) score = Math.max(score, 85);
    else if (nameLower.includes(q)) score = Math.max(score, 75);

    // 4. Synonyms & Alt Names match (80)
    for (const syn of entry.synonyms ?? []) {
      if (syn.toLowerCase().includes(q)) score = Math.max(score, 80);
    }
    for (const alt of entry.altNames ?? []) {
      if (alt.toLowerCase().includes(q)) score = Math.max(score, 78);
    }

    // 5. Tags match (70)
    for (const tag of entry.tags ?? []) {
      if (tag.toLowerCase().includes(q)) score = Math.max(score, 70);
    }

    // 6. Keywords match (65)
    for (const kw of entry.keywords) {
      if (kw.toLowerCase().includes(q)) score = Math.max(score, 65);
    }

    // 7. Category & Block match (50)
    if (entry.category.toLowerCase().includes(q) || entry.block.toLowerCase().includes(q)) {
      score = Math.max(score, 50);
    }

    if (score > 0) {
      const weightBoost = entry.searchWeight ?? 0;
      results.push({ entry, score: score + entry.popularity * 0.1 + weightBoost });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
