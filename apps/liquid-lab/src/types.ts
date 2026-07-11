export type PresetId = 'dam-break' | 'drop' | 'cube';

export type ParticleBudget = {
  id: string;
  label: string;
  count: number;
};

export type SimControls = {
  particleCount: number;
  gravity: number;
  viscosity: number;
  stiffness: number;
  paused: boolean;
  preset: PresetId;
};
