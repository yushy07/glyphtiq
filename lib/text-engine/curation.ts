import { getAppByKey } from "./apps";
import { overallScore, resolveStyleMetadata } from "./quality";
import { getStyleById, STYLES } from "./styles";
import type { AppType, PlatformKey, StyleFamily, TextStyle } from "./types";
import { getCanonical, getVariants, isVariant } from "./variants";

/** One curated "discover by intent" section on an app page. */
export interface AppSectionConfig {
  emoji: string;
  label: string;
  /** Fill the section from a family (fallback when no styleIds). */
  family?: StyleFamily;
  /** Explicit curated style ids, in order. */
  styleIds?: string[];
  count?: number;
}

export interface AppPersona {
  /** Signature styles pinned at the top of the collection, in order. */
  core: string[];
  /** Families weighted for this platform's audience. */
  families: StyleFamily[];
  /** Intent sections shown above the full list. */
  sections: AppSectionConfig[];
}

export interface AppSection {
  emoji: string;
  label: string;
  styles: TextStyle[];
}

const MIN_COLLECTION = 50;
const TARGET_COLLECTION = 60;
const SOFT_MAX = 80;
const CONFIDENCE_FLOOR = 70;
const SCORE_FLOOR = 40;

const DEFAULT_CORE: Record<AppType, string[]> = {
  social: [
    "bold",
    "script",
    "italic",
    "smallCaps",
    "aestheticWide",
    "circled",
    "kawaiiHearts",
    "heartBox",
    "monospace",
    "spacedOut",
  ],
  gaming: [
    "bold",
    "monospace",
    "fraktur",
    "circled",
    "spiralBox",
    "cyrillic",
    "glitch",
    "zalgo",
    "fullwidth",
    "runic",
  ],
  creator: [
    "bold",
    "glitch",
    "doubleStruck",
    "monospace",
    "jitter",
    "fraktur",
    "aestheticWide",
    "zalgo",
    "sansBold",
    "spiralBox",
  ],
};

const DEFAULT_FAMILIES: Record<AppType, StyleFamily[]> = {
  social: ["elegant", "cute", "bubble", "aesthetic", "minimal", "script", "handwritten", "bold"],
  gaming: [
    "bold",
    "gothic",
    "gaming",
    "glitch",
    "cyberpunk",
    "symbolic",
    "futuristic",
    "monospace",
    "japanese",
  ],
  creator: ["bold", "glitch", "cyberpunk", "gothic", "aesthetic", "monospace", "symbolic"],
};

