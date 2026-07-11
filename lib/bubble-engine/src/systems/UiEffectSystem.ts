import type { World } from '../ecs/World.ts';
import { defineResource } from '../ecs/Resource.ts';
import { ScreenTransform } from '../components/ui/ScreenAnchor.ts';
import { UiEffects } from '../components/ui/UiEffects.ts';

export interface EffectClockData {
  elapsed: number;
}

export const EffectClock = defineResource<EffectClockData>('EffectClock');

/** PreUi: UiEffects preset を ScreenTransform へ反映 */
export function runUiEffectSystem(world: World, dt: number): void {
  if (!world.hasResource(EffectClock)) {
    world.insertResource(EffectClock, { elapsed: 0 });
  }
  const clock = world.resource(EffectClock);
  clock.elapsed += dt;

  for (const [entity, transform, effects] of world.query2(ScreenTransform, UiEffects)) {
    if (effects.preset === 'pulse') {
      const pulse = 0.85 + 0.15 * Math.sin(clock.elapsed * 6);
      world.add(entity, ScreenTransform, { ...transform, alpha: pulse });
    }
  }
}
