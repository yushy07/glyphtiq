import { applyUnicodeStyle, DECORATIONS } from "./decorations";
import { PLATFORMS } from "./platforms";
import { THEMES } from "./themes";
import type { PlatformId, UsernameResult, UsernameScore, UsernameThemeKey } from "./types";

interface GenerateOptions {
  baseName?: string;
  theme?: UsernameThemeKey;
  platform?: PlatformId;
  decorationId?: string;
  fontId?: string;
  limit?: number;
}

function calculateScore(
  username: string,
  platformId: PlatformId,
  hasDecoration: boolean,
  hasUnicode: boolean,
): UsernameScore {
  const platform = PLATFORMS[platformId];
  let compatibility = 100;

  // Platform rule validation checks
  if (username.length > platform.maxLen || username.length < platform.minLen) {
    compatibility -= 40;
  }
  if (!platform.allowUnicode && hasUnicode) {
    compatibility -= 50;
  }
  if (!platform.allowSpaces && username.includes(" ")) {
    compatibility -= 60;
  }

  compatibility = Math.max(0, compatibility);

  const readability = hasUnicode ? 70 : 95;
  const memorability = username.length <= 12 ? 90 : 75;
  const uniqueness = hasDecoration ? 95 : 85;
  const style = hasUnicode || hasDecoration ? 90 : 80;

  const totalScore = Math.round(
    compatibility * 0.4 + readability * 0.2 + memorability * 0.15 + uniqueness * 0.15 + style * 0.1,
  );

  return {
    compatibility,
    readability,
    memorability,
    uniqueness,
    style,
    totalScore,
  };
}

function getCompatiblePlatforms(username: string, hasUnicode: boolean): PlatformId[] {
  const compatible: PlatformId[] = [];
  for (const [id, rules] of Object.entries(PLATFORMS)) {
    if (
      username.length >= rules.minLen &&
      username.length <= rules.maxLen &&
      (!hasUnicode || rules.allowUnicode) &&
      (!username.includes(" ") || rules.allowSpaces)
    ) {
      compatible.push(id as PlatformId);
    }
  }
  return compatible;
}

export function generateUsernames(options: GenerateOptions = {}): UsernameResult[] {
  const limit = options.limit ?? 30;
  const targetThemeKey = options.theme ?? "minimal";
  const targetPlatformId = options.platform ?? "instagram";
  const theme = THEMES[targetThemeKey] ?? THEMES.minimal;

  const results: UsernameResult[] = [];
  const base = options.baseName ? options.baseName.trim() : "";

  const decoration = DECORATIONS.find((d) => d.id === options.decorationId) ?? DECORATIONS[0];

  let idCounter = 1;

  // Pattern 1: Base Name permutations
  if (base) {
    const variations = [
      `${base}X`,
      `Its${base}`,
      `${base}OP`,
      `${base}.exe`,
      `${base}YT`,
      `Real${base}`,
      `${base}HQ`,
      `Not${base}`,
      `${base}Vibes`,
      `${base}Mode`,
    ];

    for (const varName of variations) {
      const decorated = `${decoration.prefix}${varName}${decoration.suffix}`;
      const styled = options.fontId ? applyUnicodeStyle(decorated, options.fontId) : decorated;
      const hasUnicode = options.fontId != null && options.fontId !== "normal";

      const score = calculateScore(styled, targetPlatformId, decoration.id !== "clean", hasUnicode);
      const compatiblePlatforms = getCompatiblePlatforms(styled, hasUnicode);

      results.push({
        id: `un-${idCounter++}`,
        username: styled,
        rawName: varName,
        theme: targetThemeKey,
        platform: targetPlatformId,
        score,
        decoration: decoration.id,
        fontStyle: options.fontId,
        compatiblePlatforms,
      });
    }
  }

  // Pattern 2: Theme Combinatorics (Prefix + Core + Suffix)
  for (const prefix of theme.prefixes) {
    for (const core of theme.cores) {
      if (results.length >= limit * 2) break;

      const raw = base ? `${prefix}${base}` : `${prefix}${core}`;
      const decorated = `${decoration.prefix}${raw}${decoration.suffix}`;
      const styled = options.fontId ? applyUnicodeStyle(decorated, options.fontId) : decorated;
      const hasUnicode = options.fontId != null && options.fontId !== "normal";

      const score = calculateScore(styled, targetPlatformId, decoration.id !== "clean", hasUnicode);
      const compatiblePlatforms = getCompatiblePlatforms(styled, hasUnicode);

      results.push({
        id: `un-${idCounter++}`,
        username: styled,
        rawName: raw,
        theme: targetThemeKey,
        platform: targetPlatformId,
        score,
        decoration: decoration.id,
        fontStyle: options.fontId,
        compatiblePlatforms,
      });
    }
  }

  // Return top curated results sorted by Total Quality Score
  return results.sort((a, b) => b.score.totalScore - a.score.totalScore).slice(0, limit);
}
