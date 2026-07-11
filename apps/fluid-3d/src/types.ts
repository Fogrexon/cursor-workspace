export type QualityId = 'low' | 'medium' | 'high';

export interface WaveParams {
  particleCount: number;
  gravity: number;
  /** SPH pressure stiffness */
  pressure: number;
  /** SPH viscosity */
  viscosity: number;
  /** Wall / floor normal restitution */
  bounce: number;
  /** Surface friction when contacting floor */
  friction: number;
}

export interface QualityPreset {
  id: QualityId;
  label: string;
  params: WaveParams;
}

export interface CameraState {
  yaw: number;
  pitch: number;
  distance: number;
  targetX: number;
  targetY: number;
  targetZ: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}
