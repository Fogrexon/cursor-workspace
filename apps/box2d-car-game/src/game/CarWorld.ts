import { Circle, Edge, Polygon, Vec2, WheelJoint, World, type Body } from 'planck';
import type { DriveInput, Point } from '../types';

/** 剛体の位置と角度(描画用) */
export interface Transform {
  x: number;
  y: number;
  angle: number;
}

const GRAVITY = -10;

// 車体の寸法 (m)
const CHASSIS_HALF_W = 1.1;
const CHASSIS_HALF_H = 0.32;
const WHEEL_RADIUS = 0.42;
const WHEEL_OFFSET_X = 0.85;
const WHEEL_OFFSET_Y = -0.35;

// 駆動パラメータ
const MAX_MOTOR_SPEED = 22; // rad/s
const MAX_MOTOR_TORQUE = 42; // N-m
const AIR_TORQUE = 9; // 空中での姿勢制御トルク

/**
 * planck (Box2D の JavaScript 移植) を使った車の物理ワールド。
 * 状態を持つシミュレーションのため logic ではなく game 層に置く。
 * 地形やスコアなどの純粋計算は logic/ 側でテストしている。
 */
export class CarWorld {
  readonly world: World;
  private readonly chassis: Body;
  private readonly rearWheel: Body;
  private readonly frontWheel: Body;
  private readonly rearJoint: WheelJoint;
  private readonly frontJoint: WheelJoint;
  readonly startX: number;

  constructor(terrain: Point[], startX: number) {
    this.startX = startX;
    this.world = new World({ gravity: new Vec2(0, GRAVITY) });

    this.createGround(terrain);

    const startY = 3;
    this.chassis = this.createChassis(startX, startY);
    this.rearWheel = this.createWheel(startX - WHEEL_OFFSET_X, startY + WHEEL_OFFSET_Y);
    this.frontWheel = this.createWheel(startX + WHEEL_OFFSET_X, startY + WHEEL_OFFSET_Y);

    this.rearJoint = this.attachWheel(this.rearWheel);
    this.frontJoint = this.attachWheel(this.frontWheel);
  }

  private createGround(terrain: Point[]): void {
    const ground = this.world.createBody();
    for (let i = 0; i < terrain.length - 1; i++) {
      const a = terrain[i];
      const b = terrain[i + 1];
      ground.createFixture(new Edge(new Vec2(a.x, a.y), new Vec2(b.x, b.y)), {
        friction: 0.9,
        density: 0,
      });
    }
  }

  private createChassis(x: number, y: number): Body {
    const body = this.world.createDynamicBody(new Vec2(x, y));
    // ややくさび形にして転がりを自然にする
    body.createFixture(
      new Polygon([
        new Vec2(-CHASSIS_HALF_W, -CHASSIS_HALF_H),
        new Vec2(CHASSIS_HALF_W, -CHASSIS_HALF_H),
        new Vec2(CHASSIS_HALF_W, CHASSIS_HALF_H),
        new Vec2(0, CHASSIS_HALF_H + 0.28),
        new Vec2(-CHASSIS_HALF_W, CHASSIS_HALF_H),
      ]),
      { density: 1, friction: 0.3 },
    );
    return body;
  }

  private createWheel(x: number, y: number): Body {
    const body = this.world.createDynamicBody(new Vec2(x, y));
    body.createFixture(new Circle(WHEEL_RADIUS), {
      density: 1,
      friction: 2.2,
      restitution: 0.05,
    });
    return body;
  }

  private attachWheel(wheel: Body): WheelJoint {
    const joint = new WheelJoint(
      {
        motorSpeed: 0,
        maxMotorTorque: MAX_MOTOR_TORQUE,
        enableMotor: true,
        frequencyHz: 4.5,
        dampingRatio: 0.7,
      },
      this.chassis,
      wheel,
      wheel.getPosition(),
      new Vec2(0, 1),
    );
    return this.world.createJoint(joint) as WheelJoint;
  }

  /** 入力に応じてモーターを駆動し、1 ステップ進める */
  step(dt: number, input: DriveInput): void {
    let motor = 0;
    if (input.throttle) motor = -MAX_MOTOR_SPEED;
    else if (input.brake) motor = MAX_MOTOR_SPEED;

    this.rearJoint.setMotorSpeed(motor);
    this.frontJoint.setMotorSpeed(motor);

    // 空中では車体にトルクを与えて前後回転(フリップ)を制御できるようにする
    if (!this.isGrounded()) {
      if (input.throttle) this.chassis.applyTorque(AIR_TORQUE, true);
      else if (input.brake) this.chassis.applyTorque(-AIR_TORQUE, true);
    }

    this.world.step(dt, 8, 3);
  }

  /** 車輪が地面付近にあるか(簡易接地判定) */
  private isGrounded(): boolean {
    for (let c = this.world.getContactList(); c; c = c.getNext()) {
      if (c.isTouching()) {
        const a = c.getFixtureA().getBody();
        const b = c.getFixtureB().getBody();
        if (a === this.rearWheel || b === this.rearWheel) return true;
        if (a === this.frontWheel || b === this.frontWheel) return true;
      }
    }
    return false;
  }

  getChassisTransform(): Transform {
    const p = this.chassis.getPosition();
    return { x: p.x, y: p.y, angle: this.chassis.getAngle() };
  }

  getWheelTransforms(): Transform[] {
    return [this.rearWheel, this.frontWheel].map((w) => {
      const p = w.getPosition();
      return { x: p.x, y: p.y, angle: w.getAngle() };
    });
  }

  /** 進行方向の速度 (m/s) */
  getSpeed(): number {
    return this.chassis.getLinearVelocity().x;
  }

  /** 車体がほぼ裏返っている(ゲームオーバー判定用) */
  isFlipped(): boolean {
    const angle = this.chassis.getAngle();
    const normalized = Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));
    return normalized > Math.PI * 0.72;
  }

  static readonly dimensions = {
    CHASSIS_HALF_W,
    CHASSIS_HALF_H,
    WHEEL_RADIUS,
    WHEEL_OFFSET_X,
    WHEEL_OFFSET_Y,
  };
}
