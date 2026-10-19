export interface ViewportFit {
  width: number;
  height: number;
  left: number;
  top: number;
  scale: number;
}

export function calculateViewportFit(
  availableWidth: number,
  availableHeight: number,
  worldWidth: number,
  worldHeight: number,
): ViewportFit {
  const scale = Math.min(availableWidth / worldWidth, availableHeight / worldHeight);
  const width = worldWidth * scale;
  const height = worldHeight * scale;

  return {
    width,
    height,
    left: (availableWidth - width) / 2,
    top: (availableHeight - height) / 2,
    scale,
  };
}

export function resizeGameSurface(
  shell: HTMLElement,
  canvas: HTMLCanvasElement,
  worldWidth: number,
  worldHeight: number,
  maxDpr: number,
): CanvasRenderingContext2D {
  const parent = shell.parentElement;
  if (!parent) throw new Error('Game shell must have a parent container.');

  const fit = calculateViewportFit(parent.clientWidth, parent.clientHeight, worldWidth, worldHeight);
  shell.style.width = `${fit.width}px`;
  shell.style.height = `${fit.height}px`;

  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  canvas.width = Math.max(1, Math.round(fit.width * dpr));
  canvas.height = Math.max(1, Math.round(fit.height * dpr));

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is not supported by this browser.');
  context.setTransform((fit.width / worldWidth) * dpr, 0, 0, (fit.height / worldHeight) * dpr, 0, 0);
  return context;
}

