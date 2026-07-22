/**
 * Serializable editor model. It deliberately contains no DOM/WebGL objects so
 * projects can be saved as JSON and validated in tests.
 */

export const EDITOR_VERSION = 1;
export const DEFAULT_PROJECT_SIZE = { width: 960, height: 640 } as const;
export const MAX_PROJECT_DIMENSION = 8192;

export type NodeKind =
  | 'source'
  | 'gray'
  | 'sepia'
  | 'negative'
  | 'blur'
  | 'bloom'
  | 'pixel'
  | 'vignette'
  | 'contrast'
  | 'posterize'
  | 'mirror'
  | 'chromatic'
  | 'edge'
  | 'custom'
  | 'mix'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'difference'
  | 'add'
  | 'mask'
  | 'tripleMix'
  | 'delay'
  | 'output';

export type NodeParameterValue = number | string;

export type EditorNode = {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  inputs: Array<string | null>;
  params: Record<string, NodeParameterValue>;
};

export type EditorDocument = {
  version: typeof EDITOR_VERSION;
  name: string;
  width: number;
  height: number;
  nodes: EditorNode[];
  outputId: string;
};

export type ParameterDefinition = {
  key: string;
  label: string;
  type: 'number' | 'textarea' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
};

export type NodeDefinition = {
  kind: NodeKind;
  title: string;
  category: 'Input' | 'Effect' | 'Compose' | 'Timing' | 'Output';
  inputLabels: string[];
  defaults: Record<string, NodeParameterValue>;
  parameters: ParameterDefinition[];
};

const numberParam = (
  key: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step: number,
): Pick<NodeDefinition, 'defaults' | 'parameters'> => ({
  defaults: { [key]: value },
  parameters: [{ key, label, type: 'number', min, max, step }],
});

export const NODE_DEFINITIONS: Record<NodeKind, NodeDefinition> = {
  source: {
    kind: 'source',
    title: 'Image source',
    category: 'Input',
    inputLabels: [],
    defaults: { assetId: 'builtin:main', assetName: 'Sample image' },
    // Source image assignment has a dedicated asset picker in the inspector.
    parameters: [],
  },
  gray: simple('gray', 'Gray'),
  sepia: simple('sepia', 'Sepia'),
  negative: simple('negative', 'Negative'),
  blur: effectWithNumber('blur', 'Blur', 'strength', 'Strength', 6, 0, 24, 0.5),
  bloom: {
    kind: 'bloom',
    title: 'Bloom',
    category: 'Effect',
    inputLabels: ['image'],
    defaults: { threshold: 0.45, strength: 2.2, blur: 1.2 },
    parameters: [
      { key: 'threshold', label: 'Threshold', type: 'number', min: 0, max: 1, step: 0.01 },
      { key: 'strength', label: 'Strength', type: 'number', min: 0, max: 6, step: 0.1 },
      { key: 'blur', label: 'Radius', type: 'number', min: 0, max: 8, step: 0.1 },
    ],
  },
  pixel: effectWithNumber('pixel', 'Pixel', 'blockSize', 'Block size', 8, 2, 64, 1),
  vignette: effectWithNumber('vignette', 'Vignette', 'amount', 'Amount', 1, 0, 3, 0.05),
  contrast: {
    kind: 'contrast',
    title: 'Contrast',
    category: 'Effect',
    inputLabels: ['image'],
    defaults: { contrast: 1.3, brightness: 0 },
    parameters: [
      { key: 'contrast', label: 'Contrast', type: 'number', min: 0, max: 3, step: 0.05 },
      { key: 'brightness', label: 'Brightness', type: 'number', min: -1, max: 1, step: 0.02 },
    ],
  },
  posterize: effectWithNumber('posterize', 'Posterize', 'levels', 'Levels', 6, 2, 32, 1),
  mirror: simple('mirror', 'Mirror'),
  chromatic: effectWithNumber('chromatic', 'Chromatic', 'amount', 'Pixels', 4, 0, 32, 0.5),
  edge: simple('edge', 'Edge'),
  custom: {
    kind: 'custom',
    title: 'Custom shader',
    category: 'Effect',
    inputLabels: ['image'],
    defaults: {
      shader: `uniform float strength;
void main() {
  vec2 p = vUv - vec2(0.5);
  float falloff = 1.0 - smoothstep(0.12, 0.72, length(p));
  float flowX = sin(p.y * 18.0 + time * 1.1)
    + 0.5 * sin(p.y * 31.0 - time * 0.7);
  float flowY = cos(p.x * 16.0 - time * 0.9)
    + 0.5 * cos(p.x * 27.0 + time * 0.6);
  vec2 flow = vec2(flowX, flowY) * 0.0045 * strength * falloff;
  vec2 prism = normalize(flow + vec2(0.0001)) * 0.0025 * strength;
  float r = texture(uMain, vUv + flow + prism).r;
  float g = texture(uMain, vUv + flow).g;
  float b = texture(uMain, vUv + flow - prism).b;
  fragColor = vec4(r, g, b, 1.0);
}`,
      uniforms: '{"strength": 2.0}',
    },
    parameters: [
      { key: 'shader', label: 'Fragment shader', type: 'textarea' },
      { key: 'uniforms', label: 'Uniforms JSON', type: 'textarea' },
    ],
  },
  mix: compose('mix', 'Mix', ['a', 'b'], { amount: 0.5 }, [
    { key: 'amount', label: 'Amount', type: 'number', min: 0, max: 1, step: 0.01 },
  ]),
  multiply: compose('multiply', 'Multiply', ['a', 'b']),
  screen: compose('screen', 'Screen', ['a', 'b']),
  overlay: compose('overlay', 'Overlay', ['a', 'b']),
  difference: compose('difference', 'Difference', ['a', 'b']),
  add: compose('add', 'Add', ['a', 'b'], { amount: 0.5 }, [
    { key: 'amount', label: 'Amount', type: 'number', min: 0, max: 2, step: 0.05 },
  ]),
  mask: compose('mask', 'Mask', ['image', 'mask'], { invertMask: 0 }, [
    {
      key: 'invertMask',
      label: 'Invert',
      type: 'select',
      options: [
        { value: '0', label: 'No' },
        { value: '1', label: 'Yes' },
      ],
    },
  ]),
  tripleMix: compose('tripleMix', 'Triple mix', ['a', 'b', 'c'], {
    weightA: 0.4,
    weightB: 0.35,
    weightC: 0.25,
  }, [
    { key: 'weightA', label: 'Weight A', type: 'number', min: 0, max: 1, step: 0.05 },
    { key: 'weightB', label: 'Weight B', type: 'number', min: 0, max: 1, step: 0.05 },
    { key: 'weightC', label: 'Weight C', type: 'number', min: 0, max: 1, step: 0.05 },
  ]),
  delay: {
    kind: 'delay',
    title: 'Delay',
    category: 'Timing',
    inputLabels: ['image'],
    defaults: {},
    parameters: [],
  },
  output: {
    kind: 'output',
    title: 'Output',
    category: 'Output',
    inputLabels: ['image'],
    defaults: {},
    parameters: [],
  },
};

