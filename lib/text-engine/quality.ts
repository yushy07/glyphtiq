import { APP_CONFIGS } from "./apps";
import { compatScore } from "./compat";
import type { PlatformKey, StyleCategory, StyleFamily, TextStyle } from "./types";

/** Resolved quality metadata for a style (defaults + curated overrides). */
export interface StyleMetadata {
  families: StyleFamily[];
  confidence: number;
  readability: number;
  uniqueness: number;
  popularity: number;
  recommendedPlatforms: PlatformKey[];
}

const FAMILIES_BY_CATEGORY: Record<StyleCategory, StyleFamily[]> = {
  bold: ["bold", "sans"],
  italic: ["elegant", "sans"],
  cursive: ["script", "handwritten", "elegant"],
  bubble: ["bubble", "rounded", "cute"],
  gothic: ["gothic", "vintage"],
  monospace: ["monospace", "minimal"],
  smallcaps: ["small-caps", "elegant", "minimal"],
  vaporwave: ["aesthetic", "futuristic", "wide"],
  upsidedown: ["symbolic", "minimal"],
  underline: ["minimal"],
  strikethrough: ["minimal"],
  glitch: ["glitch", "cyberpunk"],
  zalgo: ["glitch", "cyberpunk", "gothic"],
  kawaii: ["cute", "emoji", "bubble"],
  symbol: ["symbolic"],
  decorated: ["decorative"],
};

/** Extra families tagged by style id on top of the category defaults. */
const EXTRA_FAMILIES: Record<string, StyleFamily[]> = {
  bold: ["bold", "sans"],
  italic: ["elegant", "sans"],
  boldItalic: ["bold", "elegant"],
  script: ["script", "handwritten", "elegant"],
  boldScript: ["script", "handwritten", "elegant"],
  fraktur: ["gothic", "vintage"],
  boldFraktur: ["gothic", "vintage"],
  doubleStruck: ["double-struck", "symbolic"],
  monospace: ["monospace", "minimal"],
  sans: ["sans", "minimal"],
  sansBold: ["sans", "bold"],
  sansItalic: ["sans", "elegant"],
  sansBoldItalic: ["sans", "bold", "elegant"],
  fullwidth: ["wide", "minimal"],
  circled: ["bubble", "rounded"],
  circledNegative: ["bubble", "rounded"],
  squared: ["square", "minimal"],
  squaredNegative: ["square", "minimal"],
  parenthesized: ["minimal"],
  superscript: ["tiny", "minimal"],
  subscript: ["tiny", "minimal"],
  smallCaps: ["small-caps", "elegant"],
  flagLetters: ["emoji", "symbolic"],
  japaneseBox: ["japanese", "decorative"],
  japaneseDoubleBox: ["japanese", "decorative"],
  aestheticWide: ["aesthetic", "wide"],
  aestheticSpace: ["aesthetic", "wide"],
  spacedOut: ["aesthetic", "wide"],
  glitch: ["glitch", "cyberpunk"],
  jitter: ["glitch", "cyberpunk"],
  zalgo: ["glitch", "cyberpunk", "gothic"],
  runic: ["gaming", "vintage", "symbolic"],
  cyrillic: ["gaming", "cyberpunk", "symbolic"],
  greek: ["gaming", "symbolic", "vintage"],
  boxFrame: ["unicode-art", "monospace", "minimal"],
  spiralBox: ["gaming", "cyberpunk"],
  hexCyberBox: ["gaming", "futuristic", "cyberpunk"],
  fireBox: ["gaming", "emoji"],
};

const DEFAULT_READABILITY: Record<StyleCategory, number> = {
  bold: 95,
  italic: 90,
  cursive: 90,
  bubble: 84,
  gothic: 72,
  monospace: 95,
  smallcaps: 92,
  vaporwave: 82,
  upsidedown: 45,
  underline: 86,
  strikethrough: 68,
  glitch: 42,
  zalgo: 22,
  kawaii: 78,
  symbol: 68,
  decorated: 78,
};

const DEFAULT_UNIQUENESS: Record<StyleCategory, number> = {
  bold: 55,
  italic: 58,
  cursive: 80,
  bubble: 74,
  gothic: 86,
  monospace: 55,
  smallcaps: 72,
  vaporwave: 86,
  upsidedown: 96,
  underline: 60,
  strikethrough: 64,
  glitch: 96,
  zalgo: 100,
  kawaii: 68,
  symbol: 74,
  decorated: 58,
};

