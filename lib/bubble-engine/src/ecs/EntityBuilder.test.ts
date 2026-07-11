import { describe, expect, it, beforeEach } from 'vitest';
import { defineComponent } from './Component.ts';
import { resetEntityIds } from './Entity.ts';
import { World } from './World.ts';

const Tag = defineComponent<{ label: string }>('Tag');
const Health = defineComponent<{ hp: number }>('Health');

describe('EntityBuilder', () => {
  beforeEach(() => {
    resetEntityIds();
  });

  it('fluent API で複数 Component を付与する', () => {
    const world = new World();
    const e = world
      .spawn()
      .with(Tag, { label: 'player' })
      .with(Health, { hp: 100 })
      .build();
    expect(world.get(e, Tag)?.label).toBe('player');
    expect(world.get(e, Health)?.hp).toBe(100);
  });
});
