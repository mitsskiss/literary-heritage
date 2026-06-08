// @ts-check
import { test, expect } from "@playwright/test";

const baseUrl = "http://127.0.0.1:5173/literary-heritage/#";

test.describe("reading routes", () => {
  test("chapter pages render localized object fields safely", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(`${baseUrl}/reading/abai-words/chapter/1`);
    await expect(page.locator("main.chapter-page")).toBeVisible();
    await expect(page.locator(".chapter-sceneCard__question")).toBeVisible();
    expect(pageErrors).toEqual([]);

    await page.goto(`${baseUrl}/reading/baitursynuly-masa/chapter/1`);
    await expect(page.locator("main.chapter-page")).toBeVisible();
    await expect(page.locator(".chapter-sceneCard__question")).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("work catalog links point to each work id", async ({ page }) => {
    await page.goto(`${baseUrl}/works`);
    await expect(page.locator(".works-card__primary").first()).toBeVisible();

    const links = await page.locator(".works-card__primary").evaluateAll((items) =>
      items.slice(0, 5).map((item) => item.getAttribute("href"))
    );

    expect(links).toContain("#/reading/abai-words");
    expect(links).toContain("#/reading/auezov-abai-path");
    expect(new Set(links).size).toBe(links.length);
  });
});
