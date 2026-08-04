import { curatedForApp, personaCoreFor, type AppSection } from "./curation";
import { overallScore } from "./quality";
import { getStyleById, STYLES } from "./styles";
import { getCanonical } from "./variants";
import type { PlatformKey, TextStyle } from "./types";

/**
 * Discovery separates "browse" from "convert": a tight curated pool powers
 * the homepage Best Styles and every shelf card (so clicking a shelf card can
 * always scroll to its card), while the full library stays in the Explorer.
 */

export const HIGHLIGHTS_CAP = 30;

/**
 * The homepage Best Styles pool — canonical styles only, capped at
 * `HIGHLIGHTS_CAP`. Every id below must exist and every Discovery shelf must
 * resolve to styles inside this pool so scroll-to-card never points nowhere.
 * Order drives the "Best styles" grid order.
 */
export const HIGHLIGHTS: string[] = [
  "bold",
  "monospace",
  "script",
  "boldItalic",
  "fraktur",
  "doubleStruck",
  "italic",
  "smallCaps",
  "fullwidth",
  "aestheticWide",
  "aestheticSpace",
  "spacedOut",
  "circled",
  "circledNegative",
  "kawaiiHearts",
  "kawaiiSparkles",
  "heartBox",
  "glitch",
  "zalgo",
  "spiralBox",
  "cyrillic",
  "runic",
  "greek",
  "hexCyberBox",
  "fireBox",
  "japaneseBox",
  "squared",
  "sansBold",
];

/**
 * A homepage Discovery shelf. Every shelf uses an explicit pick list drawn
 * from the canonical pool so cards stay 6–8 and always have a Best Styles
 * card to scroll to (never a bare family fill — thin shelves look unfinished).
 */
export interface HomeCollection {
  emoji: string;
  label: string;
  description?: string;
  styleIds?: string[];
}

/** Fixed mood order — never alphabetical. 6–8 cards per shelf, all in `HIGHLIGHTS`. */
export const HOME_COLLECTIONS: HomeCollection[] = [
  {
    emoji: "🔥",
    label: "Trending",
    description: "The styles everyone is copying",
    styleIds: ["bold", "script", "zalgo", "kawaiiHearts", "circled", "glitch", "monospace", "fraktur"],
  },
  {
    emoji: "✨",
    label: "Aesthetic",
    description: "Soft, spaced and dreamy",
    styleIds: ["aestheticWide", "aestheticSpace", "spacedOut", "fullwidth", "italic", "doubleStruck", "smallCaps"],
  },
  {
    emoji: "🎮",
    label: "Gaming",
    description: "Clan tags and gamer names",
    styleIds: ["spiralBox", "runic", "greek", "cyrillic", "hexCyberBox", "fireBox", "sansBold"],
  },
  {
    emoji: "💎",
    label: "Luxury",
    description: "Elegant and classy",
    styleIds: ["script", "fraktur", "doubleStruck", "boldItalic", "italic", "smallCaps", "monospace"],
  },
  {
    emoji: "💖",
    label: "Cute",
    description: "Kawaii hearts and bubbles",
    styleIds: ["kawaiiHearts", "kawaiiSparkles", "heartBox", "circled", "circledNegative", "japaneseBox", "spacedOut"],
  },
  {
    emoji: "⚡",
    label: "Futuristic",
    description: "Wide, glitchy and neon",
    styleIds: ["glitch", "zalgo", "hexCyberBox", "fireBox", "spiralBox", "fullwidth", "aestheticWide"],
  },
];

/** The homepage pool resolved to styles, in pool order. */
export function highlightsPool(): TextStyle[] {
  return HIGHLIGHTS.map(getStyleById).filter((s): s is TextStyle => !!s);
}

/** True when a style (or its canonical) is in the homepage Best Styles pool. */
export function isHighlighted(styleId: string): boolean {
  return HIGHLIGHTS.includes(styleId) || HIGHLIGHTS.includes(getCanonical(styleId));
}

/**
 * Homepage Discovery shelves, resolved strictly from the pool so every card
 * has a matching Best Styles card to scroll to.
 */
export function homeCollections(): AppSection[] {
  const pool = highlightsPool();
  const byId = new Map(pool.map((s) => [s.id, s]));
  return HOME_COLLECTIONS.map((collection) => {
    const styles = (collection.styleIds ?? [])
      .map((id) => byId.get(id))
      .filter((s): s is TextStyle => !!s);
    return { emoji: collection.emoji, label: collection.label, styles };
  });
}

/** Number of styles the Explorer browses (all public styles). */
export const EXPLORER_COUNT = STYLES.filter((s) => !s.hidden).length;

/**
 * An app's "Best styles": persona signature set first, then the remaining
 * curated collection by overall score, capped so Discovery shelves (which are
 * resolved from this same set) always have a card to scroll to.
 */
export function bestStylesForApp(appKey: PlatformKey, cap = 40): TextStyle[] {
  const curated = curatedForApp(appKey);
  const ranked = [...curated].sort(
    (a, b) => overallScore(b, appKey) - overallScore(a, appKey),
  );
  const result: TextStyle[] = [];
  const seen = new Set<string>();
  for (const id of personaCoreFor(appKey)) {
    const style = getStyleById(id);
    if (style && !seen.has(id)) {
      seen.add(id);
      result.push(style);
    }
  }
  for (const style of ranked) {
    if (result.length >= cap) break;
    if (seen.has(style.id)) continue;
    seen.add(style.id);
    result.push(style);
  }
  return result;
}
