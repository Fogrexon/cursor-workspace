import { describe, expect, it } from 'vitest';
import { measureUiNode } from './measure.ts';
import { UiPanel } from '../../components/ui/UiPanel.ts';
import { UiText } from '../../components/ui/UiText.ts';
import { UiButton } from '../../components/ui/UiButton.ts';
import { World } from '../../ecs/World.ts';
import { resetEntityIds } from '../../ecs/Entity.ts';

describe('measure', () => {
  it('UiPanel / UiButton は width × height を返す', () => {
    resetEntityIds();
    const world = new World();
    const panel = world.spawn().with(UiPanel, { width: 120, height: 40 }).build();
    expect(measureUiNode(world, panel)).toEqual({ width: 120, height: 40 });

    const button = world.spawn().with(UiButton, { width: 80, height: 32, label: 'OK' }).build();
    expect(measureUiNode(world, button)).toEqual({ width: 80, height: 32 });
  });

  it('UiText は fontSize と text 長から概算サイズを返す', () => {
    resetEntityIds();
    const world = new World();
    const text = world.spawn().with(UiText, { text: 'Score', fontSize: 20 }).build();
    const size = measureUiNode(world, text);
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThanOrEqual(20);
  });
});
