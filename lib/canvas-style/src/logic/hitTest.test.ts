import { describe, expect, it } from 'vitest';
import { compileDocument } from './compile';
import { hitTest } from './hitTest';
import { layoutScene } from './layout';

describe('hitTest', () => {
  it('returns the top-most box under a point', () => {
    const { scene } = compileDocument(`
      panel { display: column; padding: 0; }
      button { height: 40; }
      #hud { type: panel; x: 10; y: 10; width: 120; height: 80; }
      #go { type: button; parent: #hud; width: 120; height: 40; content: "Go"; }
    `);
    const boxes = layoutScene(scene, 400, 300);
    const hit = hitTest(boxes, 20, 20);
    expect(hit?.id).toBe('go');
  });

  it('returns undefined when outside all boxes', () => {
    const { scene } = compileDocument(`
      #hud { type: panel; x: 10; y: 10; width: 50; height: 50; }
    `);
    const boxes = layoutScene(scene, 400, 300);
    expect(hitTest(boxes, 0, 0)).toBeUndefined();
  });
});
