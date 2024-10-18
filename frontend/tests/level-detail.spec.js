import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await page.goto('/1');
  await context.grantPermissions(['camera']);
});

test.describe('Level Detail Page', () => {
  test('should see text in level detail page', async ({ page }) => {
    await expect(page.getByText('Kamu akan memperagakan')).toBeVisible();
  });

  test("Let's Go! button should go to game page", async ({ page }) => {
    await expect(async () => {
      await page.getByRole('button', { name: "Let's Go!" }).click();
    }).toPass();

    await expect(async () => {
      await expect(page.getByText('Ikuti Huruf')).toBeVisible();
    }).toPass();
  });

  test('should see camera source picker', async ({ page }) => {
    await expect(page.locator('button.cam-src')).toBeVisible();
  });
});
