import { expect, test } from '@playwright/test';

interface BridgeState {
  phase: 'IDLE' | 'PLAYING' | 'GAME_OVER';
  player: { y: number; vy: number };
  score: number;
  pairs: unknown[];
}

async function state(page: import('@playwright/test').Page): Promise<BridgeState> {
  return page.evaluate(() => window.__fh!.getState());
}

async function tick(page: import('@playwright/test').Page, count = 1): Promise<void> {
  await page.evaluate((ticks) => window.__fh!.advanceTicks(ticks), count);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=1');
  await page.waitForFunction(() => Boolean(window.__fh));
});

test('Space starts play with one flap and does not scroll', async ({ page }) => {
  await page.keyboard.press('Space');
  await tick(page);
  const current = await state(page);
  expect(current.phase).toBe('PLAYING');
  expect(current.player.vy).toBeGreaterThan(-420);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('a pointer action starts play exactly once', async ({ page }, testInfo) => {
  const playfield = page.locator('#start-panel');
  if (testInfo.project.name === 'desktop') await playfield.click({ position: { x: 20, y: 20 } });
  else await playfield.tap({ position: { x: 20, y: 20 } });
  await tick(page);
  const afterFirstTick = await state(page);
  await tick(page);
  const afterSecondTick = await state(page);
  expect(afterFirstTick.phase).toBe('PLAYING');
  expect(afterSecondTick.player.vy).toBeGreaterThan(afterFirstTick.player.vy);
});

test('falling reaches game over and restart waits for the lockout', async ({ page }) => {
  await page.keyboard.press('Space');
  for (let count = 0; count < 300; count += 1) {
    await tick(page, 1);
    if ((await state(page)).phase === 'GAME_OVER') break;
  }
  expect((await state(page)).phase).toBe('GAME_OVER');

  await page.keyboard.press('Space');
  await tick(page, 1);
  expect((await state(page)).phase).toBe('GAME_OVER');

  await tick(page, 30);
  await page.keyboard.press('Space');
  await tick(page, 1);
  const restarted = await state(page);
  expect(restarted.phase).toBe('IDLE');
  expect(restarted.score).toBe(0);
  expect(restarted.pairs).toEqual([]);
});

