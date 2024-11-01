import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('harus punya 4 tombol level', async ({ page }) => {
  await expect(page.locator('button', { hasText: 'Level' })).toHaveCount(4);
});

test('tekan tombol level harus ke halaman detail level', async ({ page }) => {
  const level = Math.floor(Math.random() * 4) + 1;
  await page.getByRole('button', { name: `Level ${level}` }).click();
  await expect(page.getByRole('heading', { name: `Level ${level}` })).toBeVisible();
});

test('klik link tentang harus ke halaman tentang', async ({ page }) => {
  await page.getByRole('link', { name: 'Tentang' }).click();
  await expect(page.getByRole('heading', { name: 'Tentang Website' })).toBeVisible();
});

test('klik link laporan harus ke halaman laporan', async ({ page }) => {
  await page.getByRole('link', { name: 'Laporan' }).click();
  await expect(page.getByRole('heading', { name: 'Laporan' })).toBeVisible();
});
