import {
  EDITOR_VERSION,
  MAX_PROJECT_DIMENSION,
  NODE_DEFINITIONS,
  type EditorDocument,
  type EditorNode,
} from './model';

export type EditorIssue = {
  nodeId?: string;
  message: string;
};

/** Validate references, arity and acyclicity before touching WebGL. */
export function validateEditorDocument(document: EditorDocument): EditorIssue[] {
  const issues: EditorIssue[] = [];
  if (document.version !== EDITOR_VERSION) {
    issues.push({ message: `Unsupported document version: ${document.version}` });
  }
  if (
    !Number.isInteger(document.width)
    || !Number.isInteger(document.height)
    || document.width < 1
    || document.height < 1
    || document.width > MAX_PROJECT_DIMENSION
    || document.height > MAX_PROJECT_DIMENSION
  ) {
    issues.push({
      message: `Project size must be 1–${MAX_PROJECT_DIMENSION} pixels per dimension`,
    });
  }

  const nodes = new Map<string, EditorNode>();
  for (const node of document.nodes) {
    if (nodes.has(node.id)) {
      issues.push({ nodeId: node.id, message: `Duplicate node id: ${node.id}` });
    }
    nodes.set(node.id, node);
    const definition = NODE_DEFINITIONS[node.kind];
    if (!definition) {
      issues.push({ nodeId: node.id, message: `Unknown node kind: ${String(node.kind)}` });
      continue;
    }
    if (node.inputs.length !== definition.inputLabels.length) {
      issues.push({
        nodeId: node.id,
        message: `${definition.title} expects ${definition.inputLabels.length} inputs`,
      });
    }
  }

  const output = nodes.get(document.outputId);
  if (!output || output.kind !== 'output') {
    issues.push({ message: 'The document outputId must reference an Output node' });
  }

  for (const node of document.nodes) {
    node.inputs.forEach((inputId, index) => {
      const label = NODE_DEFINITIONS[node.kind]?.inputLabels[index] ?? `input ${index + 1}`;
      if (!inputId) {
        issues.push({ nodeId: node.id, message: `Connect required input “${label}”` });
      } else if (!nodes.has(inputId)) {
        issues.push({ nodeId: node.id, message: `Missing input node: ${inputId}` });
      } else if (inputId === node.id) {
        issues.push({ nodeId: node.id, message: 'A node cannot connect to itself' });
      }
    });
  }

  const state = new Map<string, 'visiting' | 'done'>();
  const visit = (node: EditorNode): void => {
    if (state.get(node.id) === 'visiting') {
      issues.push({ nodeId: node.id, message: 'Cycle detected' });
      return;
    }
    if (state.get(node.id) === 'done') return;
    state.set(node.id, 'visiting');
    for (const inputId of node.inputs) {
      const input = inputId ? nodes.get(inputId) : undefined;
      if (input) visit(input);
    }
    state.set(node.id, 'done');
  };
  if (output) visit(output);

  return deduplicateIssues(issues);
}

function deduplicateIssues(issues: EditorIssue[]): EditorIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.nodeId ?? ''}:${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
