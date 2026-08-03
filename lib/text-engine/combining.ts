/** Combining marks used by underline, strike, glitch and zalgo styles. */
export const COMBINING = {
  lowLine: "\u0332",
  doubleLowLine: "\u0333",
  tildeBelow: "\u0330",
  underDot: "\u0323",
  overline: "\u0305",
  doubleOverline: "\u033F",
  longStrike: "\u0336",
  shortStrike: "\u0335",
  slash: "\u0338",
  verticalAbove: "\u030D",
  verticalBelow: "\u0310",
  acute: "\u0301",
  macron: "\u0304",
  caron: "\u030C",
  grave: "\u0300",
  circumflex: "\u0302",
  umlaut: "\u0308",
  doubleAcute: "\u030B",
  hookAbove: "\u0309",
  ringAbove: "\u030A",
  breve: "\u0306",
  overdot: "\u0307",
  tildeAbove: "\u0303",
  shortSolidus: "\u0337",
  doubleTilde: "\u0360",
  invertedBreve: "\u0311",
  doubleInvertedBreve: "\u0353",
  leftHalfRing: "\u0358",
  doubleVerticalAbove: "\u030E",
  doubleGrave: "\u030F",
  commaAboveRight: "\u0315",
  cedilla: "\u0327",
  ogonek: "\u0328",
  tildeOverlay: "\u0334",
  xAbove: "\u036D",
  ZALGO_UP: [
    "\u030D",
    "\u0300",
    "\u0301",
    "\u0310",
    "\u033D",
    "\u0360",
    "\u035C",
    "\u0361",
    "\u030E",
  ],
  ZALGO_DOWN: [
    "\u0316",
    "\u0317",
    "\u0318",
    "\u0319",
    "\u031C",
    "\u0323",
    "\u0330",
    "\u0339",
    "\u032E",
    "\u032F",
  ],
  GLITCH: [
    "\u0338",
    "\u0305",
    "\u0323",
    "\u0336",
    "\u033F",
    "\u0361",
    "\u030D",
    "\u0310",
  ],
} as const;

/** True for spaces, tabs and other whitespace (but not newlines — handled separately). */
export function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

const EMOJI_RE = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]/u;

export function isEmoji(char: string): boolean {
  return EMOJI_RE.test(char);
}

/** Small deterministic PRNG so zalgo/glitch output is reproducible for tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(rand: () => number, max: number): number {
  return Math.floor(rand() * (max + 1));
}

export function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[randomInt(rand, arr.length - 1)];
}
