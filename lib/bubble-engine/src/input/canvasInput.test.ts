import { describe, expect, it } from 'vitest';
import { pointerEventToScreen } from './canvasInput.ts';

describe('pointerEventToScreen', () => {
  it('canvas 矩形を viewport サイズへ正規化', () => {
    const canvas = {
      getBoundingClientRect: () => ({ left: 100, top: 50, width: 200, height: 100 }),
    } as HTMLCanvasElement;

    const s = pointerEventToScreen(canvas, 200, 100, { width: 800, height: 600 });
    expect(s.x).toBe(400);
    expect(s.y).toBe(300);
  });
});
