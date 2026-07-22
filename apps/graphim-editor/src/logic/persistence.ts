import {
  DEFAULT_PROJECT_SIZE,
  EDITOR_VERSION,
  MAX_PROJECT_DIMENSION,
  NODE_DEFINITIONS,
  type EditorDocument,
  type EditorNode,
  type NodeKind,
} from './model';

export const STORAGE_KEY = 'graphim-editor:document:v1';

export function serializeEditorDocument(document: EditorDocument): string {
  return JSON.stringify(document, null, 2);
}

/** Parse untrusted JSON and retain only the editor's plain-data fields. */
export function parseEditorDocument(json: string): EditorDocument {
  const raw: unknown = JSON.parse(json);
  if (!isRecord(raw) || raw.version !== EDITOR_VERSION || !Array.isArray(raw.nodes)) {
    throw new Error('Not a Graphim Editor v1 document');
  }
  if (typeof raw.name !== 'string' || typeof raw.outputId !== 'string') {
    throw new Error('Document name or output is invalid');
  }

  const nodes = raw.nodes.map(parseNode);
  return {
    version: EDITOR_VERSION,
    name: raw.name,
    width: parseDimension(raw.width, DEFAULT_PROJECT_SIZE.width, 'width'),
    height: parseDimension(raw.height, DEFAULT_PROJECT_SIZE.height, 'height'),
    outputId: raw.outputId,
    nodes,
  };
}

function parseDimension(value: unknown, fallback: number, label: string): number {
  if (value === undefined) return fallback;
  if (
    typeof value !== 'number'
    || !Number.isInteger(value)
    || value < 1
    || value > MAX_PROJECT_DIMENSION
  ) {
    throw new Error(`Project ${label} must be an integer from 1 to ${MAX_PROJECT_DIMENSION}`);
  }
  return value;
}

function parseNode(value: unknown): EditorNode {
  if (!isRecord(value)) throw new Error('Invalid node');
  const kind = value.kind;
  if (typeof kind !== 'string' || !(kind in NODE_DEFINITIONS)) {
    throw new Error(`Unknown node kind: ${String(kind)}`);
  }
  if (
    typeof value.id !== 'string'
    || typeof value.x !== 'number'
    || typeof value.y !== 'number'
    || !Array.isArray(value.inputs)
    || !value.inputs.every((input) => input === null || typeof input === 'string')
    || !isRecord(value.params)
  ) {
    throw new Error(`Invalid ${kind} node`);
  }
  const params: Record<string, number | string> = {};
  for (const [key, param] of Object.entries(value.params)) {
    if (typeof param !== 'number' && typeof param !== 'string') {
      throw new Error(`Invalid parameter ${key}`);
    }
    params[key] = param;
  }
  return {
    id: value.id,
    kind: kind as NodeKind,
    x: value.x,
    y: value.y,
    inputs: value.inputs,
    params,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