const DEFAULT_SECTIONS: Record<AppType, AppSectionConfig[]> = {
  social: [
    { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
    { emoji: "💎", label: "Luxury", family: "elegant" },
    { emoji: "💖", label: "Cute", family: "cute" },
    { emoji: "🖤", label: "Minimal", family: "minimal" },
  ],
  gaming: [
    { emoji: "🎮", label: "Gamer", family: "gaming" },
    { emoji: "🖤", label: "Edgy", family: "gothic" },
    { emoji: "⚡", label: "Glitch", family: "glitch" },
    { emoji: "🪙", label: "Clan Tags", family: "symbolic" },
  ],
  creator: [
    { emoji: "🎬", label: "Bold Titles", family: "bold" },
    { emoji: "⚡", label: "Glitch", family: "glitch" },
    { emoji: "🖤", label: "Edgy", family: "gothic" },
    { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
  ],
};

/** Per-app persona overrides for personality-driven platforms. */
const PERSONAS: Partial<Record<PlatformKey, Partial<AppPersona>>> = {
  instagram: {
    core: ["script", "boldScript", "aestheticWide", "heartBox", "spacedOut", "kawaiiHearts", "smallCaps", "circled", "italic", "underline"],
    families: ["elegant", "aesthetic", "cute", "minimal", "script", "handwritten", "bubble"],
    sections: [
      { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
      { emoji: "💎", label: "Luxury", family: "elegant" },
      { emoji: "🖤", label: "Minimal", family: "minimal" },
      { emoji: "💖", label: "Cute", family: "cute" },
      { emoji: "🎮", label: "Gaming", family: "gaming" },
    ],
  },
  tiktok: {
    core: ["kawaiiHearts", "kawaiiSparkles", "aestheticWide", "bold", "circled", "spacedOut", "zalgo", "heartBox", "italic", "boldItalic"],
    sections: [
      { emoji: "💖", label: "Cute", family: "cute" },
      { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
      { emoji: "👻", label: "Spooky", family: "gothic" },
      { emoji: "🖤", label: "Minimal", family: "minimal" },
    ],
  },
  discord: {
    core: ["fraktur", "boldFraktur", "glitch", "zalgo", "jitter", "doubleStruck", "spiralBox", "cyrillic", "monospace", "bold"],
    families: ["gothic", "glitch", "cyberpunk", "gaming", "monospace", "bold", "japanese"],
    sections: [
      { emoji: "🖤", label: "Edgy", family: "gothic" },
      { emoji: "⚡", label: "Glitch", family: "glitch" },
      { emoji: "🎮", label: "Gamer", family: "gaming" },
      { emoji: "🈺", label: "Anime", family: "japanese" },
    ],
  },
  snapchat: {
    core: ["circled", "circledNegative", "kawaiiHearts", "smallCaps", "script", "heartBox", "spacedOut", "underline", "fullwidth", "squared"],
    sections: [
      { emoji: "🫧", label: "Bubble", family: "bubble" },
      { emoji: "💖", label: "Cute", family: "cute" },
      { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
      { emoji: "🖤", label: "Minimal", family: "minimal" },
    ],
  },
  whatsapp: {
    core: ["heartBox", "script", "bold", "kawaiiHearts", "spiralBox", "smallCaps", "italic", "underline", "aestheticWide", "crownBox"],
    sections: [
      { emoji: "💖", label: "Love", family: "cute" },
      { emoji: "💎", label: "Luxury", family: "elegant" },
      { emoji: "🖤", label: "Minimal", family: "minimal" },
      { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
    ],
  },
  roblox: {
    core: ["bold", "monospace", "sansBold", "spiralBox", "circled", "fullwidth", "squared", "doubleStruck", "japaneseBox", "runic"],
    families: ["gaming", "bold", "futuristic", "square", "bubble", "glitch", "cyberpunk", "minimal"],
    sections: [
      { emoji: "🧊", label: "Blocky", family: "square" },
      { emoji: "🎮", label: "Gamer", family: "gaming" },
      { emoji: "🖤", label: "Edgy", family: "gothic" },
      { emoji: "⚡", label: "Futuristic", family: "futuristic" },
    ],
  },
  minecraft: {
    core: ["runic", "bold", "monospace", "circled", "squared", "fraktur", "spiralBox", "japaneseBox", "fullwidth", "sansBold"],
    families: ["gaming", "vintage", "square", "minimal", "gothic", "bold", "symbolic"],
    sections: [
      { emoji: "🗿", label: "Runic", family: "vintage" },
      { emoji: "🧊", label: "Blocky", family: "square" },
      { emoji: "🎮", label: "Gamer", family: "gaming" },
      { emoji: "⚔️", label: "Fantasy", family: "gothic" },
    ],
  },
  pubg: {
    core: ["spiralBox", "cyrillic", "bold", "monospace", "glitch", "fraktur", "fullwidth", "doubleStruck", "greek", "circled"],
    families: ["gaming", "cyberpunk", "bold", "symbolic", "futuristic", "gothic", "minimal"],
    sections: [
      { emoji: "🪖", label: "Military", family: "bold" },
      { emoji: "🎮", label: "Clan Tags", family: "gaming" },
      { emoji: "⚡", label: "Tactical", family: "cyberpunk" },
      { emoji: "🖤", label: "Edgy", family: "gothic" },
    ],
  },
  freeFire: {
    core: ["spiralBox", "cyrillic", "bold", "glitch", "fullwidth", "fraktur", "japaneseBox", "monospace", "fireBox", "doubleStruck"],
    sections: [
      { emoji: "🔥", label: "Fire", family: "gaming" },
      { emoji: "🈺", label: "Japanese", family: "japanese" },
      { emoji: "🖤", label: "Edgy", family: "gothic" },
      { emoji: "⚡", label: "Glitch", family: "glitch" },
    ],
  },
  valorant: {
    core: ["cyrillic", "bold", "monospace", "spiralBox", "greek", "fraktur", "fullwidth", "glitch", "doubleStruck", "hexCyberBox"],
    sections: [
      { emoji: "🖤", label: "Radiant", family: "cyberpunk" },
      { emoji: "🎮", label: "Gamer", family: "gaming" },
      { emoji: "🖤", label: "Edgy", family: "gothic" },
      { emoji: "⚡", label: "Futuristic", family: "futuristic" },
    ],
  },
  youtube: {
    core: ["bold", "glitch", "fraktur", "doubleStruck", "aestheticWide", "jitter", "zalgo", "monospace", "sansBold", "spiralBox"],
    sections: [
      { emoji: "🎬", label: "Bold Titles", family: "bold" },
      { emoji: "⚡", label: "Glitch", family: "glitch" },
      { emoji: "🖤", label: "Edgy", family: "gothic" },
      { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
    ],
  },
  twitch: {
    core: ["glitch", "jitter", "zalgo", "fraktur", "bold", "doubleStruck", "monospace", "spiralBox", "aestheticWide", "cyrillic"],
    sections: [
      { emoji: "⚡", label: "Glitch", family: "glitch" },
      { emoji: "🖤", label: "Edgy", family: "gothic" },
      { emoji: "🎮", label: "Gamer", family: "gaming" },
      { emoji: "✨", label: "Aesthetic", family: "aesthetic" },
    ],
  },
};

function personaFor(appKey: PlatformKey, type: AppType): AppPersona {
  const override = PERSONAS[appKey];
  return {
    core: override?.core ?? DEFAULT_CORE[type],
    families: override?.families ?? DEFAULT_FAMILIES[type],
    sections: override?.sections ?? DEFAULT_SECTIONS[type],
  };
}

interface RankedStyle {
  style: TextStyle;
  score: number;
  confidence: number;
  families: StyleFamily[];
}

const RANKED_BY_APP = new Map<PlatformKey, RankedStyle[]>();

/** Library styles ranked for an app by overall score. Cached per app. */
function rankedFor(appKey: PlatformKey): RankedStyle[] {
  const cached = RANKED_BY_APP.get(appKey);
  if (cached) return cached;
  const ranked = STYLES.filter((s) => !s.hidden)
    .map((style) => {
      const m = resolveStyleMetadata(style);
      return {
        style,
        score: overallScore(style, appKey),
        confidence: m.confidence,
        families: m.families,
      };
    })
    .sort((a, b) => b.score - a.score || a.style.name.localeCompare(b.style.name));
  RANKED_BY_APP.set(appKey, ranked);
  return ranked;
}

const COLLECTION_CACHE = new Map<PlatformKey, TextStyle[]>();

/**
 * Curated styles for an app: persona core pinned first, then family-weighted
 * picks, then a quality fill that stops once the target window is reached.
 * Guarantees at least `MIN_COLLECTION` styles and never exceeds `SOFT_MAX`.
 */
export function curatedForApp(appKey: PlatformKey): TextStyle[] {
  const cached = COLLECTION_CACHE.get(appKey);
  if (cached) return cached;

  const app = getAppByKey(appKey);
  const persona = personaFor(appKey, app?.type ?? "gaming");

  const ordered: TextStyle[] = [];
  const seen = new Set<string>();
  const push = (id: string) => {
    if (ordered.length >= SOFT_MAX) return;
    const style = getStyleById(id);
    if (style && !seen.has(id)) {
      seen.add(id);
      ordered.push(style);
    }
  };

  // 1. Persona core — pinned regardless of score.
  for (const id of persona.core) push(id);

  // 2. Keep each core signature group together so "Similar styles" works
  //    for the styles users discover first.
  for (const id of persona.core) {
    for (const variantId of getVariants(id)) push(variantId);
  }

  // 3. Family-weighted picks, best-first (low-confidence styles sink).
  //    Canonicals sort ahead of their variants so a variant is never picked
  //    without its own card present.
  const weighted = rankedFor(appKey)
    .filter(
      (r) => !seen.has(r.style.id) && r.families.some((f) => persona.families.includes(f)),
    )
    .sort((a, b) => {
      const av = isVariant(a.style.id) ? 1 : 0;
      const bv = isVariant(b.style.id) ? 1 : 0;
      if (av !== bv) return av - bv;
      return b.score - a.score || a.style.name.localeCompare(b.style.name);
    });
  for (const r of weighted) {
    if (ordered.length >= TARGET_COLLECTION) break;
    push(r.style.id);
  }

  // 4. Quality fill — add essentials that missed the family filter (e.g.
  //    bold for aesthetic apps), keeping quality high past the target.
  //    A variant is only added together with its canonical card.
  const pushWithCanonical = (id: string) => {
    const canonical = getCanonical(id);
    if (canonical !== id && !seen.has(canonical)) push(canonical);
    push(id);
  };
  for (const r of rankedFor(appKey)) {
    if (ordered.length >= SOFT_MAX) break;
    if (seen.has(r.style.id)) continue;
    if (r.score < SCORE_FLOOR) continue;
    if (ordered.length >= TARGET_COLLECTION && r.score < 65) break;
    pushWithCanonical(r.style.id);
  }

  COLLECTION_CACHE.set(appKey, ordered);
  return ordered;
}

/** Renders a section: explicit ids win, otherwise best-of-family. */
function resolveSection(cfg: AppSectionConfig, curated: TextStyle[]): TextStyle[] {
  const count = cfg.count ?? 7;
  if (cfg.styleIds) {
    const ids = new Set(cfg.styleIds);
    const explicit = curated.filter((s) => ids.has(s.id));
    if (explicit.length > 0) return explicit.slice(0, count);
  }
  if (cfg.family) {
    const curatedByFamily = curated.filter((s) => resolveStyleMetadata(s).families.includes(cfg.family!));
    const confident = curatedByFamily.filter((s) => resolveStyleMetadata(s).confidence >= CONFIDENCE_FLOOR);
    const pool = confident.length > 0 ? confident : curatedByFamily;
    return pool.slice(0, count);
  }
  return [];
}

/** Per-app intent sections. The Trending section leads and is data-aware. */
export function getAppSections(
  appKey: PlatformKey,
  trendingIds: string[] = [],
  curated: TextStyle[] = curatedForApp(appKey),
): AppSection[] {
  const app = getAppByKey(appKey);
  const persona = personaFor(appKey, app?.type ?? "gaming");

  const sections: AppSection[] = [];
  const trendingSet = new Set(trendingIds);
  const trending: TextStyle[] = [];
  for (const style of curated) {
    if (trendingSet.has(style.id)) trending.push(style);
    if (trending.length >= 6) break;
  }
  if (trending.length === 0) {
    for (const style of curated) {
      const m = resolveStyleMetadata(style);
      if (m.confidence < CONFIDENCE_FLOOR) continue;
      trending.push(style);
      if (trending.length >= 6) break;
    }
  }
  sections.push({ emoji: "🔥", label: "Trending", styles: trending });

  for (const cfg of persona.sections) {
    sections.push({ emoji: cfg.emoji, label: cfg.label, styles: resolveSection(cfg, curated) });
  }
  return sections;
}
