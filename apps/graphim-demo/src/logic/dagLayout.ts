import {
  nodeInputs,
  scheduleGraph,
  type EffectGraph,
  type EffectNode,
  type GraphHandle,
} from 'graphim';

export type DagViewNode = {
  id: string;
  label: string;
  kind: EffectNode['kind'];
  x: number;
  y: number;
  inputCount: number;
  outputCount: number;
  output: boolean;
};

export type DagViewEdge = {
  from: string;
  to: string;
  /** Zero-based output port on the source node. */
  sourceIndex: number;
  sourceCount: number;
  /** Zero-based input port on the target node. */
  targetIndex: number;
  targetCount: number;
  /** Long edges bypass intermediate columns above/below the nodes. */
  route: 'direct' | 'above' | 'below';
  routeLane: number;
};

export type DagLayout = {
  nodes: DagViewNode[];
  edges: DagViewEdge[];
  width: number;
  height: number;
};

export const DAG_NODE_WIDTH = 128;
export const DAG_NODE_HEIGHT = 48;

/**
 * Lay out a DAG from inputs (left) to output (right).
 * Nodes sharing a depth are vertically centered in their column.
 */
export function layoutDag(graph: EffectGraph | GraphHandle): DagLayout {
  const normalized: EffectGraph = {
    nodes: graph.nodes,
    output: graph.output,
  };
  const order = scheduleGraph(normalized);
  const depthById = new Map<string, number>();
  const layers = new Map<number, string[]>();

  for (const id of order) {
    const node = graph.nodes[id]!;
    const inputs = nodeInputs(node);
    const depth =
      inputs.length === 0
        ? 0
        : Math.max(...inputs.map((input) => depthById.get(input) ?? 0)) + 1;
    depthById.set(id, depth);
    const layer = layers.get(depth) ?? [];
    layer.push(id);
    layers.set(depth, layer);
  }

  const maxDepth = Math.max(0, ...depthById.values());
  const maxRows = Math.max(1, ...[...layers.values()].map((layer) => layer.length));
  const columnGap = 64;
  const rowGap = 24;
  // Leave top/bottom lanes for edges that skip over intermediate columns.
  const padding = 48;
  const width =
    padding * 2 + (maxDepth + 1) * DAG_NODE_WIDTH + maxDepth * columnGap;
  const height =
    padding * 2 + maxRows * DAG_NODE_HEIGHT + (maxRows - 1) * rowGap;
  const rawEdges = order.flatMap((id) => {
    const inputs = nodeInputs(graph.nodes[id]!);
    return inputs.map((from, targetIndex) => ({
      from,
      to: id,
      targetIndex,
      targetCount: inputs.length,
    }));
  });
  const outgoing = new Map<string, typeof rawEdges>();
  for (const edge of rawEdges) {
    const edges = outgoing.get(edge.from) ?? [];
    edges.push(edge);
    outgoing.set(edge.from, edges);
  }

  let longEdgeIndex = 0;
  const edges: DagViewEdge[] = rawEdges.map((edge) => {
    const siblings = outgoing.get(edge.from) ?? [edge];
    const fromDepth = depthById.get(edge.from) ?? 0;
    const toDepth = depthById.get(edge.to) ?? 0;
    const skipsColumns = toDepth - fromDepth > 1;
    const routeIndex = skipsColumns ? longEdgeIndex++ : -1;
    return {
      ...edge,
      sourceIndex: siblings.indexOf(edge),
      sourceCount: siblings.length,
      route:
        routeIndex < 0 ? 'direct' : routeIndex % 2 === 0 ? 'above' : 'below',
      routeLane: routeIndex < 0 ? 0 : Math.floor(routeIndex / 2),
    };
  });
  const nodes: DagViewNode[] = [];

  for (const [depth, ids] of layers) {
    const layerHeight =
      ids.length * DAG_NODE_HEIGHT + Math.max(0, ids.length - 1) * rowGap;
    const offsetY = (height - layerHeight) / 2;
    ids.forEach((id, index) => {
      const node = graph.nodes[id]!;
      nodes.push({
        id,
        label: node.label ?? fallbackLabel(node),
        kind: node.kind,
        x: padding + depth * (DAG_NODE_WIDTH + columnGap),
        y: offsetY + index * (DAG_NODE_HEIGHT + rowGap),
        inputCount: nodeInputs(node).length,
        outputCount: outgoing.get(id)?.length ?? 0,
        output: id === graph.output,
      });
    });
  }

  return { nodes, edges, width, height };
}

/**
 * Y coordinate of a port within a node.
 * Multiple ports are spread evenly so branches never collapse into one line.
 */
export function dagPortY(index: number, count: number): number {
  if (count <= 1) return DAG_NODE_HEIGHT / 2;
  return ((index + 1) * DAG_NODE_HEIGHT) / (count + 1);
}

function fallbackLabel(node: EffectNode): string {
  switch (node.kind) {
    case 'source':
      return 'Source';
    case 'pass':
      return 'Pass';
    case 'blend':
      return 'Merge';
    case 'delay':
      return 'Delay';
    default: {
      const exhaustive: never = node;
      return exhaustive;
    }
  }
}
