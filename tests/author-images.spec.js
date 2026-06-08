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
  await page.goto(`${originUrl}?author-images=${Date.now()}#${hash}`);
}

async function waitForPortraits(page, selector) {
  await page.waitForFunction((targetSelector) => {
    const images = [...document.querySelectorAll(targetSelector)];
    return (
      images.length > 0 &&
      images.every(
        (image) =>
          image.complete &&
          image.naturalWidth > 0 &&
          image.naturalHeight > 0 &&
          image.classList.contains("is-loaded")
      )
    );
  }, selector, { timeout: 45000 });
}

test.describe("author archive portraits", () => {
  test.describe.configure({ timeout: 90000 });

  test("authors grid uses distinct non-broken portraits with Abai fallback safety", async ({ page }) => {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoApp(page, "/authors", { theme: "dark", language: "en" });
    await expect(page.locator(".authors-page")).toBeVisible();

    const cards = page.locator(".author-card");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(8);
    await expect(page.locator(".author-card__portrait img")).toHaveCount(cardCount);
    await waitForPortraits(page, ".author-card__portrait img");

    const imageAudit = await page.locator(".author-card__portrait img").evaluateAll((images) =>
      images.map((image) => ({
        src: image.currentSrc,
        alt: image.getAttribute("alt"),
        source: image.getAttribute("data-portrait-source"),
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      }))
    );

    expect(imageAudit.every((item) => item.alt && item.naturalWidth > 0 && item.naturalHeight > 0)).toBe(true);
    expect(new Set(imageAudit.map((item) => item.src)).size).toBeGreaterThan(6);
    expect(new Set(imageAudit.map((item) => item.source)).size).toBeGreaterThan(6);
    expect(imageAudit.some((item) => item.source?.includes("portal-authors"))).toBe(false);
    expect(imageAudit.some((item) => item.source?.includes("collection-poetry"))).toBe(false);
    expect(
      imageAudit.some((item) =>
        /stamp|KZMakataev|CPA_4065|CPA 4065|Musrepov\.jpg/i.test(`${item.source} ${item.src}`)
      )
    ).toBe(false);
    expect(imageAudit.some((item) => item.source?.startsWith("local:mura-generated/"))).toBe(false);
    expect(imageAudit.filter((item) => item.source?.startsWith("local:mura-placeholder/")).length).toBeGreaterThanOrEqual(4);

    const abaiImage = page.locator('.author-card__portrait img[data-author-portrait="Abai Kunanbayev"]');
    await expect(abaiImage).toHaveAttribute("alt", /Abai/);
    await expect(abaiImage).toHaveAttribute("data-portrait-source", /Abai_Kunanbaev|local:mura-fallback/);
    await expect(abaiImage).toHaveJSProperty("complete", true);

    await page.screenshot({ path: `${screenshotsDir}/authors-images-desktop.png`, fullPage: true });
  });

  test("Abai profile hero uses the author portrait source and shows credit", async ({ page }) => {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, "/author/Abai%20Kunanbayev", { theme: "light", language: "en" });
    await expect(page.locator(".author-page--profile")).toBeVisible();

    const heroImage = page.locator(".author-profile-portrait img");
    await waitForPortraits(page, ".author-profile-portrait img");
    await expect(heroImage).toHaveAttribute("alt", /Abai/);
    await expect(heroImage).toHaveAttribute("data-portrait-source", /Abai_Kunanbaev/);
    await expect(page.locator(".author-profile-portrait-credit")).toContainText("Wikimedia Commons");

    const brokenImages = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => image.complete && image.naturalWidth === 0).length
    );
    expect(brokenImages).toBe(0);

    await page.screenshot({ path: `${screenshotsDir}/author-abai-portrait-profile.png`, fullPage: true });
  });

  test("real author profile hero uses the same archival portrait source", async ({ page }) => {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, "/author/Mukhtar%20Auezov", { theme: "dark", language: "en" });
    await expect(page.locator(".author-page--profile")).toBeVisible();

    const heroImage = page.locator(".author-profile-portrait img");
    await waitForPortraits(page, ".author-profile-portrait img");
    await expect(heroImage).toHaveAttribute("alt", /Mukhtar Auezov/);
    await expect(heroImage).toHaveAttribute("data-portrait-source", /Auezov_Mukhtar/);
    await expect(page.locator(".author-profile-portrait-credit")).toContainText("Wikimedia Commons");

    const brokenImages = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => image.complete && image.naturalWidth === 0).length
    );
    expect(brokenImages).toBe(0);

    await page.screenshot({ path: `${screenshotsDir}/author-auezov-real-profile.png`, fullPage: true });
  });

  test("unavailable portrait profile uses neutral non-human placeholder", async ({ page }) => {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, "/author/Fariza%20Ongarsynova", { theme: "light", language: "en" });
    await expect(page.locator(".author-page--profile")).toBeVisible();

    const heroImage = page.locator(".author-profile-portrait img");
    await waitForPortraits(page, ".author-profile-portrait img");
    await expect(heroImage).toHaveAttribute("alt", /Neutral MURA archival placeholder/);
    await expect(heroImage).toHaveAttribute("data-portrait-source", "local:mura-placeholder/fariza-ongarsynova");
    await expect(page.locator(".author-profile-portrait-credit")).toContainText("MURA neutral archival placeholder");

    const placeholderSvg = await heroImage.evaluate((image) =>
      decodeURIComponent(image.currentSrc.replace("data:image/svg+xml;charset=UTF-8,", ""))
    );
    expect(placeholderSvg).not.toMatch(/<ellipse|<circle|moustache|beard/i);

    await page.screenshot({ path: `${screenshotsDir}/author-fariza-neutral-placeholder-profile.png`, fullPage: true });
  });
});
