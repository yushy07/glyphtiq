import { expect, test } from "@playwright/test";

test.describe("navigation redesign", () => {
  test("desktop shows logo, quick apps, nav, search and CTA", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Glyphy home" })).toBeVisible();
    for (const name of ["Instagram", "Discord", "Free Fire"]) {
      await expect(header.getByRole("link", { name })).toBeVisible();
    }
    for (const name of ["Home", "Fonts"]) {
      await expect(header.getByRole("link", { name, exact: true })).toBeVisible();
    }
    await expect(header.getByRole("button", { name: "Apps" })).toBeVisible();
    await expect(header.getByPlaceholder("Search fonts or apps...")).toBeVisible();
    await expect(header.getByRole("link", { name: "Generate" })).toBeVisible();
  });

  test("apps menu opens from the nav trigger", async ({ page }) => {
    await page.goto("/");
    await page.locator("header").getByRole("button", { name: "Apps" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menu").getByText(/Trending today/)).toBeVisible();
  });

  test("app page hides the CTA and marks its quick app active", async ({ page }) => {
    await page.goto("/instagram-fonts");
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Instagram" })).toHaveAttribute("aria-current", "page");
    await expect(header.getByRole("link", { name: "Generate" })).toHaveCount(0);
  });

  test("collapses quick apps to +3 Apps at md widths", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto("/");
    const header = page.locator("header");
    await expect(header.getByRole("button", { name: "3 Apps" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Instagram" })).toHaveCount(0);
  });

  test("mobile shows top row + quick apps scroll, drawer opens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");
    const header = page.locator("header");
    for (const name of ["Instagram", "Discord", "Free Fire", "TikTok", "PUBG", "Roblox"]) {
      await expect(header.getByRole("link", { name })).toBeVisible();
    }
    await header.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    for (const name of ["Home", "Fonts", "Why Glyphy", "Favorites", "Recent"]) {
      await expect(dialog.getByRole("link", { name })).toBeVisible();
    }
  });

  test("mobile search toggles the search input", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/");
    const header = page.locator("header");
    await header.getByRole("button", { name: "Search" }).click();
    const search = header.locator("input:visible");
    await expect(search).toBeVisible();
    await expect(search).toHaveAttribute("placeholder", "Search fonts or apps...");
  });
});
