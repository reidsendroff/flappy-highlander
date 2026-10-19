export type GamePhase = 'IDLE' | 'PLAYING' | 'GAME_OVER';

export interface GameConfig {
  world: { width: number; height: number; floorHeight: number };
  player: {
    startX: number;
    startY: number;
    width: number;
    height: number;
    insetX: number;
    insetY: number;
  };
  physics: { gravity: number; flapVelocity: number; maxFallVelocity: number };
  obstacles: {
    speed: number;
    width: number;
    gapHeight: number;
    gapMinCenter: number;
    gapMaxCenter: number;
    maxGapShift: number;
    firstGapCenter: number;
    firstSpawnDelay: number;
    spawnInterval: number;
    spawnX: number;
  };
  timing: {
    restartLockout: number;
    fixedStep: number;
    maxFrameElapsed: number;
    maxDevicePixelRatio: number;
  };
  palette: {
    red: string;
    black: string;
    white: string;
    silver: string;
  };
}

export interface Player {
  x: number;
  y: number;
  vy: number;
}

export interface LockerPair {
  id: number;
  x: number;
  gapCenter: number;
  scored: boolean;
}

export interface GameState {
  phase: GamePhase;
  player: Player;
  pairs: LockerPair[];
  score: number;
  runTime: number;
  spawnCountdown: number;
  previousGapCenter: number;
  nextObstacleId: number;
  gameOverElapsed: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

