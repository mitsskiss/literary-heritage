// @ts-check
import { test, expect } from "@playwright/test";

const originUrl = "http://127.0.0.1:5173/literary-heritage/";
const mapPath = "/map";
const totalPlaces = 13;

async function gotoMap(page, { theme = "dark", language = "en" } = {}) {
  await page.addInitScript(
    ({ nextTheme, nextLanguage }) => {
      window.localStorage.setItem("literary_heritage_theme", nextTheme);
      window.localStorage.setItem("literary_heritage_language", nextLanguage);
      window.localStorage.setItem(
        "literary_heritage_state",
        JSON.stringify({ state: { visitedMap: true, achievements: [] }, version: 2 })
      );
    },
    { nextTheme: theme, nextLanguage: language }
  );
  await page.goto(`${originUrl}?map-stage-3=${Date.now()}#${mapPath}`);
  await expect(page.locator(".world-map-page")).toBeVisible();
  await expect(page.getByTestId("map-marker")).toHaveCount(totalPlaces);
  await expect(page.getByTestId("map-place-count")).toContainText(String(totalPlaces));
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  expect(hasOverflow).toBe(false);
}

async function expectMarkersInsideMap(page, { inset = 0 } = {}) {
  const markersOutside = await page.evaluate(() => {
    const map = document.querySelector(".mura-map-canvas")?.getBoundingClientRect();
    if (!map) return [{ id: "missing-map", rect: null, map: null }];

    return [...document.querySelectorAll('[data-testid="map-marker"]')]
      .map((marker) => {
        const rect = marker.getBoundingClientRect();
        return {
          id: marker.getAttribute("data-place-id"),
          rect: {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
          },
          map: {
            left: map.left,
            right: map.right,
            top: map.top,
            bottom: map.bottom,
          },
          inside:
            rect.left >= map.left &&
            rect.right <= map.right &&
            rect.top >= map.top &&
            rect.bottom <= map.bottom,
        };
      })
      .filter((marker) => !marker.inside);
  });

  expect(markersOutside, JSON.stringify(markersOutside, null, 2)).toEqual([]);

  if (!inset) return;

  const markersNearFrame = await page.evaluate((innerInset) => {
    const map = document.querySelector(".mura-map-canvas")?.getBoundingClientRect();
    if (!map) return [{ id: "missing-map", rect: null, map: null }];

    return [...document.querySelectorAll('[data-testid="map-marker"]')]
      .map((marker) => {
        const rect = marker.getBoundingClientRect();
        return {
          id: marker.getAttribute("data-place-id"),
          tooClose:
            rect.left < map.left + innerInset ||
            rect.right > map.right - innerInset ||
            rect.top < map.top + innerInset ||
            rect.bottom > map.bottom - innerInset,
        };
      })
      .filter((marker) => marker.tooClose);
  }, inset);

  expect(markersNearFrame, JSON.stringify(markersNearFrame, null, 2)).toEqual([]);
}

async function markerPosition(marker) {
  return marker.evaluate((node) => {
    const style = window.getComputedStyle(node);
    return { left: style.left, top: style.top, transform: style.transform };
  });
}

