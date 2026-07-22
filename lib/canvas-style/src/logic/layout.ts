import type {
  ElementNode,
  LayoutBox,
  PseudoState,
  ResolvedStyle,
  Scene,
} from '../types';
import { resolveNodeStyle } from './compile';

export type InteractionState = {
  hoverId?: string;
  activeId?: string;
};

function stateFor(nodeId: string, interaction: InteractionState): Set<PseudoState> {
  const state = new Set<PseudoState>();
  if (interaction.hoverId === nodeId) {
    state.add('hover');
  }
  if (interaction.activeId === nodeId) {
    state.add('active');
  }
  return state;
}

function measureTextWidth(text: string, fontSize: number, fontWeight: number): number {
  // Approximate canvas text width without DOM dependency.
  const avg = fontWeight >= 600 ? fontSize * 0.62 : fontSize * 0.55;
  return Math.ceil(text.length * avg);
}

function intrinsicSize(style: ResolvedStyle): { width: number; height: number } {
  const textW = style.content ? measureTextWidth(style.content, style.fontSize, style.fontWeight) : 0;
  const textH = style.content ? Math.ceil(style.fontSize * 1.35) : 0;
  const padX = style.paddingLeft + style.paddingRight;
  const padY = style.paddingTop + style.paddingBottom;
  return {
    width: Math.max(style.minWidth, textW + padX),
    height: Math.max(style.minHeight, textH + padY),
  };
}

type LaidNode = {
  node: ElementNode;
  style: ResolvedStyle;
  children: LaidNode[];
  width: number;
  height: number;
  x: number;
  y: number;
};

