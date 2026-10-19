import type { RandomSource } from './game';
import type { GameConfig, GameState, LockerPair } from './types';

export function nextGap(
  previousCenter: number,
  rng: RandomSource,
  config: Readonly<GameConfig>,
): number {
  const { gapMinCenter, gapMaxCenter, maxGapShift } = config.obstacles;
  const minimum = Math.max(gapMinCenter, previousCenter - maxGapShift);
  const maximum = Math.min(gapMaxCenter, previousCenter + maxGapShift);
  const unit = Math.min(Math.max(rng(), 0), 1 - Number.EPSILON);
  return minimum + unit * (maximum - minimum);
}

export function spawnLockerPair(
  state: GameState,
  rng: RandomSource,
  config: Readonly<GameConfig>,
): LockerPair {
  const gapCenter =
    state.nextObstacleId === 1
      ? config.obstacles.firstGapCenter
      : nextGap(state.previousGapCenter, rng, config);
  const pair: LockerPair = {
    id: state.nextObstacleId,
    x: config.obstacles.spawnX,
    gapCenter,
    scored: false,
  };
  state.nextObstacleId += 1;
  state.previousGapCenter = gapCenter;
  state.pairs.push(pair);
  return pair;
}

export function updateObstacles(
  state: GameState,
  dt: number,
  rng: RandomSource,
  config: Readonly<GameConfig>,
): void {
  for (const pair of state.pairs) pair.x -= config.obstacles.speed * dt;

  state.spawnCountdown -= dt;
  while (state.spawnCountdown <= 1e-9) {
    spawnLockerPair(state, rng, config);
    state.spawnCountdown += config.obstacles.spawnInterval;
  }

  state.pairs = state.pairs.filter((pair) => pair.x + config.obstacles.width >= 0);
}

