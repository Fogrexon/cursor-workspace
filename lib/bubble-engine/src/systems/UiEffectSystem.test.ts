import { beforeEach, describe, expect, it } from 'vitest';
import { World } from '../ecs/World.ts';
import { resetEntityIds } from '../ecs/Entity.ts';
import { ScreenTransform } from '../components/ui/ScreenAnchor.ts';
import { UiEffects } from '../components/ui/UiEffects.ts';
import { runUiEffectSystem } from './UiEffectSystem.ts';

describe('UiEffectSystem', () => {
  beforeEach(() => resetEntityIds());

  it('pulse preset で alpha を sin 波で変化させる', () => {
    const world = new World();
    const entity = world
      .spawn()
      .with(ScreenTransform, { x: 0, y: 0, alpha: 1 })
      .with(UiEffects, { preset: 'pulse' })
      .build();

    runUiEffectSystem(world, 0);
    const a0 = world.get(entity, ScreenTransform)!.alpha!;

    runUiEffectSystem(world, Math.PI / 4);
    const a1 = world.get(entity, ScreenTransform)!.alpha!;

    expect(a0).toBeGreaterThan(0.8);
    expect(a1).not.toBe(a0);
  });

  it('preset none または UiEffects なしは alpha を変更しない', () => {
    const world = new World();
    const entity = world
      .spawn()
      .with(ScreenTransform, { x: 0, y: 0, alpha: 0.5 })
      .with(UiEffects, { preset: 'none' })
      .build();

    runUiEffectSystem(world, 1);
    expect(world.get(entity, ScreenTransform)!.alpha).toBe(0.5);
  });
});
