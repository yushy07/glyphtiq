import { describe, expect, it } from "vitest";
import { convertAll, convertToStyle, searchStyles, sortResults, stylesForApp } from "@/lib/text-engine/engine";
import { APP_CONFIGS, getAppByKey } from "@/lib/text-engine/apps";
import { curatedForApp, getAppSections } from "@/lib/text-engine/curation";
import { resolveStyleMetadata } from "@/lib/text-engine/quality";
import { STYLES, getStyleById } from "@/lib/text-engine/styles";
import { getCanonical, getVariants, groupVariants, isVariant } from "@/lib/text-engine/variants";
import type { PlatformKey } from "@/lib/text-engine/types";

const getApps = () => APP_CONFIGS;

describe("curated collections", () => {
  it("stays within the curated window and stays unique for every app", () => {
    for (const app of getApps()) {
      const curated = curatedForApp(app.key);
      expect(curated.length, `${app.key} has ${curated.length} styles`).toBeGreaterThanOrEqual(50);
      expect(curated.length, `${app.key} collection too large`).toBeLessThanOrEqual(80);
      const ids = curated.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(stylesForApp(app.key)).toEqual(curated);
    }
  });

  it("surfaces the everyday anchors for every app", () => {
    for (const app of getApps()) {
      const curated = curatedForApp(app.key);
      const ids = new Set(curated.map((s) => s.id));
      for (const anchor of ["bold", "monospace"]) {
        expect(ids.has(anchor), `${app.key} missing anchor ${anchor}`).toBe(true);
      }
    }
  });

  it("never orphans a variant from its canonical card", () => {
    for (const app of getApps()) {
      const curated = curatedForApp(app.key);
      const ids = new Set(curated.map((s) => s.id));
      for (const style of curated) {
        const canonical = getCanonical(style.id);
        if (canonical !== style.id) {
          expect(ids.has(canonical), `${app.key} orphans ${style.id}`).toBe(true);
        }
      }
    }
  });

  it("keeps signature groups together for core styles", () => {
    const discord = new Set(curatedForApp("discord").map((s) => s.id));
    expect(["zalgo", "zalgoHorror", "zalgoNightmare"].every((id) => discord.has(id))).toBe(true);
    const instagram = new Set(curatedForApp("instagram").map((s) => s.id));
    expect(["heartBox", "heartFullBox", "loveBox"].every((id) => instagram.has(id))).toBe(true);
  });

  it("persona cores reference real styles", () => {
    for (const app of getApps()) {
      const curated = curatedForApp(app.key);
      const ids = new Set(curated.map((s) => s.id));
      for (const id of ids) {
        expect(getStyleById(id), `missing style ${id}`).toBeDefined();
      }
    }
  });
});

