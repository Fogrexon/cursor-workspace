import {
  ActiveCamera,
  Camera,
  Collider,
  PhysicsLayer,
  RenderShape,
  RigidBody,
  Transform,
  ellipseVerts,
  type PointerInput,
  type Scene,
  type SceneContext,
  type Vec2,
} from '@playground/bubble-engine';
import {
  BIRDS_PER_LEVEL,
  BIRD_RADIUS,
  Destructible,
  GameState,
  LevelState,
  SLINGSHOT,
  SLINGSHOT_FORK_LEFT,
  SLINGSHOT_FORK_RIGHT,
} from '../game/types';
import { LevelController } from '../level/LevelController';

const WOOD = { r: 0.72, g: 0.52, b: 0.28, a: 1 };
const WOOD_DARK = { r: 0.55, g: 0.38, b: 0.18, a: 1 };
const PIG = { r: 0.45, g: 0.82, b: 0.42, a: 1 };
const BIRD = { r: 0.95, g: 0.28, b: 0.22, a: 1 };
const GROUND = { r: 0.35, g: 0.55, b: 0.32, a: 1 };
const BAND = { r: 0.35, g: 0.22, b: 0.12, a: 1 };

const STACK_GAP = 0.05;

function boxVerts(hw: number, hh: number): Vec2[] {
  return [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];
}

function spawnBox(ctx: SceneContext, pos: Vec2, hw: number, hh: number, hp: number, fill = WOOD) {
  const verts = boxVerts(hw, hh);
  return ctx
    .spawn()
    .with(Transform, { position: pos, angle: 0 })
    .with(RigidBody, { type: 'dynamic', fixedRotation: false })
    .with(Collider, {
      shapes: [{ type: 'polygon', vertices: verts, density: 0.85, friction: 0.6, restitution: 0.01 }],
      category: PhysicsLayer.Default,
      mask: PhysicsLayer.All,
    })
    .with(RenderShape, { kind: 'polygon', vertices: verts, fill, stroke: WOOD_DARK, lineWidth: 1.5 })
    .with(Destructible, { kind: 'block', hp })
    .build();
}

function spawnPig(ctx: SceneContext, pos: Vec2) {
  return ctx
    .spawn()
    .with(Transform, { position: pos, angle: 0 })
    .with(RigidBody, { type: 'dynamic' })
    .with(Collider, {
      shapes: [{ type: 'circle', radius: 0.38, density: 0.5, restitution: 0.08, friction: 0.45 }],
      category: PhysicsLayer.Coin,
      mask: PhysicsLayer.All,
    })
    .with(RenderShape, {
      kind: 'circle',
      radius: 0.38,
      fill: PIG,
      stroke: { r: 0.2, g: 0.5, b: 0.2, a: 1 },
      lineWidth: 2,
    })
    .with(Destructible, { kind: 'pig', hp: 1 })
    .build();
}

function spawnBird(ctx: SceneContext, pos: Vec2) {
  const verts = ellipseVerts(BIRD_RADIUS.x, BIRD_RADIUS.y);
  return ctx
    .spawn()
    .with(Transform, { position: pos, angle: 0 })
    .with(RigidBody, { type: 'kinematic', fixedRotation: true })
    .with(Collider, {
      shapes: [
        {
          type: 'polygon',
          vertices: verts,
          density: 1.4,
          restitution: 0.2,
          friction: 0.55,
        },
      ],
      category: PhysicsLayer.Player,
      mask: PhysicsLayer.Terrain | PhysicsLayer.Default | PhysicsLayer.Coin,
    })
    .with(RenderShape, {
      kind: 'ellipse',
      radiusX: BIRD_RADIUS.x,
      radiusY: BIRD_RADIUS.y,
      fill: BIRD,
      stroke: { r: 1, g: 1, b: 1, a: 0.4 },
      lineWidth: 2,
    })
    .build();
}

function spawnBand(ctx: SceneContext) {
  return ctx
    .spawn()
    .with(Transform, { position: { x: 0, y: 0 }, angle: 0 })
    .with(RenderShape, {
      kind: 'line',
      a: SLINGSHOT_FORK_LEFT,
      b: SLINGSHOT,
      stroke: BAND,
      lineWidth: 3,
      hidden: false,
    })
    .build();
}

function rowCenterY(groundY: number, hh: number, layer: number): number {
  return groundY + hh + layer * (hh * 2 + STACK_GAP);
}

