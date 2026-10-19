import { describe, expect, it } from 'vitest';
import { CONFIG } from '../src/config';
import { flap, updatePlayer } from '../src/physics';
import type { Player } from '../src/types';

describe('player physics', () => {
  it('a flap sets upward velocity to the configured value', () => {
    const player: Player = { x: 90, y: 258, vy: 300 };
    flap(player, CONFIG);
    expect(player.vy).toBe(-420);
  });

  it('integrates gravity and position using seconds', () => {
    const player: Player = { x: 90, y: 100, vy: 0 };
    updatePlayer(player, 0.1, CONFIG);
    expect(player.vy).toBe(140);
    expect(player.y).toBe(114);
  });

  it('caps falling speed', () => {
    const player: Player = { x: 90, y: 100, vy: 590 };
    updatePlayer(player, 1, CONFIG);
    expect(player.vy).toBe(600);
  });

  it('clamps the ceiling without ending play', () => {
    const player: Player = { x: 90, y: 2, vy: -420 };
    updatePlayer(player, 0.1, CONFIG);
    expect(player.y).toBe(0);
    expect(player.vy).toBe(0);
  });
});

