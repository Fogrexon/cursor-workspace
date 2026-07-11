import { describe, expect, it, beforeEach } from 'vitest';
import { World } from '../ecs/World.ts';
import { defineUi } from '../ui/defineUi.ts';
import { mountUi } from '../ui/mountUi.ts';
import { Viewport } from '../core/resources.ts';
import { ScreenTransform } from '../components/ui/ScreenAnchor.ts';
import { runUiLayoutSystem } from './UiLayoutSystem.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

describe('UiLayoutSystem', () => {
  beforeEach(() => resetEntityIds());

  it('ScreenAnchor + row layout で子の ScreenTransform を配置する', () => {
    const world = new World();
    world.insertResource(Viewport, { width: 800, height: 600 });

    const def = defineUi('hud', {
      anchor: { edge: 'top-left', margin: { x: 16, y: 16 } },
      layout: { mode: 'row', gap: 10, padding: { top: 0, right: 0, bottom: 0, left: 5 } },
      panel: { width: 100, height: 30 },
      children: [
        { name: 'a', panel: { width: 50, height: 20 } },
        { name: 'b', panel: { width: 30, height: 20 } },
      ],
    });
    const handle = mountUi(world, def);
    runUiLayoutSystem(world);

    const rootT = world.get(handle.root, ScreenTransform)!;
    expect(rootT.x).toBe(16);
    expect(rootT.y).toBe(16);
    expect(rootT._layoutComputed).toBe(true);

    const aT = world.get(handle.get('a'), ScreenTransform)!;
    const bT = world.get(handle.get('b'), ScreenTransform)!;
    expect(aT.x).toBeCloseTo(21, 5);
    expect(aT.y).toBeCloseTo(16, 5);
    expect(bT.x).toBeCloseTo(81, 5);
    expect(bT.y).toBeCloseTo(16, 5);
  });

  it('column layout で子を縦に積む', () => {
    const world = new World();
    world.insertResource(Viewport, { width: 800, height: 600 });

    const def = defineUi('menu', {
      anchor: { edge: 'top-left', margin: { x: 0, y: 0 } },
      layout: { mode: 'column', gap: 10, align: 'start' },
      children: [
        { name: 'a', panel: { width: 40, height: 10 } },
        { name: 'b', panel: { width: 30, height: 15 } },
      ],
    });
    const handle = mountUi(world, def);
    runUiLayoutSystem(world);

    const aT = world.get(handle.get('a'), ScreenTransform)!;
    const bT = world.get(handle.get('b'), ScreenTransform)!;
    expect(aT.y).toBeCloseTo(0, 5);
    expect(bT.y).toBeCloseTo(20, 5);
    expect(bT.x).toBeCloseTo(0, 5);
  });
});
