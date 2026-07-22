import type { CssValue, StyleMap, Theme } from '../types';

/** Reference a semantic theme token from StyleProps. */
export type TokenRef = { readonly __token: string };

/** Create a token reference for use in StyleProps (`fill: token('surface')`). */
export function token(name: string): TokenRef {
  return { __token: name };
}

export function isTokenRef(value: unknown): value is TokenRef {
  return typeof value === 'object' && value != null && '__token' in value;
}

/** Built-in dark theme tokens for demos and defaults. */
export const darkTheme: Theme = {
  surface: '#1c1c28',
  text: '#e8e8f0',
  muted: '#9a9ab0',
  accent: '#6c7cff',
  accentHover: '#8a97ff',
  danger: '#ff6b7a',
  ok: '#5dd39e',
  border: '#32324a',
  canvas: '#12121a',
};

/** Built-in light theme tokens. */
export const lightTheme: Theme = {
  surface: '#f4f4f8',
  text: '#1a1a22',
  muted: '#6a6a7a',
  accent: '#4a5ae8',
  accentHover: '#6b78f0',
  danger: '#d64555',
  ok: '#2f9e6b',
  border: '#c8c8d4',
  canvas: '#ececf2',
};

function resolveTokenValue(name: string, theme: Theme): CssValue {
  const raw = theme[name];
  if (raw == null) {
    return { kind: 'keyword', value: 'transparent' };
  }
  if (typeof raw === 'number') {
    return { kind: 'number', value: raw };
  }
  if (raw.startsWith('#')) {
    return { kind: 'color', value: raw };
  }
  return { kind: 'keyword', value: raw };
}

function resolveCssValue(value: CssValue, theme: Theme): CssValue {
  if (value.kind === 'token') {
    return resolveTokenValue(value.name, theme);
  }
  if (value.kind === 'list') {
    return {
      kind: 'list',
      items: value.items.map((item) => resolveCssValue(item, theme)),
    };
  }
  if (value.kind === 'var' && value.fallback) {
    return {
      kind: 'var',
      name: value.name,
      fallback: resolveCssValue(value.fallback, theme),
    };
  }
  return value;
}

/** Resolve `token(...)` entries in a style map against the active theme. */
export function resolveTokensInMap(map: StyleMap, theme: Theme): StyleMap {
  const out: StyleMap = {};
  for (const [key, value] of Object.entries(map)) {
    out[key] = resolveCssValue(value, theme);
  }
  return out;
}
