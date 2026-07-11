import type { ComponentType } from './Component.ts';
import { EntityBuilder } from './EntityBuilder.ts';
import type { Entity } from './Entity.ts';
import { EventBus } from './events.ts';
import { query1, query2, query3 } from './Query.ts';
import type { ResourceType } from './Resource.ts';
import { PhysicsWorld } from '../core/resources.ts';

export class World {
  readonly events = new EventBus();
  private readonly entities = new Set<Entity>();
  private readonly components = new Map<Entity, Map<string, unknown>>();
  private readonly resources = new Map<string, unknown>();

  registerEntity(entity: Entity): void {
    this.entities.add(entity);
  }

  spawn(): EntityBuilder {
    return new EntityBuilder(this);
  }

  despawn(entity: Entity): void {
    // ECS Entity 削除時に Planck Body も必ず破棄（リトライ時のゴースト干渉防止）
    if (this.hasResource(PhysicsWorld)) {
      this.resource(PhysicsWorld).destroyBody(entity);
    }
    this.entities.delete(entity);
    this.components.delete(entity);
  }

  add<T>(entity: Entity, type: ComponentType<T>, data: T): void {
    if (!this.entities.has(entity)) {
      throw new Error(`Entity ${entity} is not alive`);
    }
    let map = this.components.get(entity);
    if (!map) {
      map = new Map();
      this.components.set(entity, map);
    }
    map.set(type.name, data);
  }

  get<T>(entity: Entity, type: ComponentType<T>): T | undefined {
    return this.components.get(entity)?.get(type.name) as T | undefined;
  }

  remove<T>(entity: Entity, type: ComponentType<T>): void {
    this.components.get(entity)?.delete(type.name);
  }

  has<T>(entity: Entity, type: ComponentType<T>): boolean {
    return this.components.get(entity)?.has(type.name) ?? false;
  }

  query<A>(a: ComponentType<A>): Iterable<[Entity, A]> {
    return query1(this.entities, this.components, a);
  }

  query2<A, B>(a: ComponentType<A>, b: ComponentType<B>): Iterable<[Entity, A, B]> {
    return query2(this.entities, this.components, a, b);
  }

  query3<A, B, C>(
    a: ComponentType<A>,
    b: ComponentType<B>,
    c: ComponentType<C>,
  ): Iterable<[Entity, A, B, C]> {
    return query3(this.entities, this.components, a, b, c);
  }

  insertResource<T>(type: ResourceType<T>, value: T): void {
    this.resources.set(type.name, value);
  }

  removeResource<T>(type: ResourceType<T>): void {
    this.resources.delete(type.name);
  }

  hasResource<T>(type: ResourceType<T>): boolean {
    return this.resources.has(type.name);
  }

  resource<T>(type: ResourceType<T>): T {
    const value = this.resources.get(type.name);
    if (value === undefined) {
      throw new Error(`Resource not found: ${type.name}`);
    }
    return value as T;
  }

  tryResource<T>(type: ResourceType<T>): T | undefined {
    return this.resources.get(type.name) as T | undefined;
  }
}
