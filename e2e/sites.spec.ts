import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 390, 320])
  for (const route of ['/', '/labs/', '/cloud/']) {
    test(`${route} accessible at ${width}px`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(450);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBeTruthy();
      expect(
        await page.evaluate(() =>
          [...document.querySelectorAll('.pillar, .paper, .band, .notice')].every(
            (el) => Number(getComputedStyle(el).opacity) === 1,
          ),
        ),
      ).toBeTruthy();
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
      expect(errors).toEqual([]);
      await page.screenshot({ path: info.outputPath('page.png'), fullPage: true });
    });
  }

test('keyboard navigation, warm harmony toggles, token pulse, and storage explorer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();
  await page.getByRole('button', { name: 'Send a token pulse' }).click();
  await expect(page.locator('[data-field-card]')).toHaveClass(/is-pulsing/);
  await page.getByRole('button', { name: 'Large-RAM host' }).click();
  await expect(page.locator('#harmony-caption')).toContainText('NUMA-interleaved');
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
  await page.getByRole('button', { name: /Shuffle sample trits/ }).click();
  await expect(page.locator('.ternary-chip')).toHaveCount(24);
});
