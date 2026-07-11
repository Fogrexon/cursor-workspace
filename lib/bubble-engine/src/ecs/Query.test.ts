import { describe, expect, it, beforeEach } from 'vitest';
import { defineComponent } from './Component.ts';
import { resetEntityIds } from './Entity.ts';
import { World } from './World.ts';

const A = defineComponent<{ a: number }>('A');
const B = defineComponent<{ b: number }>('B');
const C = defineComponent<{ c: number }>('C');

describe('Query', () => {
  beforeEach(() => {
    resetEntityIds();
  });

  it('1 コンポーネント Query', () => {
    const world = new World();
    world.spawn().with(A, { a: 1 }).build();
    world.spawn().with(B, { b: 2 }).build();
    const results = [...world.query(A)];
    expect(results).toHaveLength(1);
    expect(results[0]![1].a).toBe(1);
  });

  it('2 コンポーネント Query', () => {
    const world = new World();
    world.spawn().with(A, { a: 1 }).with(B, { b: 2 }).build();
    world.spawn().with(A, { a: 3 }).build();
    const results = [...world.query2(A, B)];
    expect(results).toHaveLength(1);
    expect(results[0]![1].a).toBe(1);
    expect(results[0]![2].b).toBe(2);
  });

  it('3 コンポーネント Query', () => {
    const world = new World();
    world.spawn().with(A, { a: 1 }).with(B, { b: 2 }).with(C, { c: 3 }).build();
    world.spawn().with(A, { a: 9 }).with(B, { b: 8 }).build();
    const results = [...world.query3(A, B, C)];
    expect(results).toHaveLength(1);
    expect(results[0]![3].c).toBe(3);
  });
});