test.describe("MURA literary map", () => {
  test("shows all places, keeps marker icons inside the map, spreads nearby markers, and keeps hover anchor stable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoMap(page, { theme: "dark", language: "en" });

    await expect(page.locator(".mura-map-stats")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("toast");
    await expectMarkersInsideMap(page, { inset: 24 });

    const groupedMarkers = await page.getByTestId("map-marker").evaluateAll((markers) =>
      markers.filter((marker) => Number(marker.getAttribute("data-group-size")) > 1).length
    );
    expect(groupedMarkers).toBeGreaterThan(0);

    const marker = page.getByTestId("map-marker").nth(4);
    const before = await markerPosition(marker);
    await marker.hover();
    const after = await markerPosition(marker);
    expect(after).toEqual(before);

    await expectNoHorizontalOverflow(page);
    await page.locator(".mura-map-hero").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-screenshots/map-stage3-dark-desktop.png", fullPage: true });
  });

  test("featured click opens the matching selected place and focused marker", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoMap(page, { theme: "light", language: "en" });

    const featured = page.getByTestId("featured-place").filter({ hasText: "M. Auezov House Museum" });
    await featured.click();

    await expect(page.getByTestId("selected-place")).toContainText("M. Auezov House Museum");
    await expect(page.locator('[data-testid="map-marker"][data-place-id="auezov-house-almaty"]')).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(page.getByTestId("selected-place")).toContainText("Almaty, Almaty");
    await expect(page.getByTestId("selected-place")).toContainText("House museum");
    await expect(page.getByTestId("selected-place")).not.toContainText(/\b\d{2}\.\d{4},\s*\d{2}\.\d{4}\b/);
    await expectMarkersInsideMap(page);

    await expectNoHorizontalOverflow(page);
    await page.locator(".mura-map-hero").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-screenshots/map-stage3-light-desktop.png", fullPage: true });
  });

  test("selected Abai museum has a real image, detailed content, no coordinates, and no repeated location type line", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoMap(page, { theme: "light", language: "en" });

    const selected = page.getByTestId("selected-place");
    await expect(selected).toContainText("Abai Literary-Memorial Museum");
    await expect(selected).toContainText("Semey, Abai region");
    await expect(selected).toContainText("Museum-reserve");
    await expect(selected).toContainText("Historical significance");
    await expect(selected).toContainText("manuscripts");
    await expect(selected).toContainText("key literary memory centers");
    await expect(selected).not.toContainText("Semey · Abai region · Museum-reserve");
    await expect(selected).not.toContainText(/\b\d{2}\.\d{4},\s*\d{2}\.\d{4}\b/);

    await expect
      .poll(async () =>
        selected.locator("img").evaluate((img) => {
          const element = /** @type {HTMLImageElement} */ (img);
          return Boolean(element.currentSrc) && element.naturalWidth > 0 && element.naturalHeight > 0;
        })
      )
      .toBe(true);

    const currentSrc = await selected.locator("img").evaluate((img) => {
      const element = /** @type {HTMLImageElement} */ (img);
      return element.currentSrc;
    });
    expect(currentSrc).not.toContain("/assets/collection-");
    expect(currentSrc).not.toContain("/assets/map-place-abai");
  });

  test("filters update markers, count, featured list, selected card, and reset", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await gotoMap(page, { theme: "dark", language: "en" });

    await page.locator(".mura-map-sidebar select").first().selectOption("almaty");
    await expect(page.getByTestId("map-marker")).toHaveCount(4);
    await expect(page.getByTestId("map-place-count")).toContainText("4");
    await expect(page.getByTestId("featured-place")).toHaveCount(4);
    await expect(page.getByTestId("selected-place")).toContainText("Almaty");
    await expectMarkersInsideMap(page);

    await page.locator(".mura-map-sidebar select").nth(2).selectOption("library");
    await expect(page.getByTestId("map-marker")).toHaveCount(1);
    await expect(page.getByTestId("map-place-count")).toContainText("1");
    await expect(page.getByTestId("selected-place")).toContainText("National Library of Kazakhstan");
    await expectMarkersInsideMap(page);

    await page.locator(".mura-map-sidebar section > button").click();
    await expect(page.getByTestId("map-marker")).toHaveCount(totalPlaces);
    await expect(page.getByTestId("map-place-count")).toContainText(String(totalPlaces));
    await expect(page.getByTestId("selected-place")).toContainText("Abai Literary-Memorial Museum");
    await expectMarkersInsideMap(page);
  });

  test("mobile map keeps every marker visible and screenshot remains clean", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoMap(page, { theme: "dark", language: "en" });

    await expectMarkersInsideMap(page);
    await expect(page.getByTestId("selected-place")).not.toContainText(/\b\d{2}\.\d{4},\s*\d{2}\.\d{4}\b/);
    await expectNoHorizontalOverflow(page);
    await page.locator(".mura-map-hero").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-screenshots/map-stage3-mobile.png", fullPage: true });
  });
});
