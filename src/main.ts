import './styles.css';
import { createFixedClock } from './clock';
import { CONFIG } from './config';
import { createGame, stepGame } from './game';
import { createInputController } from './input';
import { createSeededRandom } from './random';
import { render } from './renderer';
import type { GameState } from './types';
import { createGameUi } from './ui';
import { resizeGameSurface } from './viewport';

const shellElement = document.querySelector<HTMLElement>('#game-shell');
const canvasElement = document.querySelector<HTMLCanvasElement>('#game-canvas');
const startPanelElement = document.querySelector<HTMLElement>('#start-panel');
const gameOverPanelElement = document.querySelector<HTMLElement>('#game-over-panel');
const scoreElement = document.querySelector<HTMLElement>('#score');
const finalScoreElement = document.querySelector<HTMLElement>('#final-score');
const startButtonElement = document.querySelector<HTMLButtonElement>('#start-button');
const restartButtonElement = document.querySelector<HTMLButtonElement>('#restart-button');
const announcerElement = document.querySelector<HTMLElement>('#game-announcer');

if (
  !shellElement ||
  !canvasElement ||
  !startPanelElement ||
  !gameOverPanelElement ||
  !scoreElement ||
  !finalScoreElement ||
  !startButtonElement ||
  !restartButtonElement ||
  !announcerElement
) {
  throw new Error('Required game elements are missing.');
}

const shell = shellElement;
const canvas = canvasElement;

let context: CanvasRenderingContext2D;
const state = createGame(CONFIG);
const testMode = import.meta.env.DEV && new URLSearchParams(window.location.search).get('test') === '1';
const seed = testMode ? 42 : crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now();
const random = createSeededRandom(seed);
const clock = createFixedClock(CONFIG.timing.fixedStep, CONFIG.timing.maxFrameElapsed);
const input = createInputController(shell, [startButtonElement, restartButtonElement]);
const ui = createGameUi({
  startPanel: startPanelElement,
  gameOverPanel: gameOverPanelElement,
  score: scoreElement,
  finalScore: finalScoreElement,
  restartButton: restartButtonElement,
  announcer: announcerElement,
  canvas,
});
let previousTimestamp: number | null = null;
let presentationTime = 0;

function update(dt: number): void {
  stepGame(state, input.consume(), dt, random, CONFIG);
  presentationTime += dt;
  ui.update(state);
}

function resize(): void {
  context = resizeGameSurface(
    shell,
    canvas,
    CONFIG.world.width,
    CONFIG.world.height,
    CONFIG.timing.maxDevicePixelRatio,
  );
  render(context, state, presentationTime, CONFIG);
}

function frame(timestamp: number): void {
  if (previousTimestamp === null) previousTimestamp = timestamp;
  const elapsed = (timestamp - previousTimestamp) / 1000;
  previousTimestamp = timestamp;

  if (!testMode) clock.advance(elapsed, update);
  render(context, state, presentationTime, CONFIG);
  requestAnimationFrame(frame);
}

function suspend(): void {
  clock.reset();
  input.clear();
  previousTimestamp = null;
}

window.addEventListener('blur', suspend);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) suspend();
});

const observer = new ResizeObserver(resize);
observer.observe(document.querySelector('#app') ?? document.body);
resize();
ui.update(state);
requestAnimationFrame(frame);

if (testMode) {
  void import('./testBridge').then(({ installTestBridge }) => {
    installTestBridge({
      advanceTicks(count) {
        for (let index = 0; index < Math.max(0, Math.floor(count)); index += 1) {
          update(CONFIG.timing.fixedStep);
        }
        render(context, state, presentationTime, CONFIG);
      },
      getState(): GameState {
        return structuredClone(state);
      },
    });
  });
}

