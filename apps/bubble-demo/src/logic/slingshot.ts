import type { Vec2 } from '@playground/bubble-engine';

/** スリングの最大引き距離 (m) */
export const MAX_PULL = 2.8;

/** 離すときの速度スケール */
export const LAUNCH_POWER = 9;

/**
 * スリングアンカーからの引きベクトルから初速を計算する。
 * 離す方向（アンカー → 引いた点の反対）へ飛ばす。
 */
export function computeLaunchVelocity(anchor: Vec2, pullPoint: Vec2): Vec2 {
  const dx = pullPoint.x - anchor.x;
  const dy = pullPoint.y - anchor.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.05) return { x: 0, y: 0 };
  const clamped = Math.min(dist, MAX_PULL);
  const nx = dx / dist;
  const ny = dy / dist;
  return { x: -nx * clamped * LAUNCH_POWER, y: -ny * clamped * LAUNCH_POWER };
}

/** 引き点を最大距離内かつスリング後方（左方向）にクランプ */
export function clampPullPoint(anchor: Vec2, point: Vec2): Vec2 {
  let dx = point.x - anchor.x;
  let dy = point.y - anchor.y;
  // ターゲットは右側。アンカーより右へ引っ張る操作は無効化
  if (dx > 0.05) dx = 0.05;
  const dist = Math.hypot(dx, dy);
  if (dist <= MAX_PULL) return { x: anchor.x + dx, y: anchor.y + dy };
  const s = MAX_PULL / dist;
  return { x: anchor.x + dx * s, y: anchor.y + dy * s };
}

/** 速度の大きさから接触ダメージを算出 */
export function contactDamage(speed: number): number {
  if (speed < 1.5) return 0;
  if (speed < 4) return 1;
  return 2;
}

/** ほぼ静止しているか */
export function isBirdAtRest(linearSpeed: number, _angularSpeed = 0, threshold = 0.45): boolean {
  return linearSpeed < threshold;
}