function simple(kind: NodeKind, title: string): NodeDefinition {
  return {
    kind,
    title,
    category: 'Effect',
    inputLabels: ['image'],
    defaults: {},
    parameters: [],
  };
}

function effectWithNumber(
  kind: NodeKind,
  title: string,
  key: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step: number,
): NodeDefinition {
  const parameter = numberParam(key, label, value, min, max, step);
  return {
    kind,
    title,
    category: 'Effect',
    inputLabels: ['image'],
    ...parameter,
  };
}

function compose(
  kind: NodeKind,
  title: string,
  inputLabels: string[],
  defaults: Record<string, NodeParameterValue> = {},
  parameters: ParameterDefinition[] = [],
): NodeDefinition {
  return {
    kind,
    title,
    category: 'Compose',
    inputLabels,
    defaults,
    parameters,
  };
}

let nextNodeId = 0;

/** Create a serializable editor node with definition defaults. */
export function createEditorNode(kind: NodeKind, x: number, y: number): EditorNode {
  nextNodeId += 1;
  const definition = NODE_DEFINITIONS[kind];
  return {
    id: `${kind}-${nextNodeId}`,
    kind,
    x,
    y,
    inputs: definition.inputLabels.map(() => null),
    params: { ...definition.defaults },
  };
}

/** Resolve legacy `mode` documents and current per-node asset references. */
export function sourceAssetId(node: EditorNode): string {
  if (node.kind !== 'source') throw new Error('sourceAssetId expects a source node');
  if (typeof node.params.assetId === 'string') return node.params.assetId;
  return node.params.mode === 'mask' ? 'builtin:mask' : 'builtin:main';
}

export function sourceAssetName(node: EditorNode): string {
  if (node.kind !== 'source') throw new Error('sourceAssetName expects a source node');
  const assetId = sourceAssetId(node);
  if (assetId === 'builtin:main') return 'Sample image';
  if (assetId === 'builtin:mask') return 'Radial mask';
  if (typeof node.params.assetName === 'string') return node.params.assetName;
  return 'Image source';
}
