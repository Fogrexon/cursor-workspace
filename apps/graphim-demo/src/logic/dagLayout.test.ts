import { describe, expect, it } from 'vitest';
import { bloom, gray, mix, sepia, source, tripleMix } from 'graphim';
import { dagPortY, layoutDag } from './dagLayout';

describe('layoutDag', () => {
  it('lays a linear graph left to right', () => {
    const layout = layoutDag(gray(source()));
    expect(layout.nodes).toHaveLength(2);
    const sourceNode = layout.nodes.find((node) => node.kind === 'source')!;
    const outputNode = layout.nodes.find((node) => node.output)!;
    expect(sourceNode.x).toBeLessThan(outputNode.x);
    expect(layout.edges).toHaveLength(1);
  });

  it('shows both branches of a two-input graph', () => {
    const input = source();
    const layout = layoutDag(mix(gray(input), sepia(input)));
    expect(layout.nodes.filter((node) => node.kind === 'source')).toHaveLength(1);
    expect(layout.nodes.filter((node) => node.kind === 'pass')).toHaveLength(2);
    expect(layout.nodes.filter((node) => node.kind === 'blend')).toHaveLength(1);
    expect(layout.edges).toHaveLength(4);
  });

  it('assigns separate ports to direct and processed bloom inputs', () => {
    const input = source();
    const layout = layoutDag(mix(input, bloom(input), 0.55));
    const sourceNode = layout.nodes.find((node) => node.kind === 'source')!;
    const mixNode = layout.nodes.find((node) => node.kind === 'blend')!;
    const incoming = layout.edges.filter((edge) => edge.to === mixNode.id);
    const outgoing = layout.edges.filter((edge) => edge.from === sourceNode.id);

    expect(incoming.map((edge) => edge.targetIndex)).toEqual([0, 1]);
    expect(incoming.every((edge) => edge.targetCount === 2)).toBe(true);
    expect(outgoing.map((edge) => edge.sourceIndex)).toEqual([0, 1]);
    expect(outgoing.every((edge) => edge.sourceCount === 2)).toBe(true);
    expect(dagPortY(0, 2)).not.toBe(dagPortY(1, 2));

    const directSourceToMix = layout.edges.find(
      (edge) => edge.from === sourceNode.id && edge.to === mixNode.id,
    )!;
    const sourceToBloom = layout.edges.find(
      (edge) => edge.from === sourceNode.id && edge.to !== mixNode.id,
    )!;
    expect(directSourceToMix.route).toBe('above');
    expect(sourceToBloom.route).toBe('direct');
  });

  it('shows all branches of a three-input graph', () => {
    const input = source();
    const layout = layoutDag(
      tripleMix(gray(input), sepia(input), input, [0.4, 0.4, 0.2]),
    );
    const mergeNode = layout.nodes.find((node) => node.kind === 'blend')!;
    const incoming = layout.edges.filter((edge) => edge.to === mergeNode.id);
    expect(incoming).toHaveLength(3);
    expect(incoming.map((edge) => edge.targetIndex)).toEqual([0, 1, 2]);
  });
});
