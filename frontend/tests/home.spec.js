import { expect, test } from '@playwright/test';

test('harus punya 4 tombol level', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button', { hasText: 'Level' })).toHaveCount(4);
});

test('tekan tombol level harus ke halaman detail level', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Level 1' }).click();
  await expect(page.getByRole('heading', { name: 'Level 1' })).toBeVisible();
});

test('klik link tentang harus ke halaman tentang', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Tentang' }).click();
  await expect(page.getByRole('heading', { name: 'Tentang Website' })).toBeVisible();
});

test('klik link laporan harus ke halaman laporan', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Laporan' }).click();
  await expect(page.getByRole('heading', { name: 'Laporan' })).toBeVisible();
});
