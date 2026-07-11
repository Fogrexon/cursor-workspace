import type { UiNodeDef } from './UiDefinition.ts';

export type { UiNodeDef };

export interface UiDefinition {
  readonly id: string;
  readonly root: UiNodeDef;
}

export function defineUi(id: string, root: UiNodeDef): UiDefinition {
  return Object.freeze({ id, root: structuredClone(root) as UiNodeDef });
}
