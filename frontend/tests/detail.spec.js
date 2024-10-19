import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  const level = Math.floor(Math.random() * 4) + 1;
  await page.goto(`/${level}`);
  await context.grantPermissions(['camera']);
});

test('halaman detail level harus muncul', async ({ page }) => {
  await expect(page.getByText('Kamu akan memperagakan')).toBeVisible();
});

test("Tombol Let's Go! harus ke halaman game", async ({ page }) => {
  await expect(async () => {
    await page.getByRole('button', { name: "Let's Go!" }).click();
  }).toPass();

  await expect(async () => {
    await expect(page.getByText('Ikuti Huruf')).toBeVisible();
  }).toPass();
});

test('Tombol sumber kamera harus ada', async ({ page }) => {
  await expect(page.locator('button.cam-src')).toBeVisible();
});
