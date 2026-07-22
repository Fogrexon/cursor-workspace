import type { GraphHandle } from 'graphim';
import {
  DAG_NODE_HEIGHT,
  DAG_NODE_WIDTH,
  dagPortY,
  layoutDag,
  type DagViewNode,
} from '../logic/dagLayout';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Render the selected effect's actual Graphim DAG as an accessible SVG.
 */
export function renderDagGraph(
  container: HTMLElement,
  graph: GraphHandle,
): void {
  const layout = layoutDag(graph);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute(
    'aria-label',
    `Effect DAG with ${layout.nodes.length} nodes and ${layout.edges.length} edges`,
  );
  svg.classList.add('dag-svg');

  const defs = document.createElementNS(SVG_NS, 'defs');
  const marker = document.createElementNS(SVG_NS, 'marker');
  marker.setAttribute('id', 'dag-arrow');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('refX', '7');
  marker.setAttribute('refY', '4');
  marker.setAttribute('orient', 'auto');
  const arrow = document.createElementNS(SVG_NS, 'path');
  arrow.setAttribute('d', 'M 0 0 L 8 4 L 0 8 z');
  arrow.classList.add('dag-arrow');
  marker.append(arrow);
  defs.append(marker);
  svg.append(defs);

  const byId = new Map(layout.nodes.map((node) => [node.id, node]));
  for (const edge of layout.edges) {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) continue;
    const path = document.createElementNS(SVG_NS, 'path');
    const x1 = from.x + DAG_NODE_WIDTH;
    const y1 = from.y + dagPortY(edge.sourceIndex, edge.sourceCount);
    const x2 = to.x;
    const y2 = to.y + dagPortY(edge.targetIndex, edge.targetCount);
    path.setAttribute(
      'd',
      edgePath(
        x1,
        y1,
        x2,
        y2,
        edge.route,
        edge.routeLane,
        layout.height,
      ),
    );
    path.setAttribute('marker-end', 'url(#dag-arrow)');
    path.classList.add('dag-edge');
    svg.append(path);
  }

  for (const node of layout.nodes) {
    svg.append(createNode(node));
  }

  container.replaceChildren(svg);
}

function edgePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  route: 'direct' | 'above' | 'below',
  routeLane: number,
  height: number,
): string {
  if (route === 'direct') {
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  }

  const laneOffset = 14 + routeLane * 9;
  const routeY = route === 'above' ? laneOffset : height - laneOffset;
  const bend = Math.min(30, Math.max(18, (x2 - x1) / 5));
  return [
    `M ${x1} ${y1}`,
    `C ${x1 + bend * 0.4} ${y1}, ${x1 + bend * 0.6} ${routeY}, ${x1 + bend} ${routeY}`,
    `L ${x2 - bend} ${routeY}`,
    `C ${x2 - bend * 0.6} ${routeY}, ${x2 - bend * 0.4} ${y2}, ${x2} ${y2}`,
  ].join(' ');
}

function createNode(node: DagViewNode): SVGGElement {
  const group = document.createElementNS(SVG_NS, 'g');
  group.setAttribute('transform', `translate(${node.x} ${node.y})`);
  group.classList.add('dag-node', `dag-node--${node.kind}`);
  if (node.output) group.classList.add('dag-node--output');

  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.setAttribute('width', String(DAG_NODE_WIDTH));
  rect.setAttribute('height', String(DAG_NODE_HEIGHT));
  rect.setAttribute('rx', '6');

  const label = document.createElementNS(SVG_NS, 'text');
  label.setAttribute('x', String(DAG_NODE_WIDTH / 2));
  label.setAttribute('y', '21');
  label.setAttribute('text-anchor', 'middle');
  label.classList.add('dag-node__label');
  label.textContent = node.label;

  const kind = document.createElementNS(SVG_NS, 'text');
  kind.setAttribute('x', String(DAG_NODE_WIDTH / 2));
  kind.setAttribute('y', '37');
  kind.setAttribute('text-anchor', 'middle');
  kind.classList.add('dag-node__kind');
  kind.textContent = node.output ? `${node.kind} · output` : node.kind;

  group.append(rect, label, kind);
  appendPorts(group, 'input', node.inputCount);
  appendPorts(group, 'output', node.outputCount);
  return group;
}

function appendPorts(
  group: SVGGElement,
  side: 'input' | 'output',
  count: number,
): void {
  for (let index = 0; index < count; index += 1) {
    const port = document.createElementNS(SVG_NS, 'circle');
    port.setAttribute('cx', side === 'input' ? '0' : String(DAG_NODE_WIDTH));
    port.setAttribute('cy', String(dagPortY(index, count)));
    port.setAttribute('r', '3.5');
    port.classList.add('dag-port', `dag-port--${side}`);
    group.append(port);
  }
}
