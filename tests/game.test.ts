import { describe, expect, it } from 'vitest';
import { CONFIG } from '../src/config';
import { createGame, stepGame } from '../src/game';

const rng = (): number => 0.5;

describe('game lifecycle', () => {
  it('starts from idle and applies exactly one opening flap', () => {
    const state = createGame(CONFIG);
    stepGame(state, true, CONFIG.timing.fixedStep, rng, CONFIG);
    expect(state.phase).toBe('PLAYING');
    expect(state.player.vy).toBeGreaterThan(-420);
    expect(state.player.y).toBeLessThan(CONFIG.player.startY);
  });

  it('falls to the floor and freezes after game over', () => {
    const state = createGame(CONFIG);
    stepGame(state, true, CONFIG.timing.fixedStep, rng, CONFIG);
    for (let tick = 0; tick < 300 && state.phase === 'PLAYING'; tick += 1) {
      stepGame(state, false, CONFIG.timing.fixedStep, rng, CONFIG);
    }
    expect(state.phase).toBe('GAME_OVER');
    const frozenY = state.player.y;
    stepGame(state, false, 1, rng, CONFIG);
    expect(state.player.y).toBe(frozenY);
  });

  it('ignores early restart and resets cleanly after the lockout', () => {
    const state = createGame(CONFIG);
    state.phase = 'GAME_OVER';
    state.score = 7;
    state.gameOverElapsed = 0;
    stepGame(state, true, 0.3, rng, CONFIG);
    expect(state.phase).toBe('GAME_OVER');
    stepGame(state, true, 0.05, rng, CONFIG);
    expect(state).toEqual(createGame(CONFIG));
  });
});

