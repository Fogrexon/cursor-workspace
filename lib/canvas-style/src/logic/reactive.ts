/**
 * Tiny reactive stores for Canvas UI.
 * Reads during `track()` are recorded; writes notify subscribers with changed keys.
 */

export type StoreId = symbol;

type ReadBucket = Map<StoreId, Set<string>>;

let tracking: ReadBucket | null = null;

export type ReactiveStore<T extends Record<string, unknown>> = T & {
  readonly __storeId: StoreId;
};

/**
 * Run `fn` while recording property reads on reactive stores.
 * Returns the result and a map of storeId → read keys.
 */
export function trackReads<T>(fn: () => T): { value: T; reads: ReadBucket } {
  const prev = tracking;
  const reads: ReadBucket = new Map();
  tracking = reads;
  try {
    const value = fn();
    return { value, reads };
  } finally {
    tracking = prev;
  }
}

/**
 * Create a reactive state bag. `onChange` receives the set of changed keys.
 */
export function createReactiveStore<T extends Record<string, unknown>>(
  initial: T,
  onChange: (changedKeys: Set<string>) => void,
): ReactiveStore<T> {
  const storeId = Symbol('canvas-style-store');
  const data = { ...initial } as Record<string, unknown>;

  const proxy = new Proxy(data, {
    get(_target, prop, receiver) {
      if (prop === '__storeId') {
        return storeId;
      }
      if (typeof prop === 'string' && tracking) {
        let keys = tracking.get(storeId);
        if (!keys) {
          keys = new Set();
          tracking.set(storeId, keys);
        }
        keys.add(prop);
      }
      return Reflect.get(data, prop, receiver);
    },
    set(_target, prop, value) {
      if (typeof prop !== 'string') {
        return false;
      }
      if (Object.is(data[prop], value)) {
        return true;
      }
      data[prop] = value;
      onChange(new Set([prop]));
      return true;
    },
  }) as ReactiveStore<T>;

  return proxy;
}

/** True when `reads` includes any of `changedKeys` for `storeId`. */
export function readsHit(
  reads: ReadBucket | undefined,
  storeId: StoreId,
  changedKeys: Set<string>,
): boolean {
  if (!reads) {
    return false;
  }
  const keys = reads.get(storeId);
  if (!keys) {
    return false;
  }
  for (const key of changedKeys) {
    if (keys.has(key)) {
      return true;
    }
  }
  return false;
}
