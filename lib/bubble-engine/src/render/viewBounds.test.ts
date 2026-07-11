import { describe, expect, it } from 'vitest';
import { isOutsideView } from './viewBounds.ts';

describe('isOutsideView', () => {
  const camera = { position: { x: 4, y: 1.2 }, zoom: 30 };
  const view = { width: 800, height: 600 };

  it('画面内の点は false', () => {
    expect(isOutsideView({ x: 4, y: 1.2 }, camera, view)).toBe(false);
  });

  it('画面外の点は true', () => {
    expect(isOutsideView({ x: -20, y: 1.2 }, camera, view)).toBe(true);
  });
});
