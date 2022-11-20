import test, { expect } from "@playwright/test";

test("suf-ignore", async ({ page }) => {
  await page.goto("test/ignore");
  await expect(page.getByText("Email registered")).toBeVisible();
  await expect(page.getByText("Search registered")).not.toBeVisible();
});
