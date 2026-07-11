import type { Entity, PointerInput, SceneContext, World } from '@playground/bubble-engine';
import {
  CameraState,
  ContactBegin,
  PhysicsWorld,
  RenderShape,
  screenToWorld,
  SystemPhase,
  Transform,
  Viewport,
  defineSystem,
  isOutsideView,
} from '@playground/bubble-engine';
import { addDestroyScore, bestScore, evaluateOutcome } from '../logic/score';
import { clampPullPoint, computeLaunchVelocity, contactDamage } from '../logic/slingshot';
import { tickTurnState } from '../logic/turnFlow';
import { ROUTE_RESULT } from '../game/routes';
import { Destructible, GameState, LevelState } from '../game/types';

export class LevelController {
  private dragging = false;
  private contactOff: (() => void) | null = null;

  constructor(private readonly ctx: SceneContext) {
    this.registerLevelSystems();
    this.contactOff = ctx.world.events.on(ContactBegin, ({ entityA, entityB }) => {
      this.onContact(entityA, entityB);
    });
  }

  dispose(): void {
    this.contactOff?.();
    this.contactOff = null;
  }

  update(dt: number): void {
    const world = this.ctx.world;
    if (!world.hasResource(LevelState)) return;
    const level = world.resource(LevelState);

    if (level.phase === 'ended') return;

    if (level.phase !== 'flying' && level.phase !== 'watching') {
      this.updateBand();
      return;
    }

    const adapter = world.resource(PhysicsWorld);
    const vel = adapter.getLinearVelocity(level.bird);
    const speed = Math.hypot(vel.x, vel.y);
    const birdT = world.get(level.bird, Transform);
    const offScreen =
      level.phase === 'flying' && birdT
        ? isOutsideView(birdT.position, world.resource(CameraState), world.resource(Viewport))
        : false;

    const result = tickTurnState({
      phase: level.phase,
      dt,
      linearSpeed: speed,
      angularSpeed: adapter.getAngularVelocity(level.bird),
      isAwake: adapter.isAwake(level.bird),
      restTimer: level.restTimer,
      flightTimer: level.flightTimer,
      settleTimer: level.settleTimer,
      offScreen,
    });

    level.phase = result.phase;
    level.restTimer = result.restTimer;
    level.flightTimer = result.flightTimer;
    level.settleTimer = result.settleTimer;

    if (result.shouldFreezeBird) freezeBird(world, level.bird);
    if (result.turnEnded) this.onBirdTurnEnd();

    this.updateBand();
  }

  onPointer(input: PointerInput): boolean {
    const world = this.ctx.world;
    if (!world.hasResource(LevelState)) return false;
    if (world.resource(LevelState).phase === 'ended') return false;
    if (input.type === 'down') return this.onPointerDown(input.screenX, input.screenY);
    if (input.type === 'move') return this.onPointerMove(input.screenX, input.screenY);
    if (input.type === 'up') return this.onPointerUp();
    return false;
  }

  private registerLevelSystems(): void {
    this.ctx.registerSystem(
      defineSystem({
        name: 'Level.SlingshotHold',
        phase: SystemPhase.PreFixed,
        order: -100,
        run: (world) => {
          if (!world.hasResource(LevelState)) return;
          const level = world.resource(LevelState);
          if (level.phase !== 'aiming') return;
          const t = world.get(level.bird, Transform);
          if (!t) return;
          const adapter = world.resource(PhysicsWorld);
          adapter.syncBody(level.bird);
          adapter.setBodyType(level.bird, 'kinematic');
          adapter.setTransform(level.bird, t);
          adapter.setLinearVelocity(level.bird, { x: 0, y: 0 });
          adapter.setAngularVelocity(level.bird, 0);
        },
      }),
    );

    this.ctx.registerSystem(
      defineSystem({
        name: 'Level.StructureSleep',
        phase: SystemPhase.PreFixed,
        order: -90,
        run: (world) => {
          if (!world.hasResource(LevelState)) return;
          const level = world.resource(LevelState);
          if (level.structuresAwake) return;
          const adapter = world.resource(PhysicsWorld);
          for (const e of [...level.blocks, ...level.pigs]) {
            adapter.syncBody(e);
            adapter.setAwake(e, false);
          }
        },
      }),
    );
  }

  private onPointerDown(sx: number, sy: number): boolean {
    const world = this.ctx.world;
    if (!world.hasResource(LevelState)) return false;
    const level = world.resource(LevelState);
    if (level.phase !== 'aiming') return false;

    const p = this.worldFromScreen(sx, sy);
    const birdT = world.get(level.bird, Transform)!;
    if (Math.hypot(p.x - birdT.position.x, p.y - birdT.position.y) > 1.5) return false;

    this.dragging = true;
    this.onPointerMove(sx, sy);
    return true;
  }

  private onPointerMove(sx: number, sy: number): boolean {
    if (!this.dragging) return false;
    const world = this.ctx.world;
    if (!world.hasResource(LevelState)) return false;
    const level = world.resource(LevelState);

    const pull = clampPullPoint(level.slingshot, this.worldFromScreen(sx, sy));
    const t = world.get(level.bird, Transform)!;
    t.position = pull;
    syncBirdTransform(world, level.bird, t);
    return true;
  }

