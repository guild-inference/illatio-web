import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 390, 320])
  for (const route of ['/', '/labs/']) {
    test(`${route} accessible at ${width}px`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(450);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBeTruthy();
      expect(
        await page.evaluate(() => Number(getComputedStyle(document.querySelector('h1')!).opacity)),
      ).toBe(1);
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
      expect(errors).toEqual([]);
      await page.screenshot({ path: info.outputPath('page.png'), fullPage: true });
    });
  }

test('home: skip link, and routing your own word', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to content')).toBeFocused();
  await page.locator('#sparse').scrollIntoViewIfNeeded();
  await page.getByLabel('Route your own word').fill('hardware');
  await expect(page.locator('#route-result')).toContainText('goes to experts');
  await expect(page.locator('#peak-field > i.is-on')).toHaveCount(10);
  await expect(page.locator('#trace-field > i.is-heat').first()).toBeAttached();
});

test('labs: the precision dial regrades the page, and the storage slider', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/labs/');
  await page.getByRole('radio', { name: '1.58' }).check({ force: true });
  await expect(page.locator('html')).toHaveAttribute('data-precision', '1.58');
  await expect(page.locator('[data-distinct]')).toHaveText('3');
  await expect(page.locator('[data-precision-mode]')).toHaveText('Set by you.');
  const slider = page.getByRole('slider');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#scale-label')).toHaveText('36');
  await expect(page.locator('[data-bits="16"]')).toHaveText('67.06 GiB');
  await expect(page.locator('[data-bits="1.58"]')).toHaveText('6.64 GiB');
});

test('every cue is readable with JavaScript off', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of ['/', '/labs/']) {
    await page.goto(route);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('[data-sc-cue], [data-sc-in], [data-sc-stagger] > *')]
        .filter((el) => (el.textContent || '').trim())
        .filter((el) => Number(getComputedStyle(el).opacity) < 1)
        .map((el) => (el.textContent || '').trim().slice(0, 40)),
    );
    expect(hidden, route).toEqual([]);
  }
  await page.goto('/');
  await expect(page.locator('#illatio')).toContainText('Parked');
  await context.close();
});

test('the shared nav and footer carry no Cloud entry', async ({ page }) => {
  for (const route of ['/', '/labs/']) {
    await page.goto(route);
    await expect(page.locator('.gnav a')).toHaveText([
      'The Guild Inference Project',
      'Engine',
      'Docs',
      'Models',
      'Labs',
      'GitHub',
    ]);
    await expect(page.locator('.gfoot')).not.toContainText('Cloud');
  }
});
