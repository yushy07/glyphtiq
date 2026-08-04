import { describe, expect, it } from "vitest";
import { generateUsernames } from "@/lib/usernames/engine";
import { PLATFORM_LIST, PLATFORMS } from "@/lib/usernames/platforms";
import { THEME_LIST, THEMES } from "@/lib/usernames/themes";

describe("username studio engine", () => {
  it("exposes 20+ platform rules and 20+ themes", () => {
    expect(PLATFORM_LIST.length).toBeGreaterThanOrEqual(20);
    expect(THEME_LIST.length).toBeGreaterThanOrEqual(20);
  });

  it("generates 20-50 scored usernames for a input name", () => {
    const results = generateUsernames({
      baseName: "Shadow",
      theme: "minimal",
      platform: "instagram",
      limit: 30,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(30);
    expect(results[0].score.totalScore).toBeGreaterThanOrEqual(50);
  });

  it("enforces platform rules (e.g. Free Fire max length 12)", () => {
    const rules = PLATFORMS.freeFire;
    expect(rules.maxLen).toBe(12);

    const results = generateUsernames({
      baseName: "Alex",
      theme: "warrior",
      platform: "freeFire",
      limit: 20,
    });

    for (const r of results) {
      if (r.username.length > rules.maxLen) {
        expect(r.score.compatibility).toBeLessThan(100);
      }
    }
  });
});
