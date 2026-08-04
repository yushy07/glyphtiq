import { expect, test } from "@playwright/test";

test.describe("Glyphy generator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the generator and converts live", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /make your words flow/i })).toBeVisible();
    const input = page.getByLabel("Text to convert");
    await input.fill("Hello");
    await expect(page.locator("#style-bold").getByText("𝐇𝐞𝐥𝐥𝐨", { exact: true })).toBeVisible();
  });

  test("supports emoji-safe conversion", async ({ page }) => {
    const input = page.getByLabel("Text to convert");
    await input.fill("hi 👋");
    await expect(page.locator("#style-bold").getByText("𝐡𝐢 👋", { exact: true })).toBeVisible();
  });

  test("counts characters and enforces the limit", async ({ page }) => {
    const input = page.getByLabel("Text to convert");
    await input.fill("a".repeat(600));
    await expect(page.getByText(/600\s*\/\s*500/)).toBeHidden();
    await expect(page.getByText(/500\s*\/\s*500/)).toBeVisible();
  });

  test("copies a style and shows confirmation", async ({ page }) => {
    await page.getByLabel("Text to convert").fill("Cool");
    const card = page.locator("article", { hasText: "Bold" }).first();
    await card.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText(/Copied Bold/)).toBeVisible();
  });

  test("searches styles inside the explorer", async ({ page }) => {
    await page.getByRole("button", { name: /explore library/i }).click();
    const explorer = page.getByRole("region", { name: "Explorer" });
    await expect(explorer.getByPlaceholder("Search styles, categories, tags…")).toBeVisible();
    await explorer.getByPlaceholder("Search styles, categories, tags…").fill("zalgo");
    await expect(explorer.getByRole("heading", { name: "Zalgo", exact: true })).toBeVisible();
    await expect(explorer.getByRole("heading", { name: "Bold", exact: true })).toBeHidden();
  });

  test("gates the full library behind the explorer", async ({ page }) => {
    await expect(page.getByRole("button", { name: /explore library/i })).toBeVisible();
    await expect(page.getByPlaceholder("Search styles, categories, tags…")).toBeHidden();
  });

  test("favorites a style and it pins to the top", async ({ page }) => {
    await page.getByLabel("Text to convert").fill("Pin");
    const first = page.locator("article").first();
    await first.getByRole("button", { name: "Add to favorites" }).click();
    await expect(first.getByRole("button", { name: "Remove from favorites" })).toBeVisible();
  });

  test("surprise me highlights a style", async ({ page }) => {
    await page.getByLabel("Text to convert").fill("ooh");
    await page.getByRole("button", { name: /surprise/i }).click();
    await expect(page.getByText(/Surprise:/)).toBeVisible();
  });
});
