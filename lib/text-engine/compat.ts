import type { AppConfig, PlatformKey, StyleCategory, TextStyle } from "./types";

/**
 * Default compatibility scores by style category. Individual styles can
 * override these through `style.platforms`. Scale is 0..100.
 */
export const CATEGORY_SCORES: Record<StyleCategory, Partial<Record<PlatformKey, number>>> = {
  bold: {
    instagram: 85, facebook: 90, x: 90, tiktok: 85, whatsapp: 85, discord: 85,
    snapchat: 80, telegram: 85, linkedin: 90, youtube: 88, twitch: 88,
    freeFire: 88, pubg: 88, roblox: 90, fortnite: 90, minecraft: 88,
    mobileLegends: 88, codMobile: 88, valorant: 88, gaming: 88,
  },
  italic: {
    instagram: 75, facebook: 80, x: 85, tiktok: 70, whatsapp: 75, discord: 75,
    snapchat: 70, telegram: 75, linkedin: 80, youtube: 75, twitch: 75,
    freeFire: 70, pubg: 70, roblox: 75, fortnite: 75, minecraft: 75,
    mobileLegends: 70, codMobile: 70, valorant: 70, gaming: 70,
  },
  cursive: {
    instagram: 95, facebook: 90, x: 80, tiktok: 90, whatsapp: 90, discord: 80,
    snapchat: 90, telegram: 88, linkedin: 75, youtube: 85, twitch: 80,
    freeFire: 85, pubg: 85, roblox: 85, fortnite: 85, minecraft: 80,
    mobileLegends: 85, codMobile: 85, valorant: 85, gaming: 85,
  },
  bubble: {
    instagram: 90, facebook: 85, x: 70, tiktok: 85, whatsapp: 85, discord: 85,
    snapchat: 90, telegram: 85, linkedin: 55, youtube: 80, twitch: 85,
    freeFire: 90, pubg: 90, roblox: 90, fortnite: 88, minecraft: 85,
    mobileLegends: 90, codMobile: 88, valorant: 85, gaming: 88,
  },
  gothic: {
    instagram: 80, facebook: 75, x: 70, tiktok: 75, whatsapp: 75, discord: 90,
    snapchat: 80, telegram: 75, linkedin: 55, youtube: 80, twitch: 85,
    freeFire: 85, pubg: 85, roblox: 80, fortnite: 82, minecraft: 80,
    mobileLegends: 85, codMobile: 85, valorant: 82, gaming: 84,
  },
  monospace: {
    instagram: 60, facebook: 65, x: 85, tiktok: 60, whatsapp: 60, discord: 85,
    snapchat: 60, telegram: 70, linkedin: 85, youtube: 75, twitch: 80,
    freeFire: 85, pubg: 85, roblox: 85, fortnite: 85, minecraft: 85,
    mobileLegends: 85, codMobile: 85, valorant: 85, gaming: 85,
  },
  smallcaps: {
    instagram: 90, facebook: 80, x: 85, tiktok: 80, whatsapp: 85, discord: 80,
    snapchat: 85, telegram: 85, linkedin: 90, youtube: 85, twitch: 85,
    freeFire: 80, pubg: 80, roblox: 80, fortnite: 82, minecraft: 80,
    mobileLegends: 80, codMobile: 82, valorant: 80, gaming: 80,
  },
  vaporwave: {
    instagram: 90, facebook: 75, x: 60, tiktok: 95, whatsapp: 85, discord: 80,
    snapchat: 88, telegram: 80, linkedin: 45, youtube: 75, twitch: 80,
    freeFire: 75, pubg: 70, roblox: 70, fortnite: 70, minecraft: 65,
    mobileLegends: 75, codMobile: 70, valorant: 65, gaming: 70,
  },
  upsidedown: {
    instagram: 65, facebook: 55, x: 55, tiktok: 60, whatsapp: 60, discord: 70,
    snapchat: 60, telegram: 60, linkedin: 35, youtube: 55, twitch: 60,
    freeFire: 60, pubg: 60, roblox: 55, fortnite: 55, minecraft: 55,
    mobileLegends: 60, codMobile: 60, valorant: 55, gaming: 58,
  },
  underline: {
    instagram: 70, facebook: 70, x: 65, tiktok: 65, whatsapp: 65, discord: 65,
    snapchat: 65, telegram: 65, linkedin: 70, youtube: 70, twitch: 65,
    freeFire: 20, pubg: 20, roblox: 25, fortnite: 20, minecraft: 25,
    mobileLegends: 20, codMobile: 20, valorant: 20, gaming: 20,
  },
  strikethrough: {
    instagram: 55, facebook: 60, x: 70, tiktok: 60, whatsapp: 60, discord: 70,
    snapchat: 60, telegram: 60, linkedin: 65, youtube: 65, twitch: 70,
    freeFire: 15, pubg: 15, roblox: 20, fortnite: 18, minecraft: 20,
    mobileLegends: 15, codMobile: 15, valorant: 15, gaming: 16,
  },
  glitch: {
    instagram: 75, facebook: 65, x: 60, tiktok: 80, whatsapp: 60, discord: 90,
    snapchat: 70, telegram: 70, linkedin: 40, youtube: 85, twitch: 90,
    freeFire: 15, pubg: 15, roblox: 20, fortnite: 20, minecraft: 25,
    mobileLegends: 15, codMobile: 15, valorant: 15, gaming: 16,
  },
  zalgo: {
    instagram: 70, facebook: 50, x: 50, tiktok: 75, whatsapp: 60, discord: 80,
    snapchat: 65, telegram: 60, linkedin: 30, youtube: 70, twitch: 75,
    freeFire: 10, pubg: 10, roblox: 12, fortnite: 10, minecraft: 12,
    mobileLegends: 10, codMobile: 10, valorant: 10, gaming: 10,
  },
  kawaii: {
    instagram: 95, facebook: 85, x: 60, tiktok: 95, whatsapp: 90, discord: 80,
    snapchat: 92, telegram: 85, linkedin: 45, youtube: 85, twitch: 85,
    freeFire: 45, pubg: 40, roblox: 60, fortnite: 50, minecraft: 55,
    mobileLegends: 45, codMobile: 40, valorant: 40, gaming: 45,
  },
  symbol: {
    instagram: 80, facebook: 75, x: 70, tiktok: 85, whatsapp: 80, discord: 85,
    snapchat: 85, telegram: 80, linkedin: 65, youtube: 80, twitch: 85,
    freeFire: 90, pubg: 90, roblox: 85, fortnite: 88, minecraft: 85,
    mobileLegends: 90, codMobile: 90, valorant: 88, gaming: 88,
  },
  decorated: {
    instagram: 92, facebook: 85, x: 65, tiktok: 90, whatsapp: 88, discord: 90,
    snapchat: 88, telegram: 85, linkedin: 55, youtube: 88, twitch: 90,
    freeFire: 92, pubg: 92, roblox: 85, fortnite: 90, minecraft: 85,
    mobileLegends: 92, codMobile: 92, valorant: 90, gaming: 90,
  },
};

