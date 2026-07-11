import { describe, expect, it } from 'vitest';
import { World } from '../ecs/World.ts';
import { defineResource } from '../ecs/Resource.ts';
import { defineUi } from './defineUi.ts';
import { mountUi } from './mountUi.ts';
import { bindUiRegistry, runUiBindingSystem } from './UiBindingSystem.ts';
import { UiText } from '../components/ui/UiText.ts';
import { resetEntityIds } from '../ecs/Entity.ts';

const GameState = defineResource<{ score: number }>('GameState');

describe('UiBindingSystem', () => {
  it('Resource 変更が bind 付き UiText に反映される', () => {
    resetEntityIds();
    const world = new World();
    world.insertResource(GameState, { score: 0 });
    bindUiRegistry(world, 'score', {
      resource: GameState,
      select: (s) => s.score,
      format: (n) => String(n),
    });

    const def = defineUi('hud', {
      children: [{ name: 'scoreLabel', text: { bind: 'score' } }],
    });
    mountUi(world, def);
    runUiBindingSystem(world);
    const [entity] = [...world.query(UiText)][0]!;
    expect(world.get(entity, UiText)!.text).toBe('0');

    world.resource(GameState).score = 42;
    runUiBindingSystem(world);
    expect(world.get(entity, UiText)!.text).toBe('42');
  });
});
