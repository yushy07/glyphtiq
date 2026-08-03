import { sortForApp } from "./compat";
import { STYLES, getStyleById } from "./styles";
import type { ConvertedResult, PlatformKey, StyleCategory, StyleOptions, TextStyle } from "./types";

export const STYLE_COUNT = STYLES.length;

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

/** Styles suitable for an app (score >= 40), sorted by compatibility. */
export function stylesForApp(appKey: PlatformKey): TextStyle[] {
  return sortForApp(STYLES, appKey);
}

/** Converts text using only styles compatible with an app, best-first. */
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

/** Style + tag/category search. */
export function searchStyles(
  query: string,
  category: StyleCategory | "all" = "all",
): TextStyle[] {
  const q = query.trim().toLowerCase();
  return STYLES.filter((s) => {
    if (s.hidden) return false;
    if (category !== "all" && s.category !== category) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.category.includes(q) ||
      s.tags.some((t) => t.includes(q)) ||
      s.description.toLowerCase().includes(q)
    );
  });
}

/** Picks a pseudo-random style, optionally within a category. */
export function surpriseStyle(category: StyleCategory | "all" = "all"): TextStyle {
  const pool = searchStyles("", category);
  if (pool.length === 0) return STYLES[0];
  return pool[Math.floor(Math.random() * pool.length)];
}
