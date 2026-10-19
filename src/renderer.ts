import type { GameConfig, GameState } from './types';

export function render(
  context: CanvasRenderingContext2D,
  state: Readonly<GameState>,
  presentationTime: number,
  config: Readonly<GameConfig>,
): void {
  drawHallway(context, config);
  for (const pair of state.pairs) drawLockerPair(context, pair.x, pair.gapCenter, config);
  drawFloor(context, config);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bob = state.phase === 'IDLE' && !reduceMotion ? Math.sin(presentationTime * 3) * 5 : 0;
  drawBird(context, state.player.x, state.player.y + bob, state.player.vy, config);
}

export function drawLockerPair(
  context: CanvasRenderingContext2D,
  x: number,
  gapCenter: number,
  config: Readonly<GameConfig>,
): void {
  const floorTop = config.world.height - config.world.floorHeight;
  const gapTop = gapCenter - config.obstacles.gapHeight / 2;
  const gapBottom = gapCenter + config.obstacles.gapHeight / 2;
  drawLocker(context, x, 0, config.obstacles.width, gapTop, false, config);
  drawLocker(
    context,
    x,
    gapBottom,
    config.obstacles.width,
    floorTop - gapBottom,
    true,
    config,
  );
}

export function drawLocker(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  opensUpward: boolean,
  config: Readonly<GameConfig>,
): void {
  if (height <= 0) return;
  context.fillStyle = '#34383D';
  context.fillRect(x, y, width, height);
  context.strokeStyle = config.palette.silver;
  context.lineWidth = 2;
  context.strokeRect(x + 1, y + 1, width - 2, height - 2);

  const edgeY = opensUpward ? y : y + height;
  context.fillStyle = config.palette.red;
  context.fillRect(x - 3, edgeY - (opensUpward ? 0 : 6), width + 6, 6);
}

export function drawHallway(context: CanvasRenderingContext2D, config: Readonly<GameConfig>): void {
  const floorTop = config.world.height - config.world.floorHeight;
  const gradient = context.createLinearGradient(0, 0, 0, floorTop);
  gradient.addColorStop(0, '#F1F2F3');
  gradient.addColorStop(1, '#C7CBD0');
  context.fillStyle = gradient;
  context.fillRect(0, 0, config.world.width, floorTop);

  context.strokeStyle = 'rgba(23, 23, 23, 0.08)';
  context.lineWidth = 2;
  for (let x = 40; x < config.world.width; x += 80) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(200 + (x - 200) * 1.7, floorTop);
    context.stroke();
  }
}

export function drawFloor(context: CanvasRenderingContext2D, config: Readonly<GameConfig>): void {
  const y = config.world.height - config.world.floorHeight;
  context.fillStyle = '#242629';
  context.fillRect(0, y, config.world.width, config.world.floorHeight);
  context.fillStyle = config.palette.red;
  context.fillRect(0, y, config.world.width, 6);
}

export function drawBird(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  velocity: number,
  config: Readonly<GameConfig>,
): void {
  const angle = Math.max(-0.35, Math.min(0.6, velocity / 900));
  context.save();
  context.translate(x + config.player.width / 2, y + config.player.height / 2);
  context.rotate(angle);
  context.fillStyle = config.palette.red;
  context.beginPath();
  context.ellipse(0, 0, 21, 15, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = config.palette.white;
  context.beginPath();
  context.arc(9, -5, 6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = config.palette.black;
  context.beginPath();
  context.arc(11, -5, 2.5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