const DEFAULT_CONFIDENCE: Record<StyleCategory, number> = {
  bold: 96,
  italic: 92,
  cursive: 93,
  bubble: 86,
  gothic: 84,
  monospace: 95,
  smallcaps: 93,
  vaporwave: 84,
  upsidedown: 72,
  underline: 84,
  strikethrough: 74,
  glitch: 50,
  zalgo: 38,
  kawaii: 84,
  symbol: 68,
  decorated: 80,
};

const DEFAULT_POPULARITY: Record<StyleCategory, number> = {
  bold: 84,
  italic: 66,
  cursive: 78,
  bubble: 72,
  gothic: 72,
  monospace: 76,
  smallcaps: 56,
  vaporwave: 66,
  upsidedown: 40,
  underline: 46,
  strikethrough: 42,
  glitch: 70,
  zalgo: 88,
  kawaii: 80,
  symbol: 56,
  decorated: 50,
};

/** Curated popularity baselines for well-known styles. */
const POPULARITY_OVERRIDES: Record<string, number> = {
  bold: 95,
  script: 90,
  zalgo: 92,
  fraktur: 82,
  circled: 80,
  glitch: 78,
  kawaiiHearts: 85,
  aestheticWide: 78,
  doubleStruck: 76,
  monospace: 82,
  fullwidth: 72,
  spacedOut: 70,
  heartBox: 74,
  strike: 60,
  spiralBox: 75,
  cyrillic: 70,
  fireBox: 68,
  smallCaps: 62,
};

/** Explicit quality metadata for styles that need it. */
const STYLE_QUALITY: Record<string, Partial<StyleMetadata>> = {
  runic: { readability: 58, uniqueness: 97, confidence: 74, popularity: 55 },
  cyrillic: { readability: 60, uniqueness: 96, confidence: 80, popularity: 70 },
  greek: { readability: 62, uniqueness: 95, confidence: 80, popularity: 60 },
  boxFrame: { readability: 90, uniqueness: 90, confidence: 78, popularity: 48 },
  caged: { readability: 78, uniqueness: 85, confidence: 76, popularity: 40 },
  xAbove: { readability: 62, uniqueness: 84, confidence: 66, popularity: 42 },
  doubleGrave: { readability: 82, uniqueness: 70, confidence: 82, popularity: 38 },
  invertedBreve: { readability: 82, uniqueness: 68, confidence: 82, popularity: 36 },
  strikeWave: { readability: 60, uniqueness: 80, confidence: 68, popularity: 40 },
  spiralBox: { readability: 84, uniqueness: 92, confidence: 72, popularity: 75 },
  hexCyberBox: { readability: 84, uniqueness: 88, confidence: 74, popularity: 55 },
  fireBox: { readability: 78, uniqueness: 90, confidence: 62, popularity: 68 },
};

const METADATA_CACHE = new Map<string, StyleMetadata>();

/** Resolved quality metadata for a style, cached. */
export function resolveStyleMetadata(style: TextStyle): StyleMetadata {
  const cached = METADATA_CACHE.get(style.id);
  if (cached) return cached;

  const categoryFamilies = FAMILIES_BY_CATEGORY[style.category] ?? ["decorative"];
  const extraFamilies = EXTRA_FAMILIES[style.id] ?? [];
  const families = Array.from(new Set([...categoryFamilies, ...extraFamilies]));

  const override = STYLE_QUALITY[style.id];
  const readability = override?.readability ?? DEFAULT_READABILITY[style.category];
  const uniqueness = override?.uniqueness ?? DEFAULT_UNIQUENESS[style.category];
  const confidence = override?.confidence ?? DEFAULT_CONFIDENCE[style.category];
  const popularity =
    override?.popularity ?? POPULARITY_OVERRIDES[style.id] ?? DEFAULT_POPULARITY[style.category];

  const recommendedPlatforms = APP_CONFIGS.filter((app) => compatScore(style, app.key) >= 80).map(
    (app) => app.key,
  );

  const metadata: StyleMetadata = {
    families,
    confidence,
    readability,
    uniqueness,
    popularity,
    recommendedPlatforms,
  };
  METADATA_CACHE.set(style.id, metadata);
  return metadata;
}

/**
 * Weighted recommendation score for a style on a given app.
 * `0.35 compatibility + 0.25 readability + 0.20 uniqueness + 0.20 popularity`.
 * Compatibility is no longer a single gate — it is one weighted factor.
 */
export function overallScore(style: TextStyle, appKey: PlatformKey): number {
  const m = resolveStyleMetadata(style);
  const compat = compatScore(style, appKey);
  return Math.round(0.35 * compat + 0.25 * m.readability + 0.2 * m.uniqueness + 0.2 * m.popularity);
}
