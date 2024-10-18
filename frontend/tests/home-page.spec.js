import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('home page should have 4 levels button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button', { hasText: 'Level' })).toHaveCount(4);
  });

  test('level button shoud go to level detail page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Level 1' }).click();
    await expect(page.getByRole('heading', { name: 'Level 1' })).toBeVisible();
  });

  test('about link shoud go to about page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('heading', { name: 'Tentang Website' })).toBeVisible();
  });

  test('report link shoud go to report page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Report' }).click();
    await expect(page.getByRole('heading', { name: 'Report' })).toBeVisible();
  });
});
