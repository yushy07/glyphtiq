/**
 * fix-mojibake.mjs
 * Fixes double-encoded UTF-8 (mojibake) in apps.ts preset strings.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const CP1252_BYTE_TO_UNICODE = new Map([
  [0x80, 0x20ac],[0x82, 0x201a],[0x83, 0x0192],[0x84, 0x201e],
  [0x85, 0x2026],[0x86, 0x2020],[0x87, 0x2021],[0x88, 0x02c6],
  [0x89, 0x2030],[0x8a, 0x0160],[0x8b, 0x2039],[0x8c, 0x0152],
  [0x8e, 0x017d],[0x91, 0x2018],[0x92, 0x2019],[0x93, 0x201c],
  [0x94, 0x201d],[0x95, 0x2022],[0x96, 0x2013],[0x97, 0x2014],
  [0x98, 0x02dc],[0x99, 0x2122],[0x9a, 0x0161],[0x9b, 0x203a],
  [0x9c, 0x0153],[0x9e, 0x017e],[0x9f, 0x0178],
]);

const UNICODE_TO_CP1252_BYTE = new Map();
for (const [byte, unicode] of CP1252_BYTE_TO_UNICODE) {
  UNICODE_TO_CP1252_BYTE.set(unicode, byte);
}

function charToWin1252Byte(char) {
  const cp = char.codePointAt(0);
  if (cp === undefined) return null;
  if (cp <= 0x7f) return cp;
  if (UNICODE_TO_CP1252_BYTE.has(cp)) return UNICODE_TO_CP1252_BYTE.get(cp);
  if (cp <= 0xff) return cp;
  return null;
}

function decodeMojibake(str) {
  const bytes = [];
  for (const char of str) {
    const byte = charToWin1252Byte(char);
    if (byte === null) return null;
    bytes.push(byte);
  }
  try {
    const buf = Buffer.from(bytes);
    const decoded = buf.toString("utf8");
    if (decoded.includes("\uFFFD")) return null;
    return decoded;
  } catch { return null; }
}

function looksLikeMojibake(str) {
  return /[\u00C0-\u00FF]/.test(str);
}

function fixFileContent(source) {
  let fixCount = 0;
  const result = source.replace(
    /(["'])([^\r\n"'\\]*(?:\\.[^\r\n"'\\]*)*)\1/g,
    (match, quote, content) => {
      const raw = content.replace(/\\([\s\S])/g, "$1");
      if (!looksLikeMojibake(raw)) return match;
      const fixed = decodeMojibake(raw);
      if (!fixed || fixed === raw) return match;
      const escaped = fixed
        .replace(/\\/g, "\\\\")
        .replace(new RegExp(quote, "g"), `\\${quote}`);
      fixCount++;
      return `${quote}${escaped}${quote}`;
    }
  );
  console.log(`  Fixed ${fixCount} string literal(s).`);
  return result;
}

const FILES_TO_FIX = ["lib/text-engine/apps.ts"];
let totalFixed = 0;
for (const relPath of FILES_TO_FIX) {
  const fullPath = path.join(ROOT, relPath);
  console.log(`Processing: ${relPath}`);
  const original = readFileSync(fullPath, "utf8");
  const fixed = fixFileContent(original);
  if (fixed !== original) {
    writeFileSync(fullPath, fixed, "utf8");
    console.log("  Written.");
    totalFixed++;
  } else {
    console.log("  No changes needed.");
  }
}
console.log(`Done. ${totalFixed} file(s) updated.`);
