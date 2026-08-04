import { describe, expect, it } from "vitest";
import { SYMBOL_CATEGORIES, SYMBOL_CATEGORY_LIST, getCategory } from "@/lib/symbols/categories";
import {
  HANDCRAFTED_COLLECTIONS,
  SYMBOL_COLLECTIONS,
  getCollection,
  symbolsInCollection,
} from "@/lib/symbols/collections";
import {
  getSymbolByChar,
  getSymbolByCodePoint,
  getSymbolBySlug,
  getSymbolCount,
  getSymbolsByCategory,
  getTopSymbols,
  symbols,
} from "@/lib/symbols/data";
import {
  charFromCodePoint,
  codePointFromChar,
  escapePreview,
  fromUnicodeEscape,
  getCopyVariants,
  toCssEscape,
  toHtmlEntity,
  toJsEscape,
  toUnicodeEscape,
  toUrlEncoded,
} from "@/lib/symbols/encoding";
import { getRelatedSymbols } from "@/lib/symbols/related";
import { searchSymbols } from "@/lib/symbols/search";
import { sortSymbols } from "@/lib/symbols/rank";

describe("symbol dataset integrity", () => {
  it("has a healthy dataset exceeding 5,000 symbols", () => {
    expect(getSymbolCount()).toBeGreaterThan(5000);
  });

  it("has unique code points and slugs", () => {
    expect(new Set(symbols.map((s) => s.codePoint)).size).toBe(symbols.length);
    expect(new Set(symbols.map((s) => s.slug)).size).toBe(symbols.length);
  });

  it("every entry has a valid char, name, keywords and popularity range", () => {
    for (const s of symbols) {
      expect(s.char.length).toBeGreaterThan(0);
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.keywords.length).toBeGreaterThan(0);
      expect(s.popularity).toBeGreaterThanOrEqual(0);
      expect(s.popularity).toBeLessThanOrEqual(100);
    }
  });
});

describe("symbol search & related", () => {
  it("searches symbols by weighted rank", () => {
    const results = searchSymbols("heart");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain("heart");
  });

  it("finds related symbols", () => {
    const heart = getSymbolByCodePoint("2764")!;
    const related = getRelatedSymbols(heart, 6);
    expect(related.length).toBe(6);
  });
});

describe("symbol encoding", () => {
  it("provides JS escape, CSS escape, and copy variants", () => {
    expect(toJsEscape("2764")).toBe("\\u{2764}");
    expect(toCssEscape("2764")).toBe("\\2764");
    expect(toUrlEncoded("❤")).toBe("%E2%9D%A4");
    const variants = getCopyVariants("❤", "2764");
    expect(variants.some((v) => v.label === "JS Escape (ES6)" && v.value === "\\u{2764}")).toBe(true);
  });
});
