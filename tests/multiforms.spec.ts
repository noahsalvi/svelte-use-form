import test, { expect } from "@playwright/test";

test("multi-forms", async ({ page }) => {
  await page.goto("examples/multi-forms");

  // Forms
  const form1 = page.getByTestId("form-one");
  const form2 = page.getByTestId("form-two");

  // Form 1
  const form1Input = form1.getByTestId("input-form-one");
  const form1Submit = form1.getByTestId("submit-form-one");
  const form1HintMin = form1.getByTestId("hint-min-form-one");
  const form1HintMax = form1.getByTestId("hint-max-form-one");

  // Form 2
  const form2Input = form2.getByTestId("input-form-two");
  const form2Submit = form2.getByTestId("submit-form-two");
  const form2HintMin = form2.getByTestId("hint-min-form-two");
  const form2HintMax = form2.getByTestId("hint-max-form-two");

  // Form one tests:
  await expect(form1Submit).toBeDisabled();
  await expect(form1HintMin).toBeHidden();
  await expect(form1HintMax).toBeHidden();
  await form1Input.fill("12");
  await form1Input.blur();
  await expect(form1HintMin).toBeVisible();
  await expect(form1HintMax).toBeHidden();
  // Form 2 hints should be hidden as well
  await expect(form2HintMin).toBeHidden();
  await expect(form2HintMax).toBeHidden();
  await form1Input.fill("123456");
  await form1Input.blur();
  await expect(form1HintMin).toBeHidden();
  await expect(form1HintMax).toBeVisible();
  // Form 2 hints should be hidden as well
  await expect(form2HintMin).toBeHidden();
  await expect(form2HintMax).toBeHidden();
  await form1Input.fill("1234");
  await form1Input.blur();
  await expect(form1HintMin).toBeHidden();
  await expect(form1HintMax).toBeHidden();
  await expect(form1Submit).toBeEnabled();
  
  // Form two tests:
  await expect(form2Submit).toBeDisabled(); 
  await expect(form2HintMin).toBeHidden();
  await expect(form2HintMax).toBeHidden();
  await form2Input.fill("12");
  await form2Input.blur();
  await expect(form2HintMin).toBeVisible();
  await expect(form2HintMax).toBeHidden();
  // Form 1 hints should be hidden as well
  await expect(form1HintMin).toBeHidden();
  await expect(form1HintMax).toBeHidden();
  await form2Input.fill("12345678");
  await form2Input.blur();
  await expect(form2HintMin).toBeHidden();
  await expect(form2HintMax).toBeVisible();
  // Form 1 hints should be hidden as well
  await expect(form1HintMin).toBeHidden();
  await expect(form1HintMax).toBeHidden();
  await form2Input.fill("123456");
  await form2Input.blur();
  await expect(form2HintMin).toBeHidden();
  await expect(form2HintMax).toBeHidden();
  await expect(form2Submit).toBeEnabled();

});
