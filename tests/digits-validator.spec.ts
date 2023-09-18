import test, { expect } from "@playwright/test";

const validDigits = ["0", "1234567890", "01"];

test(`Verify valid digits are marked as valid by the digits validator`, async ({
  page,
}) => {
  for (const digit of validDigits) {
    await page.goto("examples/digits-validator");

    const input = page.locator("#testDigitsField");
    const isRequiredErrorTriggered = page.locator("#isValid");

    await input.clear();
    await input.type(digit);
    await expect(isRequiredErrorTriggered).not.toBeChecked();
  }
});

const invalidDigits = ["-0", "1.9", "one", "true"];

test(`Verify invalid digits are marked as invalid by the digits validator`, async ({
  page,
}) => {
  for (const digit of invalidDigits) {
    await page.goto("examples/digits-validator");

    const input = page.locator("#testDigitsField");
    const isRequiredErrorTriggered = page.locator("#isValid");

    await input.clear();
    await input.type(digit);
    await expect(isRequiredErrorTriggered).toBeChecked();
  }
});
