import './styles.css';
import { CONFIG } from './config';
import { resizeGameSurface } from './viewport';

const shellElement = document.querySelector<HTMLElement>('#game-shell');
const canvasElement = document.querySelector<HTMLCanvasElement>('#game-canvas');

if (!shellElement || !canvasElement) throw new Error('Required game elements are missing.');

const shell = shellElement;
const canvas = canvasElement;

let context: CanvasRenderingContext2D;

function drawPlaceholder(): void {
  const { width, height, floorHeight } = CONFIG.world;
  context.clearRect(0, 0, width, height);
  const wall = context.createLinearGradient(0, 0, 0, height);
  wall.addColorStop(0, '#E9ECEF');
  wall.addColorStop(1, '#C9CDD2');
  context.fillStyle = wall;
  context.fillRect(0, 0, width, height - floorHeight);
  context.fillStyle = CONFIG.palette.black;
  context.fillRect(0, height - floorHeight, width, floorHeight);
  context.fillStyle = CONFIG.palette.red;
  context.beginPath();
  context.arc(112, 278, 18, 0, Math.PI * 2);
  context.fill();
}

function resize(): void {
  context = resizeGameSurface(
    shell,
    canvas,
    CONFIG.world.width,
    CONFIG.world.height,
    CONFIG.timing.maxDevicePixelRatio,
  );
  drawPlaceholder();
}

const observer = new ResizeObserver(resize);
observer.observe(document.querySelector('#app') ?? document.body);
resize();

