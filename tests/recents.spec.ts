import { expect, test } from "@playwright/test";

test("quick apps adapt to recents", async ({ page }) => {
  await page.goto("/minecraft-fonts");
  await expect(page.getByLabel("Text to convert")).toBeVisible();
  // recordApp → persist is async; poll until the store write lands
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("glyphtiq:recent-apps")))
    .toContain("minecraft-fonts");
  await page.goto("/");
  const header = page.locator("header");
  // The pill link name includes the icon's aria-label + visible text.
  await expect(header.getByRole("link", { name: /minecraft/i })).toBeVisible();
});

test("quick apps update on client-side navigation", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  await expect(header.getByRole("link", { name: /minecraft/i })).toHaveCount(0);
  await page.goto("/minecraft-fonts");
  await expect(page.getByLabel("Text to convert")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("glyphtiq:recent-apps")))
    .toContain("minecraft-fonts");
  await page.getByRole("link", { name: "Glyphtiq home" }).click();
  // Dev-mode client-side navigation is slow (Turbopack on-demand render), so wait on content.
  await expect(page.getByRole("heading", { name: /make your words flow/i })).toBeVisible({ timeout: 20000 });
  await expect(header.getByRole("link", { name: /minecraft/i })).toBeVisible();
});
