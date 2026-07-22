export type Vec3 = { x: number; y: number; z: number };

export type FlightInput = {
  pitch: number;
  yaw: number;
  roll: number;
  throttle: number;
};

export type PlaneState = {
  position: Vec3;
  /** radians: heading around Y */
  yaw: number;
  /** radians: nose up/down */
  pitch: number;
  /** radians: bank */
  roll: number;
  /** m/s forward speed */
  speed: number;
};

export type TownPlacement = {
  asset: string;
  x: number;
  y: number;
  z: number;
  /** degrees around Y */
  rotY?: number;
  scale?: number;
};

export type Ring = {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  collected: boolean;
};

export type GamePhase = 'ready' | 'flying' | 'cleared';
