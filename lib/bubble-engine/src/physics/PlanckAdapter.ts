import planck, {
  Circle,
  Edge,
  Polygon,
  Vec2,
  World as PlanckWorld,
  type Body,
  type Contact,
} from 'planck';
import type { Entity } from '../ecs/Entity.ts';
import type { World } from '../ecs/World.ts';
import { Transform, type TransformData } from '../components/Transform.ts';
import { RigidBody, Collider, PhysicsLayer, type ColliderShape } from '../components/RigidBody.ts';
import type { Transform2D, Vec2 as BVec2 } from '../math/types.ts';
import { ContactBegin } from './events.ts';

export class PlanckPhysicsAdapter {
  private readonly bodies = new Map<Entity, Body>();
  private readonly entityByBody = new Map<Body, Entity>();
  private readonly pendingContacts: Array<{
    entityA: Entity;
    entityB: Entity;
    point: BVec2;
  }> = [];
  readonly planckWorld: PlanckWorld;

  constructor(private readonly world: World) {
    this.planckWorld = planck.World({ gravity: Vec2(0, -10) });
    this.planckWorld.on('begin-contact', (contact: Contact) => {
      this.onBeginContact(contact);
    });
  }

  setGravity(g: BVec2): void {
    this.planckWorld.setGravity(Vec2(g.x, g.y));
  }

  step(dt: number): void {
    this.planckWorld.step(dt, 8, 3);
  }

  syncBody(entity: Entity): void {
    if (this.bodies.has(entity)) return;
    const transform = this.world.get(entity, Transform);
    const bodyDef = this.world.get(entity, RigidBody);
    const collider = this.world.get(entity, Collider);
    if (!transform || !bodyDef || !collider) return;

    const type =
      bodyDef.type === 'static'
        ? 'static'
        : bodyDef.type === 'kinematic'
          ? 'kinematic'
          : 'dynamic';
    const body = this.planckWorld.createBody({
      type,
      position: Vec2(transform.position.x, transform.position.y),
      angle: transform.angle,
      fixedRotation: bodyDef.fixedRotation ?? false,
    });

    const category = collider.category ?? PhysicsLayer.Default;
    const mask = collider.mask ?? PhysicsLayer.All;

    for (const shape of collider.shapes) {
      this.addShape(body, shape, category, mask);
    }
    this.bodies.set(entity, body);
    this.entityByBody.set(body, entity);
  }

  private onBeginContact(contact: Contact): void {
    const bodyA = contact.getFixtureA().getBody();
    const bodyB = contact.getFixtureB().getBody();
    const entityA = this.entityByBody.get(bodyA);
    const entityB = this.entityByBody.get(bodyB);
    if (entityA === undefined || entityB === undefined) return;
    const posA = bodyA.getPosition();
    const posB = bodyB.getPosition();
    this.pendingContacts.push({
      entityA,
      entityB,
      point: { x: (posA.x + posB.x) / 2, y: (posA.y + posB.y) / 2 },
    });
  }

  drainContactEvents(world: World): void {
    for (const payload of this.pendingContacts) {
      world.events.emit(ContactBegin, payload);
    }
    this.pendingContacts.length = 0;
  }

  setTransform(entity: Entity, transform: TransformData): void {
    const body = this.bodies.get(entity);
    if (!body) return;
    body.setTransform(Vec2(transform.position.x, transform.position.y), transform.angle);
  }

