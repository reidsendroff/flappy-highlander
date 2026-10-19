import { describe, expect, it } from 'vitest';
import { createFixedClock } from '../src/clock';
import { calculateViewportFit } from '../src/viewport';

describe('viewport fitting', () => {
  it('fits a portrait world inside a laptop viewport', () => {
    const fit = calculateViewportFit(1366, 768, 400, 600);
    expect(fit.width).toBeCloseTo(512);
    expect(fit.height).toBe(768);
    expect(fit.left).toBeCloseTo(427);
    expect(fit.top).toBe(0);
  });

  it('fills a portrait phone without changing aspect ratio', () => {
    const fit = calculateViewportFit(390, 844, 400, 600);
    expect(fit.width).toBe(390);
    expect(fit.height).toBeCloseTo(585);
    expect(fit.top).toBeCloseTo(129.5);
    expect(fit.width / fit.height).toBeCloseTo(2 / 3);
  });

  it('fits within a landscape phone', () => {
    const fit = calculateViewportFit(844, 390, 400, 600);
    expect(fit.height).toBe(390);
    expect(fit.width).toBe(260);
    expect(fit.left).toBe(292);
  });
});

describe('fixed simulation clock', () => {
  it('produces 60 ticks from one second at both 60 and 120 Hz', () => {
    for (const frameRate of [60, 120]) {
      const clock = createFixedClock(1 / 60, 0.05);
      let ticks = 0;
      for (let frame = 0; frame < frameRate; frame += 1) {
        clock.advance(1 / frameRate, () => {
          ticks += 1;
        });
      }
      expect(ticks).toBe(60);
    }
  });

  it('limits a long stall to three simulation steps', () => {
    const clock = createFixedClock(1 / 60, 0.05);
    let ticks = 0;
    clock.advance(2, () => {
      ticks += 1;
    });
    expect(ticks).toBe(3);
  });

  it('clears accumulated time when reset', () => {
    const clock = createFixedClock(1 / 60, 0.05);
    clock.advance(1 / 120, () => undefined);
    clock.reset();
    expect(clock.getAccumulator()).toBe(0);
  });
});