function collectTree(
  scene: Scene,
  node: ElementNode,
  interaction: InteractionState,
): LaidNode | null {
  const style = resolveNodeStyle(scene, node, stateFor(node.id, interaction));
  if (style.display === 'none') {
    return null;
  }
  const children = node.children
    .map((child) => collectTree(scene, child, interaction))
    .filter((child): child is LaidNode => child != null);
  return {
    node,
    style,
    children,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
}

function layoutNode(
  laid: LaidNode,
  availableWidth: number,
  availableHeight: number,
  options: { shrinkWrap?: boolean } = {},
): void {
  const { style } = laid;
  const padX = style.paddingLeft + style.paddingRight;
  const padY = style.paddingTop + style.paddingBottom;
  const intrinsic = intrinsicSize(style);
  const shrinkWrap = options.shrinkWrap === true && style.width == null;

  const flowChildren = laid.children.filter((child) => child.style.position !== 'absolute');
  const absoluteChildren = laid.children.filter((child) => child.style.position === 'absolute');

  let contentWidth = shrinkWrap
    ? Math.max(0, intrinsic.width - padX)
    : style.width != null
      ? Math.max(0, style.width - padX)
      : Math.max(0, availableWidth - padX);
  let contentHeight =
    style.height != null ? Math.max(0, style.height - padY) : undefined;

  if (style.display === 'row') {
    const fixedTotal = flowChildren.reduce((sum, child) => {
      if (child.style.width != null || child.style.flex <= 0) {
        // Non-flex row items size to content, not the full row width.
        layoutNode(
          child,
          child.style.width ?? contentWidth,
          contentHeight ?? availableHeight,
          { shrinkWrap: child.style.width == null },
        );
        return sum + child.width;
      }
      return sum;
    }, 0);
    const flexTotal = flowChildren.reduce(
      (sum, child) => (child.style.width == null && child.style.flex > 0 ? sum + child.style.flex : sum),
      0,
    );
    const gapTotal = Math.max(0, flowChildren.length - 1) * style.gap;
    const free = Math.max(0, contentWidth - fixedTotal - gapTotal);

    for (const child of flowChildren) {
      if (child.style.width == null && child.style.flex > 0) {
        const share = flexTotal > 0 ? (free * child.style.flex) / flexTotal : free;
        layoutNode(child, share, contentHeight ?? availableHeight);
      } else if (child.width === 0) {
        layoutNode(
          child,
          child.style.width ?? contentWidth,
          contentHeight ?? availableHeight,
          { shrinkWrap: child.style.width == null },
        );
      }
    }

    if (style.width == null) {
      const childrenWidth =
        flowChildren.reduce((sum, child) => sum + child.width, 0) + gapTotal;
      contentWidth = shrinkWrap
        ? Math.max(childrenWidth, intrinsic.width - padX)
        : Math.max(contentWidth, childrenWidth, intrinsic.width - padX);
    }

    const maxChildHeight = flowChildren.reduce((max, child) => Math.max(max, child.height), 0);
    if (contentHeight == null) {
      contentHeight = Math.max(maxChildHeight, intrinsic.height - padY);
    }

    // Align / justify
    const totalChildrenWidth =
      flowChildren.reduce((sum, child) => sum + child.width, 0) + gapTotal;
    let cursorX = 0;
    let freeSpace = Math.max(0, contentWidth - totalChildrenWidth);
    let between = style.gap;
    if (style.justify === 'center') {
      cursorX = freeSpace / 2;
    } else if (style.justify === 'end') {
      cursorX = freeSpace;
    } else if (style.justify === 'space-between' && flowChildren.length > 1) {
      between = style.gap + freeSpace / (flowChildren.length - 1);
      cursorX = 0;
    }

    for (const child of flowChildren) {
      let childY = 0;
      if (style.align === 'center') {
        childY = (contentHeight - child.height) / 2;
      } else if (style.align === 'end') {
        childY = contentHeight - child.height;
      } else if (style.align === 'stretch' && child.style.height == null) {
        child.height = contentHeight;
      }
      child.x = cursorX;
      child.y = childY;
      cursorX += child.width + between;
    }
  } else {
    // column
    if (style.width == null && !shrinkWrap && availableWidth > 0) {
      contentWidth = Math.max(contentWidth, intrinsic.width - padX);
    }

    for (const child of flowChildren) {
      const childAvailW =
        !shrinkWrap && style.align === 'stretch' && child.style.width == null
          ? contentWidth
          : child.style.width ?? contentWidth;
      layoutNode(
        child,
        childAvailW,
        child.style.height ?? availableHeight,
        {
          shrinkWrap:
            shrinkWrap ||
            (style.align !== 'stretch' && child.style.width == null),
        },
      );
    }

    const gapTotal = Math.max(0, flowChildren.length - 1) * style.gap;
    const childrenHeight =
      flowChildren.reduce((sum, child) => sum + child.height, 0) + gapTotal;
    if (contentHeight == null) {
      contentHeight = Math.max(childrenHeight, intrinsic.height - padY);
    }
    if (style.width == null) {
      const maxChildWidth = flowChildren.reduce((max, child) => Math.max(max, child.width), 0);
      contentWidth = shrinkWrap
        ? Math.max(maxChildWidth, intrinsic.width - padX)
        : Math.max(contentWidth, maxChildWidth, intrinsic.width - padX);
    }

    let cursorY = 0;
    let freeSpace = Math.max(0, contentHeight - childrenHeight);
    let between = style.gap;
    if (style.justify === 'center') {
      cursorY = freeSpace / 2;
    } else if (style.justify === 'end') {
      cursorY = freeSpace;
    } else if (style.justify === 'space-between' && flowChildren.length > 1) {
      between = style.gap + freeSpace / (flowChildren.length - 1);
      cursorY = 0;
    }

    for (const child of flowChildren) {
      let childX = 0;
      if (style.align === 'center') {
        childX = (contentWidth - child.width) / 2;
      } else if (style.align === 'end') {
        childX = contentWidth - child.width;
      } else if (!shrinkWrap && style.align === 'stretch' && child.style.width == null) {
        child.width = contentWidth;
      }
      child.x = childX;
      child.y = cursorY;
      cursorY += child.height + between;
    }
  }

  for (const child of absoluteChildren) {
    layoutNode(
      child,
      child.style.width ?? contentWidth,
      child.style.height ?? contentHeight ?? availableHeight,
    );
    child.x = child.style.x ?? 0;
    child.y = child.style.y ?? 0;
  }

  const finalContentHeight = contentHeight ?? intrinsic.height - padY;
  laid.width = style.width != null ? style.width : Math.max(style.minWidth, contentWidth + padX);
  laid.height =
    style.height != null ? style.height : Math.max(style.minHeight, finalContentHeight + padY);
}

function toLayoutBox(laid: LaidNode, originX: number, originY: number): LayoutBox {
  const absX = originX + laid.x;
  const absY = originY + laid.y;
  const contentX = absX + laid.style.paddingLeft;
  const contentY = absY + laid.style.paddingTop;
  return {
    id: laid.node.id,
    x: absX,
    y: absY,
    width: laid.width,
    height: laid.height,
    contentX,
    contentY,
    contentWidth: Math.max(0, laid.width - laid.style.paddingLeft - laid.style.paddingRight),
    contentHeight: Math.max(0, laid.height - laid.style.paddingTop - laid.style.paddingBottom),
    style: laid.style,
    children: laid.children.map((child) => toLayoutBox(child, contentX, contentY)),
  };
}

export function layoutScene(
  scene: Scene,
  viewportWidth: number,
  viewportHeight: number,
  interaction: InteractionState = {},
): LayoutBox[] {
  const roots = scene.roots
    .map((root) => collectTree(scene, root, interaction))
    .filter((root): root is LaidNode => root != null);

  for (const root of roots) {
    const availW = root.style.width ?? viewportWidth;
    const availH = root.style.height ?? viewportHeight;
    layoutNode(root, availW, availH);
    root.x = root.style.x ?? 0;
    root.y = root.style.y ?? 0;
  }

  return roots.map((root) => toLayoutBox(root, 0, 0));
}

export function flattenBoxes(boxes: LayoutBox[]): LayoutBox[] {
  const out: LayoutBox[] = [];
  const walk = (box: LayoutBox): void => {
    out.push(box);
    for (const child of box.children) {
      walk(child);
    }
  };
  for (const box of boxes) {
    walk(box);
  }
  return out;
}
