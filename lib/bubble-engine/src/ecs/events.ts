export interface EventType<T> {
  readonly name: string;
  readonly _type?: T;
}

export function defineEvent<T>(name: string): EventType<T> {
  return { name };
}

type Handler<T> = (payload: T) => void;

export class EventBus {
  private readonly handlers = new Map<string, Set<Handler<unknown>>>();

  on<T>(type: EventType<T>, handler: Handler<T>): () => void {
    let set = this.handlers.get(type.name);
    if (!set) {
      set = new Set();
      this.handlers.set(type.name, set);
    }
    set.add(handler as Handler<unknown>);
    return () => set!.delete(handler as Handler<unknown>);
  }

  emit<T>(type: EventType<T>, payload: T): void {
    const set = this.handlers.get(type.name);
    if (!set) return;
    for (const handler of set) {
      handler(payload);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
