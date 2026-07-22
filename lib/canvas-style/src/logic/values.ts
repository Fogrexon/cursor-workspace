import type { CssValue } from '../types';

export function asNumber(value: CssValue | undefined, fallback = 0): number {
  if (!value) {
    return fallback;
  }
  if (value.kind === 'number') {
    return value.value;
  }
  if (value.kind === 'keyword' && value.value === 'none') {
    return 0;
  }
  return fallback;
}

export function asString(value: CssValue | undefined, fallback = ''): string {
  if (!value) {
    return fallback;
  }
  if (value.kind === 'string' || value.kind === 'keyword' || value.kind === 'color') {
    return value.value;
  }
  if (value.kind === 'number') {
    return String(value.value);
  }
  return fallback;
}

export function asColor(value: CssValue | undefined, fallback = 'transparent'): string {
  if (!value) {
    return fallback;
  }
  if (value.kind === 'color') {
    return value.value;
  }
  if (value.kind === 'keyword') {
    return value.value;
  }
  return fallback;
}

export function expandBox(value: CssValue | undefined): [number, number, number, number] {
  if (!value) {
    return [0, 0, 0, 0];
  }
  const nums =
    value.kind === 'list'
      ? value.items.map((item) => asNumber(item, 0))
      : [asNumber(value, 0)];

  if (nums.length === 1) {
    const n = nums[0]!;
    return [n, n, n, n];
  }
  if (nums.length === 2) {
    return [nums[0]!, nums[1]!, nums[0]!, nums[1]!];
  }
  if (nums.length === 3) {
    return [nums[0]!, nums[1]!, nums[2]!, nums[1]!];
  }
  return [nums[0]!, nums[1]!, nums[2]!, nums[3]!];
}

export function resolveVariables(
  value: CssValue,
  variables: Record<string, CssValue>,
  stack: string[] = [],
): CssValue {
  if (value.kind === 'var') {
    if (stack.includes(value.name)) {
      return value.fallback ? resolveVariables(value.fallback, variables, stack) : { kind: 'keyword', value: 'transparent' };
    }
    const next = variables[value.name];
    if (!next) {
      return value.fallback
        ? resolveVariables(value.fallback, variables, stack)
        : { kind: 'keyword', value: 'transparent' };
    }
    return resolveVariables(next, variables, [...stack, value.name]);
  }
  if (value.kind === 'list') {
    return {
      kind: 'list',
      items: value.items.map((item) => resolveVariables(item, variables, stack)),
    };
  }
  return value;
}

export function parseBorder(value: CssValue | undefined): { width: number; color: string } {
  if (!value) {
    return { width: 0, color: 'transparent' };
  }
  if (value.kind === 'keyword' && value.value === 'none') {
    return { width: 0, color: 'transparent' };
  }
  if (value.kind === 'number') {
    return { width: value.value, color: 'currentColor' };
  }
  if (value.kind === 'color' || (value.kind === 'keyword' && value.value.startsWith('#'))) {
    return { width: 1, color: asColor(value) };
  }
  if (value.kind === 'list') {
    let width = 1;
    let color = 'currentColor';
    for (const item of value.items) {
      if (item.kind === 'number') {
        width = item.value;
      } else if (item.kind === 'keyword' && item.value === 'solid') {
        continue;
      } else {
        color = asColor(item, color);
      }
    }
    return { width, color };
  }
  return { width: 1, color: asColor(value, 'currentColor') };
}
