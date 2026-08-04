import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { SYMBOL_OVERLAYS } from "../lib/symbols/overrides.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data", "symbols");
const NAMES_DIR = path.join(DATA_DIR, "names");
const OUT_DIR = path.join(ROOT, "lib", "symbols");

const STOPWORDS = new Set([
  "the", "and", "of", "for", "with", "or", "to", "in", "on", "a", "an",
  "over", "between", "from", "into", "at",
]);

function toUnicodeEscape(cpHex) {
  const codePoint = parseInt(cpHex, 16);
  if (codePoint <= 0xffff) {
    return `\\u${cpHex.padStart(4, "0")}`;
  }
  const offset = codePoint - 0x10000;
  const high = 0xd800 + (offset >> 10);
  const low = 0xdc00 + (offset & 0x3ff);
  return `\\u${high.toString(16).toUpperCase()}\\u${low.toString(16).toUpperCase()}`;
}

function getCopyVariants(char, codePoint) {
  const cp = codePoint.toUpperCase();
  const cpInt = parseInt(cp, 16);
  return [
    { label: "Raw Symbol", value: char },
    { label: "Unicode Hex", value: `U+${cp}` },
    { label: "JS Escape (ES6)", value: `\\u{${cp}}` },
    { label: "Unicode Escape", value: toUnicodeEscape(cp) },
    { label: "HTML Entity (Dec)", value: `&#${cpInt};` },
    { label: "HTML Entity (Hex)", value: `&#x${cp};` },
    { label: "CSS Escape", value: `\\${cp.toLowerCase()}` },
    { label: "URL Encoded", value: encodeURIComponent(char) },
  ];
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveTags(name, hex, category, blockName) {
  const words = name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const set = new Set();
  for (const w of words) if (!STOPWORDS.has(w)) set.add(w);
  set.add(category);
  for (const word of blockName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) {
    if (!STOPWORDS.has(word)) set.add(word);
  }
  const overlay = SYMBOL_OVERLAYS[hex];
  if (overlay?.tags) {
    for (const t of overlay.tags) set.add(t);
  }
  return [...set];
}

function popularity(name, hex) {
  const overlay = SYMBOL_OVERLAYS[hex];
  if (overlay?.searchWeight != null) return overlay.searchWeight;
  const words = name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  let best = 40;
  for (const w of words) {
    if (w === "heart" || w === "star") best = Math.max(best, 95);
    if (w === "music" || w === "arrow" || w === "check") best = Math.max(best, 90);
  }
  return best;
}

async function main() {
  const blocks = JSON.parse(await readFile(path.join(DATA_DIR, "blocks.json"), "utf8"));
  const version = blocks.version;

  const names = {};
  for (const file of (await readdir(NAMES_DIR)).filter((f) => f.endsWith(".json")).sort()) {
    const data = JSON.parse(await readFile(path.join(NAMES_DIR, file), "utf8"));
    for (const [cp, name] of Object.entries(data.names)) {
      names[cp] = name;
    }
  }

  const entries = [];
  const seen = new Set();

  for (const block of blocks.blocks) {
    for (const [start, end] of block.ranges) {
      for (let cp = start; cp <= end; cp++) {
        if (seen.has(cp)) continue;
        const hex = cp.toString(16).toUpperCase().padStart(4, "0");
        const name = names[hex] ?? `${block.name} Character U+${hex}`;

        seen.add(cp);
        const char = String.fromCodePoint(cp);
        const tags = deriveTags(name, hex, block.category, block.name);
        const overlay = SYMBOL_OVERLAYS[hex];

        entries.push({
          char,
          codePoint: hex,
          name,
          keywords: tags,
          tags,
          category: block.category,
          block: block.key,
          unicodeVersion: version,
          popularity: popularity(name, hex),
          slug: null,

          age: version,
          aliases: overlay?.altNames ?? [],
          altNames: overlay?.altNames ?? [],
          synonyms: overlay?.synonyms ?? [],
          similarSlugs: [],
          copyVariants: getCopyVariants(char, hex),
          utf8: encodeURIComponent(char),
          cssEscape: `\\${hex.toLowerCase()}`,
          htmlEntityDec: `&#${cp};`,
          htmlEntityHex: `&#x${hex};`,
          searchWeight: overlay?.searchWeight ?? 50,
          featured: overlay?.featured ?? false,
        });
      }
    }
  }

  // Resolve slug collisions
  const used = new Map();
  for (const entry of entries) {
    let slug = slugify(entry.name);
    if (used.has(slug)) {
      slug = `${slug}-u${entry.codePoint.toLowerCase()}`;
    }
    used.set(slug, true);
    entry.slug = slug;
  }

  entries.sort((a, b) => a.codePoint.localeCompare(b.codePoint));

  const loader = [
    "// GENERATED FILE — do not edit. Regenerate with: node scripts/generate-symbols.mjs",
    'import raw from "./generated.json";',
    'import type { SymbolEntry } from "./types";',
    "",
    "export const symbols: SymbolEntry[] = raw as SymbolEntry[];",
    "",
  ].join("\n");

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, "generated.json"), `${JSON.stringify(entries, null, 2)}\n`);
  await writeFile(path.join(OUT_DIR, "generated.ts"), loader);

  console.log(`emitted lib/symbols/generated.json + generated.ts (${entries.length} high-utility symbols)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
