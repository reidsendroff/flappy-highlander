import type { GamePhase, GameState } from './types';

interface UiElements {
  startPanel: HTMLElement;
  gameOverPanel: HTMLElement;
  score: HTMLElement;
  finalScore: HTMLElement;
  restartButton: HTMLButtonElement;
  announcer: HTMLElement;
  canvas: HTMLCanvasElement;
}

export interface GameUi {
  update(state: Readonly<GameState>): void;
}

export function createGameUi(elements: UiElements): GameUi {
  let previousPhase: GamePhase | null = null;
  let restartFocused = false;

  return {
    update(state) {
      elements.startPanel.hidden = state.phase !== 'IDLE';
      elements.gameOverPanel.hidden = state.phase !== 'GAME_OVER';
      elements.score.hidden = state.phase !== 'PLAYING';
      elements.score.textContent = String(state.score);
      elements.finalScore.textContent = String(state.score);

      if (state.phase !== previousPhase) {
        restartFocused = false;
        if (state.phase === 'IDLE') {
          elements.announcer.textContent = 'Flappy Highlander ready. Press Space or tap to fly.';
        } else if (state.phase === 'PLAYING') {
          elements.canvas.focus({ preventScroll: true });
        } else {
          elements.announcer.textContent = `Game over. Final score: ${state.score}.`;
        }
        previousPhase = state.phase;
      }

      if (state.phase === 'GAME_OVER' && state.gameOverElapsed >= 0.35 && !restartFocused) {
        elements.restartButton.focus({ preventScroll: true });
        restartFocused = true;
      }
    },
  };
}

