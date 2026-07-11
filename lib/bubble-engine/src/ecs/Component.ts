export interface ComponentType<T> {
  readonly name: string;
  readonly _type?: T;
}

export function defineComponent<T>(name: string): ComponentType<T> {
  return { name };
}
