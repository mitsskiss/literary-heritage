// @ts-check
import { expect, test } from "@playwright/test";
import fs from "node:fs";

const originUrl = "http://127.0.0.1:5173/literary-heritage/";
const screenshotsDir = "qa-screenshots";

async function gotoApp(page, hash, { theme = "dark", language = "en" } = {}) {
  await page.addInitScript(
    ({ nextTheme, nextLanguage }) => {
      window.localStorage.setItem("literary_heritage_theme", nextTheme);
      window.localStorage.setItem("literary_heritage_language", nextLanguage);
    },
    { nextTheme: theme, nextLanguage: language }
  );
  await page.goto(`${originUrl}?final-content=${Date.now()}#${hash}`);
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(hasOverflow).toBe(false);
}

test.describe("final localized content smoke", () => {
  test("authors, works, reading and themes stay stable across languages", async ({ page }) => {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await page.setViewportSize({ width: 1366, height: 900 });

    await gotoApp(page, "/authors", { theme: "dark", language: "kk" });
    await expect(page.locator(".authors-page")).toBeVisible();
    await expect(page.locator(".author-card")).toHaveCount(14);
    await expect(page.locator(".author-card").filter({ hasText: "Абай Құнанбайұлы" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("[object Object]");
    await expect(page.locator("body")).not.toContainText("undefined");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${screenshotsDir}/final-authors-kk-dark.png`, fullPage: true });

    await page.goto(`${originUrl}?final-content=${Date.now()}#/author/Abai%20Kunanbayev`);
    await expect(page.locator(".author-profile-identity h1")).toContainText("Абай Құнанбайұлы");
    await page.locator(".author-profile-tabs button").filter({ hasText: "Шығармалар" }).click();
    await expect(page.locator(".author-profile-work-card").first()).toContainText("Қара сөздер");
    await expectNoHorizontalOverflow(page);

    await gotoApp(page, "/works", { theme: "light", language: "ru" });
    await expect(page.locator(".works-page")).toBeVisible();
    await expect(page.locator(".works-card").filter({ hasText: "Книга слов" })).toBeVisible();
    const mixedTitles = await page.locator(".works-card h2").evaluateAll((titles) =>
      titles.map((title) => title.textContent || "").filter((title) => title.includes(" / "))
    );
    expect(mixedTitles).toEqual([]);
    await expect(page.locator("body")).not.toContainText("[object Object]");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: `${screenshotsDir}/final-works-ru-light.png`, fullPage: true });

    await gotoApp(page, "/reading/abai-words", { theme: "dark", language: "en" });
    await expect(page.locator(".reading-book-page")).toBeVisible();
    await expect(page.locator(".reading-book-hero__title")).toContainText("The Book of Words");
    await expect(page.locator(".reading-book-hero__description")).not.toBeEmpty();
    await expectNoHorizontalOverflow(page);
  });
});
