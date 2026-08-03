export type StyleCategory =
  | "bold"
  | "italic"
  | "cursive"
  | "bubble"
  | "gothic"
  | "monospace"
  | "smallcaps"
  | "vaporwave"
  | "upsidedown"
  | "underline"
  | "strikethrough"
  | "glitch"
  | "zalgo"
  | "kawaii"
  | "symbol"
  | "decorated";

/** Every app/platform with a dedicated generator page. */
export type PlatformKey =
  | "instagram"
  | "facebook"
  | "x"
  | "tiktok"
  | "whatsapp"
  | "discord"
  | "snapchat"
  | "telegram"
  | "linkedin"
  | "youtube"
  | "twitch"
  | "freeFire"
  | "pubg"
  | "roblox"
  | "fortnite"
  | "minecraft"
  | "mobileLegends"
  | "codMobile"
  | "valorant"
  | "gaming";

export type AppType = "social" | "gaming" | "creator";

/**
 * Curated visual families a style can belong to. A style may belong to
 * several families. These power the family filter, per-app curation and
 * recommendations — not conversion.
 */
export type StyleFamily =
  | "elegant"
  | "minimal"
  | "bold"
  | "gothic"
  | "aesthetic"
  | "cute"
  | "bubble"
  | "gaming"
  | "futuristic"
  | "cyberpunk"
  | "japanese"
  | "vintage"
  | "serif"
  | "sans"
  | "monospace"
  | "handwritten"
  | "script"
  | "double-struck"
  | "small-caps"
  | "tiny"
  | "emoji"
  | "decorative"
  | "glitch"
  | "wide"
  | "square"
  | "rounded"
  | "symbolic"
  | "unicode-art";

/** Compatibility score per platform, on a 0..100 scale. */
export type CompatibilityScores = Partial<Record<PlatformKey, number>>;

export interface AppConfig {
  key: PlatformKey;
  slug: string;
  name: string;
  title: string;
  description: string;
  accent: string;
  icon: string;
  type: AppType;
  defaultCategory: StyleCategory | "all";
  useCases: string[];
  characterLimits?: Partial<Record<string, number>>;
  presets?: string[];
  compatibilityWarning?: string;
  related: string[];
}

export interface StyleOptions {
  /** 0..100, used by zalgo styles. */
  zalgoIntensity?: number;
}

export interface TextStyle {
  id: string;
  name: string;
  category: StyleCategory;
  tags: string[];
  description: string;
  convert: (text: string, options?: StyleOptions) => string;
  /** Per-platform compatibility (0..100). Missing platforms fall back to category defaults. */
  platforms?: CompatibilityScores;
  /** Hidden styles still convert but are excluded from the grid (reserved). */
  hidden?: boolean;
  /** Curated visual families (filter/curation/recommendations). */
  families?: StyleFamily[];
  /** Internal cross-platform reliability 0..100. Never displayed. */
  confidence?: number;
  /** Readability score 0..100. */
  readability?: number;
  /** Visual uniqueness score 0..100. */
  uniqueness?: number;
  /** Popularity score 0..100 (curated baseline + real data when available). */
  popularity?: number;
  /** ISO date the style was added — drives the "New" sort. */
  addedAt?: string;
}

export interface ConvertedResult {
  style: TextStyle;
  text: string;
}
