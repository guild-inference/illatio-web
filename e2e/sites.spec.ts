import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 390, 320])
  for (const route of ['/', '/labs/', '/cloud/']) {
    test(`${route} accessible at ${width}px`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBeTruthy();
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
      expect(errors).toEqual([]);
      await page.screenshot({ path: info.outputPath('page.png'), fullPage: true });
    });
  }
test('keyboard navigation and the mathematical storage explorer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();
  await page.getByText('Menu', { exact: false }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Guild Labs' })
    .click();
  await expect(page).toHaveURL(/\/labs\/$/);
  const slider = page.getByRole('slider');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#scale-label')).toHaveText('36');
  await expect(page.locator('[data-bits="16"]')).toHaveText('67.06 GiB');
});
