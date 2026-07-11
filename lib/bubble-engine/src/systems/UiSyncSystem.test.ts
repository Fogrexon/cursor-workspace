import { describe, expect, it, beforeEach } from 'vitest';
import { World } from '../ecs/World.ts';
import { ScreenTransform } from '../components/ui/ScreenAnchor.ts';
import { UiText } from '../components/ui/UiText.ts';
import { Viewport, UiRenderer } from '../core/resources.ts';
import { RecordingUiRenderer } from '../render/RecordingUiRenderer.ts';
import { runUiSyncSystem } from './UiSyncSystem.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

describe('UiSyncSystem', () => {
  beforeEach(() => resetEntityIds());

  it('ScreenTransform + UiText を RecordingUiRenderer に同期する', () => {
    const world = new World();
    const ui = new RecordingUiRenderer();
    world.insertResource(Viewport, { width: 800, height: 600 });
    world.insertResource(UiRenderer, ui);

    const e = world
      .spawn()
      .with(ScreenTransform, { x: 20, y: 30, visible: true })
      .with(UiText, { text: 'Hello', fontSize: 18 })
      .build();

    runUiSyncSystem(world);
    expect(ui.getText(e)).toBe('Hello');
    // テキストはレイアウト枠の中心座標で同期される
    const pos = ui.getPosition(e)!;
    expect(pos.x).toBeGreaterThan(20);
    expect(pos.y).toBeGreaterThan(30);
  });
});
