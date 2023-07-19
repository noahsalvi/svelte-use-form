import test, { expect } from "@playwright/test";

test("Dynamic Validators (Validators with changing parameters)", async ({
  page,
}) => {
  await page.goto("examples/dynamic-validator");

  const inputA = page.locator("#inputA");
  const inputB = page.locator("#inputB");
  const isMatching = page.locator("#is-matching");
  const isRequiredErrorTriggered = page.locator("#is-empty");

  expect(inputB).not.toHaveText(await inputA.inputValue());
  await expect(isMatching).toHaveText("No");

  await inputB.type(await inputA.inputValue());
  await expect(isMatching).toHaveText("Yes");

  await inputB.type("A");
  await expect(isMatching).toHaveText("No");

  // Focus important so that the cursor is placed at the end
  await inputA.focus();
  await inputA.type("A");
  await expect(isMatching).toHaveText("Yes");
  await expect(isRequiredErrorTriggered).not.toBeChecked();

  await inputB.clear();
  await expect(isRequiredErrorTriggered).toBeChecked();
});
