import { COMBINING, isWhitespace, isEmoji, mulberry32, pick, randomInt } from "./combining";

const FLAG_OFFSET = 0x1f1e6 - 0x41;

/** Builds a map turning A-Z/a-z into regional-indicator flag letters. */
export function buildFlagMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    const cp = 0x41 + i;
    map[String.fromCharCode(cp)] = String.fromCodePoint(FLAG_OFFSET + cp);
    map[String.fromCharCode(0x61 + i)] = String.fromCodePoint(FLAG_OFFSET + cp);
  }
  return map;
}

const UPSIDE_DOWN_LETTERS: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ",
  j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
  s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I",
  J: "ſ", K: "ʞ", L: "˥", M: "M", N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ᴚ",
  S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
};

const UPSIDE_DOWN_EXTRA: Record<string, string> = {
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9",
  "7": "ㄥ", "8": "8", "9": "6",
  "!": "¡", "?": "¿", ".": "˙", ",": "'", "'": ",", '"': "„", "(": ")",
  ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<",
  "_": "‾", "&": "⅋",
};

export function buildUpsideDownMap(): Record<string, string> {
  return { ...UPSIDE_DOWN_LETTERS, ...UPSIDE_DOWN_EXTRA };
}

/** Applies a combining mark to every printable, non-emoji character. */
export function applyPerChar(text: string, mark: string): string {
  return text
    .split("\n")
    .map((line) =>
      Array.from(line)
        .map((ch) => (isWhitespace(ch) || isEmoji(ch) ? ch : ch + mark))
        .join(""),
    )
    .join("\n");
}

/** Zalgo. intensity 0..100 controls how many marks are added per character. */
export function zalgo(text: string, intensity = 50): string {
  const clamped = Math.max(0, Math.min(100, intensity));
  const rand = mulberry32(1337);
  const maxUp = Math.round((clamped / 100) * 6);
  const maxDown = Math.round((clamped / 100) * 4);
  return text
    .split("\n")
    .map((line) =>
      Array.from(line)
        .map((ch) => {
          if (isWhitespace(ch) || isEmoji(ch)) return ch;
          let out = ch;
          for (let i = 0, n = randomInt(rand, maxUp); i < n; i++) {
            out += pick(rand, COMBINING.ZALGO_UP);
          }
          for (let i = 0, n = randomInt(rand, maxDown); i < n; i++) {
            out += pick(rand, COMBINING.ZALGO_DOWN);
          }
          return out;
        })
        .join(""),
    )
    .join("\n");
}

/** Glitch — random combining corruption. strength is roughly 1..4. */
export function glitch(text: string, strength = 2): string {
  const rand = mulberry32(99);
  return text
    .split("\n")
    .map((line) =>
      Array.from(line)
        .map((ch) => {
          if (isWhitespace(ch) || isEmoji(ch)) return ch;
          let out = ch;
          for (let i = 0, n = strength; i < n; i++) {
            out += pick(rand, COMBINING.GLITCH);
          }
          return out;
        })
        .join(""),
    )
    .join("\n");
}

/** Alternates a combining vertical line above/below each character. */
export function jitter(text: string): string {
  return text
    .split("\n")
    .map((line) =>
      Array.from(line)
        .map((ch, idx) =>
          isWhitespace(ch) || isEmoji(ch)
            ? ch
            : ch + (idx % 2 === 0 ? COMBINING.verticalAbove : COMBINING.verticalBelow),
        )
        .join(""),
    )
    .join("\n");
}

/** Wraps every line in left/right decoration strings. */
export function wrapLines(text: string, left: string, right: string): string {
  if (text === "") return "";
  return text
    .split("\n")
    .map((line) => left + line + right)
    .join("\n");
}

/** Inserts a separator between every character (whitespace preserved as-is). */
export function interleaveChars(text: string, separator: string): string {
  return text
    .split("\n")
    .map((line) => Array.from(line).join(separator))
    .join("\n");
}

/** Spaces letters apart while leaving existing whitespace untouched. */
export function interleaveNonSpace(text: string, separator: string): string {
  return text
    .split("\n")
    .map((line) => {
      const chars = Array.from(line);
      return chars
        .map((ch, i) => (isWhitespace(ch) ? ch : ch + (i < chars.length - 1 ? separator : "")))
        .join("");
    })
    .join("\n");
}

/** Replaces runs of spaces with a separator (word-level interleave). */
export function interleaveWords(text: string, separator: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/ +/g, separator))
    .join("\n");
}

/** AESTHETIC — fullwidth characters spaced with wide ideographic spaces. */
export function aestheticWide(text: string): string {
  return text
    .split("\n")
    .map((line) => Array.from(line).map((ch) => (isWhitespace(ch) ? ch : ch + "\u3000")).join("").trimEnd())
    .join("\n");
}

/** Reverses character order (mirrored). */
export function reverseText(text: string): string {
  return text
    .split("\n")
    .map((line) => Array.from(line).reverse().join(""))
    .join("\n");
}

/** Alternates case per letter, checkerboard-style. */
export function checkerboard(text: string): string {
  let flip = false;
  return text
    .split("\n")
    .map((line) =>
      Array.from(line)
        .map((ch) => {
          if (/[a-zA-Z]/.test(ch)) {
            flip = !flip;
            return flip ? ch.toUpperCase() : ch.toLowerCase();
          }
          return ch;
        })
        .join(""),
    )
    .join("\n");
}

/** sPoNgEbOb mocking case. */
export function mockCase(text: string): string {
  const rand = mulberry32(7);
  return text
    .split("\n")
    .map((line) =>
      Array.from(line)
        .map((ch) => {
          if (!/[a-zA-Z]/.test(ch)) return ch;
          return rand() > 0.5 ? ch.toUpperCase() : ch.toLowerCase();
        })
        .join(""),
    )
    .join("\n");
}

/** Adds a combining acute accent to vowels. */
export function vowelAccent(text: string): string {
  const vowels = /[aeiou]/i;
  return text
    .split("\n")
    .map((line) =>
      Array.from(line)
        .map((ch) => (vowels.test(ch) && !isEmoji(ch) ? ch + COMBINING.acute : ch))
        .join(""),
    )
    .join("\n");
}
