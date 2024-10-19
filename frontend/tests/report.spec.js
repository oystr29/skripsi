import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/report');
});

test('halaman laporan harus muncul', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Laporan' })).toBeVisible();
});

test.describe('Laporan Model 1 Tangan', async () => {
  test('tabs 1 tangan harus muncul', async ({ page }) => {
    await expect(async () => {
      await page.getByRole('tab', { name: 'CM 1 Tangan' }).click();
      await expect(page.getByText('Gambar 1 Tangan')).toBeVisible();
    }).toPass();
  });

  test('gambar harus muncul', async ({ page }) => {
    await expect(async () => {
      await page.getByRole('tab', { name: 'CM 1 Tangan' }).click();
      await expect(page.getByAltText('cm-1')).toBeVisible();
    }).toPass();
  });

  test('tabel perhitungan harus muncul', async ({ page }) => {
    await expect(async () => {
      await page.getByRole('tab', { name: 'CM 1 Tangan' }).click();
      await expect(page.getByRole('table')).toBeVisible();
    }).toPass();
  });
});

test.describe('Laporan Model 2 Tangan', async () => {
  test('tabs 2 tangan harus muncul', async ({ page }) => {
    await expect(async () => {
      await page.getByRole('tab', { name: 'CM 2 Tangan' }).click();
      await expect(page.getByText('Gambar 2 Tangan')).toBeVisible();
    }).toPass();
  });

  test('gambar harus muncul', async ({ page }) => {
    await expect(async () => {
      await page.getByRole('tab', { name: 'CM 2 Tangan' }).click();
      await expect(page.getByAltText('cm-2')).toBeVisible();
    }).toPass();
  });

  test('tabel perhitungan harus muncul', async ({ page }) => {
    await expect(async () => {
      await page.getByRole('tab', { name: 'CM 2 Tangan' }).click();
      await expect(page.getByRole('table')).toBeVisible();
    }).toPass();
  });
});
