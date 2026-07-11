import type { ComponentType } from './Component.ts';
import { createEntityId, type Entity } from './Entity.ts';
import type { World } from './World.ts';

export class EntityBuilder {
  private readonly entity: Entity;
  private readonly pending: Array<{ type: ComponentType<unknown>; data: unknown }> = [];

  constructor(private readonly world: World) {
    this.entity = createEntityId();
    this.world.registerEntity(this.entity);
  }

  with<T>(type: ComponentType<T>, data: T): this {
    this.pending.push({ type: type as ComponentType<unknown>, data });
    return this;
  }

  build(): Entity {
    for (const { type, data } of this.pending) {
      this.world.add(this.entity, type, data);
    }
    return this.entity;
  }
}