/** Resolved compatibility score (0..100) for a style on a given app. */
export function compatScore(style: TextStyle, appKey: PlatformKey): number {
  if (typeof style.platforms?.[appKey] === "number") return style.platforms[appKey] as number;
  return CATEGORY_SCORES[style.category][appKey] ?? 0;
}

/** Styles for an app: scores >= 40, sorted by compatibility (then name). */
export function sortForApp(styles: TextStyle[], appKey: PlatformKey): TextStyle[] {
  return styles
    .filter((s) => !s.hidden && compatScore(s, appKey) >= 40)
    .sort((a, b) => {
      const diff = compatScore(b, appKey) - compatScore(a, appKey);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });
}

export type CompatibilityLevel =
  | "recommended"
  | "good"
  | "uncertain"
  | "risky"
  | "tooLong";

export interface CompatibilityResult {
  level: CompatibilityLevel;
  label: string;
  score: number;
  tooLong: boolean;
}

/**
 * Human-readable compatibility verdict for a converted style on an app.
 * `tooLong` is advisory. When `activeLimit` is provided it is the limit of
 * the use case currently being edited; otherwise the app's strictest limit
 * is used as a fallback.
 */
export function compatibilityFor(
  style: TextStyle,
  appKey: PlatformKey,
  app: AppConfig | undefined,
  convertedLength: number,
  activeLimit?: number | null,
): CompatibilityResult {
  const score = compatScore(style, appKey);
  const limits = app?.characterLimits;
  const strictest = limits
    ? Math.min(...Object.values(limits).filter((v): v is number => typeof v === "number"))
    : Number.POSITIVE_INFINITY;
  const limit = typeof activeLimit === "number" && activeLimit > 0 ? activeLimit : strictest;
  const tooLong = Number.isFinite(limit) && convertedLength > limit;

  let level: CompatibilityLevel;
  if (tooLong) level = "tooLong";
  else if (score >= 85) level = "recommended";
  else if (score >= 60) level = "good";
  else if (score >= 40) level = "uncertain";
  else level = "risky";

  const label =
    level === "recommended"
      ? "Recommended"
      : level === "good"
        ? "Usually works"
        : level === "uncertain"
          ? "May not display everywhere"
          : level === "tooLong"
            ? "Too long for this field"
            : app?.type === "gaming"
              ? "Nickname may reject this"
              : "May not display everywhere";

  return { level, label, score, tooLong };
}
