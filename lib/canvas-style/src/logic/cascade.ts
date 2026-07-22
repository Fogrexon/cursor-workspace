import type {
  CssValue,
  ElementNode,
  PseudoState,
  ResolvedStyle,
  Rule,
  SimpleSelector,
  StyleMap,
  Stylesheet,
} from '../types';
import {
  asColor,
  asNumber,
  asString,
  expandBox,
  parseBorder,
  resolveVariables,
} from './values';

type MatchedDecl = {
  property: string;
  value: CssValue;
  important: boolean;
  specificity: number;
  order: number;
};

function specificityOf(selector: SimpleSelector): number {
  let score = 0;
  if (selector.id) score += 100;
  score += selector.classes.length * 10;
  if (selector.type && selector.type !== '*') score += 1;
  if (selector.pseudo) score += 10;
  return score;
}

function matchesSelector(
  selector: SimpleSelector,
  node: ElementNode,
  state: Set<PseudoState>,
): boolean {
  if (selector.type && selector.type !== '*' && selector.type !== node.typeName) {
    return false;
  }
  if (selector.id && selector.id !== node.id) {
    return false;
  }
  for (const className of selector.classes) {
    if (!node.classNames.includes(className)) {
      return false;
    }
  }
  if (selector.pseudo && !state.has(selector.pseudo)) {
    return false;
  }
  return true;
}

function isRootSelector(selector: SimpleSelector): boolean {
  return selector.type === 'root' || selector.id === 'root';
}

export function collectVariables(stylesheet: Stylesheet): Record<string, CssValue> {
  const matched: MatchedDecl[] = [];
  let order = 0;

  for (const rule of stylesheet.rules) {
    for (const selector of rule.selectors) {
      if (!isRootSelector(selector)) {
        continue;
      }
      const specificity = specificityOf(selector);
      for (const decl of rule.declarations) {
        if (!decl.property.startsWith('--')) {
          continue;
        }
        matched.push({
          property: decl.property,
          value: decl.value,
          important: decl.important,
          specificity,
          order: order++,
        });
      }
    }
  }

  matched.sort((a, b) => {
    if (a.important !== b.important) {
      return a.important ? 1 : -1;
    }
    if (a.specificity !== b.specificity) {
      return a.specificity - b.specificity;
    }
    return a.order - b.order;
  });

  const variables: Record<string, CssValue> = {};
  for (const item of matched) {
    variables[item.property] = item.value;
  }
  return variables;
}

export function resolveStyleMap(
  stylesheet: Stylesheet,
  node: ElementNode,
  state: Set<PseudoState>,
  variables: Record<string, CssValue>,
): StyleMap {
  const matched: MatchedDecl[] = [];
  let order = 0;

  for (const rule of stylesheet.rules) {
    for (const selector of rule.selectors) {
      if (!matchesSelector(selector, node, state)) {
        continue;
      }
      const specificity = specificityOf(selector);
      for (const decl of rule.declarations) {
        if (decl.property.startsWith('--')) {
          continue;
        }
        matched.push({
          property: decl.property,
          value: decl.value,
          important: decl.important,
          specificity,
          order: order++,
        });
      }
    }
  }

  matched.sort((a, b) => {
    if (a.important !== b.important) {
      return a.important ? 1 : -1;
    }
    if (a.specificity !== b.specificity) {
      return a.specificity - b.specificity;
    }
    return a.order - b.order;
  });

  const map: StyleMap = {};
  for (const item of matched) {
    map[item.property] = resolveVariables(item.value, variables);
  }
  return map;
}

function keyword(map: StyleMap, property: string, fallback: string): string {
  return asString(map[property], fallback).toLowerCase();
}

export function toResolvedStyle(map: StyleMap, node: ElementNode): ResolvedStyle {
  const padding = expandBox(map.padding);
  const border = parseBorder(map.border);
  const borderColor =
    map['border-color'] != null ? asColor(map['border-color'], border.color) : border.color;
  const borderWidth =
    map['border-width'] != null ? asNumber(map['border-width'], border.width) : border.width;

  const displayRaw = keyword(map, 'display', 'column');
  const display =
    displayRaw === 'row' || displayRaw === 'column' || displayRaw === 'none'
      ? displayRaw
      : 'column';

  const positionRaw = keyword(map, 'position', 'flow');
  const position = positionRaw === 'absolute' ? 'absolute' : 'flow';

  const justifyRaw = keyword(map, 'justify', 'start');
  const justify =
    justifyRaw === 'center' ||
    justifyRaw === 'end' ||
    justifyRaw === 'space-between' ||
    justifyRaw === 'start'
      ? justifyRaw
      : 'start';

  const alignRaw = keyword(map, 'align', 'stretch');
  const align =
    alignRaw === 'start' ||
    alignRaw === 'center' ||
    alignRaw === 'end' ||
    alignRaw === 'stretch'
      ? alignRaw
      : 'stretch';

  const textAlignRaw = keyword(map, 'text-align', 'left');
  const textAlign =
    textAlignRaw === 'center' || textAlignRaw === 'right' || textAlignRaw === 'left'
      ? textAlignRaw
      : 'left';

  const typeName = asString(map.type, node.typeName) || node.typeName;
  const parentRaw = map.parent ? asString(map.parent) : node.parentId;
  const parentId = parentRaw ? parentRaw.replace(/^#/, '') : undefined;

  return {
    display,
    position,
    x: map.x != null ? asNumber(map.x) : undefined,
    y: map.y != null ? asNumber(map.y) : undefined,
    width: map.width != null ? asNumber(map.width) : undefined,
    height: map.height != null ? asNumber(map.height) : undefined,
    minWidth: asNumber(map['min-width'], 0),
    minHeight: asNumber(map['min-height'], 0),
    flex: asNumber(map.flex, 0),
    gap: asNumber(map.gap, 0),
    paddingTop: padding[0],
    paddingRight: padding[1],
    paddingBottom: padding[2],
    paddingLeft: padding[3],
    justify,
    align,
    background: asColor(map.background, 'transparent'),
    color: asColor(map.color, '#e8e8f0'),
    borderWidth,
    borderColor: borderColor === 'currentColor' ? asColor(map.color, '#e8e8f0') : borderColor,
    borderRadius: asNumber(map['border-radius'], 0),
    opacity: map.opacity != null ? asNumber(map.opacity, 1) : 1,
    fontSize: asNumber(map['font-size'], 14),
    fontWeight: asNumber(map['font-weight'], 400),
    textAlign,
    content: asString(map.content, ''),
    typeName,
    parentId,
  };
}

export function matchRulesForTests(
  rule: Rule,
  node: ElementNode,
  state: Set<PseudoState>,
): boolean {
  return rule.selectors.some((selector) => matchesSelector(selector, node, state));
}
