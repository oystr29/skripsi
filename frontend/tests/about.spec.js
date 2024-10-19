import { expect, test } from '@playwright/test';

test('halaman tentang harus muncul', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText('Tentang Website')).toBeVisible();
});
