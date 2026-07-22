import type {
  ElementNode,
  ParseDiagnostic,
  PseudoState,
  ResolvedStyle,
  Scene,
  Stylesheet,
} from '../types';
import { collectVariables, resolveStyleMap, toResolvedStyle } from './cascade';
import { parseStylesheet } from './parser';
import { darkTheme, resolveTokensInMap } from './theme';
import { asString } from './values';

export type CompileResult = {
  scene: Scene;
  diagnostics: ParseDiagnostic[];
};

function classListFromRules(stylesheet: Stylesheet, id: string): string[] {
  const classes = new Set<string>();
  for (const rule of stylesheet.rules) {
    for (const selector of rule.selectors) {
      if (selector.id === id) {
        for (const className of selector.classes) {
          classes.add(className);
        }
      }
      if (selector.id !== id) {
        continue;
      }
      for (const decl of rule.declarations) {
        if (decl.property !== 'class') {
          continue;
        }
        if (decl.value.kind === 'keyword' || decl.value.kind === 'string') {
          classes.add(decl.value.value.replace(/^\./, ''));
        } else if (decl.value.kind === 'list') {
          for (const item of decl.value.items) {
            if (item.kind === 'keyword' || item.kind === 'string') {
              classes.add(item.value.replace(/^\./, ''));
            }
          }
        }
      }
    }
  }
  return [...classes];
}

function typeFromIdRules(stylesheet: Stylesheet, id: string): string | undefined {
  let found: string | undefined;
  for (const rule of stylesheet.rules) {
    for (const selector of rule.selectors) {
      if (selector.id !== id) {
        continue;
      }
      for (const decl of rule.declarations) {
        if (decl.property === 'type') {
          found = asString(decl.value);
        }
      }
      if (selector.type) {
        found = found ?? selector.type;
      }
    }
  }
  return found;
}

function parentFromIdRules(stylesheet: Stylesheet, id: string): string | undefined {
  for (const rule of stylesheet.rules) {
    for (const selector of rule.selectors) {
      if (selector.id !== id) {
        continue;
      }
      for (const decl of rule.declarations) {
        if (decl.property === 'parent') {
          return asString(decl.value).replace(/^#/, '');
        }
      }
    }
  }
  return undefined;
}

export function buildScene(stylesheet: Stylesheet): CompileResult {
  const diagnostics = [...stylesheet.diagnostics];
  const variables = collectVariables(stylesheet);
  const ids = new Set<string>();

  for (const rule of stylesheet.rules) {
    for (const selector of rule.selectors) {
      if (selector.id) {
        ids.add(selector.id);
      }
    }
  }

  const byId = new Map<string, ElementNode>();
  for (const id of ids) {
    const typeName = typeFromIdRules(stylesheet, id) ?? 'box';
    const parentId = parentFromIdRules(stylesheet, id);
    byId.set(id, {
      id,
      typeName,
      classNames: classListFromRules(stylesheet, id),
      parentId,
      children: [],
    });
  }

  for (const node of byId.values()) {
    if (!node.parentId) {
      continue;
    }
    const parent = byId.get(node.parentId);
    if (!parent) {
      diagnostics.push({
        message: `#${node.id} の parent #${node.parentId} が見つかりません`,
        line: 1,
        column: 1,
      });
      node.parentId = undefined;
      continue;
    }
    parent.children.push(node);
  }

  // Preserve document order of ID first appearance.
  const orderedIds = [...ids];
  for (const node of byId.values()) {
    node.children.sort(
      (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id),
    );
  }

  const roots = orderedIds
    .map((id) => byId.get(id)!)
    .filter((node) => !node.parentId);

  return {
    scene: {
      roots,
      byId,
      variables,
      stylesheet,
      inlineStyles: new Map(),
      contentOverrides: new Map(),
      theme: { ...darkTheme },
      motionOverlays: new Map(),
    },
    diagnostics,
  };
}

export function compileDocument(source: string): CompileResult {
  const stylesheet = parseStylesheet(source);
  return buildScene(stylesheet);
}

export function emptyScene(stylesheet: Stylesheet = { rules: [], diagnostics: [] }): Scene {
  return {
    roots: [],
    byId: new Map(),
    variables: collectVariables(stylesheet),
    stylesheet,
    inlineStyles: new Map(),
    contentOverrides: new Map(),
    theme: { ...darkTheme },
    motionOverlays: new Map(),
  };
}

export function resolveNodeStyle(
  scene: Scene,
  node: ElementNode,
  state: Set<PseudoState> = new Set(),
): ResolvedStyle {
  const map = resolveTokensInMap(
    {
      ...resolveStyleMap(scene.stylesheet, node, state, scene.variables),
      ...(scene.inlineStyles.get(node.id) ?? {}),
    },
    scene.theme,
  );
  const overlay = scene.motionOverlays.get(node.id);
  const style = toResolvedStyle(overlay ? { ...map, ...overlay } : map, node);
  const content = scene.contentOverrides.get(node.id);
  if (content != null) {
    return { ...style, content };
  }
  return style;
}
