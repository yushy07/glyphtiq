import { symbols } from "./generated";
import type { SymbolEntry, SymbolCategoryKey } from "./types";

export { symbols };

const bySlug = new Map(symbols.map((s) => [s.slug, s]));
const byChar = new Map(symbols.map((s) => [s.char, s]));
const byCodePoint = new Map(symbols.map((s) => [s.codePoint, s]));
const byCategory = new Map<SymbolCategoryKey, SymbolEntry[]>();
for (const s of symbols) {
  const list = byCategory.get(s.category) ?? [];
  list.push(s);
  byCategory.set(s.category, list);
}
const byBlock = new Map<string, SymbolEntry[]>();
for (const s of symbols) {
  const list = byBlock.get(s.block) ?? [];
  list.push(s);
  byBlock.set(s.block, list);
}

export function getSymbolBySlug(slug: string): SymbolEntry | undefined {
  return bySlug.get(slug);
}

export function getSymbolByChar(char: string): SymbolEntry | undefined {
  return byChar.get(char);
}

export function getSymbolByCodePoint(codePoint: string): SymbolEntry | undefined {
  return byCodePoint.get(codePoint.toUpperCase());
}

export function getSymbolsByCategory(category: SymbolCategoryKey): SymbolEntry[] {
  return byCategory.get(category) ?? [];
}

export function getSymbolsByBlock(block: string): SymbolEntry[] {
  return byBlock.get(block) ?? [];
}

export function getSymbolCount(): number {
  return symbols.length;
}

/** Highest-popularity symbols, used for trending fallbacks and landing grids. */
export function getTopSymbols(limit = 24): SymbolEntry[] {
  return [...symbols]
    .sort((a, b) => b.popularity - a.popularity || a.codePoint.localeCompare(b.codePoint))
    .slice(0, limit);
}
