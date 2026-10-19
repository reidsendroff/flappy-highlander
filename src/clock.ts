export interface FixedClock {
  advance(elapsedSeconds: number, tick: (dt: number) => void): number;
  reset(): void;
  getAccumulator(): number;
}

export function createFixedClock(fixedStep: number, maxFrameElapsed: number): FixedClock {
  let accumulator = 0;
  const maxSteps = Math.ceil(maxFrameElapsed / fixedStep);

  return {
    advance(elapsedSeconds, tick) {
      accumulator += Math.min(Math.max(0, elapsedSeconds), maxFrameElapsed);
      let steps = 0;
      while (accumulator + Number.EPSILON >= fixedStep && steps < maxSteps) {
        tick(fixedStep);
        accumulator -= fixedStep;
        steps += 1;
      }
      return steps;
    },
    reset() {
      accumulator = 0;
    },
    getAccumulator() {
      return accumulator;
    },
  };
}

