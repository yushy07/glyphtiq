import type { SymbolEntry } from "./types";

export interface SymbolOverlay {
  hex: string;
  tags?: string[];
  searchWeight?: number;
  featured?: boolean;
  synonyms?: string[];
  altNames?: string[];
}

export const SYMBOL_OVERLAYS: Record<string, SymbolOverlay> = {
  "2764": {
    hex: "2764",
    tags: ["love", "heart", "favorite", "like", "romance", "black heart", "popular"],
    searchWeight: 100,
    featured: true,
    synonyms: ["heart", "love", "black heart", "like"],
    altNames: ["Heavy Black Heart", "Love Heart"],
  },
  "2605": {
    hex: "2605",
    tags: ["star", "rating", "favorite", "black star", "filled star", "popular"],
    searchWeight: 100,
    featured: true,
    synonyms: ["star", "rating", "black star", "favorite"],
    altNames: ["Black Star", "Solid Star"],
  },
  "2192": {
    hex: "2192",
    tags: ["arrow", "right arrow", "pointer", "direction", "popular"],
    searchWeight: 95,
    featured: true,
    synonyms: ["right arrow", "next", "forward"],
    altNames: ["Rightwards Arrow"],
  },
  "2728": {
    hex: "2728",
    tags: ["sparkle", "magic", "shiny", "glitter", "stars", "aesthetic"],
    searchWeight: 98,
    featured: true,
    synonyms: ["sparkle", "glitter", "magic"],
    altNames: ["Sparkles"],
  },
  "20B9": {
    hex: "20B9",
    tags: ["currency", "rupee", "money", "india", "inr"],
    searchWeight: 90,
    featured: true,
    synonyms: ["rupee", "inr", "indian rupee"],
    altNames: ["Indian Rupee Sign"],
  },
};

export function applyOverlay(entry: SymbolEntry): SymbolEntry {
  const overlay = SYMBOL_OVERLAYS[entry.codePoint];
  if (!overlay) return entry;

  return {
    ...entry,
    tags: Array.from(new Set([...entry.tags, ...(overlay.tags ?? [])])),
    searchWeight: overlay.searchWeight ?? entry.searchWeight,
    featured: overlay.featured ?? entry.featured,
    synonyms: Array.from(new Set([...(entry.synonyms ?? []), ...(overlay.synonyms ?? [])])),
    altNames: Array.from(new Set([...(entry.altNames ?? []), ...(overlay.altNames ?? [])])),
  };
}
