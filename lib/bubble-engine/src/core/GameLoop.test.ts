import { describe, expect, it, vi } from 'vitest';
import { GameLoop } from './GameLoop.ts';

describe('GameLoop', () => {
  it('固定 dt で update が複数回呼ばれる', () => {
    const loop = new GameLoop({ fixedDt: 1 / 60, maxFrameTime: 0.1 });
    const fixed = vi.fn();
    const render = vi.fn();
    loop.onFixedUpdate(fixed);
    loop.onRender(render);

    loop.tick(0);
    loop.tick(1 / 60);
    expect(fixed).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(2);

    loop.tick(1 / 30);
    expect(fixed).toHaveBeenCalledTimes(2);
  });

  it('maxFrameTime でフレームが clamp される', () => {
    const loop = new GameLoop({ fixedDt: 1 / 60, maxFrameTime: 0.1 });
    const fixed = vi.fn();
    loop.onFixedUpdate(fixed);
    loop.tick(0);
    loop.tick(1.0);
    expect(fixed.mock.calls.length).toBeLessThanOrEqual(7);
  });
});
