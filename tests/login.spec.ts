import test, { expect } from "@playwright/test";

test("Login Example", async ({ page }) => {
  await page.goto("examples/login");
  const email = page.getByPlaceholder("Email");
  const password = page.getByPlaceholder("password");
  const button = page.locator("button");

  await expect(button).toBeDisabled();
  await expect(email).not.toHaveClass("touched");
  await expect(password).not.toHaveClass("touched");

  await email.type("max@");
  await expect(email).toHaveClass("touched");
  await expect(password).not.toHaveClass("touched");
  await password.type("random pass");
  await expect(button).toBeDisabled();

  await email.type("example.com");
  await expect(password).toHaveClass("touched");
  await expect(button).toBeEnabled();
});
