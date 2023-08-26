import test, { expect } from "@playwright/test";

const valid_emails = [
  "email@test.com",
  "email@test.xyz",
  "email@test.a",
  "example.address@t.co",
  "example.address@a.b.c.d.e.f.g",
  "example_address@a.b.c",
  "example_address_2@a.b.c",
];

for (const address of valid_emails) {
  test(`${address} should be considered valid by the "email_with_tld" validator`, async ({
    page,
  }) => {
    await page.goto("examples/email-validator");

    const input = page.locator("#email_field");
    const isRequiredErrorTriggered = page.locator("#is-valid");

    await input.clear();
    await input.type(address);
    await expect(isRequiredErrorTriggered).not.toBeChecked();
  });
}

const invalid_emails = [
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

for (const address of invalid_emails) {
  test(`${address} should be considered invalid by the "email_with_tld" validator`, async ({
    page,
  }) => {
    await page.goto("examples/email-validator");

    const input = page.locator("#email_field");
    const isRequiredErrorTriggered = page.locator("#is-valid");

    await input.clear();
    await input.type(address);
    await expect(isRequiredErrorTriggered).toBeChecked();
  });
}
