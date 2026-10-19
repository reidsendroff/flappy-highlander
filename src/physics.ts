import type { GameConfig, Player } from './types';

export function flap(player: Player, config: Readonly<GameConfig>): void {
  player.vy = config.physics.flapVelocity;
}

export function updatePlayer(player: Player, dt: number, config: Readonly<GameConfig>): void {
  player.vy = Math.min(player.vy + config.physics.gravity * dt, config.physics.maxFallVelocity);
  player.y += player.vy * dt;

  if (player.y < 0) {
    player.y = 0;
    if (player.vy < 0) player.vy = 0;
  }
}

