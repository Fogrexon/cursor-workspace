import {
  add,
  bloom,
  blur,
  chromatic,
  contrast,
  delay,
  difference,
  edge,
  gray,
  mask,
  mirror,
  mix,
  multiply,
  named,
  neg,
  overlay,
  pass,
  pixel,
  posterize,
  screen,
  sepia,
  source,
  tripleMix,
  vignette,
  type GraphHandle,
  type SourceInput,
  type UniformMap,
} from 'graphim';
import {
  sourceAssetId,
  sourceAssetName,
  type EditorDocument,
  type EditorNode,
} from './model';
import { validateEditorDocument } from './validate';

export type CompileOptions = {
  sources?: Partial<Record<'main' | 'mask', SourceInput>>;
  resolveSource?: (node: EditorNode) => SourceInput | undefined;
};

/** Compile the editable graph into Graphim's immutable executable DAG. */
export function compileEditorDocument(
  document: EditorDocument,
  options: CompileOptions = {},
): GraphHandle {
  const issues = validateEditorDocument(document);
  if (issues.length > 0) {
    throw new Error(issues.map((issue) => issue.message).join('; '));
  }

  return compileEditorNode(document, document.outputId, options);
}

/**
 * Compile any node as a temporary output. This powers node-level previews
 * without requiring unrelated, unfinished nodes to be valid.
 */
export function compileEditorNode(
  document: EditorDocument,
  targetId: string,
  options: CompileOptions = {},
): GraphHandle {
  const nodes = new Map(document.nodes.map((node) => [node.id, node]));
  const cache = new Map<string, GraphHandle>();
  const visiting = new Set<string>();
  const compile = (id: string): GraphHandle => {
    const cached = cache.get(id);
    if (cached) return cached;
    const node = nodes.get(id);
    if (!node) throw new Error(`Unknown node: ${id}`);
    if (visiting.has(id)) throw new Error(`Cycle detected at ${id}`);
    visiting.add(id);
    const inputs = node.inputs.map((inputId, index) => {
      if (!inputId) {
        throw new Error(`Connect required input ${index + 1} on ${node.id}`);
      }
      return compile(inputId);
    });
    const handle = compileNode(node, inputs, options);
    visiting.delete(id);
    cache.set(id, handle);
    return handle;
  };

  return compile(targetId);
}

function compileNode(
  node: EditorNode,
  inputs: GraphHandle[],
  options: CompileOptions,
): GraphHandle {
  const number = (key: string): number => Number(node.params[key]);
  switch (node.kind) {
    case 'source': {
      if (options.resolveSource) {
        const resolved = options.resolveSource(node);
        if (!resolved) {
          throw new Error(`Image asset is unavailable: ${String(node.params.assetName ?? node.id)}`);
        }
        return named(source(resolved), sourceAssetName(node));
      }
      const mode = sourceAssetId(node) === 'builtin:mask' ? 'mask' : 'main';
      const input = options.sources?.[mode];
      if (!input) {
        throw new Error(`No ${mode} image is available`);
      }
      return named(source(input), mode === 'main' ? 'Main image' : 'Radial mask');
    }
    case 'gray': return gray(inputs[0]);
    case 'sepia': return sepia(inputs[0]);
    case 'negative': return neg(inputs[0]);
    case 'blur': return blur(inputs[0], number('strength'));
    case 'bloom':
      return bloom(inputs[0], {
        threshold: number('threshold'),
        strength: number('strength'),
        blur: number('blur'),
      });
    case 'pixel': return pixel(inputs[0], number('blockSize'));
    case 'vignette': return vignette(inputs[0], number('amount'));
    case 'contrast':
      return contrast(inputs[0], {
        contrast: number('contrast'),
        brightness: number('brightness'),
      });
    case 'posterize': return posterize(inputs[0], number('levels'));
    case 'mirror': return mirror(inputs[0]);
    case 'chromatic': return chromatic(inputs[0], number('amount'));
    case 'edge': return edge(inputs[0]);
    case 'custom':
      return named(
        pass(String(node.params.shader), inputs[0], parseUniforms(String(node.params.uniforms))),
        'Custom shader',
      );
    case 'mix': return mix(inputs[0], inputs[1], number('amount'));
    case 'multiply': return multiply(inputs[0], inputs[1]);
    case 'screen': return screen(inputs[0], inputs[1]);
    case 'overlay': return overlay(inputs[0], inputs[1]);
    case 'difference': return difference(inputs[0], inputs[1]);
    case 'add': return add(inputs[0], inputs[1], number('amount'));
    case 'mask': return mask(inputs[0], inputs[1], number('invertMask'));
    case 'tripleMix':
      return tripleMix(inputs[0], inputs[1], inputs[2], [
        number('weightA'),
        number('weightB'),
        number('weightC'),
      ]);
    case 'delay': return delay(inputs[0]);
    case 'output': return inputs[0];
  }
}

function parseUniforms(value: string): UniformMap {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('Custom shader uniforms must be valid JSON');
  }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error('Custom shader uniforms must be a JSON object');
  }
  for (const uniform of Object.values(parsed)) {
    if (
      typeof uniform !== 'number'
      && !(Array.isArray(uniform) && uniform.every((item) => typeof item === 'number'))
    ) {
      throw new Error('Uniform values must be numbers or number arrays');
    }
  }
  return parsed as UniformMap;
}