  private onPointerUp(): boolean {
    if (!this.dragging) return false;
    this.dragging = false;

    const world = this.ctx.world;
    if (!world.hasResource(LevelState)) return false;
    const level = world.resource(LevelState);
    if (level.phase !== 'aiming') return false;

    const t = world.get(level.bird, Transform)!;
    const impulse = computeLaunchVelocity(level.slingshot, t.position);
    if (Math.hypot(impulse.x, impulse.y) < 0.5) {
      resetBirdAtSlingshot(world, level.bird, level.slingshot);
      return true;
    }

    const adapter = world.resource(PhysicsWorld);
    this.wakeStructures();
    adapter.setBodyType(level.bird, 'dynamic');
    adapter.setFixedRotation(level.bird, true);
    adapter.wakeUp(level.bird);
    adapter.applyLinearImpulse(level.bird, impulse);
    level.phase = 'flying';
    level.settleTimer = 0;
    level.restTimer = 0;
    level.flightTimer = 0;
    return true;
  }

  private onBirdTurnEnd(): void {
    const world = this.ctx.world;
    const level = world.resource(LevelState);
    const gs = world.resource(GameState);

    level.birdsLeft -= 1;
    gs.birdsLeft = level.birdsLeft;

    const outcome = evaluateOutcome(gs.pigsLeft, level.birdsLeft, false);
    if (outcome !== 'playing') {
      this.showResult(outcome === 'win');
      return;
    }

    level.phase = 'aiming';
    level.settleTimer = 0;
    level.restTimer = 0;
    level.flightTimer = 0;
    resetBirdAtSlingshot(world, level.bird, level.slingshot);
  }

  private onContact(a: Entity, b: Entity): void {
    const world = this.ctx.world;
    if (!world.hasResource(LevelState)) return;
    const level = world.resource(LevelState);
    if (level.phase === 'ended') return;
    const adapter = world.resource(PhysicsWorld);

    const bird = level.bird;
    const other = a === bird ? b : b === bird ? a : null;
    if (other === null) return;

    const vel = adapter.getLinearVelocity(bird);
    const dmg = contactDamage(Math.hypot(vel.x, vel.y));
    if (dmg <= 0) return;

    const dest = world.get(other, Destructible);
    if (!dest || dest.hp <= 0) return;

    dest.hp -= dmg;
    if (dest.hp > 0) return;

    world.despawn(other);
    level.pigs = level.pigs.filter((e) => e !== other);
    level.blocks = level.blocks.filter((e) => e !== other);

    const gs = world.resource(GameState);
    gs.score = addDestroyScore(gs.score, dest.kind);
    if (dest.kind === 'pig') gs.pigsLeft = level.pigs.length;

    if (evaluateOutcome(gs.pigsLeft, level.birdsLeft, level.phase === 'flying') === 'win') {
      this.showResult(true);
    }
  }

  private showResult(win: boolean): void {
    const world = this.ctx.world;
    // レベル進行を停止（リザルト再マウント連打・birds 減少の防止）
    if (world.hasResource(LevelState)) {
      world.resource(LevelState).phase = 'ended';
    }
    const gs = world.resource(GameState);
    gs.headline = win ? 'CLEAR!' : 'GAME OVER';
    gs.subline = win ? 'すべての豚を倒した！' : '鳥が足りなかった…';
    gs.bestScore = bestScore(gs.bestScore, gs.score);
    this.ctx.navigate(ROUTE_RESULT);
  }

  private updateBand(): void {
    const world = this.ctx.world;
    if (!world.hasResource(LevelState)) return;
    const state = world.resource(LevelState);
    const birdT = world.get(state.bird, Transform);
    if (!birdT) return;

    const show = state.phase === 'aiming';
    for (const bandEntity of [state.bandLeft, state.bandRight]) {
      const shape = world.get(bandEntity, RenderShape);
      if (!shape || shape.kind !== 'line') continue;
      shape.hidden = !show;
      if (!show) continue;
      const isLeft = bandEntity === state.bandLeft;
      shape.a = { ...(isLeft ? state.forkLeft : state.forkRight) };
      shape.b = { ...birdT.position };
    }
  }

  private wakeStructures(): void {
    const world = this.ctx.world;
    const level = world.resource(LevelState);
    if (level.structuresAwake) return;
    const adapter = world.resource(PhysicsWorld);
    for (const e of [...level.blocks, ...level.pigs]) {
      adapter.syncBody(e);
      adapter.setAwake(e, true);
    }
    level.structuresAwake = true;
  }

  private worldFromScreen(sx: number, sy: number): { x: number; y: number } {
    const world = this.ctx.world;
    return screenToWorld({ x: sx, y: sy }, world.resource(CameraState), world.resource(Viewport));
  }
}

function syncBirdTransform(
  world: World,
  bird: Entity,
  t: { position: { x: number; y: number }; angle: number },
  kinematic = true,
): void {
  const adapter = world.resource(PhysicsWorld);
  adapter.syncBody(bird);
  if (kinematic) adapter.setBodyType(bird, 'kinematic');
  adapter.setTransform(bird, t);
  adapter.setLinearVelocity(bird, { x: 0, y: 0 });
  adapter.setAngularVelocity(bird, 0);
  adapter.setDamping(bird, 0, 0);
}

function freezeBird(world: World, bird: Entity): void {
  const adapter = world.resource(PhysicsWorld);
  adapter.setLinearVelocity(bird, { x: 0, y: 0 });
  adapter.setAngularVelocity(bird, 0);
  adapter.setAwake(bird, false);
}

function resetBirdAtSlingshot(world: World, bird: Entity, slingshot: { x: number; y: number }): void {
  const t = world.get(bird, Transform)!;
  t.position = { ...slingshot };
  t.angle = 0;
  syncBirdTransform(world, bird, t, true);
}