describe("app sections", () => {
  it("leads with a populated Trending section", () => {
    for (const app of getApps()) {
      const sections = getAppSections(app.key);
      expect(sections.length).toBeGreaterThan(0);
      expect(sections[0].label).toBe("Trending");
      expect(sections[0].styles.length).toBeGreaterThan(0);
    }
  });

  it("renders curated intent sections for every app", () => {
    for (const app of getApps()) {
      const sections = getAppSections(app.key);
      for (const section of sections.slice(1)) {
        expect(section.styles.length, `${app.key} empty section ${section.label}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("variant grouping", () => {
  it("collapses variant groups into a single card", () => {
    const results = convertAll("x");
    const { cards, variantsByCanonical } = groupVariants(results);
    expect(cards.length).toBeLessThan(results.length);
    expect(Object.keys(variantsByCanonical).length).toBeGreaterThan(0);
    for (const [canonicalId, variants] of Object.entries(variantsByCanonical)) {
      expect(getCanonical(canonicalId)).toBe(canonicalId);
      expect(variants.every((v) => getCanonical(v.style.id) === canonicalId)).toBe(true);
    }
  });

  it("promotes a matching alternate when the canonical is filtered out", () => {
    const results = convertAll("x").filter((r) => r.style.id !== "zalgo");
    const { cards } = groupVariants(results);
    const zalgoCard = cards.find((c) => getCanonical(c.style.id) === "zalgo");
    expect(zalgoCard).toBeDefined();
    expect(zalgoCard!.style.id).not.toBe("zalgo");
    expect(isVariant(zalgoCard!.style.id)).toBe(true);
  });

  it("isVariant distinguishes alternates from canonicals", () => {
    expect(isVariant("zalgoNightmare")).toBe(true);
    expect(isVariant("zalgo")).toBe(false);
    expect(getVariants("zalgo")).toContain("zalgoNightmare");
    expect(getCanonical("zalgoNightmare")).toBe("zalgo");
  });
});

describe("families", () => {
  it("filters styles by family", () => {
    const gothic = searchStyles("", "all", "gothic");
    expect(gothic.length).toBeGreaterThan(0);
    for (const style of gothic) {
      expect(resolveStyleMetadata(style).families).toContain("gothic");
    }
  });

  it("every style resolves to at least one family", () => {
    for (const style of STYLES) {
      expect(resolveStyleMetadata(style).families.length, style.id).toBeGreaterThan(0);
    }
  });
});

describe("sorting", () => {
  it("orders by popularity when requested", () => {
    const results = convertAll("x");
    const sorted = sortResults(results, "popular");
    for (let i = 1; i < sorted.length; i++) {
      const a = resolveStyleMetadata(sorted[i - 1].style).popularity;
      const b = resolveStyleMetadata(sorted[i].style).popularity;
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it("recommended is the identity order", () => {
    const results = convertAll("x");
    expect(sortResults(results, "recommended").map((r) => r.style.id)).toEqual(
      results.map((r) => r.style.id),
    );
  });
});

describe("new styles", () => {
  it("converts the new lookalike alphabets", () => {
    expect(convertToStyle("Ab", "runic")).toBe("ᚨᛒ");
    expect(convertToStyle("Hi", "cyrillic")).toBe("НІ");
    expect(convertToStyle("Hi", "greek")).toBe("ΗΙ");
  });

  it("converts the new decorated wraps", () => {
    expect(convertToStyle("x", "spiralBox")).toBe("❃x❃");
    expect(convertToStyle("x", "hexCyberBox")).toBe("⬢x⬢");
    expect(convertToStyle("x", "fireBox")).toBe("✴x✴");
  });

  it("converts the new framing styles", () => {
    expect(convertToStyle("x", "caged")).toBe("【x】");
    expect(convertToStyle("x", "boxFrame")).toBe("┌───┐\n│ x │\n└───┘");
  });

  it("converts the new combining styles", () => {
    expect(convertToStyle("a", "xAbove")).toBe("a\u036D");
    expect(convertToStyle("a", "doubleGrave")).toBe("a\u030F");
    expect(convertToStyle("a", "invertedBreve")).toBe("a\u0311");
    expect(convertToStyle("a", "strikeWave")).toBe("a\u0336\u0360");
  });

  it("app persona cores only reference styles that exist and convert", () => {
    for (const app of getApps()) {
      const curated = curatedForApp(app.key);
      for (const style of curated) {
        const out = style.convert("Glyphtiq", { zalgoIntensity: 50 });
        expect(typeof out).toBe("string");
        expect(out.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("per-app compatibility", () => {
  it("gaming apps rank symbolic box styles for clan tags", () => {
    const pubg = curatedForApp("pubg");
    const pubgIds = pubg.map((s) => s.id);
    expect(pubgIds.slice(0, 12)).toContain("spiralBox");
  });

  it("social apps surface aesthetic and script styles", () => {
    const instagram = curatedForApp("instagram");
    const ids = new Set(instagram.map((s) => s.id));
    expect(ids.has("script")).toBe(true);
    expect(ids.has("aestheticWide")).toBe(true);
  });

  it("every app key resolves a config", () => {
    for (const app of getApps()) {
      expect(getAppByKey(app.key as PlatformKey)).toBeDefined();
    }
  });
});
