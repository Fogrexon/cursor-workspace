/** Built-in Graphim demo effects selectable in the UI. */
export const EFFECT_IDS = [
  'gray',
  'sepia',
  'neg',
  'blur',
  'bloom',
  'pixel',
  'frosted',
  'wave',
] as const;

export type EffectId = (typeof EFFECT_IDS)[number];

export type EffectMeta = {
  id: EffectId;
  label: string;
  /** Needs `Renderer.animate` (uses `time` uniform). */
  animated: boolean;
};

const EFFECT_META: Record<EffectId, Omit<EffectMeta, 'id'>> = {
  gray: { label: 'Gray', animated: false },
  sepia: { label: 'Sepia', animated: false },
  neg: { label: 'Negative', animated: false },
  blur: { label: 'Blur', animated: false },
  bloom: { label: 'Bloom', animated: false },
  pixel: { label: 'Pixel', animated: false },
  frosted: { label: 'Frosted glass', animated: false },
  wave: { label: 'Wave (custom)', animated: true },
};

/** Ordered list for the effect picker. */
export function listEffects(): EffectMeta[] {
  return EFFECT_IDS.map((id) => ({ id, ...EFFECT_META[id] }));
}

/** Resolve label for an effect id; unknown ids fall back to the raw id. */
export function getEffectLabel(id: string): string {
  if (isEffectId(id)) return EFFECT_META[id].label;
  return id;
}

export function isEffectId(value: string): value is EffectId {
  return (EFFECT_IDS as readonly string[]).includes(value);
}

export function isAnimatedEffect(id: EffectId): boolean {
  return EFFECT_META[id].animated;
}
