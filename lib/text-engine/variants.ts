import type { ConvertedResult } from "./types";

/**
 * Manually curated groups of visually similar styles. The key of each group
 * is the canonical style id — the one shown as a card by default. The
 * remaining entries are alternates revealed via the card's
 * "Similar styles" action. Groups are authored by hand (not computed) so
 * nothing is ever grouped by accident.
 *
 * Variants stay fully functional: they convert, are shareable, can be
 * favorited and copied — they are just hidden from the main grid.
 */
export const VARIANT_GROUPS: Record<string, string[]> = {
  fraktur: ["fraktur", "boldFraktur"],
  script: ["script", "boldScript"],
  zalgo: ["zalgo", "zalgoMini", "zalgoLight", "zalgoHeavy", "zalgoHorror", "zalgoNightmare"],
  glitch: ["glitch", "glitchHeavy", "glitchFlicker", "glitchStatic", "glitchVhs", "jitter"],
  strike: ["strike", "strikeShort", "strikeSlash", "strikeShortSlash", "strikeDouble"],
  starBox: [
    "starBox",
    "starDoubleBox",
    "starTripleBox",
    "starFillBox",
    "starFillDoubleBox",
    "starOutlineBox",
    "starEightBox",
    "starFlowerBox",
  ],
  heartBox: ["heartBox", "heartFullBox", "loveBox", "floralHeartBox"],
  checkBox: ["checkBox", "checkAltBox", "crossXBox", "crossAltBox"],
  diamondBox: ["diamondBox", "diamondThinBox", "diamondFillBox"],
  flowerBox: ["flowerBox", "flowerAltBox", "flowerWhiteBox", "leafBox"],
  moonBox: ["moonBox", "crescentBox"],
  tildeBox: ["tildeBox", "tripleTildeBox", "waveBox"],
  angleBox: ["angleBox", "doubleAngleBox", "pointyBox"],
  cornerBox: ["cornerBox", "cornerBottomBox"],
  japaneseBox: ["japaneseBox", "japaneseDoubleBox"],
  triangleUpBox: ["triangleUpBox", "triangleDownBox", "triangleFillBox"],
  dotJoin: ["dotJoin", "dotNonSpaceJoin", "dotWordJoin", "dotCaseWords"],
  starJoin: ["starJoin", "starWordJoin", "starNonSpaceJoin"],
  heartJoin: ["heartJoin", "heartWordJoin", "heartNonSpaceJoin"],
  slashJoin: ["slashJoin", "slashWordJoin"],
  dashJoin: ["dashJoin", "dashWordJoin", "kebabCase"],
  underscoreJoin: ["underscoreJoin", "underscoreWordJoin", "snakeCase"],
  arrowJoin: ["arrowJoin", "arrowNonSpaceJoin", "arrowWordJoin"],
};

const REVERSE: Map<string, string> = new Map();
for (const [canonical, ids] of Object.entries(VARIANT_GROUPS)) {
  for (const id of ids) REVERSE.set(id, canonical);
}

/** The canonical style id for a given style id (identity for canonicals). */
export function getCanonical(id: string): string {
  return REVERSE.get(id) ?? id;
}

/** True when a style id is a non-canonical alternate of some canonical. */
export function isVariant(id: string): boolean {
  const canonical = REVERSE.get(id);
  return canonical !== undefined && canonical !== id;
}

/** Alternate style ids for a style (empty for styles without variants). */
export function getVariants(id: string): string[] {
  const canonical = REVERSE.get(id) ?? id;
  return (VARIANT_GROUPS[canonical] ?? []).filter((v) => v !== id);
}

/**
 * Splits results into canonical cards and variant groups. Only one card is
 * shown per group; if the canonical itself did not pass the current filter
 * but an alternate did, the first matching alternate is promoted to the
 * card so no variant is ever orphaned. Group order follows the first
 * occurrence of a group's card in `results`.
 */
export function groupVariants(results: ConvertedResult[]): {
  cards: ConvertedResult[];
  variantsByCanonical: Record<string, ConvertedResult[]>;
} {
  const groups = new Map<string, ConvertedResult[]>();
  for (const result of results) {
    const canonical = getCanonical(result.style.id);
    const list = groups.get(canonical);
    if (list) list.push(result);
    else groups.set(canonical, [result]);
  }

  const cards: ConvertedResult[] = [];
  const variantsByCanonical: Record<string, ConvertedResult[]> = {};
  for (const [canonicalId, group] of groups) {
    const canonicalResult = group.find((r) => r.style.id === canonicalId);
    const card = canonicalResult ?? group[0];
    cards.push(card);
    const rest = group.filter((r) => r !== card);
    if (rest.length > 0) variantsByCanonical[card.style.id] = rest;
  }
  return { cards, variantsByCanonical };
}
