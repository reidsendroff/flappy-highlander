import { describe, expect, it } from 'vitest';
import { CONFIG } from '../src/config';
import { createGame } from '../src/game';
import { nextGap, updateObstacles } from '../src/obstacles';
import { createSeededRandom } from '../src/random';

describe('locker generation', () => {
  it('uses a repeatable seeded random sequence', () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(42);
    expect(Array.from({ length: 20 }, first)).toEqual(Array.from({ length: 20 }, second));
  });

  it('keeps 10,000 gaps inside global and adjacent limits', () => {
    const rng = createSeededRandom(73);
    let previous = CONFIG.obstacles.firstGapCenter;
    for (let index = 0; index < 10_000; index += 1) {
      const center = nextGap(previous, rng, CONFIG);
      expect(center).toBeGreaterThanOrEqual(CONFIG.obstacles.gapMinCenter);
      expect(center).toBeLessThanOrEqual(CONFIG.obstacles.gapMaxCenter);
      expect(Math.abs(center - previous)).toBeLessThanOrEqual(CONFIG.obstacles.maxGapShift);
      previous = center;
    }
  });

  it('spawns the first centered pair after 1.5 seconds', () => {
    const state = createGame(CONFIG);
    state.phase = 'PLAYING';
    const rng = createSeededRandom(1);
    updateObstacles(state, 1.49, rng, CONFIG);
    expect(state.pairs).toHaveLength(0);
    updateObstacles(state, 0.01, rng, CONFIG);
    expect(state.pairs).toHaveLength(1);
    expect(state.pairs[0]?.gapCenter).toBe(275);
    expect(state.pairs[0]?.x).toBe(400);
  });

  it('moves, regularly spawns, and removes offscreen pairs', () => {
    const state = createGame(CONFIG);
    state.phase = 'PLAYING';
    const rng = createSeededRandom(2);
    let maximumCount = 0;
    for (let tick = 0; tick < 60 * 30; tick += 1) {
      updateObstacles(state, 1 / 60, rng, CONFIG);
      maximumCount = Math.max(maximumCount, state.pairs.length);
    }
    expect(state.nextObstacleId).toBeGreaterThan(10);
    expect(maximumCount).toBeLessThanOrEqual(3);
    expect(state.pairs.every((pair) => pair.x + CONFIG.obstacles.width >= 0)).toBe(true);
  });
});

