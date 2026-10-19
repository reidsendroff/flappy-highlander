import type { GameConfig } from './types';

export const CONFIG: Readonly<GameConfig> = Object.freeze({
  world: { width: 400, height: 600, floorHeight: 50 },
  player: {
    startX: 90,
    startY: 258,
    width: 44,
    height: 34,
    insetX: 6,
    insetY: 4,
  },
  physics: { gravity: 1400, flapVelocity: -420, maxFallVelocity: 600 },
  obstacles: {
    speed: 160,
    width: 60,
    gapHeight: 160,
    gapMinCenter: 140,
    gapMaxCenter: 410,
    maxGapShift: 100,
    firstGapCenter: 275,
    firstSpawnDelay: 1.5,
    spawnInterval: 1.9,
    spawnX: 400,
  },
  timing: {
    restartLockout: 0.35,
    fixedStep: 1 / 60,
    maxFrameElapsed: 0.05,
    maxDevicePixelRatio: 2,
  },
  palette: { red: '#C9362B', black: '#171717', white: '#FFFFFF', silver: '#B9BEC5' },
});

