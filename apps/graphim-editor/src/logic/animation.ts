import type { EffectGraph, GraphHandle } from 'graphim';

/**
 * Continuous rendering is required by temporal feedback and shaders that read
 * Graphim's built-in `time` uniform. Inspecting the executable DAG keeps this
 * correct for custom and future built-in nodes alike.
 */
export function graphNeedsAnimation(graph: EffectGraph | GraphHandle): boolean {
  return Object.values(graph.nodes).some((node) => {
    if (node.kind === 'delay') return true;
    if (node.kind !== 'pass' && node.kind !== 'blend') return false;
    return /\btime\b/.test(stripShaderComments(node.shader));
  });
}

function stripShaderComments(shader: string): string {
  return shader
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}
