import type { ComponentType } from './Component.ts';
import type { Entity } from './Entity.ts';

export function* query1<T>(
  entities: Iterable<Entity>,
  store: Map<Entity, Map<string, unknown>>,
  a: ComponentType<T>,
): Iterable<[Entity, T]> {
  for (const entity of entities) {
    const data = store.get(entity)?.get(a.name) as T | undefined;
    if (data !== undefined) yield [entity, data];
  }
}

export function* query2<A, B>(
  entities: Iterable<Entity>,
  store: Map<Entity, Map<string, unknown>>,
  a: ComponentType<A>,
  b: ComponentType<B>,
): Iterable<[Entity, A, B]> {
  for (const entity of entities) {
    const map = store.get(entity);
    if (!map) continue;
    const va = map.get(a.name) as A | undefined;
    const vb = map.get(b.name) as B | undefined;
    if (va !== undefined && vb !== undefined) yield [entity, va, vb];
  }
}

export function* query3<A, B, C>(
  entities: Iterable<Entity>,
  store: Map<Entity, Map<string, unknown>>,
  a: ComponentType<A>,
  b: ComponentType<B>,
  c: ComponentType<C>,
): Iterable<[Entity, A, B, C]> {
  for (const entity of entities) {
    const map = store.get(entity);
    if (!map) continue;
    const va = map.get(a.name) as A | undefined;
    const vb = map.get(b.name) as B | undefined;
    const vc = map.get(c.name) as C | undefined;
    if (va !== undefined && vb !== undefined && vc !== undefined) {
      yield [entity, va, vb, vc];
    }
  }
}