  private addShape(body: Body, shape: ColliderShape, category: number, mask: number): void {
    const filter = { categoryBits: category, maskBits: mask };
    if (shape.type === 'circle') {
      body.createFixture(Circle(shape.radius, Vec2(shape.offset?.x ?? 0, shape.offset?.y ?? 0)), {
        density: shape.density ?? 1,
        friction: shape.friction ?? 0.3,
        restitution: shape.restitution ?? 0,
        filterCategoryBits: filter.categoryBits,
        filterMaskBits: filter.maskBits,
      });
    } else if (shape.type === 'polygon') {
      const verts = shape.vertices.map((v) => Vec2(v.x, v.y));
      body.createFixture(Polygon(verts), {
        density: shape.density ?? 1,
        friction: shape.friction ?? 0.4,
        restitution: shape.restitution ?? 0.05,
        filterCategoryBits: filter.categoryBits,
        filterMaskBits: filter.maskBits,
      });
    } else if (shape.type === 'edgeChain') {
      for (let i = 0; i < shape.points.length - 1; i++) {
        const a = shape.points[i]!;
        const b = shape.points[i + 1]!;
        body.createFixture(Edge(Vec2(a.x, a.y), Vec2(b.x, b.y)), {
          friction: shape.friction ?? 0.9,
          filterCategoryBits: filter.categoryBits,
          filterMaskBits: filter.maskBits,
        });
      }
    }
  }

  getTransform(entity: Entity): Transform2D {
    const body = this.bodies.get(entity);
    if (!body) throw new Error(`No physics body for entity ${entity}`);
    const p = body.getPosition();
    return { position: { x: p.x, y: p.y }, angle: body.getAngle() };
  }

  syncTransformFromBody(entity: Entity): void {
    const t = this.world.get(entity, Transform);
    const body = this.bodies.get(entity);
    if (!t || !body) return;
    const p = body.getPosition();
    t.position.x = p.x;
    t.position.y = p.y;
    t.angle = body.getAngle();
  }

  getLinearVelocity(entity: Entity): BVec2 {
    const body = this.bodies.get(entity);
    if (!body) return { x: 0, y: 0 };
    const v = body.getLinearVelocity();
    return { x: v.x, y: v.y };
  }

  getAngularVelocity(entity: Entity): number {
    return this.bodies.get(entity)?.getAngularVelocity() ?? 0;
  }

  isAwake(entity: Entity): boolean {
    return this.bodies.get(entity)?.isAwake() ?? false;
  }

  setDamping(entity: Entity, linear: number, angular: number): void {
    const body = this.bodies.get(entity);
    if (!body) return;
    body.setLinearDamping(linear);
    body.setAngularDamping(angular);
  }

  setLinearVelocity(entity: Entity, velocity: BVec2): void {
    const body = this.bodies.get(entity);
    if (!body) return;
    body.setLinearVelocity(Vec2(velocity.x, velocity.y));
  }

  applyLinearImpulse(entity: Entity, impulse: BVec2): void {
    const body = this.bodies.get(entity);
    if (!body) return;
    body.applyLinearImpulse(Vec2(impulse.x, impulse.y), body.getWorldCenter(), true);
  }

  wakeUp(entity: Entity): void {
    this.bodies.get(entity)?.setAwake(true);
  }

  setBodyType(entity: Entity, type: 'static' | 'dynamic' | 'kinematic'): void {
    const body = this.bodies.get(entity);
    if (!body) return;
    if (type === 'static') body.setStatic();
    else if (type === 'kinematic') body.setKinematic();
    else body.setDynamic();
    const rb = this.world.get(entity, RigidBody);
    if (rb) {
      rb.type = type;
      body.setFixedRotation(rb.fixedRotation ?? false);
    }
  }

  setFixedRotation(entity: Entity, fixed: boolean): void {
    const body = this.bodies.get(entity);
    const rb = this.world.get(entity, RigidBody);
    if (!body || !rb) return;
    rb.fixedRotation = fixed;
    body.setFixedRotation(fixed);
  }

  setAngularVelocity(entity: Entity, omega: number): void {
    this.bodies.get(entity)?.setAngularVelocity(omega);
  }

  setAwake(entity: Entity, awake: boolean): void {
    this.bodies.get(entity)?.setAwake(awake);
  }

  destroyBody(entity: Entity): void {
    const body = this.bodies.get(entity);
    if (body) {
      this.planckWorld.destroyBody(body);
      this.bodies.delete(entity);
      this.entityByBody.delete(body);
    }
  }
}
