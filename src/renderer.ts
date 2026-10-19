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
  drawLocker(context, x, gapBottom, config.obstacles.width, floorTop - gapBottom, true, config);
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
  const gradient = context.createLinearGradient(x, y, x + width, y);
  gradient.addColorStop(0, '#25282C');
  gradient.addColorStop(0.5, '#3D4247');
  gradient.addColorStop(1, '#202327');
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);

  context.strokeStyle = '#747A80';
  context.lineWidth = 1;
  const doorHeight = 76;
  const firstDoorY = Math.floor(y / doorHeight) * doorHeight;
  for (let doorY = firstDoorY; doorY < y + height; doorY += doorHeight) {
    const visibleTop = Math.max(y, doorY);
    const visibleBottom = Math.min(y + height, doorY + doorHeight);
    if (visibleBottom <= visibleTop + 3) continue;
    context.strokeRect(x + 2, visibleTop + 1, width - 4, visibleBottom - visibleTop - 2);
    const detailY = opensUpward ? visibleBottom - 18 : visibleTop + 13;
    if (detailY > y + 8 && detailY < y + height - 8) {
      for (let vent = 0; vent < 3; vent += 1) {
        context.beginPath();
        context.moveTo(x + 10, detailY + vent * 4);
        context.lineTo(x + 27, detailY + vent * 4);
        context.stroke();
      }
      context.fillStyle = config.palette.silver;
      context.beginPath();
      context.arc(x + width - 13, detailY + 4, 3.5, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = '#191B1E';
      context.fillRect(x + width - 15, detailY + 3, 4, 2);
    }
  }

  context.strokeStyle = config.palette.silver;
  context.lineWidth = 2;
  context.strokeRect(x + 1, y + 1, width - 2, height - 2);
  const edgeY = opensUpward ? y : y + height;
  context.fillStyle = config.palette.red;
  context.fillRect(x - 3, edgeY - (opensUpward ? 0 : 6), width + 6, 6);
  context.fillStyle = config.palette.white;
  context.fillRect(x + 9, edgeY - (opensUpward ? -6 : 9), width - 18, 3);
}

export function drawHallway(context: CanvasRenderingContext2D, config: Readonly<GameConfig>): void {
  const floorTop = config.world.height - config.world.floorHeight;
  const gradient = context.createLinearGradient(0, 0, 0, floorTop);
  gradient.addColorStop(0, '#F4F4F2');
  gradient.addColorStop(0.58, '#D8DBDE');
  gradient.addColorStop(1, '#B9BEC3');
  context.fillStyle = gradient;
  context.fillRect(0, 0, config.world.width, floorTop);
  context.fillStyle = 'rgba(255,255,255,0.78)';
  context.fillRect(68, 24, 104, 14);
  context.fillRect(228, 24, 104, 14);
  context.strokeStyle = 'rgba(23, 23, 23, 0.1)';
  context.lineWidth = 1.5;
  for (let x = 30; x < config.world.width; x += 68) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(200 + (x - 200) * 1.6, floorTop);
    context.stroke();
  }
  context.fillStyle = '#AEB3B8';
  context.fillRect(0, floorTop - 18, config.world.width, 18);
  context.fillStyle = '#8A9096';
  context.fillRect(0, floorTop - 18, config.world.width, 3);
}

export function drawFloor(context: CanvasRenderingContext2D, config: Readonly<GameConfig>): void {
  const y = config.world.height - config.world.floorHeight;
  context.fillStyle = '#242629';
  context.fillRect(0, y, config.world.width, config.world.floorHeight);
  context.fillStyle = config.palette.red;
  context.fillRect(0, y, config.world.width, 6);
  context.strokeStyle = '#45494E';
  context.lineWidth = 1;
  for (let x = 0; x <= config.world.width; x += 40) {
    context.beginPath();
    context.moveTo(x, y + 6);
    context.lineTo(x + 12, config.world.height);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(0, y + 28);
  context.lineTo(config.world.width, y + 28);
  context.stroke();
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

  context.fillStyle = config.palette.black;
  context.beginPath();
  context.moveTo(-13, 2);
  context.lineTo(-22, -5);
  context.lineTo(-18, 4);
  context.lineTo(-22, 10);
  context.lineTo(-11, 7);
  context.closePath();
  context.fill();
  context.fillStyle = config.palette.red;
  context.fillRect(-18, -11, 13, 5);
  context.fillStyle = config.palette.white;
  context.fillRect(-14, -11, 3, 5);
  context.fillStyle = config.palette.black;
  context.fillRect(-9, -11, 3, 5);

  context.fillStyle = config.palette.red;
  context.beginPath();
  context.ellipse(-1, 2, 16, 12, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = config.palette.white;
  context.beginPath();
  context.ellipse(1, 6, 9, 5.5, 0.12, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = config.palette.black;
  context.beginPath();
  const wingLift = velocity < 0 ? -7 : 4;
  context.moveTo(-7, 2);
  context.quadraticCurveTo(-4, wingLift, 8, 3);
  context.quadraticCurveTo(-1, 12, -7, 2);
  context.fill();

  context.fillStyle = config.palette.red;
  context.beginPath();
  context.ellipse(10, -3, 10, 10, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.moveTo(3, -10);
  context.quadraticCurveTo(4, -17, 10, -12);
  context.quadraticCurveTo(9, -16, 15, -11);
  context.fill();
  context.fillStyle = config.palette.white;
  context.beginPath();
  context.arc(12, -6, 5.5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = config.palette.black;
  context.beginPath();
  context.arc(14, -6, 2.3, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = config.palette.silver;
  context.beginPath();
  context.moveTo(18, -2);
  context.lineTo(22, 1);
  context.lineTo(18, 4);
  context.closePath();
  context.fill();
  context.strokeStyle = config.palette.black;
  context.lineWidth = 1.25;
  context.beginPath();
  context.moveTo(9, -11);
  context.quadraticCurveTo(14, -13, 18, -10);
  context.stroke();
  context.restore();
}
