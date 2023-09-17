import test, { expect } from "@playwright/test";

const validEmails = [
  "email@test.com",
  "email@test.xyz",
  "email@test.a",
  "example.address@t.co",
  "example.address@a.b.c.d.e.f.g",
  "example_address@a.b.c",
  "example_address_2@a.b.c",
];

test(`Verify valid emails are marked as valid by the emailWithTld validator`, async ({
  page,
}) => {
  for (const address of validEmails) {
    await page.goto("examples/email-validator");

    const input = page.locator("#testEmailField");
    const isRequiredErrorTriggered = page.locator("#isValid");

    await input.clear();
    await input.type(address);
    await expect(isRequiredErrorTriggered).not.toBeChecked();
  }
});

const invalidEmails = [
  "email@test",
  "example.address@noTLD",
  "example.com@a",
  "example.com@a@.com",
  "example@a@.com",
  "example.com@.com",
  "example@.com",
  "example.com",
  "example",
  "@example.com",
];

test(`Verify invalid emails are marked as invalid by the emailWithTld validator`, async ({
  page,
}) => {
  for (const address of invalidEmails) {
    await page.goto("examples/email-validator");

    const input = page.locator("#testEmailField");
    
    const isRequiredErrorTriggered = page.locator("#isValid");

    await input.clear();
    await input.type(address);
    await expect(isRequiredErrorTriggered).toBeChecked();
  }
});
