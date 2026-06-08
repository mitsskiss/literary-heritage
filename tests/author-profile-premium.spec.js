// @ts-check
import { test, expect } from "@playwright/test";

const originUrl = "http://127.0.0.1:5173/literary-heritage/";
const abaiProfilePath = "/author/Abai%20Kunanbayev";

async function gotoAuthor(page, { theme = "dark", language = "ru" } = {}) {
  await page.addInitScript(
    ({ nextTheme, nextLanguage }) => {
      window.localStorage.setItem("literary_heritage_theme", nextTheme);
      window.localStorage.setItem("literary_heritage_language", nextLanguage);
    },
    { nextTheme: theme, nextLanguage: language }
  );
  await page.goto(`${originUrl}?author-profile=${Date.now()}#${abaiProfilePath}`);
  await expect(page.locator(".author-page--profile")).toBeVisible();
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(hasOverflow).toBe(false);
}

test.describe("MURA author profile premium layout", () => {
  test("Abai profile renders dark premium layout and working actions", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoAuthor(page, { theme: "dark", language: "ru" });

    await expect(page.locator(".author-profile-breadcrumb")).toContainText("Авторы");
    await expect(page.locator(".author-profile-identity h1")).toContainText("Абай Кунанбаев");
    await expect(page.locator(".author-profile-meta-card")).toHaveCount(4);
    await expect(page.locator(".author-profile-portrait__seal")).toHaveCount(0);
    await expect(page.locator(".author-profile-quote-card")).toBeVisible();
    await expect(page.locator(".author-profile-tabs button").filter({ hasText: "Обзор" })).toHaveClass(/is-active/);
    await expect(page.locator(".author-profile-biography-card")).toContainText("1845");
    await expect(page.locator(".author-profile-insights")).toContainText("Нравственность");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/author-profile-abai-dark-desktop.png", fullPage: true });

    const saveButton = page.locator(".author-profile-actions .author-profile-button").first();
    await saveButton.click();
    await expect(saveButton).toContainText("Сохранено");

    await page.locator(".author-profile-actions .author-profile-button").nth(1).click();
    await expect(page.locator(".author-profile-share-status")).toBeVisible();

    await page.locator(".author-profile-tabs button").filter({ hasText: "Биография" }).click();
    await expect(page.locator(".author-profile-longform")).toContainText("Шынгыстау");

    await page.locator(".author-profile-tabs button").filter({ hasText: "Произведения" }).click();
    await expect(page.locator(".author-profile-work-card")).toHaveCount(4);
    await expect(page.locator(".author-profile-work-card").first()).toContainText("Слова назидания");
    await page.locator(".author-profile-tabs button").filter({ hasText: "Цитаты" }).click();
    await expect(page.locator(".author-profile-quotes article")).toHaveCount(3);
    await page.locator(".author-profile-tabs button").filter({ hasText: "Статьи и исследования" }).click();
    await expect(page.locator(".author-profile-research-card")).toHaveCount(3);
    await page.locator(".author-profile-tabs button").filter({ hasText: "Факты" }).click();
    await expect(page.locator(".author-profile-facts article")).toHaveCount(3);
    await expectNoHorizontalOverflow(page);

    await page.goto(`${originUrl}?authors-list=${Date.now()}#/authors`);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
      window.localStorage.setItem("literary_heritage_theme", "dark");
    });
    await expect(page.locator(".authors-page")).toBeVisible();
    const abaiCard = page.locator(".author-card").filter({ hasText: "Абай" }).first();
    await expect(abaiCard).toBeVisible();
    await page.screenshot({ path: "qa-screenshots/authors-list-dark-desktop.png", fullPage: true });
    await abaiCard.click();
    await expect(page.locator(".author-profile-identity h1")).toContainText("Абай Кунанбаев");
  });

  test("light desktop keeps the same structure and authors list links to profile", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoAuthor(page, { theme: "light", language: "en" });

    await expect(page.locator(".author-profile-identity h1")).toContainText("Abai Kunanbayev");
    await expect(page.locator(".author-profile-tabs button").filter({ hasText: "Overview" })).toBeVisible();
    await expect(page.locator(".author-profile-work-card").first()).toContainText("The Book of Words");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/author-profile-abai-light-desktop.png", fullPage: true });

    await page.goto(`${originUrl}?authors-list=${Date.now()}#/authors`);
    await expect(page.locator(".authors-page")).toBeVisible();
    const abaiCard = page.locator(".author-card").filter({ hasText: "Abai" }).first();
    await expect(abaiCard).toBeVisible();
    await abaiCard.click();
    await expect(page.locator(".author-profile-identity h1")).toContainText("Abai Kunanbayev");
  });

  test("mobile profile stacks cleanly and tabs remain usable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoAuthor(page, { theme: "dark", language: "kk" });

    await expect(page.locator(".author-profile-identity h1")).toContainText("Абай Құнанбайұлы");
    await expect(page.locator(".author-profile-tabs")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/author-profile-abai-mobile.png", fullPage: true });
    await page.locator(".author-profile-tabs button").filter({ hasText: "Дәйексөздер" }).click();
    await expect(page.locator(".author-profile-quotes article").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
