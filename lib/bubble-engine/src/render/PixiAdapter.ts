import { Application, Container, Graphics, Text, Rectangle } from 'pixi.js';
import type { Entity } from '../ecs/Entity.ts';
import type { DrawStyle, GameRenderBackend } from './types.ts';
import type { RgbaColor, Vec2 } from '../math/types.ts';
import type { UiRenderBackend } from './uiTypes.ts';
import { worldToScreen } from './camera.ts';

function rgba(c?: RgbaColor): number {
  if (!c) return 0xffffff;
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  return (r << 16) | (g << 8) | b;
}

const UI_FONT_FAMILY =
  '"Segoe UI", "Hiragino Sans", "Yu Gothic UI", "Meiryo", "Noto Sans JP", sans-serif';

export class PixiGameRenderer implements GameRenderBackend {
  private readonly gfx: Graphics;
  private camera = { position: { x: 0, y: 0 }, zoom: 34 };
  private view = { width: 800, height: 600 };

  constructor(private readonly worldRoot: Container) {
    this.gfx = new Graphics();
    this.worldRoot.addChild(this.gfx);
  }

  resize(width: number, height: number): void {
    this.view = { width, height };
  }

  setCamera(cam: { position: Vec2; zoom: number }): void {
    this.camera = { position: { ...cam.position }, zoom: cam.zoom };
  }

  clearWorld(): void {
    this.gfx.clear();
  }

  private toScreen(world: Vec2): Vec2 {
    return worldToScreen(world, this.camera, this.view);
  }

  drawCircle(worldPos: Vec2, radius: number, style: DrawStyle): void {
    const s = this.toScreen(worldPos);
    const r = radius * this.camera.zoom;
    if (style.fill) {
      this.gfx.circle(s.x, s.y, r).fill({ color: rgba(style.fill), alpha: style.fill.a ?? 1 });
    }
    if (style.stroke) {
      this.gfx
        .circle(s.x, s.y, r)
        .stroke({ color: rgba(style.stroke), width: style.lineWidth ?? 1 });
    }
  }

  drawPolygon(worldPos: Vec2, angle: number, localVerts: Vec2[], style: DrawStyle): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const points = localVerts.flatMap((v) => {
      const rx = v.x * c - v.y * s;
      const ry = v.x * s + v.y * c;
      const p = this.toScreen({ x: worldPos.x + rx, y: worldPos.y + ry });
      return [p.x, p.y];
    });
    if (style.fill) {
      this.gfx.poly(points).fill({ color: rgba(style.fill), alpha: style.fill.a ?? 1 });
    }
    if (style.stroke) {
      this.gfx.poly(points).stroke({ color: rgba(style.stroke), width: style.lineWidth ?? 1 });
    }
  }

  drawEllipse(
    worldPos: Vec2,
    radiusX: number,
    radiusY: number,
    angle: number,
    style: DrawStyle,
  ): void {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const segments = 24;
    const points: number[] = [];
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const lx = Math.cos(t) * radiusX;
      const ly = Math.sin(t) * radiusY;
      const wx = worldPos.x + lx * c - ly * s;
      const wy = worldPos.y + lx * s + ly * c;
      const p = this.toScreen({ x: wx, y: wy });
      points.push(p.x, p.y);
    }
    if (style.fill) {
      this.gfx.poly(points).fill({ color: rgba(style.fill), alpha: style.fill.a ?? 1 });
    }
    if (style.stroke) {
      this.gfx.poly(points).stroke({ color: rgba(style.stroke), width: style.lineWidth ?? 1 });
    }
  }

  drawEdgeChain(points: Vec2[], style: DrawStyle): void {
    if (points.length < 2) return;
    const flat: number[] = [];
    for (const p of points) {
      const s = this.toScreen(p);
      flat.push(s.x, s.y);
    }
    this.gfx.poly(flat).stroke({ color: rgba(style.stroke), width: style.lineWidth ?? 2 });
  }

  drawLine(a: Vec2, b: Vec2, style: DrawStyle): void {
    const sa = this.toScreen(a);
    const sb = this.toScreen(b);
    this.gfx
      .moveTo(sa.x, sa.y)
      .lineTo(sb.x, sb.y)
      .stroke({ color: rgba(style.stroke), width: style.lineWidth ?? 1 });
  }
}

export class PixiUiRenderer implements UiRenderBackend {
  private readonly nodes = new Map<Entity, Container>();
  private actionClickHandler: ((entity: Entity, action: string) => void) | null = null;

  constructor(private readonly uiRoot: Container) {}

  setActionClickHandler(handler: (entity: Entity, action: string) => void): void {
    this.actionClickHandler = handler;
  }

  private ensure(entity: Entity): Container {
    let node = this.nodes.get(entity);
    if (!node) {
      node = new Container();
      this.uiRoot.addChild(node);
      this.nodes.set(entity, node);
    }
    return node;
  }

