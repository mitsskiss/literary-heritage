// @ts-check
import { test, expect } from "@playwright/test";

const originUrl = "http://127.0.0.1:5173/literary-heritage/";

async function gotoRoute(page, routeId = "abai-path", { theme = "dark", language = "ru" } = {}) {
  await page.addInitScript(
    ({ nextTheme, nextLanguage }) => {
      window.localStorage.setItem("literary_heritage_theme", nextTheme);
      window.localStorage.setItem("literary_heritage_language", nextLanguage);
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("mura_route_step:") || key.startsWith("mura_route_max_step:"))
        .forEach((key) => window.localStorage.removeItem(key));
    },
    { nextTheme: theme, nextLanguage: language }
  );
  await page.goto(`${originUrl}?route-premium=${Date.now()}#/route/${routeId}`);
  await expect(page.locator(".route-page--premium")).toBeVisible();
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(hasOverflow).toBe(false);
}

test.describe("MURA premium route page", () => {
  test("Abai route renders premium layout and real stage states", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 850 });
    await gotoRoute(page);

    await expect(page.locator(".route-premium-hero h1")).toContainText("Путь Абая");
    await expect(page.locator(".route-premium-stats article")).toHaveCount(4);
    await expect(page.locator(".route-stage-rail li").nth(0)).toHaveClass(/is-current/);
    await expect(page.locator(".route-stage-rail li").nth(1)).toHaveClass(/is-locked/);
    await expect(page.locator(".route-stage-rail li button").nth(1)).toBeDisabled();
    await expect(page.locator(".route-stage-reader")).toContainText("Маршрут начинается");
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/route-abai-premium-dark-desktop.png", fullPage: true });

    await page.locator(".route-stage-nav button").last().click();
    await expect(page.locator(".route-stage-rail li").nth(0)).toHaveClass(/is-completed/);
    await expect(page.locator(".route-stage-rail li").nth(1)).toHaveClass(/is-current/);
    await expect(page.locator(".route-stage-rail li button").nth(1)).toBeEnabled();
    await expect(page.locator(".route-stage-reader")).toContainText("Абай писал");

    const saveButton = page.locator(".route-premium-hero__actions .route-action").nth(1);
    await saveButton.click();
    await expect(saveButton).toHaveClass(/is-active/);
    await page.locator(".route-action--icon").click();
    await expect(page.locator(".route-action-status")).toBeVisible();

    await page.locator(".route-show-all").click();
    await expect(page.locator(".route-stage-rail__list")).toHaveClass(/is-expanded/);
  });

  test("light, mobile, and another route keep the same reusable structure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoRoute(page, "abai-path", { theme: "light", language: "en" });

    await expect(page.locator(".route-premium-hero h1")).toContainText("The Path of Abai");
    await expect(page.locator(".route-stage-rail")).toBeVisible();
    await expect(page.locator(".route-stage-reader")).toBeVisible();
    await expect(page.locator(".route-context-stack")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/route-abai-premium-light-mobile.png", fullPage: true });

    await gotoRoute(page, "alash-voice", { theme: "dark", language: "ru" });
    await expect(page.locator(".route-premium-hero")).toBeVisible();
    await expect(page.locator(".route-stage-rail")).toBeVisible();
    await expect(page.locator(".route-stage-reader")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: "qa-screenshots/route-alash-premium-dark-mobile.png", fullPage: true });
  });
});
