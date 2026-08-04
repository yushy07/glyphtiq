import { describe, expect, it } from "vitest";
import { APP_CONFIGS } from "@/lib/text-engine/apps";
import { curatedForApp } from "@/lib/text-engine/curation";
import {
  EXPLORER_COUNT,
  HIGHLIGHTS,
  HIGHLIGHTS_CAP,
  bestStylesForApp,
  highlightsPool,
  homeCollections,
  isHighlighted,
} from "@/lib/text-engine/discovery";
import { getStyleById, STYLES } from "@/lib/text-engine/styles";
import { isVariant } from "@/lib/text-engine/variants";

describe("homepage highlights pool", () => {
  it("stays within the cap and stays unique", () => {
    expect(HIGHLIGHTS.length).toBeLessThanOrEqual(HIGHLIGHTS_CAP);
    expect(HIGHLIGHTS.length).toBeGreaterThanOrEqual(24);
    expect(new Set(HIGHLIGHTS).size).toBe(HIGHLIGHTS.length);
  });

  it("only references styles that exist and are canonicals", () => {
    for (const id of HIGHLIGHTS) {
      const style = getStyleById(id);
      expect(style, `missing highlight ${id}`).toBeDefined();
      expect(isVariant(id), `${id} must be a canonical`).toBe(false);
    }
  });

  it("every highlight converts real text", () => {
    for (const style of highlightsPool()) {
      expect(typeof style.convert("Glyphy")).toBe("string");
      expect(style.convert("Glyphy").length).toBeGreaterThan(0);
    }
  });
});

describe("homepage discovery shelves", () => {
  it("resolves every shelf with cards", () => {
    const collections = homeCollections();
    expect(collections.length).toBeGreaterThanOrEqual(5);
    for (const collection of collections) {
      expect(collection.styles.length, `empty shelf ${collection.label}`).toBeGreaterThan(0);
    }
  });

  it("every shelf card lives inside the highlights pool (scroll target exists)", () => {
    const pool = new Set(HIGHLIGHTS);
    for (const collection of homeCollections()) {
      for (const style of collection.styles) {
        expect(pool.has(style.id), `${collection.label} card ${style.id} not in pool`).toBe(true);
      }
    }
  });

  it("isHighlighted accepts pool members and their variants", () => {
    expect(isHighlighted("bold")).toBe(true);
    expect(isHighlighted("kawaiiHearts")).toBe(true);
    expect(isHighlighted("boldFraktur")).toBe(true); // variant of fraktur
    expect(isHighlighted("superscript")).toBe(false);
  });
});

describe("app best styles", () => {
  it("stays within the cap and inside the curated collection", () => {
    for (const app of APP_CONFIGS) {
      const best = bestStylesForApp(app.key);
      expect(best.length, `${app.key} has ${best.length}`).toBeGreaterThanOrEqual(10);
      expect(best.length, `${app.key} best too large`).toBeLessThanOrEqual(40);
      const curatedIds = new Set(curatedForApp(app.key).map((s) => s.id));
      for (const style of best) {
        expect(curatedIds.has(style.id), `${app.key} best ${style.id} not curated`).toBe(true);
      }
      expect(new Set(best.map((s) => s.id)).size).toBe(best.length);
    }
  });

  it("leads with the persona signature styles", () => {
    const instagram = bestStylesForApp("instagram").map((s) => s.id);
    expect(instagram[0]).toBe("script");
    const pubg = bestStylesForApp("pubg").map((s) => s.id);
    expect(pubg.slice(0, 3)).toContain("spiralBox");
  });
});

describe("explorer count", () => {
  it("matches the visible library size", () => {
    expect(EXPLORER_COUNT).toBe(STYLES.filter((s) => !s.hidden).length);
    expect(EXPLORER_COUNT).toBeGreaterThan(200);
  });
});