  syncText(
    entity: Entity,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color?: RgbaColor,
    fontFamily?: string,
    alpha?: number,
  ): void {
    const node = this.ensure(entity);
    // テキストはクリックを奪わない（下のボタンへ透過）
    node.eventMode = 'none';
    node.x = x;
    node.y = y;
    node.alpha = alpha ?? 1;
    let label = node.children.find((c) => c instanceof Text) as Text | undefined;
    const style = { fontSize, fill: rgba(color), fontFamily: fontFamily ?? UI_FONT_FAMILY };
    if (!label) {
      label = new Text({ text, style });
      label.anchor.set(0.5, 0.5);
      label.eventMode = 'none';
      node.addChild(label);
    } else {
      label.text = text;
      label.anchor.set(0.5, 0.5);
      label.eventMode = 'none';
      label.style.fontSize = fontSize;
      label.style.fill = rgba(color);
      label.style.fontFamily = fontFamily ?? UI_FONT_FAMILY;
    }
    // 毎フレーム末尾へ移動してパネルより前面に描画
    this.uiRoot.addChild(node);
  }

  syncPanel(
    entity: Entity,
    x: number,
    y: number,
    width: number,
    height: number,
    background?: RgbaColor,
    action?: string,
    alpha?: number,
  ): void {
    const node = this.ensure(entity);
    node.x = x;
    node.y = y;
    node.alpha = alpha ?? 1;
    let bg = node.children.find((c) => c instanceof Graphics) as Graphics | undefined;
    if (!bg) {
      bg = new Graphics();
      node.addChildAt(bg, 0);
    }
    bg.clear();
    bg.roundRect(0, 0, width, height, 6).fill({
      color: rgba(background ?? { r: 0.1, g: 0.1, b: 0.15, a: 0.85 }),
    });

    const nextAction = action ?? '';
    const prevAction = (node as Container & { __uiAction?: string }).__uiAction ?? '';
    node.hitArea = new Rectangle(0, 0, width, height);
    // パネルは常にヒット対象（ダイアログ背景でワールド入力をブロック）
    node.eventMode = 'static';

    if (action) {
      node.cursor = 'pointer';
      // 毎フレーム remove/add すると pointertap が途中で消えるので差分更新
      if (prevAction !== nextAction) {
        node.removeAllListeners('pointertap');
        node.on('pointertap', (e) => {
          e.stopPropagation();
          this.actionClickHandler?.(entity, action);
        });
        (node as Container & { __uiAction?: string }).__uiAction = nextAction;
      }
    } else {
      node.cursor = 'auto';
      if (prevAction !== '') {
        node.removeAllListeners('pointertap');
        (node as Container & { __uiAction?: string }).__uiAction = '';
      }
    }
  }

  getText(entity: Entity): string | undefined {
    const node = this.nodes.get(entity);
    const label = node?.children.find((c) => c instanceof Text) as Text | undefined;
    return label?.text as string | undefined;
  }

  getPosition(entity: Entity): { x: number; y: number } | undefined {
    const node = this.nodes.get(entity);
    if (!node) return undefined;
    return { x: node.x, y: node.y };
  }

  /** スクリーン座標が interactive パネル上か */
  hitTestInteractive(screenX: number, screenY: number): boolean {
    for (const node of this.nodes.values()) {
      if (node.eventMode !== 'static' || !node.hitArea) continue;
      const local = node.toLocal({ x: screenX, y: screenY });
      const area = node.hitArea as Rectangle;
      if (local.x >= area.x && local.x <= area.x + area.width && local.y >= area.y && local.y <= area.y + area.height) {
        return true;
      }
    }
    return false;
  }

  /** ECS から消えた Entity の Pixi ノードを除去 */
  pruneEntities(active: ReadonlySet<Entity>): void {
    for (const [entity, node] of this.nodes) {
      if (!active.has(entity)) {
        node.destroy({ children: true });
        this.nodes.delete(entity);
      }
    }
  }
}

export interface PixiAdapter {
  readonly app: Application;
  readonly worldRoot: Container;
  readonly uiRoot: Container;
  readonly gameRenderer: PixiGameRenderer;
  readonly uiRenderer: PixiUiRenderer;
  destroy(): void;
}

export async function createPixiAdapter(canvas: HTMLCanvasElement): Promise<PixiAdapter> {
  const app = new Application();
  await app.init({
    canvas,
    resizeTo: canvas.parentElement ?? canvas,
    background: '#12121a',
    antialias: true,
  });

  const worldRoot = new Container();
  const uiRoot = new Container();
  uiRoot.eventMode = 'static';
  app.stage.eventMode = 'static';
  app.stage.addChild(worldRoot);
  app.stage.addChild(uiRoot);

  const gameRenderer = new PixiGameRenderer(worldRoot);
  const uiRenderer = new PixiUiRenderer(uiRoot);
  gameRenderer.resize(app.screen.width, app.screen.height);

  return {
    app,
    worldRoot,
    uiRoot,
    gameRenderer,
    uiRenderer,
    destroy() {
      app.destroy(true);
    },
  };
}
