import test, { expect } from "@playwright/test";

test("suf-ignore", async ({ page }) => {
  await page.goto("examples/ignore-attribute");
  const registeredList = page.locator('[id="registered"]');
  await expect(registeredList).toHaveText("emailname"); // as emailname is the list content: - email - name
});
