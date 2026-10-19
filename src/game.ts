import { getPlayerHitbox, touchesFloor, touchesLocker } from './collision';
import { flap, updatePlayer } from './physics';
import { updateObstacles } from './obstacles';
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
  updateObstacles(state, dt, rng, config);

  const playerHitbox = getPlayerHitbox(state.player, config);
  const hitFloor = touchesFloor(playerHitbox, config);
  const hitLocker = state.pairs.some((pair) => touchesLocker(playerHitbox, pair, config));
  if (hitFloor || hitLocker) {
    if (hitFloor) {
      const floorTop = config.world.height - config.world.floorHeight;
      state.player.y = floorTop - config.player.height + config.player.insetY;
    }
    state.phase = 'GAME_OVER';
    state.gameOverElapsed = 0;
    return;
  }

  for (const pair of state.pairs) {
    if (!pair.scored && pair.x + config.obstacles.width < playerHitbox.x) {
      pair.scored = true;
      state.score += 1;
    }
  }
}

