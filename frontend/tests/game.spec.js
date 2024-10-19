import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  const level = Math.floor(Math.random() * 4) + 1;
  await page.goto(`/${level}/game`);
  await context.grantPermissions(['camera']);
});

test('halaman game harus muncul', async ({ page }) => {
  await expect(page.getByText('Ikuti Huruf')).toBeVisible();
});

test('tutup modal dengan tombol', async ({ page }) => {
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('button', { name: 'Close' })).toBeHidden();
});

test('otomatis tutup modal setelah 3 detik', async ({ page }) => {
  await expect(async () => {
    await expect(page.getByRole('button', { name: 'Close' })).toBeHidden();
  }).toPass();
});

test('gambar alfabet bisindo muncul', async ({ page }) => {
  await expect(page.getByAltText('gambar-tangan')).toBeVisible();
});

test('teks alfabet muncul', async ({ page }) => {
  await expect(page.locator('#letter')).toBeVisible();
});

test('teks kata muncul', async ({ page }) => {
  await expect(page.locator('#word')).toBeVisible();
});

test('tombol skip huruf mengganti huruf', async ({ page }) => {
  await page.getByRole('button', { name: 'Close' }).click();

  const prevLetter = await page.locator('#letter').innerHTML();

  await expect(async () => {
    await page.getByRole('button', { name: 'Skip Huruf' }).click();
  }).toPass();

  const nowLetter = await page.locator('#letter').innerHTML();

  await expect(() => {
    expect(prevLetter !== nowLetter).toBeTruthy();
  }).toPass();
});
