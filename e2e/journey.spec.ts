import { expect, test } from '@playwright/test';

interface JourneyState {
  phase: 'IDLE' | 'PLAYING' | 'GAME_OVER';
  player: { y: number; vy: number };
  pairs: Array<{ gapCenter: number; scored: boolean }>;
  score: number;
}

async function getState(page: import('@playwright/test').Page): Promise<JourneyState> {
  return page.evaluate(() => window.__fh!.getState());
}

async function tick(page: import('@playwright/test').Page, count = 1): Promise<void> {
  await page.evaluate((ticks) => window.__fh!.advanceTicks(ticks), count);
}

test('passes a locker, scores once, crashes, and restarts cleanly', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.goto('/?test=1');
  await page.waitForFunction(() => Boolean(window.__fh));
  await page.keyboard.press('Space');

  for (let count = 0; count < 500; count += 1) {
    const current = await getState(page);
    if (current.score === 1 || current.phase === 'GAME_OVER') break;
    const target = current.pairs[0]?.gapCenter ?? 275;
    const playerCenter = current.player.y + 17;
    if (playerCenter > target + 4 && current.player.vy > -100) await page.keyboard.press('Space');
    await tick(page);
  }

  const scored = await getState(page);
  expect(scored.phase).toBe('PLAYING');
  expect(scored.score).toBe(1);
  expect(scored.pairs.some((pair) => pair.scored)).toBe(true);

  await tick(page, 5);
  expect((await getState(page)).score).toBe(1);

  for (let count = 0; count < 300; count += 1) {
    if ((await getState(page)).phase === 'GAME_OVER') break;
    await tick(page);
  }
  expect((await getState(page)).phase).toBe('GAME_OVER');
  await tick(page, 30);
  await page.getByRole('button', { name: 'Try again' }).click();
  await tick(page);
  expect(await getState(page)).toMatchObject({ phase: 'IDLE', score: 0, pairs: [] });
  expect(consoleErrors).toEqual([]);
});

