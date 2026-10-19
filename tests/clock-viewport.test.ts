import { describe, expect, it } from 'vitest';
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

