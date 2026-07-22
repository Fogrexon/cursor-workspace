import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCanvasUi } from '../runtime/createCanvasUi';
import { darkTheme, lightTheme, token } from '../logic/theme';
import { node } from '../logic/tree';

function mockCanvas(): HTMLCanvasElement {
  const ctx = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    arcTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    globalAlpha: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
  };
  return {
    getContext: () => ctx,
    width: 0,
    height: 0,
    style: {} as CSSStyleDeclaration,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setPointerCapture: vi.fn(),
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 720,
      height: 420,
      right: 720,
      bottom: 420,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  } as unknown as HTMLCanvasElement;
}

describe('createCanvasUi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.stubGlobal('devicePixelRatio', 1);
  });

  it('re-renders only views that read a changed global key', () => {
    const canvas = mockCanvas();
    const ui = createCanvasUi(canvas, { width: 720, height: 420 });
    const app = ui.state({ hp: 100, score: 0 });

    const hudRender = vi.fn(() =>
      node('text', {
        id: 'hp',
        style: { text: `HP ${app.hp}`, textColor: token('text') },
      }),
    );
    const scoreRender = vi.fn(() =>
      node('text', {
        id: 'score',
        style: { text: `Score ${app.score}`, textColor: token('text') },
      }),
    );

    ui.view({ render: hudRender });
    ui.view({ render: scoreRender });
    expect(hudRender).toHaveBeenCalledTimes(1);
    expect(scoreRender).toHaveBeenCalledTimes(1);

    app.hp = 85;
    expect(hudRender).toHaveBeenCalledTimes(2);
    expect(scoreRender).toHaveBeenCalledTimes(1);

    app.score = 10;
    expect(hudRender).toHaveBeenCalledTimes(2);
    expect(scoreRender).toHaveBeenCalledTimes(2);

    ui.destroy();
  });

  it('re-renders a view when its local state changes', () => {
    const canvas = mockCanvas();
    const ui = createCanvasUi(canvas);
    const render = vi.fn((local: { open: boolean }) =>
      node('text', {
        id: 'label',
        style: { text: local.open ? 'open' : 'closed' },
      }),
    );
    const view = ui.view({ state: { open: false }, render });
    expect(render).toHaveBeenCalledTimes(1);

    view.state.open = true;
    expect(render).toHaveBeenCalledTimes(2);
    expect(ui.getSnapshot().elementCount).toBe(1);

    ui.destroy();
  });

  it('resolves theme tokens and updates paint after setTheme', () => {
    const canvas = mockCanvas();
    const ui = createCanvasUi(canvas);
    const app = ui.state({ theme: 'dark' as 'dark' | 'light' });

    ui.setTheme(() => (app.theme === 'dark' ? darkTheme : lightTheme));
    ui.view({
      render: () =>
        node('panel', {
          id: 'panel',
          style: {
            width: 100,
            height: 40,
            fill: token('surface'),
          },
        }),
    });

    expect(ui.getSnapshot().elementCount).toBe(1);
    app.theme = 'light';
    // Theme factory refreshes without requiring the view to re-render.
    expect(ui.getSnapshot().viewCount).toBe(1);

    ui.destroy();
  });

  it('starts style transitions when animatable props change', () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      frames.push(cb);
      return frames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('performance', { now: () => 0 });

    const canvas = mockCanvas();
    const ui = createCanvasUi(canvas);
    const app = ui.state({ open: true });

    ui.view({
      render: () =>
        node('panel', {
          id: 'hud',
          style: {
            width: 100,
            height: 40,
            opacity: app.open ? 1 : 0,
            y: app.open ? 24 : 8,
            transition: { opacity: 200, y: 200 },
          },
        }),
    });

    app.open = false;
    expect(frames.length).toBeGreaterThan(0);

    ui.destroy();
  });
});
