import type { GameConfig, LockerPair, Player, Rect } from './types';

export function getPlayerHitbox(player: Readonly<Player>, config: Readonly<GameConfig>): Rect {
  return {
    x: player.x + config.player.insetX,
    y: player.y + config.player.insetY,
    width: config.player.width - config.player.insetX * 2,
    height: config.player.height - config.player.insetY * 2,
  };
}

export function getLockerRects(
  pair: Readonly<LockerPair>,
  config: Readonly<GameConfig>,
): readonly [Rect, Rect] {
  const gapTop = pair.gapCenter - config.obstacles.gapHeight / 2;
  const gapBottom = pair.gapCenter + config.obstacles.gapHeight / 2;
  const floorTop = config.world.height - config.world.floorHeight;
  return [
    { x: pair.x, y: 0, width: config.obstacles.width, height: gapTop },
    {
      x: pair.x,
      y: gapBottom,
      width: config.obstacles.width,
      height: floorTop - gapBottom,
    },
  ];
}

export function touches(a: Readonly<Rect>, b: Readonly<Rect>): boolean {
  return (
    a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y
  );
}

export function touchesFloor(playerHitbox: Readonly<Rect>, config: Readonly<GameConfig>): boolean {
  return playerHitbox.y + playerHitbox.height >= config.world.height - config.world.floorHeight;
}

export function touchesLocker(
  playerHitbox: Readonly<Rect>,
  pair: Readonly<LockerPair>,
  config: Readonly<GameConfig>,
): boolean {
  return getLockerRects(pair, config).some((rect) => touches(playerHitbox, rect));
}

