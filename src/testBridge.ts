import type { GameState } from './types';

export interface TestBridgeHooks {
  advanceTicks(count: number): void;
  getState(): GameState;
}

declare global {
  interface Window {
    __fh?: TestBridgeHooks;
  }
}

export function installTestBridge(hooks: TestBridgeHooks): void {
  window.__fh = hooks;
}

