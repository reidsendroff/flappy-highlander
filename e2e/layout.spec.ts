import { expect, test } from '@playwright/test';

const sizes = [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
];

test('playfield fits common laptop and phone viewports', async ({ page }) => {
  for (const size of sizes) {
    await page.setViewportSize(size);
    await page.goto('/?test=1');
    const box = await page.locator('#game-shell').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(size.width + 0.5);
    expect(box!.height).toBeLessThanOrEqual(size.height + 0.5);
    expect(box!.width / box!.height).toBeCloseTo(2 / 3, 2);
    expect(await page.evaluate(() => ({
      horizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      vertical: document.documentElement.scrollHeight > document.documentElement.clientHeight,
    }))).toEqual({ horizontal: false, vertical: false });
  }
});

test('controls are readable, focusable, and at least 44 pixels tall', async ({ page }) => {
  await page.goto('/?test=1');
  const start = page.getByRole('button', { name: 'Start flying' });
  await expect(start).toBeVisible();
  expect((await start.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await start.focus();
  await expect(start).toBeFocused();
  await expect(page.locator('#game-announcer')).toContainText('ready');
});

