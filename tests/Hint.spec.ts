import { expect, test } from "@playwright/test";

test("Hint.svelte", async ({ page }) => {
  await page.goto("/test/hint");
  const input = page.getByRole("textbox");
  const requiredHint = page.getByText("Required");
  const emailHint = page.getByText("Email");

  await expect(requiredHint).not.toBeVisible();
  await expect(emailHint).not.toBeVisible();

  await input.click();
  await input.press("Tab");
  await expect(requiredHint).toBeVisible();

  await input.type("max");
  await expect(requiredHint).not.toBeVisible();

  await input.type("@example.com");
  await expect(emailHint).not.toBeVisible();
});
