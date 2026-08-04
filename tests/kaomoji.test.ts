import { describe, expect, it } from "vitest";
import { KAOMOJI_CATEGORIES, KAOMOJI_CATEGORY_LIST, getKaomojiCategory } from "@/lib/kaomoji/categories";
import { getKaomojiBySlug, getKaomojiCount, getKaomojisByCategory, kaomojis } from "@/lib/kaomoji/data";
import { getRelatedKaomojis } from "@/lib/kaomoji/related";
import { searchKaomojis } from "@/lib/kaomoji/search";

describe("kaomoji dataset & categories", () => {
  it("has a healthy dataset exceeding 2,000 kaomojis", () => {
    expect(getKaomojiCount()).toBeGreaterThan(2000);
  });

  it("exposes 50 categories with valid metadata", () => {
    expect(KAOMOJI_CATEGORY_LIST.length).toBe(50);
    for (const cat of KAOMOJI_CATEGORY_LIST) {
      expect(cat.name.length).toBeGreaterThan(0);
      expect(cat.description.length).toBeGreaterThan(0);
      expect(getKaomojiCategory(cat.key).slug).toBe(cat.slug);
    }
  });

  it("finds kaomojis by slug and category", () => {
    const shrug = getKaomojiBySlug("classic-shrug");
    expect(shrug).toBeDefined();
    expect(shrug?.expression).toBe("¯\\_(ツ)_/¯");

    const happyList = getKaomojisByCategory("happy");
    expect(happyList.length).toBeGreaterThan(0);
  });
});

describe("kaomoji search & related", () => {
  it("searches kaomojis by emotion and tags", () => {
    const results = searchKaomojis("shrug");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((k) => k.expression.includes("ツ"))).toBe(true);
  });

  it("returns related kaomojis by category", () => {
    const shrug = getKaomojiBySlug("classic-shrug")!;
    const related = getRelatedKaomojis(shrug, 6);
    expect(related.length).toBe(6);
  });
});
