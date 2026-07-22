import { describe, expect, it } from 'vitest';
import { delay, pass, source, toGraph } from 'graphim';
import { graphNeedsAnimation } from './animation';
import { compileEditorDocument, compileEditorNode } from './compile';
import {
  DEFAULT_PROJECT_SIZE,
  MAX_PROJECT_DIMENSION,
  createEditorNode,
  sourceAssetId,
} from './model';
import { parseEditorDocument, serializeEditorDocument } from './persistence';
import { EDITOR_PRESETS } from './presets';
import { validateEditorDocument } from './validate';

describe('Graphim editor model', () => {
  it('validates and compiles a branching preset', () => {
    const document = preset('bloom-split');
    expect(validateEditorDocument(document)).toEqual([]);

    const graph = toGraph(compileEditorDocument(document, {
      sources: { main: 'main' },
    }));
    const blend = Object.values(graph.nodes).find((node) => node.kind === 'blend');

    expect(blend?.kind).toBe('blend');
    if (blend?.kind === 'blend') expect(blend.inputs).toHaveLength(2);
  });

  it('reports disconnected inputs and cycles', () => {
    const document = preset('bloom-split');
    const output = document.nodes.find((node) => node.kind === 'output')!;
    const mix = document.nodes.find((node) => node.kind === 'mix')!;
    output.inputs[0] = mix.id;
    mix.inputs[0] = output.id;
    mix.inputs[1] = null;

    const messages = validateEditorDocument(document).map((issue) => issue.message);
    expect(messages).toContain('Cycle detected');
    expect(messages.some((message) => message.includes('Connect required input'))).toBe(true);
  });

  it('round-trips a project as JSON', () => {
    const document = preset('three-look');
    document.width = 1920;
    document.height = 1080;
    const restored = parseEditorDocument(serializeEditorDocument(document));
    expect(restored).toEqual(document);
  });

  it('migrates legacy documents and rejects unsafe dimensions', () => {
    const raw = JSON.parse(serializeEditorDocument(preset('bloom-split')));
    delete raw.width;
    delete raw.height;
    const migrated = parseEditorDocument(JSON.stringify(raw));
    expect([migrated.width, migrated.height]).toEqual([
      DEFAULT_PROJECT_SIZE.width,
      DEFAULT_PROJECT_SIZE.height,
    ]);

    raw.width = MAX_PROJECT_DIMENSION + 1;
    expect(() => parseEditorDocument(JSON.stringify(raw))).toThrow('Project width');
  });

  it('rejects executable values hidden in JSON parameters', () => {
    const document = preset('bloom-split');
    const raw = JSON.parse(serializeEditorDocument(document));
    raw.nodes[0].params.bad = { executable: true };
    expect(() => parseEditorDocument(JSON.stringify(raw))).toThrow('Invalid parameter');
  });

  it('compiles a selected node without validating unrelated unfinished nodes', () => {
    const document = preset('bloom-split');
    const bloom = document.nodes.find((node) => node.kind === 'bloom')!;
    document.nodes.push(createEditorNode('blur', 0, 0));

    const graph = toGraph(compileEditorNode(document, bloom.id, {
      sources: { main: 'main' },
    }));
    expect(graph.nodes[graph.output]?.kind).toBe('pass');
  });

  it('keeps final and selected-node outputs as separate compile targets', () => {
    const document = preset('bloom-split');
    const sourceNode = document.nodes.find((node) => node.kind === 'source')!;
    const finalGraph = toGraph(compileEditorDocument(document, {
      sources: { main: 'main' },
    }));
    const nodeGraph = toGraph(compileEditorNode(document, sourceNode.id, {
      sources: { main: 'main' },
    }));

    expect(finalGraph.nodes[finalGraph.output]?.kind).toBe('blend');
    expect(nodeGraph.nodes[nodeGraph.output]?.kind).toBe('source');
  });

  it('resolves multiple image source nodes independently', () => {
    const document = preset('masked-color');
    const resolved: string[] = [];
    const graph = toGraph(compileEditorDocument(document, {
      resolveSource(node) {
        resolved.push(sourceAssetId(node));
        return 'main';
      },
    }));

    expect(resolved.sort()).toEqual(['builtin:main', 'builtin:mask']);
    expect(Object.values(graph.nodes).filter((node) => node.kind === 'source')).toHaveLength(2);
  });

  it('does not share source parameters between nodes', () => {
    const document = preset('masked-color');
    const sources = document.nodes.filter((node) => node.kind === 'source');
    sources[0].params.assetId = 'asset:first';
    sources[0].params.assetName = 'first.png';

    expect(sourceAssetId(sources[0])).toBe('asset:first');
    expect(sourceAssetId(sources[1])).toBe('builtin:mask');
    expect(sources[1].params.assetName).toBe('Radial mask');
  });
});

describe('animation detection', () => {
  it('detects time uniforms and delay nodes in the executable graph', () => {
    const input = source();
    expect(graphNeedsAnimation(pass('void main() { fragColor = texture(uMain, vUv); }', input)))
      .toBe(false);
    expect(graphNeedsAnimation(pass(
      'void main() { fragColor = texture(uMain, vUv + vec2(sin(time) * 0.01)); }',
      input,
    ))).toBe(true);
    expect(graphNeedsAnimation(delay(input))).toBe(true);
  });

  it('ignores time mentioned only in shader comments', () => {
    const graph = pass('// time is intentionally unused\nvoid main() { fragColor = vec4(1.0); }', source());
    expect(graphNeedsAnimation(graph)).toBe(false);
  });
});

function preset(id: string) {
  const value = EDITOR_PRESETS.find((item) => item.id === id);
  if (!value) throw new Error(`Missing preset: ${id}`);
  return value.create();
}
