import { kaomojis } from "@/lib/kaomoji/data";
import { symbols } from "@/lib/symbols/data";
import { SYMBOL_CATEGORIES } from "@/lib/symbols/categories";
import { SYMBOL_COLLECTIONS } from "@/lib/symbols/collections";
import { STYLES } from "@/lib/text-engine/styles";
import type { UniversalSearchResult } from "./types";

export function universalSearch(query: string, limit = 40): UniversalSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: UniversalSearchResult[] = [];

  // 1. Search Symbols (3,497 items)
  for (const s of symbols) {
    if (results.length >= limit * 2) break;
    const nameLower = s.name.toLowerCase();
    let score = 0;
    if (nameLower === q || s.char === q) score = 100;
    else if (nameLower.startsWith(q)) score = 80;
    else if (nameLower.includes(q)) score = 60;
    else if (s.keywords.some((k) => k.toLowerCase().includes(q))) score = 40;

    if (score > 0) {
      results.push({
        id: `symbol-${s.slug}`,
        type: "symbol",
        title: s.name,
        preview: s.char,
        url: `/symbol/${s.slug}`,
        category: s.category,
        score: score + s.popularity * 0.1,
      });
    }
  }

  // 2. Search Kaomojis (2,000+ items)
  for (const k of kaomojis) {
    if (results.length >= limit * 3) break;
    const nameLower = k.name.toLowerCase();
    const expr = k.expression;
    let score = 0;
    if (nameLower === q || expr === q) score = 100;
    else if (nameLower.startsWith(q) || k.emotion.toLowerCase().startsWith(q)) score = 80;
    else if (nameLower.includes(q) || k.emotion.toLowerCase().includes(q)) score = 60;

    if (score > 0) {
      results.push({
        id: `kaomoji-${k.slug}`,
        type: "kaomoji",
        title: k.name,
        preview: k.expression,
        url: `/kaomoji/${k.slug}`,
        category: k.category,
        score: score + k.popularity * 0.1,
      });
    }
  }

  // 3. Search Font Styles
  for (const font of STYLES) {
    const fontName = font.name.toLowerCase();
    if (fontName.includes(q) || font.id.toLowerCase().includes(q)) {
      results.push({
        id: `font-${font.id}`,
        type: "font",
        title: font.name,
        preview: font.convert("Preview Text"),
        url: `/fonts#${font.id}`,
        category: font.category,
        score: 75,
      });
    }
  }

  // 4. Search Categories & Collections
  for (const cat of Object.values(SYMBOL_CATEGORIES)) {
    if (cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)) {
      results.push({
        id: `category-${cat.slug}`,
        type: "collection",
        title: `${cat.name} Category`,
        preview: "📁",
        url: `/symbols/${cat.slug}`,
        category: cat.name,
        score: 70,
      });
    }
  }

  for (const col of SYMBOL_COLLECTIONS.slice(0, 50)) {
    if (col.name.toLowerCase().includes(q) || col.description.toLowerCase().includes(q)) {
      results.push({
        id: `collection-${col.slug}`,
        type: "collection",
        title: `${col.name} Collection`,
        preview: "✦",
        url: `/collections/${col.slug}`,
        score: 65,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
