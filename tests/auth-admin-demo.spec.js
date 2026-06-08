// @ts-check
import { expect, test } from "@playwright/test";

const originUrl = "http://127.0.0.1:5173/literary-heritage/";

async function gotoApp(page, hash) {
  await page.addInitScript(() => {
    window.localStorage.setItem("literary_heritage_language", "en");
    window.localStorage.setItem("literary_heritage_theme", "dark");
  });
  await page.goto(`${originUrl}?auth-admin=${Date.now()}#${hash}`);
}

test.describe("auth and demo admin access", () => {
  test("auth routes open login, forgot password, and reset-password fallback", async ({ page }) => {
    await gotoApp(page, "/auth");
    await expect(page.locator(".auth-card")).toBeVisible();

    const forgotButton = page.getByRole("button", { name: "Forgot password?" });
    if (await forgotButton.isVisible()) {
      await forgotButton.click();
      await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();
    }

    await gotoApp(page, "/reset-password");
    await expect(page.locator(".auth-card")).toBeVisible();
    await expect(page.locator(".auth-card__message")).toContainText(/missing|expired/i);
    await expect(page.getByRole("button", { name: "Send a new reset link" })).toBeVisible();
  });

  test("admin page opens in public read-only demo mode for guests", async ({ page }) => {
    await gotoApp(page, "/admin");

    await expect(page.locator(".admin-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Demo admin mode" })).toBeVisible();
    await expect(page.locator(".admin-stats article")).toHaveCount(4);
    await expect(page.locator(".admin-readonly-card").first()).toBeVisible();
    await expect(page.locator(".admin-danger")).toHaveCount(0);
    await expect(page.locator(".admin-submit")).toHaveCount(0);
    await expect(page.locator(".admin-list__item button")).toHaveCount(0);
  });
});
