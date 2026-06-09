// @ts-check
import { test, expect } from "@playwright/test";

const originUrl = "http://127.0.0.1:5173/literary-heritage/";
const chapterPath = "/reading/abai-words/chapter/1";

async function gotoChapter(page, { theme = "dark", language = "kk" } = {}) {
  await page.addInitScript(
    ({ nextTheme, nextLanguage }) => {
      window.localStorage.clear();
      window.localStorage.setItem("literary_heritage_theme", nextTheme);
      window.localStorage.setItem("literary_heritage_language", nextLanguage);
    },
    { nextTheme: theme, nextLanguage: language }
  );
  await page.goto(`${originUrl}?stage5=${Date.now()}#${chapterPath}`);
  await expect(page.locator(".chapter-page")).toBeVisible();
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(hasOverflow).toBe(false);
}

function sceneEyebrow(page) {
  return page.locator(".chapter-sceneCard > .chapter-sceneCard__head .chapter-sceneCard__eyebrow");
}

test.describe("MURA chapter reader Stage 5", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(90000);

  test("dark desktop layout, locked rail, local quiz feedback, completion, and retry", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 820 });
    await gotoChapter(page, { theme: "dark", language: "kk" });

    const railButtons = page.locator(".mura-reader-rail__button");
    await expect(page.locator(".mura-reader-rail")).toBeVisible();
    await expect(page.locator(".chapter-sceneCard")).toBeVisible();
    await expect(page.locator(".mura-reader-aside")).toBeVisible();
    await expect(page.locator(".mura-reader-panel--compare")).toHaveCount(0);
    await expect(sceneEyebrow(page)).toContainText("1-сахна");
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("1-сөз");
    await expect(railButtons.nth(0)).toBeEnabled();
    await expect(railButtons.nth(1)).toBeDisabled();
    await expect(railButtons.nth(2)).toBeDisabled();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/chapter-abai-dark-desktop.png", fullPage: true });

    await page.locator(".mura-reader-compare-toggle").click();
    await expect(page.locator(".chapter-language-compare")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/chapter-abai-compare.png", fullPage: true });

    await page.locator(".chapter-choice").first().click();
    await expect(page.locator(".chapter-result")).toBeVisible();
    await expect(page.locator(".chapter-result")).toContainText("Дұрыс");
    await expect(page.locator(".chapter-result .chapter-xp-toast")).toBeVisible();

    await page.locator(".chapter-result__action").click();
    await expect(sceneEyebrow(page)).toContainText("2-сахна");
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("2-сөз");
    await expect(page.locator(".mura-reader-panel").first()).toContainText("сарт");
    await expect(page.locator(".chapter-annotated-word").filter({ hasText: "ғибрат" })).toBeVisible();
    await expect(railButtons.nth(0)).toBeEnabled();
    await expect(railButtons.nth(1)).toBeEnabled();
    await expect(railButtons.nth(2)).toBeDisabled();

    await railButtons.nth(0).click();
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("1-сөз");
    await railButtons.nth(1).click();
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("2-сөз");

    await page.locator(".chapter-choice").first().click();
    await expect(page.locator(".chapter-result")).toContainText("Дұрыс");
    await expect(page.locator(".chapter-result .chapter-xp-toast")).toBeVisible();

    await page.locator(".chapter-result__action").click();
    await expect(sceneEyebrow(page)).toContainText("3-сахна");
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("3-сөз");
    await expect(page.locator(".mura-reader-panel").first()).toContainText("Қаскүнемдік");
    await expect(page.locator(".chapter-annotated-word").filter({ hasText: "билікқұмарлықтан" })).toBeVisible();
    await expect(railButtons.nth(2)).toBeEnabled();

    await page.locator(".chapter-choice").first().click();
    await expect(page.locator(".chapter-result")).toContainText("Дұрыс");
    await expect(page.locator(".chapter-result .chapter-xp-toast")).toBeVisible();

    await page.locator(".chapter-result__action").click();
    await expect(page.locator(".chapter-completion")).toBeVisible();
    await page.locator(".chapter-completion__action").filter({ hasText: "Тарауды қайта оқу" }).click();
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("1-сөз");
    await expect(page.locator(".chapter-result")).toHaveCount(0);
    await expect(railButtons.nth(1)).toBeDisabled();
  });

  test("light desktop theme remains readable and language switching localizes scene labels", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 820 });
    await gotoChapter(page, { theme: "light", language: "en" });

    await expect(sceneEyebrow(page)).toContainText("Scene 1");
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("Word 1");
    await page.locator(".mura-reader-icon-button").first().click();
    await page.locator(".mura-reader-icon-button").nth(1).click();
    await expect(page.locator(".mura-reader-share-toast")).toBeVisible();
    await page.locator(".chapter-choice").first().click();
    await expect(page.locator(".chapter-result .chapter-xp-toast")).toBeVisible();
    await page.locator(".mura-reader-actions__group button").filter({ hasText: "RU" }).click();
    await expect(sceneEyebrow(page)).toContainText("Сцена 1");
    await expect(page.locator(".chapter-sceneCard__title")).toContainText("Слово 1");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/chapter-abai-light-desktop.png", fullPage: true });
  });

  test("glossary and highlighted difficult words follow selected language", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 780 });

    await gotoChapter(page, { theme: "light", language: "kk" });
    await expect(page.locator(".mura-reader-glossary-chip strong")).toContainText([
      "әурешілік",
      "жауапкершілік",
      "ғибадат",
      "ғибрат",
    ]);
    await page.locator(".chapter-annotated-word").filter({ hasText: "әурешілікті" }).click();
    await expect(page.locator(".chapter-annotation-popover")).toContainText("әурешілік");

    await page.locator(".mura-reader-actions__group button").filter({ hasText: "RU" }).click();
    await expect(page.locator(".mura-reader-glossary-chip strong")).toContainText([
      "суета",
      "ответственность",
      "назидание",
      "религиозное служение",
    ]);
    await expect(page.locator(".mura-reader-glossary-list")).not.toContainText("әурешілік");
    await page.locator(".chapter-annotated-word").filter({ hasText: "суеты" }).click();
    await expect(page.locator(".chapter-annotation-popover")).toContainText("суета");
    await expect(page.locator(".chapter-annotation-popover")).not.toContainText("Әурешілік");

    await page.locator(".mura-reader-actions__group button").filter({ hasText: "EN" }).click();
    await expect(page.locator(".mura-reader-glossary-chip strong")).toContainText([
      "vanity",
      "responsibility",
      "devotion",
      "edification",
    ]);
    await expect(page.locator(".mura-reader-glossary-list")).not.toContainText("әурешілік");
    await page.locator(".chapter-annotated-word").filter({ hasText: "responsibility" }).click();
    await expect(page.locator(".chapter-annotation-popover")).toContainText("responsibility");
  });

  test("mobile reader keeps compact rail and stacked comparison without clipping", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoChapter(page, { theme: "dark", language: "kk" });

    await expect(page.locator(".mura-reader-rail")).toBeVisible();
    await expect(page.locator(".mura-reader-rail__button").nth(1)).toBeDisabled();
    await page.locator(".mura-reader-compare-toggle").click();
    await expect(page.locator(".chapter-language-compare__grid")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/chapter-abai-mobile.png", fullPage: true });
  });
});
