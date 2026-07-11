import { describe, expect, it, vi } from 'vitest';
import { BubbleEngine } from './BubbleEngine.ts';
import { SystemPhase, defineSystem } from './types.ts';
import { RecordingGameRenderer } from '../render/RecordingGameRenderer.ts';

describe('BubbleEngine', () => {
  it('tick で登録 System が実行される', () => {
    const renderer = new RecordingGameRenderer();
    const engine = BubbleEngine.create({
      viewport: { width: 800, height: 600 },
      gameRenderer: renderer,
      gravity: { x: 0, y: -10 },
    });

    const spy = vi.fn();
    engine.registerSystem(
      defineSystem({ name: 'custom', phase: SystemPhase.PostFixed, run: spy }),
    );

    engine.tick(0);
    engine.tick(1 / 60);
    expect(spy).toHaveBeenCalled();
  });

  it('scenes.load で SceneManager が利用できる', () => {
    const engine = BubbleEngine.create({
      viewport: { width: 800, height: 600 },
      gameRenderer: new RecordingGameRenderer(),
    });
    expect(engine.scenes).toBeDefined();
    expect(engine.world).toBeDefined();
  });
});
