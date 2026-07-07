import { CarWorld, type Transform } from '../game/CarWorld';
import type { Coin, Point } from '../types';

export interface RenderState {
  terrain: Point[];
  coins: Coin[];
  chassis: Transform;
  wheels: Transform[];
}

const PIXELS_PER_METER = 34;
const CAMERA_LOOKAHEAD = 4;

// テーマトークンに寄せた配色
const COLORS = {
  skyTop: '#12121a',
  skyBottom: '#242432',
  groundFill: '#2c2c40',
  groundLine: '#6c7cff',
  chassis: '#6c7cff',
  chassisStroke: '#8a97ff',
  wheel: '#1c1c28',
  wheelRim: '#e8e8f0',
  wheelSpoke: '#9a9ab0',
  coin: '#f4c95d',
  coinStroke: '#b8862f',
};

/** ワールド座標(y 上向き)を Canvas に描くカメラ付きレンダラ */
export class Renderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private camX = 0;
  private camY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D コンテキストを取得できません');
    this.ctx = ctx;
    this.resize();
  }

  /** デバイスピクセル比を考慮してキャンバス解像度を合わせる */
  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private get viewW(): number {
    return this.canvas.clientWidth;
  }

  private get viewH(): number {
    return this.canvas.clientHeight;
  }

  private toScreenX(x: number): number {
    return (x - this.camX) * PIXELS_PER_METER + this.viewW / 2;
  }

  private toScreenY(y: number): number {
    return this.viewH / 2 - (y - this.camY) * PIXELS_PER_METER;
  }

  private updateCamera(chassis: Transform): void {
    // 進行方向を少し先読みしつつ滑らかに追従する
    const targetX = chassis.x + CAMERA_LOOKAHEAD;
    const targetY = chassis.y + 1.5;
    this.camX += (targetX - this.camX) * 0.12;
    this.camY += (targetY - this.camY) * 0.08;
  }

  render(state: RenderState): void {
    this.updateCamera(state.chassis);
    this.drawSky();
    this.drawTerrain(state.terrain);
    this.drawCoins(state.coins);
    this.drawCar(state.chassis, state.wheels);
  }

  private drawSky(): void {
    const { ctx } = this;
    const g = ctx.createLinearGradient(0, 0, 0, this.viewH);
    g.addColorStop(0, COLORS.skyTop);
    g.addColorStop(1, COLORS.skyBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.viewW, this.viewH);
  }

  private drawTerrain(terrain: Point[]): void {
    const { ctx } = this;
    // 画面に入る範囲だけ描く
    const leftX = this.camX - this.viewW / 2 / PIXELS_PER_METER - 2;
    const rightX = this.camX + this.viewW / 2 / PIXELS_PER_METER + 2;

    ctx.beginPath();
    let started = false;
    for (const p of terrain) {
      if (p.x < leftX || p.x > rightX) {
        if (started && p.x > rightX) {
          ctx.lineTo(this.toScreenX(p.x), this.toScreenY(p.y));
          break;
        }
        if (p.x < leftX) continue;
      }
      const sx = this.toScreenX(p.x);
      const sy = this.toScreenY(p.y);
      if (!started) {
        ctx.moveTo(sx, sy);
        started = true;
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    if (!started) return;

    // 地表ラインを描いてから下方向を塗りつぶす
    ctx.lineTo(this.viewW + 50, this.viewH + 50);
    ctx.lineTo(-50, this.viewH + 50);
    ctx.closePath();
    ctx.fillStyle = COLORS.groundFill;
    ctx.fill();

    // 表面の強調ライン
    ctx.beginPath();
    started = false;
    for (const p of terrain) {
      if (p.x < leftX - 4 || p.x > rightX + 4) continue;
      const sx = this.toScreenX(p.x);
      const sy = this.toScreenY(p.y);
      if (!started) {
        ctx.moveTo(sx, sy);
        started = true;
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.strokeStyle = COLORS.groundLine;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  private drawCoins(coins: Coin[]): void {
    const { ctx } = this;
    const r = 0.32 * PIXELS_PER_METER;
    for (const coin of coins) {
      if (coin.taken) continue;
      const sx = this.toScreenX(coin.x);
      const sy = this.toScreenY(coin.y);
      if (sx < -40 || sx > this.viewW + 40) continue;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.coin;
      ctx.fill();
      ctx.strokeStyle = COLORS.coinStroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  private drawCar(chassis: Transform, wheels: Transform[]): void {
    const { ctx } = this;
    const d = CarWorld.dimensions;

    for (const w of wheels) {
      const sx = this.toScreenX(w.x);
      const sy = this.toScreenY(w.y);
      const r = d.WHEEL_RADIUS * PIXELS_PER_METER;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(-w.angle);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.wheel;
      ctx.fill();
      ctx.strokeStyle = COLORS.wheelRim;
      ctx.lineWidth = 4;
      ctx.stroke();
      // 回転が分かるスポーク
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r * 0.85, 0);
      ctx.strokeStyle = COLORS.wheelSpoke;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    const sx = this.toScreenX(chassis.x);
    const sy = this.toScreenY(chassis.y);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(-chassis.angle);
    const hw = d.CHASSIS_HALF_W * PIXELS_PER_METER;
    const hh = d.CHASSIS_HALF_H * PIXELS_PER_METER;
    const roof = (d.CHASSIS_HALF_H + 0.28) * PIXELS_PER_METER;
    ctx.beginPath();
    ctx.moveTo(-hw, hh);
    ctx.lineTo(hw, hh);
    ctx.lineTo(hw, -hh);
    ctx.lineTo(0, -roof);
    ctx.lineTo(-hw, -hh);
    ctx.closePath();
    ctx.fillStyle = COLORS.chassis;
    ctx.fill();
    ctx.strokeStyle = COLORS.chassisStroke;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }
}
