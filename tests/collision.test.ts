import { describe, expect, it } from 'vitest';
import { getLockerRects, getPlayerHitbox, touches, touchesFloor, touchesLocker } from '../src/collision';
import { CONFIG } from '../src/config';
import type { LockerPair, Player, Rect } from '../src/types';

const pair: LockerPair = { id: 1, x: 100, gapCenter: 275, scored: false };

describe('collision geometry', () => {
  it('counts touching rectangle edges as contact', () => {
    const left: Rect = { x: 0, y: 0, width: 10, height: 10 };
    const right: Rect = { x: 10, y: 2, width: 10, height: 4 };
    expect(touches(left, right)).toBe(true);
  });

  it('does not collide across a one-pixel separation', () => {
    expect(touches({ x: 0, y: 0, width: 10, height: 10 }, { x: 11, y: 0, width: 4, height: 4 })).toBe(false);
  });

  it('creates top and bottom locker rectangles around the gap', () => {
    const [top, bottom] = getLockerRects(pair, CONFIG);
    expect(top.height).toBe(195);
    expect(bottom.y).toBe(355);
    expect(bottom.height).toBe(195);
  });

  it('allows a centered player through the gap', () => {
    const player: Player = { x: 110, y: 258, vy: 0 };
    expect(touchesLocker(getPlayerHitbox(player, CONFIG), pair, CONFIG)).toBe(false);
  });

  it('lets decorative pixels graze while the inset hitbox stays clear', () => {
    const visualGraze: Player = { x: 56, y: 258, vy: 0 };
    expect(visualGraze.x + CONFIG.player.width).toBe(pair.x);
    expect(touchesLocker(getPlayerHitbox(visualGraze, CONFIG), pair, CONFIG)).toBe(false);
  });

  it('detects a locker overlap and floor contact', () => {
    const highPlayer: Player = { x: 100, y: 175, vy: 0 };
    expect(touchesLocker(getPlayerHitbox(highPlayer, CONFIG), pair, CONFIG)).toBe(true);
    const floorPlayer: Player = { x: 90, y: 520, vy: 0 };
    expect(touchesFloor(getPlayerHitbox(floorPlayer, CONFIG), CONFIG)).toBe(true);
  });
});

