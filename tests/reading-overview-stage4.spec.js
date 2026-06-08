// @ts-check
import { test, expect } from "@playwright/test";

const baseUrl = "http://127.0.0.1:5173/literary-heritage/#";
const originUrl = "http://127.0.0.1:5173/literary-heritage/";

async function setPrefs(page, { theme = "dark", language = "en" } = {}) {
  await page.addInitScript(
    ({ nextTheme, nextLanguage }) => {
      window.localStorage.setItem("literary_heritage_theme", nextTheme);
      window.localStorage.setItem("literary_heritage_language", nextLanguage);
    },
    { nextTheme: theme, nextLanguage: language }
  );
}

async function gotoWithPrefs(page, path, { theme = "dark", language = "en" } = {}) {
  await page.goto(originUrl);
  await page.evaluate(
    ({ nextTheme, nextLanguage }) => {
      window.localStorage.setItem("literary_heritage_theme", nextTheme);
      window.localStorage.setItem("literary_heritage_language", nextLanguage);
    },
    { nextTheme: theme, nextLanguage: language }
  );
  await page.goto(`${originUrl}?stage4=${Date.now()}#${path}`);
}

async function expectNoMixedTitle(page, expectedTitle) {
  const heroTitle = page.locator(".reading-book-hero__title");
  await expect(heroTitle).toHaveText(expectedTitle);
  await expect(heroTitle).not.toContainText("/");
  await expect(page.locator(".reading-book-breadcrumb")).toContainText(expectedTitle);
}

test.describe("MURA reading overview Stage 4", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(60000);

  test("Abai work detail renders localized single-language titles and saved screenshots", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoWithPrefs(page, "/reading/abai-words", { theme: "dark", language: "kk" });

    await expect(page.locator(".reading-book-page--stage4")).toBeVisible();
    await expectNoMixedTitle(page, "Қара сөздер");
    await expect(page.locator(".mura-author-profile")).toBeVisible();
    await expect(page.locator(".mura-book-reference-row")).toBeVisible();
    await expect(page.locator(".book-social")).toBeVisible();
    await page.screenshot({ path: "qa-screenshots/reading-abai-dark-desktop.png", fullPage: true });

    await gotoWithPrefs(page, "/reading/abai-words", { theme: "light", language: "en" });
    await expectNoMixedTitle(page, "The Book of Words");
    await page.screenshot({ path: "qa-screenshots/reading-abai-light-desktop.png", fullPage: true });

    await gotoWithPrefs(page, "/reading/abai-words", { theme: "light", language: "ru" });
    await expectNoMixedTitle(page, "Книга слов");
  });

  test("reading overview controls still navigate and interact", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 820 });
    await setPrefs(page, { theme: "dark", language: "en" });
    await page.goto(`${baseUrl}/reading/abai-words`);

    await page.locator(".reading-book-hero__utilityButton").first().click();
    await page.locator(".reading-book-hero__utilityButton").nth(1).click();
    await expect(page.locator(".reading-book-hero__shareStatus")).toBeVisible();

    await page.locator(".book-social__actions button").nth(1).click({ force: true });
    await expect(page.locator(".book-social__message")).toBeVisible();

    await page.locator(".reading-book-hero__action").filter({ hasText: /progress/i }).click();
    await expect(page).toHaveURL(/#\/progress$/);

    await page.goto(`${baseUrl}/reading/abai-words`);
    await page.locator(".reading-book-hero__action.is-primary").click();
    await expect(page).toHaveURL(/#\/reading\/abai-words\/chapter\/\d+/);
  });

  test("mobile reading overview and works cards keep localized titles without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await setPrefs(page, { theme: "light", language: "kk" });
    await page.goto(`${baseUrl}/reading/abai-words`);

    await expectNoMixedTitle(page, "Қара сөздер");
    await expect(page.locator(".reading-book-hero__bookObject")).toBeVisible();
    const readingOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(readingOverflow).toBe(false);
    await page.screenshot({ path: "qa-screenshots/reading-abai-mobile.png", fullPage: true });

    await page.goto(`${baseUrl}/works`);
    const firstTitle = page.locator(".works-card h2").first();
    await expect(firstTitle).toHaveText("Қара сөздер");
    await expect(firstTitle).not.toContainText("/");
    const worksOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(worksOverflow).toBe(false);
    await page.screenshot({ path: "qa-screenshots/works-title-language-check.png", fullPage: true });
  });
});
