import type { ComponentType } from './Component.ts';

export type ResourceType<T> = ComponentType<T>;

export function defineResource<T>(name: string): ResourceType<T> {
  return { name };
}
