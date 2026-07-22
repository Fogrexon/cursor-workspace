import type { CssValue, StyleMap } from '../types';
import { isTokenRef, type TokenRef } from './theme';

type Colorish = string | TokenRef;

/**
 * Style props for nodes. Accepts both current CSS-ish names and DX vocabulary
 * (`fill`, `text`, `direction`, `grow`, `radius`, …).
 */
export type StyleProps = {
  display?: 'row' | 'column' | 'none';
  direction?: 'row' | 'column' | 'none';
  position?: 'flow' | 'absolute';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  flex?: number;
  grow?: number;
  gap?: number;
  padding?:
    | number
    | readonly [number, number]
    | readonly [number, number, number, number];
  justify?: 'start' | 'center' | 'end' | 'space-between';
  align?: 'start' | 'center' | 'end' | 'stretch';
  background?: Colorish;
  fill?: Colorish;
  color?: Colorish;
  textColor?: Colorish;
  border?: string | number;
  borderWidth?: number;
  strokeWidth?: number;
  borderColor?: Colorish;
  stroke?: Colorish;
  borderRadius?: number;
  radius?: number;
  opacity?: number;
  fontSize?: number;
  textSize?: number;
  fontWeight?: number;
  textWeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  content?: string;
  text?: string;
  /** Per-key transition durations in ms, or a single duration for all animatable keys. */
  transition?: number | Record<string, number>;
};

function num(value: number): CssValue {
  return { kind: 'number', value };
}

function keywordOrColor(value: string): CssValue {
  if (value.startsWith('#')) {
    return { kind: 'color', value };
  }
  return { kind: 'keyword', value };
}

function colorish(value: Colorish): CssValue {
  if (isTokenRef(value)) {
    return { kind: 'token', name: value.__token };
  }
  return keywordOrColor(value);
}

function paddingValue(
  padding:
    | number
    | readonly [number, number]
    | readonly [number, number, number, number],
): CssValue {
  if (typeof padding === 'number') {
    return num(padding);
  }
  return { kind: 'list', items: padding.map(num) };
}

/** Normalize DX aliases into the cascade property names. */
export function normalizeStyleProps(props: StyleProps): StyleProps {
  const out: StyleProps = { ...props };
  if (out.direction != null && out.display == null) {
    out.display = out.direction;
  }
  if (out.grow != null && out.flex == null) {
    out.flex = out.grow;
  }
  if (out.fill != null && out.background == null) {
    out.background = out.fill;
  }
  if (out.textColor != null && out.color == null) {
    out.color = out.textColor;
  }
  if (out.stroke != null && out.borderColor == null) {
    out.borderColor = out.stroke;
  }
  if (out.strokeWidth != null && out.borderWidth == null) {
    out.borderWidth = out.strokeWidth;
  }
  if (out.radius != null && out.borderRadius == null) {
    out.borderRadius = out.radius;
  }
  if (out.textSize != null && out.fontSize == null) {
    out.fontSize = out.textSize;
  }
  if (out.textWeight != null && out.fontWeight == null) {
    out.fontWeight = out.textWeight;
  }
  if (out.text != null && out.content == null) {
    out.content = out.text;
  }
  return out;
}

const KEY_TO_PROP: Partial<Record<keyof StyleProps, string>> = {
  display: 'display',
  position: 'position',
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  minWidth: 'min-width',
  minHeight: 'min-height',
  flex: 'flex',
  gap: 'gap',
  padding: 'padding',
  justify: 'justify',
  align: 'align',
  background: 'background',
  color: 'color',
  border: 'border',
  borderWidth: 'border-width',
  borderColor: 'border-color',
  borderRadius: 'border-radius',
  opacity: 'opacity',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  textAlign: 'text-align',
  content: 'content',
};

export function stylePropsToMap(props: StyleProps): StyleMap {
  const normalized = normalizeStyleProps(props);
  const map: StyleMap = {};
  for (const [key, cssName] of Object.entries(KEY_TO_PROP) as [keyof StyleProps, string][]) {
    const value = normalized[key];
    if (value == null || key === 'transition') {
      continue;
    }
    if (key === 'padding') {
      map[cssName] = paddingValue(
        value as
          | number
          | readonly [number, number]
          | readonly [number, number, number, number],
      );
      continue;
    }
    if (typeof value === 'number') {
      map[cssName] = num(value);
      continue;
    }
    if (key === 'content') {
      map[cssName] = { kind: 'string', value: String(value) };
      continue;
    }
    if (key === 'border' && typeof value === 'string') {
      const parts = value.trim().split(/\s+/);
      if (parts.length === 1) {
        map[cssName] = keywordOrColor(parts[0]!);
      } else {
        map[cssName] = {
          kind: 'list',
          items: parts.map((part) =>
            /^\d+(\.\d+)?$/.test(part) ? num(Number(part)) : keywordOrColor(part),
          ),
        };
      }
      continue;
    }
    if (key === 'background' || key === 'color' || key === 'borderColor') {
      map[cssName] = colorish(value as Colorish);
      continue;
    }
    map[cssName] = keywordOrColor(String(value));
  }
  return map;
}

/** Expand `transition` into a per-canonical-key duration map. */
export function transitionDurations(props: StyleProps | undefined): Map<string, number> {
  const out = new Map<string, number>();
  if (!props?.transition) {
    return out;
  }
  if (typeof props.transition === 'number') {
    for (const key of [
      'opacity',
      'x',
      'y',
      'width',
      'height',
      'background',
      'color',
      'borderRadius',
      'borderWidth',
      'fontSize',
      'fontWeight',
    ]) {
      out.set(key, props.transition);
    }
    return out;
  }
  for (const [key, ms] of Object.entries(props.transition)) {
    const canonical =
      key === 'fill'
        ? 'background'
        : key === 'textColor'
          ? 'color'
          : key === 'radius'
            ? 'borderRadius'
            : key === 'stroke'
              ? 'borderColor'
              : key === 'strokeWidth'
                ? 'borderWidth'
                : key === 'textSize'
                  ? 'fontSize'
                  : key === 'textWeight'
                    ? 'fontWeight'
                    : key;
    out.set(canonical, ms);
  }
  return out;
}
