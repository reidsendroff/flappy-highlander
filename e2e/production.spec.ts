import { expect, test } from '@playwright/test';

test('production build completes a real-time player journey without test hooks', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/?test=1');
  await expect(page.getByRole('heading', { name: 'Flappy Highlander' })).toBeVisible();
  expect(await page.evaluate(() => window.__fh)).toBeUndefined();
  await page.screenshot({ path: testInfo.outputPath('start.png') });

  await page.getByRole('button', { name: 'Start flying' }).click();
  await expect(page.locator('#score')).toBeVisible();
  await page.waitForTimeout(150);
  await page.screenshot({ path: testInfo.outputPath('gameplay.png') });

  await expect(page.getByRole('heading', { name: 'Game over' })).toBeVisible({ timeout: 5_000 });
  await page.screenshot({ path: testInfo.outputPath('game-over.png') });
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('button', { name: 'Start flying' })).toBeVisible();

  const externalResources = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => !url.startsWith(window.location.origin)),
  );
  expect(externalResources).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

