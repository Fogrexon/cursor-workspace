export type Entity = number & { readonly __brand: 'Entity' };

let nextEntityId = 1;

export function createEntityId(): Entity {
  return nextEntityId++ as Entity;
}

/** テスト用リセット */
export function resetEntityIds(start = 0): void {
  nextEntityId = start + 1;
}
