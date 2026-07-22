import type { StyleMap, Theme } from '../types';
import { ease, interpolateValue, type EasingName, type Tween } from '../logic/interpolate';
import type { StyleProps } from '../logic/styleProps';

export type AnimateOptions = {
  to: StyleProps;
  duration?: number;
  easing?: EasingName;
};

type MotionListener = () => void;

function toCssKey(key: string): string {
  switch (key) {
    case 'borderRadius':
      return 'border-radius';
    case 'fontSize':
      return 'font-size';
    case 'fontWeight':
      return 'font-weight';
    case 'borderWidth':
      return 'border-width';
    case 'borderColor':
      return 'border-color';
    case 'minWidth':
      return 'min-width';
    case 'minHeight':
      return 'min-height';
    case 'textAlign':
      return 'text-align';
    default:
      return key;
  }
}

function fromCssKey(key: string): string {
  switch (key) {
    case 'border-radius':
      return 'borderRadius';
    case 'font-size':
      return 'fontSize';
    case 'font-weight':
      return 'fontWeight';
    case 'border-width':
      return 'borderWidth';
    case 'border-color':
      return 'borderColor';
    case 'min-width':
      return 'minWidth';
    case 'min-height':
      return 'minHeight';
    case 'text-align':
      return 'textAlign';
    default:
      return key;
  }
}

/**
 * Owns in-flight Style tweens and exposes overlay maps for the renderer.
 * Driven by rAF inside `start`.
 */
export function createMotionEngine(onChange: MotionListener) {
  let tweens: Tween[] = [];
  const overlays = new Map<string, StyleMap>();
  let raf = 0;

  const schedule = (): void => {
    if (raf || typeof requestAnimationFrame === 'undefined') {
      return;
    }
    raf = requestAnimationFrame((now) => {
      raf = 0;
      tick(now);
    });
  };

  const applyOverlayValue = (id: string, key: string, value: number | string): void => {
    const cssKey = toCssKey(key);
    const prev = overlays.get(id) ?? {};
    const next: StyleMap = { ...prev };
    if (typeof value === 'number') {
      next[cssKey] = { kind: 'number', value };
    } else if (value.startsWith('#')) {
      next[cssKey] = { kind: 'color', value };
    } else {
      next[cssKey] = { kind: 'keyword', value };
    }
    overlays.set(id, next);
  };

  const clearOverlayKey = (id: string, key: string): void => {
    const map = overlays.get(id);
    if (!map) {
      return;
    }
    const cssKey = toCssKey(key);
    const { [cssKey]: _, ...rest } = map;
    if (Object.keys(rest).length === 0) {
      overlays.delete(id);
    } else {
      overlays.set(id, rest);
    }
  };

  const tick = (nowMs: number): void => {
    if (tweens.length === 0) {
      return;
    }
    const remaining: Tween[] = [];
    let changed = false;
    for (const tween of tweens) {
      const elapsed = nowMs - tween.startMs;
      const t =
        tween.durationMs <= 0 ? 1 : ease(elapsed / tween.durationMs, tween.easing);
      const value = interpolateValue(tween.from, tween.to, t);
      if (value != null) {
        applyOverlayValue(tween.id, tween.key, value);
        changed = true;
      }
      if (t < 1) {
        remaining.push(tween);
      } else {
        clearOverlayKey(tween.id, tween.key);
      }
    }
    tweens = remaining;
    if (changed) {
      onChange();
    }
    if (tweens.length > 0) {
      schedule();
    }
  };

  return {
    getOverlay(id: string): StyleMap | undefined {
      return overlays.get(id);
    },
    start(id: string, from: StyleProps, to: StyleProps, options: Omit<AnimateOptions, 'to'> = {}) {
      const durationMs = options.duration ?? 200;
      const easing = options.easing ?? 'easeOut';
      const startMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const toMap = to as Record<string, unknown>;
      const fromMap = from as Record<string, unknown>;
      for (const key of Object.keys(toMap)) {
        const target = toMap[key];
        const source = fromMap[key] ?? target;
        if (
          (typeof target === 'number' && typeof source === 'number') ||
          (typeof target === 'string' && typeof source === 'string')
        ) {
          tweens = tweens.filter((t) => !(t.id === id && t.key === key));
          tweens.push({
            id,
            key,
            from: source,
            to: target,
            startMs,
            durationMs,
            easing,
          });
        }
      }
      schedule();
    },
    clear() {
      tweens = [];
      overlays.clear();
      if (raf && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
  };
}

export type MotionEngine = ReturnType<typeof createMotionEngine>;

/** Read animatable fields from a resolved style snapshot. */
export function snapshotAnimatable(style: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity: number;
  background: string;
  color: string;
  borderRadius: number;
  borderWidth: number;
  fontSize: number;
  fontWeight: number;
}): StyleProps {
  return {
    x: style.x,
    y: style.y,
    width: style.width,
    height: style.height,
    opacity: style.opacity,
    background: style.background,
    color: style.color,
    borderRadius: style.borderRadius,
    borderWidth: style.borderWidth,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
  };
}

/** Collect concrete token values from an unresolved inline map for theme cross-fades. */
export function tokenValuesFromMap(unresolved: StyleMap, theme: Theme): StyleProps {
  const props: StyleProps = {};
  for (const [key, value] of Object.entries(unresolved)) {
    if (value.kind !== 'token') {
      continue;
    }
    const raw = theme[value.name];
    if (raw == null) {
      continue;
    }
    (props as Record<string, unknown>)[fromCssKey(key)] = raw;
  }
  return props;
}
