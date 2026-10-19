import { flap, updatePlayer } from './physics';
import type { GameConfig, GameState } from './types';

export type RandomSource = () => number;

export function createGame(config: Readonly<GameConfig>): GameState {
  return {
    phase: 'IDLE',
    player: {
      x: config.player.startX,
      y: config.player.startY,
      vy: 0,
    },
    pairs: [],
    score: 0,
    runTime: 0,
    spawnCountdown: config.obstacles.firstSpawnDelay,
    previousGapCenter: config.obstacles.firstGapCenter,
    nextObstacleId: 1,
    gameOverElapsed: 0,
  };
}

export function resetGame(state: GameState, config: Readonly<GameConfig>): void {
  Object.assign(state, createGame(config));
}

export function stepGame(
  state: GameState,
  action: boolean,
  dt: number,
  rng: RandomSource,
  config: Readonly<GameConfig>,
): void {
  void rng;

  if (state.phase === 'GAME_OVER') {
    state.gameOverElapsed += dt;
    if (action && state.gameOverElapsed >= config.timing.restartLockout) resetGame(state, config);
    return;
  }

  if (state.phase === 'IDLE') {
    if (!action) return;
    state.phase = 'PLAYING';
    flap(state.player, config);
  } else if (action) {
    flap(state.player, config);
  }

  state.runTime += dt;
  updatePlayer(state.player, dt, config);

  const floorTop = config.world.height - config.world.floorHeight;
  const hitboxBottom = state.player.y + config.player.height - config.player.insetY;
  if (hitboxBottom >= floorTop) {
    state.player.y = floorTop - config.player.height + config.player.insetY;
    state.phase = 'GAME_OVER';
    state.gameOverElapsed = 0;
  }
}

