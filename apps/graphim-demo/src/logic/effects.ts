/** Built-in Graphim demo effects selectable in the UI. */
export const EFFECT_IDS = [
  'gray',
  'sepia',
  'neg',
  'blur',
  'bloom',
  'pixel',
  'frosted',
  'vignette',
  'contrast',
  'posterize',
  'mirror',
  'chromatic',
  'edge',
  'wave',
  'mixSplit',
  'bloomGlow',
  'multiplyDuo',
  'screenDuo',
  'overlayDuo',
  'differenceDuo',
  'maskRadial',
  'tripleLook',
  'trail',
] as const;

export type EffectId = (typeof EFFECT_IDS)[number];

export type EffectMeta = {
  id: EffectId;
  label: string;
  /** Needs continuous `animate` (uses `time` or delay). */
  animated: boolean;
  /** How many graph inputs (1 = single chain; 2+ = multi-branch). */
  inputs: 1 | 2 | 3;
};

const EFFECT_META: Record<EffectId, Omit<EffectMeta, 'id'>> = {
  gray: { label: 'Gray', animated: false, inputs: 1 },
  sepia: { label: 'Sepia', animated: false, inputs: 1 },
  neg: { label: 'Negative', animated: false, inputs: 1 },
  blur: { label: 'Blur', animated: false, inputs: 1 },
  bloom: { label: 'Bloom', animated: false, inputs: 1 },
  pixel: { label: 'Pixel', animated: false, inputs: 1 },
  frosted: { label: 'Frosted glass', animated: false, inputs: 1 },
  vignette: { label: 'Vignette', animated: false, inputs: 1 },
  contrast: { label: 'Contrast', animated: false, inputs: 1 },
  posterize: { label: 'Posterize', animated: false, inputs: 1 },
  mirror: { label: 'Mirror', animated: false, inputs: 1 },
  chromatic: { label: 'Chromatic', animated: false, inputs: 1 },
  edge: { label: 'Edge', animated: false, inputs: 1 },
  wave: { label: 'Prismatic flow (custom)', animated: true, inputs: 1 },
  mixSplit: { label: 'Mix: sepia | gray', animated: false, inputs: 2 },
  bloomGlow: { label: 'Mix: original | bloom', animated: false, inputs: 2 },
  multiplyDuo: { label: 'Multiply × overlay', animated: false, inputs: 2 },
  screenDuo: { label: 'Screen × blur', animated: false, inputs: 2 },
  overlayDuo: { label: 'Overlay × posterize', animated: false, inputs: 2 },
  differenceDuo: { label: 'Difference × mirror', animated: false, inputs: 2 },
  maskRadial: { label: 'Mask with vignette', animated: false, inputs: 2 },
  tripleLook: { label: 'Triple: sepia|edge|blur', animated: false, inputs: 3 },
  trail: { label: 'Delay trail', animated: true, inputs: 2 },
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
