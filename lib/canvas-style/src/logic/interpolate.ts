export type EasingName = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

export function ease(t: number, name: EasingName = 'easeOut'): number {
  const x = Math.min(1, Math.max(0, t));
  switch (name) {
    case 'linear':
      return x;
    case 'easeIn':
      return x * x;
    case 'easeInOut':
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    case 'easeOut':
    default:
      return 1 - (1 - x) * (1 - x);
  }
}

function parseHex(color: string): { r: number; g: number; b: number } | undefined {
  const raw = color.trim();
  if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(raw)) {
    return undefined;
  }
  const hex = raw.slice(1);
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0]! + hex[0]!, 16),
      g: parseInt(hex[1]! + hex[1]!, 16),
      b: parseInt(hex[2]! + hex[2]!, 16),
    };
  }
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const c = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Interpolate two values when both are numbers or both are hex colors. */
export function interpolateValue(
  from: unknown,
  to: unknown,
  t: number,
): number | string | undefined {
  if (typeof from === 'number' && typeof to === 'number') {
    return from + (to - from) * t;
  }
  if (typeof from === 'string' && typeof to === 'string') {
    const a = parseHex(from);
    const b = parseHex(to);
    if (!a || !b) {
      return t >= 1 ? to : from;
    }
    return toHex({
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t,
    });
  }
  return t >= 1 ? (to as number | string) : (from as number | string);
}

export type Tween = {
  id: string;
  key: string;
  from: number | string;
  to: number | string;
  startMs: number;
  durationMs: number;
  easing: EasingName;
};

/** Advance tweens; returns current values keyed by `id\0key`. */
export function stepTweens(
  tweens: Tween[],
  nowMs: number,
): { values: Map<string, number | string>; remaining: Tween[] } {
  const values = new Map<string, number | string>();
  const remaining: Tween[] = [];
  for (const tween of tweens) {
    const elapsed = nowMs - tween.startMs;
    const t = tween.durationMs <= 0 ? 1 : ease(elapsed / tween.durationMs, tween.easing);
    const value = interpolateValue(tween.from, tween.to, t);
    if (value != null) {
      values.set(`${tween.id}\0${tween.key}`, value);
    }
    if (t < 1) {
      remaining.push(tween);
    }
  }
  return { values, remaining };
}
