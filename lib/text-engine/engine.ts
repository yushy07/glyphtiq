import { curatedForApp } from "./curation";
import { resolveStyleMetadata } from "./quality";
import { STYLES, getStyleById } from "./styles";
import type {
  ConvertedResult,
  PlatformKey,
  StyleCategory,
  StyleFamily,
  StyleOptions,
  TextStyle,
} from "./types";

export const STYLE_COUNT = STYLES.length;

/** Rounded marketing label, e.g. "270+". */
export const STYLE_COUNT_LABEL = `${Math.floor(STYLE_COUNT / 10) * 10}+`;

/** Display labels for each category, shared by pages and the client filter. */
export const CATEGORY_LABELS: Record<StyleCategory, string> = {
  bold: "Bold",
  italic: "Italic",
  cursive: "Cursive",
  bubble: "Bubble",
  gothic: "Gothic",
  monospace: "Monospace",
  smallcaps: "Small Caps",
  vaporwave: "Vaporwave",
  upsidedown: "Upside Down",
  underline: "Underline",
  strikethrough: "Strikethrough",
  glitch: "Glitch",
  zalgo: "Zalgo",
  kawaii: "Kawaii",
  symbol: "Symbol",
  decorated: "Decorated",
};

/** Display labels for each family, shared by the family filter. */
export const FAMILY_LABELS: Record<StyleFamily, string> = {
  elegant: "Elegant",
  minimal: "Minimal",
  bold: "Bold",
  gothic: "Gothic",
  aesthetic: "Aesthetic",
  cute: "Cute",
  bubble: "Bubble",
  gaming: "Gaming",
  futuristic: "Futuristic",
  cyberpunk: "Cyberpunk",
  japanese: "Japanese",
  vintage: "Vintage",
  serif: "Serif",
  sans: "Sans",
  monospace: "Monospace",
  handwritten: "Handwritten",
  script: "Script",
  "double-struck": "Double-Struck",
  "small-caps": "Small Caps",
  tiny: "Tiny",
  emoji: "Emoji",
  decorative: "Decorative",
  glitch: "Glitch",
  wide: "Wide",
  square: "Square",
  rounded: "Rounded",
  symbolic: "Symbolic",
  "unicode-art": "Unicode Art",
};

export const FAMILIES: StyleFamily[] = [
  "elegant",
  "minimal",
  "bold",
  "gothic",
  "aesthetic",
  "cute",
  "bubble",
  "gaming",
  "futuristic",
  "cyberpunk",
  "japanese",
  "vintage",
  "serif",
  "sans",
  "monospace",
  "handwritten",
  "script",
  "double-struck",
  "small-caps",
  "tiny",
  "emoji",
  "decorative",
  "glitch",
  "wide",
  "square",
  "rounded",
  "symbolic",
  "unicode-art",
];

/** Converts text using a style id. Falls back to the raw text for unknown ids. */
export function convertToStyle(text: string, styleId: string, options?: StyleOptions): string {
  const style = getStyleById(styleId);
  if (!style) return text;
  return style.convert(text, options);
}

/** Converts text across every public style. */
export function convertAll(text: string, options?: StyleOptions): ConvertedResult[] {
  return STYLES.filter((s) => !s.hidden).map((style) => ({
    style,
    text: style.convert(text, options),
  }));
}

/** Curated styles for an app, ordered: persona core → family → quality fill. */
export function stylesForApp(appKey: PlatformKey): TextStyle[] {
  return curatedForApp(appKey);
}

/** Converts text using only the curated styles for an app, best-first. */
export function convertForApp(
  text: string,
  appKey: PlatformKey,
  options?: StyleOptions,
): ConvertedResult[] {
  return stylesForApp(appKey).map((style) => ({
    style,
    text: style.convert(text, options),
  }));
}

export const CATEGORIES: StyleCategory[] = [
  "bold",
  "italic",
  "cursive",
  "bubble",
  "gothic",
  "monospace",
  "smallcaps",
  "vaporwave",
  "upsidedown",
  "underline",
  "strikethrough",
  "glitch",
  "zalgo",
  "kawaii",
  "symbol",
  "decorated",
];

/** Style + tag/category/family search. */
export function searchStyles(
  query: string,
  category: StyleCategory | "all" = "all",
  family: StyleFamily | "all" = "all",
): TextStyle[] {
  const q = query.trim().toLowerCase();
  return STYLES.filter((s) => {
    if (s.hidden) return false;
    if (category !== "all" && s.category !== category) return false;
    if (family !== "all" && !resolveStyleMetadata(s).families.includes(family)) return false;
    if (!q) return true;
    const meta = resolveStyleMetadata(s);
    // Family and platform terms only match on longer queries so single-letter
    // keystrokes don't flood results with entire families.
    const longQuery = q.length >= 2;
    const matchesFamily =
      longQuery &&
      meta.families.some(
        (f) => f.includes(q) || (FAMILY_LABELS[f] ?? f).toLowerCase().includes(q),
      );
    const matchesPlatform =
      longQuery && meta.recommendedPlatforms.some((p) => p.toLowerCase().includes(q));
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.category.includes(q) ||
      s.tags.some((t) => t.includes(q)) ||
      s.description.toLowerCase().includes(q) ||
      matchesFamily ||
      matchesPlatform
    );
  });
}

/** Picks a pseudo-random style, optionally within a category. */
export function surpriseStyle(category: StyleCategory | "all" = "all"): TextStyle {
  const pool = searchStyles("", category);
  if (pool.length === 0) return STYLES[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

export type SortKey = "recommended" | "popular" | "new" | "readable" | "trending";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  { value: "readable", label: "Most Readable" },
  { value: "trending", label: "Trending" },
];

/** Sorts converted results by a display sort key. "recommended" is identity. */
export function sortResults(
  results: ConvertedResult[],
  sort: SortKey,
  trendingIds: string[] = [],
): ConvertedResult[] {
  if (sort === "recommended" || results.length < 2) return results;
  if (sort === "popular") {
    return [...results].sort(
      (a, b) =>
        resolveStyleMetadata(b.style).popularity - resolveStyleMetadata(a.style).popularity,
    );
  }
  if (sort === "new") {
    return [...results].sort((a, b) =>
      (b.style.addedAt ?? "").localeCompare(a.style.addedAt ?? ""),
    );
  }
  if (sort === "readable") {
    return [...results].sort(
      (a, b) =>
        resolveStyleMetadata(b.style).readability - resolveStyleMetadata(a.style).readability,
    );
  }
  // trending: rank by the trending list order, then popularity.
  const index = new Map(trendingIds.map((id, i) => [id, i]));
  return [...results].sort((a, b) => {
    const ai = index.get(a.style.id) ?? Number.MAX_SAFE_INTEGER;
    const bi = index.get(b.style.id) ?? Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return resolveStyleMetadata(b.style).popularity - resolveStyleMetadata(a.style).popularity;
  });
}
