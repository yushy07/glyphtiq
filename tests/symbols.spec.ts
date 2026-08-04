import { expect, test } from "@playwright/test";

test.describe("symbols explorer", () => {
  test("loads the explorer with symbols visible", async ({ page }) => {
    await page.goto("/symbols");
    await expect(page.getByRole("heading", { name: "Symbols" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Copy .+ symbol/ }).first()).toBeVisible();
  });

  test("search narrows results to matching names", async ({ page }) => {
    await page.goto("/symbols");
    const search = page.getByRole("searchbox", { name: "Search symbols" });
    await expect(search).toBeVisible();
    await search.fill("black heart");
    await expect(
      page.getByRole("button", { name: "Copy Heavy Black Heart symbol" }),
    ).toBeVisible();
  });

  test("clicking a symbol copies it and shows a toast", async ({ page }) => {
    await page.goto("/symbols");
    await page.getByRole("button", { name: /Copy .+ symbol/ }).first().click();
    await expect(page.getByText(/^Copied /)).toBeVisible();
  });

  test("favoriting a symbol persists to localStorage", async ({ page }) => {
    await page.goto("/symbols");
    await page.getByRole("button", { name: /^Favorite / }).first().click();
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("glyphtiq:symbol-favorites")))
      .not.toBeNull();
  });

  test("category pills filter the grid", async ({ page }) => {
    await page.goto("/symbols");
    await page.getByRole("tab", { name: /^Currency/ }).click();
    await expect(
      page.getByRole("button", { name: "Copy Euro Sign symbol" }),
    ).toBeVisible();
  });

  test("details modal shows the code point", async ({ page }) => {
    await page.goto("/symbols");
    await page.getByRole("button", { name: /^Details for / }).first().click();
    const dialog = page.getByRole("dialog", { name: /details$/ });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/U\+[0-9A-F]{4,6}/)).toBeVisible();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).not.toBeVisible();
  });
});
