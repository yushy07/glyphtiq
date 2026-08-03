import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  STYLE_COUNT,
  convertAll,
  convertToStyle,
  searchStyles,
} from "@/lib/text-engine/engine";
import { APP_CONFIGS, limitForUseCase } from "@/lib/text-engine/apps";
import { sanitizeText } from "@/lib/sanitize";
import { clampText, getPaginationItems } from "@/lib/utils";

describe("style library", () => {
  it("exposes at least 100 functional styles", () => {
    expect(STYLE_COUNT).toBeGreaterThanOrEqual(100);
  });

  it("covers every declared category", () => {
    const styles = convertAll("x");
    for (const category of CATEGORIES) {
      expect(
        styles.some((r) => r.style.category === category),
        `missing category: ${category}`,
      ).toBe(true);
    }
  });

  it("has unique style ids", () => {
    const ids = convertAll("x").map((r) => r.style.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("font conversion", () => {
  it("converts bold letters", () => {
    expect(convertToStyle("Hello", "bold")).toBe("𝐇𝐞𝐥𝐥𝐨");
  });

  it("converts both cases", () => {
    expect(convertToStyle("AbZ", "fraktur")).toBe("𝔄𝔟ℨ");
  });

  it("preserves unsupported characters", () => {
    expect(convertToStyle("a1!", "script")).toBe("𝒶1!");
  });

  it("is multiline-safe", () => {
    expect(convertToStyle("ab\ncd", "monospace")).toBe("𝚊𝚋\n𝚌𝚍");
  });

  it("superscript maps only real glyphs and leaves others unchanged", () => {
    expect(convertToStyle("pqrs", "superscript")).toBe("ᵖqʳˢ");
    expect(convertToStyle("AbC", "superscript")).toBe("ᴬᵇC");
    expect(convertToStyle("a1+", "superscript")).toBe("ᵃ¹⁺");
  });

  it("subscript maps only real glyphs and leaves others unchanged", () => {
    expect(convertToStyle("abcdef", "subscript")).toBe("ₐbcdₑf");
    expect(convertToStyle("a1+", "subscript")).toBe("ₐ₁₊");
  });

  it("titleCase respects apostrophes and non-ASCII letters", () => {
    expect(convertToStyle("i'm the best", "titleCase")).toBe("I'm The Best");
    expect(convertToStyle("hello wörld", "titleCase")).toBe("Hello Wörld");
  });

  it("zalgo with intensity 0 adds no combining marks", () => {
    const out = convertToStyle("aaaa", "zalgo", { zalgoIntensity: 0 });
    expect(out.match(/[\u0300-\u036F]/g) ?? []).toHaveLength(0);
  });
});

describe("unicode safety", () => {
  it("preserves emoji while converting the rest", () => {
    const out = convertToStyle("hi 😀", "bold");
    expect(out.startsWith("𝐡𝐢 ")).toBe(true);
    expect(out.endsWith("😀")).toBe(true);
  });

  it("handles surrogate pairs without corruption", () => {
    const out = convertToStyle("𝌆", "bold");
    expect(out).toBe("𝌆");
  });

  it("counts codepoints, not UTF-16 units", () => {
    const out = convertToStyle("a𝌆b", "circled");
    expect(out).toBe("ⓐ𝌆ⓑ");
  });
});

describe("decorated styles", () => {
  it("wraps text in brackets", () => {
    expect(convertToStyle("hey", "starBox")).toBe("✧hey✧");
  });

  it("renders strikethrough using combining marks", () => {
    const out = convertToStyle("ab", "strike");
    expect(out.includes("\u0336")).toBe(true);
  });

  it("zalgo adds combining marks scaled by intensity", () => {
    const light = convertToStyle("aaaa", "zalgo", { zalgoIntensity: 5 });
    const heavy = convertToStyle("aaaa", "zalgo", { zalgoIntensity: 95 });
    const count = (s: string) => (s.match(/[\u0300-\u036F]/g) ?? []).length;
    expect(count(heavy)).toBeGreaterThanOrEqual(count(light));
  });
});

describe("search", () => {
  it("finds styles by name, category and tag", () => {
    expect(searchStyles("bold").length).toBeGreaterThan(0);
    expect(searchStyles("", "bubble").every((s) => s.category === "bubble")).toBe(true);
    expect(searchStyles("hearts").length).toBeGreaterThan(0);
  });
});

describe("sanitize", () => {
  it("strips bidi-override and control characters", () => {
    expect(sanitizeText("a\u202Eb\u2066c\u2069")).toBe("abc");
    expect(sanitizeText("x\u0000y\u007Fz")).toBe("xyz");
  });

  it("keeps newlines and tabs", () => {
    expect(sanitizeText("a\nb\tc")).toBe("a\nb\tc");
  });

  it("truncates at codepoint boundaries without splitting surrogates", () => {
    const out = sanitizeText("😀".repeat(2500));
    expect(Array.from(out)).toHaveLength(2000);
    expect(out).toBe("😀".repeat(2000));
  });
});

describe("clampText", () => {
  it("limits by codepoints without splitting surrogate pairs", () => {
    expect(clampText("a😀b", 2)).toBe("a😀");
    expect(clampText("hello", 3)).toBe("hel");
  });
});

describe("getPaginationItems", () => {
  it("returns every page when the total is small", () => {
    expect(getPaginationItems(1, 1)).toEqual([1]);
    expect(getPaginationItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("keeps first, last and a window around the current page", () => {
    expect(getPaginationItems(5, 9)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 9]);
  });

  it("shows the opening run when on the first page", () => {
    expect(getPaginationItems(1, 9)).toEqual([1, 2, 3, "ellipsis", 8, 9]);
    expect(getPaginationItems(2, 9)).toEqual([1, 2, 3, "ellipsis", 8, 9]);
  });

  it("shows the closing run when near the last page", () => {
    expect(getPaginationItems(8, 9)).toEqual([1, "ellipsis", 7, 8, 9]);
    expect(getPaginationItems(9, 9)).toEqual([1, "ellipsis", 7, 8, 9]);
  });

  it("always contains the first and last page", () => {
    const items = getPaginationItems(10, 20);
    expect(items[0]).toBe(1);
    expect(items[items.length - 1]).toBe(20);
    expect(items.filter((i): i is number => i !== "ellipsis").includes(10)).toBe(true);
  });

  it("renders no ellipsis gaps for consecutive runs", () => {
    const items = getPaginationItems(7, 9);
    expect(items).toEqual([1, "ellipsis", 6, 7, 8, 9]);
  });
});

describe("use-case limits", () => {
  it("resolves limits from characterLimits by label", () => {
    const instagram = APP_CONFIGS.find((app) => app.key === "instagram")!;
    expect(limitForUseCase(instagram, "Bio")).toBe(150);
    expect(limitForUseCase(instagram, "Caption")).toBe(2200);
    expect(limitForUseCase(instagram, "Story")).toBeNull();
  });

  it("falls back to alternate keys (nickname vs username)", () => {
    const pubg = APP_CONFIGS.find((app) => app.key === "pubg")!;
    expect(limitForUseCase(pubg, "Username")).toBe(16);
    expect(limitForUseCase(pubg, "Nickname")).toBe(16);
  });

  it("falls back to nickname/username for clan tag and squad name", () => {
    const gaming = APP_CONFIGS.find((app) => app.key === "gaming")!;
    expect(limitForUseCase(gaming, "Clan tag")).toBe(16);
    expect(limitForUseCase(gaming, "Squad name")).toBe(16);
  });

  it("returns null for labels with no configured limit", () => {
    const gaming = APP_CONFIGS.find((app) => app.key === "gaming")!;
    expect(limitForUseCase(gaming, "Unknown thing")).toBeNull();
    const pubg = APP_CONFIGS.find((app) => app.key === "pubg")!;
    expect(limitForUseCase(pubg, "Post")).toBeNull();
  });

  it("maps added per-app limits (facebook comment, tiktok caption, discord bio)", () => {
    const facebook = APP_CONFIGS.find((app) => app.key === "facebook")!;
    const tiktok = APP_CONFIGS.find((app) => app.key === "tiktok")!;
    const discord = APP_CONFIGS.find((app) => app.key === "discord")!;
    expect(limitForUseCase(facebook, "Comment")).toBe(8000);
    expect(limitForUseCase(tiktok, "Caption")).toBe(2200);
    expect(limitForUseCase(tiktok, "Video text")).toBe(2200);
    expect(limitForUseCase(discord, "Bio")).toBe(250);
  });
});
