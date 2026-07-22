import type { ElementNode, Scene, StyleMap } from '../types';
import { emptyScene } from './compile';
import { collectVariables } from './cascade';
import { parseStylesheet } from './parser';
import { stylePropsToMap, type StyleProps } from './styleProps';

export type UiNodeDesc = {
  id: string;
  type: string;
  classNames?: string[];
  content?: string;
  style?: StyleProps;
  children?: UiNodeDesc[];
  onClick?: () => void;
};

export type TreeMountResult = {
  scene: Scene;
  clickHandlers: Map<string, () => void>;
};

export function node(
  type: string,
  options: Omit<UiNodeDesc, 'type'> & { type?: string },
): UiNodeDesc {
  return { ...options, type: options.type ?? type };
}

function walk(
  desc: UiNodeDesc,
  parentId: string | undefined,
  byId: Map<string, ElementNode>,
  inlineStyles: Map<string, StyleMap>,
  contentOverrides: Map<string, string>,
  clickHandlers: Map<string, () => void>,
): ElementNode {
  if (byId.has(desc.id)) {
    throw new Error(`Duplicate UI node id: ${desc.id}`);
  }
  const element: ElementNode = {
    id: desc.id,
    typeName: desc.type,
    classNames: [...(desc.classNames ?? [])],
    parentId,
    children: [],
  };
  byId.set(desc.id, element);

  if (desc.style) {
    inlineStyles.set(desc.id, stylePropsToMap(desc.style));
  }
  if (desc.content != null) {
    contentOverrides.set(desc.id, desc.content);
  }
  if (desc.onClick) {
    clickHandlers.set(desc.id, desc.onClick);
  }

  element.children = (desc.children ?? []).map((child) =>
    walk(child, desc.id, byId, inlineStyles, contentOverrides, clickHandlers),
  );
  return element;
}

export function mountTree(
  roots: UiNodeDesc | UiNodeDesc[],
  stylesheetSource = '',
): TreeMountResult {
  const stylesheet = parseStylesheet(stylesheetSource);
  const list = Array.isArray(roots) ? roots : [roots];
  const byId = new Map<string, ElementNode>();
  const inlineStyles = new Map<string, StyleMap>();
  const contentOverrides = new Map<string, string>();
  const clickHandlers = new Map<string, () => void>();

  const rootNodes = list.map((desc) =>
    walk(desc, undefined, byId, inlineStyles, contentOverrides, clickHandlers),
  );

  const scene: Scene = {
    ...emptyScene(stylesheet),
    roots: rootNodes,
    byId,
    variables: collectVariables(stylesheet),
    stylesheet,
    inlineStyles,
    contentOverrides,
  };

  return { scene, clickHandlers };
}
