// @ts-check
import { test, expect } from "@playwright/test";

const homeUrl = "http://127.0.0.1:5173/literary-heritage/#/";

async function setTheme(page, theme) {
  await page.addInitScript((nextTheme) => {
    window.localStorage.setItem("literary_heritage_theme", nextTheme);
  }, theme);
}

test.describe("MURA landing visual pass", () => {
  test.setTimeout(60000);

  test("desktop light homepage renders redesigned MIRAS layout", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 980 });
    await setTheme(page, "light");
    await page.goto(homeUrl);
    await expect(page.locator(".miras-hero")).toBeVisible();
    await expect(page.locator(".site-header.heritage-topbar")).toBeVisible();
    await page.screenshot({ path: "qa-screenshots/landing-stage3-light-desktop.png", fullPage: true });
  });

  test("desktop dark homepage keeps premium cultural variant", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 980 });
    await setTheme(page, "dark");
    await page.goto(homeUrl);
    await expect(page.locator(".miras-hero")).toBeVisible();
    await page.screenshot({ path: "qa-screenshots/landing-stage3-dark-desktop.png", fullPage: true });
  });

  test("mobile homepage does not overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await setTheme(page, "light");
    await page.goto(homeUrl);
    await expect(page.locator(".miras-hero h1")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    await page.screenshot({ path: "qa-screenshots/landing-stage3-light-mobile.png", fullPage: true });
  });

  test("mobile dark homepage keeps the same layout without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await setTheme(page, "dark");
    await page.goto(homeUrl);
    await expect(page.locator(".miras-hero h1")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    await page.screenshot({ path: "qa-screenshots/landing-stage3-dark-mobile.png", fullPage: true });
  });
});
