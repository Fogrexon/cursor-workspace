import {
  DEFAULT_PROJECT_SIZE,
  EDITOR_VERSION,
  createEditorNode,
  type EditorDocument,
  type EditorNode,
  type NodeKind,
} from './model';

type PresetNode = {
  key: string;
  kind: NodeKind;
  x: number;
  y: number;
  inputs?: string[];
  params?: Record<string, number | string>;
};

export type EditorPreset = {
  id: string;
  label: string;
  description: string;
  create: () => EditorDocument;
};

export const EDITOR_PRESETS: EditorPreset[] = [
  {
    id: 'prismatic-flow',
    label: 'Prismatic flow',
    description: 'time uniform で連続変化するカスタムシェーダーです。',
    create: () => makeDocument('Prismatic flow', [
      { key: 'source', kind: 'source', x: 100, y: 235 },
      { key: 'flow', kind: 'custom', x: 410, y: 235, inputs: ['source'] },
      { key: 'output', kind: 'output', x: 730, y: 235, inputs: ['flow'] },
    ]),
  },
  {
    id: 'bloom-split',
    label: 'Bloom split',
    description: '1つの画像を2枝へ分岐し、BloomとVignetteをMixします。',
    create: () => makeDocument('Bloom split', [
      { key: 'source', kind: 'source', x: 60, y: 235 },
      { key: 'bloom', kind: 'bloom', x: 330, y: 120, inputs: ['source'] },
      { key: 'vignette', kind: 'vignette', x: 330, y: 350, inputs: ['source'] },
      { key: 'mix', kind: 'mix', x: 620, y: 235, inputs: ['bloom', 'vignette'] },
      { key: 'output', kind: 'output', x: 900, y: 235, inputs: ['mix'] },
    ]),
  },
  {
    id: 'masked-color',
    label: 'Masked color',
    description: '加工画像とラジアルマスクを合成します。',
    create: () => makeDocument('Masked color', [
      { key: 'source', kind: 'source', x: 50, y: 140 },
      {
        key: 'maskSource',
        kind: 'source',
        x: 330,
        y: 390,
        params: { assetId: 'builtin:mask', assetName: 'Radial mask' },
      },
      { key: 'chromatic', kind: 'chromatic', x: 330, y: 110, inputs: ['source'] },
      { key: 'mask', kind: 'mask', x: 630, y: 225, inputs: ['chromatic', 'maskSource'] },
      { key: 'output', kind: 'output', x: 910, y: 225, inputs: ['mask'] },
    ]),
  },
  {
    id: 'three-look',
    label: 'Three-look mix',
    description: '3つの色調を明示的に合流させる複合DAGです。',
    create: () => makeDocument('Three-look mix', [
      { key: 'source', kind: 'source', x: 40, y: 260 },
      { key: 'sepia', kind: 'sepia', x: 300, y: 70, inputs: ['source'] },
      { key: 'gray', kind: 'gray', x: 300, y: 260, inputs: ['source'] },
      { key: 'negative', kind: 'negative', x: 300, y: 450, inputs: ['source'] },
      {
        key: 'mix',
        kind: 'tripleMix',
        x: 610,
        y: 260,
        inputs: ['sepia', 'gray', 'negative'],
      },
      { key: 'output', kind: 'output', x: 900, y: 260, inputs: ['mix'] },
    ]),
  },
];

function makeDocument(name: string, specs: PresetNode[]): EditorDocument {
  const keyToId = new Map<string, string>();
  const nodes: EditorNode[] = specs.map((spec) => {
    const node = createEditorNode(spec.kind, spec.x, spec.y);
    keyToId.set(spec.key, node.id);
    return { ...node, params: { ...node.params, ...spec.params } };
  });
  specs.forEach((spec, index) => {
    nodes[index].inputs = (spec.inputs ?? []).map((key) => {
      const id = keyToId.get(key);
      if (!id) throw new Error(`Preset references unknown node: ${key}`);
      return id;
    });
  });
  const output = specs.findIndex((spec) => spec.kind === 'output');
  return {
    version: EDITOR_VERSION,
    name,
    width: DEFAULT_PROJECT_SIZE.width,
    height: DEFAULT_PROJECT_SIZE.height,
    nodes,
    outputId: nodes[output].id,
  };
}