export class LevelScene implements Scene {
  readonly id = 'level';
  private controller: LevelController | null = null;

  setup(ctx: SceneContext): void {
    const groundY = -1.8;
    const hh = 0.34;
    const ground: Vec2[] = [
      { x: -12, y: groundY },
      { x: 28, y: groundY },
    ];

    ctx
      .spawn()
      .with(Transform, { position: { x: 0, y: 0 }, angle: 0 })
      .with(RigidBody, { type: 'static' })
      .with(Collider, {
        shapes: [{ type: 'edgeChain', points: ground, friction: 0.95 }],
        category: PhysicsLayer.Terrain,
        mask: PhysicsLayer.All,
      })
      .with(RenderShape, { kind: 'edgeChain', points: ground, stroke: GROUND, lineWidth: 4 })
      .build();

    // スリング台（見た目のみ・当たり判定なし）
    for (const dx of [-0.32, 0.32]) {
      const verts = boxVerts(0.1, 0.5);
      ctx
        .spawn()
        .with(Transform, { position: { x: SLINGSHOT.x + dx, y: SLINGSHOT.y - 0.42 }, angle: 0 })
        .with(RenderShape, { kind: 'polygon', vertices: verts, fill: WOOD_DARK })
        .build();
    }

    const y0 = rowCenterY(groundY, hh, 0);
    const y1 = rowCenterY(groundY, hh, 1);
    const y2 = rowCenterY(groundY, hh, 2);

    const blocks = [
      spawnBox(ctx, { x: 11.5, y: y0 }, 0.72, hh, 2),
      spawnBox(ctx, { x: 13.5, y: y0 }, 0.72, hh, 2),
      spawnBox(ctx, { x: 12.5, y: y1 }, 0.95, hh, 2),
      spawnBox(ctx, { x: 11.5, y: y2 }, 0.72, hh, 2),
      spawnBox(ctx, { x: 13.5, y: y2 }, 0.72, hh, 2),
      spawnBox(ctx, { x: 16.8, y: y0 }, 0.58, hh, 2),
      spawnBox(ctx, { x: 16.8, y: y1 }, 0.58, hh, 2),
    ];

    const pigR = 0.38;
    const pigs = [
      spawnPig(ctx, { x: 12.5, y: y1 + hh + pigR + 0.02 }),
      spawnPig(ctx, { x: 12.5, y: y2 + hh + pigR + 0.02 }),
      spawnPig(ctx, { x: 16.8, y: y1 + hh + pigR + 0.02 }),
    ];

    const bird = spawnBird(ctx, { ...SLINGSHOT });
    const bandLeft = spawnBand(ctx);
    const bandRight = ctx
      .spawn()
      .with(Transform, { position: { x: 0, y: 0 }, angle: 0 })
      .with(RenderShape, {
        kind: 'line',
        a: SLINGSHOT_FORK_RIGHT,
        b: SLINGSHOT,
        stroke: BAND,
        lineWidth: 3,
        hidden: false,
      })
      .build();

    const cam = ctx
      .spawn()
      .with(Camera, { zoom: 30, position: { x: 4, y: 1.2 }, offset: { x: 0, y: 0 } })
      .build();

    ctx.world.insertResource(ActiveCamera, cam);

    ctx.insertSceneResource(LevelState, {
      slingshot: { ...SLINGSHOT },
      forkLeft: { ...SLINGSHOT_FORK_LEFT },
      forkRight: { ...SLINGSHOT_FORK_RIGHT },
      bird,
      bandLeft,
      bandRight,
      phase: 'aiming',
      birdsLeft: BIRDS_PER_LEVEL,
      pigs: [...pigs],
      blocks: [...blocks],
      settleTimer: 0,
      restTimer: 0,
      flightTimer: 0,
      structuresAwake: false,
    });

    if (ctx.world.hasResource(GameState)) {
      const gs = ctx.world.resource(GameState);
      gs.birdsLeft = BIRDS_PER_LEVEL;
      gs.pigsLeft = pigs.length;
      gs.score = 0;
    }

    this.controller = new LevelController(ctx);
  }

  update(_ctx: SceneContext, dt: number): void {
    this.controller?.update(dt);
  }

  onPointer(_ctx: SceneContext, input: PointerInput): boolean {
    return this.controller?.onPointer(input) ?? false;
  }

  teardown(_ctx: SceneContext): void {
    this.controller?.dispose();
    this.controller = null;
  }
}
