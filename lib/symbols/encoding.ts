import type { SymbolCopyVariant } from "./types";

/**
 * Encoding helpers for displaying and copying symbol code points.
 * All functions take/return uppercase hex strings like "2600" or "1F600".
 */

function toInt(codePoint: string): number {
  return parseInt(codePoint, 16);
}

/** Uppercase hex for a code point value. */
export function toHex(value: number, pad = 4): string {
  return value.toString(16).toUpperCase().padStart(pad, "0");
}

/** The actual character for a hex code point. */
export function charFromCodePoint(codePoint: string): string {
  return String.fromCodePoint(toInt(codePoint));
}

/** Hex code point (uppercase) for a character, e.g. "☀" -> "2600". */
export function codePointFromChar(char: string): string {
  return toHex(char.codePointAt(0)!);
}

/** JS \u{XXXX} variable length escape. */
export function toJsEscape(codePoint: string): string {
  return `\\u{${codePoint.toUpperCase()}}`;
}

/** \u2600 for BMP, surrogate-pair \uD83D\uDE00 for astral characters. */
export function toUnicodeEscape(codePoint: string): string {
  const cp = toInt(codePoint);
  if (cp <= 0xffff) return `\\u${toHex(cp)}`;
  const offset = cp - 0x10000;
  const high = 0xd800 + (offset >> 10);
  const low = 0xdc00 + (offset & 0x3ff);
  return `\\u${toHex(high)}\\u${toHex(low)}`;
}

/** CSS \2600 escape string. */
export function toCssEscape(codePoint: string): string {
  return `\\${codePoint.toLowerCase()}`;
}

/** Parses a string containing \uXXXX escapes back into characters. */
export function fromUnicodeEscape(input: string): string {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
}

/** HTML entity, e.g. "2600" -> "&#9732;" or hex form "&#x2600;". */
export function toHtmlEntity(codePoint: string, hex = false): string {
  const cp = toInt(codePoint);
  return hex ? `&#x${toHex(cp)};` : `&#${cp};`;
}

/** Escaped display preview, e.g. "\u2600" or "\uD83D\uDE00". */
export function escapePreview(char: string): string {
  return toUnicodeEscape(toHex(char.codePointAt(0)!));
}

/** URL encoded representation of character, e.g. "%E2%98%80". */
export function toUrlEncoded(char: string): string {
  return encodeURIComponent(char);
}

/** Pre-rendered variants for copy buttons on symbol detail pages. */
export function getCopyVariants(char: string, codePoint: string): SymbolCopyVariant[] {
  return [
    { label: "Raw Symbol", value: char },
    { label: "Unicode Hex", value: `U+${codePoint}` },
    { label: "JS Escape (ES6)", value: toJsEscape(codePoint) },
    { label: "Unicode Escape", value: toUnicodeEscape(codePoint) },
    { label: "HTML Entity (Dec)", value: toHtmlEntity(codePoint, false) },
    { label: "HTML Entity (Hex)", value: toHtmlEntity(codePoint, true) },
    { label: "CSS Escape", value: toCssEscape(codePoint) },
    { label: "URL Encoded", value: toUrlEncoded(char) },
  ];
}
