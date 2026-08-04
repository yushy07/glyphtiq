import { symbols } from "./generated";
import type { SymbolEntry } from "./types";

export interface SimilarSymbolsBreakdown {
  looksSimilar: SymbolEntry[];
  usedTogether: SymbolEntry[];
  sameCategory: SymbolEntry[];
  popularAlternatives: SymbolEntry[];
}

export function getRelatedSymbolsBreakdown(item: SymbolEntry, limit = 6): SimilarSymbolsBreakdown {
  const seen = new Set<string>([item.slug]);

  // 1. Looks Similar (confusables / similarSlugs)
  const looksSimilar: SymbolEntry[] = [];
  for (const slug of item.similarSlugs ?? []) {
    const found = symbols.find((s) => s.slug === slug);
    if (found && !seen.has(found.slug)) {
      seen.add(found.slug);
      looksSimilar.push(found);
      if (looksSimilar.length >= limit) break;
    }
  }

  // 2. Used Together (shared tags)
  const usedTogether: SymbolEntry[] = [];
  const tagsSet = new Set(item.tags);
  for (const s of symbols) {
    if (!seen.has(s.slug) && s.tags.some((t) => tagsSet.has(t))) {
      seen.add(s.slug);
      usedTogether.push(s);
      if (usedTogether.length >= limit) break;
    }
  }

  // 3. Same Category
  const sameCategory: SymbolEntry[] = [];
  for (const s of symbols) {
    if (!seen.has(s.slug) && s.category === item.category) {
      seen.add(s.slug);
      sameCategory.push(s);
      if (sameCategory.length >= limit) break;
    }
  }

  // 4. Popular Alternatives
  const popularAlternatives = symbols
    .filter((s) => s.category === item.category && !seen.has(s.slug))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

  return {
    looksSimilar,
    usedTogether,
    sameCategory,
    popularAlternatives,
  };
}

export function getRelatedSymbols(item: SymbolEntry, limit = 12): SymbolEntry[] {
  const bd = getRelatedSymbolsBreakdown(item, limit);
  return [...bd.looksSimilar, ...bd.usedTogether, ...bd.sameCategory, ...bd.popularAlternatives].slice(0, limit);
}
