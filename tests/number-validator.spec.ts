import test, { expect } from "@playwright/test";

const validNumbers = ["0", "1234567890", "01", "-11", "-1.09", "34.56"];

test(`Verify valid numbers are marked as valid by the numbers validator`, async ({
  page,
}) => {
  for (const num of validNumbers) {
    await page.goto("examples/number-validator");

    page.on("console", (msg) => {
      console.log(msg);
    });

    const input = page.locator("#testNumberField");
    const isRequiredErrorTriggered = page.locator("#isValid");

    await input.clear();
    await input.type(num);
    await expect(isRequiredErrorTriggered).not.toBeChecked();
  }
});

const invalidNumbers = ["1-0", "2-", "3.4.5", "one", "true"];

test(`Verify invalid numbers are marked as invalid by the numbers validator`, async ({
  page,
}) => {
  for (const num of invalidNumbers) {
    await page.goto("examples/number-validator");

    page.on("console", (msg) => {
      console.log(msg);
    });

    const input = page.locator("#testNumberField");
    const isRequiredErrorTriggered = page.locator("#isValid");

    await input.clear();
    await input.type(num);
    await expect(isRequiredErrorTriggered).toBeChecked();
  }
});
