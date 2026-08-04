import { describe, expect, it } from "vitest";
import { APP_CONFIGS } from "@/lib/text-engine/apps";
import { getAppSections } from "@/lib/text-engine/curation";
import { bestStylesForApp, HIGHLIGHTS, HIGHLIGHTS_CAP, homeCollections } from "@/lib/text-engine/discovery";
import { FAMILY_LABELS, searchStyles } from "@/lib/text-engine/engine";
import { resolveStyleMetadata } from "@/lib/text-engine/quality";
import { STYLES } from "@/lib/text-engine/styles";

/** Glyphy v2 product flow guardrails. These are the non-negotiables:
 *  6–8 card shelves, fixed mood order, pool-canonical Best grid, and a
 *  global Explorer search. */

const MOOD_ORDER = ["Trending", "Aesthetic", "Gaming", "Luxury", "Cute", "Futuristic"];

describe("roadmap: homepage discovery shelves", () => {
  it("renders exactly the six fixed mood shelves in order (never alphabetical)", () => {
    const labels = homeCollections().map((s) => s.label);
    expect(labels).toEqual(MOOD_ORDER);
  });

  it("every shelf holds 6-8 cards", () => {
    for (const shelf of homeCollections()) {
      expect(shelf.styles.length, `${shelf.label} has ${shelf.styles.length}`).toBeGreaterThanOrEqual(6);
      expect(shelf.styles.length, `${shelf.label} has ${shelf.styles.length}`).toBeLessThanOrEqual(8);
    }
  });

  it("every shelf card lives in the canonical pool (scroll target exists)", () => {
    const pool = new Set(HIGHLIGHTS);
    for (const shelf of homeCollections()) {
      for (const style of shelf.styles) {
        expect(pool.has(style.id), `${shelf.label} card ${style.id} not in pool`).toBe(true);
      }
    }
  });

  it("the best-styles pool stays canonical, unique and within cap", () => {
    expect(HIGHLIGHTS.length).toBeLessThanOrEqual(HIGHLIGHTS_CAP);
    expect(new Set(HIGHLIGHTS).size).toBe(HIGHLIGHTS.length);
  });
});

describe("roadmap: app shelves", () => {
  it("every app shelf holds at least 6 cards", () => {
    for (const app of APP_CONFIGS) {
      const sections = getAppSections(app.key, [], bestStylesForApp(app.key));
      for (const section of sections) {
        expect(section.styles.length, `${app.key} ${section.label} has ${section.styles.length}`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("every app shelf card exists in that app's best set", () => {
    for (const app of APP_CONFIGS) {
      const best = new Set(bestStylesForApp(app.key).map((s) => s.id));
      for (const section of getAppSections(app.key, [], bestStylesForApp(app.key))) {
        for (const style of section.styles) {
          expect(best.has(style.id), `${app.key} ${section.label} card ${style.id}`).toBe(true);
        }
      }
    }
  });

  it("trending leads every app's shelves", () => {
    for (const app of APP_CONFIGS) {
      const sections = getAppSections(app.key, [], bestStylesForApp(app.key));
      expect(sections[0].label).toBe("Trending");
    }
  });
});

describe("roadmap: explorer search is global", () => {
  it("matches by family label", () => {
    const label = FAMILY_LABELS.elegant.toLowerCase();
    const hits = searchStyles(label);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((s) => resolveStyleMetadata(s).families.includes("elegant"))).toBe(true);
  });

  it("matches by family key", () => {
    const hits = searchStyles("gaming");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((s) => resolveStyleMetadata(s).families.includes("gaming"))).toBe(true);
  });

  it("matches by recommended platform name", () => {
    const recIds = new Set(
      STYLES.filter((s) => resolveStyleMetadata(s).recommendedPlatforms.includes("instagram")).map((s) => s.id),
    );
    expect(recIds.size).toBeGreaterThan(0);
    const hits = searchStyles("instagram");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((s) => recIds.has(s.id))).toBe(true);
  });
});
